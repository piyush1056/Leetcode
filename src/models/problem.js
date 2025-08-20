const mongoose = require('mongoose');
const { Schema } = mongoose;

const problemSchema = new Schema({
    title:{
        type:String,
        required:true
    },

    description:{
        type:String,
        required:true
    },

    difficulty:{
        type:String,
        required:true,
        enum :["easy","medium","hard","super hard"]
    },

    tags:{
        type:String,
        enum:["array","maths","strings","graph","DP","trees"],
        required:true

    }, 

    //array format for test cases,has many test cases
    visibleTestCases:[
        {
            input:{
                type:String,
                required:true,
            },
            output:{
                type:String,
                required:true
            },
            explanation:{
                type:String,
                required:true
            }
        }
    ],

    hiddenTestCases:[
        {
            input:{
                type:String,
                required:true,
            },
            output:{
                type:String,
                required:true
            },
        }
    ],
    
    startCode:[{
        
        language:{
            type:String,
            required:true
        },
        initialCode:{
            type:String,
            required:true
        }
    }],
  //who created this question
    problemCreator:{
        type:Schema.Types.ObjectId,
        ref:'user',                 //user Schema se admin ka id layega
        required:true

    }
})

const Problem = mongoose.model('problem',problemSchema);
module.exports=Problem;