import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { AnnouncementCard } from './components/AnnouncementCard';
import { AnnouncementForm } from './components/AnnouncementForm';
import { DeleteModal } from './components/DeleteModal';
import { AuthModal } from './components/AuthModal';
import type { Announcement, CreateAnnouncementData } from './types';

function AppContent() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [announcementToDelete, setAnnouncementToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Authentication State
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [username, setUsername] = useState<string | null>(localStorage.getItem('username'));

  const navigate = useNavigate();

  const API_URL = import.meta.env.MODE === 'development' 
    ? 'http://localhost:3001/api'
    : '/api';

  const authHeaders: Record<string, string> = token ? { 'Authorization': `Bearer ${token}` } : {};

  const fetchAnnouncements = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetch(`${API_URL}/announcements`);
      if (!res.ok) throw new Error('Failed to fetch announcements');
      const data = await res.json();
      setAnnouncements(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred while loading announcements.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, [token]);

  const handleAuthSuccess = (newToken: string, user: string, _userRole: string) => {
    setToken(newToken);
    setUsername(user);
    localStorage.setItem('token', newToken);
    localStorage.setItem('username', user);
  };

  const handleLogout = () => {
    setToken(null);
    setUsername(null);
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
  };

  const handleCreate = async (data: Omit<CreateAnnouncementData, 'author'>) => {
    const res = await fetch(`${API_URL}/announcements`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders },
      body: JSON.stringify(data),
    });
    
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message?.[0] || 'Failed to create announcement');
    }
    
    await fetchAnnouncements();
    navigate('/');
  };

  const handleDeleteRequest = (id: string) => {
    setAnnouncementToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!announcementToDelete) return;
    
    try {
      setIsDeleting(true);
      const res = await fetch(`${API_URL}/announcements/${announcementToDelete}`, {
        method: 'DELETE',
        headers: authHeaders
      });
      
      if (!res.ok) throw new Error('Failed to delete announcement');
      
      setAnnouncements(prev => prev.filter(a => a.id !== announcementToDelete));
    } catch (err) {
      alert('Failed to delete announcement');
    } finally {
      setIsDeleting(false);
      setDeleteModalOpen(false);
      setAnnouncementToDelete(null);
    }
  };

  return (
    <div style={{ paddingBottom: '4rem' }}>
      <header style={{ marginBottom: '2rem', textAlign: 'center', position: 'relative' }}>
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', letterSpacing: '-0.025em' }}>
            Beta X Board
          </h1>
        </Link>
        <p style={{ color: 'var(--text-muted)' }}>Internal news and announcements</p>

        {token && (
          <div style={{ position: 'absolute', top: 0, left: 0, display: 'flex', gap: '0.5rem' }}>
            <Link to="/" className="btn">Feed</Link>
            <Link to="/create" className="btn btn-primary">+ Create</Link>
          </div>
        )}

        <div style={{ position: 'absolute', top: 0, right: 0 }}>
          {token && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                Logged in as <strong>{username}</strong>
              </span>
              <button className="btn" onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      </header>

      {!token ? (
        <AuthModal isOpen={true} onSuccess={handleAuthSuccess} apiUrl={API_URL} />
      ) : (
        <Routes>
          <Route path="/" element={
            <div>
              <h2 style={{ marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
                Feed
              </h2>

              {isLoading ? (
                <div className="spinner"></div>
              ) : error ? (
                <div style={{ background: 'var(--danger)', color: 'white', padding: '1rem', borderRadius: '0.5rem' }}>
                  <p>{error}</p>
                  <button className="btn" style={{ marginTop: '1rem', background: 'rgba(255,255,255,0.2)' }} onClick={fetchAnnouncements}>
                    Try Again
                  </button>
                </div>
              ) : announcements.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                  <p>No announcements yet. <Link to="/create" style={{ color: 'var(--primary)', fontWeight: 500 }}>Create one</Link></p>
                </div>
              ) : (
                announcements.map(announcement => (
                  <AnnouncementCard 
                    key={announcement.id} 
                    announcement={announcement} 
                    onDeleteRequest={handleDeleteRequest}
                  />
                ))
              )}
            </div>
          } />

          <Route path="/create" element={
            <div>
               <div style={{ marginBottom: '1rem' }}>
                 <Link to="/" className="btn" style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>← Back to Feed</Link>
               </div>
               <AnnouncementForm onSubmit={handleCreate} />
            </div>
          } />
        </Routes>
      )}

      <DeleteModal 
        isOpen={deleteModalOpen} 
        isDeleting={isDeleting}
        onConfirm={confirmDelete}
        onCancel={() => {
          setDeleteModalOpen(false);
          setAnnouncementToDelete(null);
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
