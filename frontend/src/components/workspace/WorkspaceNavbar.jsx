import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import {
  Menu,
  LogOut,
  LayoutDashboard,
  Shield,
  Timer,
  Maximize2,
  Minimize2,
  RotateCcw,
  Play,
  Pause,
  User,
  UserCog,
  StopCircle
} from "lucide-react";
import { logoutUser } from "../../redux/slices/authSlice";
import { toggleSidebar } from "../../redux/slices/workspaceSlice";
import { toast } from "sonner";
import ThemeToggle from "../ThemeToggle"; 

const WorkspaceNavbar = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  // --- Full Screen Logic ---
  const [isFullScreen, setIsFullScreen] = useState(false);
  const handleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullScreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullScreen(false);
      }
    }
  };

  // --- Timer Logic ---
  const [showTimer, setShowTimer] = useState(false);
  const [time, setTime] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isTimerRunning]);

  const formatTime = (seconds) => {
    const getSeconds = `0${seconds % 60}`.slice(-2);
    const minutes = Math.floor(seconds / 60);
    const getMinutes = `0${minutes % 60}`.slice(-2);
    const getHours = `0${Math.floor(seconds / 3600)}`.slice(-2);
    return `${getHours}:${getMinutes}:${getSeconds}`;
  };

  const handleResetTimer = () => {
    setIsTimerRunning(false);
    setTime(0);
  };

  // --- Logout Logic ---
  const handleLogout = () => {
    dispatch(logoutUser())
      .unwrap()
      .then(() => {
        toast.success("Logged out successfully");
        window.location.href = "/login";
      });
  };

  return (

    <div className="navbar h-14 min-h-[3.5rem] bg-[#18181b] text-white border-b border-white/10 px-4">
      
      {/* ---------------- LEFT SECTION ---------------- */}
      <div className="flex-1 flex items-center gap-4">
        <button 
          onClick={() => dispatch(toggleSidebar())} 
          className="btn btn-ghost btn-sm gap-2 font-normal text-gray-300 hover:text-white hover:bg-white/10"
        >
          <Menu className="w-5 h-5" /> 
          <span className="hidden sm:inline">Problem List</span>
        </button>
      </div>

      {/* ---------------- RIGHT SECTION ---------------- */}
      <div className="flex-none flex items-center gap-3">
        
        {/* 1. Stopwatch Component */}
        <div className="flex items-center">
          {/* Toggle Button */}
          {!showTimer && (
            <button
              className="btn btn-ghost btn-sm btn-square text-gray-400 hover:text-white"
              onClick={() => setShowTimer(true)}
              title="Open Timer"
            >
              <Timer className="w-5 h-5" />
            </button>
          )}

          {/* Expanded Timer UI */}
          {showTimer && (
            <div className="flex items-center gap-3 bg-black/40 border border-white/10 rounded-full px-1 py-1 pl-4 mr-2 transition-all animate-in fade-in slide-in-from-right-4 duration-300">
              
              {/* Digital Time Display */}
              <div className="flex items-center gap-2 min-w-[80px]">
                <span className={`font-mono text-sm font-bold tracking-widest ${isTimerRunning ? 'text-green-400' : 'text-gray-300'}`}>
                  {formatTime(time)}
                </span>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-1">
                <button
                  className={`btn btn-circle btn-xs border-0 ${isTimerRunning ? 'bg-amber-500/20 text-amber-500 hover:bg-amber-500/40' : 'bg-green-500/20 text-green-500 hover:bg-green-500/40'}`}
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  title={isTimerRunning ? "Pause" : "Start"}
                >
                  {isTimerRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 ml-0.5" />}
                </button>

                <button
                  className="btn btn-circle btn-xs btn-ghost text-gray-400 hover:text-white"
                  onClick={handleResetTimer}
                  title="Reset"
                >
                  <RotateCcw className="w-3 h-3" />
                </button>

                <button
                  className="btn btn-circle btn-xs btn-ghost text-red-400/70 hover:text-red-400 hover:bg-red-400/10 ml-1"
                  onClick={() => {
                    handleResetTimer();
                    setShowTimer(false);
                  }}
                  title="Close Timer"
                >
                  <StopCircle className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 2. Theme Toggle */}
        <ThemeToggle />

        {/* 3. Full Screen Toggle */}
        <button 
            className="btn btn-ghost btn-sm btn-square text-gray-400 hover:text-white" 
            onClick={handleFullScreen}
            title={isFullScreen ? "Exit Full Screen" : "Enter Full Screen"}
        >
            {isFullScreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
        </button>

        {/* 4. User Avatar & Dropdown */}
        <div className="dropdown dropdown-end ml-1">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar ring-2 ring-transparent hover:ring-white/20 transition-all"
          >
            <div className="w-8 rounded-full">
              <img
                alt="User"
                src={user?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"}
              />
            </div>
          </div>
          
          {/* Dropdown Menu */}
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[50] p-2 shadow-2xl bg-[#18181b] text-gray-300 rounded-xl w-60 border border-white/10"
          >
            <li className="px-4 py-3 bg-white/5 rounded-lg mb-2">
               <span className="text-xs font-medium opacity-50 block mb-0.5">Signed in as</span>
               <span className="font-bold text-white text-sm truncate block">{user?.username}</span>
            </li>
            
            <li><Link to="/profile" className="hover:bg-white/10"><User className="w-4 h-4" /> My Profile</Link></li>
            <li><Link to="/profile/edit" className="hover:bg-white/10"><UserCog className="w-4 h-4" /> Edit Profile</Link></li>
            <li><Link to="/submissions" className="hover:bg-white/10"><LayoutDashboard className="w-4 h-4" /> My Submissions</Link></li>
            
            {user?.role === "admin" && (
              <li><Link to="/admin" className="text-amber-400 hover:bg-amber-400/10"><Shield className="w-4 h-4" /> Admin Portal</Link></li>
            )}
            
            <div className="h-[1px] bg-white/10 my-2"></div>
            
            <li><button onClick={handleLogout} className="text-red-400 hover:bg-red-400/10"><LogOut className="w-4 h-4" /> Sign Out</button></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default WorkspaceNavbar;


