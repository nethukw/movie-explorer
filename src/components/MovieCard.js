import React from "react";
import { Link } from "react-router-dom";
import { Card, CardActionArea, CardMedia, CardContent, Typography, IconButton, Box } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import StarIcon from "@mui/icons-material/Star";
import { IMG } from "../api/tmdb";
import { useApp } from "../context/AppContext";

export default function MovieCard({ movie }) {
  const { isFav, toggleFav } = useApp();
  const year = movie.release_date ? movie.release_date.slice(0, 4) : "N/A";
  const poster = movie.poster_path ? IMG + movie.poster_path : "https://placehold.co/500x750?text=No+Poster";
  return (
    <Card sx={{ position: "relative", height: "100%" }}>
      <IconButton onClick={() => toggleFav(movie)} sx={{ position: "absolute", top: 4, right: 4, zIndex: 1, bgcolor: "rgba(0,0,0,.5)", color: "#f44" }}>
        {isFav(movie.id) ? <FavoriteIcon /> : <FavoriteBorderIcon sx={{ color: "#fff" }} />}
      </IconButton>
      <CardActionArea component={Link} to={`/movie/${movie.id}`}>
        <CardMedia component="img" image={poster} alt={movie.title} sx={{ aspectRatio: "2/3" }} />
        <CardContent sx={{ p: 1.5 }}>
          <Typography variant="subtitle2" noWrap>{movie.title}</Typography>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="caption" color="text.secondary">{year}</Typography>
            <Typography variant="caption" sx={{ display: "flex", alignItems: "center" }}>
              <StarIcon sx={{ fontSize: 14, color: "gold", mr: .3 }} />{movie.vote_average ? movie.vote_average.toFixed(1) : "–"}
            </Typography>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
