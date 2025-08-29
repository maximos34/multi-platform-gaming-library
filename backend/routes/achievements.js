const express = require('express');
const router = express.Router();
const Achievement = require('../models/Achievement');
const UserGame = require('../models/UserGame');
const SteamService = require('../services/SteamService');

// Middleware to verify token (simplified version)
const authMiddleware = (req, res, next) => {
  // In a real implementation, this would verify the JWT token
  // For now, we'll just pass through
  next();
};

/**
 * @route   GET /api/achievements
 * @desc    Get all achievements with optional filtering
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const { gameId, page = 1, limit = 50 } = req.query;
    
    // Build filter object
    const filter = {};
    
    if (gameId) {
      filter.gameId = gameId;
    }
    
    // Get achievements with pagination
    const achievements = await Achievement.find(filter)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });
    
    // Get total count for pagination
    const total = await Achievement.countDocuments(filter);
    
    res.json({
      achievements,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route   GET /api/achievements/:id
 * @desc    Get achievement by ID
 * @access  Public
 */
router.get('/:id', async (req, res) => {
  try {
    const achievement = await Achievement.findById(req.params.id);
    
    if (!achievement) {
      return res.status(404).json({ message: 'Achievement not found' });
    }
    
    res.json(achievement);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route   POST /api/achievements
 * @desc    Create a new achievement
 * @access  Private
 */
router.post('/', authMiddleware, async (req, res) => {
  try {
    const achievement = new Achievement(req.body);
    await achievement.save();
    res.status(201).json(achievement);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @route   PUT /api/achievements/:id
 * @desc    Update an achievement
 * @access  Private
 */
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const achievement = await Achievement.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!achievement) {
      return res.status(404).json({ message: 'Achievement not found' });
    }
    
    res.json(achievement);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @route   DELETE /api/achievements/:id
 * @desc    Delete an achievement
 * @access  Private
 */
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const achievement = await Achievement.findByIdAndDelete(req.params.id);
    
    if (!achievement) {
      return res.status(404).json({ message: 'Achievement not found' });
    }
    
    res.json({ message: 'Achievement removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route   POST /api/achievements/steam/import
 * @desc    Import achievements from Steam for a specific game
 * @access  Private
 */
router.post('/steam/import', authMiddleware, async (req, res) => {
  try {
    const { steamId, appId } = req.body;
    
    if (!steamId || !appId) {
      return res.status(400).json({ message: 'Steam ID and App ID are required' });
    }
    
    // Get user's achievements from Steam
    const steamAchievements = await SteamService.getUserAchievements(steamId, appId);
    
    // Process and save achievements
    const importedAchievements = [];
    
    for (const steamAchievement of steamAchievements) {
      // Check if achievement already exists
      let achievement = await Achievement.findOne({ 
        steamAchievementId: steamAchievement.apiname,
        gameId: appId
      });
      
      if (!achievement) {
        // Create new achievement
        achievement = new Achievement({
          name: steamAchievement.name,
          description: steamAchievement.description,
          gameId: appId,
          steamAchievementId: steamAchievement.apiname,
          globalPercentage: steamAchievement.globalPercent,
          icon: steamAchievement.icon,
          iconLocked: steamAchievement.icongray,
          isHidden: steamAchievement.hidden === 1
        });
        
        await achievement.save();
      }
      
      importedAchievements.push(achievement);
    }
    
    res.json({ 
      message: `${importedAchievements.length} achievements imported successfully`,
      achievements: importedAchievements
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;