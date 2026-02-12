import React, { useState, useMemo } from 'react';
import { Copy, Code2, Check, FileCode, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';

const SolutionsTab = ({ problem }) => {
  const solutions = problem?.referenceSolution || [];

  const [selectedLang, setSelectedLang] = useState(
    solutions?.[0]?.language || 'javascript'
  );
  
  const [isCopied, setIsCopied] = useState(false);

  const activeSolution = useMemo(
    () => solutions.find(s => s.language === selectedLang) || solutions[0],
    [solutions, selectedLang]
  );

  // --- EMPTY STATE ---
  if (!solutions.length) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-base-content/40 gap-4">
        <div className="w-16 h-16 bg-base-200 rounded-2xl flex items-center justify-center">
            <FileCode className="w-8 h-8 opacity-50" />
        </div>
        <div className="text-center">
            <h3 className="font-bold text-lg text-base-content/70">No Solutions Yet</h3>
            <p className="text-xs font-medium mt-1 max-w-[200px]">
                Official solutions for this problem have not been published.
            </p>
        </div>
      </div>
    );
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(activeSolution.completeCode);
    setIsCopied(true);
    toast.success("Code copied to clipboard!");
    
    // Reset icon after 2 seconds
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-base-100 font-sans">

      {/* --- HEADER --- */}
      <div className="h-14 border-b border-base-200 flex items-center justify-between px-4 bg-base-100/50 backdrop-blur-sm sticky top-0 z-10">
        
        {/* Language Selector */}
        <div className="relative group">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Code2 className="w-4 h-4 text-primary opacity-70" />
            </div>
            <select
                className="select select-sm select-bordered pl-10 pr-10 bg-base-200/50 border-transparent hover:bg-base-200 hover:border-base-300 transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 rounded-lg font-medium text-xs uppercase tracking-wide cursor-pointer appearance-none"
                value={selectedLang}
                onChange={(e) => setSelectedLang(e.target.value)}
            >
                {solutions.map((s) => (
                    <option key={s.language} value={s.language}>
                        {s.language}
                    </option>
                ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-base-content/40 pointer-events-none" />
        </div>

        {/* Action Buttons */}
        <button
            onClick={handleCopy}
            className={`btn btn-sm gap-2 transition-all ${isCopied ? 'btn-success text-white' : 'btn-ghost text-base-content/70'}`}
        >
            {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span className="text-xs font-bold">{isCopied ? 'Copied' : 'Copy Code'}</span>
        </button>
      </div>

      {/* --- CODE VIEWER --- */}
      <div className="flex-1 overflow-hidden relative group">
        <div className="absolute inset-0 overflow-auto custom-scrollbar bg-[#1e1e1e]">
            {/* Inner Container for padding */}
            <div className="min-h-full min-w-fit p-6">
                <pre className="font-mono text-sm leading-relaxed">
                    <code className="block text-[#d4d4d4] whitespace-pre">
                        {activeSolution.completeCode}
                    </code>
                </pre>
            </div>
        </div>
        
        {/* Floating Language Badge  */}
        <div className="absolute bottom-4 right-4 pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity">
            <span className="badge badge-neutral text-xs font-mono opacity-80">
                {activeSolution.language}
            </span>
        </div>
      </div>
    </div>
  );
};

export default SolutionsTab;
