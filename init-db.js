// Script to initialize the database directly
const mongoose = require('mongoose');
require('dotenv').config();

// Use the MongoDB URI from docker-compose
const MONGODB_URI = 'mongodb://admin:password@gaming-library-mongodb:27017/gaming-library?authSource=admin';

console.log('Connecting to MongoDB...');

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', async () => {
  console.log('Connected to MongoDB successfully!');
  
  // Import models
  const Game = require('./models/Game');
  const Achievement = require('./models/Achievement');
  const User = require('./models/User');
  const UserGame = require('./models/UserGame');
  
  try {
    // Clear existing data
    await Game.deleteMany({});
    await Achievement.deleteMany({});
    await User.deleteMany({});
    await UserGame.deleteMany({});
    
    console.log('Existing data cleared.');
    
    // Insert sample games
    const games = await Game.insertMany([
      {
        name: "The Witcher 3: Wild Hunt",
        description: "An open world action RPG set in a fantasy universe full of meaningful choices and impactful consequences.",
        platform: "PC",
        genre: "RPG",
        releaseDate: new Date("2015-05-19"),
        developer: "CD Projekt RED",
        publisher: "CD Projekt",
        imageUrl: "https://images.igdb.com/igdb/image/upload/t_cover_big/co2365.jpg"
      },
      {
        name: "Red Dead Redemption 2",
        description: "An epic tale of life in America's unforgiving heartland.",
        platform: "PlayStation 4",
        genre: "Action-Adventure",
        releaseDate: new Date("2018-10-26"),
        developer: "Rockstar Games",
        publisher: "Rockstar Games",
        imageUrl: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1q1f.jpg"
      },
      {
        name: "Hollow Knight",
        description: "A challenging 2D metroidvania game set in the vast, interconnected world of Hallownest.",
        platform: "Nintendo Switch",
        genre: "Metroidvania",
        releaseDate: new Date("2017-02-24"),
        developer: "Team Cherry",
        publisher: "Team Cherry",
        imageUrl: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1wz7.jpg"
      }
    ]);
    
    console.log(`Inserted ${games.length} sample games.`);
    
    // Insert sample achievements for the first game
    const achievements = await Achievement.insertMany([
      {
        name: "Blood and Wine",
        description: "Complete the Blood and Wine expansion.",
        gameId: games[0]._id,
        points: 100,
        imageUrl: "https://images.igdb.com/igdb/image/upload/t_cover_big/co2365.jpg"
      },
      {
        name: "Hearts of Stone",
        description: "Complete the Hearts of Stone expansion.",
        gameId: games[0]._id,
        points: 100,
        imageUrl: "https://images.igdb.com/igdb/image/upload/t_cover_big/co2365.jpg"
      },
      {
        name: "Master Alchemist",
        description: "Reach level 35 inAlchemy.",
        gameId: games[0]._id,
        points: 50,
        imageUrl: "https://images.igdb.com/igdb/image/upload/t_cover_big/co2365.jpg"
      }
    ]);
    
    console.log(`Inserted ${achievements.length} sample achievements.`);
    
    console.log('Database initialization completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
});