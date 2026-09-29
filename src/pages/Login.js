
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Paper, TextField, Button, Typography } from "@mui/material";
import { useApp } from "../context/AppContext";

export default function Login() {
  const { setUser } = useApp();
  const nav = useNavigate();
  const [u, setU] = useState("");
  const [p, setP] = useState("");
  const [err, setErr] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (!u.trim() || p.length < 4) return setErr("Enter a username and a password of at least 4 characters.");
    setUser({ name: u.trim() });
    nav("/");
  };
  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 8, px: 2 }}>
      <Paper component="form" onSubmit={submit} sx={{ p: 4, width: 360, display: "grid", gap: 2 }}>
        <Typography variant="h5">🎬 Movie Explorer</Typography>
        <TextField label="Username" value={u} onChange={(e) => setU(e.target.value)} />
        <TextField label="Password" type="password" value={p} onChange={(e) => setP(e.target.value)} error={!!err} helperText={err} />
        <Button type="submit" variant="contained">Log in</Button>
      </Paper>
    </Box>
  );
}
