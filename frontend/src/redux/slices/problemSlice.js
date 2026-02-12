import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosClient";
import { toast } from "sonner";

export const toggleLikeAsync = createAsyncThunk(
    "problem/toggleLike",
    async ({ problemId, isLiked }, { rejectWithValue }) => {
        try {
            let response;
            if (isLiked) {
                response = await axiosInstance.delete(`/problem/${problemId}/like`);
            } else {
                response = await axiosInstance.post(`/problem/${problemId}/like`);
            }
            return {
                problemId,
                isLiked: !isLiked,
                likesCount: response.data.likesCount
            };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to toggle like");
        }
    }
);

export const toggleFavouriteAsync = createAsyncThunk(
    "problem/toggleFavourite",
    async ({ problemId, isFavourite }, { rejectWithValue }) => {
        try {
            let response;
            if (isFavourite) {
                response = await axiosInstance.delete(`/problem/${problemId}/favourite`);
            } else {
                response = await axiosInstance.post(`/problem/${problemId}/favourite`);
            }
            return {
                problemId,
                isFavourite: !isFavourite
            };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to toggle favourite");
        }
    }
);

export const toggleBookmarkAsync = createAsyncThunk(
    "problem/toggleBookmark",
    async ({ problemId, bookmarkName = "My Problems" }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(`/problem/bookmarks/problem`, {
                problemId,
                bookmarkName
            });

            const isAdded = response.data.message.toLowerCase().includes("added");

            return {
                ...response.data,
                problemId,
                bookmarkName,
                isAdded 
            };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to update bookmark");
        }
    }
);


export const addCommentAsync = createAsyncThunk(
    "problem/addComment",
    async ({ problemId, content }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(`/problem/${problemId}/comment`, {
                content
            });
            return response.data; // { message, comment }
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to post comment");
        }
    }
);

const initialState = {
    loading: false,
    error: null,
  
};

const problemSlice = createSlice({
    name: "problem",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
       
        builder
            .addCase(toggleLikeAsync.fulfilled, (state) => {
            })
            .addCase(toggleLikeAsync.rejected, (state, action) => {
                toast.error(action.payload);
            });

        builder.addCase(toggleFavouriteAsync.rejected, (state, action) => {
            toast.error(action.payload);
        });

        builder
            .addCase(toggleBookmarkAsync.fulfilled, (state, action) => {
                toast.success(action.payload.message);
            })
            .addCase(toggleBookmarkAsync.rejected, (state, action) => {
                toast.error(action.payload);
            });

        builder
            .addCase(addCommentAsync.fulfilled, (state) => {
                toast.success("Comment added!");
            })
            .addCase(addCommentAsync.rejected, (state, action) => {
                toast.error(action.payload);
            });
    }
});

export default problemSlice.reducer;