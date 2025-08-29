const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  profileImage: {
    type: String, // URL to profile image
    default: ''
  },
  bio: {
    type: String,
    maxlength: 500,
    default: ''
  },
  
  // Connected gaming accounts
  connectedAccounts: {
    steam: {
      id: String,
      username: String,
      avatar: String
    },
    epic: {
      id: String,
      username: String
    },
    xbox: {
      id: String,
      gamertag: String,
      avatar: String
    },
    playstation: {
      id: String,
      onlineId: String,
      avatar: String
    }
  },
  
  // User preferences
  preferences: {
    theme: {
      type: String,
      enum: ['light', 'dark', 'blue', 'green', 'purple'],
      default: 'dark'
    },
    language: {
      type: String,
      default: 'en'
    },
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      push: {
        type: Boolean,
        default: true
      }
    }
  },
  
  // User statistics
  stats: {
    totalGames: {
      type: Number,
      default: 0
    },
    completedGames: {
      type: Number,
      default: 0
    },
    totalAchievements: {
      type: Number,
      default: 0
    },
    unlockedAchievements: {
      type: Number,
      default: 0
    }
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

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Update timestamps on save
userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('User', userSchema);