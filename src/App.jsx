import { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Wardrobe } from './pages/Wardrobe';
import { OutfitPlanner } from './pages/OutfitPlanner';
import { Profile } from './pages/Profile';
import { EditProfile } from './pages/EditProfile';
import './App.css';

function getInitialPage() {
  const hash = window.location.hash.replace('#', '').toLowerCase();
  const validPages = ['dashboard', 'wardrobe', 'planner', 'profile', 'edit-profile'];
  return validPages.includes(hash) ? hash : 'dashboard';
}

function App() {
  const [activePage, setActivePage] = useState(getInitialPage);

  // Sinkronisasi hash URL dengan activePage agar navigasi ramah PWA (back button browser/HP berfungsi)
  useEffect(() => {
    window.location.hash = activePage;
  }, [activePage]);

  useEffect(() => {
    const handleHashChange = () => {
      const page = getInitialPage();
      setActivePage(page);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const renderCurrentPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard setActivePage={setActivePage} />;
      case 'wardrobe':
        return <Wardrobe />;
      case 'planner':
        return <OutfitPlanner />;
      case 'profile':
        return <Profile setActivePage={setActivePage} />;
      case 'edit-profile':
        return <EditProfile setActivePage={setActivePage} />;
      default:
        return <Dashboard setActivePage={setActivePage} />;
    }
  };

  return (
    <Layout activePage={activePage} setActivePage={setActivePage}>
      {renderCurrentPage()}
    </Layout>
  );
}

export default App;
