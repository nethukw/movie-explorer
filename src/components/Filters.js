
import React, { useEffect, useState } from "react";
import { Box, TextField, MenuItem, ToggleButton, ToggleButtonGroup, Button } from "@mui/material";
import { getGenres } from "../api/tmdb";

export default function Filters({ filters, setFilters, mode, setMode }) {
  const [genres, setGenres] = useState([]);
  useEffect(() => { getGenres().then(setGenres).catch(() => {}); }, []);
  const set = (k) => (e) => setFilters({ ...filters, [k]: e.target.value });
  const years = Array.from({ length: 60 }, (_, i) => new Date().getFullYear() - i);

  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 3, alignItems: "center" }}>
      <TextField select size="small" label="Genre" value={filters.genre} onChange={set("genre")} sx={{ minWidth: 140, flex: "1 1 140px" }}>
        <MenuItem value="">All</MenuItem>
        {genres.map((g) => <MenuItem key={g.id} value={g.id}>{g.name}</MenuItem>)}
      </TextField>
      <TextField select size="small" label="Year" value={filters.year} onChange={set("year")} sx={{ minWidth: 110, flex: "1 1 110px" }}>
        <MenuItem value="">Any</MenuItem>
        {years.map((y) => <MenuItem key={y} value={y}>{y}</MenuItem>)}
      </TextField>
      <TextField select size="small" label="Min rating" value={filters.rating} onChange={set("rating")} sx={{ minWidth: 120, flex: "1 1 120px" }}>
        <MenuItem value="">Any</MenuItem>
        {[5, 6, 7, 8, 9].map((r) => <MenuItem key={r} value={r}>{r}+ ⭐</MenuItem>)}
      </TextField>
      <Button onClick={() => setFilters({ genre: "", year: "", rating: "" })}>Reset</Button>
      <ToggleButtonGroup size="small" exclusive value={mode} onChange={(_, v) => v && setMode(v)}>
        <ToggleButton value="infinite">Infinite scroll</ToggleButton>
        <ToggleButton value="button">Load more</ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
}
