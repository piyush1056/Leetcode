# 🚀 CodeClimb - Online Judge Platform  

A comprehensive **LeetCode-style coding platform** built with the **MERN stack**, featuring real-time code execution, AI-powered assistance, and modern web technologies.  
This project demonstrates full-stack development skills with advanced features like contest systems, video solutions, and intelligent problem-solving tools.

---

## 🌟 Why I Built This  

As a final-year computer science student passionate about competitive programming, I noticed that most coding platforms focus solely on problem-solving without showing the full technical implementation behind them. I wanted to bridge that gap by building a complete, production-ready platform that demonstrates real-world web development challenges.

**CodeClimb** represents my journey through the entire software development lifecycle - from designing scalable architectures to implementing complex features like real-time code execution and AI integration. This project combines my love for algorithms with modern web technologies, showcasing both technical depth and user experience considerations.

---

## 🎯 Project Goals  

- **Demonstrate Full-Stack Proficiency** – Build a complete MERN application with proper authentication, database design, and API development  

- **Solve Real Technical Challenges** – Implement complex features like secure code execution, video processing, and AI integration  

- **Create Learning Value** – Build something that could actually help other students practice coding interview questions  

- **Showcase Modern Development Practices** – Implement proper error handling, rate limiting, security measures, and responsive design  

---

## ✨ Key Features  

### 🔐 Secure Authentication System  
- JWT-based authentication with Redis token blacklisting  
- Role-based access control (User/Admin)  
- Secure password hashing and validation 
- Google OAuth integration for one-click sign-in
- Dual authentication support (traditional + social login)

### 💻 Advanced Code Execution Engine  
- Multi-language support (C++, Java, Python, JavaScript)  
- Integration with Judge0 API for reliable code evaluation  
- Real-time test case validation with hidden test support  
- Comprehensive submission tracking and performance metrics  

### 🎯 Intelligent Problem Management  
- 2000+ coding problems with difficulty categorization  
- Tag-based filtering and company-wise organization  
- Admin panel for problem creation and management  
- Input validation and reference solution verification  

### 🤖 AI-Powered Learning Assistant  
- Google Gemini integration for contextual hints  
- Smart doubt-solving with problem-specific guidance  
- Multiple assistance modes (hints, code review, complete solutions)  

### 🎥 Video Solutions System  
- Cloudinary integration for scalable video storage  
- Professional video player with quality controls  
- Direct upload with secure signed requests  
- Editorial content management  

### 🚦 Enterprise-Grade Security  
- Custom sliding window rate limiting using Redis  
- Protection against DDoS and brute-force attacks  
- Granular API rate limits for different operations  

---

## 🛠️ Tech Stack  

### Backend  
- Runtime: Node.js with Express.js  
- Database: MongoDB with Mongoose ODM  
- Caching: Redis for rate limiting and session management  
- Authentication: JWT with bcrypt encryption  
- OAuth Integration: Google Auth Library for secure  token verification
- Code Execution: Judge0 API integration  
- AI Integration: Google Gemini API  
- File Storage: Cloudinary for video management  

### Frontend  
- Framework: React 18 with Vite  
- Styling: Tailwind CSS + DaisyUI components  
- State Management: Redux Toolkit  
- Code Editor: Monaco Editor (VS Code engine)  
- Routing: React Router with protected routes  
- Video Player: Plyr React for enhanced playback  
- OAuth Integration: @react-oauth/google for seamless sign-in
- Notifications: React Hot Toast for user feedback

### Development Tools  
- Validation: Zod schema validation  
- Form Handling: React Hook Form  
- HTTP Client: Axios with interceptors  
- Version Control: Git with feature branching  

---
## 🗂️ Project Structure

```
CodeClimb/  
├── backend/                 # Node.js/Express server  
│   ├── src/  
│   │   ├── controllers/     # Business logic  
│   │   ├── models/          # Database schemas  
│   │   ├── routes/          # API endpoints  
│   │   ├── middleware/      # Custom middleware  
│   │   └── utils/           # Helper functions  
│   └── package.json  

├── frontend/                # React application  
│   ├── src/  
│   │   ├── components/      # Reusable UI components  
│   │   ├── pages/           # Route components  
│   │   ├── store/           # Redux configuration  
│   │   └── utils/           # Client utilities  
│   └── package.json  

├── docs/                    # Documentation & changelogs  
│   ├── BACKEND_CHANGELOG.md  
│   └── FRONTEND_CHANGELOG.md  

└── README.md                # This file  

```

---

## 🚀 Getting Started  

### Prerequisites  
- Node.js (v16+)  
- MongoDB database  
- Redis server  
- Judge0 API access  
- Cloudinary account  
- Google Gemini API key  
- - Google Cloud Console project with OAuth 2.0 credentials

---

### Quick Setup  

1. Clone the Repository  
  git clone https://github.com/piyush1056/Leetcode.git
  cd Leetcode

2. Backend Setup
  cd backend
  npm install

# Create .env file
MONGODB_URI=your_mongodb_connection
JWT_SECRET=your_jwt_secret
REDIS_URL=your_redis_url
JUDGE0_API_URL=your_judge0_endpoint
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
GEMINI_API_KEY=your_gemini_key
GOOGLE_CLIENT_ID=your_google_oauth_client_id

npm run dev

3. Frontend Setup
  cd ../frontend
  npm install

# Configure environment
VITE_API_URL=http://localhost:3000
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id

npm run dev

4. Access the Application

  - Frontend: http://localhost:5173
  - Backend API: http://localhost:3000

---

## 🔌 API Overview 

### Backend RESTful Endpoints  

- **Authentication** (`/user/*`) – Registration, login/logout,Google OAuth ,session checks  
- **Problems** (`/problem/*`) – CRUD operations and user-specific queries  
- **Submissions** (`/submission/*`) – Code execution, final submissions, history  
- **AI Assistance** (`/ai/chat`) – Context-aware coding help  
- **Video Management** (`/video/*`) – Upload signatures, metadata save, and deletion  


---

## 🎯 Challenges Overcome  

During development, I tackled several complex problems:  
- **Rate Limiting:** Implemented custom sliding window algorithm with Redis for scalable request throttling  
- **Code Security:** Safely run user code in Judge0’s isolated sandbox to prevent harmful or heavy operations on your server.
- **Real-time Updates:** Built efficient WebSocket communication for live submission feedback  
- **Video Management:** Created seamless upload experience with Cloudinary integration  
- **State Management:** Architected clean Redux flow for complex authentication states  

---

## 🔮 Roadmap  

- Contest system with real-time leaderboards  
- GitHub OAuth integration (Google OAuth ✅ complete)
- Payment gateway for premium features  
- Real-time chat and collaboration    
- Advanced analytics dashboard  

---

## 📊 Current Status  

✅ Core backend infrastructure complete  
✅ Frontend UI and navigation implemented  
✅ Code execution engine operational  
✅ AI assistance integrated  
✅ Video solutions system functional 
✅ Google OAuth integration complete 


🚧 Contest features under development  

---

## 🤝 Contributing  

While this is primarily a personal project for learning, I welcome feedback and suggestions. Feel free to open issues or submit pull requests.  

---

## 📝 License  

MIT License – see LICENSE file for details.  

---

## 👨‍💻 Developer  

**Piyush – Final Year CS Student**  

- GitHub: [@piyush1056](https://github.com/piyush1056)  
 

This project represents my journey in full-stack development, combining algorithmic problem-solving with modern web technologies.  
It showcases my ability to build scalable, secure applications while maintaining focus on user experience and code quality.  


