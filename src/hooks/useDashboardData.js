import { useState, useEffect } from 'react';
import { clothesService } from '../services/clothesService';
import { outfitService } from '../services/outfitService';

/**
 * Custom Hook untuk memuat data ringkasan di halaman Dashboard
 */
export function useDashboardData() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    clothesCount: 0,
    outfitCount: 0,
  });
  const [upcomingOutfits, setUpcomingOutfits] = useState([]);
  const [recentOutfits, setRecentOutfits] = useState([]);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        const [clothesTotal, outfitTotal, upcoming, recent] = await Promise.all([
          clothesService.getCount().catch(() => 0),
          outfitService.getCount().catch(() => 0),
          outfitService.getUpcoming({ limit: 3 }).catch(() => []),
          outfitService.getRecent({ limit: 4 }).catch(() => []),
        ]);

        if (!isMounted) return;
        setStats({
          clothesCount: clothesTotal,
          outfitCount: outfitTotal,
        });
        setUpcomingOutfits(upcoming);
        setRecentOutfits(recent);
        setLoading(false);
      } catch (err) {
        if (!isMounted) return;
        setError(err.message || 'Gagal memuat data dashboard.');
        setLoading(false);
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [reloadKey]);

  const refresh = () => {
    setLoading(true);
    setReloadKey((prev) => prev + 1);
  };

  return {
    loading,
    error,
    stats,
    upcomingOutfits,
    recentOutfits,
    refresh,
  };
}
