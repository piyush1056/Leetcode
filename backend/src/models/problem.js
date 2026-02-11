const mongoose = require('mongoose');
const { Schema } = mongoose;

// Schema for comments
const commentSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    comment: {
        type: String,
        required: true,
        trim: true,
        minLength: 1,
        maxLength: 500
    }
}, { _id: true, timestamps: true });

// Schema for problems
const problemSchema = new Schema({
    title:{
        type:String,
        required:true,
        unique: true,
        trim: true,
        maxLength: 150
    },
    problemNo: {
        type: Number,
        required: true,
        unique: true,
        min: 1
    },
    description:{
        type:String,
        required:true,
         trim: true
    },

    difficulty:{
        type:String,
        required:true,
        enum :["easy","medium","hard","super-hard"],
        trim: true
    },

    tags:{
        type: [{
            type: String,
            enum: [
                "array", "maths", "strings", "graph", "DP", "trees",
                "linked-list", "stacks", "queues", "hash-maps",
                "sorting", "searching", "binary-search",
                "backtracking", "greedy", "heap",
                "bit-manipulation", "two-pointers",
                "sliding-window", "recursion", "other"
            ],
            trim: true
        }],
        required: true,
        validate: [arr => arr.length > 0, 'At least one tag is required']
    },

    acceptance: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    
    constraints: {
        type: [String],
        default: []
    },
    companies: {
        type: [String],
        default: []
    },
       hints: {
        type: [String],
        default: []
    },
     examples: [{
        input: {
            type: String,
            required: true,
            trim: true
        },
        output: {
            type: String,
            required: true,
            trim: true
        },
        explanation: {
            type: String,
            trim: true
        }
    }],
  
    visibleTestCases:[
        {
            input:{
                type:String,
                required:true,
                 trim: true
            },
            output:{
                type:String,
                required:true,
                 trim: true
            },
        
        }
    ],

    hiddenTestCases:[
        {
            input:{
                type:String,
                required:true,
                 trim: true
            },
            output:{
                type:String,
                required:true,
                 trim: true
            },
        }
    ],
    
    startCode:[{
        
        language:{
            type:String,
            required:true,
            enum: ['javascript', 'c++', 'java', 'python', 'c']
        },
         headerCode: {
            type: String,
            default: '',
            trim: true
        },
        initialCode:{
            type:String,
            required:true,
            trim:true
        },
         mainCode: {
            type: String,
            default: '',
            trim: true
        }

    }],

    referenceSolution:[{
        
        language:{
            type:String,
            required:true,
             enum: ['javascript', 'c++', 'java', 'python', 'c']
        }, 
        completeCode:{
            type:String,
            required:true,
            trim: true
        }
    }],

  
    problemCreator:{
        type:Schema.Types.ObjectId,
        ref:'user',                 
        required:true

    },
      likes: {
        type: Number,
        default: 0,
        min: 0
    },
    likedBy: [{
    type: Schema.Types.ObjectId,
    ref: 'user'
}],

      comments: [commentSchema]
},
   {
    timestamps: true
}
);

const Problem = mongoose.model('problem',problemSchema);
module.exports=Problem;