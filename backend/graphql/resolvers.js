const Game = require('../models/Game');
const User = require('../models/User');
const Achievement = require('../models/Achievement');
const UserGame = require('../models/UserGame');
const AuthService = require('../services/AuthService');

const resolvers = {
  Query: {
    // Game queries
    games: async (_, { limit = 20, offset = 0, search, genre, platform }) => {
      try {
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
        
        const games = await Game.find(filter)
          .limit(limit)
          .skip(offset)
          .sort({ createdAt: -1 });
          
        return games;
      } catch (error) {
        throw new Error(`Failed to fetch games: ${error.message}`);
      }
    },
    
    game: async (_, { id }) => {
      try {
        const game = await Game.findById(id);
        return game;
      } catch (error) {
        throw new Error(`Failed to fetch game: ${error.message}`);
      }
    },
    
    // User queries
    users: async (_, { limit = 20, offset = 0 }) => {
      try {
        const users = await User.find()
          .limit(limit)
          .skip(offset)
          .sort({ createdAt: -1 });
          
        return users;
      } catch (error) {
        throw new Error(`Failed to fetch users: ${error.message}`);
      }
    },
    
    user: async (_, { id }) => {
      try {
        const user = await User.findById(id);
        return user;
      } catch (error) {
        throw new Error(`Failed to fetch user: ${error.message}`);
      }
    },
    
    me: async (_, __, { user }) => {
      try {
        if (!user) {
          throw new Error('Not authenticated');
        }
        const currentUser = await User.findById(user.id);
        return currentUser;
      } catch (error) {
        throw new Error(`Failed to fetch current user: ${error.message}`);
      }
    },
    
    // Achievement queries
    achievements: async (_, { gameId, limit = 50, offset = 0 }) => {
      try {
        const filter = {};
        
        if (gameId) {
          filter.gameId = gameId;
        }
        
        const achievements = await Achievement.find(filter)
          .limit(limit)
          .skip(offset)
          .sort({ createdAt: -1 });
          
        return achievements;
      } catch (error) {
        throw new Error(`Failed to fetch achievements: ${error.message}`);
      }
    },
    
    achievement: async (_, { id }) => {
      try {
        const achievement = await Achievement.findById(id);
        return achievement;
      } catch (error) {
        throw new Error(`Failed to fetch achievement: ${error.message}`);
      }
    },
    
    // UserGame queries
    userGames: async (_, { userId, limit = 20, offset = 0, status }) => {
      try {
        const filter = { userId };
        
        if (status) {
          filter.status = status;
        }
        
        const userGames = await UserGame.find(filter)
          .limit(limit)
          .skip(offset)
          .sort({ lastPlayed: -1 })
          .populate('gameId');
          
        return userGames;
      } catch (error) {
        throw new Error(`Failed to fetch user games: ${error.message}`);
      }
    },
    
    userGame: async (_, { id }) => {
      try {
        const userGame = await UserGame.findById(id)
          .populate('gameId')
          .populate('achievements.achievementId');
          
        return userGame;
      } catch (error) {
        throw new Error(`Failed to fetch user game: ${error.message}`);
      }
    },
    
    // Stats queries
    dashboardStats: async (_, __, { user }) => {
      try {
        if (!user) {
          throw new Error('Not authenticated');
        }
        
        const currentUser = await User.findById(user.id);
        const userGames = await UserGame.find({ userId: user.id });
        
        const totalPlaytime = userGames.reduce((sum, game) => sum + game.playtime, 0);
        
        return {
          totalGames: currentUser.stats.totalGames,
          completedGames: currentUser.stats.completedGames,
          totalPlaytime,
          totalAchievements: currentUser.stats.totalAchievements,
          unlockedAchievements: currentUser.stats.unlockedAchievements
        };
      } catch (error) {
        throw new Error(`Failed to fetch dashboard stats: ${error.message}`);
      }
    }
  },
  
  Mutation: {
    // Game mutations
    createGame: async (_, { input }, { user }) => {
      try {
        if (!user) {
          throw new Error('Not authenticated');
        }
        
        const game = new Game(input);
        await game.save();
        return game;
      } catch (error) {
        throw new Error(`Failed to create game: ${error.message}`);
      }
    },
    
    updateGame: async (_, { id, input }, { user }) => {
      try {
        if (!user) {
          throw new Error('Not authenticated');
        }
        
        const game = await Game.findByIdAndUpdate(
          id,
          input,
          { new: true, runValidators: true }
        );
        
        if (!game) {
          throw new Error('Game not found');
        }
        
        return game;
      } catch (error) {
        throw new Error(`Failed to update game: ${error.message}`);
      }
    },
    
    deleteGame: async (_, { id }, { user }) => {
      try {
        if (!user) {
          throw new Error('Not authenticated');
        }
        
        const game = await Game.findByIdAndDelete(id);
        
        if (!game) {
          throw new Error('Game not found');
        }
        
        // Also remove from user games
        await UserGame.deleteMany({ gameId: id });
        
        return true;
      } catch (error) {
        throw new Error(`Failed to delete game: ${error.message}`);
      }
    },
    
    // User mutations
    register: async (_, { input }) => {
      try {
        const { user, token } = await AuthService.register(input);
        return { user, token };
      } catch (error) {
        throw new Error(`Registration failed: ${error.message}`);
      }
    },
    
    login: async (_, { email, password }) => {
      try {
        const { user, token } = await AuthService.login(email, password);
        return { user, token };
      } catch (error) {
        throw new Error(`Login failed: ${error.message}`);
      }
    },
    
    updateUser: async (_, { id, input }, { user }) => {
      try {
        if (!user || user.id !== id) {
          throw new Error('Not authorized');
        }
        
        const updatedUser = await User.findByIdAndUpdate(
          id,
          input,
          { new: true, runValidators: true }
        );
        
        if (!updatedUser) {
          throw new Error('User not found');
        }
        
        return updatedUser;
      } catch (error) {
        throw new Error(`Failed to update user: ${error.message}`);
      }
    },
    
    connectSteamAccount: async (_, { input }, { user }) => {
      try {
        if (!user) {
          throw new Error('Not authenticated');
        }
        
        const updatedUser = await AuthService.connectSteamAccount(user.id, input);
        return updatedUser;
      } catch (error) {
        throw new Error(`Failed to connect Steam account: ${error.message}`);
      }
    },
    
    connectEpicAccount: async (_, { input }, { user }) => {
      try {
        if (!user) {
          throw new Error('Not authenticated');
        }
        
        const updatedUser = await AuthService.connectEpicAccount(user.id, input);
        return updatedUser;
      } catch (error) {
        throw new Error(`Failed to connect Epic account: ${error.message}`);
      }
    },
    
    connectXboxAccount: async (_, { input }, { user }) => {
      try {
        if (!user) {
          throw new Error('Not authenticated');
        }
        
        const updatedUser = await AuthService.connectXboxAccount(user.id, input);
        return updatedUser;
      } catch (error) {
        throw new Error(`Failed to connect Xbox account: ${error.message}`);
      }
    },
    
    connectPlaystationAccount: async (_, { input }, { user }) => {
      try {
        if (!user) {
          throw new Error('Not authenticated');
        }
        
        const updatedUser = await AuthService.connectPlaystationAccount(user.id, input);
        return updatedUser;
      } catch (error) {
        throw new Error(`Failed to connect PlayStation account: ${error.message}`);
      }
    },
    
    // Achievement mutations
    createAchievement: async (_, { input }, { user }) => {
      try {
        if (!user) {
          throw new Error('Not authenticated');
        }
        
        const achievement = new Achievement(input);
        await achievement.save();
        return achievement;
      } catch (error) {
        throw new Error(`Failed to create achievement: ${error.message}`);
      }
    },
    
    updateAchievement: async (_, { id, input }, { user }) => {
      try {
        if (!user) {
          throw new Error('Not authenticated');
        }
        
        const achievement = await Achievement.findByIdAndUpdate(
          id,
          input,
          { new: true, runValidators: true }
        );
        
        if (!achievement) {
          throw new Error('Achievement not found');
        }
        
        return achievement;
      } catch (error) {
        throw new Error(`Failed to update achievement: ${error.message}`);
      }
    },
    
    deleteAchievement: async (_, { id }, { user }) => {
      try {
        if (!user) {
          throw new Error('Not authenticated');
        }
        
        const achievement = await Achievement.findByIdAndDelete(id);
        
        if (!achievement) {
          throw new Error('Achievement not found');
        }
        
        return true;
      } catch (error) {
        throw new Error(`Failed to delete achievement: ${error.message}`);
      }
    },
    
    // UserGame mutations
    addUserGame: async (_, { input }, { user }) => {
      try {
        if (!user) {
          throw new Error('Not authenticated');
        }
        
        const { gameId, platform, status = 'playing', tags = [], categories = [] } = input;
        
        // Check if user already has this game
        const existingUserGame = await UserGame.findOne({
          userId: user.id,
          gameId
        });
        
        if (existingUserGame) {
          throw new Error('Game already in your collection');
        }
        
        // Check if game exists
        const game = await Game.findById(gameId);
        if (!game) {
          throw new Error('Game not found');
        }
        
        // Create user game entry
        const userGame = new UserGame({
          userId: user.id,
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
        
        return userGame;
      } catch (error) {
        throw new Error(`Failed to add game to collection: ${error.message}`);
      }
    },
    
    updateUserGame: async (_, { id, input }, { user }) => {
      try {
        if (!user) {
          throw new Error('Not authenticated');
        }
        
        const userGame = await UserGame.findById(id);
        
        if (!userGame) {
          throw new Error('User game not found');
        }
        
        // Check if user owns this game entry
        if (userGame.userId.toString() !== user.id) {
          throw new Error('Access denied');
        }
        
        // Update fields
        Object.assign(userGame, input);
        
        await userGame.save();
        
        // Populate and return
        await userGame.populate('gameId');
        
        return userGame;
      } catch (error) {
        throw new Error(`Failed to update user game: ${error.message}`);
      }
    },
    
    removeUserGame: async (_, { id }, { user }) => {
      try {
        if (!user) {
          throw new Error('Not authenticated');
        }
        
        const userGame = await UserGame.findById(id);
        
        if (!userGame) {
          throw new Error('User game not found');
        }
        
        // Check if user owns this game entry
        if (userGame.userId.toString() !== user.id) {
          throw new Error('Access denied');
        }
        
        await userGame.remove();
        
        return true;
      } catch (error) {
        throw new Error(`Failed to remove game from collection: ${error.message}`);
      }
    },
    
    // UserAchievement mutations
    unlockAchievement: async (_, { userGameId, achievementId }, { user }) => {
      try {
        if (!user) {
          throw new Error('Not authenticated');
        }
        
        const userGame = await UserGame.findById(userGameId);
        
        if (!userGame) {
          throw new Error('User game not found');
        }
        
        // Check if user owns this game entry
        if (userGame.userId.toString() !== user.id) {
          throw new Error('Access denied');
        }
        
        // Check if achievement exists
        const achievement = await Achievement.findById(achievementId);
        if (!achievement) {
          throw new Error('Achievement not found');
        }
        
        // Check if achievement is already unlocked
        const existingAchievement = userGame.achievements.find(
          a => a.achievementId.toString() === achievementId
        );
        
        if (existingAchievement && existingAchievement.unlocked) {
          throw new Error('Achievement already unlocked');
        }
        
        if (existingAchievement) {
          // Update existing achievement
          existingAchievement.unlocked = true;
          existingAchievement.unlockDate = new Date();
        } else {
          // Add new achievement
          userGame.achievements.push({
            achievementId,
            unlocked: true,
            unlockDate: new Date()
          });
        }
        
        // Update achievement counts
        userGame.unlockedAchievements = userGame.achievements.filter(a => a.unlocked).length;
        
        await userGame.save();
        
        // Populate and return
        await userGame.populate('gameId');
        await userGame.populate('achievements.achievementId');
        
        return userGame;
      } catch (error) {
        throw new Error(`Failed to unlock achievement: ${error.message}`);
      }
    },
    
    lockAchievement: async (_, { userGameId, achievementId }, { user }) => {
      try {
        if (!user) {
          throw new Error('Not authenticated');
        }
        
        const userGame = await UserGame.findById(userGameId);
        
        if (!userGame) {
          throw new Error('User game not found');
        }
        
        // Check if user owns this game entry
        if (userGame.userId.toString() !== user.id) {
          throw new Error('Access denied');
        }
        
        // Find the achievement
        const achievementIndex = userGame.achievements.findIndex(
          a => a.achievementId.toString() === achievementId
        );
        
        if (achievementIndex === -1) {
          throw new Error('Achievement not found in user game');
        }
        
        // Lock the achievement
        userGame.achievements[achievementIndex].unlocked = false;
        userGame.achievements[achievementIndex].unlockDate = null;
        
        // Update achievement counts
        userGame.unlockedAchievements = userGame.achievements.filter(a => a.unlocked).length;
        
        await userGame.save();
        
        // Populate and return
        await userGame.populate('gameId');
        await userGame.populate('achievements.achievementId');
        
        return userGame;
      } catch (error) {
        throw new Error(`Failed to lock achievement: ${error.message}`);
      }
    }
  },
  
  // Field resolvers
  Game: {
    achievements: async (game) => {
      try {
        return await Achievement.find({ gameId: game.id });
      } catch (error) {
        return [];
      }
    }
  },
  
  User: {
    userGames: async (user) => {
      try {
        return await UserGame.find({ userId: user.id }).populate('gameId');
      } catch (error) {
        return [];
      }
    }
  },
  
  UserGame: {
    game: async (userGame) => {
      try {
        return await Game.findById(userGame.gameId);
      } catch (error) {
        return null;
      }
    },
    achievements: async (userGame) => {
      try {
        // Return the achievements with the achievement objects populated
        const populatedAchievements = [];
        for (const userAchievement of userGame.achievements) {
          const achievement = await Achievement.findById(userAchievement.achievementId);
          if (achievement) {
            populatedAchievements.push({
              ...userAchievement.toObject(),
              achievement
            });
          }
        }
        return populatedAchievements;
      } catch (error) {
        return userGame.achievements;
      }
    }
  },
  
  UserAchievement: {
    achievement: async (userAchievement) => {
      try {
        return await Achievement.findById(userAchievement.achievementId);
      } catch (error) {
        return null;
      }
    }
  }
};

module.exports = resolvers;