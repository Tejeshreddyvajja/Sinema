import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBars, FaBell, FaTimes } from 'react-icons/fa';

const MobileHeader = ({ 
  sidebarOpen, 
  setSidebarOpen, 
  showNotifications, 
  setShowNotifications,
  setShowCreatePost 
}) => {
  const location = useLocation();
  
  return (
    <div className="bg-gray-900/90 backdrop-blur-md sticky top-0 z-40 border-b border-gray-800 shadow-lg md:hidden">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Left - Hamburger menu */}
          <button 
            id="hamburger-button"
            onClick={() => setSidebarOpen(!sidebarOpen)} 
            className="p-2 rounded-lg bg-gray-800/60 text-white hover:bg-gray-700 transition-colors"
          >
            {sidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
          
          {/* Center - Page Title */}
          <h1 className="text-lg font-bold text-white">
            {location.pathname === '/posts' && 'All Posts'}
            {location.pathname === '/posts/my' && 'My Posts'}
            {location.pathname === '/posts/liked' && 'Liked Posts'}
            {location.pathname === '/posts/saved' && 'Saved Posts'}
            {location.pathname === '/posts/communities' && 'Communities'}
          </h1>
          
          {/* Right - Actions */}
          <div className="flex items-center space-x-2">
            <button
              id="notifications-button"
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors relative"
              title="Notifications"
            >
              <FaBell className="w-5 h-5" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            
            <button
              onClick={() => setShowCreatePost(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-colors"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="text-sm">Post</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileHeader;
