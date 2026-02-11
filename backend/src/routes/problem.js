const express = require('express');
const problemRouter = express.Router();

const { 
  // CRUD (Admin)
  createProblem, 
  updateProblem, 
  deleteProblem,
  // Public/User
  getProblemById, 
  getAllProblem, 
  solvedAllProblembyUser, 
  submittedProblem,
  // SOCIAL FEATURES
  likeProblem,
  deleteLikeOfProblem,
  isProblemLiked,
  favouriteProblem,
  defavouriteProblem,
  isProblemFavourite,
  addComment,
  updateBookmarks,
  getSavedProblems,
  getUserData,
  toggleProblemInBookmark
} = require('../controllers/problemController'); 

const { verifyToken, loadUser, isAdmin } = require('../middleware/auth');
const createRateLimiter = require('../middleware/rateLimiterMiddleware');



// ADMIN OPERATIONS
problemRouter.post('/create', verifyToken, loadUser, isAdmin, createRateLimiter(3600, 20), createProblem);
problemRouter.put('/update/:id', verifyToken, loadUser, isAdmin, createRateLimiter(3600, 30), updateProblem); 
problemRouter.delete('/:id', verifyToken, loadUser, isAdmin, createRateLimiter(86400, 30), deleteProblem); 

// USER DATA ROUTES 
problemRouter.get('/me/solved', verifyToken, loadUser, createRateLimiter(300, 100), solvedAllProblembyUser);
problemRouter.get('/me/saved', verifyToken, loadUser, createRateLimiter(300, 100), getSavedProblems);
problemRouter.get('/me/user-data', verifyToken, loadUser, createRateLimiter(300, 50), getUserData);


problemRouter.post('/bookmarks', verifyToken, loadUser, createRateLimiter(3600, 10), updateBookmarks);
problemRouter.post( '/bookmarks/problem', verifyToken,loadUser, toggleProblemInBookmark);

// PUBLIC ACCESS (List all)
problemRouter.get('/', verifyToken, loadUser, getAllProblem);


// 2. DYNAMIC /:id ROUTES 
problemRouter.get('/:problemId/submissions', verifyToken, loadUser, createRateLimiter(300, 15), submittedProblem);

// SOCIAL FEATURES (Specific problem)
problemRouter.post('/:problemId/like', verifyToken, loadUser, createRateLimiter(60, 50), likeProblem);
problemRouter.delete('/:problemId/like', verifyToken, loadUser, createRateLimiter(60, 50), deleteLikeOfProblem);
problemRouter.get('/:problemId/is-liked', verifyToken, loadUser, isProblemLiked);

problemRouter.post('/:problemId/favourite', verifyToken, loadUser, createRateLimiter(60, 50), favouriteProblem);
problemRouter.delete('/:problemId/favourite', verifyToken, loadUser, createRateLimiter(60, 50), defavouriteProblem);
problemRouter.get('/:problemId/is-favourite', verifyToken, loadUser, isProblemFavourite);

problemRouter.post('/:problemId/comment', verifyToken, loadUser, createRateLimiter(60, 20), addComment);

problemRouter.get('/:id', verifyToken, loadUser, getProblemById);

module.exports = problemRouter;



