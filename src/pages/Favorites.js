import React from "react";
import { Alert, Typography } from "@mui/material";
import MovieGrid from "../components/MovieGrid";
import { useApp } from "../context/AppContext";

export default function Favorites() {
  const { favorites } = useApp();
  return (
    <>
      <Typography variant="h5" sx={{ mb: 2 }}>My Favorites</Typography>
      {favorites.length ? <MovieGrid movies={favorites} /> : <Alert severity="info">No favorites yet. Tap the heart on any movie.</Alert>}
    </>
  );
}
