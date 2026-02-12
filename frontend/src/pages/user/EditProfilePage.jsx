import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router";
import axiosInstance from "../../utils/axiosClient";
import { toast } from "sonner";
import { User, AtSign, FileText, Save, Trash2, ArrowLeft, AlertTriangle } from "lucide-react";

const EditProfilePage = () => {
  const navigate = useNavigate();
  const deleteModalRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");

  // Load existing profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axiosInstance.get("/profile/me");
        const user = res.data.user;

        setFullName(user.fullName || "");
        setUsername(user.username || "");
        setBio(user.bio || "");
      } catch (err) {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await axiosInstance.patch("/profile/update", {
        fullName,
        username,
        bio
      });
      toast.success("Profile updated");
      navigate("/profile");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await axiosInstance.delete("/user/profile");
      toast.success("Account deleted");
      window.location.href = "/login";
    } catch (err) {
      toast.error("Failed to delete account");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 py-10 px-4">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* ---------- Header ---------- */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate("/profile")} 
            className="btn btn-circle btn-ghost btn-sm"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold">Edit Profile</h1>
            <p className="opacity-70 text-sm">Update your personal details</p>
          </div>
        </div>

        {/* ---------- Main Form Card ---------- */}
        <div className="card bg-base-100 shadow-xl">
          <form onSubmit={handleSave} className="card-body gap-5">
            
            {/* Full Name */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Full Name</span>
              </label>
              <label className="input input-bordered flex items-center gap-2">
                <User size={16} className="opacity-50" />
                <input
                  type="text"
                  className="grow"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </label>
            </div>

            {/* Username */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Username</span>
              </label>
              <label className="input input-bordered flex items-center gap-2">
                <AtSign size={16} className="opacity-50" />
                <input
                  type="text"
                  className="grow"
                  placeholder="johndoe"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </label>
              <div className="label">
                <span className="label-text-alt opacity-60">
                  Visible to other users
                </span>
              </div>
            </div>

            {/* Bio */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Bio</span>
              </label>
              <div className="relative">
                <textarea
                  className="textarea textarea-bordered w-full h-32 pl-10 pt-3 leading-relaxed"
                  placeholder="Tell us about yourself..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                ></textarea>
                <div className="absolute top-3 left-3 opacity-50">
                  <FileText size={16} />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="card-actions justify-end mt-4">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => navigate("/profile")}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary min-w-[120px]"
                disabled={saving}
              >
                {saving ? (
                  <span className="loading loading-spinner loading-xs"></span>
                ) : (
                  <>
                    <Save size={18} /> Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* ---------- Danger Zone ---------- */}
        <div className="card bg-base-100 border border-error/20 shadow-sm overflow-hidden">
          <div className="card-body">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-error/10 text-error rounded-lg">
                <AlertTriangle size={24} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg text-error">Danger Zone</h3>
                <p className="text-sm opacity-70 mt-1">
                  Deleting your account is permanent. All your data, submissions, and stats will be wiped instantly.
                </p>
              </div>
            </div>
            
            <div className="flex justify-end mt-4">
              <button
                className="btn btn-outline btn-error btn-sm"
                onClick={() => deleteModalRef.current.showModal()}
              >
                <Trash2 size={16} /> Delete Account
              </button>
            </div>
          </div>
        </div>

        {/* ---------- Delete Modal ---------- */}
        <dialog ref={deleteModalRef} className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg text-error flex items-center gap-2">
              <AlertTriangle size={20} /> Delete Account?
            </h3>
            <p className="py-4 text-sm opacity-80">
              Are you sure you want to do this? This action cannot be undone.
            </p>
            
            <div className="modal-action">
              <form method="dialog" className="flex gap-2">
                {/* if there is a button in form, it will close the modal */}
                <button className="btn btn-ghost">Cancel</button>
                <button
                  type="button"
                  className="btn btn-error"
                  onClick={handleDeleteAccount}
                >
                  Yes, Delete My Account
                </button>
              </form>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button>close</button>
          </form>
        </dialog>

      </div>
    </div>
  );
};

export default EditProfilePage;