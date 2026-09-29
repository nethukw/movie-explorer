
import axios from "axios";

const api = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  params: { api_key: process.env.REACT_APP_TMDB_KEY },
  timeout: 10000,
});

export const IMG = "https://image.tmdb.org/t/p/w500";
export const getTrending = (page = 1) => api.get("/trending/movie/week", { params: { page } }).then((r) => r.data);
export const searchMovies = (query, page = 1) => api.get("/search/movie", { params: { query, page } }).then((r) => r.data);
export const getMovie = (id) => api.get(`/movie/${id}`, { params: { append_to_response: "credits,videos" } }).then((r) => r.data);

// Convert any axios error into a user-friendly message
export const errMsg = (e) => {
  if (!process.env.REACT_APP_TMDB_KEY) return "Missing TMDb API key. Add REACT_APP_TMDB_KEY to your .env file.";
  if (e.code === "ECONNABORTED" || !e.response) return "Network problem. Please check your connection and try again.";
  if (e.response.status === 401) return "Invalid TMDb API key.";
  if (e.response.status === 404) return "We couldn't find that movie.";
  if (e.response.status === 429) return "Too many requests. Please wait a moment.";
  return "Something went wrong. Please try again later.";
};

// genres + filtering
export const getGenres = () => api.get("/genre/movie/list").then((r) => r.data.genres);

export const searchMoviesFiltered = (query, page, year) => api.get("/search/movie", { params: { query, page, ...(year && { year }) } }).then((r) => r.data);

export const discoverMovies = (page, { genre, year, rating }) =>
  api.get("/discover/movie", { params: {
    page, sort_by: "popularity.desc", "vote_count.gte": 50,
    ...(genre && { with_genres: genre }), ...(year && { primary_release_year: year }), ...(rating && { "vote_average.gte": rating }),
  } }).then((r) => r.data);
