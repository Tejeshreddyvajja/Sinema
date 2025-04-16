import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';

const MovieDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState([]);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [watchProviders, setWatchProviders] = useState(null);
  const [collection, setCollection] = useState(null);

  // Get API key and image base URL from location state
  const { apiKey, imageBaseUrl } = location.state || {};

  useEffect(() => {
    const fetchMovieDetails = async () => {
      if (!apiKey || !imageBaseUrl) {
        setError('Missing API credentials');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        // Fetch movie details
        const movieResponse = await fetch(
          `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=en-US`
        );
        
        // Fetch cast
        const castResponse = await fetch(
          `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${apiKey}`
        );

        // Fetch similar movies
        const similarResponse = await fetch(
          `https://api.themoviedb.org/3/movie/${id}/similar?api_key=${apiKey}&language=en-US&page=1`
        );

        // Fetch recommendations
        const recommendationsResponse = await fetch(
          `https://api.themoviedb.org/3/movie/${id}/recommendations?api_key=${apiKey}&language=en-US&page=1`
        );

        // Fetch reviews
        const reviewsResponse = await fetch(
          `https://api.themoviedb.org/3/movie/${id}/reviews?api_key=${apiKey}&language=en-US&page=1`
        );

        // Fetch videos
        const videosResponse = await fetch(
          `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${apiKey}&language=en-US`
        );

        // Fetch watch providers
        const watchProvidersResponse = await fetch(
          `https://api.themoviedb.org/3/movie/${id}/watch/providers?api_key=${apiKey}`
        );

        if (!movieResponse.ok || !castResponse.ok || !similarResponse.ok || 
            !recommendationsResponse.ok || !reviewsResponse.ok || !videosResponse.ok ||
            !watchProvidersResponse.ok) {
          throw new Error('Failed to fetch movie data');
        }

        const movieData = await movieResponse.json();
        const castData = await castResponse.json();
        const similarData = await similarResponse.json();
        const recommendationsData = await recommendationsResponse.json();
        const reviewsData = await reviewsResponse.json();
        const videosData = await videosResponse.json();
        const watchProvidersData = await watchProvidersResponse.json();

        // Fetch collection data if movie belongs to a collection
        if (movieData.belongs_to_collection) {
          try {
            const collectionResponse = await fetch(
              `https://api.themoviedb.org/3/collection/${movieData.belongs_to_collection.id}?api_key=${apiKey}&language=en-US`
            );
            
            if (collectionResponse.ok) {
              const collectionData = await collectionResponse.json();
              setCollection(collectionData);
            }
          } catch (error) {
            console.error('Error fetching collection data:', error);
          }
        } else {
          setCollection(null);
        }

        setMovie(movieData);
        setCast(castData.cast.slice(0, 10));
        setSimilarMovies(similarData.results.slice(0, 6));
        setRecommendations(recommendationsData.results.slice(0, 6));
        setReviews(reviewsData.results);
        setVideos(videosData.results);
        setWatchProviders(watchProvidersData.results);

        // Check if movie is in watchlist (you would implement this with your backend)
        // For now, we'll just set it to false
        setIsInWatchlist(false);
      } catch (error) {
        console.error('Error fetching movie details:', error);
        setError('Failed to load movie details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id, apiKey]);

  const handleWatchlistToggle = () => {
    // Implement watchlist toggle functionality
    setIsInWatchlist(!isInWatchlist);
    // You would typically make an API call here to update the watchlist
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const title = movie.title;
    const text = `Check out ${title} on Sinema!`;

    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${text}%20${url}`, '_blank');
        break;
      default:
        break;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#08369a] to-[#000000] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#08369a] to-[#000000] flex items-center justify-center">
        <div className="text-white text-xl">{error}</div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#08369a] to-[#000000] flex items-center justify-center">
        <div className="text-white text-xl">Movie not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#08369a] to-[#000000]">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="fixed top-4 left-4 bg-gray-800/50 hover:bg-gray-700/50 text-white p-2 rounded-full z-50"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </button>

      {/* Movie backdrop */}
      <div className="relative h-[60vh] w-full">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: `url(${imageBaseUrl}${movie.backdrop_path})`,
            // filter: 'blur(0.5px) brightness(0.8)'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#08369a] to-transparent" />
      </div>

      {/* Movie content */}
      <div className="container mx-auto px-4 -mt-48 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Movie poster */}
          <div className="w-full md:w-1/3 lg:w-1/4">
            <div className="rounded-xl overflow-hidden shadow-2xl">
              <img
                src={`${imageBaseUrl}${movie.poster_path}`}
                alt={movie.title}
                className="w-full h-auto"
              />
            </div>
          </div>

          {/* Movie details */}
          <div className="w-full md:w-2/3 lg:w-3/4 text-white">
            <h1 className="text-4xl font-bold mb-4">{movie.title}</h1>
            
            {/* Rating and year */}
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex items-center">
                <svg className="w-6 h-6 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-xl">{movie.vote_average.toFixed(1)}</span>
              </div>
              <span className="text-xl">{new Date(movie.release_date).getFullYear()}</span>
              <span className="text-xl">{movie.runtime} min</span>
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-2 mb-6">
              {movie.genres.map((genre) => (
                <span
                  key={genre.id}
                  className="px-3 py-1 bg-indigo-600/50 rounded-full text-sm"
                >
                  {genre.name}
                </span>
              ))}
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-4 mb-8">
              {/* Watch trailer button */}
              {videos.length > 0 && (
                <button
                  onClick={() => window.open(`https://www.youtube.com/watch?v=${videos[0].key}`, '_blank')}
                  className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                  </svg>
                  Watch Trailer
                </button>
              )}

              {/* Add to watchlist button */}
              <button
                onClick={handleWatchlistToggle}
                className={`px-6 py-3 rounded-lg transition-colors flex items-center ${
                  isInWatchlist 
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                    : 'bg-gray-800 text-white hover:bg-gray-700'
                }`}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                {isInWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
              </button>

              {/* Social sharing buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleShare('twitter')}
                  className="p-3 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </button>
                <button
                  onClick={() => handleShare('facebook')}
                  className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </button>
                <button
                  onClick={() => handleShare('whatsapp')}
                  className="p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="mb-8">
              <div className="flex space-x-4 border-b border-gray-700">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`pb-2 px-4 ${activeTab === 'overview' ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-gray-400 hover:text-white'}`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('cast')}
                  className={`pb-2 px-4 ${activeTab === 'cast' ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-gray-400 hover:text-white'}`}
                >
                  Cast
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`pb-2 px-4 ${activeTab === 'reviews' ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-gray-400 hover:text-white'}`}
                >
                  Reviews
                </button>
                <button
                  onClick={() => setActiveTab('similar')}
                  className={`pb-2 px-4 ${activeTab === 'similar' ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-gray-400 hover:text-white'}`}
                >
                  Similar Movies
                </button>
                <button
                  onClick={() => setActiveTab('recommendations')}
                  className={`pb-2 px-4 ${activeTab === 'recommendations' ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-gray-400 hover:text-white'}`}
                >
                  Recommendations
                </button>
              </div>

              {/* Tab content */}
              <div className="mt-6">
                {activeTab === 'overview' && (
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Overview</h2>
                    <p className="text-gray-300 text-lg mb-8">{movie.overview}</p>
                    
                    {/* Collections & Franchises Section */}
                    {collection && (
                      <div className="mb-8">
                        <h3 className="text-xl font-bold mb-4">Part of the {collection.name}</h3>
                        <div className="relative overflow-hidden rounded-xl mb-4">
                          {collection.backdrop_path && (
                            <img 
                              src={`${imageBaseUrl}${collection.backdrop_path}`} 
                              alt={collection.name}
                              className="w-full h-48 object-cover"
                            />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
                          <div className="absolute bottom-0 left-0 p-4">
                            <h4 className="text-lg font-bold">{collection.name}</h4>
                            <p className="text-sm text-gray-300">{collection.parts?.length || 0} Movies</p>
                          </div>
                        </div>
                        
                        <p className="text-gray-300 mb-4">{collection.overview}</p>
                        
                        {collection.parts && collection.parts.length > 0 && (
                          <div>
                            <h4 className="text-lg font-semibold mb-2">Movies in this Collection</h4>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                              {collection.parts
                                .sort((a, b) => new Date(a.release_date || '9999') - new Date(b.release_date || '9999'))
                                .map((movie) => (
                                  <div 
                                    key={movie.id} 
                                    className="cursor-pointer group"
                                    onClick={() => navigate(`/movie/${movie.id}`, { state: { apiKey, imageBaseUrl } })}
                                  >
                                    <div className="relative overflow-hidden rounded-lg mb-2">
                                      {movie.poster_path ? (
                                        <img
                                          src={`${imageBaseUrl}${movie.poster_path}`}
                                          alt={movie.title}
                                          className="w-full h-auto transition-transform duration-300 group-hover:scale-110"
                                        />
                                      ) : (
                                        <div className="bg-gray-800 aspect-[2/3] flex items-center justify-center">
                                          <span className="text-gray-500 text-sm">No Poster</span>
                                        </div>
                                      )}
                                      {movie.id === parseInt(id) && (
                                        <div className="absolute inset-0 bg-indigo-600/60 flex items-center justify-center">
                                          <span className="text-white font-bold">Current Movie</span>
                                        </div>
                                      )}
                                    </div>
                                    <h5 className="text-sm font-medium truncate group-hover:text-indigo-400">{movie.title}</h5>
                                    {movie.release_date && (
                                      <p className="text-xs text-gray-400">{new Date(movie.release_date).getFullYear()}</p>
                                    )}
                                  </div>
                                ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Watch Providers Section */}
                    {watchProviders && Object.keys(watchProviders).length > 0 && (
                      <div className="mb-8">
                        <h3 className="text-xl font-bold mb-4">Where to Watch</h3>
                        <div className="grid grid-cols-1 gap-6">
                          {watchProviders.US && (
                            <div>
                              <h4 className="text-lg font-semibold mb-2">United States</h4>
                              
                              {/* Streaming */}
                              {watchProviders.US.flatrate && watchProviders.US.flatrate.length > 0 && (
                                <div className="mb-4">
                                  <h5 className="text-md font-medium text-gray-400 mb-2">Stream</h5>
                                  <div className="flex flex-wrap gap-3">
                                    {watchProviders.US.flatrate.map(provider => (
                                      <div key={provider.provider_id} className="flex flex-col items-center">
                                        <div className="w-12 h-12 rounded-lg overflow-hidden mb-1">
                                          <img 
                                            src={`${imageBaseUrl}${provider.logo_path}`} 
                                            alt={provider.provider_name}
                                            className="w-full h-full object-cover"
                                          />
                                        </div>
                                        <span className="text-xs text-center text-gray-300">{provider.provider_name}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                              
                              {/* Rent */}
                              {watchProviders.US.rent && watchProviders.US.rent.length > 0 && (
                                <div className="mb-4">
                                  <h5 className="text-md font-medium text-gray-400 mb-2">Rent</h5>
                                  <div className="flex flex-wrap gap-3">
                                    {watchProviders.US.rent.map(provider => (
                                      <div key={provider.provider_id} className="flex flex-col items-center">
                                        <div className="w-12 h-12 rounded-lg overflow-hidden mb-1">
                                          <img 
                                            src={`${imageBaseUrl}${provider.logo_path}`} 
                                            alt={provider.provider_name}
                                            className="w-full h-full object-cover"
                                          />
                                        </div>
                                        <span className="text-xs text-center text-gray-300">{provider.provider_name}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                              
                              {/* Buy */}
                              {watchProviders.US.buy && watchProviders.US.buy.length > 0 && (
                                <div className="mb-4">
                                  <h5 className="text-md font-medium text-gray-400 mb-2">Buy</h5>
                                  <div className="flex flex-wrap gap-3">
                                    {watchProviders.US.buy.map(provider => (
                                      <div key={provider.provider_id} className="flex flex-col items-center">
                                        <div className="w-12 h-12 rounded-lg overflow-hidden mb-1">
                                          <img 
                                            src={`${imageBaseUrl}${provider.logo_path}`} 
                                            alt={provider.provider_name}
                                            className="w-full h-full object-cover"
                                          />
                                        </div>
                                        <span className="text-xs text-center text-gray-300">{provider.provider_name}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                              
                              {/* Link to watch */}
                              {watchProviders.US.link && (
                                <a 
                                  href={watchProviders.US.link} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors mt-2"
                                >
                                  View All Watch Options
                                </a>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* Additional info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-xl font-bold mb-2">Status</h3>
                        <p className="text-gray-300">{movie.status}</p>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold mb-2">Budget</h3>
                        <p className="text-gray-300">${movie.budget.toLocaleString()}</p>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold mb-2">Revenue</h3>
                        <p className="text-gray-300">${movie.revenue.toLocaleString()}</p>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold mb-2">Production Companies</h3>
                        <div className="flex flex-wrap gap-2">
                          {movie.production_companies.map((company) => (
                            <span key={company.id} className="text-gray-300">
                              {company.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'cast' && (
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Cast</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {cast.map((person) => (
                        <div key={person.id} className="text-center">
                          <div className="w-full aspect-square rounded-full overflow-hidden mb-2">
                            {person.profile_path ? (
                              <img
                                src={`${imageBaseUrl}${person.profile_path}`}
                                alt={person.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                                <span className="text-gray-400">No Image</span>
                              </div>
                            )}
                          </div>
                          <h3 className="text-white font-medium">{person.name}</h3>
                          <p className="text-gray-400 text-sm">{person.character}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="space-y-6">
                    {reviews.length > 0 ? (
                      reviews.map((review) => (
                        <div key={review.id} className="bg-gray-800 rounded-lg p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-4">
                              <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center">
                                <span className="text-xl font-bold text-white">
                                  {review.author.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold text-white">{review.author}</h3>
                                <p className="text-sm text-gray-400">
                                  {new Date(review.created_at).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-1">
                              <span className="text-yellow-400">★</span>
                              <span className="text-white">
                                {Math.round(review.author_details.rating / 2)}/5
                              </span>
                            </div>
                          </div>
                          <p className="text-gray-300 whitespace-pre-line">{review.content}</p>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-400">No reviews available for this movie.</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'similar' && (
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Similar Movies</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      {similarMovies.map((similarMovie) => (
                        <div
                          key={similarMovie.id}
                          onClick={() => navigate(`/movie/${similarMovie.id}`, { state: { apiKey, imageBaseUrl } })}
                          className="cursor-pointer group"
                        >
                          <div className="aspect-[2/3] rounded-lg overflow-hidden mb-2">
                            {similarMovie.poster_path ? (
                              <img
                                src={`${imageBaseUrl}${similarMovie.poster_path}`}
                                alt={similarMovie.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                                <span className="text-gray-400">No Image</span>
                              </div>
                            )}
                          </div>
                          <h3 className="text-white font-medium truncate group-hover:text-indigo-400">
                            {similarMovie.title}
                          </h3>
                          <div className="flex items-center text-sm text-gray-400">
                            <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            {similarMovie.vote_average.toFixed(1)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'recommendations' && (
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Recommendations</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      {recommendations.map((recommendedMovie) => (
                        <div
                          key={recommendedMovie.id}
                          onClick={() => navigate(`/movie/${recommendedMovie.id}`, { state: { apiKey, imageBaseUrl } })}
                          className="cursor-pointer group"
                        >
                          <div className="aspect-[2/3] rounded-lg overflow-hidden mb-2">
                            {recommendedMovie.poster_path ? (
                              <img
                                src={`${imageBaseUrl}${recommendedMovie.poster_path}`}
                                alt={recommendedMovie.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                                <span className="text-gray-400">No Image</span>
                              </div>
                            )}
                          </div>
                          <h3 className="text-white font-medium truncate group-hover:text-indigo-400">
                            {recommendedMovie.title}
                          </h3>
                          <div className="flex items-center text-sm text-gray-400">
                            <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            {recommendedMovie.vote_average.toFixed(1)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails; 