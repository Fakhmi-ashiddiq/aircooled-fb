import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../../store';
import CityService from '../../../services/CityService';

export default function AuthModal() {
  const { state, updateState, login, register } = useStore();
  const navigate = useNavigate();
  const [authPassword, setAuthPassword] = useState('');
  const [authPasswordConfirm, setAuthPasswordConfirm] = useState('');
  const [authPhone, setAuthPhone] = useState('');
  const [authAddress, setAuthAddress] = useState('');
  const [authCity, setAuthCity] = useState('');
  const [authPostalCode, setAuthPostalCode] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [citySearch, setCitySearch] = useState('');
  const [cityResults, setCityResults] = useState([]);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [selectedCityObj, setSelectedCityObj] = useState(null);
  const cityRef = useRef(null);
  const searchTimeout = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (cityRef.current && !cityRef.current.contains(e.target)) {
        setShowCityDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchCity = (query) => {
    setCitySearch(query);
    setAuthCity(query);
    setSelectedCityObj(null);
    setAuthPostalCode('');
    if (query.length < 2) {
      setCityResults([]);
      setShowCityDropdown(false);
      return;
    }
    clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(async () => {
      try {
        const results = await CityService.getAll(query);
        setCityResults(results);
        setShowCityDropdown(true);
      } catch (e) {
        setCityResults([]);
      }
    }, 500);
  };

  const selectCity = (city) => {
    const displayName = city.label || city.city_name;
    setAuthCity(displayName);
    setCitySearch(displayName);
    setAuthPostalCode(String(city.zip_code || ''));
    setSelectedCityObj({ id: city.id, name: displayName, postcode: city.zip_code || '' });
    setShowCityDropdown(false);
  };

  const closeAuth = () => {
    updateState({ authOpen: false, authName: '', authEmail: '' });
    setAuthPassword('');
    setAuthPasswordConfirm('');
    setAuthPhone('');
    setAuthAddress('');
    setAuthCity('');
    setAuthPostalCode('');
    setCitySearch('');
    setCityResults([]);
    setSelectedCityObj(null);
  };

  const setAuthLogin = () => updateState({ authMode: 'login' });
  const setAuthRegister = () => updateState({ authMode: 'register' });

  const authIsLogin = state.authMode === 'login';
  const authIsRegister = state.authMode === 'register';

  if (!state.authOpen) return null;

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

  const handleLogin = async () => {
    setAuthLoading(true);
    try {
      const result = await login(state.authEmail, authPassword);
      closeAuth();
      if (result?.user?.role === '1') {
        updateState({ view: 'admin', adminRoute: 'dashboard' });
        navigate('/admin');
      }
    } catch (e) {
      // Error handled by store
    }
    setAuthLoading(false);
  };

  const handleRegister = async () => {
    setAuthLoading(true);
    try {
      await register(state.authName, state.authEmail, authPassword, authPasswordConfirm, {
        phone: authPhone,
        address: authAddress,
      });
      closeAuth();
    } catch (e) {
      // Error handled by store
    }
    setAuthLoading(false);
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
              <input type="password" placeholder="Password" value={authPassword} onChange={e => setAuthPassword(e.target.value)} style={{ padding: '14px', border: '2px solid #14110D', background: '#fff', fontSize: '14px' }} />
              <button onClick={handleLogin} disabled={authLoading} style={{ background: '#F2C015', color: '#14110D', border: 'none', cursor: authLoading ? 'not-allowed' : 'pointer', fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: '13px', letterSpacing: '0.06em', textTransform: 'uppercase', padding: '15px', marginTop: '6px', opacity: authLoading ? 0.6 : 1 }}>
                {authLoading ? 'Masuk...' : 'Masuk ke Akun'}
              </button>
            </div>
          )}

          {authIsRegister && (
            <div className="auth-register-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <input placeholder="Nama lengkap" value={state.authName} onChange={e => updateState({ authName: e.target.value })} style={{ gridColumn: '1/3', padding: '13px', border: '2px solid #14110D', background: '#fff', fontSize: '14px' }} />
              <input placeholder="Email" value={state.authEmail} onChange={e => updateState({ authEmail: e.target.value })} style={{ gridColumn: '1/3', padding: '13px', border: '2px solid #14110D', background: '#fff', fontSize: '14px' }} />
              <input placeholder="No. Telp / WhatsApp" value={authPhone} onChange={e => setAuthPhone(e.target.value)} style={{ gridColumn: '1/3', padding: '13px', border: '2px solid #14110D', background: '#fff', fontSize: '14px' }} />
              <div ref={cityRef} style={{ gridColumn: '1/3', position: 'relative' }}>
                <input placeholder="Kota / Kabupaten" value={authCity} onChange={e => searchCity(e.target.value)} onFocus={() => cityResults.length > 0 && setShowCityDropdown(true)} style={{ width: '100%', padding: '13px', border: '2px solid #14110D', background: '#fff', fontSize: '14px', boxSizing: 'border-box' }} />
                {showCityDropdown && cityResults.length > 0 && (
                  <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#fff', border: '2px solid #14110D', borderTop: 'none', maxHeight: '200px', overflowY: 'auto', zIndex: 10 }}>
                    {cityResults.slice(0, 30).map(city => (
                      <div key={city.id} onClick={() => selectCity(city)} style={{ padding: '10px 13px', cursor: 'pointer', fontSize: '13px', borderBottom: '1px solid #ddd5c4' }}
                        onMouseEnter={e => e.currentTarget.style.background = '#F2EEE4'}
                        onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
                        <span style={{ fontWeight: 700 }}>{city.label || city.city_name}</span>
                        <span style={{ color: '#6b655a', marginLeft: '6px' }}>{city.province_name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <input placeholder="Kode Pos" value={authPostalCode} readOnly style={{ gridColumn: '1/3', padding: '13px', border: '2px solid #14110D', background: selectedCityObj ? '#e4ddcd' : '#fff', fontSize: '14px', cursor: selectedCityObj ? 'not-allowed' : 'text' }} />
              <input placeholder="Alamat lengkap" value={authAddress} onChange={e => setAuthAddress(e.target.value)} style={{ gridColumn: '1/3', padding: '13px', border: '2px solid #14110D', background: '#fff', fontSize: '14px' }} />
              <input type="password" placeholder="Password (opsional)" value={authPassword} onChange={e => setAuthPassword(e.target.value)} style={{ gridColumn: '1/3', padding: '13px', border: '2px solid #14110D', background: '#fff', fontSize: '14px' }} />
              {authPassword && (
                <input type="password" placeholder="Konfirmasi Password" value={authPasswordConfirm} onChange={e => setAuthPasswordConfirm(e.target.value)} style={{ gridColumn: '1/3', padding: '13px', border: '2px solid #14110D', background: '#fff', fontSize: '14px' }} />
              )}
              <button onClick={handleRegister} disabled={authLoading} style={{ gridColumn: '1/3', background: '#F2C015', color: '#14110D', border: 'none', cursor: authLoading ? 'not-allowed' : 'pointer', fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: '13px', letterSpacing: '0.06em', textTransform: 'uppercase', padding: '15px', marginTop: '6px', opacity: authLoading ? 0.6 : 1 }}>
                {authLoading ? 'Mendaftar...' : 'Buat Akun'}
              </button>
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
