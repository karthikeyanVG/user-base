import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { User, UsersState } from '../types';

const initialState: UsersState = {
    users: [],
    loading: false,
    error: null,
    currentPage: 1,
    totalPages: 0,
    totalUsers: 0,
};

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        fetchUsersStart: (state) => {
            state.loading = true;
            state.error = null;
        },

        fetchUsersSuccess: (state, action: PayloadAction<{
            users: User[];
            page: number;
            total: number;
            totalPages: number;
        }>) => {
            state.loading = false;
            state.users = action.payload.users;
            state.currentPage = action.payload.page;
            state.totalUsers = action.payload.total;
            state.totalPages = action.payload.totalPages;
        },

        fetchUsersFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },

        createUserStart: (state) => {
            state.loading = true;
            state.error = null;
        },

        createUserSuccess: (state, action: PayloadAction<User>) => {
            state.loading = false;
            state.users.unshift(action.payload);
            state.totalUsers += 1;
        },

        createUserFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },

        updateUserStart: (state) => {
            state.loading = true;
            state.error = null;
        },

        updateUserSuccess: (state, action: PayloadAction<User>) => {
            state.loading = false;
            const index = state.users.findIndex(user => user.id === action.payload.id);
            if (index !== -1) {
                state.users[index] = action.payload;
            }
        },

        updateUserFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },

        deleteUserStart: (state) => {
            state.loading = true;
            state.error = null;
        },

        deleteUserSuccess: (state, action: PayloadAction<number>) => {
            state.loading = false;
            state.users = state.users.filter(user => user.id !== action.payload);
            state.totalUsers -= 1;
        },

        deleteUserFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },


        clearError: (state) => {
            state.error = null;
        },


        setCurrentPage: (state, action: PayloadAction<number>) => {
            state.currentPage = action.payload;
        },
    },
});

export const {
    fetchUsersStart,
    fetchUsersSuccess,
    fetchUsersFailure,
    createUserStart,
    createUserSuccess,
    createUserFailure,
    updateUserStart,
    updateUserSuccess,
    updateUserFailure,
    deleteUserStart,
    deleteUserSuccess,
    deleteUserFailure,
    clearError,
    setCurrentPage,
} = usersSlice.actions;

export default usersSlice.reducer;