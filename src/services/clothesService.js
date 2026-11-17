import apiClient from '../config/api';

/**
 * Service untuk manajemen koleksi pakaian (Tabel `clothes`)
 */
export const clothesService = {
  /**
   * Mengambil semua pakaian, dengan opsi filter kategori dan pencarian nama
   */
  async getAll({ category, search, limit, order = 'created_at.desc' } = {}) {
    const params = new URLSearchParams();
    params.append('select', '*');
    if (order) params.append('order', order);
    if (limit) params.append('limit', limit.toString());
    if (category && category !== 'Semua') {
      params.append('category', `eq.${category}`);
    }
    if (search && search.trim()) {
      params.append('name', `ilike.%${search.trim()}%`);
    }

    const response = await apiClient.get(`/clothes?${params.toString()}`);
    return response.data;
  },

  /**
   * Mengambil jumlah total pakaian
   */
  async getCount() {
    // PostgREST: request HEAD atau GET dengan Prefer: count=exact
    const response = await apiClient.get('/clothes?select=id', {
      headers: {
        Prefer: 'count=exact',
      },
    });
    const contentRange = response.headers['content-range'];
    if (contentRange) {
      const total = contentRange.split('/')[1];
      return parseInt(total, 10) || 0;
    }
    return Array.isArray(response.data) ? response.data.length : 0;
  },

  /**
   * Mengambil detail satu pakaian berdasarkan ID
   */
  async getById(id) {
    const response = await apiClient.get(`/clothes?id=eq.${id}&select=*`);
    return response.data[0] || null;
  },

  /**
   * Menambahkan pakaian baru
   */
  async create(data) {
    const response = await apiClient.post('/clothes', data);
    return response.data[0];
  },

  /**
   * Memperbarui informasi pakaian
   */
  async update(id, data) {
    const response = await apiClient.patch(`/clothes?id=eq.${id}`, data);
    return response.data[0];
  },

  /**
   * Menghapus pakaian
   */
  async delete(id) {
    // Hapus juga relasi di outfit_items sebelum menghapus pakaian (atau jika ON DELETE CASCADE sudah ada)
    await apiClient.delete(`/outfit_items?clothes_id=eq.${id}`).catch(() => {});
    const response = await apiClient.delete(`/clothes?id=eq.${id}`);
    return response.data;
  },
};

