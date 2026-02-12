import React from "react";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Cpu,
  Trophy,
  X,
  AlertTriangle,
  Terminal,
  Activity
} from "lucide-react";
import { useDispatch } from "react-redux";
import { resetSubmissionResult } from "../../redux/slices/workspaceSlice";

const SubmissionResultPanel = ({ result }) => {
  const dispatch = useDispatch();
  if (!result) return null;

  const isAccepted = result.status === "accepted";
  const isCompileError = result.status === "compile error" || result.status === "runtime error";

  // Helper for memory formatting
  const formatMemory = (memory) => {
    if (!memory) return "N/A";
    return memory >= 1024
      ? `${(memory / 1024).toFixed(2)} MB`
      : `${memory} KB`;
  };

  // Helper for runtime formatting
  const formatTime = (time) => {
      if(!time) return "N/A";
      return time < 1 ? `${(time * 1000).toFixed(0)} ms` : `${time} s`;
  }

  // Calculate success rate for test cases
  const passRate = result.totalTestCases > 0 
    ? (result.testCasesPassed / result.totalTestCases) * 100 
    : 0;

  return (
    <div className="h-full flex flex-col bg-base-100 animate-in fade-in slide-in-from-bottom-4 duration-300">
      
      {/* --- 1. HEADER BANNER --- */}
      <div className={`
        relative px-6 py-8 flex flex-col items-center justify-center text-center gap-2 border-b
        ${isAccepted 
          ? "bg-emerald-500/10 border-emerald-500/20" 
          : "bg-red-500/10 border-red-500/20"
        }
      `}>
        {/* Close Button */}
        <button
          onClick={() => dispatch(resetSubmissionResult())}
          className="absolute top-3 right-3 btn btn-sm btn-circle btn-ghost text-base-content/60 hover:text-base-content"
          title="Close"
        >
          <X size={18} />
        </button>

        {/* Status Icon & Text */}
        <div className={`p-3 rounded-full ${isAccepted ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" : "bg-red-500 text-white shadow-lg shadow-red-500/20"}`}>
            {isAccepted ? <CheckCircle2 size={32} /> : <XCircle size={32} />}
        </div>
        
        <h2 className={`text-2xl font-black tracking-tight ${isAccepted ? "text-emerald-600" : "text-red-600"}`}>
          {isAccepted ? "Accepted!" : result.status.toUpperCase()}
        </h2>
        
        {isAccepted && (
           <p className="text-sm font-medium opacity-60">
             You have successfully solved the problem.
           </p>
        )}
      </div>

      {/* --- 2. SCROLLABLE CONTENT --- */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">

        {/* Error Console (Only shows if error) */}
        {!isAccepted && result.errorMessage && (
          <div className="card bg-base-200 border-l-4 border-red-500 shadow-sm overflow-hidden">
            <div className="bg-base-300/50 px-4 py-2 border-b border-base-300 flex items-center gap-2 text-xs font-bold text-base-content/70 uppercase">
               <Terminal size={14} /> Error Output
            </div>
            <div className="p-4 font-mono text-sm text-red-500 whitespace-pre-wrap leading-relaxed">
              {result.errorMessage}
            </div>
          </div>
        )}

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-4">
          
          {/* Runtime */}
          <div className="bg-base-200/50 p-4 rounded-xl border border-base-200 flex flex-col gap-1">
             <div className="flex items-center gap-2 text-xs font-bold text-base-content/50 uppercase">
                <Clock size={14} /> Runtime
             </div>
             <div className="text-xl font-bold text-base-content">
                {formatTime(result.runtime)}
             </div>
             <div className="text-xs text-success font-medium">Beats 85% (Simulated)</div>
          </div>

          {/* Memory */}
          <div className="bg-base-200/50 p-4 rounded-xl border border-base-200 flex flex-col gap-1">
             <div className="flex items-center gap-2 text-xs font-bold text-base-content/50 uppercase">
                <Cpu size={14} /> Memory
             </div>
             <div className="text-xl font-bold text-base-content">
                {formatMemory(result.memory)}
             </div>
          </div>

          {/* Points */}
          <div className="bg-yellow-500/5 p-4 rounded-xl border border-yellow-500/20 flex flex-col gap-1 col-span-2 sm:col-span-1">
             <div className="flex items-center gap-2 text-xs font-bold text-yellow-600/70 uppercase">
                <Trophy size={14} /> Points Earned
             </div>
             <div className="text-xl font-black text-yellow-600">
                +{result.pointsEarned ?? 0}
             </div>
          </div>

          {/* Test Cases */}
          <div className="bg-base-200/50 p-4 rounded-xl border border-base-200 flex flex-col gap-2 col-span-2 sm:col-span-1">
             <div className="flex items-center justify-between text-xs font-bold text-base-content/50 uppercase">
                <div className="flex items-center gap-2"><Activity size={14} /> Test Cases</div>
                <span className={result.testCasesPassed === result.totalTestCases ? "text-success" : "text-error"}>
                   {result.testCasesPassed}/{result.totalTestCases}
                </span>
             </div>
             {/* Progress Bar */}
             <div className="h-2 w-full bg-base-300 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${isAccepted ? 'bg-success' : 'bg-error'}`} 
                  style={{ width: `${passRate}%` }}
                />
             </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default SubmissionResultPanel;