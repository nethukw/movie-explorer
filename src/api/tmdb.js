import axios from 'axios';

const tmdbApi = axios.create({
  baseURL: process.env.REACT_APP_TMDB_BASE_URL,
  params: {
    api_key: process.env.REACT_APP_TMDB_API_KEY,
  },
});

// Get trending movies
export const getTrendingMovies = () => tmdbApi.get('/trending/movie/day');

// Search movies
export const searchMovies = (query) => tmdbApi.get('/search/movie', { params: { query } });

// Get movie details
export const getMovieDetails = (id) => tmdbApi.get(`/movie/${id}`);

export default tmdbApi;