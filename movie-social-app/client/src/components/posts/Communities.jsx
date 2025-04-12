import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';

const Communities = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data for communities
  const communities = [
    {
      id: 1,
      name: 'Nolan Fans',
      description: 'Discuss Christopher Nolan\'s films and theories',
      members: 12500,
      icon: '🎬',
      isJoined: true
    },
    {
      id: 2,
      name: 'Marvel Cinematic Universe',
      description: 'All things MCU - theories, reviews, and discussions',
      members: 45000,
      icon: '🦸',
      isJoined: true
    },
    {
      id: 3,
      name: 'Classic Cinema',
      description: 'Appreciating the golden age of Hollywood',
      members: 8500,
      icon: '🎥',
      isJoined: false
    },
    {
      id: 4,
      name: 'Anime Movies',
      description: 'Discussing Studio Ghibli and other anime films',
      members: 12000,
      icon: '🎨',
      isJoined: false
    },
    {
      id: 5,
      name: 'Horror Movies',
      description: 'For fans of horror and thriller films',
      members: 15000,
      icon: '👻',
      isJoined: true
    }
  ];

  const filteredCommunities = communities.filter(community =>
    community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    community.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Communities</h2>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm">
          Create Community
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Search communities..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-gray-700/50 text-white px-4 py-2 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>

      {/* Communities List */}
      <div className="space-y-4">
        {filteredCommunities.map((community) => (
          <Link 
            to={`/posts/community/${community.id}`}
            key={community.id}
            className="block p-4 bg-gray-700/50 rounded-lg hover:bg-gray-700/70 transition-colors"
          >
            <div className="flex items-center space-x-4">
              <div className="text-2xl">{community.icon}</div>
              <div className="flex-1">
                <h3 className="text-white font-semibold">{community.name}</h3>
                <p className="text-gray-400 text-sm">{community.description}</p>
                <div className="flex items-center mt-2 text-sm text-gray-400">
                  <span>{community.members.toLocaleString()} members</span>
                  {community.isJoined && (
                    <span className="ml-2 px-2 py-1 bg-indigo-600/20 text-indigo-400 rounded-full text-xs">
                      Joined
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Communities; 