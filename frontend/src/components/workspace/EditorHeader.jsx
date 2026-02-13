import { Settings, RefreshCw, Play, CloudUpload, ChevronDown } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { setActiveLanguage, setEditorFontSize, setEditorTheme } from '../../redux/slices/workspaceSlice';
import { useEffect, useMemo } from 'react';

const EditorHeader = ({ onRun, onSubmit, onReset, isRunning, isSubmitting }) => {
    const dispatch = useDispatch();
    
    // 1. Get currentProblem from Redux
    const { activeLanguage, editorPreferences, currentProblem } = useSelector((state) => state.workspace);

    const allLanguages = [
        { id: 'javascript', label: 'JavaScript' },
        { id: 'cpp', label: 'C++' },
        { id: 'java', label: 'Java' },
        { id: 'python', label: 'Python' }
    ];

    const themes = [
        { id: 'vs-dark', label: 'Dark' },
        { id: 'light', label: 'Light' },
    ];

    // 2. Filter languages based on currentProblem.startCode
    const supportedLanguages = useMemo(() => {
        if (!currentProblem || !currentProblem.startCode) return allLanguages;

        // Extract languages available in the DB
        const availableDbLangs = currentProblem.startCode.map(sc => 
            sc.language === 'c++' ? 'cpp' : sc.language.toLowerCase()
        );

        // Filter the frontend list
        return allLanguages.filter(lang => availableDbLangs.includes(lang.id));
    }, [currentProblem]);

    // 3. Safety Check: If active language is not supported, switch to the first supported one
    useEffect(() => {
        if (supportedLanguages.length > 0) {
            const isSupported = supportedLanguages.some(lang => lang.id === activeLanguage);
            if (!isSupported) {
                dispatch(setActiveLanguage(supportedLanguages[0].id));
            }
        }
    }, [supportedLanguages, activeLanguage, dispatch]);

    const handleFontSizeChange = (e) => {
        const size = parseInt(e.target.value);
        if (!isNaN(size)) dispatch(setEditorFontSize(size));
    };

    return (
        <div className="h-12 bg-[#1e1e1e] border-b border-[#2d2d2d] flex items-center justify-between px-4 select-none">

            {/* --- LEFT: Language & Settings --- */}
            <div className="flex items-center gap-3">
                
                {/* Language Select */}
                <div className="relative group">
                    <select
                        className="appearance-none bg-[#2d2d2d] text-gray-300 text-xs font-medium pl-3 pr-8 py-1.5 rounded hover:bg-[#363636] focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-colors cursor-pointer"
                        value={activeLanguage}
                        onChange={(e) => dispatch(setActiveLanguage(e.target.value))}
                    >
                        {/* 4. Map over supportedLanguages */}
                        {supportedLanguages.map(lang => (
                            <option key={lang.id} value={lang.id}>{lang.label}</option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-500 pointer-events-none" />
                </div>

                {/* Settings Button */}
                <div className="dropdown dropdown-bottom">
                    <div 
                        tabIndex={0} 
                        role="button" 
                        className="btn btn-ghost btn-xs btn-square text-gray-400 hover:text-white hover:bg-[#2d2d2d]"
                        title="Editor Settings"
                    >
                        <Settings className="w-4 h-4" />
                    </div>
                    
                    {/* Settings Dropdown Content */}
                    <div tabIndex={0} className="dropdown-content z-[20] menu p-3 shadow-xl bg-[#252526] rounded-lg w-52 border border-[#3e3e42] mt-1 gap-3 text-gray-300">
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Font Size</label>
                            <select
                                className="select select-bordered select-xs w-full bg-[#3c3c3c] border-transparent text-white focus:border-emerald-500"
                                value={editorPreferences.fontSize}
                                onChange={handleFontSizeChange}
                            >
                                {[12, 13, 14, 15, 16, 18, 20].map(size => (
                                    <option key={size} value={size}>{size}px</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Theme</label>
                            <select
                                className="select select-bordered select-xs w-full bg-[#3c3c3c] border-transparent text-white focus:border-emerald-500"
                                value={editorPreferences.theme}
                                onChange={(e) => dispatch(setEditorTheme(e.target.value))}
                            >
                                {themes.map(t => (
                                    <option key={t.id} value={t.id}>{t.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- RIGHT: Run & Submit Actions --- */}
            <div className="flex items-center gap-3">
                
                {/* Reset Button */}
                <button
                    onClick={onReset}
                    className="btn btn-ghost btn-xs btn-square text-gray-500 hover:text-white"
                    title="Reset Code"
                >
                    <RefreshCw className="w-3.5 h-3.5" />
                </button>

                {/* Vertical Divider */}
                <div className="h-4 w-[1px] bg-[#3e3e42] mx-1"></div>

                {/* Run Button */}
                <button
                    onClick={onRun}
                    disabled={isRunning || isSubmitting}
                    className="btn btn-sm btn-ghost text-gray-300  hover:bg-[#2d2d2d] hover:text-emerald-400 gap-2 font-medium px-3 transition-colors rounded-[4px]"
                >
                    {isRunning ? (
                        <span className="loading loading-spinner loading-xs"></span>
                    ) : (
                        <Play className="w-4 h-4 fill-current " /> 
                    )}
                    Run
                </button>

                {/* Submit Button */}
                <button
                    onClick={onSubmit}
                    disabled={isRunning || isSubmitting}
                    className="btn btn-sm bg-emerald-600 hover:bg-emerald-500 border-none text-white gap-2 font-medium px-4 shadow-lg shadow-emerald-900/20 rounded-[4px]"
                >
                    {isSubmitting ? (
                        <span className="loading loading-spinner loading-xs text-white"></span>
                    ) : (
                        <CloudUpload className="w-4 h-4" /> 
                    )}
                    Submit
                </button>
            </div>
        </div>
    );
};

export default EditorHeader;