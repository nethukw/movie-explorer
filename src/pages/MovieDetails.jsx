import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { getMovieDetails } from '../api/tmdb';
import { MovieContext } from '../context/MovieContext';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Chip, 
  CardMedia, 
  CircularProgress, 
  Button, 
  Alert 
} from '@mui/material';
import { Favorite, FavoriteBorder } from '@mui/icons-material';

export default function MovieDetails() {
  const { id } = useParams(); 
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Consume favorites state and actions from MovieContext
  const { favorites, addFavorite, removeFavorite } = useContext(MovieContext);

  // Check if current movie is already in favorites
  const isFavorite = movie ? favorites.some((fav) => fav.id === movie.id) : false;

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getMovieDetails(id);
        setMovie(response.data);
      } catch (err) {
        console.error("Error fetching movie details:", err);
        // User-friendly error message
        setError("Could not load movie details. Please check your internet connection and try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  // Handle toggling favorite status
  const handleToggleFavorite = () => {
    if (!movie) return;
    if (isFavorite) {
      removeFavorite(movie.id);
    } else {
      addFavorite(movie);
    }
  };

  // Loading indicator
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Graceful error display
  if (error) {
    return (
      <Container sx={{ py: 6 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!movie) {
    return (
      <Container sx={{ py: 6 }}>
        <Typography align="center" variant="h6">Movie not found.</Typography>
      </Container>
    );
  }

  // Find the first YouTube trailer available
  const trailer = movie.videos?.results?.find((vid) => vid.site === 'YouTube' && vid.type === 'Trailer');
  const imageUrl = movie.poster_path 
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` 
    : 'https://via.placeholder.com/500x750?text=No+Image';

  return (
    <Container sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {/* Left Column: Movie Poster */}
        <Grid item xs={12} md={4}>
          <CardMedia 
            component="img" 
            image={imageUrl} 
            alt={movie.title} 
            sx={{ borderRadius: 2, boxShadow: 3, width: '100%' }} 
          />
        </Grid>

        {/* Right Column: Movie Info */}
        <Grid item xs={12} md={8}>
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            {movie.title} ({movie.release_date ? movie.release_date.split('-')[0] : 'N/A'})
          </Typography>
          
          {/* Favorite Button */}
          <Box sx={{ mb: 2 }}>
            <Button
              variant={isFavorite ? "contained" : "outlined"}
              color="error"
              startIcon={isFavorite ? <Favorite /> : <FavoriteBorder />}
              onClick={handleToggleFavorite}
            >
              {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
            </Button>
          </Box>

          {/* Genres Chips */}
          <Box sx={{ mb: 2 }}>
            {movie.genres?.map((genre) => (
              <Chip key={genre.id} label={genre.name} sx={{ mr: 1, mb: 1 }} color="primary" variant="outlined" />
            ))}
          </Box>

          {/* Overview */}
          <Typography variant="h6" gutterBottom>Overview</Typography>
          <Typography variant="body1" paragraph sx={{ lineHeight: 1.7 }}>
            {movie.overview || 'No overview available for this movie.'}
          </Typography>

          {/* Top Cast */}
          <Typography variant="h6" gutterBottom mt={3}>Top Cast</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {movie.credits?.cast?.slice(0, 6).map((actor) => (
              <Chip key={actor.id} label={actor.name} variant="filled" />
            ))}
          </Box>

          {/* Trailer Section */}
          {trailer && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>Official Trailer</Typography>
              <Box sx={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: 2, boxShadow: 2 }}>
                <iframe
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                  src={`https://www.youtube.com/embed/${trailer.key}`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </Box>
            </Box>
          )}
        </Grid>
      </Grid>
    </Container>
  );
}