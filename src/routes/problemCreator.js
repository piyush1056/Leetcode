const express = require("express");
const problemRouter = express.Router();


//create
//fetch
//update
//delete

//admin access for first 3
problemRouter.post("/create",problemCreate);

problemRouter.patch("/:id",problemUpdate);

problemRouter.delete("/:id",problemDelete);



problemRouter.get("/:id",problemFetch);

problemRouter.get("/",getAllProblem);

problemRouter.get("/user",solvedProblem);


