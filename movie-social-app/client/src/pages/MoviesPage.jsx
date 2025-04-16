import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';

const MoviesPage = () => {
  const { user } = useUser();
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('discover');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [genres, setGenres] = useState([]);
  const [languages, setLanguages] = useState([
    // Indian Languages
    { code: 'hi', name: 'हिन्दी (Hindi)' },
    { code: 'ta', name: 'தமிழ் (Tamil)' },
    { code: 'te', name: 'తెలుగు (Telugu)' },
    { code: 'ml', name: 'മലയാളം (Malayalam)' },
    { code: 'kn', name: 'ಕನ್ನಡ (Kannada)' },
    { code: 'bn', name: 'বাংলা (Bengali)' },
    { code: 'mr', name: 'मराठी (Marathi)' },
    { code: 'gu', name: 'ગુજરાતી (Gujarati)' },
    { code: 'pa', name: 'ਪੰਜਾਬੀ (Punjabi)' },
    { code: 'or', name: 'ଓଡ଼ିଆ (Odia)' },
    { code: 'as', name: 'অসমীয়া (Assamese)' },
    { code: 'ur', name: 'اردو (Urdu)' },
    
    // Other Major Languages
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español (Spanish)' },
    { code: 'fr', name: 'Français (French)' },
    { code: 'de', name: 'Deutsch (German)' },
    { code: 'it', name: 'Italiano (Italian)' },
    { code: 'pt', name: 'Português (Portuguese)' },
    { code: 'ru', name: 'Русский (Russian)' },
    { code: 'ja', name: '日本語 (Japanese)' },
    { code: 'ko', name: '한국어 (Korean)' },
    { code: 'zh', name: '中文 (Chinese)' },
    { code: 'ar', name: 'العربية (Arabic)' },
    { code: 'tr', name: 'Türkçe (Turkish)' }
  ]);
  const navigate = useNavigate();
  const location = useLocation();

  // Advanced discovery filters
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [minRating, setMinRating] = useState(0);
  const [maxRating, setMaxRating] = useState(10);
  const [fromYear, setFromYear] = useState(1900);
  const [toYear, setToYear] = useState(new Date().getFullYear());
  const [includeAdult, setIncludeAdult] = useState(false);
  const [sortBy, setSortBy] = useState('popularity.desc');
  const [selectedKeywords, setSelectedKeywords] = useState([]);
  const [keywordQuery, setKeywordQuery] = useState('');
  const [keywordResults, setKeywordResults] = useState([]);
  const [isSearchingKeywords, setIsSearchingKeywords] = useState(false);

  // TMDB API details
  const apiKey = "abd78fc15c359fdb67ec78ef39db3ae4";
  const imageBaseUrl = "https://image.tmdb.org/t/p/w500";

  // Get user profile image
  const userProfileImage = user?.imageUrl || 'https://i.pravatar.cc/300?img=11';
  const userName = user?.fullName || 'User';

  // Fetch genres
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=en-US`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch genres');
        }
        const data = await response.json();
        setGenres(data.genres);
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    };

    fetchGenres();
  }, [apiKey]);

  // Search for keywords
  useEffect(() => {
    const searchKeywords = async () => {
      if (keywordQuery.trim() === '') {
        setKeywordResults([]);
        return;
      }

      setIsSearchingKeywords(true);
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/search/keyword?api_key=${apiKey}&query=${encodeURIComponent(keywordQuery)}&page=1`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch keyword results');
        }
        const data = await response.json();
        setKeywordResults(data.results.slice(0, 5));
      } catch (error) {
        console.error('Error searching keywords:', error);
        setKeywordResults([]);
      } finally {
        setIsSearchingKeywords(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      searchKeywords();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [keywordQuery, apiKey]);

  // Fetch movies based on category, genre, language and advanced filters
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setIsLoading(true);
        let url = '';
        let params = new URLSearchParams();
        
        params.append('api_key', apiKey);
        params.append('language', selectedLanguage);
        
        if (selectedGenre) {
          params.append('with_genres', selectedGenre);
        }
        
        // Add advanced filters if in discover mode
        if (selectedCategory === 'discover') {
          // Vote average filter
          if (minRating > 0) {
            params.append('vote_average.gte', minRating);
          }
          if (maxRating < 10) {
            params.append('vote_average.lte', maxRating);
          }
          
          // Release year filter
          if (fromYear > 1900) {
            params.append('primary_release_date.gte', `${fromYear}-01-01`);
          }
          if (toYear < new Date().getFullYear()) {
            params.append('primary_release_date.lte', `${toYear}-12-31`);
          }
          
          // Adult content filter
          params.append('include_adult', includeAdult);
          
          // Sort by
          params.append('sort_by', sortBy);
          
          // Keywords
          if (selectedKeywords.length > 0) {
            params.append('with_keywords', selectedKeywords.map(k => k.id).join('|'));
          }
        }
        
        switch (selectedCategory) {
          case 'discover':
            url = `https://api.themoviedb.org/3/discover/movie?${params.toString()}`;
            break;
          case 'trending':
            url = `https://api.themoviedb.org/3/trending/movie/week?${params.toString()}`;
            break;
          case 'top_rated':
            url = `https://api.themoviedb.org/3/movie/top_rated?${params.toString()}`;
            break;
          case 'upcoming':
            url = `https://api.themoviedb.org/3/movie/upcoming?${params.toString()}`;
            break;
          case 'now_playing':
            url = `https://api.themoviedb.org/3/movie/now_playing?${params.toString()}`;
            break;
          default:
            url = `https://api.themoviedb.org/3/discover/movie?${params.toString()}`;
        }

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Failed to fetch movies');
        }
        const data = await response.json();
        
        // Sort movies to prioritize the selected language
        const sortedMovies = data.results.sort((a, b) => {
          // If both movies are in the selected language, maintain their original order
          if (a.original_language === selectedLanguage && b.original_language === selectedLanguage) {
            return 0;
          }
          // If only movie A is in the selected language, it should come first
          if (a.original_language === selectedLanguage) {
            return -1;
          }
          // If only movie B is in the selected language, it should come first
          if (b.original_language === selectedLanguage) {
            return 1;
          }
          // If neither movie is in the selected language, maintain their original order
          return 0;
        });
        
        setMovies(sortedMovies);
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, [
    selectedCategory, 
    selectedGenre, 
    selectedLanguage, 
    apiKey, 
    minRating, 
    maxRating, 
    fromYear, 
    toYear, 
    includeAdult, 
    sortBy, 
    selectedKeywords
  ]);

  // Handle adding a keyword
  const handleAddKeyword = (keyword) => {
    if (!selectedKeywords.some(k => k.id === keyword.id)) {
      setSelectedKeywords([...selectedKeywords, keyword]);
    }
    setKeywordQuery('');
    setKeywordResults([]);
  };

  // Handle removing a keyword
  const handleRemoveKeyword = (keywordId) => {
    setSelectedKeywords(selectedKeywords.filter(k => k.id !== keywordId));
  };

  // Reset all filters
  const handleResetFilters = () => {
    setMinRating(0);
    setMaxRating(10);
    setFromYear(1900);
    setToYear(new Date().getFullYear());
    setIncludeAdult(false);
    setSortBy('popularity.desc');
    setSelectedKeywords([]);
    setSelectedGenre(null);
  };

  // Fetch search results as user types
  useEffect(() => {
    const searchMovies = async () => {
      if (searchQuery.trim() === '') {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(searchQuery)}&language=en-US&page=1`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch search results');
        }
        const data = await response.json();
        setSearchResults(data.results.slice(0, 5));
      } catch (error) {
        console.error('Error searching movies:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      searchMovies();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, apiKey]);

  // Handle movie click
  const handleMovieClick = (movieId) => {
    navigate(`/movie/${movieId}`, {
      state: {
        apiKey,
        imageBaseUrl
      }
    });
  };

  // Handle category change
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const [showSearch, setShowSearch] = useState(false);
  const [selectedResultIndex, setSelectedResultIndex] = useState(null);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearchNavigation(searchQuery);
    }
  };

  const handleSearchNavigation = (query) => {
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setShowSearch(false);
      setSearchResults([]);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setShowSearch(false);
    setSearchResults([]);
  };

  if (isLoading) {
    return (
      <div className="flex h-screen bg-gray-900 text-white">
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#08369a] to-[#000000] flex">
      {/* Server list sidebar (like Discord) */}
      <div className="w-16 bg-gray-900/50 backdrop-blur-sm flex flex-col items-center py-4 overflow-y-auto">
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
            <div className="w-10 h-10 rounded-xl bg-gray-800 group-hover:bg-indigo-600 transition-colors flex items-center justify-center text-gray-400 group-hover:text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
          </Link>

          <button 
            onClick={() => handleCategoryChange('discover')}
            className={`group relative flex items-center justify-center ${
              selectedCategory === 'discover' ? 'active' : ''
            }`}
          >
            <div className="absolute left-0 w-1 h-8 bg-indigo-500 rounded-r-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
              selectedCategory === 'discover' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-800 text-gray-400 group-hover:bg-indigo-600 group-hover:text-white'
            }`}>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
            </div>
          </button>

          <button 
            onClick={() => handleCategoryChange('trending')}
            className={`group relative flex items-center justify-center ${
              selectedCategory === 'trending' ? 'active' : ''
            }`}
          >
            <div className="absolute left-0 w-1 h-8 bg-indigo-500 rounded-r-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
              selectedCategory === 'trending' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-800 text-gray-400 group-hover:bg-indigo-600 group-hover:text-white'
            }`}>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </button>

          <button 
            onClick={() => handleCategoryChange('top_rated')}
            className={`group relative flex items-center justify-center ${
              selectedCategory === 'top_rated' ? 'active' : ''
            }`}
          >
            <div className="absolute left-0 w-1 h-8 bg-indigo-500 rounded-r-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
              selectedCategory === 'top_rated' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-800 text-gray-400 group-hover:bg-indigo-600 group-hover:text-white'
            }`}>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
            </div>
          </button>

          <button 
            onClick={() => handleCategoryChange('upcoming')}
            className={`group relative flex items-center justify-center ${
              selectedCategory === 'upcoming' ? 'active' : ''
            }`}
          >
            <div className="absolute left-0 w-1 h-8 bg-indigo-500 rounded-r-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
              selectedCategory === 'upcoming' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-800 text-gray-400 group-hover:bg-indigo-600 group-hover:text-white'
            }`}>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
              </svg>
            </div>
          </button>

          <button 
            onClick={() => handleCategoryChange('now_playing')}
            className={`group relative flex items-center justify-center ${
              selectedCategory === 'now_playing' ? 'active' : ''
            }`}
          >
            <div className="absolute left-0 w-1 h-8 bg-indigo-500 rounded-r-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
              selectedCategory === 'now_playing' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-800 text-gray-400 group-hover:bg-indigo-600 group-hover:text-white'
            }`}>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
              </svg>
            </div>
          </button>

          {/* Profile Section */}
          <div className="mt-auto">
            <Link 
              to="/profile" 
              className="group relative flex items-center justify-center"
            >
              <div className="absolute left-0 w-1 h-8 bg-indigo-500 rounded-r-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-800 group-hover:bg-indigo-600 transition-colors">
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

      {/* Channels sidebar */}
      <div className="w-56 bg-gray-900/50 backdrop-blur-sm overflow-y-auto">
        <div className="p-4 border-b border-gray-700">
          <h2 className="font-bold text-lg">Movie Explorer</h2>
        </div>
        
        {/* Language Filter */}
        <div className="p-3">
          <div className="text-gray-400 text-sm font-semibold mb-1">LANGUAGE</div>
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="w-full bg-gray-800 text-white rounded px-2 py-1 mb-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>

        <div className="p-3">
          <div className="text-gray-400 text-sm font-semibold mb-1">DISCOVER</div>
          <button 
            onClick={() => handleCategoryChange('discover')}
            className={`w-full text-left text-gray-300 hover:bg-gray-700 rounded px-2 py-1 cursor-pointer mb-1 ${
              selectedCategory === 'discover' ? 'bg-gray-700' : ''
            }`}
          >
            # popular
          </button>
          <button 
            onClick={() => handleCategoryChange('trending')}
            className={`w-full text-left text-gray-300 hover:bg-gray-700 rounded px-2 py-1 cursor-pointer mb-1 ${
              selectedCategory === 'trending' ? 'bg-gray-700' : ''
            }`}
          >
            # trending
          </button>
          <button 
            onClick={() => handleCategoryChange('now_playing')}
            className={`w-full text-left text-gray-300 hover:bg-gray-700 rounded px-2 py-1 cursor-pointer mb-1 ${
              selectedCategory === 'now_playing' ? 'bg-gray-700' : ''
            }`}
          >
            # now-playing
          </button>
          <button 
            onClick={() => handleCategoryChange('upcoming')}
            className={`w-full text-left text-gray-300 hover:bg-gray-700 rounded px-2 py-1 cursor-pointer mb-1 ${
              selectedCategory === 'upcoming' ? 'bg-gray-700' : ''
            }`}
          >
            # upcoming
          </button>
        </div>

        {/* Genres Filter */}
        <div className="p-3">
          <div className="text-gray-400 text-sm font-semibold mb-1">GENRES</div>
          <button 
            onClick={() => setSelectedGenre(null)}
            className={`w-full text-left text-gray-300 hover:bg-gray-700 rounded px-2 py-1 cursor-pointer mb-1 ${
              selectedGenre === null ? 'bg-gray-700' : ''
            }`}
          >
            # all-genres
          </button>
          
          {/* Top 5 Genres */}
          {genres.slice(0, 5).map((genre) => (
            <button
              key={genre.id}
              onClick={() => setSelectedGenre(genre.id)}
              className={`w-full text-left text-gray-300 hover:bg-gray-700 rounded px-2 py-1 cursor-pointer mb-1 ${
                selectedGenre === genre.id ? 'bg-gray-700' : ''
              }`}
            >
              # {genre.name.toLowerCase()}
            </button>
          ))}

          {/* Dropdown for remaining genres */}
          {genres.length > 5 && (
            <div className="relative">
              <select
                value={selectedGenre || ''}
                onChange={(e) => setSelectedGenre(e.target.value ? Number(e.target.value) : null)}
                className="w-full bg-gray-800 text-white rounded px-2 py-1 mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none"
              >
                <option value="">More Genres...</option>
                {genres.slice(5).map((genre) => (
                  <option key={genre.id} value={genre.id}>
                    {genre.name}
                  </option>
                ))}
              </select>
              <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          )}
        </div>

        {/* Advanced Filters */}
        {selectedCategory === 'discover' && (
          <div className="p-3">
            <div className="text-gray-400 text-sm font-semibold mb-1">ADVANCED FILTERS</div>
            <button 
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`w-full text-left text-gray-300 hover:bg-gray-700 rounded px-2 py-1 cursor-pointer mb-1 ${
                showAdvancedFilters ? 'bg-gray-700' : ''
              }`}
            >
              # advanced-filters
            </button>
            {showAdvancedFilters && (
              <div className="mt-2">
                <div className="flex justify-between items-center mb-2">
                  <div className="text-gray-400 text-sm font-semibold">Rating Range:</div>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      min="0"
                      max="10"
                      step="0.5"
                      value={minRating}
                      onChange={(e) => setMinRating(parseFloat(e.target.value))}
                      className="bg-gray-800 text-white rounded-lg px-2 py-1 w-12 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <input
                      type="number"
                      min="0"
                      max="10"
                      step="0.5"
                      value={maxRating}
                      onChange={(e) => setMaxRating(parseFloat(e.target.value))}
                      className="bg-gray-800 text-white rounded-lg px-2 py-1 w-12 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <div className="text-gray-400 text-sm font-semibold">Release Year:</div>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      min="1900"
                      max={new Date().getFullYear()}
                      value={fromYear}
                      onChange={(e) => setFromYear(parseInt(e.target.value))}
                      className="bg-gray-800 text-white rounded-lg px-2 py-1 w-12 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <input
                      type="number"
                      min="1900"
                      max={new Date().getFullYear()}
                      value={toYear}
                      onChange={(e) => setToYear(parseInt(e.target.value))}
                      className="bg-gray-800 text-white rounded-lg px-2 py-1 w-12 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
                {/* Include Adult */}
                {/* <div className="flex justify-between items-center mb-2">
                  <div className="text-gray-400 text-sm font-semibold">Include Adult:</div>
                  <div className="flex space-x-2">
                    <input
                      type="checkbox"
                      id="includeAdult"
                      checked={includeAdult}
                      onChange={(e) => setIncludeAdult(e.target.checked)}
                      className="rounded text-indigo-600 focus:ring-indigo-500"
                    />
                  </div>
                </div> */}
                <div className="flex justify-between items-center mb-2">
                  <div className="text-gray-400 text-sm font-semibold">Sort By:</div>
                  <div className="flex space-x-2">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="bg-gray-800 text-white rounded px-2 py-1 w-24 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="popularity.desc">Popularity (Descending)</option>
                      <option value="popularity.asc">Popularity (Ascending)</option>
                      <option value="vote_average.desc">Rating (Descending)</option>
                      <option value="vote_average.asc">Rating (Ascending)</option>
                      <option value="release_date.desc">Release Date (Descending)</option>
                      <option value="release_date.asc">Release Date (Ascending)</option>
                      <option value="revenue.desc">Revenue (Descending)</option>
                      <option value="revenue.asc">Revenue (Ascending)</option>
                    </select>
                  </div>
                </div>
                
                {/* Keyword Search */}
                <div className="mb-4">
                  <div className="text-gray-400 text-sm font-semibold mb-2">Keywords:</div>
                  <div className="relative">
                    <input
                      type="text"
                      value={keywordQuery}
                      onChange={(e) => setKeywordQuery(e.target.value)}
                      placeholder="Search for keywords..."
                      className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    {isSearchingKeywords && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-indigo-500"></div>
                      </div>
                    )}
                  </div>
                  
                  {/* Keyword Results */}
                  {keywordResults.length > 0 && (
                    <div className="bg-gray-800 rounded-lg mb-3 max-h-40 overflow-y-auto">
                      {keywordResults.map(keyword => (
                        <div 
                          key={keyword.id}
                          onClick={() => handleAddKeyword(keyword)}
                          className="px-3 py-2 hover:bg-gray-700 cursor-pointer transition-colors"
                        >
                          {keyword.name}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Selected Keywords */}
                  {selectedKeywords.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedKeywords.map(keyword => (
                        <div 
                          key={keyword.id}
                          className="bg-indigo-600/50 text-white px-2 py-1 rounded-full text-sm flex items-center"
                        >
                          {keyword.name}
                          <button 
                            onClick={() => handleRemoveKeyword(keyword.id)}
                            className="ml-1 text-white/70 hover:text-white"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                      {selectedKeywords.length > 0 && (
                        <button 
                          onClick={() => setSelectedKeywords([])}
                          className="text-xs text-gray-400 hover:text-white underline"
                        >
                          Clear all
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        {/* Top navigation */}
        <div className="h-12 bg-gray-900/50 backdrop-blur-sm border-b border-gray-700 flex items-center px-4 relative z-20">
          <div className="flex-1">
            <div className="font-bold"># {selectedCategory.replace('_', ' ')}</div>
          </div>
          <div className="flex items-center space-x-4">
            {/* Search Bar */}
            <div className="relative">
              <div className="group relative">
                <button
                  onClick={() => setShowSearch(!showSearch)}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
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
                    className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
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

            {/* Profile Section */}
            <Link 
              to="/profile" 
              className="flex items-center space-x-2 group"
            >
              <div className="relative">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-800 group-hover:bg-indigo-600 transition-colors">
                  <img 
                    src={userProfileImage} 
                    alt={userName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-gray-900"></div>
              </div>
              <span className="text-gray-300 group-hover:text-white transition-colors">{userName}</span>
            </Link>
          </div>
        </div>

        {/* Movie content area */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {movies.map((movie) => (
              <div 
                key={movie.id}
                onClick={() => handleMovieClick(movie.id)}
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden hover:scale-105 transition-transform duration-300 group cursor-pointer"
              >
                {movie.poster_path ? (
                  <img 
                    src={`${imageBaseUrl}${movie.poster_path}`}
                    alt={movie.title}
                    className="w-full aspect-[2/3] object-cover"
                  />
                ) : (
                  <div className="w-full aspect-[2/3] bg-gray-700 flex items-center justify-center">
                    <span>No Image</span>
                  </div>
                )}
                <div className="p-2">
                  <h3 className="font-medium truncate">{movie.title}</h3>
                  <div className="flex justify-between items-center text-sm text-gray-400">
                    <span>{movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}</span>
                    <span className="bg-gray-700 px-1 rounded">⭐ {movie.vote_average.toFixed(1)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoviesPage; 