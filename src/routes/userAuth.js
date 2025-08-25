const express = require("express");
const authRouter = express.Router();
const {register,login,logout,adminRegister,deleteProfile}= require("../controllers/userAuthent");
const userMiddleware = require("../middleware/userMiddleware");
const adminMiddleware= require("../middleware/adminMiddleware");
const createRateLimiter = require("../middleware/rateLimiterMiddleware");



//Register
//Login
//Logout
//GetProfile



authRouter.post("/register", createRateLimiter(3600, 3), register);
authRouter.post("/login", createRateLimiter(900, 5), login);
authRouter.post("/logout", userMiddleware, logout);
authRouter.post("/admin/register", adminMiddleware, createRateLimiter(86400, 1), adminRegister);
authRouter.delete('/profile', userMiddleware, createRateLimiter(86400, 3), deleteProfile);

// authRouter.get("/getProfile",getProfile);

module.exports=authRouter;


