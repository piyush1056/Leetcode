const jwt=require("jsonwebtoken");
const User = require("../models/user");
const redisClient = require("../config/redis");



const adminMiddleware= async (req,res,next)=>{
 
    try {
        const {token} = req.cookies;

        if(!token)
            throw new Error("Invalid token");

       const payload =  jwt.verify(token,process.env.SECRET_KEY);
      
       const {_id} = payload;

       if(!_id)
          throw new Error("Id is missing");


       const result = await User.findById(_id);
       
  //checck for admin
       if(payload.role!="admin") 
        throw new Error("Invalid token");

      if(!result)
          throw new Error("User doesnt exist");

      
      
      const isBlocked = await redisClient.exists(`token:${token}`);

      if(isBlocked)
        throw new Error("Invalid token");
     
     res.result=result;

     next();


    } 
    catch (error) {
         throw new Error("Error:"+ error);
        
    }
}
module.exports = adminMiddleware;