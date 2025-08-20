const express = require("express");
const authRouter = express.Router();
const {register,login,logout,adminRegister}= require("../controllers/userAuthent");
const userMiddleware = require("../middleware/userMiddleware");
const adminMiddleware= require("../middleware/adminMiddleware");



//Register
//Login
//Logout
//GetProfile

authRouter.post("/register",register);

authRouter.post("/login",login);

authRouter.post("/logout",userMiddleware,logout);

// authRouter.get("/getProfile",getProfile);

authRouter.post("/admin/register",adminMiddleware, adminRegister) //first verify if its admin,then he can register anyone

module.exports=authRouter;

//all these async fucntions will be defined in 'controllers' folder

