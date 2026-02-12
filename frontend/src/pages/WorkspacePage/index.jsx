

import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import Split from "react-split";

// Components
import ProblemPanel from "../../components/workspace/ProblemPanel";
import PlaygroundPanel from "../../components/workspace/PlaygroundPanel";
import SubmissionResultPanel from "../../components/workspace/SubmissionResultPanel";
import ProblemSidebar from "../../components/workspace/ProblemSidebar";

import { setProblem } from "../../redux/slices/workspaceSlice";
import axiosInstance from "../../utils/axiosClient";

const WorkspacePage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { currentProblem, submissionResult } = useSelector(
    (state) => state.workspace
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch problem
  useEffect(() => {
    const fetchProblem = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get(`/problem/${id}`);
        dispatch(setProblem(res.data));
        setLoading(false);
      } catch (err) {
        setError("Failed to load problem");
        setLoading(false);
      }
    };

    if (id) fetchProblem();
  }, [id, dispatch]);

  return (
    <div className="h-[calc(100vh-3.5rem)] flex flex-col overflow-hidden bg-base-100">

      {/* Sidebar */}
      <ProblemSidebar />

      {/* Main Layout */}
      <div className="flex-1 overflow-hidden">
        <Split
          className="flex h-full"
          sizes={[40, 60]}
          minSize={300}
          gutterSize={6}
          direction="horizontal"
        >
          {/* LEFT PANEL */}
          <div className="h-full min-w-0 overflow-hidden bg-base-100 flex flex-col">
            {submissionResult ? (
              <SubmissionResultPanel result={submissionResult} />
            ) : (
              currentProblem && <ProblemPanel problem={currentProblem} />
            )}
          </div>

          {/* RIGHT PANEL */}
          <div className="h-full min-w-0 overflow-hidden bg-base-100">
            {currentProblem && <PlaygroundPanel problem={currentProblem} />}
          </div>
        </Split>
      </div>
    </div>
  );
};

export default WorkspacePage;
