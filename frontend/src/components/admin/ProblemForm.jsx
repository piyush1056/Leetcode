import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useDispatch } from 'react-redux';
import axiosInstance from '../../utils/axiosClient';
import { toast } from 'sonner';
import { Save, Plus, Trash2, Video, FileText, Code2, List, UploadCloud } from 'lucide-react';

const ProblemForm = () => {
    const { id } = useParams(); 
    const navigate = useNavigate();
    const isEditMode = !!id;

    const [activeTab, setActiveTab] = useState('general');
    const [loading, setLoading] = useState(false);
    const [videoUploading, setVideoUploading] = useState(false);
    const [isDirty, setIsDirty] = useState(false);

    
    // Initial State matching Backend Schema
    const [formData, setFormData] = useState({
        title: '',
        problemNo: '',
        difficulty: 'medium',
        tags: '',
        companies: '',
        description: '',
        constraints: '',
        visibleTestCases: [{ input: '', output: '' }],
        hiddenTestCases: [{ input: '', output: '' }],
        startCode: [{ language: 'javascript', initialCode: '// Write your code here' }],
        referenceSolution: [{ language: 'javascript', completeCode: '' }],
        video: null 
    });


    useEffect(() => {
        if (isEditMode) {
            fetchProblemDetails();
        }
    }, [id]);

    const fetchProblemDetails = async () => {
        try {
            const { data } = await axiosInstance.get(`/problem/${id}`);
           
            setFormData({
                ...data,
                tags: data.tags.join(', '),
                companies: data.companies.join(', '),
                video: data.video || null
              
            });
        } catch (error) {
            toast.error("Failed to load problem");
            navigate('/admin/problems');
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setIsDirty(true);
    };

    // Dynamic Array Handlers (TestCases, Code)
    const handleArrayChange = (field, index, subField, value) => {
        const updatedArray = [...formData[field]];
        updatedArray[index][subField] = value;
        setFormData({ ...formData, [field]: updatedArray });
        setIsDirty(true);
    
    };

    const addItem = (field, template) => {
        setFormData({ ...formData, [field]: [...formData[field], template] });
        setIsDirty(true);
    };

    const removeItem = (field, index) => {
        const updatedArray = formData[field].filter((_, i) => i !== index);
        setFormData({ ...formData, [field]: updatedArray });
        setIsDirty(true);
    };

    // --- SUBMIT LOGIC ---
    const handleSubmit = async () => {
        setLoading(true);
        try {
           
            const payload = {
                ...formData,
                problemNo: Number(formData.problemNo),

                tags: formData.tags
                    .split(',')
                    .map(t => t.trim())
                    .filter(Boolean),

                companies: formData.companies
                    .split(',')
                    .map(t => t.trim())
                    .filter(Boolean),

                constraints: formData.constraints
                    .split('\n')
                    .map(s => s.trim())
                    .filter(Boolean),

                hints: formData.hints
                    ? formData.hints.split('\n').map(s => s.trim()).filter(Boolean)
                    : [],
            };


            if (isEditMode) {
                await axiosInstance.put(`/problem/update/${id}`, payload);
                toast.success("Changes saved successfully");
                setIsDirty(false);
            } else {
                const { data } = await axiosInstance.post('/problem/create', payload);
                toast.success("Problem created! You can now add a video.");
                // Redirect to edit mode to upload video
                navigate(`/admin/problem/edit/${data.problem._id}`);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to save");
        } finally {
            setLoading(false);
        }
    };

    // --- VIDEO LOGIC (Only in Edit Mode) ---
    const handleVideoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setVideoUploading(true);
        try {
            // 1. Get Signature
            const { data: sigData } = await axiosInstance.get(`/video/upload/${id}`);
            
            // 2. Upload to Cloudinary
            const uploadData = new FormData();
            uploadData.append('file', file);
            uploadData.append('api_key', sigData.api_key);
            uploadData.append('timestamp', sigData.timestamp);
            uploadData.append('signature', sigData.signature);
            uploadData.append('public_id', sigData.public_id);

            const cloudinaryRes = await fetch(sigData.upload_url, {
                method: 'POST',
                body: uploadData
            });
            const cloudData = await cloudinaryRes.json();

            // 3. Save Metadata to Backend
            await axiosInstance.post(`/video/save/${id}`, {
                cloudinaryPublicId: cloudData.public_id,
                secureUrl: cloudData.secure_url,
                duration: cloudData.duration
            });

            toast.success("Video uploaded successfully!");
            fetchProblemDetails(); 

        } catch (error) {
            console.error(error);
            toast.error("Video upload failed");
        } finally {
            setVideoUploading(false);
        }
    };

    const handleDeleteVideo = async () => {
        if (!confirm("Delete video solution?")) return;
        try {
            await axiosInstance.delete(`/video/delete/${id}`);
            toast.success("Video deleted");
            setFormData(prev => ({ ...prev, video: null }));
        } catch (error) {
            toast.error("Failed to delete video");
        }
    };

    // --- TABS UI ---
    return (
        <div className="max-w-5xl mx-auto pb-20">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">{isEditMode ? 'Edit Problem' : 'Create New Problem'}</h2>
                <button onClick={handleSubmit} className="btn btn-primary gap-2" disabled={!isDirty || loading}>
                    <Save size={18} /> {loading ? 'Saving...' : 'Save Problem'}
                </button>
            </div>

            {/* Tab Headers */}
            <div className="tabs tabs-boxed mb-6 bg-base-200">
                {[
                    { id: 'general', label: 'General', icon: FileText },
                    { id: 'code', label: 'Code & Solution', icon: Code2 },
                    { id: 'testcases', label: 'Test Cases', icon: List },
                    { id: 'video', label: 'Video Solution', icon: Video, disabled: !isEditMode },
                ].map(tab => (
                    <a 
                        key={tab.id}
                        className={`tab gap-2 ${activeTab === tab.id ? 'tab-active' : ''} ${tab.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={() => !tab.disabled && setActiveTab(tab.id)}
                    >
                        <tab.icon size={16} /> {tab.label}
                    </a>
                ))}
            </div>

            {/* --- TAB CONTENT --- */}
            
            {/* 1. General Tab */}
            {activeTab === 'general' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-base-100 p-6 rounded-xl shadow">
                    <div className="form-control">
                        <label className="label">Title</label>
                        <input name="title" value={formData.title} onChange={handleChange} className="input input-bordered" placeholder="Two Sum" />
                    </div>
                    <div className="form-control">
                        <label className="label">Problem No (Unique)</label>
                        <input type="number" name="problemNo" value={formData.problemNo} onChange={handleChange} className="input input-bordered" placeholder="1" />
                    </div>
                    <div className="form-control">
                        <label className="label">Difficulty</label>
                        <select name="difficulty" value={formData.difficulty} onChange={handleChange} className="select select-bordered">
                            <option value="easy">Easy</option>
                            <option value="medium">Medium</option>
                            <option value="hard">Hard</option>
                        </select>
                    </div>
                    <div className="form-control">
                        <label className="label">Tags (comma separated)</label>
                        <input name="tags" value={formData.tags} onChange={handleChange} className="input input-bordered" placeholder="Array, Hash Table" />
                    </div>
                    <div className="form-control col-span-2">
                        <label className="label">Companies (comma separated)</label>
                        <input name="companies" value={formData.companies} onChange={handleChange} className="input input-bordered" placeholder="Google, Amazon" />
                    </div>
                    <div className="form-control col-span-2">
                        <label className="label">Description (Markdown supported)</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} className="textarea textarea-bordered h-32 font-mono text-sm" placeholder="Problem description..." />
                    </div>
                    <div className="form-control col-span-2">
                        <label className="label">Constraints (One per line)</label>
                        <textarea name="constraints" value={formData.constraints} onChange={handleChange} className="textarea textarea-bordered h-24" placeholder="- 1 <= nums.length <= 10^4" />
                    </div>
                </div>
            )}

            {/* 2. Code Tab */}
            {activeTab === 'code' && (
                <div className="space-y-6">
                    {/* Starter Code */}
                    <div className="bg-base-100 p-6 rounded-xl shadow">
                        <h3 className="font-bold mb-4">Starter Code (User sees this)</h3>
                        {formData.startCode.map((item, idx) => (
                            <div key={idx} className="flex gap-2 mb-2 items-start">
                                <select 
                                    value={item.language}
                                    onChange={(e) => handleArrayChange('startCode', idx, 'language', e.target.value)}
                                    className="select select-bordered select-sm w-32"
                                >
                                    <option value="javascript">JavaScript</option>
                                    <option value="c++">C++</option>
                                    <option value="java">Java</option>
                                    <option value="python">Python</option>
                                    <option value="c">C</option>
                                </select>
                                <textarea 
                                    value={item.initialCode}
                                    onChange={(e) => handleArrayChange('startCode', idx, 'initialCode', e.target.value)}
                                    className="textarea textarea-bordered w-full font-mono text-xs h-24"
                                />
                                <button onClick={() => removeItem('startCode', idx)} className="btn btn-ghost btn-xs text-error"><Trash2 size={16}/></button>
                            </div>
                        ))}
                        <button onClick={() => addItem('startCode', { language: 'javascript', initialCode: '' })} className="btn btn-xs btn-outline mt-2">+ Add Language</button>
                    </div>

                    {/* Reference Solution */}
                    <div className="bg-base-100 p-6 rounded-xl shadow">
                        <h3 className="font-bold mb-4 text-success">Reference Solution (Hidden, used for testing)</h3>
                        {formData.referenceSolution.map((item, idx) => (
                            <div key={idx} className="flex gap-2 mb-2 items-start">
                                <select 
                                    value={item.language}
                                    onChange={(e) => handleArrayChange('referenceSolution', idx, 'language', e.target.value)}
                                    className="select select-bordered select-sm w-32"
                                >
                                    <option value="javascript">JS</option>
                                    <option value="cpp">C++</option>
                                    <option value="java">Java</option>
                                    <option value="python">Python</option>
                                    <option value="c">C</option>
                                </select>
                                <textarea 
                                    value={item.completeCode}
                                    onChange={(e) => handleArrayChange('referenceSolution', idx, 'completeCode', e.target.value)}
                                    className="textarea textarea-bordered w-full font-mono text-xs h-24"
                                />
                                <button onClick={() => removeItem('referenceSolution', idx)} className="btn btn-ghost btn-xs text-error"><Trash2 size={16}/></button>
                            </div>
                        ))}
                        <button onClick={() => addItem('referenceSolution', { language: 'javascript', completeCode: '' })} className="btn btn-xs btn-outline mt-2">+ Add Solution</button>
                    </div>
                </div>
            )}

            {/* 3. Test Cases Tab */}
            {activeTab === 'testcases' && (
                <div className="space-y-6">
                    {/* Visible Cases */}
                    <div className="bg-base-100 p-6 rounded-xl shadow">
                        <h3 className="font-bold mb-4">Visible Test Cases (Example cases)</h3>
                        {formData.visibleTestCases.map((tc, idx) => (
                            <div key={idx} className="flex gap-2 mb-2">
                                <input 
                                    value={tc.input} 
                                    onChange={(e) => handleArrayChange('visibleTestCases', idx, 'input', e.target.value)}
                                    className="input input-bordered input-sm w-1/2 font-mono" 
                                    placeholder="Input (e.g. [2,7,11,15], 9)"
                                />
                                <input 
                                    value={tc.output} 
                                    onChange={(e) => handleArrayChange('visibleTestCases', idx, 'output', e.target.value)}
                                    className="input input-bordered input-sm w-1/2 font-mono" 
                                    placeholder="Output (e.g. [0,1])"
                                />
                                <button onClick={() => removeItem('visibleTestCases', idx)} className="btn btn-ghost btn-xs text-error"><Trash2 size={16}/></button>
                            </div>
                        ))}
                        <button onClick={() => addItem('visibleTestCases', { input: '', output: '' })} className="btn btn-xs btn-outline mt-2">+ Add Case</button>
                    </div>

                    {/* Hidden Cases */}
                    <div className="bg-base-100 p-6 rounded-xl shadow border-l-4 border-error">
                        <h3 className="font-bold mb-4">Hidden Test Cases (Validation)</h3>
                        {formData.hiddenTestCases.map((tc, idx) => (
                            <div key={idx} className="flex gap-2 mb-2">
                                <input 
                                    value={tc.input} 
                                    onChange={(e) => handleArrayChange('hiddenTestCases', idx, 'input', e.target.value)}
                                    className="input input-bordered input-sm w-1/2 font-mono" 
                                    placeholder="Hidden Input"
                                />
                                <input 
                                    value={tc.output} 
                                    onChange={(e) => handleArrayChange('hiddenTestCases', idx, 'output', e.target.value)}
                                    className="input input-bordered input-sm w-1/2 font-mono" 
                                    placeholder="Hidden Output"
                                />
                                <button onClick={() => removeItem('hiddenTestCases', idx)} className="btn btn-ghost btn-xs text-error"><Trash2 size={16}/></button>
                            </div>
                        ))}
                        <button onClick={() => addItem('hiddenTestCases', { input: '', output: '' })} className="btn btn-xs btn-outline mt-2">+ Add Hidden Case</button>
                    </div>
                </div>
            )}

            {/* 4. Video Tab (Edit Mode Only) */}
            {activeTab === 'video' && (
                <div className="bg-base-100 p-10 rounded-xl shadow text-center">
                    {formData.video ? (
                        <div className="space-y-4">
                            <div className="alert alert-success shadow-lg max-w-md mx-auto">
                                <Video size={24} />
                                <span>Video Solution is Active</span>
                            </div>
                            <div className="aspect-video max-w-md mx-auto bg-black rounded-lg overflow-hidden border">
                                <iframe src={formData.video.secureUrl} className="w-full h-full" title="Solution" />
                            </div>
                            <button onClick={handleDeleteVideo} className="btn btn-error btn-outline gap-2">
                                <Trash2 size={18} /> Remove Video
                            </button>
                        </div>
                    ) : (
                        <div className="border-2 border-dashed border-base-300 rounded-xl p-10 hover:bg-base-50 transition">
                            <UploadCloud className="w-16 h-16 mx-auto text-primary mb-4" />
                            <h3 className="text-xl font-bold mb-2">Upload Video Solution</h3>
                            <p className="text-base-content/60 mb-6">Supported formats: MP4, WebM</p>
                            
                            {videoUploading ? (
                                <div className="flex flex-col items-center gap-2">
                                    <span className="loading loading-spinner loading-lg text-primary"></span>
                                    <span className="text-sm">Uploading to Cloudinary...</span>
                                </div>
                            ) : (
                                <input 
                                    type="file" 
                                    accept="video/*" 
                                    onChange={handleVideoUpload}
                                    className="file-input file-input-bordered file-input-primary w-full max-w-xs" 
                                />
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ProblemForm;