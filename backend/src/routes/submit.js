const express = require("express");
const submissionRouter = express.Router();
const { verifyToken, loadUser } = require('../middleware/auth');
const {submitCode,runCode,getAllSubmissionsByProblem, getSubmissions,  getTotalSubmissionsCount } = require("../controllers/userSubmission");
const createRateLimiter = require("../middleware/rateLimiterMiddleware");

submissionRouter.post('/submit/:id', verifyToken, loadUser, createRateLimiter(60,10), submitCode);
submissionRouter.post('/run/:id', verifyToken, loadUser, createRateLimiter(60,15), runCode);

submissionRouter.get('/', verifyToken, loadUser, getSubmissions);
submissionRouter.get('/totalCount', verifyToken, loadUser, getTotalSubmissionsCount);
submissionRouter.get('/:problemId', verifyToken, loadUser, getAllSubmissionsByProblem);

module.exports = submissionRouter;