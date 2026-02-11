const mongoose = require('mongoose');
const {Schema} = mongoose;

const videoSchema = new Schema({
    problemId: {
        type: Schema.Types.ObjectId,
        ref: 'problem',
        required: true
    },
    userId: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
   },
   cloudinaryPublicId: {
    type: String,
    required: true,
    unique: true
  },
  secureUrl: {
    type: String,
    required: true
  },
  thumbnailUrl: {
    type: String
  },
  duration: {
    type: Number,
    required: true
  },
  title: {
     type: String,
     trim: true,
     maxLength: 100
    },

},{
    timestamps:true
});

videoSchema.index({ problemId: 1 });
videoSchema.index({ userId: 1 });
const SolutionVideo = mongoose.model("solutionVideo",videoSchema);

module.exports = SolutionVideo;