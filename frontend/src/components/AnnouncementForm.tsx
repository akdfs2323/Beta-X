import { useState } from 'react';
import type { CreateAnnouncementData } from '../types';

interface Props {
  onSubmit: (data: Omit<CreateAnnouncementData, 'author'>) => Promise<void>;
}

export function AnnouncementForm({ onSubmit }: Props) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [pinned, setPinned] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) {
      setError('Title and Body are required.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await onSubmit({ title, body, pinned });
      setTitle('');
      setBody('');
      setPinned(false);
    } catch (err: any) {
      setError(err.message || 'Failed to create announcement');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
      <h2 style={{ marginBottom: '1rem', marginTop: 0 }}>New Announcement</h2>
      
      {error && (
        <div style={{ background: 'var(--danger)', color: 'white', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1rem' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500 }}>Title <span style={{ color: 'var(--danger)' }}>*</span></label>
          <input 
            type="text" 
            className="input" 
            value={title} 
            onChange={e => setTitle(e.target.value)} 
            placeholder="What's happening?"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500 }}>Message <span style={{ color: 'var(--danger)' }}>*</span></label>
          <textarea 
            className="textarea" 
            value={body} 
            onChange={e => setBody(e.target.value)} 
            placeholder="Write your announcement here..."
            disabled={isSubmitting}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input 
            type="checkbox" 
            id="pin-checkbox" 
            checked={pinned} 
            onChange={e => setPinned(e.target.checked)} 
            disabled={isSubmitting}
            style={{ width: '1.2rem', height: '1.2rem', accentColor: 'var(--primary)' }}
          />
          <label htmlFor="pin-checkbox" style={{ cursor: 'pointer', fontWeight: 500 }}>Pin this announcement to the top</label>
        </div>

        <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }} disabled={isSubmitting}>
          {isSubmitting ? 'Posting...' : 'Post Announcement'}
        </button>
      </form>
    </div>
  );
}
