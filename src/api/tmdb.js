import axios from 'axios';

const tmdbApi = axios.create({
  baseURL: process.env.REACT_APP_TMDB_BASE_URL,
  params: {
    api_key: process.env.REACT_APP_TMDB_API_KEY,
  },
});

// Get trending movies
export const getTrendingMovies = (page = 1) => tmdbApi.get('/trending/movie/day', { params: { page } });

// Search movies
export const searchMovies = (query, page = 1) => tmdbApi.get('/search/movie', { params: { query, page } });

// Get movie details
export const getMovieDetails = (id) => tmdbApi.get(`/movie/${id}`);

export default tmdbApi;