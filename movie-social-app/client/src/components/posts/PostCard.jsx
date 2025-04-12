import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const PostCard = ({ post }) => {
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [isSaved, setIsSaved] = useState(post.isSaved);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [comments, setComments] = useState([
    {
      id: 1,
      user: {
        name: 'Alex Johnson',
        avatar: 'https://i.pravatar.cc/150?img=3'
      },
      content: 'I completely agree! The cinematography in this scene was breathtaking.',
      timestamp: '1h ago'
    },
    {
      id: 2,
      user: {
        name: 'Sarah Wilson',
        avatar: 'https://i.pravatar.cc/150?img=4'
      },
      content: 'The soundtrack really elevated the whole experience.',
      timestamp: '45m ago'
    }
  ]);
  const navigate = useNavigate();

  const handleLike = () => {
    setIsLiked(!isLiked);
    // TODO: Implement like functionality
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    // TODO: Implement save functionality
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const comment = {
      id: comments.length + 1,
      user: {
        name: 'Current User', // This would come from auth context in a real app
        avatar: 'https://i.pravatar.cc/150?img=5'
      },
      content: newComment,
      timestamp: 'Just now'
    };

    setComments([comment, ...comments]);
    setNewComment('');
  };

  const handleComment = () => {
    setShowComments(!showComments);
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${post.user.name}'s post about ${post.movie.title}`,
          text: post.content,
          url: window.location.href
        });
      } else {
        // Fallback for browsers that don't support Web Share API
        const shareUrl = window.location.href;
        await navigator.clipboard.writeText(shareUrl);
        alert('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleForward = () => {
    // TODO: Implement forward functionality
    alert('Forward functionality coming soon!');
  };

  const handleRepost = () => {
    // TODO: Implement repost functionality
    alert('Repost functionality coming soon!');
  };

  const handleMovieClick = () => {
    navigate(`/movies/${post.movie.id}`);
  };

  return (
    <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-4 shadow-lg w-full max-w-xl mx-auto">
      {/* User Info */}
      <div className="flex items-center space-x-3 mb-4">
        <img
          src={post.user.avatar}
          alt={post.user.name}
          className="w-10 h-10 rounded-full"
        />
        <div>
          <h3 className="font-medium text-white">{post.user.name}</h3>
          <p className="text-sm text-gray-400">{post.timestamp}</p>
        </div>
      </div>

      {/* Post Content */}
      <p className="text-gray-300 mb-4">{post.content}</p>

      {/* Movie Info */}
      {post.movie && (
        <div 
          className="flex items-center space-x-4 p-3 bg-gray-700/30 rounded-lg mb-4 cursor-pointer hover:bg-gray-700/50 transition-colors"
          onClick={handleMovieClick}
        >
          <img
            src={post.movie.poster}
            alt={post.movie.title}
            className="w-16 h-24 object-cover rounded"
          />
          <div>
            <h4 className="font-medium text-white">{post.movie.title}</h4>
            <p className="text-sm text-gray-400">{post.movie.year}</p>
          </div>
        </div>
      )}

      {/* Post Actions */}
      <div className="flex items-center justify-between border-t border-gray-700/50 pt-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleLike}
            className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
          >
            {isLiked ? (
              <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            )}
            <span>{post.likes + (isLiked ? 1 : 0)}</span>
          </button>
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span>{comments.length}</span>
          </button>
        </div>
        <div className="flex items-center space-x-4 relative z-10">
          <button
            onClick={handleSave}
            className="text-gray-400 hover:text-white transition-colors"
          >
            {isSaved ? (
              <svg className="w-5 h-5 text-indigo-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            )}
          </button>
          <button
            onClick={handleShare}
            className="text-gray-400 hover:text-white transition-colors"
            title="Share post"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
          </button>
          <button
            onClick={handleForward}
            className="text-gray-400 hover:text-white transition-colors"
            title="Forward post"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
          <button
            onClick={handleRepost}
            className="text-gray-400 hover:text-white transition-colors"
            title="Repost"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-4 border-t border-gray-700/50 pt-4">
          {/* Comment Input */}
          <form onSubmit={handleCommentSubmit} className="mb-4">
            <div className="flex items-start space-x-2">
              <img
                src="https://i.pravatar.cc/150?img=5"
                alt="Current User"
                className="w-8 h-8 rounded-full"
              />
              <div className="flex-1">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write a comment..."
                  className="w-full bg-gray-700/50 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </form>

          {/* Comments List */}
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="flex items-start space-x-2">
                <img
                  src={comment.user.avatar}
                  alt={comment.user.name}
                  className="w-8 h-8 rounded-full"
                />
                <div className="flex-1">
                  <div className="bg-gray-700/50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-white text-sm">
                        {comment.user.name}
                      </h4>
                      <span className="text-xs text-gray-400">
                        {comment.timestamp}
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm">{comment.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCard; 