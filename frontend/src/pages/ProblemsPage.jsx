
import React, { useEffect, useState } from 'react';
import axiosClient from '../utils/axiosClient';
import { useNavigate } from 'react-router';
import { Bookmark, CheckCircle, Circle, Search, ChevronLeft, ChevronRight, X, Flame, Trophy } from 'lucide-react';
import { useSelector } from 'react-redux';

const ProblemsPage = () => {
    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [solvedIds, setSolvedIds] = useState(new Set());
    const [savedIds, setSavedIds] = useState(new Set());
    
    // Search & Filter State
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState({
        difficulty: [],
        tags: [],
        companies: []
    });

    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        pages: 1
    });

    const { user } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    const difficulties = ['easy', 'medium', 'hard', 'super-hard'];
    const tagsList = ['array', 'maths', 'strings', 'graph', 'DP', 'trees', 'linked-list', 'stacks', 'queues', 'hash-maps', 'sorting', 'binary-search', 'recursion'];
    const companiesList = ['Google', 'Amazon', 'Microsoft', 'Uber', 'Meta', 'Netflix','Flipkart','Apple'];

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Debounce Search
        const timer = setTimeout(() => {
            fetchProblems();
        }, 500);

        if (user) fetchUserStatus();

        return () => clearTimeout(timer);
      
    }, [pagination.page, filters, searchQuery]);

    const fetchProblems = async () => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams({
                page: pagination.page,
                limit: pagination.limit,
                ...(filters.difficulty.length && { difficulty: filters.difficulty.join(',') }),
                ...(filters.tags.length && { tags: filters.tags.join(',') }),
                ...(filters.companies.length && { companies: filters.companies.join(',') }),
                ...(searchQuery && { search: searchQuery })
            });

            const response = await axiosClient.get(`/problem?${queryParams.toString()}`);
            setProblems(response.data.problems);
            setPagination(prev => ({ ...prev, ...response.data.pagination }));
        } catch (error) {
            console.error("Failed to fetch problems:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchUserStatus = async () => {
        try {
            const [solvedRes, savedRes] = await Promise.all([
                axiosClient.get('/problem/me/solved'),
                axiosClient.get('/problem/me/saved')
            ]);
            setSolvedIds(new Set(solvedRes.data.map(p => p._id)));
            setSavedIds(new Set(savedRes.data.bookmarks.flatMap(b => b.problems.map(p => p._id))));
        } catch (error) {
            console.error("Failed to fetch user status:", error);
        }
    };

    const toggleBookmark = async (e, problemId) => {
        e.stopPropagation();
        e.preventDefault();
        try {
            await axiosClient.post('/problem/bookmarks/problem', { problemId });
            setSavedIds(prev => {
                const newSet = new Set(prev);
                newSet.has(problemId) ? newSet.delete(problemId) : newSet.add(problemId);
                return newSet;
            });
        } catch (error) {
            console.error("Toggle bookmark error:", error);
        }
    };

    const addFilter = (type, value) => {
        if (!value) return;
        setFilters(prev => {
            if (prev[type].includes(value)) return prev;
            return { ...prev, [type]: [...prev[type], value] };
        });
        setPagination(prev => ({ ...prev, page: 1 }));
    };

    const removeFilter = (type, value) => {
        setFilters(prev => ({
            ...prev,
            [type]: prev[type].filter(item => item !== value)
        }));
    };

    
    const getDifficultyColor = (diff) => {
        switch (diff?.toLowerCase()) {
            case 'easy': return 'text-success bg-success/10 border-success/20';
            case 'medium': return 'text-warning bg-warning/10 border-warning/20';
            case 'hard': return 'text-error bg-error/10 border-error/20';
            case 'super-hard': return 'text-purple-600 bg-purple-500/10 border-purple-500/20';
            default: return 'text-info';
        }
    };

    return (
        <div className="min-h-screen bg-base-100 text-base-content p-4 md:p-8">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* --- TOP SECTION --- */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Title Box */}
                    <div className="lg:col-span-2 bg-base-200/50 p-8 rounded-3xl border border-base-content/5 relative overflow-hidden">
                        <div className="relative z-10">
                            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                Problem Set
                            </h1>
                            <p className="text-base-content/70 text-lg max-w-lg mb-4">
                                Master Data Structures and Algorithms with our curated list of problems.
                            </p>
                            <div className="flex items-center gap-2 px-3 py-1 w-fit rounded-full bg-base-100 border border-base-content/10 text-sm font-medium">
                                <Trophy className="w-4 h-4 text-warning" />
                                <span>Ace your next interview</span>
                            </div>
                        </div>
                    </div>

                    {/* Daily Challenge Card */}
                    <div className="bg-base-200/50 p-6 rounded-3xl border border-base-content/5 flex flex-col justify-center relative overflow-hidden group hover:border-primary/20 transition-all">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Flame className="w-24 h-24" />
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                            <Flame className="w-5 h-5 text-error" />
                            <h3 className="font-bold text-lg">Daily Challenge</h3>
                        </div>
                        <p className="text-sm text-base-content/60 mb-4">Keep your streak alive! Solve today's featured problem.</p>
                        <button className="btn btn-sm btn-outline rounded-xl w-full">View Problem</button>
                    </div>
                </div>


                {/* --- CONTROLS SECTION  --- */}
                <div className="bg-base-100 sticky top-2 z-30 pt-2 pb-4">
                    <div className="bg-base-200/80 backdrop-blur-md p-3 rounded-2xl border border-base-content/10 shadow-sm">
                        <div className="flex flex-col md:flex-row gap-3">
                            
                            {/* Search Bar  */}
                            <div className="relative flex-1">
                                <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
                                <input
                                    type="text"
                                    placeholder="Search by title, tag or company..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="input input-bordered w-full pl-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
                                />
                            </div>

                            {/* Dropdowns  */}
                            <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0">
                                <select 
                                    className="select select-bordered rounded-xl w-32 md:w-40" 
                                    onChange={(e) => addFilter('difficulty', e.target.value)} value=""
                                >
                                    <option disabled value="">Difficulty</option>
                                    {difficulties.map(d => <option key={d} value={d}>{d}</option>)}
                                </select>

                                <select 
                                    className="select select-bordered rounded-xl w-32 md:w-40" 
                                    onChange={(e) => addFilter('tags', e.target.value)} value=""
                                >
                                    <option disabled value="">Tags</option>
                                    {tagsList.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>

                                <select 
                                    className="select select-bordered rounded-xl w-32 md:w-40" 
                                    onChange={(e) => addFilter('companies', e.target.value)} value=""
                                >
                                    <option disabled value="">Company</option>
                                    {companiesList.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                        </div>

                        {/* Active Filters Pills */}
                        {(filters.difficulty.length > 0 || filters.tags.length > 0 || filters.companies.length > 0) && (
                            <div className="flex flex-wrap gap-2 mt-3 pt-2 border-t border-base-content/10">
                                {filters.difficulty.map(item => (
                                    <span key={item} className={`badge gap-1 pr-1 ${getDifficultyColor(item)}`}>
                                        {item} <X className="w-3 h-3 cursor-pointer" onClick={() => removeFilter('difficulty', item)} />
                                    </span>
                                ))}
                                {filters.tags.map(item => (
                                    <span key={item} className="badge badge-neutral gap-1 pr-1">
                                        {item} <X className="w-3 h-3 cursor-pointer" onClick={() => removeFilter('tags', item)} />
                                    </span>
                                ))}
                                {filters.companies.map(item => (
                                    <span key={item} className="badge badge-outline gap-1 pr-1">
                                        {item} <X className="w-3 h-3 cursor-pointer" onClick={() => removeFilter('companies', item)} />
                                    </span>
                                ))}
                                <button onClick={() => {setFilters({difficulty: [], tags: [], companies: []}); setSearchQuery('');}} className="text-xs text-error hover:underline ml-auto">
                                    Clear all
                                </button>
                            </div>
                        )}
                    </div>
                </div>


                {/* --- TABLE SECTION  --- */}
                <div className="overflow-x-auto bg-base-200/30 rounded-2xl border border-base-content/5 shadow-xl">
                    <table className="table w-full">
                        <thead className="bg-base-300/50 text-base-content/70">
                            <tr>
                                <th className="w-12">Status</th>
                                <th className="w-16">No</th>
                                <th>Title</th>
                                <th className="w-32">Difficulty</th>
                                <th className="w-24">Acceptance</th>
                                <th className="hidden md:table-cell">Companies</th>
                                <th className="hidden md:table-cell">Tags</th>
                                <th className="w-12 text-center">BookMark</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                [...Array(10)].map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan="8" className="h-16 bg-base-100/50"></td>
                                    </tr>
                                ))
                            ) : problems.length > 0 ? (
                                problems.map((problem) => {
                                    const isSolved = solvedIds.has(problem._id);
                                    const isSaved = savedIds.has(problem._id);
                                    const acceptanceRate = problem.acceptance ? `${problem.acceptance.toFixed(1)}%` : 'N/A';

                                    return (
                                        <tr 
                                            key={problem._id} 
                                            onClick={() => navigate(`/problem/${problem._id}`)}
                                            className={`hover:bg-base-200 cursor-pointer border-b border-base-content/5 transition-colors h-[60px] ${isSolved ? 'bg-success/5' : ''}`}
                                        >
                                            <td>
                                                {isSolved ? (
                                                    <CheckCircle className="w-5 h-5 text-success" />
                                                ) : (
                                                    <Circle className="w-5 h-5 text-base-content/20" />
                                                )}
                                            </td>
                                            <td className="font-mono text-base-content/60">{problem.problemNo}</td>
                                            <td>
                                                <div className="font-semibold text-base-content">{problem.title}</div>
                                            </td>
                                            <td>
                                                <span className={`badge badge-sm font-medium border ${getDifficultyColor(problem.difficulty)}`}>
                                                    {problem.difficulty}
                                                </span>
                                            </td>
                                            <td className="text-base-content/60">{acceptanceRate}</td>
                                            <td className="hidden md:table-cell">
                                                <div className="flex flex-wrap gap-1">
                                                    {problem.companies?.slice(0, 2).map((company, i) => (
                                                        <span key={i} className="badge badge-xs badge-ghost opacity-70">{company}</span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="hidden md:table-cell">
                                                <div className="flex flex-wrap gap-1">
                                                    {problem.tags?.slice(0, 2).map((tag, i) => (
                                                        <span key={i} className="badge badge-outline badge-xs opacity-70">{tag}</span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="text-center">
                                                <button
                                                    onClick={(e) => toggleBookmark(e, problem._id)}
                                                    className="btn btn-ghost btn-xs btn-square"
                                                >
                                                    <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-warning text-warning' : 'text-base-content/20'}`} />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="8" className="text-center py-20 text-base-content/40">
                                        No problems found matching your filters.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* --- PAGINATION --- */}
                <div className="flex justify-center mt-6">
                    <div className="flex items-center gap-4 bg-base-100 p-2 pl-4 pr-4 rounded-full shadow-lg border border-base-200/60">
                        
                        {/* Previous Button */}
                        <button
                            className="btn btn-circle btn-sm btn-ghost hover:bg-base-200 transition-colors disabled:opacity-30"
            disabled={pagination.page === 1}
            onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
        >
            <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Page Indicator */}
        <span className="text-sm font-medium font-mono text-base-content/70">
            Page <span className="text-primary font-bold">{pagination.page}</span> of {pagination.pages}
        </span>

        {/* Next Button */}
        <button
            className="btn btn-circle btn-sm btn-ghost hover:bg-base-200 transition-colors disabled:opacity-30"
            disabled={pagination.page >= pagination.pages}
            onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
        >
            <ChevronRight className="w-5 h-5" />
        </button>
        
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ProblemsPage;

