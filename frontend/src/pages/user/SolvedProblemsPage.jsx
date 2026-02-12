import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import axiosInstance from "../../utils/axiosClient";
import { CheckCircle, Calendar, Star, Trophy, ArrowRight } from "lucide-react";

const difficultyColor = (diff) => {
  switch (diff?.toLowerCase()) {
    case "easy":
      return "text-success bg-success/10 border-success/20";
    case "medium":
      return "text-warning bg-warning/10 border-warning/20";
    case "hard":
      return "text-error bg-error/10 border-error/20";
    case "super-hard":
      return "text-purple-600 bg-purple-500/10 border-purple-500/20";
    default:
      return "text-info";
  }
};

const SolvedProblemsPage = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSolved = async () => {
      try {
        const res = await axiosInstance.get("/problem/me/solved");
        setProblems(res.data || []);
      } catch (err) {
        console.error("Failed to fetch solved problems", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSolved();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }


  const totalPoints = problems.reduce((acc, curr) => acc + (curr.pointsEarned || 0), 0);

  return (
    <div className="min-h-screen bg-base-200 py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* ---------- Header Section ---------- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-success/10 text-success rounded-xl">
              <CheckCircle size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Solved Problems</h1>
              <p className="opacity-60 text-sm font-medium">
                Track your journey and earnings
              </p>
            </div>
          </div>

          {/* Mini Stat Card */}
          <div className="bg-base-100 px-6 py-3 rounded-xl shadow-sm border border-base-200 flex items-center gap-3">
            <div className="bg-warning/20 p-2 rounded-full text-warning-content">
              <Trophy size={20} className="text-yellow-600" />
            </div>
            <div>
              <div className="text-xs opacity-60 font-bold uppercase">Total Points</div>
              <div className="text-xl font-black text-base-content">{totalPoints}</div>
            </div>
          </div>
        </div>

        {/* ---------- Main Content ---------- */}
        <div className="card bg-base-100 shadow-xl overflow-hidden border border-base-200">
          
          {problems.length === 0 ? (
            <div className="py-20 text-center flex flex-col items-center opacity-60">
              <Trophy size={64} className="mb-4 opacity-20" />
              <h3 className="text-xl font-bold">No problems solved yet</h3>
              <p className="text-sm max-w-xs mx-auto mt-2">
                Start solving problems to earn points and build your streak!
              </p>
              <button 
                onClick={() => navigate("/problems")} 
                className="btn btn-primary btn-sm mt-6"
              >
                Go to Problems
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table w-full">
                {/* Table Header */}
                <thead className="bg-base-200/50 text-base-content/60">
                  <tr>
                    <th className="py-4 pl-6 w-16 text-center">#</th>
                    <th>Problem Title</th>
                    <th>Difficulty</th>
                    <th>Date Solved</th>
                    <th className="text-right pr-6">Points</th>
                    <th className="w-10"></th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody>
                  {problems.map((p, index) => (
                    <tr
                      key={p._id}
                      className="group hover:bg-base-200/50 transition-colors cursor-pointer border-b border-base-200 last:border-none"
                      onClick={() => navigate(`/problem/${p._id}`)}
                    >
                      {/* Index */}
                      <td className="text-center font-mono opacity-50 py-4 pl-6">
                        {index + 1}
                      </td>

                      {/* Problem Title */}
                      <td>
                        <div className="font-bold text-base group-hover:text-primary transition-colors">
                          <span className="opacity-50 mr-2 font-normal text-sm">
                            {p.problemNo}.
                          </span>
                          {p.title}
                        </div>
                      </td>

                      {/* Difficulty Badge */}
                      <td>
                        <span className={`badge badge-sm font-medium border-0 ${difficultyColor(p.difficulty)}`}>
                          {p.difficulty}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="text-sm opacity-60 font-mono">
                        <div className="flex items-center gap-2">
                          <Calendar size={14} />
                          {new Date(p.solvedAt).toLocaleDateString()}
                        </div>
                      </td>

                      {/* Points  */}
                      <td className="text-right pr-6">
                        <div className="inline-flex items-center gap-1 font-bold text-yellow-600 bg-yellow-50 px-2 py-1 rounded-md border border-yellow-100">
                          <Star size={14} className="fill-yellow-600" />
                          <span>{p.pointsEarned}</span>
                        </div>
                      </td>

                      {/* Arrow Icon */}
                      <td className="pr-4 text-base-content/20 group-hover:text-primary transition-colors">
                        <ArrowRight size={18} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SolvedProblemsPage;
