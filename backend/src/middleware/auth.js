const jwt = require("jsonwebtoken");
const redisClient = require("../config/redis");
const User = require("../models/user");
const CustomError = require("../utils/CustomError");


const verifyToken = async (req, res, next) => {
    try {
        const token = req.cookies?.token;
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Authentication required. No token provided."
            });
        }

        // Verify JWT
        const payload = jwt.verify(token, process.env.SECRET_KEY);
        
        if (!payload._id) {
            throw new CustomError("Invalid token payload", 401);
        }

        // Check if token is in Redis blocklist
        const isBlocked = await redisClient.exists(`token:${token}`);
        
        if (isBlocked===1) {
            return res.status(401).json({
                success: false,
                message: "Token has been invalidated."
            });
        }

        // Attach payload and token to request
        req.userId = payload._id;
        req.userRole = payload.role;
        req.token = token;

        next();

    } catch (error) {
        if (
         error.name === 'JsonWebTokenError' ||
         error.name === 'TokenExpiredError'
       ) {
          return res.status(401).json({
          success: false,
          message: 'Invalid or expired token'
         });
      }

        console.error('Token verification error:', error);
        return res.status(500).json({
         success: false,
          message: 'Internal server error'
       });
     }
};


const loadUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId).select('-password');

        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User account not found."
            });
        }

        req.user = user; 
        next();

    } catch (error) {
        console.error('Load user error:', error);
        return res.status(500).json({
            success: false,
            message: "Failed to load user data."
        });
    }
};


const isAdmin = (req, res, next) => {
     if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: "Access denied. Admin privileges required."
        });
    }
    next();
};

module.exports = { verifyToken, loadUser, isAdmin };
