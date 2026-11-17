/**
 * Konfigurasi Profil Pengguna & Informasi Aplikasi Wearly
 * Data awal ini dapat diedit langsung melalui tombol 'Edit Profil' di halaman Profil
 * dan tersimpan di penyimpanan lokal perangkat (Local Storage).
 */

export const DEFAULT_PROFILE = {
  name: "Alifa Putri",
  nim: "21120122140001",
  kelompok: "Kelompok 01",
  role: "Fashion Curator & App Developer",
  bio: "Fashion enthusiast yang berfokus merancang digital wardrobe yang rapi, fungsional, dan modis.",
  location: "Semarang, Indonesia",
};

export const appInformation = {
  name: "Wearly",
  tagline: "Your Minimalist Digital Wardrobe & Outfit Planner",
  version: "1.0.0",
  description:
    "Wearly adalah Progressive Web App (PWA) digital wardrobe modern yang dirancang untuk membantu Anda mengelola koleksi busana, memadupadankan outfit secara visual, dan menjadwalkan penampilan terbaik untuk berbagai momen istimewa.",
  highlights: [
    {
      title: "Digital Wardrobe Catalog",
      desc: "Kelola pakaian dengan rapi berdasarkan 7 kategori fashion: Atasan, Bawahan, Outerwear, Dress, Sepatu, Tas, dan Aksesori.",
    },
    {
      title: "Visual Outfit Planner",
      desc: "Padukan berbagai item pakaian secara interaktif dan lihat pratinjau kombinasi sebelum disimpan.",
    },
    {
      title: "Event & Date Scheduling",
      desc: "Jadwalkan outfit harian sesuai tanggal dan agenda kegiatan seperti kuliah, rapat, pesta, atau liburan.",
    },
    {
      title: "Offline Progressive Web App",
      desc: "Dapat diinstal langsung di layar utama smartphone atau desktop dan tetap dapat diakses dengan cepat.",
    },
  ],
  stack: [
    { name: "React 19", role: "Core UI Framework" },
    { name: "Vite", role: "Lightning Fast Bundler" },
    { name: "Supabase", role: "PostgreSQL Database & Storage" },
    { name: "Axios", role: "REST API Client" },
    { name: "Lucide React", role: "Minimalist Fashion Icons" },
    { name: "Vite PWA", role: "Service Worker & Offline Cache" },
  ],
};
