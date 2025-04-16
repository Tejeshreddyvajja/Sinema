import React, { useState, useEffect } from 'react';
import { useLocation, Routes, Route, Link } from 'react-router-dom';
import MainSidebar from '../components/MainSidebar';
import PostsSidebar from '../components/posts/PostsSidebar';
import CreatePost from '../components/posts/CreatePost';
import PostCard from '../components/posts/PostCard';
import Communities from '../components/posts/Communities';
import CommunityPage from '../components/posts/CommunityPage';
import NotificationsPanel from '../components/posts/NotificationsPanel';
import { FaSearch, FaFilter, FaBars, FaTimes, FaBell, FaHome, FaUser, FaHeart, FaBookmark, FaUsers, FaArrowUp } from 'react-icons/fa';
import MobileHeader from '../components/layout/MobileHeader';
import DesktopHeader from '../components/layout/DesktopHeader';

const MOCK_POSTS = [
  {
    id: '1',
    user: {
      id: 'user1',
      name: 'John Doe',
      avatar: 'https://i.pravatar.cc/150?img=1',
    },
    content: 'Just watched Inception for the 5th time. The visual effects still blow my mind! 🎬 #Inception #MovieNight',
    timestamp: '2h ago',
    likes: 42,
    isLiked: false,
    isSaved: false,
    media: [
      {
        type: 'image',
        url: 'https://source.unsplash.com/random/800x600?movie',
        description: 'Movie scene screenshot'
      }
    ],
    movie: {
      id: 'movie1',
      title: 'Inception',
      year: '2010',
      poster: 'https://source.unsplash.com/random/300x450?movie-poster',
      rating: 8.8
    },
    shares: 12,
    reposts: 5
  },
  {
    id: '2',
    user: {
      id: 'user2',
      name: 'Jane Smith',
      avatar: 'https://i.pravatar.cc/150?img=2',
    },
    content: 'The cinematography in Blade Runner 2049 is absolutely stunning. Every frame is a work of art!',
    timestamp: '4h ago',
    likes: 35,
    isLiked: false,
    isSaved: true,
    media: [
      {
        type: 'image',
        url: 'https://source.unsplash.com/random/800x600?blade-runner',
        description: 'Blade Runner scene'
      }
    ],
    movie: {
      id: 'movie2',
      title: 'Blade Runner 2049',
      year: '2017',
      poster: 'https://image.tmdb.org/t/p/w500/gajva2L0rPYkSSJ1FgGg3T6QoM.jpg',
      rating: 8.0
    },
    shares: 8,
    reposts: 3
  }
];

