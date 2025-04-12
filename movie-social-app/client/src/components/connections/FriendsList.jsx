import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const FriendsList = ({ friends }) => {
  if (friends.length === 0) {
    return (
      <div className="text-center py-6 bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50">
        <div className="bg-gray-700/50 w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-3">
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
        <h3 className="text-lg font-medium text-gray-200 mb-2">No friends yet</h3>
        <p className="text-gray-400">Start by finding friends to connect with!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {friends.map((friend) => (
        <div
          key={friend.id}
          className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-lg p-3 flex items-center space-x-3 hover:bg-gray-800/50 hover:border-blue-500/30 transition-all duration-300 group"
        >
          <img
            src={friend.avatar}
            alt={friend.name}
            className="h-10 w-10 rounded-full bg-gray-700 ring-1 ring-gray-700/50 group-hover:ring-blue-500/50 transition-all duration-300 object-cover"
          />
          <div className="flex-1 min-w-0">
            <Link 
              to={`/profile/${friend.username}`}
              className="text-sm font-medium text-white hover:text-blue-400 truncate block transition-colors duration-300"
            >
              {friend.name}
            </Link>
            <p className="text-xs text-gray-400 truncate">@{friend.username}</p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => {/* TODO: Implement chat */}}
              className="p-1.5 text-gray-400 hover:text-blue-400 transition-all duration-300 hover:scale-110 hover:bg-blue-500/10 rounded-md"
              title="Send message"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </button>
            <button
              onClick={() => {/* TODO: Implement watch party invite */}}
              className="p-1.5 text-gray-400 hover:text-blue-400 transition-all duration-300 hover:scale-110 hover:bg-blue-500/10 rounded-md"
              title="Invite to watch party"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            </button>
            <button
              onClick={() => {/* TODO: Implement unfriend */}}
              className="p-2 text-gray-400 hover:text-red-500 transition-colors"
              title="Remove friend"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM21 12h-6"
                />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

FriendsList.propTypes = {
  friends: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      username: PropTypes.string.isRequired,
      avatar: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default FriendsList;
