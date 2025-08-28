# 🚀 CodeClimb – Online Judge Platform

An **online coding platform** built with the **MERN STACK** (Node.js, Express, MongoDB, React) and Judge0 API integration. It features real-time code execution and submission judging, role-based access, and scalable backend architecture with Redis for rate limiting.

## ✨ Features

### 🔐 Authentication & Security
- **JWT Authentication** with secure login/logout
- **Redis-powered token blacklisting** for enhanced security
- **Sliding Window Rate Limiting** using Redis to prevent API abuse
- **Role-based access control** (User vs Admin)

### 💻 Code Execution & Judging
- **Real-time code execution** via Judge0 API integration
- **Multi-language support** (C++, Java, Python, JavaScript)
- **Test case validation** with hidden and visible test cases
- **Instant verdicts** (Accepted, Wrong Answer, Time Limit Exceeded, etc.)

### 📊 User Experience (Upcoming via Frontend)
- Problem solving interface with code editor
- Personal submission history and statistics
- User profile and progress tracking


## 🛠️ Tech Stack
- **Backend**: Node.js, Express , JWT, bcrypt
- **Database**: MongoDB  
- **Queue & Caching**: Redis  
- **Code Execution**: Judge0 API  

 ## Project Structure
CodeClimb/
│── backend/ # Node.js + Express backend
│── frontend/ # (Planned) Frontend integration
│── README.md # Project documentation


### Backend
- **Runtime**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT, bcrypt, Redis (for token blacklisting)
- **Rate Limiting**: Redis Sorted Sets (Sliding Window algorithm)
- **Code Execution**: Judge0 API integration
- **Validation**: Express-validator


### Frontend (In Progress)
- **Framework**: React with TypeScript
- **Build Tool**: Vite
- **UI Library**: DaisyUI + Tailwind CSS
- **HTTP Client**: Axios
- **Code Editor**:  VS Code editor 

### DevOps & Tools
- **Version Control**: Git & GitHub
- **Environment Management**: dotenv
- **API Testing**: Postman

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account or local MongoDB
- Redis server (local or Redis Cloud)
- Judge0 API key
- JWT_SECRET needed

## ⚡ Setup & Run Locally
```bash
# Clone the repository
git clone https://github.com/piyush1056/Leetcode.git
cd Leetcode/backend

# Install dependencies
npm install

# Start server
npm run dev