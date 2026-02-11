const mongoose = require("mongoose");
const { getLanguageId, submitBatch, submitToken } = require("../utils/judge0Helper");
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

  const language = lang.toLowerCase() === "cpp" ? "c++" : lang.toLowerCase();
  let session = null;

  try {
     // Start MongoDB transaction to keep submission + user + problem updates atomic
    session = await mongoose.startSession();
    session.startTransaction();

    const problem = await Problem.findById(problemId).session(session);
    if (!problem) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Problem not found" });
    }

    //  Save initial submission with "pending" status
    const submission = new Submission({
      userId,
      problemId,
      code,
      language,
      status: "pending",
      testCasesTotal: problem.hiddenTestCases.length
    });
    await submission.save({ session });

    const languageId = getLanguageId(lang);
    if (!languageId) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Unsupported language" });
    }
    // Send hidden test cases to Judge0 for evaluation
    const batchSubmissions = problem.hiddenTestCases.map(tc => ({
      source_code: code,
      language_id: languageId,
      stdin: tc.input,
      expected_output: tc.output
    }));

    const submitResult = await submitBatch(batchSubmissions);
    const tokens = submitResult.map(s => s.token);
    const results = await submitToken(tokens);
    
    // Aggregate Judge0 results
    let passedTestCases = 0;
    let runtime = 0;
    let memory = 0;
    let finalStatus = "accepted";
    let errorMessage = null;

    for (const test of results) {
      const statusId = test.status?.id;

      if (statusId === 3) {
        passedTestCases++;
        runtime += parseFloat(test.time || 0);
        memory = Math.max(memory, test.memory || 0);
      } else {
        // Map Judge0 failure codes to internal status
        switch (statusId) {
          case 4:
            finalStatus = "wrong";
            errorMessage = `Input: ${test.stdin}\nOutput: ${test.stdout}\nExpected: ${test.expected_output}`;
            break;
          case 5:
            finalStatus = "tle";
            errorMessage = "Time Limit Exceeded";
            break;
          case 6:
            finalStatus = "error";
            errorMessage = test.compile_output || test.stderr;
            break;
          case 7:
          case 8:
          case 9:
          case 10:
          case 11:
          case 12:
            finalStatus = "runtime-error";
            errorMessage = test.stderr || "Runtime Error";
            break;
          default:
            finalStatus = "error";
            errorMessage = test.stderr || "Unknown Error";
        }
        break;
      }
    }
  // Update submission with final evaluation results
    submission.status = finalStatus;
    submission.testCasesPassed = passedTestCases;
    submission.runtime = runtime;
    submission.memory = memory;
    submission.errorMessage = errorMessage;
    await submission.save({ session });

    // ACCEPTANCE CALCULATION 
    const totalSubmissions = await Submission.countDocuments(
      { problemId, status: { $ne: "pending" } },
      { session }
    );

    const acceptedSubmissions = await Submission.countDocuments(
      { problemId, status: "accepted" },
      { session }
    );

    const acceptanceRate =
      totalSubmissions === 0
        ? 0
        : Math.round((acceptedSubmissions / totalSubmissions) * 100);

    await Problem.findByIdAndUpdate(
      problemId,
      { acceptance: acceptanceRate },
      { session }
    );

    let earnedPoints = 0;
    
    if (finalStatus === "accepted") {
      const user = await User.findById(userId).session(session);

      const solvedIndex = user.problemsSolved.findIndex(p =>
        p.problemId.equals(problemId)
      );

      if (solvedIndex === -1) {
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
          user.streaks = { current: 0, longest: 0, lastUpdated: new Date() };
        }

        user.streaks = updateStreaks(user.streaks);
        await user.save({ session });

        submission.pointsEarned = earnedPoints;
        await submission.save({ session });
      }
    }

    await session.commitTransaction();
    session.endSession();

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
    if (session && session.inTransaction()) {
      await session.abortTransaction();
      session.endSession();
    }
    console.error("submitCode error:", error);
    return res.status(500).json({ message: "Internal server error" });
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
    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    const languageId = getLanguageId(lang);
    if (!languageId) {
      return res.status(400).json({ message: "Unsupported language" });
    }

    // Prepare batch for Visible Test Cases
    const batchSubmissions = problem.visibleTestCases.map(tc => ({
      source_code: code,
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
      if (test.status.id === 3) { // Accepted
        passedTestCases++;
        runtime += parseFloat(test.time || 0);
        memory = Math.max(memory, test.memory || 0);
      } else {
        success = false;
        // Improve error messaging for TLE / Wrong Answer
        if (test.status.id === 5) {
            errorMessage = "Time Limit Exceeded";
        } else if (test.status.id === 4) {
            errorMessage = `Wrong Answer\nInput: ${test.stdin}\nOutput: ${test.stdout}\nExpected: ${test.expected_output}`;
        } else {
            errorMessage = test.compile_output || test.stderr || "Runtime Error";
        }
        break; // Stop on first failure
      }
    }

    res.status(200).json({
      success,
      totalTestCases: results.length,
      testCasesPassed: passedTestCases,
      runtime,
      memory,
      errorMessage,
      // Return detailed status for the UI to display per-test-case results
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