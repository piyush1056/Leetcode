const mongoose = require("mongoose");
const Problem =require("../models/problem")

const doesProblemExist = async (req, res, next) => {
    try {
        const { problemId } = req.params;

        if (!problemId) {
            return res.status(400).json({
                success: false,
                message: "Problem ID is required."
            });
        }

        if (!mongoose.Types.ObjectId.isValid(problemId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Problem ID format."
            });
        }

        const problem = await Problem.findById(problemId);

        if (!problem) {
            return res.status(404).json({
                success: false,
                message: "Problem not found."
            });
        }

        req.problem = problem; // Attach to request
        next();

    } catch (error) {
        console.error('Problem validation error:', error);
        return res.status(500).json({
            success: false,
            message: "Failed to validate problem."
        });
    }
};

module.exports = { doesProblemExist };
