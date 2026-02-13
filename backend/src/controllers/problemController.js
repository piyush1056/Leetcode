const mongoose = require('mongoose');
const {  submitBatch, submitToken, createSubmissionPayload, mapJudge0Status,buildFullSourceCodeForValidation } = require('../utils/judge0Helper');
const Problem = require('../models/problem');
const User = require('../models/user');
const Submission = require('../models/submission');
const SolutionVideo = require('../models/solutionVideo');


const validateReferenceSolutions = async (startCode, referenceSolution, visibleTestCases) => {

    if (!Array.isArray(visibleTestCases) || visibleTestCases.length === 0) {
        throw new Error('visibleTestCases must be a non-empty array');
    }

    if (!Array.isArray(referenceSolution) || referenceSolution.length === 0) {
        throw new Error('referenceSolution must be a non-empty array');
    }
    
    for (const { language, completeCode } of referenceSolution) {
        
        // Prepare batch
        // const submissions = visibleTestCases.map(testCase =>
        //     createSubmissionPayload({
        //         code: buildFullSourceCodeForValidation({ startCode, language, userCode: completeCode }),
        //         language,
        //         testCase
        //     })
        // );

         //-------- Validate only first visible test case (to reduce API usage)------//
        const testCase = visibleTestCases[0];

        const submissions = [createSubmissionPayload(
            {
                code: buildFullSourceCodeForValidation({ startCode, language, userCode: completeCode }),
                language,
                testCase
            }
        )];

        const submitResult = await submitBatch(submissions);
        const tokens = submitResult.map(s => s.token);
        const testResults = await submitToken(tokens);

  
        for (const test of testResults) {
            const finalStatus = mapJudge0Status(test.status.id);
            
            if (finalStatus !== 'accepted') {
                //Capture the actual error details 
                let errorDetails = '';
                if (finalStatus === 'wrong') {
                    errorDetails = `\nInput: ${test.stdin}\nExpected: ${test.expected_output}\nGot: ${test.stdout}`;
                } else if (finalStatus === 'error' || finalStatus === 'runtime-error') {
                    errorDetails = `\nError: ${test.compile_output || test.stderr}`;
                }

                throw new Error(`Reference solution failed for ${language} (${finalStatus}): ${errorDetails}`);
            }
        }
    }
};

const createProblem = async (req, res) => {
    try {
        const {
            title, description, difficulty, tags, visibleTestCases,
            hiddenTestCases, startCode, referenceSolution, problemNo, examples,
            constraints,
            companies,
            hints

        } = req.body;

        if (!title || !description || !difficulty || !tags || !visibleTestCases ||
            !hiddenTestCases || !startCode || !referenceSolution || !problemNo) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        if (!Array.isArray(tags) || tags.length === 0) {
            return res.status(400).json({ message: 'Tags must be a non-empty array' });
        }

        if (!Array.isArray(visibleTestCases) || visibleTestCases.length === 0) {
            return res.status(400).json({ message: 'visibleTestCases must be a non-empty array' });
        }

        if (!Array.isArray(hiddenTestCases) || hiddenTestCases.length === 0) {
            return res.status(400).json({ message: 'hiddenTestCases must be a non-empty array' });
        }

        if (!Array.isArray(startCode) || startCode.length === 0) {
            return res.status(400).json({ message: 'startCode must be a non-empty array' });
        }

        if (!Array.isArray(referenceSolution) || referenceSolution.length === 0) {
            return res.status(400).json({ message: 'referenceSolution must be a non-empty array' });
        }
        if (typeof problemNo !== 'number' || problemNo < 1) {
            return res.status(400).json({ message: 'problemNo must be a positive number' });
        }

        await validateReferenceSolutions(startCode,referenceSolution, visibleTestCases);

        const createdProblem = await Problem.create({
            title, description, difficulty, tags, visibleTestCases,
            hiddenTestCases, startCode, referenceSolution,
            problemCreator: req.user._id, problemNo, examples: examples || [],
            constraints: constraints || [],
            companies: companies || [],
            hints: hints || []


        });

        return res.status(201).json({
            message: 'Problem created successfully',
            problem: createdProblem
        });

    } catch (err) {
        console.error('Create problem error:', err);
        return res.status(400).json({ message: err.message || 'Failed to create problem' });
    }
};

