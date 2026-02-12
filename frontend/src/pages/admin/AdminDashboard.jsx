import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminStatsAsync } from '../../redux/slices/adminSlice';
import { 
  Users, 
  Code, 
  CheckCircle, 
  Activity, 
  Calendar, 
  ArrowUpRight,
  MoreHorizontal
} from 'lucide-react';

const AdminDashboard = () => {
    const dispatch = useDispatch();
    const { stats, loading } = useSelector((state) => state.admin);

    useEffect(() => {
        dispatch(fetchAdminStatsAsync());
    }, [dispatch]);

    if (loading.stats || !stats) {
        return (
            <div className="min-h-[60vh] flex justify-center items-center">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    const cards = [
        { 
            title: 'Total Users', 
            value: stats.totalUsers, 
            icon: Users, 
            color: 'text-blue-500', 
            bg: 'bg-blue-500/10',
            trend: '+12% this month' 
        },
        { 
            title: 'Problems', 
            value: stats.totalProblems, 
            icon: Code, 
            color: 'text-purple-500', 
            bg: 'bg-purple-500/10',
            trend: '5 new added'
        },
        { 
            title: 'Submissions', 
            value: stats.totalSubmissions, 
            icon: CheckCircle, 
            color: 'text-emerald-500', 
            bg: 'bg-emerald-500/10',
            trend: '+85 today'
        },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            
            {/* --- Dashboard Header --- */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-base-300 pb-6">
                <div>
                    <h2 className="text-3xl font-extrabold flex items-center gap-3">
                        <Activity className="text-primary" /> Dashboard Overview
                    </h2>
                    <p className="text-base-content/60 mt-1">
                        Welcome back, Admin. Here's what's happening today.
                    </p>
                </div>
                <div className="flex items-center gap-2 text-sm font-medium bg-base-200 px-4 py-2 rounded-lg text-base-content/70">
                    <Calendar size={16} />
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
            </div>

            {/* --- Stats Grid --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {cards.map((card, idx) => (
                    <div key={idx} className="card bg-base-100 shadow-xl border border-base-200 hover:shadow-2xl transition-all duration-300 group">
                        <div className="card-body p-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm font-bold text-base-content/50 uppercase tracking-wider mb-1">
                                        {card.title}
                                    </p>
                                    <h3 className="text-4xl font-black text-base-content">
                                        {card.value}
                                    </h3>
                                </div>
                                <div className={`p-3 rounded-xl ${card.bg} ${card.color} group-hover:scale-110 transition-transform`}>
                                    <card.icon size={28} />
                                </div>
                            </div>
                            
                            <div className="mt-4 flex items-center gap-2 text-xs font-medium opacity-60">
                                <span className="text-success flex items-center gap-1 bg-success/10 px-1.5 py-0.5 rounded">
                                    <ArrowUpRight size={12} /> Active
                                </span>
                                <span>{card.trend}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* --- Recent Users Table --- */}
            <div className="card bg-base-100 shadow-xl border border-base-200 overflow-hidden">
                <div className="p-6 border-b border-base-200 flex justify-between items-center bg-base-200/30">
                    <h3 className="font-bold text-lg">Recently Joined Users</h3>
                    <button className="btn btn-xs btn-ghost">View All</button>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="table w-full">
                        <thead className="bg-base-200/50 text-base-content/60 text-xs uppercase tracking-wider">
                            <tr>
                                <th className="pl-6">User</th>
                                <th>Username</th>
                                <th>Role</th>
                                <th>Joined At</th>
                                <th className="w-10"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-base-200">
                            {stats.recentUsers?.length > 0 ? (
                                stats.recentUsers.map((user) => (
                                    <tr key={user._id} className="hover:bg-base-200/50 transition-colors">
                                        {/* User with Avatar */}
                                        <td className="pl-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="avatar">
                                                    <div className="w-10 rounded-full ring-1 ring-base-300">
                                                        <img 
                                                            src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`} 
                                                            alt={user.username} 
                                                        />
                                                    </div>
                                                </div>
                                                <div className="font-bold text-sm">
                                                    {user.fullName || "Unknown User"}
                                                </div>
                                            </div>
                                        </td>
                                        
                                        {/* Username */}
                                        <td>
                                            <span className="font-mono text-xs bg-base-200 px-2 py-1 rounded opacity-80">
                                                @{user.username}
                                            </span>
                                        </td>

                                        {/* Role Badge */}
                                        <td>
                                            <span className={`badge badge-sm font-medium ${user.role === 'admin' ? 'badge-primary' : 'badge-ghost'}`}>
                                                {user.role || 'user'}
                                            </span>
                                        </td>

                                        {/* Date */}
                                        <td className="text-sm opacity-60 font-mono">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </td>

                                        {/* Action */}
                                        <td className="pr-6">
                                            <button className="btn btn-square btn-ghost btn-sm opacity-50 hover:opacity-100">
                                                <MoreHorizontal size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center py-10 opacity-50">
                                        No recent users found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;