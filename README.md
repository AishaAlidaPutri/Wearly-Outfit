# Wearly — Minimalist Digital Wardrobe & Outfit Planner PWA

Wearly adalah Progressive Web App (PWA) modern bernuansa digital wardrobe yang dirancang untuk mengelola koleksi pakaian, merancang kombinasi outfit harian yang modis, dan menjadwalkan penampilan berdasarkan agenda dan tanggal kegiatan.

---

## ✦ Fitur Utama

1. **Dashboard & Ringkasan Koleksi**:
   - Sapaan dinamis berdasarkan waktu (*Pagi, Siang, Sore, Malam*).
   - Statistik jumlah pakaian di lemari dan kombinasi outfit.
   - Jadwal pemakaian outfit terdekat dengan preview pakaian.
   - Kolase outfit terbaru yang dirancang.

2. **My Wardrobe (Full CRUD Pakaian)**:
   - Katalog pakaian dengan kartu visual besar.
   - Filter berdasarkan 7 kategori (*Atasan, Bawahan, Outerwear, Dress, Sepatu, Tas, Aksesori*).
   - Pencarian pakaian berdasarkan nama secara instan.
   - Upload foto pakaian langsung dari galeri/perangkat ke **Supabase Storage**.
   - Tambah, edit informasi, dan hapus pakaian dengan dialog konfirmasi.

3. **Outfit Planner (Kombinasi & Penjadwalan)**:
   - Pilih beberapa item pakaian dari lemari digital.
   - Pratinjau kolase paduan pakaian secara langsung (*live visual preview*).
   - Penjadwalan tanggal pemakaian dan jenis acara (*Kuliah, Rapat, Hangout, Pesta, dll.*).
   - Filter outfit terjadwal dan manajemen edit/hapus kombinasi.

4. **Profil Pengguna**:
   - Menampilkan identitas, NIM, Kelompok, Peran, Lokasi, dan Bio.
   - Fitur **Edit Profil** di halaman tersendiri dengan penyimpanan otomatis di *Local Storage*.

5. **Progressive Web App (PWA) & Offline Ready**:
   - Dapat diinstal di desktop (Chrome/Edge) maupun ponsel (Android/iOS) sebagai aplikasi mandiri (*standalone*).
   - Banner pop-up instalasi otomatis di pojok kanan bawah.
   - Didukung *Service Worker* dan precache aset statis (*HTML, CSS, JS, Fonts, Icons*).

---

## 🛠️ Teknologi yang Digunakan

- **React 19**
- **Vite**
- **JavaScript** (ES Modules)
- **Axios** (REST API PostgREST Supabase)
- **Supabase** (PostgreSQL & Storage)
- **Lucide React** (Iconography)
- **vite-plugin-pwa** & **Workbox** (PWA & Service Worker)
- **Vercel** (Cloud Deployment)

---

## 🚀 Cara Menjalankan secara Lokal

1. **Clone repositori**:
   ```bash
   git clone https://github.com/AishaAlidaPutri/Wearly-Outfit.git
   cd Wearly-Outfit
   ```

2. **Instal dependensi**:
   ```bash
   npm install
   ```

3. **Konfigurasi Environment Variable**:
   Salin `.env.example` menjadi `.env` lalu sesuaikan kredensial Supabase Anda:
   ```env
   VITE_API_BASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key
   ```

4. **Jalankan development server**:
   ```bash
   npm run dev
   ```

5. **Build untuk production**:
   ```bash
   npm run build
   ```

---

## 🌐 Deployment ke Vercel

1. Push project ke repositori GitHub.
2. Hubungkan repositori ke **Vercel**.
3. Di tab **Environment Variables** Vercel, tambahkan:
   - `VITE_API_BASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
4. Deploy! Routing SPA telah dikonfigurasi melalui `vercel.json`.
