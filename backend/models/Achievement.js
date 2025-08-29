const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  // Achievement identification
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  
  // Game reference
  gameId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Game',
    required: true
  },
  
  // Platform-specific identifiers
  steamAchievementId: String,
  epicAchievementId: String,
  xboxAchievementId: String,
  playstationAchievementId: String,
  
  // Achievement properties
  globalPercentage: {
    type: Number, // How rare the achievement is (0-100)
    min: 0,
    max: 100
  },
  points: {
    type: Number,
    default: 0
  },
  
  // Media
  icon: {
    type: String, // URL to achievement icon
    default: ''
  },
  iconLocked: {
    type: String, // URL to locked achievement icon
    default: ''
  },
  
  // Achievement type
  isHidden: {
    type: Boolean,
    default: false
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient querying
achievementSchema.index({ gameId: 1 });
achievementSchema.index({ name: 'text' });

module.exports = mongoose.model('Achievement', achievementSchema);