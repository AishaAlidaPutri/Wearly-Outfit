import { useState } from 'react';
import {
  X,
  Upload,
  Check,
  AlertCircle,
  Shirt,
} from 'lucide-react';
import { storageService } from '../services/storageService';
import { CATEGORIES } from '../config/constants';

export function ClothesModal({ isOpen, onClose, onSave, editItem = null }) {
  const [formData, setFormData] = useState(() => ({
    name: editItem?.name || '',
    category: editItem?.category || 'Atasan',
    color: editItem?.color || '',
    image_url: editItem?.image_url || '',
    notes: editItem?.notes || '',
  }));

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(() => editItem?.image_url || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      storageService.validateFile(file);
      setSelectedFile(file);
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      setFormError(null);
    } catch (err) {
      setFormError(err.message);
      e.target.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.name.trim()) {
      setFormError('Nama pakaian wajib diisi.');
      return;
    }

    setIsSubmitting(true);
    try {
      let finalImageUrl = formData.image_url;

      // Jika user memilih file baru untuk diupload ke Supabase Storage
      if (selectedFile) {
        finalImageUrl = await storageService.uploadImage(selectedFile);
      }

      const payload = {
        name: formData.name.trim(),
        category: formData.category,
        color: formData.color.trim() || null,
        image_url: finalImageUrl || null,
        notes: formData.notes.trim() || null,
      };

      await onSave(payload);
      onClose();
    } catch (err) {
      setFormError(err.message || 'Gagal menyimpan pakaian.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content modal-clothes" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrap">
            <Shirt size={22} className="modal-title-icon" />
            <h3 className="modal-title">
              {editItem ? 'Edit Pakaian' : 'Tambah Koleksi Pakaian'}
            </h3>
          </div>
          <button type="button" className="btn-close-modal" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {formError && (
          <div className="modal-error-banner">
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <p>{formError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="modal-form">
          {/* Bagian Upload Gambar */}
          <div className="image-field-section">
            <label className="form-label" style={{ margin: 0 }}>
              Foto Pakaian
            </label>

            <div className="image-preview-and-input">
              {/* Preview Box */}
              <div className="clothes-preview-box">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Pratinjau pakaian"
                    className="preview-img"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="preview-placeholder">
                    <Shirt size={32} strokeWidth={1.2} />
                    <span>Belum ada foto</span>
                  </div>
                )}
              </div>

              {/* Upload Input Area */}
              <div className="image-input-control">
                <div className="file-upload-area">
                  <input
                    type="file"
                    id="clothes-file-input"
                    accept="image/png, image/jpeg, image/webp, image/jpg, image/gif"
                    onChange={handleFileChange}
                    className="hidden-file-input"
                  />
                  <label htmlFor="clothes-file-input" className="file-upload-label">
                    <Upload size={22} />
                    <span>
                      {selectedFile
                        ? selectedFile.name
                        : editItem?.image_url
                        ? 'Ganti foto pakaian...'
                        : 'Pilih foto dari galeri/perangkat'}
                    </span>
                    <small className="file-hint">Maks. 5 MB (JPG, PNG, WEBP)</small>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Nama Pakaian */}
          <div className="form-group">
            <label className="form-label">Nama Pakaian *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              placeholder="Contoh: Kemeja Linen Putih Oversized"
              className="form-input"
            />
          </div>

          {/* Kategori & Warna */}
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Kategori *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="form-select"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Warna</label>
              <input
                type="text"
                name="color"
                value={formData.color}
                onChange={handleInputChange}
                placeholder="Contoh: Broken White, Hitam, Khaki"
                className="form-input"
              />
            </div>
          </div>

          {/* Catatan Tambahan */}
          <div className="form-group">
            <label className="form-label">Catatan Tambahan (Opsional)</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows={2}
              placeholder="Catatan bahan, kecocokan acara, atau tips cuci..."
              className="form-textarea"
            />
          </div>

          {/* Tombol Aksi */}
          <div className="modal-actions-row">
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Batal
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="spinner-mini"></div> Mengunggah & Menyimpan...
                </>
              ) : (
                <>
                  <Check size={16} /> {editItem ? 'Simpan Perubahan' : 'Tambah ke Wardrobe'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
