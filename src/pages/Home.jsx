import React, { useState, useEffect } from 'react';
import { getTrendingMovies } from '../api/tmdb';
import { Button, Container, Grid, Typography, Box } from '@mui/material';

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);

  // Function to fetch trending movies from the API
  const fetchTrending = async (pageNumber) => {
    try {
      const response = await getTrendingMovies(pageNumber);
      // Append the new movies to the existing list
      setMovies((prev) => [...prev, ...response.data.results]);
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  useEffect(() => {
    fetchTrending(page);
  }, [page]); 

  return (
    <Container>
      <Typography variant="h4" sx={{ mb: 3 }}>Trending Movies</Typography>
      
      {/* Grid to display movies */}
      <Grid container spacing={3}>
        {movies.map((movie, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={`${movie.id}-${index}`}>
            <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 2 }}>
              <Typography variant="h6" noWrap>{movie.title || movie.name}</Typography>
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* Load more btn */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 4 }}>
        <Button 
          variant="contained" 
          color="secondary" 
          onClick={() => setPage((prev) => prev + 1)}
        >
          Load More
        </Button>
      </Box>
    </Container>
  );
}