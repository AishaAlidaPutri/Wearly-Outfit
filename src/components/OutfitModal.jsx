import { useState, useEffect } from 'react';
import { X, Check, Sparkles, AlertCircle, Shirt, Calendar, MapPin, Tag } from 'lucide-react';
import { clothesService } from '../services/clothesService';

export function OutfitModal({ isOpen, onClose, onSave, editItem = null }) {
  const [formData, setFormData] = useState(() => ({
    name: editItem?.name || '',
    event: editItem?.event || '',
    outfit_date: editItem?.outfit_date || '',
    notes: editItem?.notes || '',
    clothesIds: editItem?.outfit_items?.map((item) => item.clothes?.id).filter(Boolean) || [],
  }));

  const [availableClothes, setAvailableClothes] = useState([]);
  const [loadingClothes, setLoadingClothes] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function loadWardrobe() {
      try {
        const data = await clothesService.getAll();
        if (!isMounted) return;
        setAvailableClothes(data || []);
      } catch {
        // Fallback
      } finally {
        if (isMounted) setLoadingClothes(false);
      }
    }
    loadWardrobe();
    return () => {
      isMounted = false;
    };
  }, []);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleSelectCloth = (id) => {
    setFormData((prev) => {
      const exists = prev.clothesIds.includes(id);
      const updated = exists
        ? prev.clothesIds.filter((item) => item !== id)
        : [...prev.clothesIds, id];
      return { ...prev, clothesIds: updated };
    });
  };

  const selectedClothesObjects = availableClothes.filter((c) =>
    formData.clothesIds.includes(c.id)
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.name.trim()) {
      setFormError('Nama outfit wajib diisi.');
      return;
    }

    if (formData.clothesIds.length === 0) {
      setFormError('Pilih setidaknya 1 item pakaian untuk outfit ini.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave({
        name: formData.name.trim(),
        event: formData.event.trim() || null,
        outfit_date: formData.outfit_date || null,
        notes: formData.notes.trim() || null,
        clothesIds: formData.clothesIds,
      });
      onClose();
    } catch (err) {
      setFormError(err.message || 'Gagal menyimpan outfit.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content modal-outfit" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrap">
            <Sparkles size={22} className="modal-title-icon" />
            <h3 className="modal-title">
              {editItem ? 'Edit Kombinasi Outfit' : 'Rancang Outfit Baru'}
            </h3>
          </div>
          <button type="button" className="btn-close-modal" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {formError && (
          <div className="modal-error-banner">
            <AlertCircle size={18} />
            <span>{formError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="modal-form">
          {/* Live Preview Kombinasi Pakaian yang Dipilih */}
          <div className="outfit-preview-container">
            <div className="preview-header-label">
              <span>Pratinjau Kombinasi:</span>
              <strong className="badge-count">
                {formData.clothesIds.length} item dipilih
              </strong>
            </div>

            {selectedClothesObjects.length === 0 ? (
              <div className="preview-empty-strip">
                <Shirt size={28} strokeWidth={1.2} />
                <p>Belum ada pakaian yang dipilih dari lemari di bawah</p>
              </div>
            ) : (
              <div className="outfit-collage-strip">
                {selectedClothesObjects.map((item) => (
                  <div key={item.id} className="collage-thumb-card">
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="collage-thumb-img"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="collage-thumb-placeholder">
                        <Shirt size={20} strokeWidth={1.3} />
                      </div>
                    )}
                    <span className="collage-thumb-tag">{item.category}</span>
                    <button
                      type="button"
                      className="collage-thumb-remove"
                      onClick={() => toggleSelectCloth(item.id)}
                      title="Hapus dari kombinasi"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Nama Outfit */}
          <div className="form-group">
            <label className="form-label">Nama Outfit *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              placeholder="Contoh: Casual Friday Hangout, Formal Presentation"
              className="form-input"
            />
          </div>

          {/* Acara & Tanggal Pemakaian */}
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">
                <MapPin size={13} style={{ display: 'inline', marginRight: 4 }} />
                Jenis Acara / Kegiatan
              </label>
              <input
                type="text"
                name="event"
                value={formData.event}
                onChange={handleInputChange}
                placeholder="Contoh: Kuliah, Hangout, Dinner, Kerja"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <Calendar size={13} style={{ display: 'inline', marginRight: 4 }} />
                Tanggal Pemakaian (Jadwal)
              </label>
              <input
                type="date"
                name="outfit_date"
                value={formData.outfit_date}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>
          </div>

          {/* Catatan Styling */}
          <div className="form-group">
            <label className="form-label">Catatan Styling</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows={2}
              placeholder="Tips aksesoris, parfum, atau gaya pemakaian..."
              className="form-textarea"
            />
          </div>

          {/* Picker Koleksi Pakaian dari Wardrobe */}
          <div className="clothes-picker-section">
            <div className="picker-header">
              <label className="form-label">Pilih Item dari Lemari Pakaian *</label>
              <small className="file-hint">Klik untuk memilih / membatalkan</small>
            </div>

            {loadingClothes ? (
              <div className="picker-loading">Memuat koleksi pakaian...</div>
            ) : availableClothes.length === 0 ? (
              <div className="picker-empty">
                <Shirt size={28} />
                <p>Lemari pakaianmu masih kosong.</p>
                <small>Tambahkan pakaian di tab "Wardrobe" terlebih dahulu.</small>
              </div>
            ) : (
              <div className="picker-grid">
                {availableClothes.map((cloth) => {
                  const isSelected = formData.clothesIds.includes(cloth.id);
                  return (
                    <div
                      key={cloth.id}
                      className={`picker-cloth-card ${isSelected ? 'selected' : ''}`}
                      onClick={() => toggleSelectCloth(cloth.id)}
                    >
                      <div className="picker-cloth-img-wrap">
                        {cloth.image_url ? (
                          <img
                            src={cloth.image_url}
                            alt={cloth.name}
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="picker-placeholder">
                            <Shirt size={20} />
                          </div>
                        )}
                        {isSelected && (
                          <div className="selection-badge">
                            <Check size={13} />
                          </div>
                        )}
                      </div>
                      <div className="picker-cloth-info">
                        <span className="picker-cloth-name">{cloth.name}</span>
                        <span className="picker-cloth-cat">
                          <Tag size={10} /> {cloth.category}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Modal Actions */}
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
              disabled={isSubmitting || availableClothes.length === 0}
            >
              {isSubmitting ? (
                <>
                  <div className="spinner-mini"></div> Menyimpan...
                </>
              ) : (
                <>
                  <Check size={16} /> {editItem ? 'Simpan Perubahan' : 'Simpan Outfit'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

