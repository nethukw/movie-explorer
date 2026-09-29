# 🎬 Movie Explorer

React app to search movies, view details and trailers, and keep a favorites list, powered by the TMDb API.

## 🔗 Live Demo
Live Link: https://movieexplorerbynethukzz.netlify.app/

## Setup
1. Install dependencies: 
    `npm install`
2. Get a free API key at https://www.themoviedb.org/settings/api
3. Copy `.env.copy` to `.env` and set `REACT_APP_TMDB_KEY`
4. Start the development server: `npm start` → http://localhost:3000

## API usage (axios, `src/api/tmdb.js`)
- `GET /trending/movie/week` – trending
- `GET /search/movie` – search (paginated)
- `GET /movie/{id}?append_to_response=credits,videos` – details, cast, trailer

## Features
- Login (demo only: any username + 4+ char password; no backend)
- Trending grid, search with infinite scroll, poster/title/year/rating cards
- Movie details: overview, genres, cast, embedded YouTube trailer
- Favorites list and last search persisted in localStorage
- Light/dark mode, mobile-first responsive grid
- Friendly error messages (bad key, network, 404, rate limit)
- State via React Context (`src/context/AppContext.js`)

## Bonus features 
- Filter by genre, year and minimum rating (`/discover/movie`; when searching, year uses the search API and genre/rating are filtered client-side)
- YouTube trailer embedded on the details page (from TMDb `videos`)
- Toggle between infinite scroll and a "Load more" button (choice is remembered)
