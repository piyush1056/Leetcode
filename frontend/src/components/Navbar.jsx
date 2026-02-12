import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import {
    Menu,
    X,
    Code2,
    LogOut,
    User,
    Settings,
    ChevronDown,
    Trophy,
    BookOpen,
    CheckCircle,
    Bookmark,
    FileText,
    Shield,
    LayoutDashboard,
    Mountain
} from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { logoutUser } from '../redux/slices/authSlice';

const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { user, isAuthenticated } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(logoutUser());
    };

    const navLinks = [
        { name: 'Problems', href: '/problems', icon: BookOpen },
        { name: 'Leaderboard', href: '/leaderboard', icon: Trophy },
    ];

    return (
        <nav className="bg-base-100/80 backdrop-blur-lg border-b border-base-300 sticky top-0 z-50 h-14 flex items-center">
            <div className="container mx-auto px-4 flex items-center justify-between">
                
               {/* Logo */}
<Link to="/" className="flex items-center gap-3 group select-none">
    
    <div className="relative flex items-center justify-center w-10 h-10 bg-base-content text-base-100 rounded-xl shadow-xl shadow-base-content/10 group-hover:scale-105 group-hover:shadow-base-content/20 transition-all duration-300">

        <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-white/20 rounded-xl"></div>
        
        <Mountain strokeWidth={2.5} className="w-5 h-5 relative z-10 fill-current" />
    </div>

    <div className="flex flex-col justify-center -space-y-0.5">
        <span className="font-bold text-lg tracking-tight text-base-content group-hover:text-primary transition-colors duration-300">
            CodeClimb
        </span>
        <span className="text-[9px] font-bold tracking-[0.2em] text-base-content/40 uppercase">
            Mastery
        </span>
    </div>
</Link>

                {/* Center Nav Links (Desktop) */}
                <div className="hidden lg:flex items-center gap-2">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.href}
                            className="btn btn-ghost btn-sm gap-2 text-sm font-medium opacity-80 hover:opacity-100"
                        >
                            <link.icon className="w-4 h-4" />
                            {link.name}
                        </Link>
                    ))}
                </div>

                {/* Right Side Actions */}
                <div className="flex items-center gap-3">
                    <ThemeToggle />

                    {isAuthenticated ? (
                        <div className="dropdown dropdown-end">
                            <label tabIndex={0} className="btn btn-ghost gap-2 text-sm pl-2 pr-1 rounded-full border border-transparent hover:border-base-300">
                                <div className="avatar placeholder">
                                    <div className="bg-neutral text-neutral-content rounded-full w-8 ring-2 ring-base-100 shadow-sm">
                                        {user?.avatar ? (
                                            <img src={user.avatar} alt={user.fullName} />
                                        ) : (
                                            <span className="text-xs font-bold">{user?.fullName?.charAt(0) || 'U'}</span>
                                        )}
                                    </div>
                                </div>
                                <span className="hidden md:inline max-w-24 truncate font-semibold opacity-90">
                                    {user?.fullName || 'User'}
                                </span>
                                <ChevronDown className="w-4 h-4 opacity-50" />
                            </label>

                            {/* Dropdown Menu */}
                            <ul
                                tabIndex={0}
                                className="dropdown-content z-[1] menu p-2 shadow-xl bg-base-100 rounded-xl w-64 border border-base-200 mt-2 gap-1"
                            >
                                {/* User Info Header */}
                                <li className="px-4 py-3 bg-base-200/50 rounded-lg mb-1 pointer-events-none">
                                   <span className="text-xs font-medium opacity-50 block mb-0.5 p-0 hover:bg-transparent">Signed in as</span>
                                   <span className="font-bold text-sm truncate block p-0 hover:bg-transparent text-base-content">{user?.username}</span>
                                </li>

                                <li>
                                    <Link to="/profile">
                                        <User className="w-4 h-4" /> My Profile
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/profile/edit">
                                        <Settings className="w-4 h-4" /> Edit Profile
                                    </Link>
                                </li>
                                <div className="divider my-0"></div>
                                <li>
                                    <Link to="/submissions">
                                        <FileText className="w-4 h-4" /> My Submissions
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/my-problems/solved">
                                        <CheckCircle className="w-4 h-4" /> Solved Problems
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/my-problems/saved">
                                        <Bookmark className="w-4 h-4" /> Saved Problems
                                    </Link>
                                </li>

                                {/* Admin Portal Logic */}
                                {user?.role === 'admin' && (
                                    <>
                                        <div className="divider my-0"></div>
                                        <li>
                                            <Link to="/admin" className="text-primary hover:bg-primary/10">
                                                <Shield className="w-4 h-4" /> Admin Portal
                                            </Link>
                                        </li>
                                    </>
                                )}

                                <div className="divider my-0"></div>
                                <li>
                                    <button onClick={handleLogout} className="text-error hover:bg-error/10">
                                        <LogOut className="w-4 h-4" /> Sign Out
                                    </button>
                                </li>
                            </ul>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link to="/login" className="btn btn-ghost btn-sm">
                                Sign In
                            </Link>
                            <Link to="/register" className="btn btn-primary btn-sm rounded-lg px-4 shadow-md shadow-primary/20">
                                Get Started
                            </Link>
                        </div>
                    )}

                    {/* Mobile Menu Toggle */}
                    <button
                        className="lg:hidden btn btn-square btn-ghost btn-sm"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu (Dropdown) */}
            {isMobileMenuOpen && (
                <div className="absolute top-14 left-0 w-full bg-base-100 border-b border-base-300 shadow-2xl lg:hidden p-4 flex flex-col gap-2 animate-in slide-in-from-top-2 duration-200">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.href}
                            className="btn btn-ghost justify-start gap-3 h-12"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <link.icon className="w-5 h-5 text-primary" />
                            {link.name}
                        </Link>
                    ))}
                </div>
            )}
        </nav>
    );
};

export default Navbar;