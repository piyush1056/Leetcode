import React, { useState } from 'react';
import { FileText, BookOpen, Clock, Lightbulb, Bot, Sparkles } from 'lucide-react';
import DescriptionTab from './tabs/DescriptionTab';
import EditorialTab from './tabs/EditorialTab';
import SolutionsTab from './tabs/SolutionsTab';
import SubmissionsTab from './tabs/submissionsTab';
import AskAITab from './tabs/AskAITab';

const ProblemPanel = ({ problem }) => {
    const [activeTab, setActiveTab] = useState('description');

    const tabs = [
        { id: 'description', label: 'Description', icon: FileText },
        { id: 'editorial', label: 'Editorial', icon: BookOpen }, 
        { id: 'submissions', label: 'Submissions', icon: Clock },
        { id: 'solutions', label: 'Solutions', icon: Lightbulb },  
        { id: 'ask-ai', label: 'Ask AI', icon: Sparkles }, 
    ];

    return (
        <div className="flex flex-col h-full bg-base-100 border-r border-base-200">
            
            {/*  1. Tab Header (IDE Style)  */}
            <div className="flex items-center h-11 bg-base-100 border-b border-base-200 overflow-x-auto no-scrollbar px-2">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`
                            relative flex items-center gap-2 px-4 h-full text-xs font-medium transition-all whitespace-nowrap outline-none
                            ${activeTab === tab.id 
                                ? 'text-primary bg-base-200/50' 
                                : 'text-base-content/60 hover:text-base-content hover:bg-base-200/30'
                            }
                        `}
                    >
                        {/* Top Accent Line for Active State  */}
                        {activeTab === tab.id && (
                            <span className="absolute top-0 left-0 right-0 h-[2px] bg-primary"></span>
                        )}

                        <tab.icon className={`w-3.5 h-3.5 ${activeTab === tab.id ? 'text-primary' : 'opacity-70'}`} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* 2. Tab Content Area */}
            <div className="flex-1 overflow-hidden relative bg-base-100">
               
                <div key={activeTab} className="h-full w-full animate-in fade-in slide-in-from-bottom-1 duration-200">
                    {activeTab === 'description' && <DescriptionTab problem={problem} />}
                    
                    {activeTab === 'editorial' && <EditorialTab problem={problem} />}
                    
                    {activeTab === 'submissions' && <SubmissionsTab problemId={problem._id} />}

                    {activeTab === 'solutions' && <SolutionsTab problem={problem} />}

                    {activeTab === 'ask-ai' && <AskAITab problem={problem} />}
                </div>
            </div>
        </div>
    );
};

export default ProblemPanel;