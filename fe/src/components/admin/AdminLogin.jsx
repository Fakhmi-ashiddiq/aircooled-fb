import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store';

export default function AdminLogin() {
  const { state, updateState, login, isAdmin } = useStore();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (state.user && isAdmin()) {
      navigate('/admin');
    }
  }, [state.user, isAdmin, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await login(email, password);
      if (result?.user?.role === '1') {
        updateState({ view: 'admin', adminRoute: 'dashboard' });
        navigate('/admin');
      } else {
        updateState({ toast: { message: 'Akun ini bukan admin' } });
      }
    } catch (err) {
      // error handled by store
    }
    setLoading(false);
  };

  if (state.user && isAdmin()) return null;

  return (
    <div style={{ minHeight: '100vh', background: '#14110D', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Space Mono', monospace" }}>
      <style>{`
        .admin-login-input:focus { outline: none; border-color: #F2C015; }
        @media (max-width: 480px) {
          .admin-login-box { width: 94vw !important; padding: 28px 20px !important; }
        }
      `}</style>

      <div className="admin-login-box" style={{ width: '420px', background: '#F2EEE4', border: '2px solid #14110D', padding: '40px 36px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ width: '56px', height: '56px', background: '#14110D', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#F2C015', fontFamily: "'Archivo'", fontWeight: 900, fontSize: '14px', textTransform: 'uppercase', lineHeight: 0.9, textAlign: 'center' }}>AC<br/>SYND</span>
          </div>
          <h1 style={{ fontFamily: "'Archivo'", fontWeight: 900, fontSize: '24px', textTransform: 'uppercase', margin: 0, letterSpacing: '0.02em' }}>Admin Panel</h1>
          <p style={{ fontSize: '12px', color: '#6b655a', marginTop: '6px' }}>Masuk untuk mengelola toko</p>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6b655a', marginBottom: '6px' }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@aircooled.com"
              required
              className="admin-login-input"
              style={{ width: '100%', padding: '13px', border: '2px solid #14110D', background: '#fff', fontSize: '14px' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6b655a', marginBottom: '6px' }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="admin-login-input"
              style={{ width: '100%', padding: '13px', border: '2px solid #14110D', background: '#fff', fontSize: '14px' }}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{
              background: '#F2C015', color: '#14110D', border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: '13px', letterSpacing: '0.06em',
              textTransform: 'uppercase', padding: '15px', marginTop: '6px', opacity: loading ? 0.6 : 1
            }}
          >
            {loading ? 'Masuk...' : 'Masuk ke Admin'}
          </button>
        </form>

        <div style={{ borderTop: '1px solid #ddd5c4', marginTop: '24px', paddingTop: '16px', textAlign: 'center' }}>
          <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Space Mono', monospace", fontSize: '11px', color: '#6b655a', letterSpacing: '0.04em' }}>
            ← Kembali ke Store
          </button>
        </div>
      </div>
    </div>
  );
}
