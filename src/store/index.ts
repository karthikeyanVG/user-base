import { configureStore } from '@reduxjs/toolkit';
import usersReducer from './slice/userSlice';
import authReducer from './slice/authSlice';

export const store = configureStore({
  reducer: {
    users: usersReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: true,
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;