import React, { useContext } from 'react';
import { MovieContext } from '../context/MovieContext';
import MovieCard from '../components/MovieCard';
import { Container, Grid, Typography, Box } from '@mui/material';

export default function Favorites() {
  // Get favorites from Context API
  const { favorites } = useContext(MovieContext);

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
        My Favorite Movies
      </Typography>
      
      {/* Check if favorites list is empty */}
      {favorites.length === 0 ? (
        <Box sx={{ mt: 5, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            You haven't added any movies to your favorites yet.
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {favorites.map((movie, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={`${movie.id}-${index}`}>
              <MovieCard movie={movie} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}