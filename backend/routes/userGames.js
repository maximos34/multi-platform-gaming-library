const express = require('express');
const router = express.Router();
const UserGame = require('../models/UserGame');
const Game = require('../models/Game');
const Achievement = require('../models/Achievement');

// Middleware to verify token (simplified version)
const authMiddleware = (req, res, next) => {
  // In a real implementation, this would verify the JWT token
  // For now, we'll just add a mock user ID
  req.user = { id: 'mock-user-id' };
  next();
};

/**
 * @route   GET /api/usergames
 * @desc    Get all user games with optional filtering
 * @access  Private
 */
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      status, 
      platform, 
      search,
      sortBy = 'lastPlayed',
      sortOrder = 'desc'
    } = req.query;
    
    // Build filter object
    const filter = { userId: req.user.id };
    
    if (status) {
      filter.status = status;
    }
    
    if (platform) {
      filter.platform = platform;
    }
    
    if (search) {
      // Find games that match the search term
      const games = await Game.find({
        $text: { $search: search }
      }).select('_id');
      
      const gameIds = games.map(game => game._id);
      filter.gameId = { $in: gameIds };
    }
    
    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
    
    // Get user games with pagination
    const userGames = await UserGame.find(filter)
      .populate('gameId')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort(sort);
    
    // Get total count for pagination
    const total = await UserGame.countDocuments(filter);
    
    res.json({
      userGames,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route   GET /api/usergames/:id
 * @desc    Get user game by ID
 * @access  Private
 */
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const userGame = await UserGame.findById(req.params.id)
      .populate('gameId')
      .populate('achievements.achievementId');
    
    if (!userGame) {
      return res.status(404).json({ message: 'User game not found' });
    }
    
    // Check if user owns this game entry
    if (userGame.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    res.json(userGame);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route   POST /api/usergames
 * @desc    Add a game to user's collection
 * @access  Private
 */
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { gameId, platform, status = 'playing', tags = [], categories = [] } = req.body;
    
    // Check if user already has this game
    const existingUserGame = await UserGame.findOne({
      userId: req.user.id,
      gameId
    });
    
    if (existingUserGame) {
      return res.status(400).json({ message: 'Game already in your collection' });
    }
    
    // Check if game exists
    const game = await Game.findById(gameId);
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }
    
    // Create user game entry
    const userGame = new UserGame({
      userId: req.user.id,
      gameId,
      platform,
      status,
      tags,
      categories,
      totalAchievements: await Achievement.countDocuments({ gameId })
    });
    
    await userGame.save();
    
    // Populate and return
    await userGame.populate('gameId');
    
    res.status(201).json(userGame);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @route   PUT /api/usergames/:id
 * @desc    Update user game
 * @access  Private
 */
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const userGame = await UserGame.findById(req.params.id);
    
    if (!userGame) {
      return res.status(404).json({ message: 'User game not found' });
    }
    
    // Check if user owns this game entry
    if (userGame.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    // Update fields
    const {
      status,
      playtime,
      lastPlayed,
      notes,
      rating,
      tags,
      categories
    } = req.body;
    
    if (status) userGame.status = status;
    if (playtime !== undefined) userGame.playtime = playtime;
    if (lastPlayed) userGame.lastPlayed = lastPlayed;
    if (notes !== undefined) userGame.notes = notes;
    if (rating) userGame.rating = rating;
    if (tags) userGame.tags = tags;
    if (categories) userGame.categories = categories;
    
    await userGame.save();
    
    // Populate and return
    await userGame.populate('gameId');
    
    res.json(userGame);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @route   DELETE /api/usergames/:id
 * @desc    Remove game from user's collection
 * @access  Private
 */
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const userGame = await UserGame.findById(req.params.id);
    
    if (!userGame) {
      return res.status(404).json({ message: 'User game not found' });
    }
    
    // Check if user owns this game entry
    if (userGame.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    await userGame.remove();
    
    res.json({ message: 'Game removed from your collection' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route   POST /api/usergames/:id/achievements/:achievementId
 * @desc    Unlock an achievement for a user game
 * @access  Private
 */
router.post('/:id/achievements/:achievementId', authMiddleware, async (req, res) => {
  try {
    const userGame = await UserGame.findById(req.params.id);
    
    if (!userGame) {
      return res.status(404).json({ message: 'User game not found' });
    }
    
    // Check if user owns this game entry
    if (userGame.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    // Check if achievement exists
    const achievement = await Achievement.findById(req.params.achievementId);
    if (!achievement) {
      return res.status(404).json({ message: 'Achievement not found' });
    }
    
    // Check if achievement is already unlocked
    const existingAchievement = userGame.achievements.find(
      a => a.achievementId.toString() === req.params.achievementId
    );
    
    if (existingAchievement && existingAchievement.unlocked) {
      return res.status(400).json({ message: 'Achievement already unlocked' });
    }
    
    if (existingAchievement) {
      // Update existing achievement
      existingAchievement.unlocked = true;
      existingAchievement.unlockDate = new Date();
    } else {
      // Add new achievement
      userGame.achievements.push({
        achievementId: req.params.achievementId,
        unlocked: true,
        unlockDate: new Date()
      });
    }
    
    // Update achievement counts
    userGame.unlockedAchievements = userGame.achievements.filter(a => a.unlocked).length;
    
    await userGame.save();
    
    res.json({ message: 'Achievement unlocked successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route   DELETE /api/usergames/:id/achievements/:achievementId
 * @desc    Lock an achievement for a user game
 * @access  Private
 */
router.delete('/:id/achievements/:achievementId', authMiddleware, async (req, res) => {
  try {
    const userGame = await UserGame.findById(req.params.id);
    
    if (!userGame) {
      return res.status(404).json({ message: 'User game not found' });
    }
    
    // Check if user owns this game entry
    if (userGame.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    // Find the achievement
    const achievementIndex = userGame.achievements.findIndex(
      a => a.achievementId.toString() === req.params.achievementId
    );
    
    if (achievementIndex === -1) {
      return res.status(404).json({ message: 'Achievement not found in user game' });
    }
    
    // Lock the achievement
    userGame.achievements[achievementIndex].unlocked = false;
    userGame.achievements[achievementIndex].unlockDate = null;
    
    // Update achievement counts
    userGame.unlockedAchievements = userGame.achievements.filter(a => a.unlocked).length;
    
    await userGame.save();
    
    res.json({ message: 'Achievement locked successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;