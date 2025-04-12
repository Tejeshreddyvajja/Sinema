import React from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';

const MainSidebar = () => {
  const { user } = useUser();
  const userProfileImage = user?.imageUrl || 'https://i.pravatar.cc/300?img=11';
  const userName = user?.fullName || 'User';

  return (
    <div className="fixed left-0 top-0 h-screen w-16 bg-gray-800/30 flex flex-col items-center py-4 rounded-r-xl">
      {/* Logo */}
      <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center text-white mb-6 shadow-lg">
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.5 0h-17A1.5 1.5 0 000 1.5v21A1.5 1.5 0 001.5 24h17a1.5 1.5 0 001.5-1.5v-21A1.5 1.5 0 0018.5 0zM12 2.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm0 17a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" />
        </svg>
      </div>
      <div className="w-8 h-0.5 bg-gray-800 my-2"></div>

      {/* Server icons */}
      <div className="flex flex-col gap-4">
        <Link 
          to="/home" 
          className="group relative flex items-center justify-center"
        >
          <div className="absolute left-0 w-1 h-8 bg-indigo-500 rounded-r-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 group-hover:from-blue-600 group-hover:to-indigo-700 transition-colors flex items-center justify-center text-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
        </Link>

        <Link 
          to="/movies" 
          className="group relative flex items-center justify-center"
        >
          <div className="absolute left-0 w-1 h-8 bg-indigo-500 rounded-r-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 group-hover:from-purple-600 group-hover:to-pink-700 transition-colors flex items-center justify-center text-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h18M3 16h18" />
            </svg>
          </div>
        </Link>

        <Link 
          to="/settings" 
          className="group relative flex items-center justify-center"
        >
          <div className="absolute left-0 w-1 h-8 bg-indigo-500 rounded-r-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-600 group-hover:from-yellow-600 group-hover:to-orange-700 transition-colors flex items-center justify-center text-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
        </Link>
        <Link 
          to="/messages" 
          className="group relative flex items-center justify-center"
        >
          <div className="absolute left-0 w-1 h-8 bg-indigo-500 rounded-r-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 group-hover:from-blue-600 group-hover:to-indigo-700 transition-colors flex items-center justify-center text-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
        </Link>
      

        {/* Profile Section */}
        <div className="mt-auto">
          <Link 
            to="/profile" 
            className="group relative flex items-center justify-center"
          >
            <div className="absolute left-0 w-1 h-8 bg-indigo-500 rounded-r-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-gradient-to-br from-green-500 to-teal-600 group-hover:from-green-600 group-hover:to-teal-700 transition-colors">
              <img 
                src={userProfileImage} 
                alt={userName}
                className="w-full h-full object-cover"
              />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MainSidebar; 