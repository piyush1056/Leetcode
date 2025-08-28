# 🌐 CodeClimb - Frontend
A modern, responsive frontend for CodeClimb, a LeetCode-style coding platform built with React + Vite. This repository contains the client-side implementation featuring real-time code execution, contest participation, and user progress tracking.

## 🚀 Current Progress (Daily Updates)

# Day 01: Project Setup & Foundation
-  React app initialization with Vite
-  Router setup (React Router DOM)
-  Tailwind CSS + DaisyUI configuration
-  Basic folder structure setup

# Day 02: Authentication Flow Setup
-  Frontend (React + Redux)
-  Routing Setup (React Router):
  - Added protected routes using Navigate based on authentication state.
  - Redirects user to /signup if not authenticated.
  - Redirects logged-in users away from /login & /signup to Homepage.

- Login & Signup Pages:
  - Built responsive forms using Tailwind + DaisyUI card layout.
  - Implemented validation with react-hook-form + Zod.
  - Error handling for invalid email & weak passwords.
  - Integrated with Redux authSlice → dispatching loginUser / signupUser.
  - On successful login/signup, users are auto-redirected to Homepage.

- Authentication State:
  - On app load, checkAuth is dispatched to verify authentication status.
  - useSelector used to manage isAuthenticated, loading, and error.

- Frontend & backend now connected for authentication
- Made few updates in backend code ,cors,enhanced token security,


## 🛠️ Tech Stack

- ⚛️ **React 18** – Frontend framework  
- ⚡ **Vite** – Build tool  
- 🎨 **Tailwind CSS + DaisyUI** – Styling  
- 🌐 **Axios** – HTTP client  
- 🧭 **React Router DOM** – Routing  
- 🔧 **React Hooks (useState, useEffect)** – State management  
- 🔌 **RESTful APIs** – Backend integration  

## 📋 Planned

- Contest participation system
- Real-time leaderboard
- User profile and analytics
- Dark/light theme toggle
- Advanced code execution features


## 📁 Project Structure

```
frontend/
├── node_modules/       # Dependencies
├── public/            # Static assets
├── src/               # Source code
│   ├── assets/        # Images, icons, etc.
│   ├── pages/         # Page components
│   │   ├── Homepage.jsx
│   │   ├── Login.jsx
│   │   └── Signup.jsx
│   ├── App.css        # Main app styles
│   ├── App.jsx        # Main app component
│   ├── index.css      # Global styles
│   └── main.jsx       # Application entry point
├── .gitignore         # Git ignore rules
├── eslint.config.js   # ESLint configuration
├── index.html         # HTML template
├── package-lock.json  # Dependency lock file
├── package.json       # Project dependencies
├── README.md          # Project documentation
└── vite.config.js     # Vite configuration
```

## ⚡ Installation & Setup
 
 **Clone the repository**
 - git clone <repo-url>
 - cd frontend

 **Install dependencies**
 - npm install

**Start development server**
- npm run dev

**Build for production**
npm run build

# 👨‍💻 Developer

-    Piyush
- 🔗 GitHub: @piyush1056