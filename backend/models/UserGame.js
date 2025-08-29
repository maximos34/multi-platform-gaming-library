const mongoose = require('mongoose');

const userGameSchema = new mongoose.Schema({
  // References
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  gameId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Game',
    required: true
  },
  
  // Game status
  status: {
    type: String,
    enum: ['playing', 'completed', 'on-hold', 'dropped', 'planned'],
    default: 'playing'
  },
  
  // Progress tracking
  playtime: {
    type: Number, // in hours
    default: 0
  },
  lastPlayed: {
    type: Date
  },
  
  // Manual tracking options
  isManuallyAdded: {
    type: Boolean,
    default: false
  },
  
  // Platform information
  platform: {
    type: String,
    enum: ['PC', 'PlayStation', 'Xbox', 'Nintendo Switch', 'Mobile']
  },
  
  // Achievement progress
  achievements: [{
    achievementId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Achievement'
    },
    unlocked: {
      type: Boolean,
      default: false
    },
    unlockDate: {
      type: Date
    }
  }],
  totalAchievements: {
    type: Number,
    default: 0
  },
  unlockedAchievements: {
    type: Number,
    default: 0
  },
  
  // User notes and ratings
  notes: {
    type: String,
    maxlength: 1000
  },
  rating: {
    type: Number,
    min: 1,
    max: 10
  },
  
  // Custom tags and categories
  tags: [{
    type: String
  }],
  categories: [{
    type: String
  }],
  
  // Timestamps
  addedAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Ensure a user can only have one entry per game
userGameSchema.index({ userId: 1, gameId: 1 }, { unique: true });

// Update timestamps on save
userGameSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('UserGame', userGameSchema);