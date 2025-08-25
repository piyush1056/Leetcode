const jwt=require("jsonwebtoken");
const User = require("../models/user");
const redisClient = require("../config/redis");



const userMiddleware= async (req,res,next)=>{
 
    try {
        const {token} = req.cookies;

        if(!token)
            throw new Error("Invalid token");

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
        throw new Error("Invalid token");
     
     req.result=result;

     next();


    } 
    catch (error) {
         throw new Error("Error:"+ error);
        
    }
}
module.exports = userMiddleware;