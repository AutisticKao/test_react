import axios from "axios";

/**
 * Server-side proxy (Next.js API Routes) will use this baseURL.
 * Set in `.env.local` as: API_BASE_URL=http://localhost:8000/api/web/v1
 */
const api = axios.create({
  baseURL: process.env.API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

export default api;
