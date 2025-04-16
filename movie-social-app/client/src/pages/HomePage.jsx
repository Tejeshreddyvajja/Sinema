import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SignOutButton, useUser } from '@clerk/clerk-react';
import HomeNavbar from '../components/layout/HomeNavbar';
import MovieRecommendations from '../components/movies/MovieRecommendations';
import NotificationsPanel from '../components/posts/NotificationsPanel';

const HomePage = () => {
  const { user } = useUser();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [autoSlide, setAutoSlide] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedResultIndex, setSelectedResultIndex] = useState(-1);
  const [debounceTimer, setDebounceTimer] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'New message from John', time: 'Just now' },
  ]);
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

  // TMDB API details
  const apiKey = "abd78fc15c359fdb67ec78ef39db3ae4";
  const imageBaseUrl = "https://image.tmdb.org/t/p/w500";

  // Handle scroll for back to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch trending movies
  useEffect(() => {
    const fetchTrendingMovies = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}&language=en-US`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch trending movies');
        }
        const data = await response.json();
        setTrendingMovies(data.results.slice(0, 5)); // Get top 5 trending movies
      } catch (error) {
        console.error("Error fetching trending movies:", error);
        // You might want to show an error message to the user here
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrendingMovies();
  }, [apiKey]);

  // Auto-slide effect
  useEffect(() => {
    let timer;
    if (autoSlide && trendingMovies.length > 0) {
      timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % trendingMovies.length);
      }, 5000); // Change slide every 5 seconds
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [trendingMovies, autoSlide]);

  // Handle slide navigation
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % trendingMovies.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + trendingMovies.length) % trendingMovies.length);
  };

  // Handle navigation to movies page with search query
  const handleSearchNavigation = (query) => {
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  // Handle navigation to movies page with category
  const handleCategoryNavigation = (category) => {
    navigate('/movies', {
      state: {
        category,
        apiKey,
        imageBaseUrl
      }
    });
  };

  // Handle search input change with debounce
  const handleSearchChange = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    // Clear previous timer
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    
    if (query.trim() === '') {
      setSearchResults([]);
      setSelectedResultIndex(-1);
      return;
    }

    // Set new timer
    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch search results');
        }
        const data = await response.json();
        setSearchResults(data.results);
        setSelectedResultIndex(-1); // Reset selection when new results come in
      } catch (error) {
        console.error('Error searching movies:', error);
      } finally {
        setIsSearching(false);
      }
    }, 300); // 300ms debounce

    setDebounceTimer(timer);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (searchResults.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedResultIndex(prev => 
          prev < searchResults.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedResultIndex(prev => prev > 0 ? prev - 1 : prev);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedResultIndex >= 0) {
          navigate(`/movie/${searchResults[selectedResultIndex].id}`, { 
            state: { apiKey, imageBaseUrl } 
          });
        }
        break;
      case 'Escape':
        e.preventDefault();
        clearSearch();
        break;
    }
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setSelectedResultIndex(-1);
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
  };

  // Handle movie click
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

  // Scroll to top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const searchContainer = document.querySelector('.search-container');
      if (searchContainer && !searchContainer.contains(event.target)) {
        setShowSearch(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const profileMenu = document.querySelector('.profile-menu');
      if (profileMenu && !profileMenu.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const addNotification = (message) => {
    setNotifications((prev) => [
      { id: prev.length + 1, message, time: 'Just now' },
      ...prev,
    ]);
  };

  // Simulate receiving a new message
  useEffect(() => {
    const timer = setInterval(() => {
      addNotification('You have a new message!');
    }, 10000);

    return () => clearInterval(timer);
  }, []);

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
          <div className="text-2xl font-bold text-white">Sinema</div>
          
          {/* Right side icons */}
          <div className="flex items-center space-x-4">
            {/* Search Bar */}
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
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Search for movies..."
                    className="w-full px-4 py-3 pl-12 pr-12 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  {isSearching && (
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-indigo-500"></div>
                    </div>
                  )}
                  {searchQuery && !isSearching && (
                    <button
                      onClick={clearSearch}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>

                {/* Search Results Dropdown */}
                {searchResults.length > 0 && (
                  <div className={`absolute z-50 w-full mt-2 bg-gray-800/95 backdrop-blur-lg rounded-lg shadow-xl max-h-96 overflow-y-auto transition-all duration-300 transform origin-top ${
                    showSearch ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
                  }`}>
                    <div className="divide-y divide-gray-700">
                      {searchResults.map((movie, index) => (
                        <div
                          key={movie.id}
                          onClick={() => navigate(`/movie/${movie.id}`, { state: { apiKey, imageBaseUrl } })}
                          className={`flex items-center p-4 hover:bg-gray-700/50 cursor-pointer transition-colors ${
                            index === selectedResultIndex ? 'bg-gray-700/50' : ''
                          }`}
                        >
                          <div className="w-16 h-24 flex-shrink-0">
                            {movie.poster_path ? (
                              <img
                                src={`${imageBaseUrl}${movie.poster_path}`}
                                alt={movie.title}
                                className="w-full h-full object-cover rounded"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-700 flex items-center justify-center rounded">
                                <span className="text-gray-400 text-xs">No Image</span>
                              </div>
                            )}
                          </div>
                          <div className="ml-4 flex-1">
                            <h3 className="text-white font-medium">{movie.title}</h3>
                            <div className="flex items-center text-sm text-gray-400 mt-1">
                              <span className="flex items-center">
                                <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                {movie.vote_average.toFixed(1)}
                              </span>
                              <span className="mx-2">•</span>
                              <span>{new Date(movie.release_date).getFullYear()}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                      {/* View All Results Button */}
                      <div className="p-4 bg-gray-700/50 hover:bg-gray-700/70 transition-colors">
                        <button
                          onClick={() => handleSearchNavigation(searchQuery)}
                          className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium flex items-center justify-center"
                        >
                          View All Results
                          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Notification Icon */}
            <button
              className="text-gray-300 hover:text-white transition-colors relative"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {notifications.length > 0 && (
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-4 top-16 z-50 max-w-xs w-full transform transition-all duration-300">
                <NotificationsPanel notifications={notifications} />
              </div>
            )}

            {/* Profile Section */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-2 focus:outline-none"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 overflow-hidden">
                  {user?.imageUrl ? (
                    <img
                      src={user.imageUrl}
                      alt={user.fullName || 'User'}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-sm font-medium text-white">
                        {user?.firstName?.[0] || 'U'}
                      </span>
                    </div>
                  )}
                </div>
              </button>

              {/* Profile Dropdown Menu */}
              <div
                className={`absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-xl py-2 z-50 transition-all duration-200 transform origin-top-right ${
                  showProfileMenu ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
                }`}
              >
                <div className="px-4 py-2 border-b border-gray-700">
                  <p className="text-white font-medium truncate">
                    {user?.fullName || 'User'}
                  </p>
                  <p className="text-gray-400 text-sm truncate">
                    {user?.primaryEmailAddress?.emailAddress}
                  </p>
                </div>
                <div className="py-1">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                  >
                    Profile
                  </Link>
                  <Link
                    to="/settings"
                    className="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                  >
                    Settings
                  </Link>
                  <SignOutButton>
                    <button className="w-full text-left px-4 py-2 text-red-400 hover:bg-gray-700 hover:text-red-300 transition-colors">
                      Sign Out
                    </button>
                  </SignOutButton>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <HomeNavbar />
      </header>

      {/* Hero Section with Sliding Movies */}
      <section className="container mx-auto px-4 mb-12">
        <div className="w-full max-w-8xl mx-auto">
          <div 
            className="bg-black/50 backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden relative cursor-pointer"
            onClick={() => handleMovieClick(trendingMovies[currentSlide]?.id)}
          >
            {/* Movie Background */}
            <div className="absolute inset-0 w-full h-full">
              <div 
                className="w-full h-full bg-cover bg-center transition-opacity duration-500"
                style={{ 
                  backgroundImage: `url(${imageBaseUrl}${trendingMovies[currentSlide]?.backdrop_path})`,
                  opacity: 0.5 
                }}
              />
            </div>

            {/* Movie Content */}
            <div className="relative z-10 p-12">
              <div className="max-w-3xl transition-all duration-500 transform">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  {trendingMovies[currentSlide]?.title}
                </h1>
                <div className="flex items-center space-x-4 text-sm text-gray-300 mb-4">
                  <span className="flex items-center">
                    <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    {trendingMovies[currentSlide]?.vote_average.toFixed(1)}
                  </span>
                  <span>{new Date(trendingMovies[currentSlide]?.release_date).getFullYear()}</span>
                  <span>{trendingMovies[currentSlide]?.genre_ids.join(', ')}</span>
                </div>
                <p className="text-gray-300 text-lg mb-8">
                  {trendingMovies[currentSlide]?.overview}
                </p>
                <div className="flex space-x-4">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMovieClick(trendingMovies[currentSlide]?.id);
                    }}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                  >
                    Watch Now
                  </button>
                  <button 
                    onClick={(e) => e.stopPropagation()}
                    className="px-6 py-3 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors"
                  >
                    Add to Watchlist
                  </button>
                </div>
              </div>
            </div>

            {/* Slide Controls */}
            <div className="absolute bottom-6 right-6 flex items-center space-x-4">
              {/* Auto/Manual Toggle */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setAutoSlide(!autoSlide);
                }}
                className="text-gray-300 hover:text-white transition-colors flex items-center space-x-2"
              >
                <svg
                  className={`w-5 h-5 ${autoSlide ? 'text-indigo-500' : 'text-gray-400'}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                <span className="text-sm">{autoSlide ? 'Auto' : 'Manual'}</span>
              </button>

              {/* Slide Indicators */}
              <div className="flex space-x-2">
                {trendingMovies.map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentSlide(index);
                    }}
                    className={`w-2 h-2 rounded-full transition-all ${
                      currentSlide === index ? 'bg-white w-6' : 'bg-gray-500'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Arrow Navigation */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevSlide();
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextSlide();
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Movie Recommendations Section */}
      <MovieRecommendations apiKey={apiKey} imageBaseUrl={imageBaseUrl} />

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-indigo-600 text-white p-3 rounded-full shadow-lg hover:bg-indigo-700 transition-colors z-50"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Featured Movies Section */}
          <section className="col-span-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-white">Featured Movies</h2>
              <button 
                onClick={() => handleCategoryNavigation('featured')}
                className="text-indigo-400 hover:text-indigo-300 text-sm font-medium flex items-center"
              >
                View All
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trendingMovies.slice(0, 3).map((movie) => (
                <div 
                  key={movie.id} 
                  onClick={() => handleMovieClick(movie.id)}
                  className="bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden hover:scale-105 transition-transform duration-300 group cursor-pointer"
                >
                  <div className="relative">
                    <div className="aspect-[16/9] bg-gray-700 overflow-hidden">
                      {movie.backdrop_path ? (
                        <img 
                          src={`${imageBaseUrl}${movie.backdrop_path}`}
                          alt={movie.title}
                          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-gray-400 text-sm">No Image</span>
                        </div>
                      )}
                    </div>
                    <div className="absolute top-4 right-4 bg-black/70 px-3 py-1 rounded-full">
                      <span className="text-yellow-400 text-sm flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        {movie.vote_average.toFixed(1)}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-white font-bold text-xl mb-2 group-hover:text-indigo-400 transition-colors">{movie.title}</h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-400 mb-4">
                      <span>{new Date(movie.release_date).getFullYear()}</span>
                      <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                      <span>{movie.genre_ids.join(', ')}</span>
                    </div>
                    <p className="text-gray-300 text-sm mb-6 line-clamp-3">{movie.overview}</p>
                    <div className="flex space-x-3">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMovieClick(movie.id);
                        }}
                        className="flex-1 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium flex items-center justify-center"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Watch Now
                      </button>
                      <button 
                        onClick={(e) => e.stopPropagation()}
                        className="w-10 h-10 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center"
                      >
                        <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Recent Reviews Section */}
          <section className="col-span-full md:col-span-1">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-white">Recent Reviews</h2>
              <button className="text-indigo-400 hover:text-indigo-300 text-sm font-medium">View All</button>
            </div>
            <div className="space-y-4">
              {[1, 2, 3].map((review) => (
                <div key={review} className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-5 hover:bg-gray-800/70 transition-colors group">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                      <span className="text-white font-medium">U{review}</span>
                    </div>
                    <div>
                      <h4 className="text-white font-medium group-hover:text-indigo-400 transition-colors">User {review}</h4>
                      <div className="flex items-center text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm mb-4 line-clamp-3">This movie was absolutely amazing! The cinematography and acting were top-notch. The storyline kept me engaged throughout the entire film.</p>
                  <div className="flex justify-between items-center text-xs text-gray-400">
                    <span>2 hours ago</span>
                    <button className="text-indigo-400 hover:text-indigo-300 font-medium flex items-center">
                      Read More
                      <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Popular Movies Section */}
          <section className="col-span-full md:col-span-1 lg:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-white">Popular Movies</h2>
              <button 
                onClick={() => handleCategoryNavigation('popular')}
                className="text-indigo-400 hover:text-indigo-300 text-sm font-medium flex items-center"
              >
                View All
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {trendingMovies.slice(3, 6).map((movie) => (
                <div 
                  key={movie.id} 
                  onClick={() => handleMovieClick(movie.id)}
                  className="bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden hover:scale-105 transition-transform duration-300 group cursor-pointer"
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
                    <h3 className="text-white font-medium mb-1 truncate group-hover:text-indigo-400 transition-colors">{movie.title}</h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-400 mb-3">
                      <span>{new Date(movie.release_date).getFullYear()}</span>
                      <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                      <span>{movie.genre_ids.join(', ')}</span>
                    </div>
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
          </section>
        </div>
      </main>
    </div>
  );
};

export default HomePage;