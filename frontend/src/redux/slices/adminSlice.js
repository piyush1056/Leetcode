import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosClient"
import { toast } from "sonner";


export const fetchAdminStatsAsync = createAsyncThunk("admin/fetchStats", async (_, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.get("/admin/stats");
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to fetch stats");
    }
});
export const fetchAdminProblemsAsync = createAsyncThunk(
    "admin/fetchProblems",
    async (params, { rejectWithValue }) => {
        try {
          const response = await axiosInstance.get("/problem", { params });
            return response.data; // { problems: [], pagination: {} }
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch problems");
        }
    }
);

export const fetchAllUsersAsync = createAsyncThunk("admin/fetchUsers", async (_, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.get("/user/admin/users");
        return response.data; // Expecting { success: true, users: [...] }
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to fetch users");
    }
});

export const deleteProblemAsync = createAsyncThunk(
    "admin/deleteProblem",
    async (id, { rejectWithValue }) => {
        try {
            await axiosInstance.delete(`/problem/${id}`);
            return id; 
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to delete problem");
        }
    }
);

export const promoteUserAsync = createAsyncThunk(
    "admin/promoteUser",
    async (userId, { rejectWithValue }) => {
        try {
         
            const response = await axiosInstance.post('/user/admin/promote-user', { userId });
            return { userId, message: response.data.message }; 
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to promote user");
        }
    }
);

export const deleteUserAsync = createAsyncThunk(
    "admin/deleteUser",
    async (userId, { rejectWithValue }) => {
        try {
            await axiosInstance.delete(`/user/admin/user/${userId}`);
            return userId; // Return ID to remove from UI
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to delete user");
        }
    }
);
export const fetchVideoByProblemAsync = createAsyncThunk(
  "admin/fetchVideoByProblem",
  async (problemId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/video/${problemId}`);
      return { problemId, video: res.data.video };
    } catch {
      return { problemId, video: null };
    }
  }
);
export const deleteVideoAsync = createAsyncThunk(
  "admin/deleteVideo",
  async (problemId, { rejectWithValue }) => {
    await axiosInstance.delete(`/video/delete/${problemId}`);
    return problemId;
  }
);

const adminSlice = createSlice({
    name: "admin",
    initialState: {
        stats: null, // { totalUsers, totalProblems, totalSubmissions, recentUsers }
        users: [],
        problems: [],     // List of problems
        pagination: null, // Pagination data

        loading: {
           stats: false,
           users: false,
           problems: false,
           action: false, // delete / promote / etc
        },
        videoByProblem: {},   // { [problemId]: video | null }
        videoLoading: false,


        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Stats
            .addCase(fetchAdminStatsAsync.pending, (state) => {
             state.loading.stats = true;
                   })
            .addCase(fetchAdminStatsAsync.fulfilled, (state, action) => {
              state.loading.stats = false;
             state.stats = action.payload;
            })
             .addCase(fetchAdminStatsAsync.rejected, (state) => {
             state.loading.stats = false;
             })
            // Users
            .addCase(fetchAllUsersAsync.fulfilled, (state, action) => {
                state.users = action.payload.users;
            });
            // --- Problems Cases ---
        builder
            .addCase(fetchAdminProblemsAsync.pending, (state) => {
                 state.loading.problems = true;
            })
            .addCase(fetchAdminProblemsAsync.fulfilled, (state, action) => {
                state.loading.problems = false;
                state.problems = action.payload.problems;
                state.pagination = action.payload.pagination;
            })
            .addCase(fetchAdminProblemsAsync.rejected, (state, action) => {
                state.loading.problems = false;
                toast.error(action.payload);
            })
            
            // --- Delete Case ---
            .addCase(deleteProblemAsync.fulfilled, (state, action) => {
                state.problems = state.problems.filter(p => p._id !== action.payload);
               
                if (state.pagination) {
                  state.pagination.total -= 1;
               }

               toast.success("Problem deleted successfully");
               
            })
            .addCase(deleteProblemAsync.rejected, (state, action) => {
                toast.error(action.payload);
            });

            // Promote User Case
        builder
            .addCase(promoteUserAsync.fulfilled, (state, action) => {
                const user = state.users.find(u => u._id === action.payload.userId);
                if (user) {
                    user.role = 'admin';
                }
                toast.success(action.payload.message || "User promoted to Admin successfully");
            })
            .addCase(promoteUserAsync.rejected, (state, action) => {
                toast.error(action.payload);
            });
          
        builder
            .addCase(deleteUserAsync.fulfilled, (state, action) => {
                // Remove user from list
                state.users = state.users.filter(u => u._id !== action.payload);
                toast.success("User deleted successfully");
            })
            .addCase(deleteUserAsync.rejected, (state, action) => {
                toast.error(action.payload);
            });

            builder
            .addCase(fetchVideoByProblemAsync.pending, (state) => {
                state.videoLoading = true;
            })
            .addCase(fetchVideoByProblemAsync.fulfilled, (state, action) => {
                const { problemId, video } = action.payload;
                state.videoByProblem[problemId] = video;
            })
            .addCase(fetchVideoByProblemAsync.rejected, (state) => {
                state.videoLoading = false;
            })
            .addCase(deleteVideoAsync.pending, (state) => {
                state.videoLoading = true;
            })
            .addCase(deleteVideoAsync.fulfilled, (state, action) => {
                const problemId = action.payload;
                state.videoLoading = false;
                state.videoByProblem[problemId] = null;
                toast.success("Video deleted successfully");
            })
            .addCase(deleteVideoAsync.rejected, (state) => {
            state.videoLoading = false;
             })
            
    },
});


export default adminSlice.reducer;