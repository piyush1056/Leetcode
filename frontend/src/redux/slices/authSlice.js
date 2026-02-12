import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../../utils/axiosClient';
import { toggleLikeAsync, toggleFavouriteAsync, toggleBookmarkAsync } from './problemSlice';


export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post('/user/login', credentials);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post('/user/register', userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
  }
);

export const googleAuthUser = createAsyncThunk(
  'auth/googleAuthUser',
  async (token, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post('/user/google-auth', { credential: token });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Google Auth failed');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      await axiosClient.post('/user/logout');
      return null;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Logout failed');
    }
  }
);

export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get('/user/check');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Not authenticated');
    }
  }
);

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.isAuthenticated = false;
        state.user = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.isAuthenticated = true;
        state.user = action.payload?.user ?? null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? action.error?.message ?? 'Login failed';
        state.isAuthenticated = false;
        state.user = null;
      })

      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.isAuthenticated = false;
        state.user = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.isAuthenticated = true;
        state.user = action.payload?.user ?? null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? action.error?.message ?? 'Registration failed';
        state.isAuthenticated = false;
        state.user = null;
      })

      // Google Auth
      .addCase(googleAuthUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.isAuthenticated = false;
        state.user = null;
      })
      .addCase(googleAuthUser.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.isAuthenticated = true;
        state.user = action.payload?.user ?? null;
      })
      .addCase(googleAuthUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? action.error?.message ?? 'Google auth failed';
        state.isAuthenticated = false;
        state.user = null;
      })

      // Logout
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        state.isAuthenticated = false;
        state.user = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? action.error?.message ?? 'Logout failed';
      })

      // Check Auth
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
        state.error = null;

      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.isAuthenticated = !!action.payload?.isAuthenticated;
        state.user = action.payload?.isAuthenticated ? action.payload?.user ?? null : null;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? action.error?.message ?? 'Auth check failed';
        state.isAuthenticated = false;
        state.user = null;
      })
      //  Problem Interactions 
      .addCase(toggleLikeAsync.fulfilled, (state, action) => {
        if (!state.user) return;
        const { problemId, isLiked } = action.payload;
        if (isLiked) {
          if (!state.user.likedProblems.includes(problemId)) state.user.likedProblems.push(problemId);
        } else {
          state.user.likedProblems = state.user.likedProblems.filter(id => id !== problemId);
        }
      })
      .addCase(toggleFavouriteAsync.fulfilled, (state, action) => {
        if (!state.user) return;
        const { problemId, isFavourite } = action.payload;
        if (isFavourite) {
          if (!state.user.favouriteProblems.includes(problemId)) state.user.favouriteProblems.push(problemId);
        } else {
          state.user.favouriteProblems = state.user.favouriteProblems.filter(id => id !== problemId);
        }
      })
      .addCase(toggleBookmarkAsync.fulfilled, (state, action) => {
        if (!state.user) return;
        const { problemId, isAdded, bookmarkName } = action.payload;

        if (isAdded) {
          if (!state.user.bookmarkedProblems) state.user.bookmarkedProblems = [];
          if (!state.user.bookmarkedProblems.includes(problemId)) {
            state.user.bookmarkedProblems.push(problemId);
          }
        } else {
      
          if (state.user.bookmarkedProblems?.includes(problemId)) {
            state.user.bookmarkedProblems = state.user.bookmarkedProblems.filter(id => id !== problemId);
          }
        }
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;


