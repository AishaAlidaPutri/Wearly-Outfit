import axios from 'axios';
import { SUPABASE_URL, SUPABASE_KEY } from '../config/api';

const BUCKET_NAME = 'clothes';
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg', 'image/gif'];

export const storageService = {
  /**
   * Validasi format dan ukuran file gambar sebelum diunggah
   */
  validateFile(file) {
    if (!file) {
      throw new Error('Pilih file gambar terlebih dahulu.');
    }
    if (!ALLOWED_TYPES.includes(file.type.toLowerCase())) {
      throw new Error('Format file tidak didukung. Gunakan JPG, PNG, WEBP, atau GIF.');
    }
    if (file.size > MAX_FILE_SIZE) {
      throw new Error('Ukuran file terlalu besar. Maksimal 5 MB.');
    }
    return true;
  },

  /**
   * Upload file gambar ke Supabase Storage bucket 'clothes'
   * Mengembalikan URL publik gambar
   */
  async uploadImage(file) {
    this.validateFile(file);

    const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileName = `item_${Date.now()}_${cleanName}`;
    const uploadUrl = `${SUPABASE_URL}/storage/v1/object/${BUCKET_NAME}/${fileName}`;

    try {
      const response = await axios.post(uploadUrl, file, {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': file.type,
        },
      });

      if (response.status === 200 || response.status === 201) {
        return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/${fileName}`;
      }
      throw new Error('Gagal mengunggah gambar ke storage.');
    } catch (err) {
      const errMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        '';

      if (
        errMsg.toLowerCase().includes('bucket not found') ||
        errMsg.toLowerCase().includes('nosuchbucket')
      ) {
        throw new Error(
          "Upload gagal: Bucket 'clothes' belum dibuat di Supabase Storage. Silakan gunakan opsi URL Gambar atau buat bucket di dashboard Supabase.",
          { cause: err }
        );
      }
      if (
        errMsg.toLowerCase().includes('policy') ||
        errMsg.toLowerCase().includes('row-level security') ||
        errMsg.toLowerCase().includes('unauthorized')
      ) {
        throw new Error(
          "Upload gagal: Izin akses upload ke bucket 'clothes' belum diaktifkan di Supabase. Silakan gunakan opsi URL Gambar atau jalankan policy SQL di Supabase.",
          { cause: err }
        );
      }
      throw new Error(`Upload gagal: ${errMsg}`, { cause: err });
    }
  },
};
