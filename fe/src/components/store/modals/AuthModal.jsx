import React, { useContext } from 'react';
import { useStore } from '../../../store';

export default function AuthModal() {
  const { state, updateState } = useStore();

  if (!state.authOpen) return null;

  const closeAuth = () => updateState({ authOpen: false });

  const setAuthLogin = () => updateState({ authMode: 'login' });
  const setAuthRegister = () => updateState({ authMode: 'register' });

  const authIsLogin = state.authMode === 'login';
  const authIsRegister = state.authMode === 'register';

  const segStyle = (on) => ({
    background: on ? '#14110D' : '#fff',
    color: on ? '#F2EEE4' : '#14110D',
    border: '2px solid #14110D',
    cursor: 'pointer',
    fontFamily: "'Space Mono', monospace",
    fontWeight: 700,
    fontSize: '12px',
    textTransform: 'uppercase',
    padding: '10px 16px',
    letterSpacing: '0.04em',
    flex: 1
  });

  const doAuth = () => {
    const name = (state.authName || '').trim() || 'Member';
    updateState({
      user: { name, email: state.authEmail || '' },
      authOpen: false,
      authName: '',
      authEmail: ''
    });
  };

  return (
    <>
      <style>{`
        @media (max-width: 480px) {
          .auth-modal-box { width: 94vw !important; }
          .auth-modal-body { padding: 18px !important; }
          .auth-register-grid { grid-template-columns: 1fr !important; }
          .auth-register-grid > * { grid-column: 1 / -1 !important; }
        }
      `}</style>

      <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(20,17,13,0.62)', animation: 'ascOverlayIn 0.18s ease' }} onClick={closeAuth}></div>
      <div
        className="auth-modal-box"
        style={{ position: 'fixed', zIndex: 101, top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '468px', maxWidth: '92vw', maxHeight: '90vh', overflowY: 'auto', background: '#F2EEE4', border: '2px solid #14110D', animation: 'ascModalIn 0.26s cubic-bezier(0.22,1,0.36,1)' }}
      >
        <div style={{ background: '#14110D', padding: '18px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: "'Archivo'", fontWeight: 900, fontSize: '18px', color: '#F2EEE4', textTransform: 'uppercase', letterSpacing: '0.02em' }}>Akun</span>
          <button onClick={closeAuth} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#F2EEE4', fontSize: '24px', lineHeight: 1 }}>×</button>
        </div>
        <div className="auth-modal-body" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', gap: 0, marginBottom: '22px' }}>
            <button onClick={setAuthLogin} style={segStyle(authIsLogin)}>Masuk</button>
            <button onClick={setAuthRegister} style={segStyle(authIsRegister)}>Daftar</button>
          </div>

          {authIsLogin && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input placeholder="Email" value={state.authEmail} onChange={e => updateState({ authEmail: e.target.value })} style={{ padding: '14px', border: '2px solid #14110D', background: '#fff', fontSize: '14px' }} />
              <input type="password" placeholder="Password" style={{ padding: '14px', border: '2px solid #14110D', background: '#fff', fontSize: '14px' }} />
              <button onClick={doAuth} style={{ background: '#F2C015', color: '#14110D', border: 'none', cursor: 'pointer', fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: '13px', letterSpacing: '0.06em', textTransform: 'uppercase', padding: '15px', marginTop: '6px' }}>Masuk ke Akun</button>
            </div>
          )}

          {authIsRegister && (
            <div className="auth-register-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <input placeholder="Nama lengkap" value={state.authName} onChange={e => updateState({ authName: e.target.value })} style={{ gridColumn: '1/3', padding: '13px', border: '2px solid #14110D', background: '#fff', fontSize: '14px' }} />
              <input placeholder="No. Telp / WhatsApp" style={{ padding: '13px', border: '2px solid #14110D', background: '#fff', fontSize: '14px' }} />
              <input placeholder="Email" value={state.authEmail} onChange={e => updateState({ authEmail: e.target.value })} style={{ padding: '13px', border: '2px solid #14110D', background: '#fff', fontSize: '14px' }} />
              <input placeholder="Alamat lengkap" style={{ gridColumn: '1/3', padding: '13px', border: '2px solid #14110D', background: '#fff', fontSize: '14px' }} />
              <input placeholder="Kota" style={{ padding: '13px', border: '2px solid #14110D', background: '#fff', fontSize: '14px' }} />
              <input placeholder="Kode pos" style={{ padding: '13px', border: '2px solid #14110D', background: '#fff', fontSize: '14px' }} />
              <input type="password" placeholder="Password (untuk akun baru)" style={{ gridColumn: '1/3', padding: '13px', border: '2px solid #14110D', background: '#fff', fontSize: '14px' }} />
              <button onClick={doAuth} style={{ gridColumn: '1/3', background: '#F2C015', color: '#14110D', border: 'none', cursor: 'pointer', fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: '13px', letterSpacing: '0.06em', textTransform: 'uppercase', padding: '15px', marginTop: '6px' }}>Buat Akun</button>
            </div>
          )}

          <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', color: '#6b655a', lineHeight: 1.6, margin: '16px 0 0', textAlign: 'center' }}>
            Atau tutup &amp; lanjut checkout sebagai tamu. Akun memudahkan lacak pesanan &amp; pre-order.
          </p>
        </div>
      </div>
    </>
  );
}
