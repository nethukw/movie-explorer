import React from 'react';
import { Card, CardMedia, CardContent, Typography, Box, Rating } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function MovieCard({ movie }) {
  const navigate = useNavigate();
  // Construct the image URL using TMDB base image path
  const imageUrl = movie.poster_path 
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` 
    : 'https://via.placeholder.com/500x750?text=No+Image';

  // Extract only the year from the release date
  const releaseYear = movie.release_date ? movie.release_date.split('-')[0] : 'Unknown';

  return (
    <Card 
      sx={{ cursor: 'pointer', height: '100%', display: 'flex', flexDirection: 'column' }}
      onClick={() => navigate(`/movie/${movie.id}`)} 
    >
      <CardMedia
        component="img"
        height="350"
        image={imageUrl}
        alt={movie.title}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" component="div" gutterBottom noWrap>
          {movie.title || movie.name}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            {releaseYear}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {/* Convert 10-point rating to 5-star rating */}
            <Rating value={movie.vote_average / 2} readOnly precision={0.5} size="small" />
            <Typography variant="body2" sx={{ ml: 1 }}>
              ({movie.vote_average?.toFixed(1)})
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}