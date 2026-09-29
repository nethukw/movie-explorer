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
export const getMovieDetails = (id) => 
  tmdbApi.get(`/movie/${id}`, {
    params: { append_to_response: 'credits,videos' }
  });

// Get genres list
export const getGenres = () => tmdbApi.get('/genre/movie/list');

// Filter movies based on genre, year, and rating
export const discoverMovies = (page = 1, filters = {}) => {
  return tmdbApi.get('/discover/movie', {
    params: {
      page,
      with_genres: filters.genre || undefined,
      primary_release_year: filters.year || undefined,
      'vote_average.gte': filters.rating || undefined, 
      sort_by: 'popularity.desc'
    }
  });
};

export default tmdbApi;