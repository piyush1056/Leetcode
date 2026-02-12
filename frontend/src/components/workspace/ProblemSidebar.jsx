import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useParams } from 'react-router';
import { X, Search, CheckCircle } from 'lucide-react';
import { toggleSidebar } from '../../redux/slices/workspaceSlice';
import axiosInstance from '../../utils/axiosClient';

const ProblemSidebar = () => {
    const { id: currentProblemId } = useParams();
    const dispatch = useDispatch();
    const { isSidebarOpen } = useSelector((state) => state.workspace);
    
   
    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

  
    const fetchProblems = async (pageNum, reset = false) => {
        if (loading) return;
        setLoading(true);
        try {
            const res = await axiosInstance.get(`/problem?page=${pageNum}&limit=20`); 
            const newProblems = res.data.problems || [];
            
            if (newProblems.length < 20) {
                setHasMore(false);
            }

            if (reset) {
                setProblems(newProblems);
            } else {
                setProblems(prev => [...prev, ...newProblems]);
            }
        } catch (error) {
            console.error("Failed to fetch problem list");
        } finally {
            setLoading(false);
        }
    };

    // Initial Load when Sidebar Opens
    useEffect(() => {
        if (isSidebarOpen && problems.length === 0) {
            fetchProblems(1, true);
        }
    }, [isSidebarOpen]);

    const handleLoadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchProblems(nextPage, false);
    };


    const getDifficultyColor = (difficulty) => {
        const diff = difficulty?.toLowerCase();
        switch (diff) {
            case 'easy': return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
            case 'medium': return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
            case 'hard': return 'bg-red-500/10 text-red-600 border-red-500/20';
            case 'super-hard': return 'bg-purple-500/10 text-purple-600 border-purple-500/20';
            default: return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
        }
    };

    const filteredProblems = problems.filter(p => 
        p.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/60 z-[100] backdrop-blur-[2px] transition-all duration-300"
                    onClick={() => dispatch(toggleSidebar())}
                />
            )}

            <div 
                className={`fixed top-0 left-0 h-full w-[85%] md:w-[25%] bg-base-100 z-[101] shadow-2xl transform transition-transform duration-300 ease-out border-r border-base-300 flex flex-col ${
                    isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                {/* Header */}
                <div className="h-14 min-h-[3.5rem] flex items-center justify-between px-4 border-b border-base-300 bg-base-100">
                    <span className="font-bold text-lg">Problem List</span>
                    <button onClick={() => dispatch(toggleSidebar())} className="btn btn-ghost btn-sm btn-square">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Search */}
                <div className="p-3 border-b border-base-300 bg-base-100/50">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/50" />
                        <input 
                            type="text" 
                            placeholder="Filter loaded problems..." 
                            className="input input-sm input-bordered w-full pl-9 focus:outline-none focus:border-primary"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* List Content */}
                <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-base-300">
                    <div className="flex flex-col py-2">
                        {filteredProblems.map((p) => {
                            const isActive = p._id === currentProblemId;
                            return (
                                <Link 
                                    key={p._id} 
                                    to={`/problem/${p._id}`}
                                    onClick={() => dispatch(toggleSidebar())}
                                    className={`group px-4 py-2 flex items-center gap-3 transition-all border-l-[3px] ${
                                        isActive ? 'bg-primary/5 border-primary' : 'border-transparent hover:bg-base-200'
                                    }`}
                                >
                                    {/* Solved/Unsolved Icon */}
                                    <div className={`${p.isSolved ? 'text-success' : 'text-base-content/20'}`}>
                                        <CheckCircle className="w-4 h-4" />
                                    </div>

                                    {/* Problem Title + Difficulty  */}
                                    <div className="flex-1 min-w-0 flex items-center justify-between">
                                        <span className={`text-sm truncate font-medium ${isActive ? 'text-primary' : 'text-base-content'}`}>
                                            {p.problemNo}. {p.title}
                                        </span>
                                        <span className={`text-[9px] px-2 py-0.5 rounded-full border font-medium uppercase tracking-wide ${getDifficultyColor(p.difficulty)}`}>
                                            {p.difficulty}
                                        </span>
                                    </div>
                                </Link>
                            );
                        })}

                        {/* LOAD MORE BUTTON */}
                        {hasMore && !searchTerm && (
                            <button 
                                onClick={handleLoadMore}
                                disabled={loading}
                                className="btn btn-ghost btn-sm mx-4 my-2 text-xs uppercase tracking-wide opacity-50 hover:opacity-100"
                            >
                                {loading ? <span className="loading loading-spinner loading-xs"></span> : "Load More"}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProblemSidebar;
