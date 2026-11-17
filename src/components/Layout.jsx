import { Navbar } from './Navbar';
import { InstallPwaBanner } from './InstallPwaBanner';

export function Layout({ activePage, setActivePage, children }) {
  return (
    <div className="app-shell">
      <Navbar activePage={activePage} setActivePage={setActivePage} />
      <main className="main-content-area">
        <div className="content-wrapper">{children}</div>
      </main>
      <footer className="desktop-footer">
        <p>© {new Date().getFullYear()} Wearly — Minimalist Digital Wardrobe & Outfit Planner</p>
      </footer>
      <InstallPwaBanner />
    </div>
  );
}
