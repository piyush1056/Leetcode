const cloudinary = require('cloudinary').v2;
const Problem = require("../models/problem");
const SolutionVideo = require("../models/solutionVideo");
const mongoose = require('mongoose');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});


const generateUploadSignature = async (req, res) => {
  try {
    const { problemId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(problemId)) {
      return res.status(400).json({ message: "Invalid Problem ID" });
    }

    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    // 2. Enforce "One Video Per Problem"
    const existingVideo = await SolutionVideo.findOne({ problemId });
    if (existingVideo) {
      return res.status(409).json({ 
        message: 'A video solution already exists. Please delete it before uploading a new one.' 
      });
    }

    const userId = req.user._id;
    const timestamp = Math.round(new Date().getTime() / 1000);
    
    const publicId = `CodeClimb-solutions/${problemId}/${userId}_${timestamp}`;
    
    const uploadParams = {
      timestamp: timestamp,
      public_id: publicId,
    };

    const signature = cloudinary.utils.api_sign_request(
      uploadParams,
      process.env.CLOUDINARY_API_SECRET
    );

    res.json({
      signature,
      timestamp,
      public_id: publicId,
      api_key: process.env.CLOUDINARY_API_KEY,
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      upload_url: `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/video/upload`,
    });

  } catch (error) {
    console.error('Error generating signature:', error);
    res.status(500).json({ message: 'Failed to generate upload credentials' });
  }
};


const saveVideoMetadata = async (req, res) => {
  try {
    const { problemId } = req.params; 
    
    const {
      cloudinaryPublicId,
      secureUrl,
      duration,
    } = req.body;

    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(problemId)) {
      return res.status(400).json({ message: "Invalid Problem ID" });
    }

    // 1. Verify Cloudinary Resource actually exists
    const cloudinaryResource = await cloudinary.api.resource(
      cloudinaryPublicId,
      { resource_type: 'video' }
    );

    if (!cloudinaryResource) {
      return res.status(400).json({ message: 'Video not found on Cloudinary' });
    }

    // 2. Final check for duplicates 
    const existingVideo = await SolutionVideo.findOne({ problemId });

    if (existingVideo) {
      // Cleanup the orphaned file on Cloudinary since we can't save it
      await cloudinary.uploader.destroy(cloudinaryPublicId, { resource_type: 'video' });
      return res.status(409).json({ message: 'Video already exists for this problem' });
    }

    const thumbnailUrl = cloudinary.url(cloudinaryPublicId, {
      resource_type: 'video',  
      transformation: [
        { width: 400, height: 225, crop: 'fill' },
        { quality: 'auto' },
        { start_offset: 'auto' }  
      ],
      format: 'jpg'
    });

    const videoSolution = new SolutionVideo({
      problemId,
      userId,
      cloudinaryPublicId,
      secureUrl,
      duration: cloudinaryResource.duration || duration,
      thumbnailUrl
    });

    await videoSolution.save();

    res.status(201).json({
      message: 'Video solution saved successfully',
      videoSolution
    });

  } catch (error) {
    console.error('Save video metadata error:', error);
    res.status(500).json({ message: 'Failed to save video metadata' });
  }
};

const deleteVideo = async (req, res) => {
  try {
    const { problemId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(problemId)) {
      return res.status(400).json({ message: "Invalid Problem ID" });
    }

    const video = await SolutionVideo.findOne({ problemId });
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    

    // 1. Remove from Cloudinary
    await cloudinary.uploader.destroy(video.cloudinaryPublicId, {
      resource_type: 'video',
      invalidate: true,
    });

    // 2. Remove from DB
    await SolutionVideo.findByIdAndDelete(video._id);

    res.json({ message: 'Video deleted successfully' });

  } catch (error) {
    console.error('Error deleting video:', error);
    res.status(500).json({ message: 'Failed to delete video' });
  }
};

module.exports = {
  generateUploadSignature,
  saveVideoMetadata,
  deleteVideo
};
