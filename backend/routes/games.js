const express = require('express');
const router = express.Router();
const Game = require('../models/Game');
const UserGame = require('../models/UserGame');
const SteamService = require('../services/SteamService');
const ScraperService = require('../services/ScraperService');

// Middleware to verify token (simplified version)
const authMiddleware = (req, res, next) => {
  // In a real implementation, this would verify the JWT token
  // For now, we'll just pass through
  next();
};

/**
 * @route   GET /api/games
 * @desc    Get all games with optional filtering
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20, search, genre, platform } = req.query;
    
    // Build filter object
    const filter = {};
    
    if (search) {
      filter.$text = { $search: search };
    }
    
    if (genre) {
      filter.genres = genre;
    }
    
    if (platform) {
      filter.platforms = platform;
    }
    
    // Get games with pagination
    const games = await Game.find(filter)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });
    
    // Get total count for pagination
    const total = await Game.countDocuments(filter);
    
    res.json({
      games,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route   GET /api/games/:id
 * @desc    Get game by ID
 * @access  Public
 */
router.get('/:id', async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }
    
    res.json(game);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route   POST /api/games
 * @desc    Create a new game
 * @access  Private
 */
router.post('/', authMiddleware, async (req, res) => {
  try {
    const game = new Game(req.body);
    await game.save();
    res.status(201).json(game);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @route   PUT /api/games/:id
 * @desc    Update a game
 * @access  Private
 */
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const game = await Game.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }
    
    res.json(game);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @route   DELETE /api/games/:id
 * @desc    Delete a game
 * @access  Private
 */
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const game = await Game.findByIdAndDelete(req.params.id);
    
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }
    
    // Also remove from user games
    await UserGame.deleteMany({ gameId: req.params.id });
    
    res.json({ message: 'Game removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route   GET /api/games/:id/achievements
 * @desc    Get achievements for a game
 * @access  Public
 */
router.get('/:id/achievements', async (req, res) => {
  try {
    // This would typically be in a separate achievements route file
    // For now, we'll include it here for simplicity
    const achievements = await Achievement.find({ gameId: req.params.id });
    res.json(achievements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route   POST /api/games/steam/import
 * @desc    Import games from Steam
 * @access  Private
 */
router.post('/steam/import', authMiddleware, async (req, res) => {
  try {
    const { steamId } = req.body;
    
    if (!steamId) {
      return res.status(400).json({ message: 'Steam ID is required' });
    }
    
    // Get user's games from Steam
    const steamGames = await SteamService.getUserOwnedGames(steamId);
    
    // Process and save games
    const importedGames = [];
    
    for (const steamGame of steamGames) {
      // Check if game already exists
      let game = await Game.findOne({ steamAppId: steamGame.appid });
      
      if (!game) {
        // Fetch detailed game info from Steam
        try {
          const gameDetails = await SteamService.getGameDetails(steamGame.appid);
          
          // Create new game
          game = new Game({
            title: gameDetails.name,
            description: gameDetails.short_description,
            steamAppId: steamGame.appid,
            platforms: ['PC'],
            coverImage: gameDetails.header_image,
            screenshots: gameDetails.screenshots ? 
              gameDetails.screenshots.map(s => s.path_full) : [],
            genres: gameDetails.genres ? 
              gameDetails.genres.map(g => g.description) : [],
            developer: gameDetails.developers ? gameDetails.developers[0] : '',
            publisher: gameDetails.publishers ? gameDetails.publishers[0] : ''
          });
          
          await game.save();
        } catch (detailError) {
          // If we can't get details, create a basic game entry
          game = new Game({
            title: steamGame.name,
            steamAppId: steamGame.appid,
            platforms: ['PC']
          });
          
          await game.save();
        }
      }
      
      importedGames.push(game);
    }
    
    res.json({ 
      message: `${importedGames.length} games imported successfully`,
      games: importedGames
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;