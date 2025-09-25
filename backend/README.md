# Backend for CodeClimb - MERN Major Project

## Overview
A robust Node.js/Express backend for a LeetCode-like coding platform featuring user authentication, problem management, code execution, AI assistance, and video solutions.

## 🛠️ Tech Stack
- **Runtime:** Node.js  
- **Framework:** Express.js  
- **Database:** MongoDB with Mongoose ODM  
- **Caching & Rate Limiting:** Redis  
- **Authentication:** Google OAuth (google-auth-library), JWT, bcryptjs  
- **Validation:** validator library  
- **Code Execution:** Judge0 API  
- **AI Integration:** Google Gemini API  
- **Video Storage:** Cloudinary  
- **HTTP Client:** Axios  
- 

## Progress & History
For detailed daily logs, see [Backend Changelog](docs/BACKEND_CHANGELOG.md).

## ✨ Implemented Features

### 🔐 Authentication & Authorization
- JWT-based user registration and login system  
- Admin-only registration endpoint with middleware protection  
- Secure password hashing with bcrypt  
- Redis-based JWT blacklisting for secure logout  
- Role-based access control (user/admin)  
- Google OAuth integration for seamless sign-in
- Flexible user schema supporting both email/password and Google authentication
- Automatic user creation for new Google sign-ins

### 📝 Problem Management
- CRUD operations for coding problems (admin only)  
- Problem schema with titles, descriptions, examples, test cases  
- Input validation and sanitization  
- Reference solution validation before database insertion  

### 💻 Code Execution & Submission
- Integration with Judge0 API for code execution  
- Support for multiple programming languages (C++, Java, Python, JavaScript)  
- Two-step execution process: run vs submit  
- Batch test case execution with comprehensive result interpretation  
- Submission history tracking with performance metrics  

### 🚦 Rate Limiting & Security
- Custom sliding window rate limiting using Redis  
- Protection against DDoS and brute-force attacks  
- Different limits for various operations:  
  - 5 login attempts per 15 minutes  
  - 10 code submissions per minute  
  - Admin operation limits  

### 🤖 AI-Powered Assistance
- Google Gemini integration for doubt solving  
- Context-aware responses strictly focused on current problem  
- Multiple assistance modes (hints, code review, solutions)  
- Beautifully formatted code responses with dark theme  

### 🎥 Video Solutions
- Cloudinary integration for video storage  
- Direct frontend upload with secure signed requests  
- Video metadata management with MongoDB  
- Automatic thumbnail generation and duration tracking  

### 📊 User Management
- User profile system with solved problems tracking  
- Compound indexes for efficient querying  
- Admin capabilities for user management  

## 🗂️ API Structure


### Authentication Routes
- POST `/user/register` – Register a new user and issue a JWT  
- POST `/user/login` – Authenticate user credentials and return a JWT  
- POST `/user/logout` – Invalidate the current JWT via Redis blacklisting (requires valid JWT)  
- POST `/user/google-auth` – Authenticate with Google OAuth token and return JWT
- POST `/user/admin/register` – Register a new admin account (admin-only)  
- DELETE `/user/profile` – Delete the authenticated user’s profile  
- GET `/user/check` – Verify the current JWT and return authenticated user data  

### Problem Routes
- POST `/problem/create` – Create a new coding problem (admin-only)  
- PUT `/problem/update/:id` – Update an existing problem by its ID (admin-only)  
- DELETE `/problem/:id` – Delete a problem by its ID (admin-only)  
- GET `/problem/problemById/:id` – Retrieve a specific problem’s details by its ID  
- GET `/problem/getAllProblem` – Retrieve the list of all problems  
- GET `/problem/problemSolvedbyUser` – Get all problems solved by the authenticated user  
- GET `/problem/submittedProblem/:pid` – Get all submissions for problem ID `:pid` by the authenticated user 

### Submission Routes
- POST `/submission/submit/:id` – Submit code for final evaluation (hidden and visible test cases) for problem ID `:id`  
- POST `/submission/run/:id` – Execute code against visible test cases for problem ID `:id`  

### AI Assistance Route
- POST `/ai/chat` – Get AI assistance for coding problems  

### Video Routes
- GET `/video/create/:problemId` – Generate a secure Cloudinary upload signature for problem ID `:problemId` (admin-only)  
- POST `/video/save` – Save video metadata (URL, duration, thumbnail) after upload (admin-only)  
- DELETE `/video/delete/:problemId` – Delete the video associated with problem ID `:problemId` (admin-only)  

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v16 or higher)  
- MongoDB  
- Redis  
- Cloudinary account  
- Judge0 API access  
- Google Gemini API key 
- Google Cloud Console project with OAuth 2.0 credentials
### Installation
1. Clone the repository and navigate to the backend directory  
2. Install dependencies:  
   ```bash
   npm install
3. Create a .env file with the following variables:

MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
REDIS_URL=your_redis_url
JUDGE0_API_URL=your_judge0_api_url
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
GEMINI_API_KEY=your_gemini_api_key      
GOOGLE_CLIENT_ID=your_google_oauth_client_id


### Key Dependencies
- `express` - Web framework
- `mongoose` - MongoDB ODM  
- `jsonwebtoken` - JWT implementation
- `bcryptjs` - Password hashing
- `redis` - Caching and rate limiting
- **`google-auth-library` - Google OAuth verification**
- `validator` - Input validation
- `axios` - HTTP client for Judge0 API
- `cloudinary` - Video storage

### Authentication Methods
1. **Traditional Email/Password:** Users register with email and password
2. **Google OAuth:** Users sign in with their Google account
   - Frontend sends Google credential token to `/user/google-auth`
   - Backend verifies token with Google's servers  
   - Creates new user if first-time, or logs in existing user
   - Returns JWT for subsequent API calls
   
## 🔮 Future Enhancements
- WebSocket integration for real-time collaboration
- Enhanced admin dashboard with analytics
- Problem categories and tags for better organization
- User rankings and leaderboards
- contest feature integration
- Social features (following, sharing solutions)

