import { useState } from 'react';
import { ArrowLeft, Check, RotateCcw, User } from 'lucide-react';
import { DEFAULT_PROFILE } from '../config/profile';

const STORAGE_KEY = 'wearly_user_profile';

export function EditProfile({ setActivePage }) {
  const [formData, setFormData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    } catch {
      // LocalStorage fallback
    }
    setActivePage('profile');
  };

  const handleResetToDefault = () => {
    if (window.confirm('Kosongkan data profil?')) {
      setFormData({ name: '', nim: '', kelompok: '' });
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        // LocalStorage fallback
      }
      setActivePage('profile');
    }
  };

  return (
    <div className="edit-profile-page">
      {/* Tombol Kembali & Judul Halaman */}
      <div className="page-header-row">
        <button
          type="button"
          className="btn-back-link"
          onClick={() => setActivePage('profile')}
        >
          <ArrowLeft size={18} /> Kembali ke Profil
        </button>
      </div>

      <div className="edit-profile-card">
        <div className="edit-profile-card-header">
          <div className="edit-avatar-icon">
            <User size={28} strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="edit-page-title">Edit Profil Pengguna</h1>
            <p className="edit-page-subtitle">
              Perbarui identitas Nama, NIM, dan Kelompok Anda di sini.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="edit-profile-form">
          {/* Nama Lengkap */}
          <div className="form-group">
            <label className="form-label">Nama Lengkap</label>
            <input
              type="text"
              name="name"
              value={formData.name || ''}
              onChange={handleInputChange}
              placeholder="Masukkan nama lengkap Anda..."
              className="form-input"
            />
          </div>

          {/* NIM & Kelompok */}
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">NIM</label>
              <input
                type="text"
                name="nim"
                value={formData.nim || ''}
                onChange={handleInputChange}
                placeholder="Masukkan NIM Anda..."
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Kelompok</label>
              <input
                type="text"
                name="kelompok"
                value={formData.kelompok || ''}
                onChange={handleInputChange}
                placeholder="Contoh: Kelompok 01"
                className="form-input"
              />
            </div>
          </div>

          {/* Tombol Aksi */}
          <div className="edit-form-actions">
            <button
              type="button"
              className="btn-outline-danger"
              onClick={handleResetToDefault}
              title="Kosongkan data profil"
            >
              <RotateCcw size={15} /> Kosongkan Profil
            </button>

            <div className="actions-right">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setActivePage('profile')}
              >
                Batal
              </button>
              <button type="submit" className="btn-primary">
                <Check size={16} /> Simpan Perubahan
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
