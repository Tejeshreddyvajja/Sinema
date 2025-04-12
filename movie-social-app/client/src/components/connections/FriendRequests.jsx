import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const FriendRequests = ({ requests }) => {
  const receivedRequests = requests.filter(req => req.type === 'received');
  const sentRequests = requests.filter(req => req.type === 'sent');

  if (requests.length === 0) {
    return (
      <div className="text-center py-16 bg-gray-700/50 backdrop-blur-sm rounded-xl border border-gray-700/50">
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
              d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-200 mb-2">No friend requests</h3>
        <p className="text-gray-400">You don't have any pending friend requests</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Received Requests */}
      {receivedRequests.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-300 mb-2 px-1">Received Requests</h3>
          <div className="space-y-2">
            {receivedRequests.map((request) => (
              <div
                key={request.id}
                className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-lg p-3 flex items-center space-x-3 hover:bg-gray-800/50 hover:border-blue-500/30 transition-all duration-300 group"
              >
                <img
                  src={request.avatar}
                  alt={request.name}
                  className="h-9 w-9 rounded-full bg-gray-700 ring-1 ring-gray-700/50 group-hover:ring-blue-500/50 transition-all duration-300 object-cover"
                />
                <div className="flex-1 min-w-0">
                  <Link 
                    to={`/profile/${request.username}`}
                    className="text-sm font-medium text-white hover:text-blue-400 truncate block transition-colors duration-300"
                  >
                    {request.name}
                  </Link>
                  <p className="text-xs text-gray-400 truncate">@{request.username}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {/* TODO: Implement accept request */}}
                    className="px-3 py-1 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-500 transition-all duration-300 hover:shadow-md hover:shadow-blue-500/20 font-medium"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => {/* TODO: Implement decline request */}}
                    className="px-3 py-1 bg-gray-700/50 text-gray-300 text-xs rounded-md hover:bg-gray-600/50 transition-all duration-300 font-medium"
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sent Requests */}
      {sentRequests.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-300 mb-2 px-1">Sent Requests</h3>
          <div className="space-y-2">
            {sentRequests.map((request) => (
              <div
                key={request.id}
                className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-lg p-3 flex items-center space-x-3 hover:bg-gray-800/50 hover:border-blue-500/30 transition-all duration-300 group"
              >
                <img
                  src={request.avatar}
                  alt={request.name}
                  className="h-9 w-9 rounded-full bg-gray-700 ring-1 ring-gray-700/50 group-hover:ring-blue-500/50 transition-all duration-300 object-cover"
                />
                <div className="flex-1 min-w-0">
                  <Link 
                    to={`/profile/${request.username}`}
                    className="text-sm font-medium text-white hover:text-blue-400 truncate block transition-colors duration-300"
                  >
                    {request.name}
                  </Link>
                  <p className="text-xs text-gray-400 truncate">@{request.username}</p>
                </div>
                <button
                  onClick={() => {/* TODO: Implement cancel request */}}
                  className="px-3 py-1 bg-gray-700 text-gray-300 text-sm rounded-md hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

FriendRequests.propTypes = {
  requests: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      username: PropTypes.string.isRequired,
      avatar: PropTypes.string.isRequired,
      type: PropTypes.oneOf(['received', 'sent']).isRequired,
    })
  ).isRequired,
};

export default FriendRequests;
