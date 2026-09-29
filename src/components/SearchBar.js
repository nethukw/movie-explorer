import React, { useState } from "react";
import { Paper, InputBase, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

export default function SearchBar({ initial, onSearch }) {
  const [text, setText] = useState(initial || "");
  const submit = (e) => { e.preventDefault(); onSearch(text.trim()); };
  return (
    <Paper component="form" onSubmit={submit} sx={{ display: "flex", alignItems: "center", px: 1, mb: 3 }}>
      <InputBase sx={{ flex: 1, ml: 1 }} placeholder="Search movies…" value={text} onChange={(e) => setText(e.target.value)} />
      {text && <IconButton onClick={() => { setText(""); onSearch(""); }}><ClearIcon /></IconButton>}
      <IconButton type="submit"><SearchIcon /></IconButton>
    </Paper>
  );
}
