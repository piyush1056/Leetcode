const express = require("express");
const authRouter = express.Router();
const {
  register,
  login,
  logout,
  googleAuth,
  promoteToAdmin,
  getAllUsers,
  deleteProfile,
  checkAuth,
  deleteUser 
} = require('../controllers/authController');

const { verifyToken, loadUser, isAdmin } = require('../middleware/auth');
const createRateLimiter = require("../middleware/rateLimiterMiddleware");
const { verifyGoogleToken } = require("../middleware/googleAuth"); 

authRouter.post("/register", createRateLimiter(3600, 3), register);
authRouter.post("/login", createRateLimiter(900, 15), login);
authRouter.post("/google-auth", createRateLimiter(900, 10), verifyGoogleToken, googleAuth); // New Google OAuth route

authRouter.get('/check', checkAuth);
authRouter.post("/logout", verifyToken, loadUser, logout);
authRouter.delete('/profile',  verifyToken, loadUser, createRateLimiter(86400, 3), deleteProfile);

// Admin-only 
authRouter.post('/admin/promote-user', verifyToken, loadUser, isAdmin,  createRateLimiter(86400, 10), promoteToAdmin);
authRouter.get('/admin/users',  verifyToken, loadUser, isAdmin,  createRateLimiter(3600, 30), getAllUsers);
authRouter.delete('/admin/user/:userId', verifyToken, loadUser, isAdmin, createRateLimiter(86400, 10), deleteUser);

module.exports = authRouter;


