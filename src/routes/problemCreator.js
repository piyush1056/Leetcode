const express = require('express');
const problemRouter =  express.Router();
const adminMiddleware = require("../middleware/adminMiddleware")
const {createProblem ,updateProblem, deleteProblem,getProblemById, getAllProblem}= require("../controllers/userProblem");
const userMiddleware = require("../middleware/userMiddleware");



// Create
// fetch
// update
// delete 

//only admins can access first three
problemRouter.post("/create",adminMiddleware ,createProblem);
problemRouter.put("/update/:id", adminMiddleware ,updateProblem);
problemRouter.delete("/:id",adminMiddleware ,deleteProblem);


problemRouter.get("/problemById/:id",userMiddleware,getProblemById);
problemRouter.get("/getAllProblem",userMiddleware, getAllProblem);
// problemRouter.get("/problemSolvedbyUser", userMiddleware, solvedAllProblembyUser);


module.exports = problemRouter;


