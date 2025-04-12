import React, { useState } from 'react';
import { useLocation, Routes, Route } from 'react-router-dom';
import MainSidebar from '../components/MainSidebar';
import PostsSidebar from '../components/posts/PostsSidebar';
import CreatePost from '../components/posts/CreatePost';
import PostCard from '../components/posts/PostCard';
import Communities from '../components/posts/Communities';
import CommunityPage from '../components/posts/CommunityPage';

const PostsPage = () => {
  const location = useLocation();
  const [showCreatePost, setShowCreatePost] = useState(false);

  // Mock data for different types of posts
  const allPosts = [
    {
      id: 1,
      user: {
        name: 'John Doe',
        avatar: 'https://i.pravatar.cc/150?img=1'
      },
      content: 'Just watched Inception for the 5th time. Still mind-blowing! What\'s your favorite Nolan movie?',
      movie: {
        title: 'Inception',
        poster: 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
        year: 2010
      },
      likes: 42,
      comments: 8,
      timestamp: '2h ago',
      isLiked: true,
      isSaved: true
    },
    {
      id: 2,
      user: {
        name: 'Jane Smith',
        avatar: 'https://i.pravatar.cc/150?img=2'
      },
      content: 'The cinematography in Blade Runner 2049 is absolutely stunning. Every frame is a work of art!',
      movie: {
        title: 'Blade Runner 2049',
        poster: 'https://image.tmdb.org/t/p/w500/gajva2L0rPYkSSJ1FgGg3T6QoM.jpg',
        year: 2017
      },
      likes: 35,
      comments: 5,
      timestamp: '4h ago',
      isLiked: false,
      isSaved: true
    },
    {
      id: 3,
      user: {
        name: 'John Doe',
        avatar: 'https://i.pravatar.cc/150?img=1'
      },
      content: 'Just finished watching The Dark Knight. Heath Ledger\'s Joker is still the best villain performance ever!',
      movie: {
        title: 'The Dark Knight',
        poster: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
        year: 2008
      },
      likes: 28,
      comments: 3,
      timestamp: '6h ago',
      isLiked: true,
      isSaved: false
    },
    {
      id: 4,
      user: {
        name: 'Mike Johnson',
        avatar: 'https://i.pravatar.cc/150?img=3'
      },
      content: 'Interstellar\'s soundtrack and visuals are out of this world! The docking scene gives me chills every time.',
      movie: {
        title: 'Interstellar',
        poster: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
        year: 2014
      },
      likes: 56,
      comments: 12,
      timestamp: '8h ago',
      isLiked: false,
      isSaved: false
    }
  ];

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
        return allPosts.filter(post => post.user.name === 'John Doe');
      case '/posts/liked':
        return allPosts.filter(post => post.isLiked);
      case '/posts/saved':
        return allPosts.filter(post => post.isSaved);
      default:
        return allPosts;
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
          {filterPosts().map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#08369a] to-[#000000]">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-12 gap-8">
          {/* Main Sidebar */}
          <div className="col-span-12 md:col-span-2">
            <MainSidebar />
          </div>

          {/* Posts Content */}
          <div className="col-span-12 md:col-span-7 mx-auto">
            {renderContent()}
          </div>

          {/* Posts Sidebar */}
          <div className="col-span-12 md:col-span-3">
            <PostsSidebar />
          </div>
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