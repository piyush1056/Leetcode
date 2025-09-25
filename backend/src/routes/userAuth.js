const express = require("express");
const authRouter = express.Router();
const {
    register,         
    login,             
    logout,             
    googleAuth,        
    promoteToAdmin,    
    getAllUsers,       
    deleteProfile      
} = require("../controllers/userAuthent");

const userMiddleware = require("../middleware/userMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const createRateLimiter = require("../middleware/rateLimiterMiddleware");
const { verifyGoogleToken } = require("../middleware/googleAuth"); 

// Public routes - SINGLE INTERFACE FOR EVERYONE
authRouter.post("/register", createRateLimiter(3600, 3), register);
authRouter.post("/login", createRateLimiter(900, 15), login);
authRouter.post("/google-auth", createRateLimiter(900, 10), verifyGoogleToken, googleAuth); // New Google OAuth route

// Protected routes
authRouter.post("/logout", userMiddleware, logout);
authRouter.delete('/profile', userMiddleware, createRateLimiter(86400, 3), deleteProfile);


authRouter.get('/check', userMiddleware, (req, res) => {
    const reply = {
        firstName: req.result.firstName,
        lastName: req.result.lastName,      
        emailId: req.result.emailId,
        _id: req.result._id,
        role: req.result.role,              
        avatar: req.result.avatar,          
        provider: req.result.provider,      
        emailVerified: req.result.emailVerified 
    }
    res.status(200).json({ user: reply, message: "valid user" })
});

// Admin-only routes 
authRouter.post('/admin/promote-user', adminMiddleware, createRateLimiter(86400, 10), promoteToAdmin);
authRouter.get('/admin/users', adminMiddleware, createRateLimiter(3600, 30), getAllUsers);

module.exports = authRouter;


