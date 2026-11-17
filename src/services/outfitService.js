import apiClient from '../config/api';

/**
 * Service untuk manajemen outfit & relasinya (Tabel `outfits` & `outfit_items`)
 */
export const outfitService = {
  /**
   * Mengambil semua outfit beserta daftar pakaian di dalamnya
   */
  async getAll({ limit, order = 'created_at.desc' } = {}) {
    const params = new URLSearchParams();
    // PostgREST Resource Embedding: outfits berelasi ke outfit_items dan clothes
    params.append('select', '*,outfit_items(id,clothes(*))');
    if (order) params.append('order', order);
    if (limit) params.append('limit', limit.toString());

    const response = await apiClient.get(`/outfits?${params.toString()}`);
    return response.data;
  },

  /**
   * Mengambil outfit terdekat berdasarkan tanggal (untuk Dashboard)
   */
  async getUpcoming({ limit = 3 } = {}) {
    const today = new Date().toISOString().split('T')[0];
    const params = new URLSearchParams();
    params.append('select', '*,outfit_items(id,clothes(*))');
    params.append('outfit_date', `gte.${today}`);
    params.append('order', 'outfit_date.asc');
    params.append('limit', limit.toString());

    try {
      const response = await apiClient.get(`/outfits?${params.toString()}`);
      if (response.data && response.data.length > 0) {
        return response.data;
      }
    } catch {
      // Fallback jika query filter gte gagal
    }

    // Jika tidak ada jadwal masa depan, ambil jadwal outfit apapun yang ada tanggalnya
    const fallbackParams = new URLSearchParams();
    fallbackParams.append('select', '*,outfit_items(id,clothes(*))');
    fallbackParams.append('outfit_date', 'not.is.null');
    fallbackParams.append('order', 'outfit_date.desc');
    fallbackParams.append('limit', limit.toString());
    const fallbackRes = await apiClient.get(`/outfits?${fallbackParams.toString()}`);
    return fallbackRes.data;
  },

  /**
   * Mengambil beberapa outfit terbaru (untuk Dashboard)
   */
  async getRecent({ limit = 4 } = {}) {
    return this.getAll({ limit, order: 'created_at.desc' });
  },

  /**
   * Mengambil jumlah total outfit
   */
  async getCount() {
    const response = await apiClient.get('/outfits?select=id', {
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
   * Mengambil detail outfit berdasarkan ID
   */
  async getById(id) {
    const response = await apiClient.get(
      `/outfits?id=eq.${id}&select=*,outfit_items(id,clothes(*))`
    );
    return response.data[0] || null;
  },

  /**
   * Membuat outfit baru beserta pakaian yang dipilih
   */
  async create({ name, event, outfit_date, notes, clothesIds = [] }) {
    // 1. Simpan data outfit utama
    const outfitPayload = {
      name,
      event: event || null,
      outfit_date: outfit_date || null,
      notes: notes || null,
    };

    const outfitRes = await apiClient.post('/outfits', outfitPayload);
    const newOutfit = outfitRes.data[0];

    // 2. Simpan relasi pakaian ke tabel outfit_items
    if (clothesIds.length > 0 && newOutfit?.id) {
      const itemsPayload = clothesIds.map((clothesId) => ({
        outfit_id: newOutfit.id,
        clothes_id: clothesId,
      }));
      await apiClient.post('/outfit_items', itemsPayload);
    }

    return this.getById(newOutfit.id);
  },

  /**
   * Mengedit data outfit dan pakaian yang terhubung
   */
  async update(id, { name, event, outfit_date, notes, clothesIds }) {
    // 1. Update data outfit utama
    const outfitPayload = {
      name,
      event: event || null,
      outfit_date: outfit_date || null,
      notes: notes || null,
    };
    await apiClient.patch(`/outfits?id=eq.${id}`, outfitPayload);

    // 2. Jika daftar clothesIds disertakan, perbarui tabel outfit_items
    if (Array.isArray(clothesIds)) {
      await apiClient.delete(`/outfit_items?outfit_id=eq.${id}`);
      if (clothesIds.length > 0) {
        const itemsPayload = clothesIds.map((clothesId) => ({
          outfit_id: id,
          clothes_id: clothesId,
        }));
        await apiClient.post('/outfit_items', itemsPayload);
      }
    }

    return this.getById(id);
  },

  /**
   * Menghapus outfit beserta relasi itemnya
   */
  async delete(id) {
    // Hapus relasi di outfit_items terlebih dahulu
    await apiClient.delete(`/outfit_items?outfit_id=eq.${id}`).catch(() => {});
    // Hapus record outfit
    const response = await apiClient.delete(`/outfits?id=eq.${id}`);
    return response.data;
  },
};

