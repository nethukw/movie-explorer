
import React, { createContext, useContext, useEffect, useState } from "react";

const Ctx = createContext();
export const useApp = () => useContext(Ctx);

function useLocal(key, initial) {
  const [v, setV] = useState(() => {
    try { const s = localStorage.getItem(key); return s !== null ? JSON.parse(s) : initial; } catch { return initial; }
  });
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(v)); } catch {} }, [key, v]);
  return [v, setV];
}

export function AppProvider({ children }) {
  const [mode, setMode] = useLocal("me_mode", "dark");
  const [user, setUser] = useLocal("me_user", null);
  const [favorites, setFavorites] = useLocal("me_favs", []);
  const [lastSearch, setLastSearch] = useLocal("me_last", "");

  const toggleMode = () => setMode((m) => (m === "dark" ? "light" : "dark"));
  const isFav = (id) => favorites.some((m) => m.id === id);
  const toggleFav = (m) =>
    setFavorites((f) => (f.some((x) => x.id === m.id) ? f.filter((x) => x.id !== m.id)
      : [...f, { id: m.id, title: m.title, poster_path: m.poster_path, release_date: m.release_date, vote_average: m.vote_average }]));

  return (
    <Ctx.Provider value={{ mode, toggleMode, user, setUser, favorites, isFav, toggleFav, lastSearch, setLastSearch }}>
      {children}
    </Ctx.Provider>
  );
}
