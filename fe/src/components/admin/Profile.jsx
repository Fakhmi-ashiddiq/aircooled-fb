import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store';

export default function Profile() {
  const { state, updateState, logout } = useStore();
  const navigate = useNavigate();
  const user = state.user;
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');

  if (!user) {
    navigate('/admin/login');
    return null;
  }

  const handleSave = () => {
    updateState({ user: { ...user, name, email } });
    setEditing(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const inputStyle = { width: '100%', padding: '13px', border: '2px solid #14110D', background: '#fff', fontSize: '14px', fontFamily: "'Space Mono', monospace" };
  const labelStyle = { fontFamily: "'Space Mono', monospace", fontSize: '10px', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#6b655a', marginBottom: '6px', display: 'block' };

  return (
    <div style={{ background: '#F2EEE4', minHeight: '100vh', padding: '40px 48px' }}>
      <div style={{ maxWidth: '480px', margin: '0 auto' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Space Mono', monospace", fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#6b655a', marginBottom: '24px' }}>
          ← Kembali
        </button>

        <h1 style={{ fontFamily: "'Archivo'", fontWeight: 900, fontSize: '28px', margin: '0 0 24px', textTransform: 'uppercase' }}>Profil Saya</h1>

      <div style={{ border: '2px solid #14110D', background: '#fff', padding: '24px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#14110D', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontFamily: "'Archivo'", fontWeight: 900, fontSize: '24px', color: '#F2C015' }}>{user.name?.charAt(0) || 'U'}</span>
          </div>
          <div>
            <div style={{ fontFamily: "'Archivo'", fontWeight: 700, fontSize: '18px' }}>{user.name}</div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '12px', color: '#6b655a' }}>{user.email}</div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', color: '#F2C015', marginTop: '4px', textTransform: 'uppercase', fontWeight: 700 }}>{user.role}</div>
          </div>
        </div>

        {editing ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={labelStyle}>Nama</label>
              <input value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Email</label>
              <input value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={handleSave} style={{ flex: 1, background: '#F2C015', color: '#14110D', border: 'none', cursor: 'pointer', fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: '12px', letterSpacing: '0.06em', textTransform: 'uppercase', padding: '13px' }}>
                Simpan
              </button>
              <button onClick={() => { setEditing(false); setName(user.name); setEmail(user.email); }} style={{ flex: 1, background: '#fff', color: '#14110D', border: '2px solid #14110D', cursor: 'pointer', fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: '12px', letterSpacing: '0.06em', textTransform: 'uppercase', padding: '13px' }}>
                Batal
              </button>
            </div>
          </div>
        ) : (
          <button onClick={() => setEditing(true)} style={{ width: '100%', background: '#fff', color: '#14110D', border: '2px solid #14110D', cursor: 'pointer', fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: '12px', letterSpacing: '0.06em', textTransform: 'uppercase', padding: '13px' }}>
            Edit Profil
          </button>
        )}
      </div>

      <button onClick={handleLogout} style={{ width: '100%', background: '#14110D', color: '#F2EEE4', border: 'none', cursor: 'pointer', fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: '12px', letterSpacing: '0.06em', textTransform: 'uppercase', padding: '14px' }}>
        Keluar dari Akun
      </button>
      </div>
    </div>
  );
}
