import React, { useState, useEffect, useContext } from 'react';
import { getTrendingMovies, searchMovies, getGenres, discoverMovies } from '../api/tmdb';
import MovieCard from '../components/MovieCard';
import { MovieContext } from '../context/MovieContext'; 
import { 
  Container, Grid, Typography, Box, TextField, Button, CircularProgress, 
  Snackbar, Alert, FormControl, InputLabel, Select, MenuItem 
} from '@mui/material';

export default function Home() {
  const { lastSearch, setLastSearch } = useContext(MovieContext);

  const [movies, setMovies] = useState([]);
  const [query, setQuery] = useState(lastSearch || ''); 
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); 

  // Filter States
  const [genresList, setGenresList] = useState([]);
  const [genre, setGenre] = useState('');
  const [year, setYear] = useState('');
  const [rating, setRating] = useState('');

  // Get genres list on component mount
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const res = await getGenres();
        setGenresList(res.data.genres);
      } catch (err) {
        console.error("Failed to load genres", err);
      }
    };
    fetchGenres();
  }, []);

  // Function to fetch movies based on current state (trending, search, or filters)
  const fetchMovies = async (pageNumber, searchQuery = '', currentFilters = {}) => {
    setLoading(true);
    setError(null); 
    try {
      let response;
      if (searchQuery) {
        response = await searchMovies(searchQuery, pageNumber);
      } else if (currentFilters.genre || currentFilters.year || currentFilters.rating) {

        response = await discoverMovies(pageNumber, currentFilters);
      } else {

        response = await getTrendingMovies(pageNumber);
      }
      
      if (pageNumber === 1) {
        setMovies(response.data.results);
      } else {
        setMovies((prev) => [...prev, ...response.data.results]);
      }
    } catch (err) {
      console.error("Error fetching movies:", err);
      setError("Failed to fetch movies. Please check your internet connection.");
    }
    setLoading(false);
  };


  useEffect(() => {
    fetchMovies(page, query, { genre, year, rating });

  }, [page]);


  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    setGenre(''); 
    setYear('');
    setRating('');
    setLastSearch(query); 
    fetchMovies(1, query, {});
  };

  const handleFilterChange = () => {
    setPage(1);
    setQuery(''); 
    setLastSearch('');
    fetchMovies(1, '', { genre, year, rating });
  };


  useEffect(() => {
    if (genre || year || rating) {
      handleFilterChange();
    }

  }, [genre, year, rating]);

  const handleCloseError = () => setError(null);

  // Generate a list of years for the year filter dropdown (last 35 years)
  const currentYear = new Date().getFullYear();
  const years = Array.from(new Array(35), (val, index) => currentYear - index);

  return (
    <Container sx={{ py: 4 }}>
      {/* Search Bar */}
      <Box component="form" onSubmit={handleSearch} sx={{ display: 'flex', mb: 3, gap: 2 }}>
        <TextField fullWidth label="Search for a movie..." variant="outlined" value={query} onChange={(e) => setQuery(e.target.value)} />
        <Button type="submit" variant="contained" size="large">Search</Button>
      </Box>

      {/* Filters UI */}
      <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Genre</InputLabel>
          <Select value={genre} label="Genre" onChange={(e) => setGenre(e.target.value)}>
            <MenuItem value=""><em>All Genres</em></MenuItem>
            {genresList.map((g) => (
              <MenuItem key={g.id} value={g.id}>{g.name}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Year</InputLabel>
          <Select value={year} label="Year" onChange={(e) => setYear(e.target.value)}>
            <MenuItem value=""><em>All Years</em></MenuItem>
            {years.map((y) => (
              <MenuItem key={y} value={y}>{y}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Min Rating</InputLabel>
          <Select value={rating} label="Min Rating" onChange={(e) => setRating(e.target.value)}>
            <MenuItem value=""><em>Any Rating</em></MenuItem>
            <MenuItem value="8">8+ Stars</MenuItem>
            <MenuItem value="7">7+ Stars</MenuItem>
            <MenuItem value="6">6+ Stars</MenuItem>
            <MenuItem value="5">5+ Stars</MenuItem>
          </Select>
        </FormControl>

        <Button 
          variant="outlined" 
          color="secondary" 
          onClick={() => { setGenre(''); setYear(''); setRating(''); setQuery(''); fetchMovies(1); }}
          sx={{ ml: 'auto' }}
        >
          Clear Filters
        </Button>
      </Box>

      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
        {query ? `Search Results for "${query}"` : (genre || year || rating) ? 'Filtered Movies' : 'Trending Movies'}
      </Typography>

      <Grid container spacing={3}>
        {movies.map((movie, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={`${movie.id}-${index}`}>
            <MovieCard movie={movie} />
          </Grid>
        ))}
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        {loading ? (
          <CircularProgress />
        ) : (
          <Button 
            variant="outlined" 
            color="primary" 
            size="large"
            onClick={() => setPage((prev) => prev + 1)}
            disabled={movies.length === 0}
          >
            Load More
          </Button>
        )}
      </Box>

      <Snackbar open={!!error} autoHideDuration={6000} onClose={handleCloseError} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>{error}</Alert>
      </Snackbar>
    </Container>
  );
}