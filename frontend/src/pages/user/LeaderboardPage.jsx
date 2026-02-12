import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import axiosInstance from "../../utils/axiosClient";
import { 
  Trophy, 
  Search, 
  Star, 
  TrendingUp, 
  CheckCircle2, 
  Medal,
  User,
  Zap
} from "lucide-react";

const LeaderboardPage = () => {
  const navigate = useNavigate();

  const [leaderboardData, setLeaderboardData] = useState(null);
  const [meProfile, setMeProfile] = useState(null);
  const [recentSolved, setRecentSolved] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [lbRes, meRes] = await Promise.all([
          axiosInstance.get("/profile/leaderboard"),
          axiosInstance.get("/profile/me")
        ]);

        setLeaderboardData(lbRes.data);
        setMeProfile(meRes.data);

        // Process recent solved problems
        const solved = meRes.data.user.problemsSolved || [];
        const sorted = solved
          .filter(p => p.problemId)
          .sort((a, b) => new Date(b.solvedAt) - new Date(a.solvedAt));

        setRecentSolved(sorted.slice(0, 5));
      } catch (err) {
        console.error("Failed to load leaderboard", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  const me = leaderboardData.user;
  const list = leaderboardData.leaderboard;

  // Filter logic
  const filteredLeaderboard = list.filter(u =>
    u.username?.toLowerCase().includes(search.toLowerCase()) ||
    u.fullName?.toLowerCase().includes(search.toLowerCase())
  );

  const diffStats = { easy: 0, medium: 0, hard: 0, superHard: 0 };
  
  meProfile.user.problemsSolved.forEach(p => {
    if (p.problemId?.difficulty) {
      const diff = p.problemId.difficulty.toLowerCase();
      
      if (diff === 'easy') diffStats.easy++;
      else if (diff === 'medium') diffStats.medium++;
      else if (diff === 'hard') diffStats.hard++;
      else if (diff === 'super-hard') diffStats.superHard++;
    }
  });

  return (
    <div className="min-h-screen bg-base-200 py-10 px-4">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* ---------- Page Header ---------- */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-base-300 pb-6">
          <div>
            <h1 className="text-4xl font-extrabold flex items-center gap-3 text-base-content">
              <Trophy className="text-yellow-500 fill-yellow-500" size={36} />
              Leaderboard
            </h1>
            <p className="text-base-content/60 mt-2 font-medium">
              See where you stand among the top problem solvers.
            </p>
          </div>
          
          {/* Your Quick Rank Badge */}
          <div className="hidden md:flex items-center gap-8 bg-base-100 px-8 py-4 rounded-xl shadow-sm border border-base-300">
            <div className="text-left">
              <div className="text-xs uppercase font-bold opacity-50 mb-1">Your Rank</div>
              <div className="text-3xl font-black text-primary">#{me.rank}</div>
            </div>
            <div className="h-10 w-[1px] bg-base-300"></div>
            <div className="text-left">
              <div className="text-xs uppercase font-bold opacity-50 mb-1">Total Points</div>
              <div className="text-3xl font-black text-base-content flex items-center gap-2">
                {me.points} 
                <Star size={20} className="text-yellow-500 fill-yellow-500" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* ---------- LEFT COLUMN: User Dashboard (Sticky) ---------- */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* 1. Profile Summary Card */}
            <div className="card bg-base-100 shadow-xl border border-base-200">
              <div className="card-body items-center text-center p-6">
                <div className="avatar mb-3">
                  <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                    <img src={me.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=me"} alt="me" />
                  </div>
                </div>
                <h2 className="text-xl font-bold">{me.fullName}</h2>
                <p className="text-sm opacity-60 font-mono">@{me.username}</p>
                
                <div className="w-full mt-4 p-3 bg-base-200 rounded-lg flex justify-between items-center">
                   <span className="text-sm font-medium opacity-70">Total Solved</span>
                   <span className="text-lg font-bold">{meProfile.stats.totalSolved}</span>
                </div>
              </div>
            </div>

            {/* 2. Solved Statistics */}
            <div className="card bg-base-100 shadow-xl border border-base-200">
              <div className="card-body p-5">
                <h3 className="font-bold text-sm uppercase opacity-50 mb-4 flex items-center gap-2">
                  <TrendingUp size={16} /> Performance
                </h3>
                
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col items-center p-2 rounded-lg bg-success/10 text-success">
                    <span className="text-lg font-bold">{diffStats.easy}</span>
                    <span className="text-xs font-medium">Easy</span>
                  </div>
                  <div className="flex flex-col items-center p-2 rounded-lg bg-warning/10 text-warning">
                    <span className="text-lg font-bold">{diffStats.medium}</span>
                    <span className="text-xs font-medium">Med</span>
                  </div>
                  <div className="flex flex-col items-center p-2 rounded-lg bg-error/10 text-error">
                    <span className="text-lg font-bold">{diffStats.hard}</span>
                    <span className="text-xs font-medium">Hard</span>
                  </div>
                  
                  <div className="flex flex-col items-center p-2 rounded-lg bg-purple-500/10 text-purple-600">
                    <span className="text-lg font-bold flex items-center gap-1">
                      {diffStats.superHard} 
                      {diffStats.superHard > 0 && <Zap size={12} className="fill-purple-600" />}
                    </span>
                    <span className="text-xs font-medium">Super</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Recent Activity List */}
            <div className="card bg-base-100 shadow-xl border border-base-200">
              <div className="card-body p-5">
                <h3 className="font-bold text-sm uppercase opacity-50 mb-2 flex items-center gap-2">
                  <CheckCircle2 size={16} /> Recently Solved
                </h3>

                {recentSolved.length === 0 ? (
                  <p className="text-sm opacity-50 italic py-2">No problems solved yet.</p>
                ) : (
                  <ul className="flex flex-col gap-3 mt-2">
                    {recentSolved.map(p => (
                      <li key={p.problemId._id} className="flex justify-between items-center text-sm border-b border-base-200 pb-2 last:border-0 last:pb-0">
                        <span className="font-medium truncate max-w-[140px]" title={p.problemId.title}>
                          {p.problemId.title}
                        </span>
                        <span className="text-xs opacity-50 font-mono">
                          {new Date(p.solvedAt).toLocaleDateString(undefined, {month:'short', day:'numeric'})}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

          </div>

          {/* ---------- RIGHT COLUMN: Main Leaderboard Table ---------- */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Search Bar */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search by username..."
                className="input input-lg input-bordered w-full pl-12 bg-base-100 shadow-sm text-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40" size={20} />
            </div>

            {/* Table Card */}
            <div className="card bg-base-100 shadow-xl overflow-hidden border border-base-200">
              <div className="overflow-x-auto">
                <table className="table w-full">
                  {/* Table Header */}
                  <thead className="bg-base-200/50 text-base-content/60 text-xs uppercase tracking-wider">
                    <tr>
                      <th className="w-20 text-center py-4">Rank</th>
                      <th>User</th>
                      <th className="text-center">Problems Solved</th>
                      <th className="text-right pr-8">Points</th>
                    </tr>
                  </thead>

                  {/* Table Body */}
                  <tbody>
                    {filteredLeaderboard.map((u) => {
                      const isMe = u._id === me._id;
                      
                      // Top 3 Badge Logic
                      let RankIcon = null;
                      if (u.rank === 1) RankIcon = <Medal size={24} className="text-yellow-500 drop-shadow-sm" />;
                      if (u.rank === 2) RankIcon = <Medal size={24} className="text-gray-400 drop-shadow-sm" />;
                      if (u.rank === 3) RankIcon = <Medal size={24} className="text-orange-400 drop-shadow-sm" />;

                      return (
                        <tr
                          key={u._id}
                          className={`
                            group transition-colors border-b border-base-200 last:border-none
                            ${isMe ? "bg-primary/5 hover:bg-primary/10 border-l-4 border-l-primary" : "hover:bg-base-200/50"}
                          `}
                        >
                          {/* Rank Column */}
                          <td className="text-center font-bold text-lg py-4">
                            <div className="flex justify-center items-center">
                              {RankIcon ? RankIcon : <span className="opacity-40">#{u.rank}</span>}
                            </div>
                          </td>

                          {/* User Column */}
                          <td onClick={() => navigate(`/user/${u._id}`)} className="cursor-pointer">
                            <div className="flex items-center gap-3">
                              <div className={`avatar ${isMe ? 'online' : ''}`}>
                                <div className="w-10 rounded-full ring-1 ring-base-300">
                                  <img src={u.avatar || "https://api.dicebear.com/7.x/avataaars/svg"} alt="avatar" />
                                </div>
                              </div>
                              <div>
                                <div className={`font-bold ${isMe ? 'text-primary' : 'text-base-content'} flex items-center gap-2`}>
                                  {u.fullName || u.username}
                                  {isMe && <span className="badge badge-xs badge-primary">You</span>}
                                </div>
                                <div className="text-xs opacity-50 font-mono">@{u.username}</div>
                              </div>
                            </div>
                          </td>

                          {/* Solved Count - JUST NUMBER */}
                          <td className="text-center font-mono font-medium text-base opacity-70">
                            {u.solved}
                          </td>

                          {/* Points Column - SUBTLE LOOK */}
                          <td className="text-right pr-8">
                            <div className="inline-flex items-center justify-end gap-1.5 font-bold text-base-content/80 bg-base-200/50 px-3 py-1.5 rounded-lg">
                              <span>{u.points}</span>
                              <Star size={16} className="text-yellow-500 fill-yellow-500" />
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {filteredLeaderboard.length === 0 && (
                   <div className="text-center py-10 opacity-50">
                     <User size={40} className="mx-auto mb-2 opacity-20" />
                     <p>No users found</p>
                   </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;