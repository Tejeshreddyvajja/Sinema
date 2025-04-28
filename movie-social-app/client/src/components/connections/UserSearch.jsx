import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const UserSearch = () => {
  const { user: currentUser } = useAuth(); // Use `useAuth` to get the current user
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!searchQuery.trim()) {
        setUsers([]);
        return;
      }

      setIsSearching(true);
      try {
        const response = await axios.get(`/api/friend-requests/users`);
        console.log('Fetched users:', response.data); // Debugging log to verify fetched users
        if (Array.isArray(response.data)) {
          const filteredUsers = response.data.filter(user =>
            user.clerkId !== currentUser.clerkId && // Exclude the current user
            (user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
             user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
             user.email.toLowerCase().includes(searchQuery.toLowerCase()))
          );
          console.log('Filtered users:', filteredUsers); // Debugging log to verify filtered users
          setUsers(filteredUsers);
        } else {
          console.error('Unexpected response format:', response.data);
          setUsers([]);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setIsSearching(false);
      }
    };

    const debounceTimer = setTimeout(fetchUsers, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery, currentUser]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const sendFriendRequest = async (receiverId) => {
    try {
      if (!currentUser) {
        console.error('Current user is not available');
        alert('Please log in to send friend requests');
        return;
      }

      // Get the Clerk ID from the current user
      const senderId = currentUser?.id || currentUser?.clerkId;
      
      if (!senderId) {
        console.error('User ID is not available', currentUser);
        alert('Cannot send friend request: User ID is not available');
        return;
      }

      console.log('Sending friend request with data:', { senderId, receiverId });
      
      // Use a more explicit approach with stringified JSON
      const requestData = JSON.stringify({ senderId, receiverId });
      console.log('Stringified request data:', requestData);
      
      const response = await fetch('/api/friend-requests/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: requestData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to send friend request');
      }
      
      const responseData = await response.json();
      console.log('Friend request response:', responseData);
      alert('Friend request sent successfully!');
    } catch (error) {
      console.error('Error sending friend request:', error);
      alert(`Failed to send friend request: ${error.message}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search users by name or username..."
          className="w-full bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 text-white placeholder-gray-400 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500/30 hover:border-gray-600/50 transition-all duration-300"
        />
        <div className="absolute right-3 top-3">
          <svg
            className={`h-5 w-5 text-gray-400 ${isSearching ? 'animate-spin' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Search Results */}
      {searchQuery && (
        <div className="space-y-3">
          {users.map((user) => (
            <div
              key={user._id}
              className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-lg p-3 flex items-center space-x-3 hover:bg-gray-800/50 hover:border-blue-500/30 transition-all duration-300 group"
            >
              <img
                src={user.profilePicture || 'https://via.placeholder.com/150'}
                alt={user.name}
                className="h-9 w-9 rounded-full bg-gray-700 ring-1 ring-gray-700/50 group-hover:ring-blue-500/50 transition-all duration-300 object-cover"
              />
              <div className="flex-1 min-w-0">
                <Link 
                  to={`/profile/${user.username}`}
                  className="text-sm font-medium text-white hover:text-blue-400 truncate block transition-colors duration-300"
                >
                  {user.firstName} {user.lastName}
                </Link>
                <p className="text-xs text-gray-400 truncate">@{user.username}</p>
              </div>
              <button
                onClick={() => sendFriendRequest(user.clerkId)}
                className="px-3 py-1 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-500 transition-all duration-300 hover:shadow-md hover:shadow-blue-500/20 font-medium"
              >
                Add Friend
              </button>
            </div>
          ))}
          {users.length === 0 && (
            <div className="text-center py-6 bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-lg">
              <p className="text-gray-400 text-xs">No users found matching <span className="text-gray-300 font-medium">"{searchQuery}"</span></p>
            </div>
          )}
        </div>
      )}

      {/* Initial State */}
      {!searchQuery && (
        <div className="text-center py-16 bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50">
          <div className="bg-gray-700/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="h-8 w-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-200 mb-2">Find Friends</h3>
          <p className="text-gray-400">
            Search for users by name or username to connect with them
          </p>
        </div>
      )}
    </div>
  );
};

export default UserSearch;
