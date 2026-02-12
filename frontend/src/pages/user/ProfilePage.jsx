import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import axiosInstance from "../../utils/axiosClient";
import { 
  Edit, 
  List, 
  Trophy, 
  Flame, 
  CheckCircle, 
  Code, 
  ThumbsUp, 
  Star,
  User
} from "lucide-react";

const ProfilePage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axiosInstance.get("/problem/me/user-data");
        setData(res.data);
      } catch (err) {
        console.error("Failed to load profile", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-base-200">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-[50vh] flex flex-col justify-center items-center text-error gap-2">
        <User size={48} />
        <h2 className="text-xl font-bold">Failed to load profile</h2>
      </div>
    );
  }

  const { user, stats } = data;

  return (
    <div className="min-h-screen bg-base-200 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        
        {/* Main Grid Layout: 1 column on mobile, 3 columns on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/*  LEFT COLUMN: User Profile Card  */}
          <div className="lg:col-span-1">
            <div className="card bg-base-100 shadow-xl overflow-hidden sticky top-10">
              
              {/*  Banner */}
              <div className="h-32 bg-gradient-to-r from-primary to-secondary"></div>
              
              <div className="card-body pt-0 relative">
                {/* Avatar  */}
                <div className="avatar -mt-16 mb-4">
                  <div className="w-32 rounded-full ring ring-base-100 ring-offset-base-100 ring-offset-2 shadow-lg">
                    <img
                      src={user.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=profile"}
                      alt="avatar"
                    />
                  </div>
                </div>

                {/* User Info */}
                <div>
                  <h2 className="text-3xl font-bold text-base-content">{user.fullName}</h2>
                  <p className="text-primary font-medium">@{user.username}</p>
                </div>

                {/* Bio Section */}
                {user.bio ? (
                  <div className="mt-4 p-4 bg-base-200 rounded-lg text-sm italic opacity-80">
                    "{user.bio}"
                  </div>
                ) : (
                  <p className="mt-4 text-sm text-base-content/50 italic">No bio available</p>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col gap-3 mt-6">
                  <button
                    className="btn btn-outline btn-primary w-full gap-2"
                    onClick={() => navigate("/profile/edit")}
                  >
                    <Edit size={18} /> Edit Profile
                  </button>
                  <button
                    className="btn btn-ghost w-full gap-2 border border-base-300"
                    onClick={() => navigate("/submissions")}
                  >
                    <List size={18} /> View Submissions
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* === RIGHT COLUMN: Stats & Activities === */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* 1. Main Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Solved Card (Hero Stat) */}
              <div className="card bg-base-100 shadow-lg border-l-4 border-success">
                <div className="card-body flex flex-row items-center gap-4">
                  <div className="p-4 bg-success/10 rounded-full text-success">
                    <CheckCircle size={32} />
                  </div>
                  <div>
                    <h3 className="stat-value text-3xl font-extrabold">{stats.solvedCount}</h3>
                    <p className="text-sm font-medium opacity-70">Problems Solved</p>
                  </div>
                </div>
              </div>

              {/* Submissions Card */}
              <div className="card bg-base-100 shadow-lg border-l-4 border-info">
                <div className="card-body flex flex-row items-center gap-4">
                  <div className="p-4 bg-info/10 rounded-full text-info">
                    <Code size={32} />
                  </div>
                  <div>
                    <h3 className="stat-value text-3xl font-extrabold">{stats.totalSubmissions}</h3>
                    <p className="text-sm font-medium opacity-70">Total Submissions</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Secondary Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="card bg-base-100 shadow-md">
                <div className="card-body p-6 flex flex-col items-center text-center">
                  <ThumbsUp className="text-primary mb-2" size={24} />
                  <span className="text-2xl font-bold">{stats.likesCount}</span>
                  <span className="text-xs uppercase tracking-wide opacity-60">Likes</span>
                </div>
              </div>
              
              <div className="card bg-base-100 shadow-md">
                <div className="card-body p-6 flex flex-col items-center text-center">
                  <Star className="text-warning mb-2" size={24} />
                  <span className="text-2xl font-bold">{stats.favouritesCount}</span>
                  <span className="text-xs uppercase tracking-wide opacity-60">Favorites</span>
                </div>
              </div>
            </div>

            {/* 3. Streak Section */}
            <div className="card bg-gradient-to-br from-base-100 to-base-200 shadow-xl border border-base-300">
              <div className="card-body">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  Activity Streaks
                </h3>
                
                <div className="flex flex-col sm:flex-row gap-6 justify-around">
                  {/* Current Streak */}
                  <div className="flex items-center gap-4 p-4 bg-base-100 rounded-xl shadow-sm w-full">
                    <div className="p-3 bg-orange-100 text-orange-500 rounded-full">
                      <Flame size={28} />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-orange-500">{user.currentStreak} Days</div>
                      <div className="text-xs font-semibold opacity-60">Current Streak</div>
                    </div>
                  </div>

                  {/* Longest Streak */}
                  <div className="flex items-center gap-4 p-4 bg-base-100 rounded-xl shadow-sm w-full">
                    <div className="p-3 bg-yellow-100 text-yellow-600 rounded-full">
                      <Trophy size={28} />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{user.longestStreak} Days</div>
                      <div className="text-xs font-semibold opacity-60">All-Time Best</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
