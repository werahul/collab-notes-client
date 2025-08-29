# Collab Notes — Client (React + Vite)

Collaborative notes frontend built with React and Vite. Connects to the backend for REST APIs and uses Socket.IO for realtime note updates and active user presence.

## Requirements

- Node.js 18+

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure environment (optional): create a `.env` file with:
   ```bash
   VITE_API_URL=http://localhost:8000/
   ```
   - Defaults to `https://collab-notes-server.onrender.com/` if not set.

## Scripts

- `npm run dev`: start Vite dev server
- `npm run build`: production build
- `npm run preview`: preview built app
- `npm run lint`: run ESLint

## How it connects to the API

- Base URL is defined in `src/api.js`:
  ```js
  const API_URL = import.meta.env.VITE_API_URL || 'https://collab-notes-server.onrender.com/';
  export const api = axios.create({ baseURL: API_URL });
  ```

Ensure the trailing slash in `VITE_API_URL` (e.g., `http://localhost:8000/`).

## Development

1. Start the backend (see `../server/README.md`).
2. Start the client dev server:
   ```bash
   npm run dev
   ```
3. Open the printed localhost URL.

## Deploy

- Set `VITE_API_URL` in your hosting provider env settings to point at your backend.
