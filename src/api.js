import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://collab-notes-server.onrender.com/';

export const api = axios.create({ baseURL: API_URL });
