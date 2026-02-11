const express = require('express');
const { verifyToken, loadUser, isAdmin } = require('../middleware/auth');
const videoRouter =  express.Router();
const {generateUploadSignature,saveVideoMetadata,deleteVideo } = require("../controllers/videoSection")

videoRouter.get("/upload/:problemId", verifyToken, loadUser, isAdmin, generateUploadSignature);
videoRouter.post("/save/:problemId", verifyToken, loadUser, isAdmin, saveVideoMetadata);
videoRouter.delete("/delete/:problemId", verifyToken, loadUser, isAdmin, deleteVideo);


module.exports = videoRouter;