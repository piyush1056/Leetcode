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
         required: function() {
            // Password only required for local auth users
            return this.provider === 'local';
        }
    },
    problemSolved:{
        type:[{
            type:Schema.Types.ObjectId,
            ref:'problem'
        }]  ,
                    // all unique solved problem
    },
     // New fields for OAuth
  googleId: { type: String, unique: true, sparse: true },
  provider: { type: String, enum: ['local','google'], default: 'local' },
  avatar:   { type: String }  ,
  emailVerified: {
        type: Boolean,
        default: false
    }
},
 {
  timestamps:true  
 });

//  UserSchema.index({ emailId: 1 });
//  UserSchema.index({ googleId: 1 });
 const User = mongoose.model("user",UserSchema);
 module.exports=User;