import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Accept a friend request
export const acceptFriendRequest = createAsyncThunk(
  'friends/acceptFriendRequest',
  async ({ fromUserId, toUserId, requestId }, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/friend-requests/accept', {
        fromUserId,
        toUserId,
        requestId
      });
      return { 
        success: response.data.success,
        fromUserId,
        requestId
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Decline a friend request
export const declineFriendRequest = createAsyncThunk(
  'friends/declineFriendRequest',
  async ({ fromUserId, toUserId, requestId }, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/friend-requests/decline', {
        fromUserId,
        toUserId,
        requestId
      });
      return { 
        success: response.data.success, 
        fromUserId,
        requestId
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Cancel a friend request you've sent
export const cancelFriendRequest = createAsyncThunk(
  'friends/cancelFriendRequest',
  async ({ fromUserId, toUserId, requestId }, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/friend-requests/cancel', {
        fromUserId,
        toUserId,
        requestId
      });
      return { 
        success: response.data.success,
        toUserId,
        requestId
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Keep other existing thunks like sendFriendRequest, removeFriend, etc.

const friendsSlice = createSlice({
  name: 'friends',
  initialState: {
    friends: [],
    friendRequests: [], // Store both sent and received requests here
    loading: false,
    error: null
  },
  reducers: {
    // Add action to update friend requests list
    setFriendRequests: (state, action) => {
      state.friendRequests = action.payload;
    },
    // Other reducers like setFriends, etc.
  },
  extraReducers: (builder) => {
    builder
      // Accept friend request
      .addCase(acceptFriendRequest.pending, (state) => {
        state.loading = true;
      })
      .addCase(acceptFriendRequest.fulfilled, (state, action) => {
        // Remove from requests and add to friends
        state.friendRequests = state.friendRequests.filter(
          request => request.id !== action.payload.requestId
        );
        // We'd need to handle adding to friends here if needed
        state.loading = false;
      })
      .addCase(acceptFriendRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Decline friend request
      .addCase(declineFriendRequest.pending, (state) => {
        state.loading = true;
      })
      .addCase(declineFriendRequest.fulfilled, (state, action) => {
        // Remove from requests
        state.friendRequests = state.friendRequests.filter(
          request => request.id !== action.payload.requestId
        );
        state.loading = false;
      })
      .addCase(declineFriendRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Cancel friend request
      .addCase(cancelFriendRequest.pending, (state) => {
        state.loading = true;
      })
      .addCase(cancelFriendRequest.fulfilled, (state, action) => {
        // Remove from requests
        state.friendRequests = state.friendRequests.filter(
          request => request.id !== action.payload.requestId
        );
        state.loading = false;
      })
      .addCase(cancelFriendRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
      
      // Keep other existing cases
  }
});

export const { setFriendRequests, setFriends } = friendsSlice.actions;
export default friendsSlice.reducer;
