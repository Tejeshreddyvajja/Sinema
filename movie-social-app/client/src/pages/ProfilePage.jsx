import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';

const ProfilePage = () => {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState('activity');
  const [sinemaProfilePic, setSinemaProfilePic] = useState(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  
  // Sample data - would be fetched from backend in a real implementation
  const stats = {
    moviesWatched: 42,
    reviews: 15,
    friends: 24,
    watchlist: 8
  };

  // Placeholder data for tabs - would be fetched from backend
  const watchlist = [
    { id: 1, title: 'Inception', year: 2010, posterPath: '/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg' },
    { id: 2, title: 'The Shawshank Redemption', year: 1994, posterPath: '/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg' },
    { id: 3, title: 'The Dark Knight', year: 2008, posterPath: '/qJ2tW6WMUDux911r6m7haRef0WH.jpg' },
  ];

  const reviews = [
    { id: 1, movieTitle: 'Dune', rating: 4.5, content: 'A visual masterpiece with incredible world-building.', date: '2023-12-10' },
    { id: 2, movieTitle: 'Oppenheimer', rating: 5, content: 'One of Nolan\'s best works. Cillian Murphy delivers a career-defining performance.', date: '2023-11-05' },
  ];

  const activity = [
    { id: 1, type: 'watched', movieTitle: 'Barbie', date: '2024-01-15' },
    { id: 2, type: 'review', movieTitle: 'Oppenheimer', rating: 5, date: '2023-11-05' },
    { id: 3, type: 'watchlist', movieTitle: 'Poor Things', date: '2024-01-03' },
  ];

  const friends = [
    { id: 1, name: 'Alex Johnson', username: 'alexj', avatarUrl: 'https://i.pravatar.cc/150?img=1' },
    { id: 2, name: 'Maya Patel', username: 'mayap', avatarUrl: 'https://i.pravatar.cc/150?img=5' },
    { id: 3, name: 'Chris Wong', username: 'chrisw', avatarUrl: 'https://i.pravatar.cc/150?img=8' },
  ];
  const communities= [
    { id: 1, name: 'Film Buffs', description: 'A community for film enthusiasts to discuss and share their love for cinema.' },
    { id: 2, name: 'Movie Night', description: 'A group for movie lovers to plan and attend movie nights together.' },  
    { id: 3, name: 'Indie Films', description: 'A community dedicated to independent films and filmmakers.' },
    

  ];
  
  // Get image URL from Clerk or use a default avatar
  const clerkProfileImageUrl = user?.imageUrl || 'https://i.pravatar.cc/300?img=11';
  const profileImageUrl = sinemaProfilePic || clerkProfileImageUrl;
  
  // Get user details
  const userName = user?.fullName || 'Film Enthusiast';
  const userHandle = user?.username || '@moviebuff';

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSinemaProfilePic(reader.result);
        // Here you would typically upload the image to your backend
        // and save the URL in your database
      };
      reader.readAsDataURL(file);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#08369a] to-[#000000] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#08369a] to-[#000000] text-white">
      {/* Top Navigation */}
      <header className="py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Link to="/home" className="text-2xl font-bold text-white">Sinema</Link>
          <div className="flex items-center space-x-4">
            <Link to="/settings" className="text-gray-300 hover:text-white transition-colors">
              Settings
            </Link>
            <Link to="/movies" className="text-gray-300 hover:text-white transition-colors">
              Movies
            </Link>
            <Link to="/home" className="text-gray-300 hover:text-white transition-colors">
              Home
            </Link>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 mb-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* Profile Image */}
            <div className="relative group">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-indigo-600 shadow-lg">
                <img 
                  src={profileImageUrl} 
                  alt={`${userName}'s profile`} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute bottom-0 right-0 bg-green-500 w-5 h-5 rounded-full border-2 border-black"></div>
              
              {/* Edit Profile Picture Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <label className="cursor-pointer p-2 bg-white bg-opacity-20 rounded-full">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePicChange}
                    className="hidden"
                  />
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </label>
              </div>
            </div>
            
            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold mb-1">{userName}</h1>
              <p className="text-gray-400 mb-4">{userHandle}</p>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-3">
                <div className="text-center">
                  <p className="text-xl font-bold">{stats.moviesWatched}</p>
                  <p className="text-xs text-gray-400">Watched</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold">{stats.reviews}</p>
                  <p className="text-xs text-gray-400">Reviews</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold">{stats.watchlist}</p>
                  <p className="text-xs text-gray-400">Watchlist</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold">{stats.friends}</p>
                  <p className="text-xs text-gray-400">Friends</p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                <button 
                  onClick={() => setIsEditingProfile(!isEditingProfile)}
                  className="px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-sm"
                >
                  {isEditingProfile ? 'Cancel' : 'Edit Profile'}
                </button>
                <Link 
                  to="/settings" 
                  className="px-3 py-1 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors text-sm"
                >
                  Account Settings
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        {/* Tabs Container */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6">
          <div className="flex space-x-3 mb-4">
            <button
              onClick={() => setActiveTab('activity')}
              className={`px-3 py-1 rounded-md transition-colors text-sm ${
                activeTab === 'activity'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Activity Feed
            </button>
            <button
              onClick={() => setActiveTab('watchlist')}
              className={`px-3 py-1 rounded-md transition-colors text-sm ${
                activeTab === 'watchlist'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Watchlist
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-3 py-1 rounded-md transition-colors text-sm ${
                activeTab === 'reviews'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Reviews
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`px-3 py-1 rounded-md transition-colors text-sm ${
                activeTab === 'stats'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Stats
            </button>
            <button
              onClick={() => setActiveTab('friends')}
              className={`px-3 py-1 rounded-md transition-colors text-sm ${
                activeTab === 'friends'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Friends
            </button>
            <button
              onClick={() => setActiveTab('communities')}
              className={`px-3 py-1 rounded-md transition-colors text-sm ${
                activeTab === 'communities'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Communities
            </button>
            

          </div>

          {/* Tab Content */}
          <div className="space-y-6">
            {activeTab === 'activity' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-white">Recent Activity</h3>
                  <div className="flex items-center space-x-2">
                    <button className="px-3 py-1 text-sm bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors">
                      Filter
                    </button>
                    <button className="px-3 py-1 text-sm bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors">
                      Sort
                    </button>
                  </div>
                </div>
                <div className="space-y-3">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="bg-gray-700/50 rounded-md p-3 hover:bg-gray-700 transition-colors">
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="text-white font-medium text-sm">Movie Title {item}</h4>
                            <span className="text-gray-400 text-xs">2 hours ago</span>
                          </div>
                          <p className="text-gray-300 text-xs mt-1">Added to watchlist</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'watchlist' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-white">Watchlist</h3>
                  <div className="flex items-center space-x-2">
                    <button className="px-3 py-1 text-sm bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors">
                      Filter
                    </button>
                    <button className="px-3 py-1 text-sm bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors">
                      Sort
                    </button>
                  </div>
                </div>
                <div className="flex flex-col space-y-2">
                  {[1, 2, 3, 4, 5].map((item) => (
                    <div key={item} className="bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors">
                      <div className="flex items-center space-x-3 p-2">
                        <div className="w-16 h-24 bg-gray-600 rounded-lg flex-shrink-0">
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-gray-400 text-xs">Poster {item}</span>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="text-white text-sm font-medium truncate">Movie Title {item}</h4>
                            <button className="p-1 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                          <p className="text-gray-400 text-xs mt-0.5 truncate">2023 • Action, Adventure</p>
                          <div className="mt-1 flex items-center space-x-3">
                            <span className="text-yellow-400 text-xs flex items-center">
                              <svg className="w-3 h-3 mr-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                              8.5
                            </span>
                            <span className="text-gray-400 text-xs">2h 30m</span>
                            <button className="text-indigo-400 text-xs hover:text-indigo-300 transition-colors">
                              View Details
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

:
{activeTab === 'activity' && (
  <div className="space-y-3">
    <div className="flex items-center justify-between">
      <h3 className="text-xl font-semibold text-white">Recent Activity</h3>
      {/* <!-- Existing filter/sort buttons --> */}
    </div>
    <div className="space-y-3">
      {activity.map((item) => (
        <div key={item.id} className="bg-gray-700/50 rounded-md p-3 hover:bg-gray-700 transition-colors">
          <div className="flex items-start space-x-3">
            {/* <!-- Replace the generic icon with activity-specific icons --> */}
            <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center">
              {item.type === 'watched' && (
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
              {item.type === 'review' && (
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              )}
              {item.type === 'watchlist' && (
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="text-white font-medium text-sm">{item.movieTitle}</h4>
                <div className="flex items-center">
                  {item.rating && (
                    <span className="text-yellow-400 mr-2 text-xs flex items-center">
                      <svg className="w-3 h-3 mr-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      {item.rating}
                    </span>
                  )}
                  <span className="text-gray-400 text-xs">{item.date}</span>
                </div>
              </div>
              <p className="text-gray-300 text-xs mt-1">
                {item.type === 'watched' && 'Watched this movie'}
                {item.type === 'review' && 'Reviewed this movie'}
                {item.type === 'watchlist' && 'Added to watchlist'}
              </p>
              {/* <!-- Add social interactions --> */}
              <div className="mt-2 flex items-center space-x-3">
                <button className="text-gray-400 hover:text-white transition-colors text-xs flex items-center">
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  Like
                </button>
                <button className="text-gray-400 hover:text-white transition-colors text-xs flex items-center">
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  Comment
                </button>
                <button className="text-gray-400 hover:text-white transition-colors text-xs flex items-center">
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
)}

            {activeTab === 'stats' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-gray-700/50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-gray-400">Total Movies Watched</h4>
                      <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </div>
                    <p className="text-2xl font-bold text-white mt-2">156</p>
                    <p className="text-gray-400 text-sm mt-1">+12 this month</p>
                  </div>
                  <div className="bg-gray-700/50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-gray-400">Average Rating</h4>
                      <svg className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                    <p className="text-2xl font-bold text-white mt-2">7.8</p>
                    <p className="text-gray-400 text-sm mt-1">Based on 45 reviews</p>
                  </div>
                  <div className="bg-gray-700/50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-gray-400">Watchlist</h4>
                      <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <p className="text-2xl font-bold text-white mt-2">42</p>
                    <p className="text-gray-400 text-sm mt-1">Movies to watch</p>
                  </div>
                  <div className="bg-gray-700/50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-gray-400">Favorite Genre</h4>
                      <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </div>
                    <p className="text-2xl font-bold text-white mt-2">Action</p>
                    <p className="text-gray-400 text-sm mt-1">35% of your movies</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-gray-700/50 rounded-lg p-4">
                    <h4 className="text-white font-medium mb-4">Monthly Activity</h4>
                    <div className="h-64 flex items-end space-x-2">
                      {Array.from({ length: 30 }, (_, i) => (
                        <div key={i} className="flex-1">
                          <div
                            className="bg-indigo-600 rounded-t"
                            style={{ height: `${Math.random() * 100}%` }}
                          ></div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-gray-700/50 rounded-lg p-4">
                    <h4 className="text-white font-medium mb-4">Genre Distribution</h4>
                    <div className="h-64 flex items-center justify-center">
                      <div className="w-48 h-48 rounded-full border-4 border-indigo-600 flex items-center justify-center">
                        <span className="text-gray-400">Pie Chart</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
          
        {/* Friends List */}
                {activeTab === 'friends' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-white">Friends ({stats.friends})</h3>
              <Link 
                to="/connections?tab=find" 
                className="px-3 py-1 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Find Friends
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {friends.map((friend) => (
                <div key={friend.id} className="bg-gray-700/50 rounded-lg p-3 flex items-center space-x-3 hover:bg-gray-700 transition-colors">
                  <img
                    src={friend.avatarUrl}
                    alt={friend.name}
                    className="h-12 w-12 rounded-full bg-gray-700 ring-1 ring-gray-700/50"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-white truncate">{friend.name}</h4>
                    <p className="text-xs text-gray-400 truncate">@{friend.username}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button className="p-1.5 text-gray-400 hover:text-blue-400 transition-all rounded-md">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </button>
                    <button className="p-1.5 text-gray-400 hover:text-blue-400 transition-all rounded-md">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* Communities List */}
                {activeTab === 'communities' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-white">Communities</h3>
              <button className="px-3 py-1 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                Discover Communities
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {communities.map((community) => (
                <div key={community.id} className="bg-gray-700/50 rounded-lg p-4 flex items-center space-x-4 hover:bg-gray-700 transition-colors">
                  <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-xl font-bold">
                    {community.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-semibold truncate">{community.name}</h4>
                    <p className="text-gray-400 text-sm truncate">{community.description}</p>
                  </div>
                  <button className="px-3 py-1 bg-gray-700 text-white text-xs rounded hover:bg-gray-600 transition-colors">
                    View
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ProfilePage;