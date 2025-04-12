import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const MovieRecommendations = ({ apiKey, imageBaseUrl }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setIsLoading(true);
        // Fetch popular movies as recommendations
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=1`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch recommendations');
        }
        const data = await response.json();
        setRecommendations(data.results.slice(0, 6)); // Show top 6 recommendations
      } catch (err) {
        setError(err.message);
        console.error("Error fetching recommendations:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, [apiKey]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        Error loading recommendations: {error}
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-gray-900/50 to-gray-900/80 py-16 px-4 sm:px-6 lg:px-8 mt-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-white mb-8 text-center">
          <span className="inline-block pb-2 border-b-2 border-blue-500">Recommended for You</span>
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {recommendations.map((movie) => (
            <Link 
              key={movie.id}
              to={`/movie/${movie.id}`}
              className="group relative block bg-gray-800/50 rounded-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:bg-gray-800 hover:shadow-xl hover:shadow-blue-500/10"
            >
              <div className="aspect-w-2 aspect-h-3">
                <img
                  src={`${imageBaseUrl}${movie.poster_path}`}
                  alt={movie.title}
                  className="object-cover w-full h-full"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-white text-sm font-medium line-clamp-2">
                      {movie.title}
                    </h3>
                    <p className="text-gray-300 text-xs mt-1">
                      {new Date(movie.release_date).getFullYear()}
                    </p>
                    <div className="flex items-center mt-1">
                      <svg 
                        className="w-4 h-4 text-yellow-400" 
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-gray-300 text-xs ml-1">
                        {movie.vote_average.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

MovieRecommendations.propTypes = {
  apiKey: PropTypes.string.isRequired,
  imageBaseUrl: PropTypes.string.isRequired,
};

export default MovieRecommendations;
