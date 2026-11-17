import { useState } from 'react';
import {
  Sparkles,
  Plus,
  Calendar,
  Clock,
  MapPin,
  Trash2,
  Edit3,
  Shirt,
  AlertTriangle,
} from 'lucide-react';
import { useOutfits } from '../hooks/useOutfits';
import { OutfitModal } from '../components/OutfitModal';
import { LoadingSpinner, EmptyState, ErrorState } from '../components/StatusState';

function formatDate(dateString) {
  if (!dateString) return null;
  try {
    const d = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(d);
  } catch {
    return dateString;
  }
}

export function OutfitPlanner() {
  const { outfits, loading, error, refresh, addOutfit, updateOutfit, deleteOutfit } =
    useOutfits();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteCandidate, setDeleteCandidate] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [filterMode, setFilterMode] = useState('all'); // 'all' | 'scheduled'

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleOpenAdd = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleSaveOutfit = async (formData) => {
    if (editingItem) {
      await updateOutfit(editingItem.id, formData);
      showToast('Kombinasi outfit berhasil diperbarui!');
    } else {
      await addOutfit(formData);
      showToast('Outfit baru berhasil dibuat dan dijadwalkan!');
    }
  };

  const confirmDelete = async () => {
    if (!deleteCandidate) return;
    setIsDeleting(true);
    try {
      await deleteOutfit(deleteCandidate.id);
      showToast('Outfit berhasil dihapus.');
      setDeleteCandidate(null);
    } catch (err) {
      alert(`Gagal menghapus outfit: ${err.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredOutfits = outfits.filter((outfit) => {
    if (filterMode === 'scheduled') {
      return Boolean(outfit.outfit_date);
    }
    return true;
  });

  return (
    <div className="planner-page">
      {toastMessage && <div className="alert-toast">{toastMessage}</div>}

      {/* Header */}
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Outfit Planner</h1>
          <p className="page-subtitle">
            Rancang kombinasi busana dan jadwalkan tanggal pemakaian. Total{' '}
            {outfits.length} outfit terdaftar.
          </p>
        </div>
        <button type="button" className="btn-primary" onClick={handleOpenAdd}>
          <Plus size={18} /> Rancang Outfit
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="planner-filter-bar">
        <button
          type="button"
          className={`filter-tab-pill ${filterMode === 'all' ? 'active' : ''}`}
          onClick={() => setFilterMode('all')}
        >
          Semua Outfit ({outfits.length})
        </button>
        <button
          type="button"
          className={`filter-tab-pill ${filterMode === 'scheduled' ? 'active' : ''}`}
          onClick={() => setFilterMode('scheduled')}
        >
          <Calendar size={14} /> Terjadwal (
          {outfits.filter((o) => Boolean(o.outfit_date)).length})
        </button>
      </div>

      {/* Loading & Error */}
      {loading && <LoadingSpinner message="Menyiapkan outfit planner..." />}
      {error && <ErrorState message={error} onRetry={refresh} />}

      {/* Outfit Grid */}
      {!loading && !error && (
        <>
          {filteredOutfits.length === 0 ? (
            <EmptyState
              icon={Sparkles}
              title={
                filterMode === 'scheduled'
                  ? 'Belum ada outfit yang memiliki jadwal'
                  : 'Belum ada kombinasi outfit'
              }
              description={
                filterMode === 'scheduled'
                  ? 'Tentukan tanggal pemakaian pada outfit Anda untuk melihat jadwal di sini.'
                  : 'Pilih pakaian dari lemari digital Anda dan ciptakan gaya baru.'
              }
              actionText="Rancang Outfit Pertama"
              onAction={handleOpenAdd}
            />
          ) : (
            <div className="outfits-display-grid">
              {filteredOutfits.map((outfit) => {
                const items = outfit.outfit_items || [];
                const formattedDate = formatDate(outfit.outfit_date);

                return (
                  <div key={outfit.id} className="planner-outfit-card">
                    {/* Visual Collage Preview */}
                    <div className="outfit-collage-preview">
                      {items.length === 0 ? (
                        <div className="collage-empty">
                          <Shirt size={32} />
                          <span>Pakaian tidak ditemukan</span>
                        </div>
                      ) : (
                        <div className={`collage-grid count-${Math.min(items.length, 4)}`}>
                          {items.slice(0, 4).map((rel, idx) => (
                            <div key={rel.id || idx} className="collage-tile">
                              {rel.clothes?.image_url ? (
                                <img
                                  src={rel.clothes.image_url}
                                  alt={rel.clothes.name || 'Pakaian'}
                                  referrerPolicy="no-referrer"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                  }}
                                />
                              ) : (
                                <div className="tile-placeholder">
                                  <Shirt size={18} />
                                  <small>{rel.clothes?.category || 'Item'}</small>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      <span className="outfit-items-badge">
                        {items.length} item pakaian
                      </span>
                    </div>

                    {/* Card Body */}
                    <div className="planner-outfit-body">
                      <div className="planner-outfit-meta-top">
                        {formattedDate ? (
                          <div className="schedule-badge">
                            <Clock size={12} />
                            <span>{formattedDate}</span>
                          </div>
                        ) : (
                          <span className="unscheduled-badge">Belum dijadwalkan</span>
                        )}

                        {outfit.event && (
                          <span className="event-badge">
                            <MapPin size={12} /> {outfit.event}
                          </span>
                        )}
                      </div>

                      <h3 className="planner-outfit-title">{outfit.name}</h3>

                      {outfit.notes && (
                        <p className="planner-outfit-notes">{outfit.notes}</p>
                      )}

                      {/* Items list tags */}
                      <div className="outfit-items-tags">
                        {items.map((rel, idx) => (
                          <span key={rel.id || idx} className="cloth-chip-mini">
                            {rel.clothes?.name || 'Pakaian'}
                          </span>
                        ))}
                      </div>

                      {/* Actions Footer */}
                      <div className="planner-outfit-actions">
                        <button
                          type="button"
                          className="btn-card-action edit"
                          onClick={() => handleOpenEdit(outfit)}
                          title="Edit Outfit"
                        >
                          <Edit3 size={15} /> Edit
                        </button>
                        <button
                          type="button"
                          className="btn-card-action delete"
                          onClick={() => setDeleteCandidate(outfit)}
                          title="Hapus Outfit"
                        >
                          <Trash2 size={15} /> Hapus
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Modal Tambah / Edit Outfit */}
      {isModalOpen && (
        <OutfitModal
          key={editingItem ? editingItem.id : 'new-outfit'}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveOutfit}
          editItem={editingItem}
        />
      )}

      {/* Dialog Konfirmasi Hapus */}
      {deleteCandidate && (
        <div className="modal-backdrop" onClick={() => setDeleteCandidate(null)}>
          <div
            className="modal-content modal-confirm"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="confirm-icon-wrap">
              <AlertTriangle size={32} />
            </div>
            <h3 className="confirm-title">Hapus Outfit Ini?</h3>
            <p className="confirm-desc">
              Outfit <strong>"{deleteCandidate.name}"</strong> akan dihapus secara
              permanen. Item pakaian di dalamnya tidak akan terhapus dari lemari Anda.
            </p>

            <div className="confirm-actions-row">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setDeleteCandidate(null)}
                disabled={isDeleting}
              >
                Batal
              </button>
              <button
                type="button"
                className="btn-danger"
                onClick={confirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? 'Menghapus...' : 'Ya, Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
