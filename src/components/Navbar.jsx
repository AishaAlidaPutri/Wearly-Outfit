import { Home, Shirt, Sparkles, User } from 'lucide-react';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'wardrobe', label: 'Wardrobe', icon: Shirt },
  { id: 'planner', label: 'Outfit Planner', icon: Sparkles },
  { id: 'profile', label: 'Profil', icon: User },
];

export function Navbar({ activePage, setActivePage }) {
  return (
    <>
      {/* Top Header - Desktop & Mobile Header Bar */}
      <header className="app-header">
        <div className="header-container">
          <div className="brand" onClick={() => setActivePage('dashboard')}>
            <span className="brand-logo-symbol">✦</span>
            <span className="brand-name">Wearly</span>
          </div>

          {/* Desktop Nav Links */}
          <nav className="desktop-nav">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive =
                activePage === item.id ||
                (item.id === 'profile' && activePage === 'edit-profile');
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActivePage(item.id)}
                  className={`desktop-nav-link ${isActive ? 'active' : ''}`}
                >
                  <Icon size={18} strokeWidth={isActive ? 2.2 : 1.7} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="mobile-bottom-nav">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive =
            activePage === item.id ||
            (item.id === 'profile' && activePage === 'edit-profile');
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActivePage(item.id)}
              className={`mobile-nav-btn ${isActive ? 'active' : ''}`}
              aria-label={item.label}
            >
              <div className="nav-icon-wrapper">
                <Icon size={20} strokeWidth={isActive ? 2.3 : 1.7} />
              </div>
              <span className="mobile-nav-label">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