const PostsPage = () => {
  const location = useLocation();
  const [posts, setPosts] = useState(MOCK_POSTS);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [sortBy, setSortBy] = useState('recent');
  const [selectedTags, setSelectedTags] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      const sidebar = document.getElementById('mobile-sidebar');
      const hamburger = document.getElementById('hamburger-button');
      
      if (sidebar && 
          hamburger && 
          !sidebar.contains(event.target) && 
          !hamburger.contains(event.target) &&
          sidebarOpen) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [sidebarOpen]);

  // Lock body scroll when sidebar is open on mobile
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [sidebarOpen]);

  // Close notifications when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const notificationsPanel = document.getElementById('notifications-panel');
      const notificationsButton = document.getElementById('notifications-button');
      
      if (notificationsPanel && 
          notificationsButton && 
          !notificationsPanel.contains(event.target) && 
          !notificationsButton.contains(event.target) &&
          showNotifications) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications]);

  // Show/hide back to top button based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleLike = (postId) => {
    setPosts(prevPosts => prevPosts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1,
          isLiked: !post.isLiked
        };
      }
      return post;
    }));
  };

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/posts/my':
        return 'My Posts';
      case '/posts/liked':
        return 'Liked Posts';
      case '/posts/saved':
        return 'Saved Posts';
      case '/posts/communities':
        return 'Communities';
      default:
        return 'All Posts';
    }
  };

  const getPageDescription = () => {
    switch (location.pathname) {
      case '/posts/my':
        return 'View and manage your movie discussions';
      case '/posts/liked':
        return 'Your favorite movie discussions';
      case '/posts/saved':
        return 'Your bookmarked movie discussions';
      case '/posts/communities':
        return 'Join movie communities and discuss with like-minded fans';
      default:
        return 'Discover and share your thoughts about movies';
    }
  };

  const filterPosts = () => {
    switch (location.pathname) {
      case '/posts/my':
        return posts.filter(post => post.user.id === 'user1');
      case '/posts/liked':
        return posts.filter(post => post.isLiked);
      case '/posts/saved':
        return posts.filter(post => post.isSaved);
      default:
        return posts;
    }
  };

  // Filter and sort posts
  const getFilteredPosts = () => {
    let filtered = filterPosts();

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(post => 
        post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.user.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply tag filters
    if (selectedTags.length > 0) {
      filtered = filtered.filter(post => 
        post.tags?.some(tag => selectedTags.includes(tag))
      );
    }

    // Apply sorting
    switch (sortBy) {
      case 'popular':
        return filtered.sort((a, b) => b.likes - a.likes);
      case 'recent':
        return filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      default:
        return filtered;
    }
  };

  const renderContent = () => {
    if (location.pathname.startsWith('/posts/community/')) {
      return <CommunityPage />;
    }

    if (location.pathname === '/posts/communities') {
      return <Communities />;
    }

    return (
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 shadow-lg mb-4 max-w-xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-xl font-bold text-white">{getPageTitle()}</h1>
            <p className="text-gray-400">{getPageDescription()}</p>
          </div>
          <button
            onClick={() => setShowCreatePost(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Create Post</span>
          </button>
        </div>

        {/* Posts List */}
        <div className="space-y-6">
          {getFilteredPosts().map((post) => (
            <PostCard key={post.id} post={post} onLike={() => handleLike(post.id)} />
          ))}
        </div>
      </div>
    );
  };

  const headerNavItems = [
    { path: '/posts', icon: <FaHome className="w-5 h-5" />, label: 'All Posts' },
    { path: '/posts/my', icon: <FaUser className="w-5 h-5" />, label: 'My Posts' },
    { path: '/posts/liked', icon: <FaHeart className="w-5 h-5" />, label: 'Liked' },
    { path: '/posts/saved', icon: <FaBookmark className="w-5 h-5" />, label: 'Saved' },
    { path: '/posts/communities', icon: <FaUsers className="w-5 h-5" />, label: 'Communities' },
  ];

  const mobileNavItems = [
    { path: '/posts', icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z', label: 'All Posts' },
    { path: '/posts/liked', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z', label: 'Liked' },
    { path: '/posts/saved', icon: 'M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z', label: 'Saved' },
    { path: '/posts/communities', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z', label: 'Communities' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#08369a] to-[#000000] pb-16 md:pb-0 relative">
      {/* Mobile Header - Only visible on smaller screens */}
      <MobileHeader 
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        showNotifications={showNotifications}
        setShowNotifications={setShowNotifications}
        setShowCreatePost={setShowCreatePost}
      />
      
      {/* Desktop Header - Only visible on larger screens */}
      <DesktopHeader 
        showNotifications={showNotifications}
        setShowNotifications={setShowNotifications}
        setShowCreatePost={setShowCreatePost}
      />
      
      {/* Main background - ensures gradient covers the entire page */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#08369a] to-[#000000] -z-10"></div>
      
      {/* Mobile Sidebar Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300 ${
          sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setSidebarOpen(false)}
      ></div>

      {/* Mobile Sidebar */}
      <div 
        id="mobile-sidebar"
        className={`fixed top-0 left-0 h-full w-64 bg-gray-900/95 backdrop-blur-lg z-50 transform transition-transform duration-300 ease-in-out shadow-xl md:hidden ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 border-b border-gray-800">
          <h2 className="text-xl font-bold text-white">Movie Social</h2>
        </div>
        <div className="py-4 px-2">
          <MainSidebar inMobileSidebar={true} />
        </div>
      </div>
      
      {/* Floating Notifications Panel */}
      {showNotifications && (
        <div 
          id="notifications-panel"
          className="absolute right-4 top-16 z-50 max-w-xs w-full transform transition-all duration-300"
        >
          <NotificationsPanel />
        </div>
      )}

      <div className="container mx-auto px-4 mt-6">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Main Sidebar - Hidden on mobile, shown on md and up - Left side */}
          <div className="hidden md:block flex-shrink-0 sticky top-24 self-start w-1/6">
            <MainSidebar />
          </div>

          {/* Content Area - Center */}
          <div className="flex-1">
            {/* Content grid - Changed to just a single column for simplicity */}
            <div className="grid grid-cols-1 gap-6">
              {/* Filters and Search - Added top margin */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 shadow-lg max-w-xl mx-auto mt-4">
                <div className="flex flex-wrap gap-3 items-center justify-between">
                  <div className="flex-1 min-w-[180px]">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search posts..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-gray-700/50 text-white px-3 py-2 pl-9 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all text-sm"
                      />
                      <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="bg-gray-700/50 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all text-sm"
                    >
                      <option value="recent">Most Recent</option>
                      <option value="popular">Most Popular</option>
                    </select>
                    <button className="bg-gray-700/50 p-2 rounded-lg hover:bg-gray-700 transition-colors">
                      <FaFilter className="text-white text-sm" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="max-w-xl mx-auto">
                {renderContent()}
              </div>
            </div>
          </div>
          
          {/* Posts Sidebar and Notifications - Right side */}
          <div className="hidden md:block flex-shrink-0 sticky top-24 self-start w-1/4">
            <PostsSidebar />
          </div>
        </div>
      </div>

      {/* Back to top button */}
      {showBackToTop && (
        <button 
          onClick={scrollToTop}
          className="fixed bottom-24 right-6 md:bottom-6 md:right-6 bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 z-30"
          aria-label="Back to top"
        >
          <FaArrowUp />
        </button>
      )}

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-lg md:hidden shadow-lg border-t border-gray-800 z-30">
        <div className="flex justify-around items-center py-3">
          {mobileNavItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center px-3 py-1 rounded-lg ${
                location.pathname === item.path 
                  ? 'text-indigo-400' 
                  : 'text-gray-400 hover:text-white'
              } transition-colors`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
              </svg>
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Create Post Modal */}
      {showCreatePost && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800/90 rounded-xl p-6 w-full max-w-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">Create New Post</h2>
              <button
                onClick={() => setShowCreatePost(false)}
                className="text-gray-400 hover:text-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <CreatePost onClose={() => setShowCreatePost(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default PostsPage;