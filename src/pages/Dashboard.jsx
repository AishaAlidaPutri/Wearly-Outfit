import { Shirt, Sparkles, Calendar, Plus, ArrowRight, Clock, MapPin } from 'lucide-react';
import { useDashboardData } from '../hooks/useDashboardData';
import { LoadingSpinner, ErrorState, EmptyState } from '../components/StatusState';

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 11) return 'Selamat Pagi';
  if (hour < 15) return 'Selamat Siang';
  if (hour < 18) return 'Selamat Sore';
  return 'Selamat Malam';
}

function formatDate(dateString) {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date);
  } catch {
    return dateString;
  }
}

export function Dashboard({ setActivePage }) {
  const { loading, error, stats, upcomingOutfits, recentOutfits, refresh } =
    useDashboardData();

  const greeting = getGreeting();

  return (
    <div className="dashboard-page">
      {/* Hero / Greeting Section */}
      <section className="dashboard-hero">
        <div className="hero-text-block">
          <span className="hero-badge">✦ Minimalist Wardrobe</span>
          <h1 className="hero-title">{greeting}, Fashion Enthusiast!</h1>
          <p className="hero-subtitle">
            Kelola pakaian favoritmu, rancang padu-padan terbaik, dan tampil percaya diri setiap hari.
          </p>
        </div>

        <div className="hero-quick-actions">
          <button
            type="button"
            className="btn-primary"
            onClick={() => setActivePage('planner')}
          >
            <Plus size={18} /> Rancang Outfit
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => setActivePage('wardrobe')}
          >
            <Shirt size={18} /> Buka Wardrobe
          </button>
        </div>
      </section>

      {/* Overview Stat Cards */}
      <section className="stats-grid">
        <div className="stat-card" onClick={() => setActivePage('wardrobe')}>
          <div className="stat-icon-box stat-icon-wardrobe">
            <Shirt size={24} />
          </div>
          <div className="stat-details">
            <span className="stat-label">Total Koleksi Pakaian</span>
            <span className="stat-value">{stats.clothesCount}</span>
            <span className="stat-hint">Lihat semua pakaian →</span>
          </div>
        </div>

        <div className="stat-card" onClick={() => setActivePage('planner')}>
          <div className="stat-icon-box stat-icon-planner">
            <Sparkles size={24} />
          </div>
          <div className="stat-details">
            <span className="stat-label">Kombinasi Outfit</span>
            <span className="stat-value">{stats.outfitCount}</span>
            <span className="stat-hint">Lihat outfit planner →</span>
          </div>
        </div>
      </section>

      {/* Loading & Error Indicators */}
      {loading && <LoadingSpinner message="Menghubungkan ke koleksi Wearly..." />}
      {error && <ErrorState message={error} onRetry={refresh} />}

      {/* Content Section: Jadwal Terdekat & Outfit Terbaru */}
      {!loading && (
        <div className="dashboard-sections-grid">
          {/* Jadwal Terdekat */}
          <section className="dashboard-card-section">
            <div className="section-header">
              <div className="section-title-wrap">
                <Calendar size={20} className="section-header-icon" />
                <h2 className="section-title">Jadwal Outfit Terdekat</h2>
              </div>
              <button
                type="button"
                className="section-action-link"
                onClick={() => setActivePage('planner')}
              >
                Lihat Semua <ArrowRight size={14} />
              </button>
            </div>

            {upcomingOutfits.length === 0 ? (
              <EmptyState
                icon={Calendar}
                title="Belum ada jadwal outfit"
                description="Buat rencana outfit untuk acara mendatang agar harimu lebih siap."
                actionText="Jadwalkan Outfit"
                onAction={() => setActivePage('planner')}
              />
            ) : (
              <div className="upcoming-list">
                {upcomingOutfits.map((outfit) => {
                  const items = outfit.outfit_items || [];
                  return (
                    <div key={outfit.id} className="upcoming-item-card">
                      <div className="upcoming-date-badge">
                        <Clock size={14} />
                        <span>{formatDate(outfit.outfit_date)}</span>
                      </div>
                      <div className="upcoming-info">
                        <h4 className="upcoming-name">{outfit.name}</h4>
                        {outfit.event && (
                          <p className="upcoming-event">
                            <MapPin size={13} /> {outfit.event}
                          </p>
                        )}
                        <span className="upcoming-items-count">
                          {items.length} item pakaian dipilih
                        </span>
                      </div>

                      {/* Preview mini thumbnails */}
                      <div className="mini-thumbnails">
                        {items.slice(0, 3).map((item, idx) => (
                          <div key={item.id || idx} className="mini-thumb">
                            {item.clothes?.image_url ? (
                              <img
                                src={item.clothes.image_url}
                                alt={item.clothes.name || 'Pakaian'}
                                referrerPolicy="no-referrer"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                            ) : (
                              <div className="mini-thumb-placeholder">
                                <Shirt size={14} />
                              </div>
                            )}
                          </div>
                        ))}
                        {items.length > 3 && (
                          <div className="mini-thumb-more">
                            +{items.length - 3}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* Outfit Baru Dibuat */}
          <section className="dashboard-card-section">
            <div className="section-header">
              <div className="section-title-wrap">
                <Sparkles size={20} className="section-header-icon" />
                <h2 className="section-title">Outfit Terbaru</h2>
              </div>
              <button
                type="button"
                className="section-action-link"
                onClick={() => setActivePage('planner')}
              >
                Semua Outfit <ArrowRight size={14} />
              </button>
            </div>

            {recentOutfits.length === 0 ? (
              <EmptyState
                icon={Sparkles}
                title="Belum ada kombinasi outfit"
                description="Padukan pakaian dari lemari digitalmu sekarang."
                actionText="Buat Outfit Pertama"
                onAction={() => setActivePage('planner')}
              />
            ) : (
              <div className="recent-outfits-grid">
                {recentOutfits.map((outfit) => {
                  const items = outfit.outfit_items || [];
                  return (
                    <div key={outfit.id} className="recent-outfit-card">
                      <div className="recent-outfit-preview">
                        {items.length > 0 ? (
                          <div className="preview-mosaic">
                            {items.slice(0, 4).map((item, idx) => (
                              <div key={item.id || idx} className="mosaic-tile">
                                {item.clothes?.image_url ? (
                                  <img
                                    src={item.clothes.image_url}
                                    alt={item.clothes.name || 'Pakaian'}
                                    referrerPolicy="no-referrer"
                                    onError={(e) => {
                                      e.currentTarget.style.display = 'none';
                                    }}
                                  />
                                ) : (
                                  <div className="mosaic-fallback">
                                    <Shirt size={16} />
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="preview-empty">
                            <Shirt size={28} strokeWidth={1.5} />
                          </div>
                        )}
                      </div>

                      <div className="recent-outfit-body">
                        <h4 className="recent-outfit-name">{outfit.name}</h4>
                        <div className="recent-outfit-meta">
                          {outfit.event && (
                            <span className="badge-tag">{outfit.event}</span>
                          )}
                          <span className="badge-count">{items.length} item</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
