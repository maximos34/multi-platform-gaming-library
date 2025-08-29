const express = require('express');
const router = express.Router();
const AuthService = require('../services/AuthService');

// Middleware to verify token
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }
    
    const decoded = await AuthService.validateToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

/**
 * @route   POST /api/auth/register
 * @desc    Register user
 * @access  Public
 */
router.post('/register', async (req, res) => {
  try {
    const { user, token } = await AuthService.register(req.body);
    res.status(201).json({ user, token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await AuthService.login(email, password);
    
    // Remove password from response
    user.password = undefined;
    
    res.json({ user, token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @route   GET /api/auth/me
 * @desc    Get current user
 * @access  Private
 */
router.get('/me', authMiddleware, async (req, res) => {
  try {
    res.json({ user: req.user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route   POST /api/auth/connect/steam
 * @desc    Connect Steam account
 * @access  Private
 */
router.post('/connect/steam', authMiddleware, async (req, res) => {
  try {
    const user = await AuthService.connectSteamAccount(req.user.id, req.body);
    res.json({ user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @route   POST /api/auth/connect/epic
 * @desc    Connect Epic account
 * @access  Private
 */
router.post('/connect/epic', authMiddleware, async (req, res) => {
  try {
    const user = await AuthService.connectEpicAccount(req.user.id, req.body);
    res.json({ user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @route   POST /api/auth/connect/xbox
 * @desc    Connect Xbox account
 * @access  Private
 */
router.post('/connect/xbox', authMiddleware, async (req, res) => {
  try {
    const user = await AuthService.connectXboxAccount(req.user.id, req.body);
    res.json({ user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @route   POST /api/auth/connect/playstation
 * @desc    Connect PlayStation account
 * @access  Private
 */
router.post('/connect/playstation', authMiddleware, async (req, res) => {
  try {
    const user = await AuthService.connectPlaystationAccount(req.user.id, req.body);
    res.json({ user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;