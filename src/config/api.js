import axios from 'axios';

// Mengambil URL dengan dukungan beberapa variasi nama variabel environment
const rawBaseUrl =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_SUPABASE_URL ||
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_PUBLIC_SUPABASE_URL ||
  '';

// Mengambil Key dengan dukungan beberapa variasi nama variabel environment
const rawKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.VITE_SUPABASE_KEY ||
  import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY ||
  '';

// Membersihkan kutip, trailing slash, atau path /rest/v1 yang tidak sengaja tertulis
export const SUPABASE_URL = rawBaseUrl
  .trim()
  .replace(/^['"]|['"]$/g, '')
  .replace(/\/+$/, '')
  .replace(/\/rest\/v1\/?$/, '');

export const SUPABASE_KEY = rawKey.trim().replace(/^['"]|['"]$/g, '');

// Instance Axios khusus untuk REST API Supabase (PostgREST)
const apiClient = axios.create({
  baseURL: SUPABASE_URL ? `${SUPABASE_URL}/rest/v1` : '/rest/v1',
  headers: {
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation',
  },
  timeout: 15000,
});

// Interceptor request untuk mendeteksi variabel yang belum terpasang di Vercel
apiClient.interceptors.request.use((config) => {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    return Promise.reject(
      new Error(
        'Variabel environment Supabase belum terkonfigurasi di Vercel. Pastikan VITE_API_BASE_URL dan VITE_SUPABASE_PUBLISHABLE_KEY sudah diatur di Vercel Settings, lalu lakukan Redeploy.'
      )
    );
  }
  return config;
});

// Interceptor response untuk logging dan error handling terpusat
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'Terjadi kesalahan pada koneksi API.';
    return Promise.reject(new Error(message));
  }
);

export default apiClient;
