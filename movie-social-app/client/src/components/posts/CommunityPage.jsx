import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import CreatePost from './CreatePost';
import PostCard from './PostCard';
import { FaArrowLeft, FaLock } from 'react-icons/fa';

const CommunityPage = () => {
  const { communityId } = useParams();
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [isJoined, setIsJoined] = useState(false);

  // Mock data for community posts
  const communityPosts = [
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
      content: 'The Dark Knight Rises is underrated! The Bane vs Batman fight scene is one of the best in the trilogy.',
      movie: {
        title: 'The Dark Knight Rises',
        poster: 'https://image.tmdb.org/t/p/w500/dKqa850uvbNSCaQCV4Im1XlzEtQ.jpg',
        year: 2012
      },
      likes: 35,
      comments: 5,
      timestamp: '4h ago',
      isLiked: false,
      isSaved: true
    }
  ];

  // Mock community data
  const community = {
    id: 1,
    name: 'Nolan Fans',
    description: 'Discuss Christopher Nolan\'s films and theories',
    members: 12500,
    icon: '🎬',
    rules: [
      'Be respectful to other members',
      'Keep discussions focused on Nolan\'s films',
      'No spoilers without warning',
      'Share your theories and interpretations'
    ]
  };

  const handleJoinCommunity = () => {
    setIsJoined(true);
    // In a real app, this would make an API call to join the community
  };

  return (
    <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-8">
      {/* Back Button and Community Header */}
      <div className="flex items-center space-x-4 mb-6">
        <Link
          to="/posts/communities"
          className="text-gray-400 hover:text-white transition-colors"
        >
          <FaArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex items-center space-x-4">
          <div className="text-4xl">{community.icon}</div>
          <div>
            <h1 className="text-2xl font-bold text-white">{community.name}</h1>
            <p className="text-gray-400">{community.description}</p>
            <div className="flex items-center mt-2 text-sm text-gray-400">
              <span>{community.members.toLocaleString()} members</span>
              {!isJoined && (
                <button
                  onClick={handleJoinCommunity}
                  className="ml-4 px-4 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full text-sm"
                >
                  Join Community
                </button>
              )}
              {isJoined && (
                <span className="ml-4 px-4 py-1 bg-indigo-600/20 text-indigo-400 rounded-full text-sm">
                  Member
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {!isJoined ? (
        // Content for non-members
        <div className="bg-gray-700/50 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <FaLock className="text-gray-400" />
            <h2 className="text-lg font-semibold text-white">This community is private</h2>
          </div>
          <p className="text-gray-400 mb-6">
            Join this community to view and participate in discussions about {community.name}.
          </p>
          <div className="mb-6">
            <h3 className="text-white font-semibold mb-2">Community Rules</h3>
            <ul className="space-y-2 text-gray-400">
              {community.rules.map((rule, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="text-indigo-400">•</span>
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>
          <button
            onClick={handleJoinCommunity}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
          >
            Join Community
          </button>
        </div>
      ) : (
        // Content for members
        <>
          {/* Create Post Button */}
          <div className="mb-6">
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
            {communityPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
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
        </>
      )}
    </div>
  );
};

export default CommunityPage; 