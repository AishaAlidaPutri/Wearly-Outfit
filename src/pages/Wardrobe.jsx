import { useState } from 'react';
import {
  Shirt,
  Plus,
  Search,
  Filter,
  Trash2,
  Edit3,
  Tag,
  Palette,
  AlertTriangle,
  X,
} from 'lucide-react';
import { useClothes } from '../hooks/useClothes';
import { ClothesModal } from '../components/ClothesModal';
import { CATEGORIES } from '../config/constants';
import { LoadingSpinner, EmptyState, ErrorState } from '../components/StatusState';

export function Wardrobe() {
  const {
    clothes,
    loading,
    error,
    categoryFilter,
    setCategoryFilter,
    searchQuery,
    setSearchQuery,
    refresh,
    addClothing,
    updateClothing,
    deleteClothing,
  } = useClothes();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteCandidate, setDeleteCandidate] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

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

  const handleSaveClothing = async (formData) => {
    if (editingItem) {
      await updateClothing(editingItem.id, formData);
      showToast('Informasi pakaian berhasil diperbarui!');
    } else {
      await addClothing(formData);
      showToast('Pakaian baru berhasil ditambahkan ke lemari!');
    }
  };

  const confirmDelete = async () => {
    if (!deleteCandidate) return;
    setIsDeleting(true);
    try {
      await deleteClothing(deleteCandidate.id);
      showToast('Pakaian berhasil dihapus.');
      setDeleteCandidate(null);
    } catch (err) {
      alert(`Gagal menghapus pakaian: ${err.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="wardrobe-page">
      {/* Toast Notification */}
      {toastMessage && <div className="alert-toast">{toastMessage}</div>}

      {/* Header Row */}
      <div className="page-header-row">
        <div>
          <h1 className="page-title">My Wardrobe</h1>
          <p className="page-subtitle">
            Koleksi pakaian digitalmu. Total {clothes.length} item pakaian tersimpan.
          </p>
        </div>
        <button type="button" className="btn-primary" onClick={handleOpenAdd}>
          <Plus size={18} /> Tambah Pakaian
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="wardrobe-controls-card">
        {/* Search Input */}
        <div className="search-bar-wrap">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Cari pakaian berdasarkan nama..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          {searchQuery && (
            <button
              type="button"
              className="clear-search-btn"
              onClick={() => setSearchQuery('')}
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="category-pills-row">
          <div className="filter-label-wrap">
            <Filter size={15} />
            <span>Kategori:</span>
          </div>
          <button
            type="button"
            className={`category-pill ${categoryFilter === 'Semua' ? 'active' : ''}`}
            onClick={() => setCategoryFilter('Semua')}
          >
            Semua
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`category-pill ${categoryFilter === cat ? 'active' : ''}`}
              onClick={() => setCategoryFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Loading & Error States */}
      {loading && <LoadingSpinner message="Menampilkan koleksi pakaian..." />}
      {error && <ErrorState message={error} onRetry={refresh} />}

      {/* Clothes Grid */}
      {!loading && !error && (
        <>
          {clothes.length === 0 ? (
            <EmptyState
              icon={Shirt}
              title={
                searchQuery || categoryFilter !== 'Semua'
                  ? 'Tidak ada pakaian yang cocok'
                  : 'Lemari digital Anda masih kosong'
              }
              description={
                searchQuery || categoryFilter !== 'Semua'
                  ? 'Coba ganti kata kunci pencarian atau pilih kategori lain.'
                  : 'Mulai tambahkan koleksi pakaian favorit Anda ke Wearly sekarang.'
              }
              actionText="Tambah Pakaian Baru"
              onAction={handleOpenAdd}
            />
          ) : (
            <div className="clothes-grid">
              {clothes.map((item) => (
                <div key={item.id} className="clothing-card">
                  {/* Card Image Area */}
                  <div className="clothing-card-image-wrap">
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="clothing-card-img"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          const fallback = e.currentTarget.parentElement.querySelector('.image-fallback');
                          if (fallback) fallback.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div
                      className="image-fallback"
                      style={{ display: item.image_url ? 'none' : 'flex' }}
                    >
                      <Shirt size={40} strokeWidth={1.2} />
                      <span>{item.category}</span>
                    </div>

                    <div className="card-top-badges">
                      <span className="category-badge">
                        <Tag size={12} /> {item.category}
                      </span>
                    </div>
                  </div>

                  {/* Card Content Area */}
                  <div className="clothing-card-body">
                    <h3 className="clothing-title" title={item.name}>
                      {item.name}
                    </h3>

                    {item.color && (
                      <div className="clothing-color-row">
                        <Palette size={13} className="clothing-color-icon" />
                        <span>{item.color}</span>
                      </div>
                    )}

                    {item.notes && (
                      <p className="clothing-notes" title={item.notes}>
                        {item.notes}
                      </p>
                    )}

                    {/* Card Actions Footer */}
                    <div className="clothing-card-actions">
                      <button
                        type="button"
                        className="btn-card-action edit"
                        onClick={() => handleOpenEdit(item)}
                        title="Edit Pakaian"
                      >
                        <Edit3 size={15} /> Edit
                      </button>
                      <button
                        type="button"
                        className="btn-card-action delete"
                        onClick={() => setDeleteCandidate(item)}
                        title="Hapus Pakaian"
                      >
                        <Trash2 size={15} /> Hapus
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Modal Tambah / Edit Pakaian */}
      {isModalOpen && (
        <ClothesModal
          key={editingItem ? editingItem.id : 'new-clothes'}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveClothing}
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
            <h3 className="confirm-title">Hapus Pakaian Ini?</h3>
            <p className="confirm-desc">
              Pakaian <strong>"{deleteCandidate.name}"</strong> akan dihapus permanen
              dari lemari dan kombinasi outfit terkait.
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
