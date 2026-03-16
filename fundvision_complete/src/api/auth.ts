/**
 * api/auth.ts  —  Authentication API calls
 */

import client from './client';

export interface UserMeta {
  id: number;
  email: string;
  full_name: string;
  first_name: string;
  initials: string;
  profile_picture_url: string | null;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user: UserMeta;
}

export interface RegisterPayload {
  email: string;
  first_name: string;
  last_name?: string;
  password: string;
  password_confirm: string;
}

// ─── Login ────────────────────────────────────────────────────────────────────
export async function login(email: string, password: string): Promise<LoginResponse> {
  const { data } = await client.post<LoginResponse>('/auth/login/', { email, password });
  // Persist tokens
  localStorage.setItem('access_token', data.access);
  localStorage.setItem('refresh_token', data.refresh);
  localStorage.setItem('user', JSON.stringify(data.user));
  return data;
}

// ─── Register ─────────────────────────────────────────────────────────────────
export async function register(payload: RegisterPayload): Promise<LoginResponse> {
  const { data } = await client.post<LoginResponse>('/auth/register/', payload);
  localStorage.setItem('access_token', data.access);
  localStorage.setItem('refresh_token', data.refresh);
  localStorage.setItem('user', JSON.stringify(data.user));
  return data;
}

// ─── Logout ───────────────────────────────────────────────────────────────────
export async function logout(): Promise<void> {
  const refresh = localStorage.getItem('refresh_token');
  try {
    if (refresh) await client.post('/auth/logout/', { refresh });
  } finally {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  }
}

// ─── Get current user from localStorage ──────────────────────────────────────
export function getCurrentUser(): UserMeta | null {
  try {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// ─── Check auth status with server ───────────────────────────────────────────
export async function checkAuth(): Promise<UserMeta | null> {
  try {
    const { data } = await client.get('/auth/check/');
    if (data.authenticated) {
      localStorage.setItem('user', JSON.stringify(data.user));
      return data.user;
    }
    return null;
  } catch {
    return null;
  }
}

// ─── Watchlist toggle ─────────────────────────────────────────────────────────
export async function toggleWatchlist(stock_symbol: string, stock_name: string) {
  const { data } = await client.post('/auth/watchlist/toggle/', { stock_symbol, stock_name });
  return data;
}

// ─── Check if a stock is followed ────────────────────────────────────────────
export async function checkWatchlist(symbol: string): Promise<boolean> {
  try {
    const { data } = await client.get(`/auth/watchlist/check/${symbol}/`);
    return data.following;
  } catch {
    return false;
  }
}
