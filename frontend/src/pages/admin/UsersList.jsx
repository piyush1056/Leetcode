import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllUsersAsync, promoteUserAsync, deleteUserAsync } from '../../redux/slices/adminSlice';
import { 
  Shield, 
  User, 
  Search, 
  ShieldAlert, 
  Trash2, 
  Users
} from 'lucide-react';
import { toast } from 'sonner';

const UsersList = () => {
    const dispatch = useDispatch();
    const { users, loading } = useSelector((state) => state.admin);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        dispatch(fetchAllUsersAsync());
    }, [dispatch]);

    // Handle Promote with confirmation
    const handlePromote = (userId, userName) => {
        if (window.confirm(`Are you sure you want to promote ${userName} to Admin?`)) {
            dispatch(promoteUserAsync(userId))
                .unwrap()
                .then(() => toast.success(`${userName} promoted to Admin`))
                .catch(() => toast.error("Failed to promote user"));
        }
    };

    // Handle Delete with strict confirmation
    const handleDelete = (userId, userName) => {
        if (window.confirm(`⚠️ DANGER: This will permanently delete user "${userName}". Continue?`)) {
            dispatch(deleteUserAsync(userId))
                .unwrap()
                .then(() => toast.success("User deleted successfully"))
                .catch(() => toast.error("Failed to delete user"));
        }
    };

   
    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Filter Logic
    const filteredUsers = users?.filter(user => 
        (user.fullName || "").toLowerCase().includes(searchTerm.toLowerCase()) || 
        (user.username || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.email || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            
            {/* --- Header Section --- */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-base-100 p-4 rounded-xl shadow-sm border border-base-200">
                <div>
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Users className="text-primary" /> User Management
                    </h2>
                    <p className="text-xs text-base-content/60 mt-1">
                        View, manage, and modify user roles
                    </p>
                </div>
                
                {/* Search Bar */}
                <div className="relative w-full md:w-72">
                    <input 
                        type="text"
                        className="input input-bordered w-full pl-10 h-10 text-sm" 
                        placeholder="Search by name, email, username..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" size={16}/>
                </div>
            </div>

            {/* --- Table Section --- */}
            <div className="card bg-base-100 shadow-xl border border-base-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="table w-full">
                        {/* Table Head */}
                        <thead className="bg-base-200/50 text-base-content/60 text-xs uppercase tracking-wider">
                            <tr>
                                <th className="pl-6">User Profile</th>
                                <th>Role</th>
                                <th>Joined Date</th>
                                <th className="text-right pr-6">Actions</th>
                            </tr>
                        </thead>

                        {/* Table Body */}
                        <tbody className="divide-y divide-base-200">
                            {loading.users ? (
                                <tr>
                                    <td colSpan="4" className="text-center py-20">
                                        <span className="loading loading-spinner loading-lg text-primary"></span>
                                    </td>
                                </tr>
                            ) : filteredUsers?.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="text-center py-16 opacity-50 flex flex-col items-center">
                                        <Users size={48} className="mb-2 opacity-20" />
                                        <p>No users found matching "{searchTerm}"</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user._id} className="hover:bg-base-200/40 transition-colors">
                                        
                                        {/* User Column */}
                                        <td className="pl-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="avatar">
                                                    <div className="w-10 rounded-full ring-1 ring-base-300">
                                                        <img 
                                                            src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`} 
                                                            alt={user.username} 
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="font-bold text-sm">{user.fullName}</div>
                                                    <div className="text-xs opacity-50 flex flex-col sm:flex-row sm:gap-2">
                                                        <span>@{user.username}</span>
                                                        <span className="hidden sm:inline">•</span>
                                                        <span>{user.email}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Role Column */}
                                        <td>
                                            {user.role === 'admin' ? (
                                                <div className="badge badge-primary badge-sm gap-1 font-medium">
                                                    <Shield size={12}/> Admin
                                                </div>
                                            ) : (
                                                <div className="badge badge-ghost badge-sm gap-1 font-medium text-base-content/60">
                                                    <User size={12}/> User
                                                </div>
                                            )}
                                        </td>

                                        {/* Date Column */}
                                        <td className="text-sm font-mono opacity-60">
                                            {formatDate(user.createdAt)}
                                        </td>

                                        {/* Actions Column */}
                                        <td className="pr-6 text-right">
                                            <div className="flex justify-end items-center gap-3">
                                                
                                                {/* Promote Button  */}
                                                {user.role !== 'admin' && (
                                                    <button 
                                                        onClick={() => handlePromote(user._id, user.fullName)}
                                                        className="btn btn-xs btn-outline btn-success gap-1"
                                                    >
                                                        <ShieldAlert size={14} /> Promote
                                                    </button>
                                                )}

                                                {/* Delete Button */}
                                                <button 
                                                    onClick={() => handleDelete(user._id, user.fullName)}
                                                    className="btn btn-xs btn-outline btn-error gap-1"
                                                >
                                                    <Trash2 size={14} /> Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                
                {/* Footer Count */}
                <div className="bg-base-200/30 p-4 border-t border-base-200 text-xs text-base-content/50 font-medium">
                    Showing {filteredUsers?.length || 0} users
                </div>
            </div>
        </div>
    );
};

export default UsersList;