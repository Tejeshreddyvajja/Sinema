import React, { useState, useRef } from 'react';
import { useUser } from '@clerk/clerk-react';

const CreatePost = ({ onPostCreated }) => {
  const { user } = useUser();
  const [content, setContent] = useState('');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showMovieSearch, setShowMovieSearch] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [postVisibility, setPostVisibility] = useState('public');
  const fileInputRef = useRef(null);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const handleContentChange = (e) => {
    const text = e.target.value;
    if (text.length <= 280) {
      setContent(text);
    }
  };

  const handleMovieSelect = (movie) => {
    setSelectedMovie(movie);
    setShowMovieSearch(false);
  };

  const handleImageUpload = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim() && !selectedMovie) return;

    const newPost = {
      id: Date.now(),
      user: {
        name: user.fullName,
        avatar: user.imageUrl
      },
      content: content.trim(),
      movie: selectedMovie,
      likes: 0,
      comments: [],
      createdAt: new Date().toISOString()
    };

    onPostCreated(newPost);
    setContent('');
    setSelectedMovie(null);
  };

  const handleMovieSearch = async (query) => {
    setSearchQuery(query);
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    // TODO: Implement actual movie search API call
    // For now, using mock data
    const mockResults = [
      { id: 1, title: 'Inception', year: '2010', rating: 8.8 },
      { id: 2, title: 'The Dark Knight', year: '2008', rating: 9.0 },
      { id: 3, title: 'Interstellar', year: '2014', rating: 8.6 }
    ].filter(movie => 
      movie.title.toLowerCase().includes(query.toLowerCase())
    );

    setSearchResults(mockResults);
  };

  return (
    <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-4 mb-4">
      <form onSubmit={handleSubmit}>
        <div className="flex space-x-3">
          <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-sm font-medium">
              {user?.fullName?.charAt(0)}
            </span>
          </div>
          <div className="flex-1">
            <textarea
              value={content}
              onChange={handleContentChange}
              placeholder="What's on your mind?"
              className="w-full bg-transparent text-white placeholder-gray-400 resize-none focus:outline-none min-h-[100px]"
            />
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setShowMovieSearch(!showMovieSearch)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={handleImageUpload}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
                <select
                  value={postVisibility}
                  onChange={(e) => setPostVisibility(e.target.value)}
                  className="bg-gray-700 text-gray-300 text-sm rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="public">Everyone</option>
                  <option value="friends">Friends Only</option>
                  <option value="private">Only Me</option>
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-400 text-sm">
                  {content.length}/280
                </span>
                <button
                  type="submit"
                  disabled={!content.trim() && !selectedMovie}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Post
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Selected Movie Preview */}
        {selectedMovie && (
          <div className="mt-4 flex items-center space-x-3 bg-gray-700/50 rounded-lg p-3">
            <div className="w-16 h-24 bg-gray-600 rounded-lg flex-shrink-0">
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-gray-400 text-xs">Poster</span>
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="text-white text-sm font-medium">{selectedMovie.title}</h4>
                <button
                  type="button"
                  onClick={() => setSelectedMovie(null)}
                  className="text-gray-400 hover:text-white"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="text-gray-400 text-xs mt-0.5">{selectedMovie.year}</p>
              <div className="mt-1 flex items-center">
                <span className="text-yellow-400 text-xs flex items-center">
                  <svg className="w-3 h-3 mr-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  {selectedMovie.rating}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Movie Search Dropdown */}
        {showMovieSearch && (
          <div className="mt-2 bg-gray-700/50 rounded-lg p-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for a movie..."
                className="w-full bg-gray-700 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={searchQuery}
                onChange={(e) => handleMovieSearch(e.target.value)}
              />
              <div className="absolute right-3 top-2">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            <div className="mt-2 space-y-2">
              {searchResults.map((movie) => (
                <button
                  key={movie.id}
                  onClick={() => {
                    setSelectedMovie(movie);
                    setShowMovieSearch(false);
                    setSearchQuery('');
                    setSearchResults([]);
                  }}
                  className="w-full flex items-center space-x-3 p-2 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <div className="w-12 h-16 bg-gray-600 rounded-lg flex-shrink-0">
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-gray-400 text-xs">Poster</span>
                    </div>
                  </div>
                  <div className="text-left">
                    <h4 className="text-white text-sm font-medium">{movie.title}</h4>
                    <p className="text-gray-400 text-xs">{movie.year}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
        />
      </form>
    </div>
  );
};

export default CreatePost; 