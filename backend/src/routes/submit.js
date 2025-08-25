const express = require("express");
const submitRouter = express.Router();
const userMiddleware = require("../middleware/userMiddleware");
const {submitCode,runCode} = require("../controllers/userSubmission");
const createRateLimiter = require("../middleware/rateLimiterMiddleware");

submitRouter.post("/submit/:id", userMiddleware, createRateLimiter(60, 10), submitCode);
submitRouter.post("/run/:id", userMiddleware, createRateLimiter(60, 15), runCode);

module.exports = submitRouter;
