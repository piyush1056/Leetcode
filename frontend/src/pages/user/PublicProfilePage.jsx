import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import axiosInstance from "../../utils/axiosClient";
import { 
  User, 
  Star, 
  CheckCircle2, 
  Flame, 
  Trophy, 
  ArrowLeft, 
  Calendar,
  MapPin
} from "lucide-react";

const PublicProfilePage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axiosInstance.get(`/profile/${userId}`);
        setUser(res.data.user || res.data); 
      } catch (err) {
        console.error("Failed to load public profile", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-base-200">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-base-200 gap-4">
        <User size={64} className="opacity-20" />
        <h2 className="text-xl font-bold opacity-60">User not found</h2>
        <button className="btn btn-outline" onClick={() => navigate(-1)}>
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* ---------- Header Navigation ---------- */}
        <button 
          onClick={() => navigate(-1)} 
          className="btn btn-ghost btn-sm gap-2 group mb-2 pl-0 hover:bg-transparent hover:text-primary transition-colors"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Back
        </button>

        {/* ---------- Profile Hero Card ---------- */}
        <div className="card bg-base-100 shadow-xl overflow-hidden border border-base-200">
          <div className="h-40 bg-gradient-to-r from-blue-600 to-violet-600"></div>
          
          <div className="card-body pt-0 relative items-center text-center -mt-16">
            
            {/* Avatar */}
            <div className="avatar mb-4">
              <div className="w-32 rounded-full ring-4 ring-base-100 shadow-2xl bg-base-100">
                <img
                  src={user.avatar || `https://ui-avatars.com/api/?name=${user.username}&background=random`}
                  alt="avatar"
                />
              </div>
            </div>

            {/* User Info */}
            <h1 className="text-3xl font-extrabold text-base-content">
              {user.fullName}
            </h1>
            <p className="text-primary font-medium text-lg opacity-90">
              @{user.username}
            </p>

            {/* Bio */}
            {user.bio ? (
              <p className="mt-4 max-w-lg text-base-content/70 leading-relaxed text-sm bg-base-200/50 p-4 rounded-xl border border-base-200">
                {user.bio}
              </p>
            ) : (
              <p className="mt-2 text-sm opacity-40 italic">No bio provided</p>
            )}

            {/* Metadata */}
            <div className="flex gap-6 mt-4 text-xs font-bold opacity-50 uppercase tracking-wide">
              <div className="flex items-center gap-1">
                <Calendar size={14} /> Joined Recently
              </div>
            </div>
          </div>
        </div>

        {/* ---------- Stats Grid ---------- */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          
          {/* 1. Solved Count */}
          <div className="card bg-base-100 shadow-md border-b-4 border-b-success hover:shadow-xl transition-shadow">
            <div className="card-body p-5 items-center text-center">
              <div className="p-3 bg-success/10 text-success rounded-full mb-2">
                <CheckCircle2 size={24} />
              </div>
              <div className="stat-value text-3xl font-black text-base-content">
                {user.totalProblemsSolved || 0}
              </div>
              <div className="stat-title font-medium text-xs uppercase tracking-wider opacity-60">
                Problems Solved
              </div>
            </div>
          </div>

          {/* 2. Total Points */}
          <div className="card bg-base-100 shadow-md border-b-4 border-b-warning hover:shadow-xl transition-shadow">
            <div className="card-body p-5 items-center text-center">
              <div className="p-3 bg-warning/10 text-warning rounded-full mb-2">
                <Star size={24} className="fill-warning" />
              </div>
              <div className="stat-value text-3xl font-black text-base-content">
                {user.points || 0}
              </div>
              <div className="stat-title font-medium text-xs uppercase tracking-wider opacity-60">
                Total Points
              </div>
            </div>
          </div>

          {/* 3. Current Streak */}
          <div className="card bg-base-100 shadow-md border-b-4 border-b-orange-500 hover:shadow-xl transition-shadow">
            <div className="card-body p-5 items-center text-center">
              <div className="p-3 bg-orange-500/10 text-orange-500 rounded-full mb-2">
                <Flame size={24} />
              </div>
              <div className="stat-value text-3xl font-black text-base-content">
                {user.streaks?.current || 0}
              </div>
              <div className="stat-title font-medium text-xs uppercase tracking-wider opacity-60">
                Current Streak
              </div>
            </div>
          </div>

          {/* 4. Longest Streak */}
          <div className="card bg-base-100 shadow-md border-b-4 border-b-purple-500 hover:shadow-xl transition-shadow">
            <div className="card-body p-5 items-center text-center">
              <div className="p-3 bg-purple-500/10 text-purple-500 rounded-full mb-2">
                <Trophy size={24} />
              </div>
              <div className="stat-value text-3xl font-black text-base-content">
                {user.streaks?.longest || 0}
              </div>
              <div className="stat-title font-medium text-xs uppercase tracking-wider opacity-60">
                Longest Streak
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default PublicProfilePage;
