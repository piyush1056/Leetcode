import workspaceReducer from './slices/workspaceSlice';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import problemReducer from './slices/problemSlice';
import adminReducer from './slices/adminSlice';
export const store = configureStore({
    reducer: {
        auth: authReducer,
        workspace: workspaceReducer,
        problem: problemReducer,
        admin: adminReducer
    },
});
