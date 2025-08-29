const mongoose = require('mongoose');
const Game = require('./models/Game');
const User = require('./models/User');
const Achievement = require('./models/Achievement');
const UserGame = require('./models/UserGame');
require('dotenv').config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/gaming-library', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Sample data
const sampleGames = [
  {
    title: 'The Witcher 3: Wild Hunt',
    description: 'An open world action RPG set in a visually stunning fantasy universe full of meaningful choices and impactful consequences.',
    releaseDate: new Date('2015-05-19'),
    developer: 'CD Projekt RED',
    publisher: 'CD Projekt',
    genres: ['RPG', 'Open World', 'Fantasy'],
    platforms: ['PC', 'PlayStation', 'Xbox'],
    coverImage: 'https://via.placeholder.com/300x400/3b82f6/ffffff?text=TW3',
    screenshots: [
      'https://via.placeholder.com/600x338/3b82f6/ffffff?text=Screenshot+1',
      'https://via.placeholder.com/600x338/3b82f6/ffffff?text=Screenshot+2'
    ],
    steamAppId: '292030',
    metacriticScore: 93,
    averagePlaytime: 120
  },
  {
    title: 'Cyberpunk 2077',
    description: 'An open-world, action-adventure story RPG set in Night City, a megalopolis obsessed with power, glamour and body modification.',
    releaseDate: new Date('2020-12-10'),
    developer: 'CD Projekt RED',
    publisher: 'CD Projekt',
    genres: ['RPG', 'Open World', 'Cyberpunk'],
    platforms: ['PC', 'PlayStation', 'Xbox'],
    coverImage: 'https://via.placeholder.com/300x400/ef4444/ffffff?text=CP2077',
    screenshots: [
      'https://via.placeholder.com/600x338/ef4444/ffffff?text=Screenshot+1',
      'https://via.placeholder.com/600x338/ef4444/ffffff?text=Screenshot+2'
    ],
    steamAppId: '1091500',
    metacriticScore: 86,
    averagePlaytime: 65
  },
  {
    title: 'Red Dead Redemption 2',
    description: 'America, 1899. The end of the wild west era has begun as lawmen hunt down the last remaining outlaw gangs.',
    releaseDate: new Date('2018-10-26'),
    developer: 'Rockstar Games',
    publisher: 'Rockstar Games',
    genres: ['Action', 'Adventure', 'Open World'],
    platforms: ['PC', 'PlayStation', 'Xbox'],
    coverImage: 'https://via.placeholder.com/300x400/10b981/ffffff?text=RDR2',
    screenshots: [
      'https://via.placeholder.com/600x338/10b981/ffffff?text=Screenshot+1',
      'https://via.placeholder.com/600x338/10b981/ffffff?text=Screenshot+2'
    ],
    steamAppId: '1174180',
    metacriticScore: 97,
    averagePlaytime: 80
  },
  {
    title: 'Hades',
    description: 'An rogue-like dungeon crawler that combines the best aspects of Supergiant\'s previous titles to create a compelling and innovative experience.',
    releaseDate: new Date('2020-09-17'),
    developer: 'Supergiant Games',
    publisher: 'Supergiant Games',
    genres: ['Action', 'Rogue-like', 'Indie'],
    platforms: ['PC', 'PlayStation', 'Xbox', 'Nintendo Switch'],
    coverImage: 'https://via.placeholder.com/300x400/8b5cf6/ffffff?text=Hades',
    screenshots: [
      'https://via.placeholder.com/600x338/8b5cf6/ffffff?text=Screenshot+1',
      'https://via.placeholder.com/600x338/8b5cf6/ffffff?text=Screenshot+2'
    ],
    steamAppId: '1145360',
    metacriticScore: 93,
    averagePlaytime: 40
  }
];

const sampleUsers = [
  {
    username: 'gamer123',
    email: 'gamer123@example.com',
    password: 'password123',
    bio: 'Passionate gamer with a love for RPGs and open world games.'
  }
];

const sampleAchievements = [
  {
    name: 'Blood on the Battlefield',
    description: 'Complete the prologue',
    gameId: null, // Will be set after game creation
    steamAchievementId: 'witcher3_prologue',
    globalPercentage: 85.2,
    points: 10,
    icon: '🛡️'
  },
  {
    name: 'Loot Hunter',
    description: 'Find 100 items',
    gameId: null,
    steamAchievementId: 'witcher3_loot_hunter',
    globalPercentage: 42.7,
    points: 20,
    icon: '💎'
  },
  {
    name: 'Monster Slayer',
    description: 'Kill 50 monsters',
    gameId: null,
    steamAchievementId: 'witcher3_monster_slayer',
    globalPercentage: 68.9,
    points: 15,
    icon: '👹'
  }
];

// Initialize database with sample data
const initDatabase = async () => {
  try {
    await connectDB();
    
    // Clear existing data
    await Game.deleteMany({});
    await User.deleteMany({});
    await Achievement.deleteMany({});
    await UserGame.deleteMany({});
    
    console.log('Existing data cleared');
    
    // Create games
    const createdGames = await Game.insertMany(sampleGames);
    console.log(`Created ${createdGames.length} games`);
    
    // Update achievement references
    sampleAchievements.forEach(achievement => {
      achievement.gameId = createdGames[0]._id; // Associate with The Witcher 3
    });
    
    // Create achievements
    const createdAchievements = await Achievement.insertMany(sampleAchievements);
    console.log(`Created ${createdAchievements.length} achievements`);
    
    // Create users
    const createdUsers = await User.insertMany(sampleUsers);
    console.log(`Created ${createdUsers.length} users`);
    
    // Create user games with progress
    const userGames = [
      {
        userId: createdUsers[0]._id,
        gameId: createdGames[0]._id, // The Witcher 3
        status: 'completed',
        playtime: 120,
        lastPlayed: new Date(),
        platform: 'PC',
        achievements: createdAchievements.map(ach => ({
          achievementId: ach._id,
          unlocked: true,
          unlockDate: new Date()
        })),
        totalAchievements: createdAchievements.length,
        unlockedAchievements: createdAchievements.length,
        rating: 9.5
      },
      {
        userId: createdUsers[0]._id,
        gameId: createdGames[1]._id, // Cyberpunk 2077
        status: 'playing',
        playtime: 45,
        lastPlayed: new Date(),
        platform: 'PC',
        achievements: [],
        totalAchievements: 0,
        unlockedAchievements: 0,
        rating: 7.2
      }
    ];
    
    const createdUserGames = await UserGame.insertMany(userGames);
    console.log(`Created ${createdUserGames.length} user games`);
    
    console.log('Database initialization complete!');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
};

// Run initialization
initDatabase();