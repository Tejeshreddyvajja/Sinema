import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import axios from 'axios';
import FriendsList from '../components/connections/FriendsList';
import FriendRequests from '../components/connections/FriendRequests';
import UserSearch from '../components/connections/UserSearch';
import MainSidebar from '../components/MainSidebar';

const ConnectionsPage = () => {
  const { user } = useUser();
  const [searchParams] = useSearchParams();
  const tabFromUrl = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(tabFromUrl || 'friends');
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiStatus, setApiStatus] = useState(null);

  useEffect(() => {
    if (tabFromUrl) {
      setActiveTab(tabFromUrl);
    }
  }, [tabFromUrl]);
  
  // Test API connection
  useEffect(() => {
    const testApiConnection = async () => {
      try {
        const response = await axios.get('/api/friend-requests/test');
        console.log('API test response:', response.data);
        setApiStatus('API connection successful');
      } catch (error) {
        console.error('API test error:', error);
        setApiStatus(`API connection failed: ${error.message}`);
      }
    };
    
    testApiConnection();
  }, []);

  // Function to fetch friends - extracted for reuse
  const fetchFriends = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    
    try {
      console.log(`Attempting to fetch friends for user: ${user.id}`);
      // Using the correct API endpoint that matches the backend route
      const response = await axios.get(`/api/friend-requests/friends/${user.id}`);
      console.log('Friends data response:', response.data);
      setFriends(response.data);
    } catch (error) {
      console.error('Error fetching friends:', error);
      console.error('Error details:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        responseData: error.response?.data
      });
      setFriends([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch friends when user is available
  useEffect(() => {
    fetchFriends();
  }, [user?.id]);
  
  // Handler for friend request acceptance
  const handleFriendRequestAccepted = () => {
    console.log('Friend request accepted - refreshing friends list');
    fetchFriends();
  };

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
            {apiStatus && <p className="text-xs mt-2 text-blue-300">{apiStatus}</p>}
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
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 space-y-6">
            {activeTab === 'friends' && (
              <FriendsList friends={friends} loading={loading} />
            )}
            {activeTab === 'requests' && (
              <FriendRequests onFriendRequestAccepted={handleFriendRequestAccepted} />
            )}
            {activeTab === 'find' && (
              <UserSearch onFriendRequestSent={() => setActiveTab('requests')} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectionsPage;