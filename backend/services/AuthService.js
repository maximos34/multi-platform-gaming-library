const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { auth } = require('../config/firebase');

class AuthService {
  /**
   * Generate JWT token for user
   * @param {Object} user - User object
   * @returns {string} JWT token
   */
  generateToken(user) {
    return jwt.sign(
      { id: user._id, username: user.username, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );
  }

  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} Registered user and token
   */
  async register(userData) {
    try {
      // Check if user already exists
      const existingUser = await User.findOne({
        $or: [{ email: userData.email }, { username: userData.username }]
      });

      if (existingUser) {
        throw new Error('User already exists with this email or username');
      }

      // Create user
      const user = new User(userData);
      await user.save();

      // Generate token
      const token = this.generateToken(user);

      return { user, token };
    } catch (error) {
      throw new Error(`Registration failed: ${error.message}`);
    }
  }

  /**
   * Login user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} Logged in user and token
   */
  async login(email, password) {
    try {
      // Find user by email
      const user = await User.findOne({ email }).select('+password');

      if (!user) {
        throw new Error('Invalid credentials');
      }

      // Check password
      const isMatch = await user.comparePassword(password);

      if (!isMatch) {
        throw new Error('Invalid credentials');
      }

      // Generate token
      const token = this.generateToken(user);

      return { user, token };
    } catch (error) {
      throw new Error(`Login failed: ${error.message}`);
    }
  }

  /**
   * Connect Steam account to user
   * @param {string} userId - User ID
   * @param {Object} steamData - Steam account data
   * @returns {Promise<Object>} Updated user
   */
  async connectSteamAccount(userId, steamData) {
    try {
      const user = await User.findByIdAndUpdate(
        userId,
        {
          $set: {
            'connectedAccounts.steam': {
              id: steamData.id,
              username: steamData.username,
              avatar: steamData.avatar
            }
          }
        },
        { new: true }
      );

      if (!user) {
        throw new Error('User not found');
      }

      return user;
    } catch (error) {
      throw new Error(`Failed to connect Steam account: ${error.message}`);
    }
  }

  /**
   * Connect Epic account to user
   * @param {string} userId - User ID
   * @param {Object} epicData - Epic account data
   * @returns {Promise<Object>} Updated user
   */
  async connectEpicAccount(userId, epicData) {
    try {
      const user = await User.findByIdAndUpdate(
        userId,
        {
          $set: {
            'connectedAccounts.epic': {
              id: epicData.id,
              username: epicData.username
            }
          }
        },
        { new: true }
      );

      if (!user) {
        throw new Error('User not found');
      }

      return user;
    } catch (error) {
      throw new Error(`Failed to connect Epic account: ${error.message}`);
    }
  }

  /**
   * Connect Xbox account to user
   * @param {string} userId - User ID
   * @param {Object} xboxData - Xbox account data
   * @returns {Promise<Object>} Updated user
   */
  async connectXboxAccount(userId, xboxData) {
    try {
      const user = await User.findByIdAndUpdate(
        userId,
        {
          $set: {
            'connectedAccounts.xbox': {
              id: xboxData.id,
              gamertag: xboxData.gamertag,
              avatar: xboxData.avatar
            }
          }
        },
        { new: true }
      );

      if (!user) {
        throw new Error('User not found');
      }

      return user;
    } catch (error) {
      throw new Error(`Failed to connect Xbox account: ${error.message}`);
    }
  }

  /**
   * Connect PlayStation account to user
   * @param {string} userId - User ID
   * @param {Object} playstationData - PlayStation account data
   * @returns {Promise<Object>} Updated user
   */
  async connectPlaystationAccount(userId, playstationData) {
    try {
      const user = await User.findByIdAndUpdate(
        userId,
        {
          $set: {
            'connectedAccounts.playstation': {
              id: playstationData.id,
              onlineId: playstationData.onlineId,
              avatar: playstationData.avatar
            }
          }
        },
        { new: true }
      );

      if (!user) {
        throw new Error('User not found');
      }

      return user;
    } catch (error) {
      throw new Error(`Failed to connect PlayStation account: ${error.message}`);
    }
  }

  /**
   * Validate JWT token
   * @param {string} token - JWT token
   * @returns {Promise<Object>} Decoded token data
   */
  async validateToken(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return decoded;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
}

module.exports = new AuthService();