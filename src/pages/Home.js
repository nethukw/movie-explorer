
import React, { useEffect, useRef, useState } from "react";
import { Alert, Box, Button, CircularProgress, Typography } from "@mui/material";
import SearchBar from "../components/SearchBar";
import Filters from "../components/Filters";
import MovieGrid from "../components/MovieGrid";
import { getTrending, searchMoviesFiltered, discoverMovies, errMsg } from "../api/tmdb";
import { useApp } from "../context/AppContext";

export default function Home() {
  const { lastSearch, setLastSearch } = useApp();
  const [query, setQuery] = useState(lastSearch);
  const [filters, setFilters] = useState({ genre: "", year: "", rating: "" });
  const [mode, setModeState] = useState(() => localStorage.getItem("me_scroll") || "infinite");
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const sentinel = useRef();
  const filtered = !!(filters.genre || filters.year || filters.rating);

  const setMode = (m) => { setModeState(m); localStorage.setItem("me_scroll", m); };
  const onSearch = (q) => { setQuery(q); setLastSearch(q); };

  // Reset list whenever the data source changes
  useEffect(() => { setMovies([]); setPage(1); setTotal(1); }, [query, filters]);

  useEffect(() => {
    let cancel = false;
    setLoading(true); setError("");
    const req = query ? searchMoviesFiltered(query, page, filters.year) : filtered ? discoverMovies(page, filters) : getTrending(page);
    req.then((d) => {
      if (cancel) return;
      let r = d.results;
      if (query) { 
        if (filters.genre) r = r.filter((m) => m.genre_ids.includes(+filters.genre));
        if (filters.rating) r = r.filter((m) => m.vote_average >= +filters.rating);
      }
      setMovies((m) => (page === 1 ? r : [...m, ...r]));
      setTotal(d.total_pages);
    }).catch((e) => !cancel && setError(errMsg(e))).finally(() => !cancel && setLoading(false));
    return () => { cancel = true; };
  }, [query, filters, filtered, page]);

  // Infinite-scroll mode only
  useEffect(() => {
    const el = sentinel.current;
    if (mode !== "infinite" || !el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting && !loading && !error && page < total) setPage((p) => p + 1); });
    io.observe(el);
    return () => io.disconnect();
  }, [mode, loading, error, page, total]);

  const title = query ? `Results for "${query}"` : filtered ? "Filtered movies" : "Trending this week";
  return (
    <>
      <SearchBar key={query} initial={query} onSearch={onSearch} />
      <Filters filters={filters} setFilters={setFilters} mode={mode} setMode={setMode} />
      <Typography variant="h5" sx={{ mb: 2 }}>{title}</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {!loading && !error && movies.length === 0 && <Alert severity="info">No movies found.</Alert>}
      <MovieGrid movies={movies} />
      <Box ref={sentinel} sx={{ display: "flex", justifyContent: "center", py: 4 }}>
        {loading && <CircularProgress />}
        {!loading && mode === "button" && page < total && <Button variant="contained" onClick={() => setPage((p) => p + 1)}>Load more</Button>}
      </Box>
    </>
  );
}
