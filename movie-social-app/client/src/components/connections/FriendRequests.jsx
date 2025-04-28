import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useUser } from '@clerk/clerk-react';
import PropTypes from 'prop-types';

const FriendRequests = ({ onFriendRequestAccepted }) => {
  const { user } = useUser();
  const [friendRequests, setFriendRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFriendRequests = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        // Using the correct API endpoint path that matches the backend route
        const response = await axios.get(`/api/friend-requests/pending/${user.id}`);
        console.log('Friend requests data:', response.data);
        setFriendRequests(response.data);
      } catch (error) {
        console.error('Error fetching friend requests:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFriendRequests();
  }, [user]);

  const handleAccept = async (requestId) => {
    try {
      await axios.post('/api/friend-requests/accept', { requestId });
      setFriendRequests(friendRequests.filter(request => request._id !== requestId));
      alert('Friend request accepted!');
      
      // Call the callback to refresh friends list in parent component
      if (onFriendRequestAccepted) {
        onFriendRequestAccepted();
      }
    } catch (error) {
      console.error('Error accepting friend request:', error);
      alert('Failed to accept friend request.');
    }
  };

  const handleDecline = async (requestId) => {
    try {
      await axios.post('/api/friend-requests/decline', { requestId });
      setFriendRequests(friendRequests.filter(request => request._id !== requestId));
      alert('Friend request declined!');
    } catch (error) {
      console.error('Error declining friend request:', error);
      alert('Failed to decline friend request.');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-6 bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-lg">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-8 bg-gray-700 rounded-full mb-3"></div>
          <div className="h-4 bg-gray-700 rounded w-24 mb-2"></div>
          <div className="h-3 bg-gray-700 rounded w-32"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium text-gray-200">Friend Requests</h2>
      {friendRequests.length > 0 ? (
        <div className="space-y-3">
          {friendRequests.map((request) => (
            <div
              key={request._id}
              className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-lg p-3 flex items-center space-x-3 hover:bg-gray-800/50 hover:border-blue-500/30 transition-all duration-300 group"
            >
              <img
                src={request.sender.profilePicture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${request.sender.firstName}`}
                alt={request.sender.firstName}
                className="h-9 w-9 rounded-full bg-gray-700 ring-1 ring-gray-700/50 group-hover:ring-blue-500/50 transition-all duration-300 object-cover"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {request.sender.firstName} {request.sender.lastName}
                </p>
                <p className="text-xs text-gray-400 truncate">@{request.sender.clerkId}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleAccept(request._id)}
                  className="px-3 py-1 bg-green-600 text-white text-xs rounded-md hover:bg-green-500 transition-all duration-300 hover:shadow-md hover:shadow-green-500/20 font-medium"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleDecline(request._id)}
                  className="px-3 py-1 bg-red-600 text-white text-xs rounded-md hover:bg-red-500 transition-all duration-300 hover:shadow-md hover:shadow-red-500/20 font-medium"
                >
                  Decline
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-lg">
          <p className="text-gray-400 text-sm">No pending friend requests</p>
        </div>
      )}
    </div>
  );
};

FriendRequests.propTypes = {
  onFriendRequestAccepted: PropTypes.func
};

export default FriendRequests;
