import React, { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import FriendsList from '../components/connections/FriendsList';
import FriendRequests from '../components/connections/FriendRequests';
import UserSearch from '../components/connections/UserSearch';
import MainSidebar from '../components/MainSidebar';

const ConnectionsPage = () => {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState('friends');

  // Mock data - replace with actual data from backend
  const mockFriends = [
    { id: 1, name: 'John Doe', username: 'johndoe', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John' },
    { id: 2, name: 'Jane Smith', username: 'janesmith', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane' },
  ];

  const mockRequests = [
    { id: 3, name: 'Alice Johnson', username: 'alicej', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice', type: 'received' },
    { id: 4, name: 'Bob Wilson', username: 'bobw', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob', type: 'sent' },
  ];

  const tabs = [
    { id: 'friends', label: 'Friends' },
    { id: 'requests', label: 'Friend Requests' },
    { id: 'find', label: 'Find Friends' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#08369a] to-[#000000] text-white">
      <MainSidebar />
      <div className="ml-16 pt-24 pb-8">
        <div className="max-w-2xl mx-auto px-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Connections</h1>
          <p className="text-gray-400">Manage your friends and connections</p>
        </div>

        {/* Tabs */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-1 mb-8 max-w-lg mx-auto">
          <nav className="flex justify-center space-x-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-1 relative font-medium text-sm transition-all rounded-lg ${
                  activeTab === tab.id
                    ? 'text-white bg-blue-600 shadow-lg shadow-blue-500/20'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                {tab.label}
                {tab.id === 'requests' && mockRequests.filter(r => r.type === 'received').length > 0 && (
                  <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {mockRequests.filter(r => r.type === 'received').length}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 space-y-6">
          {activeTab === 'friends' && (
            <FriendsList friends={mockFriends} />
          )}
          {activeTab === 'requests' && (
            <FriendRequests requests={mockRequests} />
          )}
          {activeTab === 'find' && (
            <UserSearch currentUser={user} />
          )}
        </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectionsPage;
