import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Alert, Box, Button, Chip, CircularProgress, Grid, IconButton, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { getMovie, errMsg, IMG } from "../api/tmdb";
import { useApp } from "../context/AppContext";

export default function MovieDetails() {
  const { id } = useParams();
  const nav = useNavigate();
  const { isFav, toggleFav } = useApp();
  const [m, setM] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    setM(null); setError("");
    getMovie(id).then(setM).catch((e) => setError(errMsg(e)));
  }, [id]);

  if (error) return <Alert severity="error">{error}</Alert>;
  if (!m) return <Box sx={{ textAlign: "center", mt: 8 }}><CircularProgress /></Box>;

  const trailer = m.videos?.results.find((v) => v.site === "YouTube" && v.type === "Trailer");
  return (
    <>
      <Button startIcon={<ArrowBackIcon />} onClick={() => nav(-1)} sx={{ mb: 2 }}>Back</Button>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Box component="img" sx={{ width: "100%", borderRadius: 2 }} alt={m.title}
            src={m.poster_path ? IMG + m.poster_path : "https://placehold.co/500x750?text=No+Poster"} />
        </Grid>
        <Grid item xs={12} md={8}>
          <Typography variant="h4">{m.title} <IconButton onClick={() => toggleFav(m)} sx={{ color: "#f44" }}>{isFav(m.id) ? <FavoriteIcon /> : <FavoriteBorderIcon />}</IconButton></Typography>
          <Typography color="text.secondary" sx={{ mb: 1 }}>
            {m.release_date?.slice(0, 4)} · {m.runtime} min · ⭐ {m.vote_average?.toFixed(1)}
          </Typography>
          <Box sx={{ mb: 2 }}>{m.genres.map((g) => <Chip key={g.id} label={g.name} sx={{ mr: 1, mb: 1 }} />)}</Box>
          <Typography paragraph>{m.overview || "No overview available."}</Typography>
          <Typography variant="h6">Cast</Typography>
          <Box sx={{ mb: 2 }}>{m.credits?.cast.slice(0, 10).map((c) => <Chip key={c.id} variant="outlined" label={c.name} sx={{ mr: 1, mb: 1 }} />)}</Box>
          {trailer ? (
            <Box sx={{ position: "relative", pt: "56.25%" }}>
              <iframe title="Trailer" src={`https://www.youtube.com/embed/${trailer.key}`} allowFullScreen
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0, borderRadius: 8 }} />
            </Box>
          ) : <Typography color="text.secondary">No trailer available.</Typography>}
        </Grid>
      </Grid>
    </>
  );
}
