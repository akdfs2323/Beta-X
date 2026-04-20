import { AlertTriangle } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
}

export function DeleteModal({ isOpen, onConfirm, onCancel, isDeleting }: Props) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="glass-panel modal-content" style={{ background: 'var(--bg-start)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', color: 'var(--danger)' }}>
          <AlertTriangle size={24} />
          <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Confirm Delete</h2>
        </div>
        <p style={{ marginBottom: '1.5rem', color: 'var(--text-muted)' }}>
          Are you sure you want to delete this announcement? This action cannot be undone.
        </p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button className="btn" onClick={onCancel} disabled={isDeleting} style={{ border: '1px solid #cbd5e1' }}>
            Cancel
          </button>
          <button className="btn btn-danger" onClick={onConfirm} disabled={isDeleting}>
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
