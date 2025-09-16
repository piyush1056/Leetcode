const express = require('express');
const aiRouter =  express.Router();
const userMiddleware = require("../middleware/userMiddleware");
const solveDoubt = require('../controllers/solveDoubt');
const createRateLimiter = require("../middleware/rateLimiterMiddleware");

aiRouter.post('/chat', userMiddleware, createRateLimiter(60, 10), solveDoubt);

module.exports = aiRouter;