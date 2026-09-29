import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getMovieDetails } from '../api/tmdb';
import { Container, Typography, Box, Grid, Chip, CardMedia, CircularProgress } from '@mui/material';

export default function MovieDetails() {
  const { id } = useParams(); 
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await getMovieDetails(id);
        setMovie(response.data);
      } catch (error) {
        console.error("Error fetching movie details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;
  if (!movie) return <Typography align="center" mt={10}>Movie not found.</Typography>;

  // Find the first YouTube trailer available
  const trailer = movie.videos?.results?.find((vid) => vid.site === 'YouTube' && vid.type === 'Trailer');
  const imageUrl = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://via.placeholder.com/500x750';

  return (
    <Container sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {/* Left Column: Movie Poster */}
        <Grid item xs={12} md={4}>
          <CardMedia component="img" image={imageUrl} alt={movie.title} sx={{ borderRadius: 2, boxShadow: 3 }} />
        </Grid>

        {/* Right Column: Movie Info */}
        <Grid item xs={12} md={8}>
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            {movie.title} ({movie.release_date?.split('-')[0]})
          </Typography>
          
          <Box sx={{ mb: 2 }}>
            {movie.genres?.map((genre) => (
              <Chip key={genre.id} label={genre.name} sx={{ mr: 1, mb: 1 }} color="primary" variant="outlined" />
            ))}
          </Box>

          <Typography variant="h6" gutterBottom>Overview</Typography>
          <Typography variant="body1" paragraph>{movie.overview}</Typography>

          <Typography variant="h6" gutterBottom mt={3}>Top Cast</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {/* Display up to 5 cast members */}
            {movie.credits?.cast?.slice(0, 5).map((actor) => (
              <Chip key={actor.id} label={actor.name} />
            ))}
          </Box>

          {/* Trailer Section */}
          {trailer && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>Trailer</Typography>
              <Box sx={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: 2 }}>
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