const updateProblem = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid Problem ID' });
        }

        const existingProblem = await Problem.findById(id);
        if (!existingProblem) {
            return res.status(404).json({ message: 'Problem not found' });
        }

        if (updateData.referenceSolution) {
            const testCases =
                updateData.visibleTestCases || existingProblem.visibleTestCases;

            await validateReferenceSolutions(updateData.referenceSolution, testCases);
        }


        const updatedProblem = await Problem.findByIdAndUpdate(
            id, updateData, { runValidators: true, new: true }
        );

        return res.status(200).json({
            message: 'Problem updated successfully',
            problem: updatedProblem
        });

    } catch (err) {
        console.error('Update problem error:', err);
        return res.status(400).json({ message: err.message || 'Failed to update problem' });
    }
};

const deleteProblem = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid Problem ID' });
        }

        const existingProblem = await Problem.findById(id);
        if (!existingProblem) {
            return res.status(404).json({ message: 'Problem not found' });
        }

        await Problem.findByIdAndDelete(id);

        return res.status(200).json({ message: 'Problem deleted successfully' });

    } catch (err) {
        console.error('Delete problem error:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const getProblemById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid Problem ID' });
        }

        const problem = await Problem.findById(id).select(
            `
            _id
            title
            description
            examples
            constraints
            difficulty
            tags
            visibleTestCases
            startCode
            likes
            acceptance
            companies
            hints
            comments
            referenceSolution
            `
        );

        if (!problem) {
            return res.status(404).json({ message: 'Problem not found' });
        }
     //video fetch at same time
        const video = await SolutionVideo.findOne({ problemId: id });

        return res.status(200).json({
            ...problem.toObject(),
            commentsCount: problem.comments.length,
            video: video ? {
                secureUrl: video.secureUrl,
                thumbnailUrl: video.thumbnailUrl,
                duration: video.duration
            } : null
        });

    } catch (error) {
        console.error('Get problem by ID error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const getAllProblem = async (req, res) => {
    try {
        const { page = 1, limit = 20, difficulty, tags, companies, search } = req.query;
        const skip = (page - 1) * limit;

        const filter = {};

        
        if (search) {
            // search in title(case-insensitive)
            filter.title = { $regex: search, $options: 'i' };
        }

        if (difficulty) {
            const diffs = difficulty.split(',');
            filter.difficulty = diffs.length > 1 ? { $in: diffs } : diffs[0];
        }

        if (tags) {
            filter.tags = { $in: tags.split(',') };
        }

        if (companies) {
            filter.companies = { $in: companies.split(',') };
        }

        const problems = await Problem.find(filter)
            .select('_id title problemNo difficulty tags companies acceptance')
            .sort({ problemNo: 1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Problem.countDocuments(filter);

        return res.status(200).json({
            problems,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        console.error('Get all problems error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const solvedAllProblembyUser = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .select('problemsSolved')
            .populate({
                path: 'problemsSolved.problemId',
                select: '_id title tags difficulty problemNo'
            });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const solved = (user.problemsSolved || [])
            .filter(p => p.problemId)
            .map(p => ({
                ...p.problemId.toObject(),
                solvedAt: p.solvedAt,
                pointsEarned: p.pointsEarned
            }));

        return res.status(200).json(solved);

    } catch (error) {
        console.error('Get solved problems error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const submittedProblem = async (req, res) => {
    try {
        const { pid } = req.params;
        if (!mongoose.Types.ObjectId.isValid(pid)) {
            return res.status(400).json({ message: 'Invalid Problem ID' });
        }

        const submissions = await Submission.find({
            userId: req.user._id,
            problemId: pid
        }).sort({ createdAt: -1 }).limit(50);

        return res.status(200).json(submissions);

    } catch (error) {
        console.error('Get submissions error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const likeProblem = async (req, res) => {
    try {
        const { problemId } = req.params;
        const userId = req.user._id;

        if (!mongoose.Types.ObjectId.isValid(problemId)) {
            return res.status(400).json({ message: 'Invalid Problem ID' });
        }

        const problem = await Problem.findById(problemId);
        if (!problem) {
            return res.status(404).json({ message: 'Problem not found' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const alreadyLiked = user.likedProblems.includes(problemId);
        if (alreadyLiked) {
            return res.status(400).json({ message: 'Problem already liked' });
        }

        user.likedProblems.push(problemId);
        problem.likes += 1;
        problem.likedBy.push(userId);

        await Promise.all([user.save(), problem.save()]);

        return res.status(200).json({
            message: 'Problem liked successfully',
            likesCount: problem.likes
        });

    } catch (error) {
        console.error('Like problem error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const deleteLikeOfProblem = async (req, res) => {
    try {
        const { problemId } = req.params;
        const userId = req.user._id;

        if (!mongoose.Types.ObjectId.isValid(problemId)) {
            return res.status(400).json({ message: 'Invalid Problem ID' });
        }

        const problem = await Problem.findById(problemId);
        if (!problem) {
            return res.status(404).json({ message: 'Problem not found' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const likeIndex = user.likedProblems.indexOf(problemId);
        if (likeIndex === -1) {
            return res.status(400).json({ message: 'Problem not liked' });
        }

        // Remove like
        user.likedProblems.splice(likeIndex, 1);
        problem.likes = Math.max(0, problem.likes - 1);

        await Promise.all([user.save(), problem.save()]);

        return res.status(200).json({
            message: 'Like removed successfully',
            likesCount: problem.likes
        });

    } catch (error) {
        console.error('Delete like error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const isProblemLiked = async (req, res) => {
    try {
        const { problemId } = req.params;
        const userId = req.user._id;

        if (!mongoose.Types.ObjectId.isValid(problemId)) {
            return res.status(400).json({ message: 'Invalid Problem ID' });
        }

        const user = await User.findById(userId).select('likedProblems');
        const isLiked = user.likedProblems.includes(problemId);

        return res.status(200).json({ isLiked });

    } catch (error) {
        console.error('Check like status error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const favouriteProblem = async (req, res) => {
    try {
        const { problemId } = req.params;
        const userId = req.user._id;

        if (!mongoose.Types.ObjectId.isValid(problemId)) {
            return res.status(400).json({ message: 'Invalid Problem ID' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.favouriteProblems.includes(problemId)) {
            return res.status(400).json({ message: 'Problem already favourited' });
        }

        user.favouriteProblems.push(problemId);
        await user.save();

        return res.status(200).json({
            message: 'Problem favourited successfully',
            favouritesCount: user.favouriteProblems.length
        });

    } catch (error) {
        console.error('Favourite problem error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const defavouriteProblem = async (req, res) => {
    try {
        const { problemId } = req.params;
        const userId = req.user._id;

        if (!mongoose.Types.ObjectId.isValid(problemId)) {
            return res.status(400).json({ message: 'Invalid Problem ID' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const favIndex = user.favouriteProblems.indexOf(problemId);
        if (favIndex === -1) {
            return res.status(400).json({ message: 'Problem not favourited' });
        }

        user.favouriteProblems.splice(favIndex, 1);
        await user.save();

        return res.status(200).json({
            message: 'Favourite removed successfully',
            favouritesCount: user.favouriteProblems.length
        });

    } catch (error) {
        console.error('Defavourite error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const isProblemFavourite = async (req, res) => {
    try {
        const { problemId } = req.params;
        const userId = req.user._id;

        if (!mongoose.Types.ObjectId.isValid(problemId)) {
            return res.status(400).json({ message: 'Invalid Problem ID' });
        }

        const user = await User.findById(userId).select('favouriteProblems');
        const isFavourite = user.favouriteProblems.includes(problemId);

        return res.status(200).json({ isFavourite });

    } catch (error) {
        console.error('Check favourite status error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const addComment = async (req, res) => {
    try {
        const { problemId } = req.params;
        const { content } = req.body;
        const userId = req.user._id;

        if (!mongoose.Types.ObjectId.isValid(problemId)) {
            return res.status(400).json({ message: 'Invalid Problem ID' });
        }

        if (!content || content.trim().length < 5) {
            return res.status(400).json({ message: 'Comment must be at least 5 characters' });
        }

        const comment = {
            user: userId,
            comment: content.trim(),
            createdAt: new Date()
        };

        const problem = await Problem.findByIdAndUpdate(
            problemId,
            { $push: { comments: comment } },
            { new: true }
        ).select('comments');

        return res.status(201).json({
            message: 'Comment added successfully',
            comment: comment
        });

    } catch (error) {
        console.error('Add comment error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const updateBookmarks = async (req, res) => {
    try {
        const { bookmarkName } = req.body;
        const userId = req.user._id;

        if (!bookmarkName || bookmarkName.trim().length < 1) {
            return res.status(400).json({ message: 'Valid bookmark name required' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const existingIndex = user.bookmarks.findIndex(b => b.name === bookmarkName.trim());
        if (existingIndex > -1) {
            user.bookmarks[existingIndex].problems = [];
        } else {
            user.bookmarks.push({ name: bookmarkName.trim(), problems: [] });
        }

        await user.save();
        return res.status(200).json({
            message: 'Bookmark updated successfully',
            bookmarkName: bookmarkName.trim()
        });

    } catch (error) {
        console.error('Update bookmarks error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
// Add / Remove problem from a bookmark
const toggleProblemInBookmark = async (req, res) => {
    try {
        const { problemId } = req.body;
        let { bookmarkName } = req.body;
        const userId = req.user._id;

        if (!problemId) {
            return res.status(400).json({ message: 'problemId required' });
        }

        // Default bookmark name
        bookmarkName = bookmarkName?.trim() || 'My Problems';

        if (!mongoose.Types.ObjectId.isValid(problemId)) {
            return res.status(400).json({ message: 'Invalid problem ID' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Find or create bookmark
        let bookmark = user.bookmarks.find(b => b.name === bookmarkName);

        if (!bookmark) {
            user.bookmarks.push({ name: bookmarkName, problems: [] });
            bookmark = user.bookmarks.find(b => b.name === bookmarkName);
        }

        const index = bookmark.problems.findIndex(
            p => p.toString() === problemId
        );

        if (index > -1) {
            // Toggle OFF
            bookmark.problems.splice(index, 1);
            user.markModified('bookmarks');
            await user.save();
            return res.status(200).json({ message: 'Problem removed from bookmark' });
        } else {
            // Toggle ON
            bookmark.problems.push(problemId);
            user.markModified('bookmarks');
            await user.save();
            return res.status(200).json({ message: 'Problem added to bookmark' });
        }

    } catch (error) {
        console.error('Toggle bookmark problem error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};


const getSavedProblems = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId)
            .select('favouriteProblems bookmarks likedProblems')
            .populate({
                path: 'favouriteProblems',
                select: '_id title difficulty tags problemNo'
            })
            .populate({
                path: 'bookmarks.problems',
                select: '_id title difficulty tags problemNo'
            });

        return res.status(200).json({
            favourites: user.favouriteProblems || [],
            bookmarks: user.bookmarks || [],
            likesCount: user.likedProblems.length
        });

    } catch (error) {
        console.error('Get saved problems error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const getUserData = async (req, res) => {
    try {
        const userId = req.user._id;

        const [user, totalSubmissions, solvedCount, likesCount, favouritesCount] =
            await Promise.all([
                User.findById(userId).select('username fullName avatar streaks bio'),
                Submission.countDocuments({ userId }), 
                Submission.countDocuments({ userId, status: 'accepted' }),
                User.findById(userId).select('likedProblems').then(u => u.likedProblems.length),
                User.findById(userId).select('favouriteProblems').then(u => u.favouriteProblems.length)
            ]);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json({
            user: {
                _id: user._id,
                username: user.username,
                fullName: user.fullName,
                avatar: user.avatar,
                currentStreak: user.streaks?.current || 0,
                longestStreak: user.streaks?.longest || 0,
                bio: user.bio || ''
            },
            stats: {
                totalSubmissions: totalSubmissions,
                solvedCount,
                likesCount,
                favouritesCount
            }
        });

    } catch (error) {
        console.error('Get user data error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    // CRUD
    createProblem,
    updateProblem,
    deleteProblem,
    getProblemById,
    getAllProblem,

    // User Progress
    solvedAllProblembyUser,
    submittedProblem,

    // Social Features
    likeProblem,
    deleteLikeOfProblem,
    isProblemLiked,
    favouriteProblem,
    defavouriteProblem,
    isProblemFavourite,
    addComment,

    // Bookmarks
    updateBookmarks,
    getSavedProblems,
    toggleProblemInBookmark,

    // User Summary
    getUserData
};



