const mongoose = require("mongoose");
const { getLanguageId, submitBatch, submitToken,mapJudge0Status,buildFullSourceCode} = require("../utils/judge0Helper");
const Problem = require("../models/problem");
const Submission = require("../models/submission");
const User = require("../models/user");
const { updateStreaks } = require('../utils/utils'); 


const getPoints = (difficulty) => {
  const map = {
    easy: 10,
    medium: 20,
    hard: 30,
    "super-hard": 50
  };
  return map[difficulty.toLowerCase()] || 10;
};

const submitCode = async (req, res) => {
    const userId = req.user._id;
    const problemId = req.params.id;
    let { code, language: lang } = req.body;

    if (!userId || !problemId || !code || !lang) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    const language = lang.toLowerCase();
    let submission = null; // important for safe error handling

    try {
        // 1️ Fetch Problem
        const problem = await Problem.findById(problemId);
        if (!problem) {
            return res.status(404).json({ message: "Problem not found" });
        }

        const languageId = getLanguageId(language);
        if (!languageId) {
            return res.status(400).json({ message: "Unsupported language" });
        }

        // 2️ Create Pending Submission
        submission = await Submission.create({
            userId,
            problemId,
            code,
            language,
            status: "pending",
            testCasesTotal: problem.hiddenTestCases.length
        });

        // 3️ Prepare Full Code
        const fullSourceCode = buildFullSourceCode({
            problem,
            language,
            userCode: code
        });

        const batchSubmissions = problem.hiddenTestCases.map(tc => ({
            source_code: fullSourceCode,
            language_id: languageId,
            stdin: tc.input,
            expected_output: tc.output
        }));

        // 4️ Send to Judge0
        const submitResult = await submitBatch(batchSubmissions);
        const tokens = submitResult.map(s => s.token);
        const results = await submitToken(tokens);

        // 5️ Process Results
        let passedTestCases = 0;
        let runtime = 0;
        let memory = 0;
        let finalStatus = "accepted";
        let errorMessage = null;

        for (const test of results) {
            if (test.status.id === 3) {
                passedTestCases++;
                runtime += parseFloat(test.time || 0);
                memory = Math.max(memory, test.memory || 0);
            } else {
                finalStatus = mapJudge0Status(test.status.id);

                if (test.status.id === 5) {
                    errorMessage = "Time Limit Exceeded";
                } else if (test.status.id === 4) {
                    errorMessage = `Wrong Answer\nInput: ${test.stdin}\nOutput: ${test.stdout}\nExpected: ${test.expected_output}`;
                } else {
                    errorMessage = test.compile_output || test.stderr || "Runtime Error";
                }

                break; // stop on first failure
            }
        }

        // 6️ Update Submission
        submission.status = finalStatus;
        submission.testCasesPassed = passedTestCases;
        submission.runtime = runtime;
        submission.memory = memory;
        submission.errorMessage = errorMessage;

        let earnedPoints = 0;

        // 7️ Update User (if accepted)
        if (finalStatus === "accepted") {
            const user = await User.findById(userId);

            const alreadySolved = user.problemsSolved.some(p =>
                p.problemId.equals(problemId)
            );

            if (!alreadySolved) {
                earnedPoints = getPoints(problem.difficulty);

                user.problemsSolved.push({
                    problemId,
                    language,
                    solvedAt: new Date(),
                    pointsEarned: earnedPoints
                });

                user.points = (user.points || 0) + earnedPoints;
                user.totalProblemsSolved =
                    (user.totalProblemsSolved || 0) + 1;

                if (!user.streaks) {
                    user.streaks = {
                        current: 0,
                        longest: 0,
                        lastUpdated: new Date()
                    };
                }

                user.streaks = updateStreaks(user.streaks);

                await user.save();
            }
        }

        submission.pointsEarned = earnedPoints;
        await submission.save();

        // 8️  Update Acceptance Rate
        const totalSubmissions = await Submission.countDocuments({
            problemId,
            status: { $ne: "pending" }
        });

        const acceptedSubmissions = await Submission.countDocuments({
            problemId,
            status: "accepted"
        });

        const acceptanceRate =
            totalSubmissions === 0
                ? 0
                : Math.round(
                      (acceptedSubmissions / totalSubmissions) * 100
                  );

        await Problem.findByIdAndUpdate(problemId, {
            acceptance: acceptanceRate
        });

        // 9️  Return Response
        return res.status(201).json({
            accepted: finalStatus === "accepted",
            totalTestCases: submission.testCasesTotal,
            testCasesPassed: passedTestCases,
            runtime,
            memory,
            status: finalStatus,
            pointsEarned: earnedPoints,
            errorMessage
        });

    } catch (error) {
        console.error("submitCode error:", error);

        //  Prevent submission from staying "pending"
        if (submission) {
            submission.status = "error";
            submission.errorMessage = "Internal server error";
            await submission.save();
        }

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

const runCode = async (req, res) => {
 
    const userId = req.user._id;
    const problemId = req.params.id;
    let { code, language: lang } = req.body;

    if (!userId || !problemId || !code || !lang) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    const language = lang.toLowerCase() === "cpp" ? "c++" : lang.toLowerCase();

    try {
        const problem = await Problem.findById(problemId);
        if (!problem) return res.status(404).json({ message: "Problem not found" });

        const languageId = getLanguageId(language);
        if (!languageId) return res.status(400).json({ message: "Unsupported language" });

        // Uses the FIX from judge0Helper
        const fullSourceCode = buildFullSourceCode({ problem, language, userCode: code });

        const batchSubmissions = problem.visibleTestCases.map(tc => ({
            source_code: fullSourceCode,
            language_id: languageId,
            stdin: tc.input,
            expected_output: tc.output
        }));

        const submitResult = await submitBatch(batchSubmissions);
        const tokens = submitResult.map(s => s.token);
        const results = await submitToken(tokens);

        let passedTestCases = 0;
        let runtime = 0;
        let memory = 0;
        let success = true;
        let errorMessage = null;

        for (const test of results) {
            if (test.status.id === 3) {
                passedTestCases++;
                runtime += parseFloat(test.time || 0);
                memory = Math.max(memory, test.memory || 0);
            } else {
                success = false;
                if (test.status.id === 5) errorMessage = "Time Limit Exceeded";
                else if (test.status.id === 4) errorMessage = `Wrong Answer\nInput: ${test.stdin}\nOutput: ${test.stdout}\nExpected: ${test.expected_output}`;
                else errorMessage = test.compile_output || test.stderr || "Runtime Error";
                break;
            }
        }

        res.status(200).json({
            success,
            totalTestCases: results.length,
            testCasesPassed: passedTestCases,
            runtime,
            memory,
            errorMessage,
            testDetails: results.map(t => ({
                input: t.stdin,
                expected: t.expected_output,
                output: t.stdout,
                status: t.status.id === 3 ? "accepted" : "failed",
                error: t.status.id !== 3 ? (t.compile_output || t.stderr || t.status.description) : null
            }))
        });

    } catch (error) {
        console.error("runCode error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
const getAllSubmissionsByProblem = async (req, res) => {
  try {
    const { problemId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(problemId)) {
      return res.status(400).json({ message: 'Invalid Problem ID' });
    }

    const submissions = await Submission.find({ 
      userId: req.user._id, 
      problemId 
    }).sort({ createdAt: -1 });

    res.status(200).json(submissions);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getSubmissions = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const submissions = await Submission.find({ userId: req.user._id })
      .populate('problemId', 'title difficulty')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Submission.countDocuments({ userId: req.user._id });

    res.status(200).json({
      submissions,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};


const getTotalSubmissionsCount = async (req, res) => {
  try {
    const count = await Submission.countDocuments({ userId: req.user._id });
    res.status(200).json({ totalSubmissions: count });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  submitCode,
  runCode,
  getAllSubmissionsByProblem,
  getSubmissions,
  getTotalSubmissionsCount
};