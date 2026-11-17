import { useState, useEffect } from 'react';
import { outfitService } from '../services/outfitService';

export function useOutfits() {
  const [outfits, setOutfits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        const data = await outfitService.getAll();
        if (!isMounted) return;
        setOutfits(data || []);
        setLoading(false);
      } catch (err) {
        if (!isMounted) return;
        setError(err.message || 'Gagal memuat daftar outfit.');
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

  const addOutfit = async (outfitData) => {
    const created = await outfitService.create(outfitData);
    refresh();
    return created;
  };

  const updateOutfit = async (id, outfitData) => {
    const updated = await outfitService.update(id, outfitData);
    refresh();
    return updated;
  };

  const deleteOutfit = async (id) => {
    await outfitService.delete(id);
    refresh();
  };

  return {
    outfits,
    loading,
    error,
    refresh,
    addOutfit,
    updateOutfit,
    deleteOutfit,
  };
}

