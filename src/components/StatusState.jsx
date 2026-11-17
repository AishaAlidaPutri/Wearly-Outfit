import { AlertCircle, RefreshCw, Sparkles } from 'lucide-react';

export function LoadingSpinner({ message = 'Memuat koleksi...' }) {
  return (
    <div className="status-container">
      <div className="spinner-ring"></div>
      <p className="status-text">{message}</p>
    </div>
  );
}

export function EmptyState({
  icon: Icon = Sparkles,
  title = 'Belum ada data',
  description = 'Mulai tambahkan koleksi pertama Anda untuk melihatnya di sini.',
  actionText,
  onAction,
}) {
  return (
    <div className="empty-state-card">
      <div className="empty-icon-wrap">
        <Icon size={32} strokeWidth={1.5} />
      </div>
      <h3 className="empty-title">{title}</h3>
      <p className="empty-desc">{description}</p>
      {actionText && onAction && (
        <button type="button" className="btn-primary" onClick={onAction}>
          {actionText}
        </button>
      )}
    </div>
  );
}

export function ErrorState({
  message = 'Terjadi kesalahan saat memuat data.',
  onRetry,
}) {
  return (
    <div className="error-state-card">
      <AlertCircle size={28} className="error-icon" />
      <div>
        <h4 className="error-title">Gagal Memuat Data</h4>
        <p className="error-desc">{message}</p>
      </div>
      {onRetry && (
        <button type="button" className="btn-outline-sm" onClick={onRetry}>
          <RefreshCw size={14} /> Coba Lagi
        </button>
      )}
    </div>
  );
}
