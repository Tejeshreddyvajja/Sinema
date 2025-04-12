import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import HomeNavbar from '../components/layout/HomeNavbar';

const SearchResultsPage = () => {
  const { user } = useUser();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedResultIndex, setSelectedResultIndex] = useState(-1);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('popularity');
  const [filterYear, setFilterYear] = useState('');
  const [filterRating, setFilterRating] = useState('');
  const [expandedOverview, setExpandedOverview] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  // TMDB API details
  const apiKey = "abd78fc15c359fdb67ec78ef39db3ae4";
  const imageBaseUrl = "https://image.tmdb.org/t/p/w500";

  useEffect(() => {
    const query = new URLSearchParams(location.search).get('q');
    if (query) {
      setSearchQuery(query);
      fetchSearchResults(query, currentPage);
    }
  }, [location.search, currentPage, sortBy, filterYear, filterRating]);

  const fetchSearchResults = async (query, page) => {
    try {
      setIsLoading(true);
      let url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}&page=${page}`;
      
      // Add sorting
      if (sortBy === 'rating') {
        url += '&sort_by=vote_average.desc';
      } else if (sortBy === 'release_date') {
        url += '&sort_by=release_date.desc';
      } else {
        url += '&sort_by=popularity.desc';
      }

      // Add filters
      if (filterYear) {
        url += `&year=${filterYear}`;
      }
      if (filterRating) {
        url += `&vote_average.gte=${filterRating}`;
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch search results');
      }
      const data = await response.json();
      setSearchResults(data.results);
      setTotalPages(data.total_pages);
    } catch (error) {
      console.error('Error searching movies:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMovieClick = (movieId) => {
    if (movieId) {
      navigate(`/movie/${movieId}`, {
        state: {
          apiKey,
          imageBaseUrl
        }
      });
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleOverview = (movieId) => {
    setExpandedOverview(expandedOverview === movieId ? null : movieId);
  };

  const handleAddToWatchlist = (movieId) => {
    // TODO: Implement watchlist functionality
    console.log('Added to watchlist:', movieId);
  };

  const handleShareMovie = (movieId) => {
    // TODO: Implement share functionality
    console.log('Shared movie:', movieId);
  };

  const handleSearchNavigation = (query) => {
    // TODO: Implement search navigation functionality
    console.log('Searching for:', query);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#08369a] to-[#000000] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#08369a] to-[#000000]">
      <header className="container mx-auto px-4 pt-4 pb-12">
        <div className="flex justify-between items-center mb-8">
          <div className="text-2xl font-bold text-white">Search Results</div>
          <div className="relative z-50">
            <div className="group relative">
              <button
                onClick={() => setShowSearch(!showSearch)}
                className="text-gray-300 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-20">
                Search Movies
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
              </div>
            </div>
            
            <div className={`absolute top-full right-0 mt-2 w-80 bg-gray-800 rounded-lg shadow-xl p-4 z-50 transition-all duration-300 transform origin-top-right ${
              showSearch ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
            }`}>
              <div className="relative">
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search for movies..."
                  className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              {searchInput && (
                <div className="mt-4 space-y-2">
                  {searchResults.slice(0, 5).map((movie) => (
                    <div
                      key={movie.id}
                      onClick={() => handleMovieClick(movie.id)}
                      className="flex items-center space-x-3 p-2 hover:bg-gray-700 rounded-lg cursor-pointer transition-colors"
                    >
                      <div className="w-12 h-16 flex-shrink-0">
                        {movie.poster_path ? (
                          <img
                            src={`${imageBaseUrl}${movie.poster_path}`}
                            alt={movie.title}
                            className="w-full h-full object-cover rounded"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-600 rounded flex items-center justify-center">
                            <span className="text-gray-400 text-xs">No Poster</span>
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="text-white font-medium text-sm">{movie.title}</h3>
                        <p className="text-gray-400 text-xs">{new Date(movie.release_date).getFullYear()}</p>
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={() => handleSearchNavigation(searchInput)}
                    className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                  >
                    View All Results
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        <HomeNavbar />
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Search Results for "{searchQuery}"
              </h1>
              <p className="text-gray-400">
                Found {searchResults.length} results
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-gray-800 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="popularity">Popularity</option>
                  <option value="rating">Rating</option>
                  <option value="release_date">Release Date</option>
                </select>
                <select
                  value={filterYear}
                  onChange={(e) => setFilterYear(e.target.value)}
                  className="bg-gray-800 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">All Years</option>
                  {Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i).map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
                <select
                  value={filterRating}
                  onChange={(e) => setFilterRating(e.target.value)}
                  className="bg-gray-800 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">All Ratings</option>
                  <option value="7">7+ Rating</option>
                  <option value="8">8+ Rating</option>
                  <option value="9">9+ Rating</option>
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'list'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {searchResults.map((movie, index) => (
              <div
                key={movie.id}
                onClick={() => handleMovieClick(movie.id)}
                className={`bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden hover:scale-105 transition-transform duration-300 group cursor-pointer ${
                  index === selectedResultIndex ? 'ring-2 ring-indigo-500' : ''
                }`}
              >
                <div className="relative">
                  <div className="aspect-[2/3] bg-gray-700 overflow-hidden">
                    {movie.poster_path ? (
                      <img
                        src={`${imageBaseUrl}${movie.poster_path}`}
                        alt={movie.title}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-gray-400 text-sm">No Poster</span>
                      </div>
                    )}
                  </div>
                  <div className="absolute top-3 right-3 bg-black/70 px-2.5 py-1 rounded-full">
                    <span className="text-yellow-400 text-sm flex items-center">
                      <svg className="w-3.5 h-3.5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      {movie.vote_average.toFixed(1)}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-white font-medium mb-1 truncate group-hover:text-indigo-400 transition-colors">
                    {movie.title}
                  </h3>
                  <div className="flex items-center space-x-2 text-sm text-gray-400 mb-3">
                    <span>{new Date(movie.release_date).getFullYear()}</span>
                    <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                    <span>{movie.genre_ids.join(', ')}</span>
                  </div>
                  <p className="text-gray-300 text-sm line-clamp-2 mb-4">
                    {movie.overview}
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMovieClick(movie.id);
                    }}
                    className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {searchResults.map((movie, index) => (
              <div
                key={movie.id}
                className={`bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden hover:scale-[1.02] transition-transform duration-300 group ${
                  index === selectedResultIndex ? 'ring-2 ring-indigo-500' : ''
                }`}
              >
                <div className="flex">
                  <div className="w-40 flex-shrink-0">
                    <div className="aspect-[2/3] bg-gray-700 overflow-hidden">
                      {movie.poster_path ? (
                        <img
                          src={`${imageBaseUrl}${movie.poster_path}`}
                          alt={movie.title}
                          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-gray-400 text-sm">No Poster</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="p-6 flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-white font-medium text-xl mb-2 group-hover:text-indigo-400 transition-colors">
                          {movie.title}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-400 mb-4">
                          <span>{new Date(movie.release_date).getFullYear()}</span>
                          <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                          <span>{movie.genre_ids.join(', ')}</span>
                          <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                          <span className="flex items-center text-yellow-400">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            {movie.vote_average.toFixed(1)}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleAddToWatchlist(movie.id)}
                          className="p-2 text-gray-400 hover:text-white transition-colors"
                          title="Add to Watchlist"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleShareMovie(movie.id)}
                          className="p-2 text-gray-400 hover:text-white transition-colors"
                          title="Share"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <p className={`text-gray-300 text-sm mb-4 ${expandedOverview === movie.id ? '' : 'line-clamp-2'}`}>
                      {movie.overview}
                    </p>
                    {movie.overview.length > 200 && (
                      <button
                        onClick={() => toggleOverview(movie.id)}
                        className="text-indigo-400 text-sm hover:text-indigo-300 transition-colors mb-4"
                      >
                        {expandedOverview === movie.id ? 'Show Less' : 'Show More'}
                      </button>
                    )}
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => handleMovieClick(movie.id)}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => handleAddToWatchlist(movie.id)}
                        className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm font-medium"
                      >
                        Add to Watchlist
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Enhanced Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8 space-x-2">
            <button
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-800 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
            >
              First
            </button>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-800 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
            >
              Previous
            </button>
            <div className="flex items-center space-x-2">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNumber;
                if (totalPages <= 5) {
                  pageNumber = i + 1;
                } else if (currentPage <= 3) {
                  pageNumber = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNumber = totalPages - 4 + i;
                } else {
                  pageNumber = currentPage - 2 + i;
                }
                return (
                  <button
                    key={pageNumber}
                    onClick={() => handlePageChange(pageNumber)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      currentPage === pageNumber
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-800 text-white hover:bg-gray-700'
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-800 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
            >
              Next
            </button>
            <button
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-800 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
            >
              Last
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default SearchResultsPage; 