import { useState, useEffect } from 'react';
import { clothesService } from '../services/clothesService';

export function useClothes() {
  const [clothes, setClothes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        const data = await clothesService.getAll({
          category: categoryFilter,
          search: searchQuery,
        });
        if (!isMounted) return;
        setClothes(data || []);
        setLoading(false);
      } catch (err) {
        if (!isMounted) return;
        setError(err.message || 'Gagal memuat koleksi pakaian.');
        setLoading(false);
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [categoryFilter, searchQuery, reloadKey]);

  const refresh = () => {
    setLoading(true);
    setReloadKey((prev) => prev + 1);
  };

  const addClothing = async (clothingData) => {
    const newItem = await clothesService.create(clothingData);
    refresh();
    return newItem;
  };

  const updateClothing = async (id, clothingData) => {
    const updated = await clothesService.update(id, clothingData);
    refresh();
    return updated;
  };

  const deleteClothing = async (id) => {
    await clothesService.delete(id);
    refresh();
  };

  return {
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
  };
}
