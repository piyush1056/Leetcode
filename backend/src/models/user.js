const mongoose = require('mongoose');
const {Schema}= mongoose;


// Streak tracking subdocument
const streakSchema = new Schema({
    current: {
        type: Number,
        default: 0,
        min: 0
    },
    longest: {
        type: Number,
        default: 0,
        min: 0
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
}, { _id: false });

// Solved problems with metadata
const solvedProblemSchema = new Schema({
    problemId: {
        type: Schema.Types.ObjectId,
        ref: 'problem',
        required: true
    },
    solvedAt: {
        type: Date,
        default: Date.now
    },
    language: {
        type: String,
        enum: ['javascript', 'c++', 'java', 'python', 'c']
    },
    pointsEarned: {        
        type: Number,
        default: 0,
        min: 0
    }
}, { _id: false });


const UserSchema = new Schema({
    fullName: {
     type: String,
     required: true,
     minLength: 3,
     maxLength: 50,
     trim: true
   },
  username: {
        type: String,
        unique: true,
        sparse: true,  // Allows null for OAuth users initially
        minLength: 3,
        maxLength: 20,
        trim: true,
        lowercase: true
    },
    
    emailId:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
        immutable:true
    },
    
    role:{
        type:String,
        enum:["user","admin"],
        default:"user"
    },
    bio: {
    type: String,
    maxLength: 300,
    trim: true
  },

    password:{
        type:String,
         required: function() {
            // Password only required for local auth users
            return this.provider === 'local';
        }
    },
    problemsSolved: {
        type: [solvedProblemSchema],
        default: []
    },
    totalProblemsSolved: {
        type: Number,
        default: 0,
        min: 0
    },
    favouriteProblems: [{
        type: Schema.Types.ObjectId,
        ref: 'problem'
    }],
    
    likedProblems: [{
        type: Schema.Types.ObjectId,
        ref: 'problem'
    }],
    points: {
        type: Number,
        default: 0,
        min: 0
    },
    streaks: {
        type: streakSchema,
         default: () => ({ current: 0, longest: 0, lastUpdated: new Date() })
    },
    bookmarks: [{
    name: {
        type: String,
        required: true,
        trim: true
    },
    problems: [{
        type: Schema.Types.ObjectId,
        ref: 'problem'
    }]
}],

  
  googleId: { type: String, unique: true, sparse: true },
  provider: { type: String, enum: ['local','google'], default: 'local' },
  avatar:   { type: String,default: null }  ,
  emailVerified: {
        type: Boolean,
        default: false
    }
},
 {
  timestamps:true  
 });

UserSchema.index({ points: -1 });  // For leaderboard queries
UserSchema.index({ totalProblemsSolved: -1 });
 const User = mongoose.model("user",UserSchema);
 module.exports=User;