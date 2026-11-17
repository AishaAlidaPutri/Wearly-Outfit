import axios from 'axios';

// Mengambil konfigurasi dari environment variables
const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || '';
export const SUPABASE_URL = rawBaseUrl.replace(/\/+$/, '');
export const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '';

// Instance Axios khusus untuk REST API Supabase (PostgREST)
const apiClient = axios.create({
  baseURL: `${SUPABASE_URL}/rest/v1`,
  headers: {
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation', // Memastikan data hasil insert/update dikembalikan oleh PostgREST
  },
  timeout: 15000,
});

// Interceptor untuk logging dan error handling terpusat
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Memberikan pesan error yang informatif
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'Terjadi kesalahan pada koneksi API.';
    return Promise.reject(new Error(message));
  }
);

export default apiClient;

