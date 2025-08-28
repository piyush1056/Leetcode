const redisClient = require("../config/redis");
const User = require("../models/user");
const validate = require("../utils/validator")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Submission = require("../models/submission")

//create all userAuth Route fucntions:

const register = async(req,res) =>{
  
    try {
       
        const {firstName,emailId,password} = req.body;

      // validate the data
        validate(req.body);
          
        req.body.role = "user";   //by default is route ye role "user" hoga

        req.body.password = await bcrypt.hash(password,10);

        const user = await User.create(req.body);

        //once registerd, send  token
        const token = jwt.sign({_id:user.id, emailId:emailId ,role:'user'},process.env.SECRET_KEY,{expiresIn: 3600}); //in sec

      res.cookie("token", token, {
            httpOnly: true,
            secure: false,         // since im on localhost (http)
            sameSite: "strict",
            maxAge: 60 * 60 * 1000 
       });

        
        const reply = {
            firstName:user.firstName,
            emailId:user.emailId,
            _id:user._id
        }

        res.status(201).json({
            user:reply,
            message:"Registered Successfully"
        });

   } 
   
   catch (error) {
    res.status(400).send("Error:"+error)
    
   }
}

const login = async(req,res)=>{

    try {
        
        const {emailId,password} = req.body;

        if(!emailId)
            throw new Error("Invalid Credential")
        if(!password)
            throw new Error("Invalid Credential");

        const user = await User.findOne({emailId});

        const isMatch = await bcrypt.compare(password,user.password);

        if(!isMatch)
            throw new Error("Invalid password");

        //once logined , send  token
        const token = jwt.sign({_id:user.id, emailId:emailId,role:user.role},process.env.SECRET_KEY,{expiresIn: 3600}); 

      res.cookie("token", token, {
            httpOnly: true,
            secure: false,         
            sameSite: "strict",
            maxAge: 60 * 60 * 1000 
       });

        
        const reply = {
            firstName:user.firstName,
            emailId:user.emailId,
            _id:user._id
        }
        res.status(201).json({
            user:reply,
            message:"Loggined successfully"
        })

    } 
    catch (error) {
        res.status(401).send("Error:"+error);
        
    }
}

const logout = async(req,res)=>{

    try {
        
        //token add to redis blocklist
        //clear cookies and send null
       
        const {token}  = req.cookies;
        const payload = jwt.decode(token);

        await redisClient.set(`token:${token}`, "Blocked");
        await redisClient.expireAt(`token:${token}`,payload.exp);

        res.cookie("token" ,null,{expires: new Date(Date.now())});

        res.send("logged out succesfully");

    } 
    catch (error) {
       res.status(503).send("Error:"+error);
    }
}

const adminRegister = async (req,res)=>
{
     try {
       
        const {firstName,emailId,password} = req.body;

      // validate the data
        validate(req.body);
          
        req.body.role = "admin";  

        req.body.password = await bcrypt.hash(password,10);

        const user = await User.create(req.body);

        //once registerd, send  token
        const token = jwt.sign({_id:user.id, emailId:emailId ,role:user.role},process.env.SECRET_KEY,{expiresIn: 3600}); 

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,         // since im on localhost (http)
            sameSite: "strict",
            maxAge: 60 * 60 * 1000 
       });

        res.status(201).send("User registerd successfully");

   } 
   
   catch (error) {
    res.status(400).send("Error:"+error)
    
   }
}


const deleteProfile = async(req,res)=>{
  
    try {
    
         const userId = req.result._id;
         //userSchema delete
         await User.findByIdAndDelete(userId); 

         //Delete from submission too that user's all submission
        await Submission.deleteMany({userId});

      res.status(200).send("deleted Successfully");

  }
   catch (error) {
       res.status(500).send("Internal Server Error");
  }
}

module.exports = {register,login,logout,adminRegister,deleteProfile};