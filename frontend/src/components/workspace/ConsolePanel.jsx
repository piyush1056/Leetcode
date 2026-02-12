import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Terminal,
  CheckCircle2,
  XCircle,
  Clock,
  Database,
  AlertTriangle,
  Loader2,
  ChevronRight,
  MonitorPlay
} from 'lucide-react';
import { setActiveConsoleTab } from '../../redux/slices/workspaceSlice';

const ConsolePanel = ({ problem }) => {
  const dispatch = useDispatch();
  const {
    activeConsoleTab,
    runStatus,
    runResult,
    submissionStatus
  } = useSelector((state) => state.workspace);

  const [activeCaseIndex, setActiveCaseIndex] = useState(0);


  useEffect(() => {
    setActiveCaseIndex(0);
  }, [activeConsoleTab, runResult]);

  const isLoading = runStatus === 'loading' || submissionStatus === 'loading';
  const isError = runStatus === 'error' || submissionStatus === 'error';
  const resultData = runResult;

 
  const getStatusColor = (status) => {
    const s = status?.toLowerCase();
    if (s === 'accepted') return 'text-emerald-500';
    if (s?.includes('wrong')) return 'text-red-500';
    if (s === 'tle') return 'text-amber-500';
    return 'text-red-500';
  };

  const finalStatus = resultData?.status
    ? resultData.status
    : resultData?.success && resultData?.testCasesPassed === resultData?.totalTestCases
      ? 'accepted'
      : 'wrong answer';

  return (
    <div className="flex flex-col h-full bg-base-100 font-sans border-t border-base-200">
      
      {/* ---------------- HEADER TABS ---------------- */}
      <div className="flex items-center h-10 bg-base-200/40 border-b border-base-200 px-2 gap-1">
        <button
          onClick={() => dispatch(setActiveConsoleTab('testcases'))}
          className={`
            relative flex items-center gap-2 px-3 py-1.5 h-[calc(100%-4px)] mt-1 rounded-t-lg text-xs font-semibold transition-all
            ${activeConsoleTab === 'testcases'
              ? 'bg-base-100 text-primary shadow-sm ring-1 ring-base-200 border-t-2 border-t-primary'
              : 'text-base-content/50 hover:bg-base-200 hover:text-base-content'}
          `}
        >
          <CheckCircle2 size={14} />
          Testcases
        </button>

        <button
          onClick={() => dispatch(setActiveConsoleTab('result'))}
          disabled={!runResult && !isLoading}
          className={`
            relative flex items-center gap-2 px-3 py-1.5 h-[calc(100%-4px)] mt-1 rounded-t-lg text-xs font-semibold transition-all
            ${activeConsoleTab === 'result'
              ? 'bg-base-100 text-primary shadow-sm ring-1 ring-base-200 border-t-2 border-t-primary'
              : 'text-base-content/50 hover:bg-base-200 hover:text-base-content'}
            ${(!runResult && !isLoading) ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <Terminal size={14} />
          Test Result
          {/* Notification Dot if result is ready but not viewed */}
          {runResult && activeConsoleTab !== 'result' && (
             <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-primary rounded-full"></span>
          )}
        </button>
      </div>

      {/* ---------------- CONTENT AREA ---------------- */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">

        {/* --- LOADING STATE --- */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center h-full gap-4 text-base-content/50">
            <div className="relative">
               <Loader2 className="w-8 h-8 animate-spin text-primary" />
               <div className="absolute inset-0 bg-primary/20 blur-lg rounded-full animate-pulse"></div>
            </div>
            <span className="text-xs font-bold uppercase tracking-wider animate-pulse">
              Running Code...
            </span>
          </div>
        )}

        {/* --- ERROR STATE --- */}
        {!isLoading && isError && (
          <div className="alert alert-error shadow-sm rounded-lg border border-red-200">
            <AlertTriangle className="w-5 h-5" />
            <div className="text-xs font-medium">
              An unexpected error occurred during execution.
            </div>
          </div>
        )}

        {/* --- TAB: TESTCASES --- */}
        {!isLoading && activeConsoleTab === 'testcases' && (
          <div className="space-y-4">
            
            {/* Case Selector Pills */}
            <div className="flex flex-wrap gap-2">
              {problem.visibleTestCases?.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveCaseIndex(idx)}
                  className={`
                    px-3 py-1.5 rounded-md text-xs font-medium transition-all border
                    ${activeCaseIndex === idx
                      ? 'bg-base-content text-base-100 border-base-content'
                      : 'bg-base-200 text-base-content/70 border-transparent hover:bg-base-300'}
                  `}
                >
                  Case {idx + 1}
                </button>
              ))}
            </div>

            {/* Case Content */}
            {problem.visibleTestCases?.[activeCaseIndex] && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-base-content/50 uppercase tracking-wide">Input</span>
                  <div className="p-3 bg-base-200/50 rounded-lg border border-base-200 font-mono text-sm">
                    {problem.visibleTestCases[activeCaseIndex].input}
                  </div>
                </div>
                
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-base-content/50 uppercase tracking-wide">Expected Output</span>
                  <div className="p-3 bg-base-200/50 rounded-lg border border-base-200 font-mono text-sm">
                    {problem.visibleTestCases[activeCaseIndex].output}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* --- TAB: RESULT --- */}
        {!isLoading && activeConsoleTab === 'result' && resultData && (
          <div className="space-y-5 animate-in slide-in-from-bottom-2 duration-300">
            
            {/* Result Header */}
            <div className="flex items-center justify-between">
               <h3 className={`text-lg font-black tracking-tight flex items-center gap-2 ${getStatusColor(finalStatus)}`}>
                 {finalStatus === 'accepted' ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
                 {finalStatus === 'accepted' ? 'Accepted' : finalStatus.toUpperCase()}
               </h3>
               
               {/* Metrics Badge */}
               <div className="flex gap-3 text-xs font-mono">
                  <div className="flex items-center gap-1.5 px-2 py-1 bg-base-200 rounded text-base-content/70">
                     <Clock size={12} />
                     {resultData.runtime ? `${(resultData.runtime * 1000).toFixed(0)}ms` : 'N/A'}
                  </div>
                  <div className="flex items-center gap-1.5 px-2 py-1 bg-base-200 rounded text-base-content/70">
                     <Database size={12} />
                     {resultData.memory ? `${resultData.memory}KB` : 'N/A'}
                  </div>
               </div>
            </div>

            {/* Error Message if any */}
            {resultData.errorMessage && (
              <div className="mockup-code bg-[#1e1e1e] text-red-400 text-xs p-4 rounded-lg before:hidden">
                <pre className="whitespace-pre-wrap">{resultData.errorMessage}</pre>
              </div>
            )}

            {/* Test Case Details */}
            {resultData.testDetails && (
              <div className="space-y-4">
                
                {/* Result Case Selector */}
                <div className="flex flex-wrap gap-2">
                  {resultData.testDetails.map((t, i) => {
                     const isPass = t.status === 'accepted';
                     return (
                        <button
                          key={i}
                          onClick={() => setActiveCaseIndex(i)}
                          className={`
                            relative px-3 py-1.5 rounded-md text-xs font-medium transition-all border flex items-center gap-2
                            ${activeCaseIndex === i
                              ? 'bg-base-200 border-base-300 text-base-content shadow-sm'
                              : 'bg-transparent border-transparent hover:bg-base-200 text-base-content/60'}
                          `}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${isPass ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                          Case {i + 1}
                        </button>
                     );
                  })}
                </div>

                {/* Selected Result Details */}
                {resultData.testDetails[activeCaseIndex] && (
                   <div className="grid gap-4 animate-in fade-in duration-200">
                      
                      {/* Input */}
                      <div className="space-y-1">
                         <span className="text-xs font-bold text-base-content/40 uppercase">Input</span>
                         <div className="bg-base-200/50 p-3 rounded-lg font-mono text-sm border border-base-200">
                            {resultData.testDetails[activeCaseIndex].input}
                         </div>
                      </div>

                      {/* Output vs Expected Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         {/* My Output */}
                         <div className="space-y-1">
                            <span className="text-xs font-bold text-base-content/40 uppercase">My Output</span>
                            <div className={`
                               p-3 rounded-lg font-mono text-sm border
                               ${resultData.testDetails[activeCaseIndex].status === 'accepted' 
                                 ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-600' 
                                 : 'bg-red-500/5 border-red-500/20 text-red-600'}
                            `}>
                               {resultData.testDetails[activeCaseIndex].output}
                            </div>
                         </div>

                         {/* Expected Output */}
                         <div className="space-y-1">
                            <span className="text-xs font-bold text-base-content/40 uppercase">Expected</span>
                            <div className="bg-base-200/50 p-3 rounded-lg font-mono text-sm border border-base-200">
                               {resultData.testDetails[activeCaseIndex].expected}
                            </div>
                         </div>
                      </div>
                   </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* --- EMPTY STATE (Initial) --- */}
        {!isLoading && !runResult && activeConsoleTab === 'result' && (
           <div className="h-full flex flex-col items-center justify-center text-base-content/30 gap-2">
              <MonitorPlay size={32} />
              <p className="text-xs font-medium">Run your code to see results</p>
           </div>
        )}

      </div>
    </div>
  );
};

export default ConsolePanel;
