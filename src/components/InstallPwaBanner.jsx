import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

const DISMISS_KEY = 'wearly_pwa_banner_dismissed';

export function InstallPwaBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Jangan tampilkan jika sudah berjalan sebagai aplikasi standalone
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true;

    if (isStandalone) return;

    // Tangkap event sebelum instalasi browser (Chrome, Edge, Android)
    const handleBeforeInstall = (e) => {
      // Cegah default mini-infobar Chrome agar kita bisa memicu prompt asli melalui tombol
      e.preventDefault();
      setDeferredPrompt(e);

      // Hanya tampilkan jika belum ditutup oleh user di sesi ini
      const isDismissed = sessionStorage.getItem(DISMISS_KEY);
      if (!isDismissed) {
        setIsVisible(true);
      }
    };

    const handleAppInstalled = () => {
      setIsVisible(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Picu langsung dialog instalasi asli bawaan browser (native browser install prompt)
    deferredPrompt.prompt();
    const choiceResult = await deferredPrompt.userChoice;
    if (choiceResult && choiceResult.outcome === 'accepted') {
      setIsVisible(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setIsVisible(false);
    try {
      sessionStorage.setItem(DISMISS_KEY, 'true');
    } catch {
      // LocalStorage fallback
    }
  };

  if (!isVisible || !deferredPrompt) return null;

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
