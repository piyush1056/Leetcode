import React, { useEffect, useState } from "react";
import axiosInstance from "../../../utils/axiosClient";
import {
  Clock,
  CheckCircle,
  XCircle,
  Code2,
  History
} from "lucide-react";

const SubmissionsTab = ({ problemId }) => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSubmission, setActiveSubmission] = useState(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const { data } = await axiosInstance.get(`/submission/${problemId}`);
        setSubmissions(data);
      } catch (err) {
        console.error("Failed to fetch submissions");
      } finally {
        setLoading(false);
      }
    };

    if (problemId) fetchSubmissions();
  }, [problemId]);

  const statusIcon = (status) =>
    status === "accepted" ? (
      <CheckCircle size={14} className="text-success" />
    ) : (
      <XCircle size={14} className="text-error" />
    );

  const formatMemory = (memory) =>
    memory >= 1024
      ? `${(memory / 1024).toFixed(1)} MB`
      : `${memory} KB`;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <span className="loading loading-spinner" />
      </div>
    );
  }

  if (!submissions.length) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-base-content/50">
        <History className="w-12 h-12 mb-2 opacity-20" />
        <p>No submissions yet.</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-4 space-y-4">

      {/* Header */}
      <div className="flex items-center gap-2 text-sm font-semibold">
        <History className="w-4 h-4 text-primary" />
        Submission History
      </div>

      {/* Table Card */}
      <div className="bg-base-100 border border-base-300 rounded-xl overflow-x-auto">
        <table className="table table-sm w-full">
          <thead className="bg-base-200">
            <tr>
              <th>Status</th>
              <th>Lang</th>
              <th>Runtime</th>
              <th>Memory</th>
              <th>Testcases</th>
              <th>Submitted</th>
              <th>Code</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((sub) => (
              <tr key={sub._id} className="hover">
                <td className="flex items-center gap-2 font-medium">
                  {statusIcon(sub.status)}
                  {sub.status.toUpperCase()}
                </td>
                <td className="font-mono">{sub.language}</td>
                <td>{sub.runtime ?? "—"} ms</td>
                <td>{sub.memory ? formatMemory(sub.memory) : "—"}</td>
                <td>
                  {sub.testCasesPassed}/{sub.testCasesTotal}
                </td>
                <td className="text-xs text-base-content/60">
                  <div>{new Date(sub.createdAt).toLocaleDateString()}</div>
                  <div>
                    {new Date(sub.createdAt).toLocaleTimeString()}
                  </div>
                </td>
                <td>
                  <button
                    onClick={() => setActiveSubmission(sub)}
                    className="btn btn-ghost btn-xs"
                  >
                    <Code2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View Code Modal */}
      {activeSubmission && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-base-100 rounded-xl w-full max-w-3xl p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-semibold">
                Submitted Code ({activeSubmission.language})
              </h3>
              <button
                className="btn btn-sm btn-ghost"
                onClick={() => setActiveSubmission(null)}
              >
                ✕
              </button>
            </div>

            <pre className="bg-[#1e1e1e] text-gray-300 rounded-lg p-4 text-sm overflow-y-auto max-h-[60vh]">
              {activeSubmission.code}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubmissionsTab;
