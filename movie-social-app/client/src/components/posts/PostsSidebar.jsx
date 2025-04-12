import React from 'react';
import { NavLink } from 'react-router-dom';
import NotificationsPanel from './NotificationsPanel';
import { FaHome, FaUser, FaHeart, FaBookmark, FaUsers } from 'react-icons/fa';

const PostsSidebar = () => {
  return (
    <div className="flex flex-col">
      <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-4 shadow-lg max-w-xs">
        <h2 className="text-lg font-semibold text-white mb-4">Posts</h2>
        <nav className="space-y-2">
          <NavLink
            to="/posts"
            className={({ isActive }) => 
              `flex items-center space-x-2 p-2 rounded-lg transition-colors ${
                isActive 
                  ? 'bg-indigo-600 text-white' 
                  : 'text-gray-300 hover:bg-gray-700'
              }`
            }
          >
            <FaHome className="w-5 h-5" />
            <span>All Posts</span>
          </NavLink>

          <NavLink
            to="/posts/my"
            className={({ isActive }) => 
              `flex items-center space-x-2 p-2 rounded-lg transition-colors ${
                isActive 
                  ? 'bg-indigo-600 text-white' 
                  : 'text-gray-300 hover:bg-gray-700'
              }`
            }
          >
            <FaUser className="w-5 h-5" />
            <span>My Posts</span>
          </NavLink>

          <NavLink
            to="/posts/liked"
            className={({ isActive }) => 
              `flex items-center space-x-2 p-2 rounded-lg transition-colors ${
                isActive 
                  ? 'bg-indigo-600 text-white' 
                  : 'text-gray-300 hover:bg-gray-700'
              }`
            }
          >
            <FaHeart className="w-5 h-5" />
            <span>Liked Posts</span>
          </NavLink>

          <NavLink
            to="/posts/saved"
            className={({ isActive }) => 
              `flex items-center space-x-2 p-2 rounded-lg transition-colors ${
                isActive 
                  ? 'bg-indigo-600 text-white' 
                  : 'text-gray-300 hover:bg-gray-700'
              }`
            }
          >
            <FaBookmark className="w-5 h-5" />
            <span>Saved Posts</span>
          </NavLink>

          <NavLink
            to="/posts/communities"
            className={({ isActive }) =>
              `flex items-center space-x-2 p-2 rounded-lg transition-colors ${
                isActive
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-300 hover:bg-gray-700'
              }`
            }
          >
            <FaUsers className="w-5 h-5" />
            <span>Communities</span>
          </NavLink>
        </nav>
      </div>
      <NotificationsPanel />
    </div>
  );
};

export default PostsSidebar; 