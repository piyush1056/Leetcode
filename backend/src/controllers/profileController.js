const User = require('../models/user');
const Submission = require('../models/submission');
const mongoose = require('mongoose');

const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('problemsSolved.problemId', 'title difficulty problemNo ');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const totalSubmissions = await Submission.countDocuments({ userId: req.user._id });
    
    res.json({
      user,
      stats: {
        totalSubmissions,
        totalSolved: user.totalProblemsSolved || 0,
        points: user.points || 0,
        currentStreak: user.streaks?.current || 0,
        longestStreak: user.streaks?.longest || 0,
        
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Failed to fetch profile' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const user = req.user; 
    const { username, fullName, bio } = req.body;
    
  
    if (!username && !fullName  && bio === undefined) {
      return res.status(400).json({ message: 'At least one field is required' });
    }

    if (username && username !== user.username) {
       if (!/^[a-z0-9_]{3,20}$/.test(username.toLowerCase())) {
        return res.status(400).json({ message: 'Invalid username format' });
      }
        user.username = username.toLowerCase();
    }

    if (fullName && fullName !== user.fullName) {
      user.fullName = fullName;
    }
    if (bio !== undefined && bio !== user.bio) {
      user.bio = bio;
    }

    await user.save();

    res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        _id: user._id,
        username: user.username,
        fullName: user.fullName,
        emailId: user.emailId,
        bio: user.bio,
        avatar: user.avatar
      }
    });

  } catch (error) {
    console.error('Update profile error:', error);
    
   
   if (error.code === 11000) {
      return res.status(409).json({ 
        message: 'Username already taken' 
      });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: error.message 
      });
    }
    
    return res.status(500).json({ message: 'Failed to update profile' });
  }
};

const getLeaderboard = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    if (page < 1) {
      return res.status(400).json({ message: 'Page must be >= 1' });
    }

    if (limit < 10 || limit > 100) {
      return res.status(400).json({ message: 'Limit must be between 10 and 100' });
    }

    // Get current user
    const user = await User.findById(req.user._id)
      .select('_id username fullName avatar totalProblemsSolved points streaks');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Calculate user's global rank
    const usersAhead = await User.countDocuments({
      $or: [
        { points: { $gt: user.points } },
        {
          points: user.points,
          totalProblemsSolved: { $gt: user.totalProblemsSolved }
        },
        {
          points: user.points,
          totalProblemsSolved: user.totalProblemsSolved,
          username: { $lt: user.username }
        }
      ]
    });

    const userWithRank = {
      ...user.toObject(),
      rank: usersAhead + 1
    };

    // Get leaderboard page
     const leaderboard = await User.find()
     .sort({
       points: -1,
       totalProblemsSolved: -1,
       username: 1
     })
     .skip(skip)
     .limit(limit)
  .select('_id username fullName avatar points totalProblemsSolved streaks');


    const total = await User.countDocuments();

    res.status(200).json({
      user: userWithRank,
      leaderboard: leaderboard.map((u, idx) => ({
        rank: skip + idx + 1,         
        _id: u._id,
        username: u.username,
        fullName: u.fullName,
        avatar: u.avatar,
        points: u.points || 0,
        solved: u.totalProblemsSolved || 0,
        currentStreak: u.streaks?.current || 0
      })),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({ message: 'Failed to fetch leaderboard' });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const user = await User.findById(userId)
      .select('username fullName avatar bio points totalProblemsSolved streaks')
      .populate('problemsSolved.problemId', 'title difficulty problemNo');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ message: 'Failed to fetch user profile' });
  }
};

const getUserSprints = async (req, res) => {
  try {
    const userId = req.user._id;

    const userSprints = await User.findById(userId)
      .select('bookmarks')
      .populate({
        path: 'bookmarks.problems',
        select: '_id problemNo title tags difficulty'
      });

    if (!userSprints) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      bookmarks: userSprints.bookmarks || []
    });

  } catch (error) {
    console.error('Get sprints error:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getMyProfile,
  updateProfile,
  getLeaderboard,
  getUserProfile,
  getUserSprints  
};

