const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  // Basic game information
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  releaseDate: {
    type: Date
  },
  developer: {
    type: String,
    default: ''
  },
  publisher: {
    type: String,
    default: ''
  },
  genres: [{
    type: String
  }],
  platforms: [{
    type: String,
    enum: ['PC', 'PlayStation', 'Xbox', 'Nintendo Switch', 'Mobile']
  }],
  
  // Media assets
  coverImage: {
    type: String, // URL to cover image
    default: ''
  },
  screenshots: [{
    type: String // URLs to screenshots
  }],
  trailerUrl: {
    type: String,
    default: ''
  },
  
  // Metadata from external sources
  steamAppId: {
    type: String
  },
  epicGameId: {
    type: String
  },
  xboxGameId: {
    type: String
  },
  playstationGameId: {
    type: String
  },
  
  // Rating and popularity
  metacriticScore: {
    type: Number,
    min: 0,
    max: 100
  },
  averagePlaytime: {
    type: Number, // in hours
    default: 0
  },
  
  // System requirements (for PC games)
  systemRequirements: {
    minimum: {
      os: String,
      processor: String,
      memory: String,
      graphics: String,
      storage: String
    },
    recommended: {
      os: String,
      processor: String,
      memory: String,
      graphics: String,
      storage: String
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

// Index for search functionality
gameSchema.index({ title: 'text', description: 'text' });
gameSchema.index({ genres: 1 });
gameSchema.index({ platforms: 1 });

module.exports = mongoose.model('Game', gameSchema);