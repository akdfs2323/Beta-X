import { format } from 'date-fns';
import { Pin, Trash2 } from 'lucide-react';
import type { Announcement } from '../types';

interface Props {
  announcement: Announcement;
  onDeleteRequest: (id: string) => void;
}

export function AnnouncementCard({ announcement, onDeleteRequest }: Props) {
  return (
    <div 
      className={`glass-panel ${announcement.pinned ? 'pinned-card' : ''}`}
      style={{
        padding: '1.5rem',
        marginBottom: '1rem',
        background: announcement.pinned ? 'var(--pinned-bg)' : 'var(--surface)',
        borderColor: announcement.pinned ? 'var(--pinned-border)' : 'var(--border)',
        position: 'relative',
        transition: 'all 0.3s ease'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', marginTop: 0 }}>
            {announcement.title}
            {announcement.pinned && <Pin size={18} color="#f59e0b" />}
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>
            By <strong>{announcement.author}</strong> • {format(new Date(announcement.created_at), 'PPP')}
          </p>
        </div>
        
        <button 
          className="btn" 
          onClick={() => onDeleteRequest(announcement.id)}
          style={{ background: 'transparent', color: 'var(--text-muted)', padding: '0.25rem' }}
          title="Delete Announcement"
        >
          <Trash2 size={20} />
        </button>
      </div>
      <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>{announcement.body}</p>
    </div>
  );
}
