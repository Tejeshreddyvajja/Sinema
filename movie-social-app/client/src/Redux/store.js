import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import friendsReducer from './friendsSlice';
// Import other reducers as needed

const store = configureStore({
  reducer: {
    auth: authReducer,
    friends: friendsReducer,
    // Add other reducers here
  },
});

export default store;