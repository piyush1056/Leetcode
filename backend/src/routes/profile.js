const express = require('express');
const profileRouter = express.Router();
const { 
  getMyProfile, 
  updateProfile, 
  getLeaderboard,
  getUserProfile,
  getUserSprints
} = require('../controllers/profileController');
const { verifyToken, loadUser } = require('../middleware/auth');
const createRateLimiter = require('../middleware/rateLimiterMiddleware');



profileRouter.get('/me', verifyToken, loadUser, getMyProfile);

profileRouter.patch('/update', verifyToken, loadUser, createRateLimiter(3600, 20), updateProfile);

profileRouter.get('/leaderboard', verifyToken, loadUser, getLeaderboard);

profileRouter.get('/sprints', verifyToken, loadUser, getUserSprints);

profileRouter.get('/:userId', verifyToken, loadUser, getUserProfile);

module.exports = profileRouter;
