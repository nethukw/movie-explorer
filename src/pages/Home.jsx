import React, { useState, useEffect } from 'react';
import { getTrendingMovies, searchMovies } from '../api/tmdb';
import MovieCard from '../components/MovieCard';
import { Container, Grid, Typography, Box, TextField, Button, CircularProgress } from '@mui/material';

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [isSearching, setIsSearching] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch movies based on whether the user is searching or viewing trending
  const fetchMovies = async (pageNumber, searchQuery = '') => {
    setLoading(true);
    try {
      let response;
      if (searchQuery) {
        response = await searchMovies(searchQuery, pageNumber);
        setIsSearching(true);
      } else {
        response = await getTrendingMovies(pageNumber);
        setIsSearching(false);
      }
      
      // If it's page 1, replace the list. If it's Load More, append to the list.
      if (pageNumber === 1) {
        setMovies(response.data.results);
      } else {
        setMovies((prev) => [...prev, ...response.data.results]);
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
    setLoading(false);
  };

  // Initial load for trending movies
  useEffect(() => {
    fetchMovies(page, query);

  }, [page]);

  // Handle Search input submission
  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1); 
    fetchMovies(1, query);
  };

  return (
    <Container sx={{ py: 4 }}>
      {/* Search Bar Section */}
      <Box component="form" onSubmit={handleSearch} sx={{ display: 'flex', mb: 4, gap: 2 }}>
        <TextField
          fullWidth
          label="Search for a movie..."
          variant="outlined"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button type="submit" variant="contained" size="large">
          Search
        </Button>
      </Box>

      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
        {isSearching ? `Search Results for "${query}"` : 'Trending Movies'}
      </Typography>

      {/* Movie Grid Section */}
      <Grid container spacing={3}>
        {movies.map((movie, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={`${movie.id}-${index}`}>
            <MovieCard movie={movie} />
          </Grid>
        ))}
      </Grid>

      {/* Load More Button Section */}
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
    </Container>
  );
}