import React from 'react';
import { Link } from 'react-router-dom';

const ServerList = () => {
  // Sample server/category icons for our movie app
  const servers = [
    { id: 'home', name: 'Home', icon: '🏠' },
    { id: 'trending', name: 'Trending', icon: '🔥' },
    { id: 'action', name: 'Action', icon: '💥' },
    { id: 'comedy', name: 'Comedy', icon: '😂' },
    { id: 'drama', name: 'Drama', icon: '🎭' },
    { id: 'scifi', name: 'Sci-Fi', icon: '🚀' },
    { id: 'horror', name: 'Horror', icon: '👻' },
    { id: 'watchparty', name: 'Watch Parties', icon: '🍿' },
  ];

  return (
    <div className="w-[72px] h-screen bg-gray-950 flex flex-col items-center py-3 overflow-y-auto">
      {/* Home button */}
      <Link 
        to="/" 
        className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center text-white hover:rounded-2xl transition-all duration-200 mb-2"
      >
        <span className="text-xl">🎬</span>
      </Link>
      
      {/* Divider line */}
      <div className="w-8 h-0.5 bg-gray-700 rounded-full my-2"></div>
      
      {/* Server/category icons */}
      <div className="flex flex-col items-center gap-3 mt-2">
        {servers.map(server => (
          <Link
            key={server.id}
            to={`/category/${server.id}`}
            className="server-icon w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center hover:rounded-2xl transition-all duration-200 hover:bg-indigo-500"
            title={server.name}
          >
            <span className="text-xl">{server.icon}</span>
          </Link>
        ))}
      </div>
      
      {/* Add new category button */}
      <div className="mt-auto">
        <button 
          className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center text-green-500 hover:rounded-2xl transition-all duration-200 hover:bg-green-500 hover:text-white"
          title="Add Category"
        >
          <span className="text-xl">+</span>
        </button>
      </div>
    </div>
  );
};

export default ServerList; 