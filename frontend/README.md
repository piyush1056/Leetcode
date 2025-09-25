# CodeClimb - Frontend

## Overview
A modern, responsive frontend for **CodeClimb**, a LeetCode-style coding platform built with React + Vite.  
This client-side implementation features real-time code execution, contest participation, user progress tracking, and comprehensive admin capabilities.



## 🛠️ Tech Stack
- Framework: React 18  
- Build Tool: Vite  
- Styling: Tailwind CSS + DaisyUI  
- Routing: React Router  
- HTTP Client: Axios  
- State Management: Redux Toolkit  
- Code Editor: Monaco Editor  
- Video Player: Plyr React  
- Form Validation: React Hook Form + Zod  
- Authentication: Google OAuth (@react-oauth/google)
- Notifications: React Hot Toast

## Progress & History
For detailed daily logs, see [Frontend Changelog](docs/FRONTEND_CHANGELOG.md).


## ✨ Implemented Features

### 🔐 Authentication & Authorization
- JWT-based user login and registration system  
- Protected routes with navigation guards  
- Role-based access control (user/admin)  
- Persistent authentication state with Redux  
- Automatic session validation on app load  
- Google OAuth integration with one-click sign-in
- GoogleSignInButton component for seamless authentication
- Dual authentication support (email/password + Google)
- Toast notifications for authentication feedback
- Beautiful login/signup cards with Google integration

### 🏠 Homepage & Navigation
- Responsive homepage layout with problem filtering  
- Difficulty-based problem categorization (Easy, Medium, Hard)  
- Problem status filtering (solved/unsolved)  
- Tag-based problem filtering system  
- Intuitive navigation with loading states  

### 💻 Code Editor & Execution
- Monaco Editor integration (VS Code's editor)  
- Syntax highlighting for C++, Java, and JavaScript  
- Multi-language support with code templates  
- Real-time code execution with test results  
- Dual-panel interface (problem description + code editor)  

### 👨‍💼 Admin Management System
- Exclusive admin panel with role-based access  
- Problem creation interface with validation  
- Test case management (visible and hidden test cases)  
- Direct Cloudinary video uploads with progress tracking  
- Video management with delete functionality  

### 🎥 Video Solutions System
- Cloudinary integration for video storage  
- Plyr-based video player with full controls  
- Multi-quality video playback support  
- Editorial tab with professional video interface  
- Secure URL handling for video content  

### 📱 Responsive Design
- Mobile-first responsive design approach  
- DaisyUI components for consistent styling  
- Tailwind CSS for custom styling needs  
- Optimized user experience across devices  
- Elegant authentication forms with Google sign-in integration

---

## 📖 Development Progress
For detailed day-by-day implementation progress, please see our **Development Journal**.

---

## 🗂️ Project Structure

```
frontend/
├── public/                 # Static assets
├── src/
│   ├── assets/            # Images, icons, and other assets
│   ├── components/        # Reusable UI components
│   ├── pages/             # Page components
│   │   ├── Homepage.jsx   # Homepage component
│   │   ├── Login.jsx      # Login page
│   │   ├── Signup.jsx     # Registration page
│   │   ├── Admin/         # Admin-specific pages
│   │   └── Problem/       # Problem-related pages
│   ├── store/             # Redux store configuration
│   │   ├── store.js       # Store setup
│   │   └── slices/        # Redux slices
│   ├── utils/             # Utility functions
│   │   └── axiosClient.js # API client configuration
│   ├── hooks/             # Custom React hooks
│   ├── App.jsx            # Main application component
│   ├── App.css            # Application styles
│   └── main.jsx           # Application entry point
├── package.json           # Project dependencies
├── vite.config.js         # Vite configuration
└── index.html             # HTML template

```

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v16 or higher)  
- npm  package manager  

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd frontend

2. Install dependencies:
npm install

3. Configure environment variables:
 Create a .env file in the root directory with:
 VITE_API_BASE_URL=http://localhost:3000
 VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id

4. Start the development server:
  npm run dev

---

### Key Dependencies
- `react` & `react-dom` - Core React libraries
- `@reduxjs/toolkit` - State management
- `react-router-dom` - Client-side routing
- `axios` - HTTP client for API calls
- **`@react-oauth/google` - Google OAuth integration**
- **`react-hot-toast` - Toast notifications**
- `react-hook-form` - Form handling
- `zod` - Schema validation
- `@monaco-editor/react` - Code editor
- `tailwindcss` - Utility-first CSS framework


## 🔮 Future Enhancements

- Contest participation system with real-time leaderboard  
- User profile and analytics dashboard  
- Dark/light theme toggle  
- Advanced code execution features  
- Social features (discussions, solution sharing)   
- Real-time collaboration features  
- Advanced problem search and filtering  


# 👨‍💻 Developer

-    Piyush
- 🔗 GitHub: @piyush1056