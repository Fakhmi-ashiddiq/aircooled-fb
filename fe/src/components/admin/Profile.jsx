import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store';
import AuthService from '../../services/AuthService';
import CityService from '../../services/CityService';

export default function Profile() {
  const { state, updateState, logout } = useStore();
  const navigate = useNavigate();
  const user = state.user;

  // Form states
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [password, setPassword] = useState('');
  
  // City search states
  const [citySearch, setCitySearch] = useState(user?.city_name || '');
  const [selectedCity, setSelectedCity] = useState(user?.city_id ? { id: user.city_id, name: user.city_name || '', postcode: user.postal_code || '' } : null);
  const [postalCode, setPostalCode] = useState(user?.postal_code || '');
  const [cityResults, setCityResults] = useState([]);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const cityRef = useRef(null);
  const searchTimeout = useRef(null);

  // Status
  const [saving, setSaving] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  useEffect(() => {
    if (!user && !localStorage.getItem('auth_token')) {
      navigate('/');
    }
  }, [user, navigate]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cityRef.current && !cityRef.current.contains(event.target)) {
        setShowCityDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  const searchCity = (query) => {
    setCitySearch(query);
    if (!query || query.length < 3) {
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
    setCitySearch(displayName);
    setPostalCode(String(city.zip_code || ''));
    setSelectedCity({ id: city.id, name: displayName, postcode: city.zip_code });
    setShowCityDropdown(false);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      if (phone) formData.append('phone', phone);
      if (address) formData.append('address', address);
      if (selectedCity?.id) formData.append('city_id', selectedCity.id);
      const cName = selectedCity?.name || selectedCity?.label || selectedCity?.city_name;
      if (cName) formData.append('city_name', cName);
      if (postalCode) formData.append('postal_code', postalCode);
      if (password.trim() !== '') formData.append('password', password);
      
      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }

      const res = await AuthService.updateProfile(formData);
      updateState({ 
        user: res.user,
        toast: 'Profil berhasil diperbarui'
      });
      setPassword('');
    } catch (err) {
      console.error(err);
      let errMsg = 'Gagal menyimpan profil';
      if (err.response?.data?.errors) {
        const errs = Object.values(err.response.data.errors).flat();
        if (errs.length) errMsg = errs[0];
      }
      updateState({ toast: errMsg });
    }
    setSaving(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const inputStyle = { width: '100%', padding: '13px', border: '2px solid #14110D', background: '#fff', fontSize: '14px', fontFamily: "'Space Mono', monospace", boxSizing: 'border-box' };
  const labelStyle = { fontFamily: "'Space Mono', monospace", fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#6b655a', marginBottom: '8px', display: 'block' };
  const sectionTitleStyle = { fontFamily: "'Archivo'", fontWeight: 800, fontSize: '18px', textTransform: 'uppercase', marginBottom: '16px', borderBottom: '2px solid #14110D', paddingBottom: '8px' };

  return (
    <>
      <style>{`
        .profile-container {
          background: #F2EEE4;
          min-height: 100vh;
          padding: 48px;
        }
        .profile-inner {
          max-width: 800px;
          margin: 0 auto;
        }
        .profile-grid {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 32px;
          align-items: start;
        }
        .profile-card {
          border: 2px solid #14110D;
          background: #fff;
          padding: 32px;
          box-shadow: 4px 4px 0px #14110D;
        }
        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        .form-full {
          grid-column: 1 / 3;
        }
        @media (max-width: 768px) {
          .profile-container { padding: 24px 16px; }
          .profile-grid { grid-template-columns: 1fr; gap: 24px; }
          .form-grid { grid-template-columns: 1fr; gap: 16px; }
          .form-full { grid-column: 1 / 2; }
          .profile-card { padding: 24px; }
        }
      `}</style>
      
      <div className="profile-container">
        <div className="profile-inner">
          <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Space Mono', monospace", fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#6b655a', marginBottom: '32px', display: 'inline-flex', alignItems: 'center', gap: '8px', padding: 0 }}>
            <span>←</span> Kembali
          </button>

          <h1 style={{ fontFamily: "'Archivo'", fontWeight: 900, fontSize: '36px', margin: '0 0 32px', textTransform: 'uppercase', color: '#14110D' }}>
            Pengaturan Akun
          </h1>

          <div className="profile-grid">
            {/* Left Sidebar - Avatar & Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="profile-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '40px 24px' }}>
                <div style={{ width: '96px', height: '96px', borderRadius: '50%', background: '#F2C015', border: '2px solid #14110D', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px', boxShadow: '2px 2px 0px #14110D', overflow: 'hidden' }}>
                  {avatarPreview || user.avatar ? (
                    <img src={avatarPreview || `http://localhost:8000/storage/${user.avatar}`} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span style={{ fontFamily: "'Archivo'", fontWeight: 900, fontSize: '42px', color: '#14110D', marginTop: '-4px' }}>
                      {user.name?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  )}
                  <input id="avatar-input" type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarChange} />
                </div>
                <button onClick={() => document.getElementById('avatar-input').click()} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Space Mono', monospace", fontSize: '10px', letterSpacing: '0.05em', textTransform: 'uppercase', color: '#6b655a', textDecoration: 'underline', marginBottom: '8px' }}>
                  Ubah Foto Profil
                </button>
                <div style={{ fontFamily: "'Archivo'", fontWeight: 900, fontSize: '20px', color: '#14110D', textTransform: 'uppercase', wordBreak: 'break-word' }}>
                  {user.name}
                </div>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '12px', color: '#6b655a', marginTop: '6px' }}>
                  {user.email}
                </div>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', background: '#14110D', color: '#F2EEE4', padding: '6px 12px', marginTop: '16px', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 }}>
                  {user.role === 'admin' ? 'Administrator' : 'Customer'}
                </div>
              </div>

              <button onClick={handleLogout} style={{ width: '100%', background: '#fff', color: '#ff4d4d', border: '2px solid #14110D', cursor: 'pointer', fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: '12px', letterSpacing: '0.06em', textTransform: 'uppercase', padding: '16px', boxShadow: '2px 2px 0px #14110D', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#ff4d4d'; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#ff4d4d'; }}>
                Keluar Akun
              </button>
            </div>

            {/* Right Side - Form */}
            <div className="profile-card" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              
              {/* Data Pribadi */}
              <div>
                <h2 style={sectionTitleStyle}>Data Pribadi</h2>
                <div className="form-grid">
                  <div className="form-full">
                    <label style={labelStyle}>Nama Lengkap</label>
                    <input value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Nomor WhatsApp</label>
                    <input value={phone} onChange={(e) => setPhone(e.target.value)} style={inputStyle} placeholder="Misal: 0812..." />
                  </div>
                  <div className="form-full">
                    <label style={labelStyle}>Alamat Lengkap</label>
                    <textarea value={address} onChange={(e) => setAddress(e.target.value)} rows="3" style={{ ...inputStyle, resize: 'vertical' }} placeholder="Nama jalan, gedung, blok, RT/RW..."></textarea>
                  </div>
                </div>
              </div>

              {/* Keamanan */}
              <div>
                <h2 style={sectionTitleStyle}>Keamanan</h2>
                <div className="form-grid">
                  <div className="form-full">
                    <label style={labelStyle}>Password Baru (Opsional)</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} placeholder="Isi hanya jika ingin mengganti password" />
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
                <button onClick={handleSave} disabled={saving} style={{ background: '#14110D', color: '#F2C015', border: 'none', cursor: saving ? 'not-allowed' : 'pointer', fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: '14px', letterSpacing: '0.06em', textTransform: 'uppercase', padding: '16px 32px', display: 'inline-flex', alignItems: 'center', gap: '8px', boxShadow: '4px 4px 0px #F2C015', transition: 'transform 0.1s', transform: saving ? 'translate(4px, 4px)' : 'none' }}>
                  {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}
