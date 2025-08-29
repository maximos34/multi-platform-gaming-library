const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    // Use the MONGODB_URI environment variable for production
    // Fallback to local MongoDB for development
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/gaming-library', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    
    // In production, we might want to exit the process
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
    
    // In development, we'll continue with mock data
    console.log('Using mock database for development');
    return {
      connection: {
        host: 'localhost:27017 (mock)'
      }
    };
  }
};

module.exports = connectDB;