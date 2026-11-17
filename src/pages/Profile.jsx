import { useState } from 'react';
import { User, Sparkles, Edit3 } from 'lucide-react';
import { DEFAULT_PROFILE, appInformation } from '../config/profile';

const STORAGE_KEY = 'wearly_user_profile';

export function Profile({ setActivePage }) {
  const [profile] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  });

  return (
    <div className="profile-page">
      {/* Header Profile Section */}
      <section className="profile-header-card">
        <div className="profile-avatar-circle">
          <User size={44} strokeWidth={1.5} />
        </div>
        <div className="profile-identity">
          <div className="profile-badge-row">
            <span className="profile-badge">✦ Profil Pengguna</span>
            <button
              type="button"
              className="btn-edit-profile"
              onClick={() => setActivePage('edit-profile')}
            >
              <Edit3 size={15} /> Edit Profil
            </button>
          </div>
          <h1 className="profile-name">
            {profile.name ? profile.name : 'Nama Belum Diisi'}
          </h1>
          <div className="profile-meta-chips">
            <span className="meta-chip">
              <strong>NIM:</strong> {profile.nim ? profile.nim : '-'}
            </span>
            <span className="meta-chip">
              <strong>Kelompok:</strong> {profile.kelompok ? profile.kelompok : '-'}
            </span>
          </div>
          {!profile.name && !profile.nim && !profile.kelompok && (
            <p className="profile-empty-hint">
              Data profil masih kosong. Klik tombol <strong>Edit Profil</strong> di atas untuk mengisi identitas Anda.
            </p>
          )}
        </div>
      </section>

      {/* App Information Section */}
      <section className="app-info-section">
        <div className="section-header">
          <div className="section-title-wrap">
            <Sparkles size={20} className="section-header-icon" />
            <h2 className="section-title">Tentang Aplikasi {appInformation.name}</h2>
          </div>
          <span className="version-pill">v{appInformation.version}</span>
        </div>

        <div className="app-desc-card">
          <h3 className="app-tagline">"{appInformation.tagline}"</h3>
          <p className="app-full-desc">{appInformation.description}</p>
        </div>

        {/* Feature Highlights Grid */}
        <div className="features-grid">
          {appInformation.highlights.map((item, index) => (
            <div key={index} className="feature-card">
              <div className="feature-number">0{index + 1}</div>
              <h4 className="feature-title">{item.title}</h4>
              <p className="feature-desc">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
