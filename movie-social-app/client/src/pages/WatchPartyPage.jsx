import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import WatchPartyPlayer from '../components/watchparty/WatchPartyPlayer';
import WatchPartyChat from '../components/watchparty/WatchPartyChat';

const WATCH_PARTY_ENABLED = false;

const WatchPartyPage = () => {
  if (!WATCH_PARTY_ENABLED) {
    return (
      <div className="text-center mt-10">
        <h1 className="text-2xl font-bold text-gray-700">Watch Party is currently disabled.</h1>
      </div>
    );
  }

  const { partyId } = useParams();
  const navigate = useNavigate();
  const [isJoined, setIsJoined] = useState(false);
  const [partyKey, setPartyKey] = useState('');
  const [error, setError] = useState('');

  // Mock data - replace with actual data from backend
  const mockPartyData = {
    videoUrl: 'https://example.com/sample-video.mp4',
    hostName: 'John Doe',
    currentUsers: ['John Doe', 'Jane Smith'],
  };

  const handleJoinParty = (e) => {
    e.preventDefault();
    // TODO: Verify party key with backend
    if (partyKey === '1234') { // Mock verification
      setIsJoined(true);
      setError('');
    } else {
      setError('Invalid party key');
    }
  };

  if (!isJoined) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-gray-800 p-8 rounded-lg max-w-md w-full">
          <h2 className="text-2xl font-bold text-white mb-6">Join Watch Party</h2>
          <form onSubmit={handleJoinParty} className="space-y-4">
            <div>
              <label className="block text-gray-300 mb-2">Party ID</label>
              <input
                type="text"
                value={partyId}
                disabled
                className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-2">Party Key</label>
              <input
                type="text"
                value={partyKey}
                onChange={(e) => setPartyKey(e.target.value)}
                placeholder="Enter party key"
                className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            >
              Join Party
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">Watch Party</h1>
          <button
            onClick={() => navigate('/')}
            className="text-gray-400 hover:text-white"
          >
            Exit Party
          </button>
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[calc(100vh-8rem)]">
          {/* Video player */}
          <div className="lg:col-span-2">
            <WatchPartyPlayer
              videoUrl={mockPartyData.videoUrl}
              isHost={mockPartyData.hostName === 'John Doe'} // Replace with actual user check
            />
          </div>

          {/* Chat */}
          <div className="h-full">
            <WatchPartyChat userName="John Doe" /> {/* Replace with actual user name */}
          </div>
        </div>

        {/* Party info */}
        <div className="mt-4 bg-gray-800 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-2">Party Information</h3>
          <div className="text-gray-400">
            <p>Host: {mockPartyData.hostName}</p>
            <p>Viewers: {mockPartyData.currentUsers.length}</p>
            <p>Party ID: {partyId}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WatchPartyPage;
