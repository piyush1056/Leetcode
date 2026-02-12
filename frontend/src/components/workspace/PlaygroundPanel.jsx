import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Split from 'react-split';
import Editor from '@monaco-editor/react';
import { ChevronUp, ChevronDown } from 'lucide-react';

import EditorHeader from './EditorHeader';
import ConsolePanel from './ConsolePanel';
import {
    updateUserCode,
    runCodeAsync,
    submitCodeAsync,
    toggleConsole,
    setActiveLanguage 
} from '../../redux/slices/workspaceSlice';

const normalizeLanguage = (lang) => {
    if (lang === "cpp") return "c++";
    if (lang === "js") return "javascript";
    return lang;
};


const PlaygroundPanel = ({ problem }) => {
    const dispatch = useDispatch();
    const {
        activeLanguage,
        userCode,
        isConsoleOpen,
        runStatus,
        submissionStatus,
        editorPreferences
    } = useSelector((state) => state.workspace);

    const [value, setValue] = useState('');

    useEffect(() => {
        const savedCode = userCode[problem._id];

        if (savedCode && savedCode.trim() !== "") {
            setValue(savedCode);
            return;
        }

        let starter = problem.startCode.find(
            sc => sc.language === activeLanguage
        );

        if (!starter && problem.startCode.length > 0) {
            starter = problem.startCode[0];
            dispatch(setActiveLanguage(starter.language));
        }

        if (starter) {
            setValue(starter.initialCode);
            dispatch(updateUserCode({
                problemId: problem._id,
                code: starter.initialCode
            }));
        }
    }, [problem._id]); 



    //  Handlers 
    const handleEditorChange = (newValue) => {
        setValue(newValue);
        dispatch(updateUserCode({ problemId: problem._id, code: newValue }));
    };

    const handleRun = () => {
        dispatch(runCodeAsync({
            problemId: problem._id,
            code: value,
            language: normalizeLanguage(activeLanguage)
        }));
    };

    const handleSubmit = () => {
        dispatch(submitCodeAsync({
            problemId: problem._id,
            code: value,
            language: normalizeLanguage(activeLanguage)
        }));
    };

    const handleReset = () => {
        const starter = problem.startCode.find(sc => sc.language === activeLanguage);
        if (starter) {
            setValue(starter.initialCode);
            dispatch(updateUserCode({ problemId: problem._id, code: starter.initialCode }));
        }
    };

    return (
        <div className="flex flex-col h-full bg-base-100">
            {/* Header */}
            <EditorHeader
                onRun={handleRun}
                onSubmit={handleSubmit}
                onReset={handleReset}
                isRunning={runStatus === 'loading'}
                isSubmitting={submissionStatus === 'loading'}
            />

            {/* Vertical Split: Editor vs Console */}
            <div className="flex-1 min-h-0 relative">
                <Split
                    className="h-full flex flex-col"
                    direction="vertical"
                    sizes={isConsoleOpen ? [60, 40] : [96, 4]}
                    minSize={isConsoleOpen ? 100 : 35}
                    gutterSize={4}
                    gutter={(index, direction) => {
                        const gutter = document.createElement('div');
                        gutter.className = `gutter gutter-${direction} w-full h-1 bg-base-300 hover:bg-primary/50 cursor-row-resize transition-colors z-10`;
                        return gutter;
                    }}
                >
                    {/* Top: Monaco Editor */}
                    <div className="w-full min-h-0 pt-2">
                        <Editor
                            height="100%"
                            language={activeLanguage === 'c++' ? 'cpp' : activeLanguage}
                            theme={editorPreferences.theme}
                            value={value}
                            onChange={handleEditorChange}
                            options={{
                                fontSize: editorPreferences.fontSize,
                                minimap: { enabled: false },
                                scrollBeyondLastLine: false,
                                automaticLayout: true,
                                padding: { top: 16 }
                            }}
                        />
                    </div>

                    {/* Bottom: Console Panel */}
                    <div className="bg-base-100 flex flex-col overflow-hidden">
                        <div
                            className="h-9 min-h-[2.25rem] bg-base-200/50 border-t border-base-300 flex items-center justify-between px-4 cursor-pointer hover:bg-base-200"
                            onClick={() => dispatch(toggleConsole())}
                        >
                            <span className="text-xs font-bold text-base-content/70">Console</span>
                            {isConsoleOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                        </div>

                        {isConsoleOpen && (
                            <div className="flex-1 overflow-hidden">
                                <ConsolePanel problem={problem} />
                            </div>
                        )}
                    </div>
                </Split>
            </div>
        </div>
    );
};

export default PlaygroundPanel;