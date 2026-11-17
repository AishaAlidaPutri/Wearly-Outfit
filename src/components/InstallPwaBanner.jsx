import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

const DISMISS_KEY = 'wearly_pwa_banner_dismissed';

export function InstallPwaBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Jangan tampilkan jika sudah di-install sebagai standalone PWA
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true;

    if (isStandalone) return;

    // Cek apakah user sudah menutup banner di sesi ini
    const isDismissed = sessionStorage.getItem(DISMISS_KEY);
    if (isDismissed) return;

    // Tangkap event sebelum instalasi PWA dari browser
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // Tampilkan banner setelah sedikit delay jika belum standalone dan belum ditutup
    const timer = setTimeout(() => {
      if (!isDismissed && !isStandalone) {
        setIsVisible(true);
      }
    }, 1500);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      clearTimeout(timer);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setIsVisible(false);
      }
      setDeferredPrompt(null);
    } else {
      // Petunjuk manual jika browser belum memicu prompt otomatis
      alert(
        'Untuk menginstal Wearly:\n• Pada Chrome/Edge desktop: Klik ikon Install di sebelah kanan address bar.\n• Pada Chrome Android: Klik menu ⋮ lalu pilih "Add to Home screen" / "Install app".\n• Pada Safari iOS: Tap tombol Share lalu pilih "Add to Home Screen".'
      );
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    try {
      sessionStorage.setItem(DISMISS_KEY, 'true');
    } catch {
      // Local storage fallback
    }
  };

  if (!isVisible) return null;

  return (
    <div className="pwa-install-toast">
      <div className="pwa-toast-icon">
        <Download size={18} strokeWidth={2.2} />
      </div>

      <div className="pwa-toast-text">
        Install <strong>Wearly</strong> for offline access.
      </div>

      <button
        type="button"
        className="pwa-toast-install-btn"
        onClick={handleInstallClick}
      >
        Install App
      </button>

      <button
        type="button"
        className="pwa-toast-close-btn"
        onClick={handleDismiss}
        aria-label="Tutup banner install"
      >
        <X size={15} />
      </button>
    </div>
  );
}

