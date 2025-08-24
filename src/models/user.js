const mongoose = require('mongoose');
const {Schema}= mongoose;

const UserSchema = new Schema({
    firstName:{
        type:String,
        required:true,
        minLength:3,
        maxLength:20
    },
    lastName:{
        type:String,
        minLength:3,
        maxLength:20
    },
    emailId:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
        immutable:true
    },
    age:{
        type:Number,
        min:6,
        max:80,
    },
    role:{
        type:String,
        enum:["user","admin"],
        default:"user"
    },
    password:{
        type:String,
        required:true
    },
    problemSolved:{
        type:[{
            type:Schema.Types.ObjectId,
            ref:'problem'
        }]  ,
                    // all unique solved problem
    }
},
 {
  timestamps:true  
 });

 const User = mongoose.model("user",UserSchema);
 module.exports=User;