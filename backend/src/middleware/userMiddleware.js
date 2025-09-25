const jwt=require("jsonwebtoken");
const User = require("../models/user");
const redisClient = require("../config/redis");



const userMiddleware= async (req,res,next)=>{
 
    try {
        const {token} = req.cookies;

        if(!token)
         {
            return res.status(401).json({
                success: false,
                message: "Authentication required. No token provided."
            });
        }

       const payload =  jwt.verify(token,process.env.SECRET_KEY);
      
       const {_id} = payload;

       if(!_id)
          throw new Error("Id is missing");


       const result = await User.findById(_id);

      if(!result)
          throw new Error("User doesnt exist");

      //check if token present in block list

      const isBlocked = await redisClient.exists(`token:${token}`);

      if(isBlocked)
        if (isBlocked) {
            return res.status(401).json({
                success: false,
                message: "Token has been invalidated."
            });
        }

     
     req.result=result;

     next();


    } 
    catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: "Invalid token."
            });
        }
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: "Token has expired."
            });
        }

        // Handle other errors
        console.error('UserMiddleware Error:', error);
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
        
    }
}
module.exports = userMiddleware;