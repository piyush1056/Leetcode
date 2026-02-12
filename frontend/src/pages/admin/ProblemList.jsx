import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router';
import { fetchAdminProblemsAsync, deleteProblemAsync } from '../../redux/slices/adminSlice';
import { Trash2, Edit, Plus, Search, Eye } from 'lucide-react';

const ProblemList = () => {
    const dispatch = useDispatch();
    const { problems, loading, pagination } = useSelector((state) => state.admin);
    const [searchTerm, setSearchTerm] = useState('');

    // Fetch problems on mount
    useEffect(() => {
        dispatch(fetchAdminProblemsAsync({ limit: 50 }));
    }, [dispatch]);

    // Handle Search
    const handleSearch = (e) => {
        e.preventDefault();
        dispatch(fetchAdminProblemsAsync({ search: searchTerm, page: 1 }));
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this problem? This cannot be undone.")) {
            dispatch(deleteProblemAsync(id));
        }
    };

    const getDifficultyColor = (difficulty) => {
        const diff = difficulty?.toLowerCase();
        switch (diff) {
            case 'easy':
                return 'bg-emerald-500/15 text-emerald-700 border border-emerald-400/30';
            case 'medium':
                return 'bg-amber-500/15 text-amber-700 border border-amber-400/30';
            case 'hard':
                return 'bg-rose-500/15 text-rose-700 border border-rose-400/30';
            case 'super-hard':
                return 'bg-violet-500/15 text-violet-700 border border-violet-400/30';
            default:
                return 'bg-gray-500/15 text-gray-700 border border-gray-400/30';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header & Search */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <h2 className="text-2xl font-bold">Manage Problems</h2>

                <div className="flex gap-2 w-full md:w-auto">
                    <form onSubmit={handleSearch} className="join w-full">
                        <input
                            className="input input-bordered join-item w-full md:w-64"
                            placeholder="Search by title..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button type="submit" className="btn btn-square join-item">
                            <Search size={20} />
                        </button>
                    </form>

                    <Link to="/admin/problem/create" className="btn btn-primary gap-2">
                        <Plus size={18} />
                        <span className="hidden sm:inline">Add New</span>
                    </Link>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto bg-base-100 rounded-xl shadow border border-base-200">
                <table className="table">
                    <thead className="bg-base-200">
                        <tr>
                            <th>No.</th>
                            <th>Title</th>
                            <th>Difficulty</th>
                            <th>Acceptance</th>
                            <th className="text-right">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {loading.problems ? (
                            <tr>
                                <td colSpan="5" className="text-center p-8">
                                    <span className="loading loading-spinner"></span>
                                </td>
                            </tr>
                        ) : problems?.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="text-center p-8 text-base-content/50">
                                    No problems found.
                                </td>
                            </tr>
                        ) : (
                            problems.map((prob) => (
                                <tr key={prob._id} className="hover">
                                    <td className="font-mono text-xs opacity-60">
                                        #{prob.problemNo}
                                    </td>

                                    <td>
                                        <div className="font-semibold text-[15px] leading-snug">
                                            {prob.title}
                                        </div>

                                        <div className="mt-1 flex gap-1 flex-wrap">
                                            {prob.tags?.slice(0, 1).map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="text-[9px] px-2 py-0.5 rounded-md
                                                               bg-base-200/40 text-base-content/50
                                                               border border-base-300/30"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                            {prob.tags?.length > 1 && (
                                                <span className="text-[9px] text-base-content/40">
                                                    +{prob.tags.length - 1}
                                                </span>
                                            )}
                                        </div>
                                    </td>

                                    <td>
                                        <span
                                            className={`text-[10px] px-3 py-1 rounded-full font-semibold uppercase ${getDifficultyColor(
                                                prob.difficulty
                                            )}`}
                                        >
                                            {prob.difficulty}
                                        </span>
                                    </td>

                                    <td>
                                        {prob.acceptance ? prob.acceptance.toFixed(1) : 0}%
                                    </td>

                                    <td className="flex justify-end gap-2">
                                        <Link
                                            to={`/problem/${prob._id}`}
                                            className="btn btn-ghost btn-xs"
                                        >
                                            <Eye size={16} />
                                        </Link>

                                        <Link
                                            to={`/admin/problem/edit/${prob._id}`}
                                            className="btn btn-ghost btn-xs text-info"
                                        >
                                            <Edit size={16} />
                                        </Link>

                                        <button
                                            onClick={() => handleDelete(prob._id)}
                                            className="btn btn-ghost btn-xs text-error"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {pagination && pagination.pages > 1 && (
                <div className="join flex justify-center mt-4">
                    <button
                        className="join-item btn"
                        disabled={pagination.page === 1}
                        onClick={() =>
                            dispatch(fetchAdminProblemsAsync({ page: pagination.page - 1 }))
                        }
                    >
                        «
                    </button>

                    <button className="join-item btn">
                        Page {pagination.page}
                    </button>

                    <button
                        className="join-item btn"
                        disabled={pagination.page === pagination.pages}
                        onClick={() =>
                            dispatch(fetchAdminProblemsAsync({ page: pagination.page + 1 }))
                        }
                    >
                        »
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProblemList;

