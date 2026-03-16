/**
 * api/client.ts
 * Central Axios instance for all FundVision API calls.
 * Handles: base URL, JWT auth headers, token refresh, and LOGIN_MODAL trigger.
 */

import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

export const API_BASE = 'http://localhost:8000/api/v1';
export const WS_BASE  = 'ws://localhost:8000';

const client = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// ─── Request interceptor — attach JWT access token ───────────────────────────
client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ─── Response interceptor — handle 401 and token refresh ─────────────────────
client.interceptors.response.use(
  (res) => res,
  async (error: AxiosError<{ trigger?: string; code?: number }>) => {
    const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    const status   = error.response?.status;
    const trigger  = error.response?.data?.trigger;

    // If backend returns LOGIN_MODAL trigger → dispatch custom event so Navbar opens login modal
    if (status === 401 && trigger === 'LOGIN_MODAL') {
      window.dispatchEvent(new CustomEvent('fundvision:login_required'));
      return Promise.reject(error);
    }

    // Auto-refresh expired access token (only once per request)
    if (status === 401 && !original._retry) {
      original._retry = true;
      const refresh = localStorage.getItem('refresh_token');
      if (refresh) {
        try {
          const { data } = await axios.post(`${API_BASE}/auth/token/refresh/`, { refresh });
          localStorage.setItem('access_token', data.access);
          original.headers.Authorization = `Bearer ${data.access}`;
          return client(original);
        } catch {
          // Refresh failed — clear tokens and fire login event
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          window.dispatchEvent(new CustomEvent('fundvision:login_required'));
        }
      }
    }
    return Promise.reject(error);
  }
);

export default client;
