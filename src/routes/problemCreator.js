const express = require('express');
const problemRouter =  express.Router();
const adminMiddleware = require("../middleware/adminMiddleware")
const {createProblem ,updateProblem, deleteProblem,getProblemById, getAllProblem,solvedAllProblembyUser,submittedProblem}= require("../controllers/userProblem");
const userMiddleware = require("../middleware/userMiddleware");
const createRateLimiter = require("../middleware/rateLimiterMiddleware");



// Create
// fetch
// update
// delete 

//only admins can access first three
// Admin operations - bit strict
problemRouter.post("/create", adminMiddleware, createRateLimiter(3600, 20), createProblem);
problemRouter.put("/update/:id", adminMiddleware, createRateLimiter(3600, 30), updateProblem);
problemRouter.delete("/:id", adminMiddleware, createRateLimiter(86400, 30), deleteProblem);

// User read operations - moderate limits
problemRouter.get("/problemById/:id", userMiddleware, createRateLimiter(60, 30), getProblemById);
problemRouter.get("/getAllProblem", userMiddleware, createRateLimiter(60, 20), getAllProblem);
problemRouter.get("/problemSolvedbyUser", userMiddleware, createRateLimiter(300, 10), solvedAllProblembyUser);
problemRouter.get("/submittedProblem/:pid", userMiddleware, createRateLimiter(300, 15), submittedProblem);


module.exports = problemRouter;


