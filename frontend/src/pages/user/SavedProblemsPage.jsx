import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import axiosInstance from "../../utils/axiosClient";
import { Star, Bookmark, FolderOpen, ChevronRight, Hash } from "lucide-react";

const difficultyBadge = (diff) => {
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

const SavedProblemsPage = () => {
  const [favourites, setFavourites] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSaved = async () => {
      try {
        const [favRes, sprintRes] = await Promise.all([
          axiosInstance.get("/problem/me/saved"),
          axiosInstance.get("/profile/sprints"),
        ]);

        setFavourites(favRes.data.favourites || []);
        setBookmarks(sprintRes.data.bookmarks || []);
      } catch (err) {
        console.error("Failed to load saved problems", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSaved();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* ---------- Header ---------- */}
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-xl text-primary">
            <Bookmark size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Saved Collections</h1>
            <p className="opacity-60 text-sm font-medium">
              Manage your favourite problems and sprint lists
            </p>
          </div>
        </div>

        {/* ---------- SECTION 1: FAVOURITES ---------- */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body p-0">
            {/* Card Header */}
            <div className="p-6 border-b border-base-200 flex justify-between items-center">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Star className="fill-warning text-warning" size={20} />
                Favourites
              </h2>
              <span className="badge badge-ghost font-mono">
                {favourites.length} Problems
              </span>
            </div>

            {/* Content */}
            {favourites.length === 0 ? (
              <div className="p-12 text-center text-base-content/50">
                <Star size={48} className="mx-auto mb-4 opacity-20" />
                <p>No favourite problems yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead>
                    <tr className="bg-base-200/50 text-base-content/60">
                      <th className="w-16 text-center">Status</th>
                      <th>Problem Title</th>
                      <th className="w-32">Difficulty</th>
                      <th className="w-16"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {favourites.map((p) => (
                      <tr
                        key={p._id}
                        className="hover:bg-base-200/50 cursor-pointer transition-colors group"
                        onClick={() => navigate(`/problem/${p._id}`)}
                      >
                        <td className="text-center">
                          <Star 
                            size={18} 
                            className="text-warning mx-auto group-hover:fill-warning transition-all" 
                          />
                        </td>
                        
                        <td className="font-semibold text-base">
                          <span className="opacity-50 mr-2 font-mono text-sm">
                            {p.problemNo}.
                          </span>
                          {p.title}
                        </td>
                        
                        <td>
                          <span className={`badge badge-sm font-medium ${difficultyBadge(p.difficulty)}`}>
                            {p.difficulty}
                          </span>
                        </td>
                        
                        <td className="text-right text-base-content/30 group-hover:text-primary transition-colors">
                          <ChevronRight size={20} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* ---------- SECTION 2: SPRINTS (Bookmarks) ---------- */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2 px-1">
            <FolderOpen className="text-primary" size={20} />
            Sprints & Lists
          </h2>

          {bookmarks.length === 0 ? (
            <div className="card bg-base-100 shadow-xl p-8 text-center opacity-70 border border-dashed border-base-300">
              <p>No sprints created yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookmarks.map((sprint, idx) => (
                <div 
                  key={idx} 
                  className="card bg-base-100 shadow-md hover:shadow-xl transition-all border border-base-200 group"
                >
                  <div className="card-body">
                    {/* Sprint Header */}
                    <div className="flex justify-between items-start mb-2">
                      <div className="p-2 bg-base-200 rounded-lg group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                        <FolderOpen size={24} />
                      </div>
                      <span className="text-xs font-bold px-2 py-1 rounded bg-yellow-100 text-yellow-700">
                        {sprint.problems.length} Items
                      </span>
                    </div>

                    <h3 className="card-title text-lg">{sprint.name}</h3>
                    
                    <div className="divider my-2"></div>

                    {/* Problems Preview List inside Card */}
                    {sprint.problems.length === 0 ? (
                      <p className="text-sm opacity-50 italic">Empty list</p>
                    ) : (
                      <ul className="space-y-2 max-h-40 overflow-y-auto pr-1 custom-scrollbar">
                        {sprint.problems.map((p) => (
                          <li
                            key={p._id}
                            className="flex justify-between items-center text-sm p-2 rounded hover:bg-base-200 cursor-pointer"
                            onClick={() => navigate(`/problem/${p._id}`)}
                          >
                            <span className="truncate max-w-[70%] opacity-80 group-hover/item:opacity-100">
                              {p.problemNo}. {p.title}
                            </span>
                            <div className={`w-2 h-2 rounded-full ${
                                p.difficulty === 'Easy' ? 'bg-success' :
                                p.difficulty === 'Medium' ? 'bg-warning' : 'bg-error'
                            }`}></div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </div>
    </div>
  );
};

export default SavedProblemsPage;
