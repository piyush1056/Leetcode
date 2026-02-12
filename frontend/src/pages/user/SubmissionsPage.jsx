import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosClient";
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertCircle, 
  FileCode, 
  Calendar,
  ChevronLeft,
  ChevronRight,
  Zap,
  Database
} from "lucide-react";

const SubmissionsPage = () => {
  const [submissions, setSubmissions] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchSubmissions = async (pageNo) => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(
        `/submission?page=${pageNo}&limit=10`
      );
      setSubmissions(res.data.submissions);
      setPages(res.data.pagination.pages);
    } catch (err) {
      console.error("Failed to load submissions", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions(page);
  }, [page]);

  const getStatusBadge = (status) => {
    const s = status?.toLowerCase() || "unknown";

    switch (s) {
      case "accepted":
        return (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-success/10 text-success border border-success/20">
            <CheckCircle2 size={14} />
            ACCEPTED
          </div>
        );
      case "wrong":
      case "wrong answer":
        return (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-error/10 text-error border border-error/20">
            <XCircle size={14} />
            WRONG
          </div>
        );
      case "pending":
        return (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-warning/10 text-warning border border-warning/20">
            <Clock size={14} className="animate-pulse" />
            PENDING
          </div>
        );
      case "compile error":
      case "runtime error":
        return (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-orange-500/10 text-orange-600 border border-orange-500/20">
            <AlertCircle size={14} />
            ERROR
          </div>
        );
      default:
        return (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-base-300 text-base-content/70">
            {status}
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-base-200 py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 bg-base-100 rounded-xl shadow-sm text-primary">
            <FileCode size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Submission History</h1>
            <p className="text-sm opacity-60">
              Track all your past attempts and results
            </p>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="min-h-[400px] flex justify-center items-center">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        ) : submissions.length === 0 ? (
          <div className="card bg-base-100 shadow-xl p-12 text-center opacity-60">
            <FileCode size={48} className="mx-auto mb-4 opacity-20" />
            <h3 className="text-lg font-bold">No submissions yet</h3>
            <p>Go solve some problems!</p>
          </div>
        ) : (
          <div className="card bg-base-100 shadow-xl overflow-hidden border border-base-200">
            <div className="overflow-x-auto">
              <table className="table w-full">
                {/* Table Head */}
                <thead className="bg-base-200/50 text-base-content/60 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="py-4 pl-6">Problem</th>
                    <th>Status</th>
                    <th>Language</th>
                    
                    {/* Runtime Header */}
                    <th className="flex items-center gap-1">
                      <Zap size={14} /> Runtime
                    </th>
                    
                    {/* Memory Header */}
                    <th>
                      <div className="flex items-center gap-1">
                        <Database size={14} /> Memory
                      </div>
                    </th>
                    
                    <th className="text-right pr-6">Submitted</th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody className="divide-y divide-base-200">
                  {submissions.map((sub) => (
                    <tr
                      key={sub._id}
                      className="hover:bg-base-200/50 transition-colors"
                    >
                      {/* Problem Title & Number */}
                      <td className="py-4 pl-6">
                        <div className="font-semibold text-base">
                          {sub.problemId?.title || "Unknown Problem"}
                        </div>
                        {sub.problemId?.problemNo && (
                           <div className="text-xs font-mono font-bold opacity-50 mt-1 bg-base-300 inline-block px-1.5 rounded">
                             #{sub.problemId.problemNo}
                           </div>
                        )}
                      </td>

                      {/* Status Badge */}
                      <td>
                        {getStatusBadge(sub.status)}
                      </td>

                      {/* Language */}
                      <td>
                        <span className="badge badge-sm badge-ghost font-mono uppercase text-xs tracking-wide opacity-80">
                          {sub.language}
                        </span>
                      </td>

                      {/* Runtime */}
                      <td className="font-mono text-sm">
                        {sub.runtime ? `${sub.runtime}s` : "—"}
                      </td>

                      {/* Memory */}
                      <td className="font-mono text-sm">
                         {sub.memory ? `${(sub.memory / 1024).toFixed(1)} MB` : "—"}
                      </td>

                      {/* Date */}
                      <td className="text-right pr-6 text-sm opacity-60">
                        <div className="flex items-center justify-end gap-2">
                          <span className="text-xs font-medium">
                            {new Date(sub.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="text-xs opacity-50 mt-0.5">
                          {new Date(sub.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pagination Toolbar */}
        {pages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-8">
            <button
              className="btn btn-circle btn-sm btn-ghost border border-base-300"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              <ChevronLeft size={20} />
            </button>

            <span className="font-mono text-sm opacity-70">
              Page <span className="font-bold text-primary">{page}</span> of {pages}
            </span>

            <button
              className="btn btn-circle btn-sm btn-ghost border border-base-300"
              disabled={page === pages}
              onClick={() => setPage((p) => p + 1)}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default SubmissionsPage;