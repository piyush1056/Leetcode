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
-  Async Thunks:
   - loginUser() - Handles user login with error handling
   - registerUser() - Handles user registration
   - checkAuth() - Validates user sessions on app load
   - logoutUser() - Manages user logout process

- Added protected routes using Navigate based on authentication state.

- Smart Navigation:
  - Authenticated users redirected away from login/signup
  - Non-authenticated users protected from accessing home page

- Login & Signup Pages:
  - Built responsive forms using Tailwind + DaisyUI card layout.
  - Implemented validation with react-hook-form + Zod.
  - Error handling for invalid email & weak passwords.
  - Integrated with Redux authSlice → dispatching loginUser / signupUser.


- Authentication State:
  - On app load, checkAuth is dispatched to verify authentication status.
  - useSelector used to manage isAuthenticated, loading, and error.

- Frontend & backend now connected for authentication
- Made few updates in backend code ,cors,enhanced token security

# Day 03: Enhancements & Homepage Design  
- Enhanced Signup Page:
  - Added eye icon for show/hide password functionality
  - Implemented **"Already have an account? Sign in"** navigation link on the signup page. 
  - Added loading state ,Signup button is disabled while loading to prevent multiple requests.
  - Users see a **loading indicator** instead of a blank page/flash when the page is refreshed.

- Homepage Design
  - Created responsive homepage layout
  - Added filter options for problems by difficulty and tags
  - Implemented problem status filtering (solved/unsolved)  

# Day 04: Admin Panel & Problem Creation System
- New Features Added:
   - Admin Problem Creation Interface: Comprehensive form for creating coding problems with validation
   - Multi-language Support: Support for C++, Java, and JavaScript with separate code templates
   - Test Case Management: Dynamic form for adding visible and hidden test cases
   - Test Case Management: Dynamic form for adding visible and hidden test cases

- "The admin panel offers a streamlined interface for adding coding problems with validation and structured data management."   


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
├── node_modules/          # Dependencies
├── public/               # Static assets
├── src/                  # Source code
│   ├── assets/           # Images, icons, etc.
│   ├── pages/            # Page components
│   │   ├── Homepage.jsx
│   │   ├── Login.jsx
│   │   └── Signup.jsx
│   ├── store/            # Redux store setup
│   │   └── store.js
│   ├── utils/            # Utility functions
│   │   └── axiosClient.js
│   ├── App.css           # Main app styles
│   ├── App.jsx           # Main app component
│   ├── authSlice.js      # Redux slice for authentication
│   ├── index.css         # Global styles
│   └── main.jsx          # Application entry point
├── .gitignore            # Git ignore rules
├── eslint.config.js      # ESLint configuration
├── index.html            # HTML template
├── package-lock.json     # Dependency lock file
├── package.json          # Project dependencies
├── README.md             # Project documentation
└── vite.config.js        # Vite configuration

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