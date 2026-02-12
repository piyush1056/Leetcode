import React from 'react';
import { NavLink, Outlet } from 'react-router';
import { LayoutDashboard, Users, FileCode, LogOut } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../../redux/slices/authSlice';
import { useNavigate } from 'react-router';

const AdminLayout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

   const handleLogout = async () => {
    try {
        await dispatch(logoutUser()).unwrap();
        navigate('/login');   
    } catch (err) {
        console.error(err);
    }
};

    const navItems = [
        { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/admin/problems', label: 'Problems', icon: FileCode },
        { path: '/admin/users', label: 'Users', icon: Users },
    ];

    return (
        <div className="drawer lg:drawer-open">
            <input id="admin-drawer" type="checkbox" className="drawer-toggle" />
            
            {/* Page Content */}
            <div className="drawer-content flex flex-col min-h-screen bg-base-200 p-6">
                <label htmlFor="admin-drawer" className="btn btn-primary drawer-button lg:hidden mb-4">
                    Menu
                </label>
                <Outlet />
            </div> 
            
            {/* Sidebar */}
            <div className="drawer-side">
                <label htmlFor="admin-drawer" className="drawer-overlay"></label> 
                <ul className="menu p-4 w-64 min-h-full bg-base-100 text-base-content border-r border-base-300">
                    <div className="mb-8 px-4">
                        <h1 className="text-2xl font-bold text-primary">Admin Portal</h1>
                    </div>
                    
                    {navItems.map((item) => (
                        <li key={item.path} className="mb-2">
                            <NavLink 
                                to={item.path}
                                className={({ isActive }) => 
                                    isActive ? "active font-medium" : "font-medium"
                                }
                            >
                                <item.icon size={20} />
                                {item.label}
                            </NavLink>
                        </li>
                    ))}
                    
                    <div className="mt-auto">
                       <li>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 font-medium text-error hover:bg-error/10 px-2 py-1 rounded"
                        >
                            <LogOut size={20} />
                            Logout
                        </button>
                    </li>
                    </div>
                </ul>
            </div>
        </div>
    );
};

export default AdminLayout;