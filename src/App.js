import React, { useMemo } from "react";
import { Routes, Route, Navigate, Link } from "react-router-dom";
import { AppBar, Toolbar, Button, IconButton, Container, CssBaseline, ThemeProvider, createTheme, Typography } from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { useApp } from "./context/AppContext";
import Login from "./pages/Login";
import Home from "./pages/Home";
import MovieDetails from "./pages/MovieDetails";
import Favorites from "./pages/Favorites";

const Protected = ({ children }) => (useApp().user ? children : <Navigate to="/login" replace />);

export default function App() {
  const { mode, toggleMode, user, setUser } = useApp();
  const theme = useMemo(() => createTheme({ palette: { mode } }), [mode]);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="sticky" color="default" enableColorOnDark>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>🎬 Movie Explorer</Typography>
          {user && <><Button component={Link} to="/">Home</Button><Button component={Link} to="/favorites">Favorites</Button></>}
          <IconButton onClick={toggleMode} aria-label="toggle theme">{mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}</IconButton>
          {user && <Button onClick={() => setUser(null)}>Logout</Button>}
        </Toolbar>
      </AppBar>
      <Container sx={{ py: 3 }}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Protected><Home /></Protected>} />
          <Route path="/movie/:id" element={<Protected><MovieDetails /></Protected>} />
          <Route path="/favorites" element={<Protected><Favorites /></Protected>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Container>
    </ThemeProvider>
  );
}
