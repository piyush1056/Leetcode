const express = require('express');
const adminRouter = express.Router();
const User = require('../models/user');
const Problem = require('../models/problem');
const Submission = require('../models/submission');
const { verifyToken, loadUser, isAdmin } = require('../middleware/auth');

adminRouter.get('/stats', verifyToken, loadUser, isAdmin, async (req, res) => {
  try {
   
    const [totalUsers, totalProblems, totalSubmissions, recentUsers] = await Promise.all([
      User.countDocuments(),
      Problem.countDocuments(),
      Submission.countDocuments(),
      User.find().sort({ createdAt: -1 }).limit(5).select('username fullName createdAt')
    ]);

    res.json({
      totalUsers,
      totalProblems,
      totalSubmissions,
      recentUsers
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch stats' });
  }
});

module.exports = adminRouter;
