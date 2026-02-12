import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosClient";



export const runCodeAsync = createAsyncThunk(
    "workspace/runCode",
    async ({ problemId, code, language }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(
                `/submission/run/${problemId}`,
                { code, language }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to run code"
            );
        }
    }
);

export const submitCodeAsync = createAsyncThunk(
    "workspace/submitCode",
    async ({ problemId, code, language }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(
                `/submission/submit/${problemId}`,
                { code, language }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to submit code"
            );
        }
    }
);



const initialState = {
    currentProblem: null,
    userCode: {}, // { [problemId]: "string" }
    isConsoleOpen: false,
    activeConsoleTab: "testcases", // 'testcases' | 'result'

    // Execution State
    runStatus: "idle", // 'idle' | 'loading' | 'success' | 'error'
    runResult: null,
    submissionStatus: "idle", // 'idle' | 'loading' | 'success' | 'error'
    submissionResult: null,

    // UI State
    isSidebarOpen: false,
    activeLanguage: "javascript",

    // Editor Settings
    editorPreferences: {
        fontSize: 14,
        theme: "vs-dark"
    }
};

const workspaceSlice = createSlice({
    name: "workspace",
    initialState,
    reducers: {
        setProblem: (state, action) => {
            state.currentProblem = action.payload;
        },
        updateUserCode: (state, action) => {
            const { problemId, code } = action.payload;
            state.userCode[problemId] = code;
        },
        toggleConsole: (state, action) => {
            state.isConsoleOpen =
                action.payload !== undefined ? action.payload : !state.isConsoleOpen;
        },
        setActiveConsoleTab: (state, action) => {
            state.activeConsoleTab = action.payload;
            state.isConsoleOpen = true; // Auto-open console when validating tabs
        },
        toggleSidebar: (state) => {
            state.isSidebarOpen = !state.isSidebarOpen;
        },
        
        resetRunStatus: (state) => {
            state.runStatus = "idle";
            state.runResult = null;
        },
        setActiveLanguage: (state, action) => {
            state.activeLanguage = action.payload;
        },
       
        setEditorFontSize: (state, action) => {
            state.editorPreferences.fontSize = action.payload;
        },
        setEditorTheme: (state, action) => {
            state.editorPreferences.theme = action.payload;
        },
        resetSubmissionResult: (state) => {
         state.submissionResult = null;
         state.submissionStatus = "idle";
       }

    },
    extraReducers: (builder) => {
 
        builder
            .addCase(runCodeAsync.pending, (state) => {
                state.runStatus = "loading";
                state.isConsoleOpen = true;
                state.activeConsoleTab = "result";
                state.runResult = null;
 
            })
            .addCase(runCodeAsync.fulfilled, (state, action) => {
                state.runStatus = "success";
                state.runResult = action.payload;
            })
            .addCase(runCodeAsync.rejected, (state, action) => {
                state.runStatus = "error";
                state.runResult = { errorMessage: action.payload };
            });

        builder
            .addCase(submitCodeAsync.pending, (state) => {
                state.submissionStatus = "loading";
                state.isSubmissionDrawerOpen = true; // Auto open drawer
                state.submissionResult = null;
            })
            .addCase(submitCodeAsync.fulfilled, (state, action) => {
                state.submissionStatus = "success";
                state.submissionResult = action.payload;
            })
            .addCase(submitCodeAsync.rejected, (state, action) => {
                state.submissionStatus = "error";
                state.submissionResult = { errorMessage: action.payload };
            });
    },
});

export const {
    setProblem,
    updateUserCode,
    toggleConsole,
    setActiveConsoleTab,
    toggleSidebar,
    resetRunStatus,
    setActiveLanguage,
    setEditorFontSize,
    setEditorTheme,
    resetSubmissionResult
} = workspaceSlice.actions;

export default workspaceSlice.reducer;

