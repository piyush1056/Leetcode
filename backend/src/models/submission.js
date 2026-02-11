const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const submissionSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  problemId: {
    type: Schema.Types.ObjectId,
    ref: 'problem',
    required: true
  },
  code: {
    type: String,
    required: true
  },
  language: {
    type: String,
    required: true,
    enum: ['javascript', 'c++', 'java', 'python', 'c']
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'wrong', 'error','tle', 'runtime-error'],
    default: 'pending'
  },
  runtime: {
    type: Number,  
    default: 0,
    min:0
  },
  memory: {
    type: Number,  // kB
    default: 0,
    min:0
  },
  errorMessage: {
    type: String,
    default: ''
  },
  testCasesPassed: {
    type: Number,
    default: 0,
    min: 0
  },
  testCasesTotal: {    
    type: Number,
    default: 0,
    min: 0
  },
  pointsEarned: {
     type: Number,
     default: 0,
     min: 0
    },
    
  notes: {
     type: String,
     maxLength: 300,
     trim: true
    }
    
},
 { 
  timestamps: true
});

//compound indexing
submissionSchema.index({userId:1 , problemId:1});
submissionSchema.index({ userId: 1, createdAt: -1 });
submissionSchema.index({ problemId: 1, status: 1 });
submissionSchema.index({ status: 1 });

const Submission = mongoose.model('submission',submissionSchema);

module.exports = Submission;