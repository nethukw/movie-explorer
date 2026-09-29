import React, { useState, useEffect, useContext } from 'react';
import { getTrendingMovies, searchMovies } from '../api/tmdb';
import MovieCard from '../components/MovieCard';
import { MovieContext } from '../context/MovieContext'; 
import { Container, Grid, Typography, Box, TextField, Button, CircularProgress, Snackbar, Alert } from '@mui/material';

export default function Home() {
  const { lastSearch, setLastSearch } = useContext(MovieContext);

  const [movies, setMovies] = useState([]);
  const [query, setQuery] = useState(lastSearch || ''); 
  const [page, setPage] = useState(1);
  const [isSearching, setIsSearching] = useState(!!lastSearch); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); 

  const fetchMovies = async (pageNumber, searchQuery = '') => {
    setLoading(true);
    setError(null); 
    try {
      let response;
      if (searchQuery) {
        response = await searchMovies(searchQuery, pageNumber);
        setIsSearching(true);
      } else {
        response = await getTrendingMovies(pageNumber);
        setIsSearching(false);
      }
      
      if (pageNumber === 1) {
        setMovies(response.data.results);
      } else {
        setMovies((prev) => [...prev, ...response.data.results]);
      }
    } catch (err) {
      console.error("Error fetching movies:", err);
      setError("Failed to fetch movies. Please check your internet connection and try again.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMovies(page, query);
    // eslint-disable-next-line
  }, [page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    setLastSearch(query); 
    fetchMovies(1, query);
  };

  const handleCloseError = () => setError(null);

  return (
    <Container sx={{ py: 4 }}>
      <Box component="form" onSubmit={handleSearch} sx={{ display: 'flex', mb: 4, gap: 2 }}>
        <TextField fullWidth label="Search for a movie..." variant="outlined" value={query} onChange={(e) => setQuery(e.target.value)} />
        <Button type="submit" variant="contained" size="large">Search</Button>
      </Box>

      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
        {isSearching ? `Search Results for "${query}"` : 'Trending Movies'}
      </Typography>

      <Grid container spacing={3}>
        {movies.map((movie, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={`${movie.id}-${index}`}>
            <MovieCard movie={movie} />
          </Grid>
        ))}
      </Grid>

      {/* Load More Button */}
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
        <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
}