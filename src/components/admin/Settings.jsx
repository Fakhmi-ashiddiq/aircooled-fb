import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';

export default function Settings() {
  const { data, setData, state, updateState } = useContext(AppContext);

  const route = state.adminRoute; // 'sizes' | 'colors' | 'roles'

  // ==================== SIZES LOGIC ====================
  const addSizeSet = () => {
    const name = (state.newSetName || '').trim();
    if (!name) return;
    const id = 'ss' + Date.now();
    setData(prev => ({ ...prev, sizeSets: [...prev.sizeSets, { id, name, active: true, sizes: [], guideImg: null }] }));
    updateState({ newSetName: '' });
  };

  const toggleSizeSet = (id) => {
    setData(prev => ({ ...prev, sizeSets: prev.sizeSets.map(ss => ss.id === id ? { ...ss, active: !ss.active } : ss) }));
  };

  const deleteSizeSet = (id) => {
    setData(prev => ({ ...prev, sizeSets: prev.sizeSets.filter(ss => ss.id !== id) }));
  };

  const addSizeToSet = (id) => {
    const val = (state.sizeInputs[id] || '').trim().toUpperCase();
    if (!val) return;
    setData(prev => ({ ...prev, sizeSets: prev.sizeSets.map(ss => ss.id === id ? { ...ss, sizes: [...new Set([...ss.sizes, val])] } : ss) }));
    updateState({ sizeInputs: { ...state.sizeInputs, [id]: '' } });
  };

  const removeSizeFromSet = (setId, sz) => {
    setData(prev => ({ ...prev, sizeSets: prev.sizeSets.map(ss => ss.id === setId ? { ...ss, sizes: ss.sizes.filter(s => s !== sz) } : ss) }));
  };

  // FUNGSI BARU: Upload & Preview Gambar Panduan
  const handleUploadGuide = (id, event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    // Membuat URL sementara untuk preview gambar di browser
    const imageUrl = URL.createObjectURL(file);
    
    setData(prev => ({
      ...prev,
      sizeSets: prev.sizeSets.map(ss => ss.id === id ? { ...ss, guideImg: imageUrl } : ss)
    }));
  };

  // ==================== COLORS LOGIC ====================
  const addColor = () => {
    const name = (state.newColorName || '').trim();
    if (!name) return;
    const id = 'co' + Date.now();
    setData(prev => ({ ...prev, colorOptions: [...prev.colorOptions, { id, name, hex: state.newColorHex || '#D9CBB0', active: true }] }));
    updateState({ newColorName: '', newColorHex: '#D9CBB0' });
  };

  const toggleColor = (id) => {
    setData(prev => ({ ...prev, colorOptions: prev.colorOptions.map(c => c.id === id ? { ...c, active: !c.active } : c) }));
  };

  const deleteColor = (id) => {
    setData(prev => ({ ...prev, colorOptions: prev.colorOptions.filter(c => c.id !== id) }));
  };

  // ==================== ROLES LOGIC ====================
  const addRole = () => {
    const name = (state.newRoleName || '').trim();
    if (!name) return;
    const id = 'ro' + Date.now();
    setData(prev => ({ ...prev, roles: [...prev.roles, { id, name, pic: state.newRolePic || '' }] }));
    updateState({ newRoleName: '', newRolePic: '' });
  };

  const deleteRole = (id) => {
    setData(prev => ({ ...prev, roles: prev.roles.filter(r => r.id !== id) }));
  };

  // Shared Styles
  const inputStyle = { padding: '12px 16px', border: '2px solid #14110D', fontFamily: "'Archivo', sans-serif", fontSize: '14px', background: '#fff', flex: 1, outline: 'none' };
  
  return (
    <>
      {/* ======================= UKURAN ======================= */}
      {route === 'sizes' && (
        <>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '12px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6b655a' }}>Pengaturan</div>
          <h1 style={{ fontFamily: "'Archivo'", fontWeight: 900, fontSize: '40px', margin: '4px 0 8px', textTransform: 'uppercase' }}>Pilihan Ukuran</h1>
          <p style={{ margin: '0 0 24px', fontSize: '14px', color: '#6b655a', lineHeight: 1.5, maxWidth: '800px' }}>
            Buat set ukuran (mis. Regular, Oversized) — tiap set punya daftar ukuran sendiri, gambar panduan, dan status aktif. Saat membuat sesi pre-order, pilih salah satu set.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', border: '2px solid #14110D', background: '#fff', padding: '10px 16px', marginBottom: '32px' }}>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', color: '#9a8f7a', letterSpacing: '0.08em', textTransform: 'uppercase', flexShrink: 0 }}>Set Baru:</span>
            <input placeholder="mis. Longsleeve" value={state.newSetName || ''} onChange={e => updateState({ newSetName: e.target.value })} style={inputStyle} />
            <button onClick={addSizeSet} style={{ background: '#F2C015', color: '#14110D', border: 'none', cursor: 'pointer', fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: '11px', textTransform: 'uppercase', padding: '14px 24px', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>
              + Tambah Set
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
            {data.sizeSets.map(ss => (
              <div key={ss.id} style={{ border: '2px solid #14110D', background: '#fff', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '2px solid #14110D' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ fontFamily: "'Archivo'", fontWeight: 900, fontSize: '18px', textTransform: 'uppercase' }}>{ss.name}</div>
                    <span style={{ background: ss.active ? '#14110D' : '#e4ddcd', color: ss.active ? '#F2EEE4' : '#6b655a', fontFamily: "'Space Mono', monospace", fontSize: '10px', fontWeight: 700, padding: '4px 8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      {ss.active ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => toggleSizeSet(ss.id)} style={{ background: '#fff', color: '#14110D', border: '2px solid #14110D', cursor: 'pointer', fontFamily: "'Space Mono', monospace", fontSize: '10px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', padding: '6px 12px' }}>
                      {ss.active ? 'NONAKTIFKAN' : 'AKTIFKAN'}
                    </button>
                    <button onClick={() => deleteSizeSet(ss.id)} style={{ background: '#14110D', color: '#F2EEE4', border: 'none', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontFamily: "'Space Mono', monospace", fontSize: '14px' }}>
                      ×
                    </button>
                  </div>
                </div>
                
                <div style={{ padding: '20px' }}>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', color: '#9a8f7a', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>Ukuran</div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
                    {ss.sizes.map(sz => (
                      <div key={sz} style={{ display: 'flex', alignItems: 'center', gap: '8px', border: '2px solid #14110D', padding: '6px 10px', background: '#fff' }}>
                        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '12px', fontWeight: 700 }}>{sz}</span>
                        <button onClick={() => removeSizeFromSet(ss.id, sz)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9a8f7a', fontSize: '12px', padding: 0 }}>×</button>
                      </div>
                    ))}
                  </div>
                  
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
                    <input placeholder="mis. XXL" value={state.sizeInputs[ss.id] || ''} onChange={e => updateState({ sizeInputs: { ...state.sizeInputs, [ss.id]: e.target.value } })} onKeyDown={e => e.key === 'Enter' && addSizeToSet(ss.id)} style={inputStyle} />
                    <button onClick={() => addSizeToSet(ss.id)} style={{ background: '#14110D', color: '#F2EEE4', border: 'none', cursor: 'pointer', fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: '11px', letterSpacing: '0.06em', textTransform: 'uppercase', padding: '0 20px', whiteSpace: 'nowrap' }}>
                      + UKURAN
                    </button>
                  </div>
                  
                  <div style={{ borderBottom: '1px solid #ddd5c4', marginBottom: '24px' }}></div>
                  
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', color: '#9a8f7a', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>Gambar Panduan Ukuran</div>
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    
                    {/* Kotak Preview Gambar */}
                    <div style={{ width: '64px', height: '64px', border: '2px solid #14110D', background: '#e4ddcd', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Space Mono', monospace", fontSize: '10px', color: '#9a8f7a', textAlign: 'center', overflow: 'hidden' }}>
                      {ss.guideImg ? (
                        <img src={ss.guideImg} alt={`Panduan ${ss.name}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <>Belum<br/>ada</>
                      )}
                    </div>
                    
                    {/* Tombol Upload (Menggunakan Label agar input file tersembunyi) */}
                    <label style={{ border: '2px solid #14110D', background: '#fff', color: '#14110D', fontFamily: "'Space Mono', monospace", fontSize: '11px', fontWeight: 700, padding: '10px 16px', cursor: 'pointer', letterSpacing: '0.06em', display: 'inline-block' }}>
                      UPLOAD PANDUAN
                      <input 
                        type="file" 
                        accept="image/*" 
                        style={{ display: 'none' }} 
                        onChange={(e) => handleUploadGuide(ss.id, e)} 
                      />
                    </label>

                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ======================= WARNA ======================= */}
      {route === 'colors' && (
        <>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '12px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6b655a' }}>Pengaturan</div>
          <h1 style={{ fontFamily: "'Archivo'", fontWeight: 900, fontSize: '40px', margin: '4px 0 8px', textTransform: 'uppercase' }}>Pilihan Warna</h1>
          <p style={{ margin: '0 0 24px', fontSize: '14px', color: '#6b655a', lineHeight: 1.5, maxWidth: '800px' }}>
            Daftar warna yang bisa dipilih saat membuat sesi pre-order. Atur nama, kode warna, dan status aktif.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', border: '2px solid #14110D', background: '#fff', padding: '10px 16px', marginBottom: '32px' }}>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', color: '#9a8f7a', letterSpacing: '0.08em', textTransform: 'uppercase', flexShrink: 0 }}>Warna Baru:</span>
            <input placeholder="Nama warna" value={state.newColorName || ''} onChange={e => updateState({ newColorName: e.target.value })} style={inputStyle} />
            <div style={{ display: 'flex', alignItems: 'center', border: '2px solid #14110D', padding: '4px', background: '#fff' }}>
              <input type="color" value={state.newColorHex || '#D9CBB0'} onChange={e => updateState({ newColorHex: e.target.value })} style={{ width: '38px', height: '38px', border: 'none', cursor: 'pointer', padding: 0 }} />
            </div>
            <input value={state.newColorHex || '#D9CBB0'} onChange={e => updateState({ newColorHex: e.target.value })} style={{ ...inputStyle, flex: 'none', width: '120px' }} />
            <button onClick={addColor} style={{ background: '#F2C015', color: '#14110D', border: 'none', cursor: 'pointer', fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: '11px', textTransform: 'uppercase', padding: '14px 24px', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>
              + Tambah
            </button>
          </div>

          <div style={{ border: '2px solid #14110D', background: '#fff' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '40px 1fr 200px auto auto auto', gap: '16px', padding: '12px 20px', borderBottom: '2px solid #14110D', fontFamily: "'Space Mono', monospace", fontSize: '10px', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#9a8f7a', alignItems: 'center' }}>
              <span style={{ gridColumn: '1 / 3' }}>Warna Nama</span>
              <span>Kode</span>
              <span style={{ gridColumn: '4 / 7', textAlign: 'right', paddingRight: '48px' }}>Status</span>
            </div>
            {data.colorOptions.map(c => (
              <div key={c.id} style={{ display: 'grid', gridTemplateColumns: '40px 1fr 200px auto auto auto', gap: '16px', padding: '12px 20px', borderBottom: '1px solid #ddd5c4', alignItems: 'center' }}>
                <div style={{ width: '40px', height: '40px', background: c.hex, border: '2px solid #14110D' }}></div>
                <div style={{ padding: '10px 14px', border: '2px solid #14110D', fontFamily: "'Archivo'", fontSize: '14px', fontWeight: 600 }}>{c.name}</div>
                <div style={{ padding: '10px 14px', border: '2px solid #14110D', fontFamily: "'Space Mono', monospace", fontSize: '13px' }}>{c.hex}</div>
                
                <span style={{ background: c.active ? '#14110D' : '#e4ddcd', color: c.active ? '#F2EEE4' : '#6b655a', padding: '6px 10px', fontFamily: "'Space Mono', monospace", fontSize: '10px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  {c.active ? 'AKTIF' : 'NONAKTIF'}
                </span>
                
                <button onClick={() => toggleColor(c.id)} style={{ border: '2px solid #14110D', background: '#fff', color: '#14110D', fontFamily: "'Space Mono', monospace", fontSize: '10px', fontWeight: 700, padding: '6px 12px', cursor: 'pointer', letterSpacing: '0.06em' }}>
                  {c.active ? 'NONAKTIFKAN' : 'AKTIFKAN'}
                </button>
                
                <button onClick={() => deleteColor(c.id)} style={{ background: '#14110D', color: '#F2EEE4', border: 'none', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontFamily: "'Space Mono', monospace", fontSize: '14px' }}>
                  ×
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ======================= PERAN ======================= */}
      {route === 'roles' && (
        <>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '12px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6b655a' }}>Pengaturan</div>
          <h1 style={{ fontFamily: "'Archivo'", fontWeight: 900, fontSize: '40px', margin: '4px 0 8px', textTransform: 'uppercase' }}>Peran</h1>
          <p style={{ margin: '0 0 24px', fontSize: '14px', color: '#6b655a', lineHeight: 1.5, maxWidth: '800px' }}>
            Daftar peran/pihak yang bisa dipilih saat mengatur pembagian profit sesi pre-order (mis. Aircooled Syndicate, pic Atot | RDPL, pic Dzikri).
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', border: '2px solid #14110D', background: '#fff', padding: '10px 16px', marginBottom: '32px' }}>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', color: '#9a8f7a', letterSpacing: '0.08em', textTransform: 'uppercase', flexShrink: 0 }}>Peran Baru:</span>
            <input placeholder="Nama (mis. RDPL)" value={state.newRoleName || ''} onChange={e => updateState({ newRoleName: e.target.value })} style={inputStyle} />
            <input placeholder="PIC (mis. Atot)" value={state.newRolePic || ''} onChange={e => updateState({ newRolePic: e.target.value })} style={inputStyle} />
            <button onClick={addRole} style={{ background: '#F2C015', color: '#14110D', border: 'none', cursor: 'pointer', fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: '11px', textTransform: 'uppercase', padding: '14px 24px', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>
              + Tambah Peran
            </button>
          </div>

          <div style={{ border: '2px solid #14110D', background: '#fff' }}>
            {data.roles.map(r => (
              <div key={r.id} style={{ padding: '16px 20px', borderBottom: '1px solid #ddd5c4', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontFamily: "'Archivo'", fontWeight: 900, fontSize: '16px' }}>{r.name}</span>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', color: '#9a8f7a', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    PIC: <span style={{ color: '#14110D' }}>{r.pic || '—'}</span>
                  </span>
                </div>
                <button onClick={() => deleteRole(r.id)} style={{ background: '#14110D', color: '#F2EEE4', border: 'none', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontFamily: "'Space Mono', monospace", fontSize: '14px' }}>
                  ×
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
}