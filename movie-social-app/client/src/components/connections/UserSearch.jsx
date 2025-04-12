import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const UserSearch = ({ currentUser }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Mock search results - replace with actual API call
  const mockUsers = [
    { id: 5, name: 'Sarah Connor', username: 'sconnor', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah' },
    { id: 6, name: 'Mike Johnson', username: 'mikej', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike' },
    { id: 7, name: 'Emma Wilson', username: 'emmaw', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma' },
  ].filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setIsSearching(true);
    // TODO: Implement actual search with debounce
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
          {mockUsers.map((user) => (
            <div
              key={user.id}
              className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-lg p-3 flex items-center space-x-3 hover:bg-gray-800/50 hover:border-blue-500/30 transition-all duration-300 group"
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="h-9 w-9 rounded-full bg-gray-700 ring-1 ring-gray-700/50 group-hover:ring-blue-500/50 transition-all duration-300 object-cover"
              />
              <div className="flex-1 min-w-0">
                <Link 
                  to={`/profile/${user.username}`}
                  className="text-sm font-medium text-white hover:text-blue-400 truncate block transition-colors duration-300"
                >
                  {user.name}
                </Link>
                <p className="text-xs text-gray-400 truncate">@{user.username}</p>
              </div>
              <button
                onClick={() => {/* TODO: Implement send friend request */}}
                className="px-3 py-1 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-500 transition-all duration-300 hover:shadow-md hover:shadow-blue-500/20 font-medium"
              >
                Add Friend
              </button>
            </div>
          ))}
          {mockUsers.length === 0 && (
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

UserSearch.propTypes = {
  currentUser: PropTypes.object.isRequired,
};

export default UserSearch;
