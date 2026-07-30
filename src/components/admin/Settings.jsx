import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';

export default function Settings() {
  const { data, setData, state, updateState } = useContext(AppContext);

  const route = state.adminRoute; // 'sizes' | 'colors' | 'roles'

  // Sizes
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

  // Colors
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

  // Roles
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

  const inputStyle = { padding: '12px', border: '2px solid #14110D', fontFamily: "'Archivo', sans-serif", fontSize: '14px', background: '#fff', flex: 1 };
  const addBtnStyle = { background: '#F2C015', color: '#14110D', border: 'none', cursor: 'pointer', fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: '12px', textTransform: 'uppercase', padding: '12px 16px', whiteSpace: 'nowrap' };
  const delBtnStyle = { background: 'none', border: '1px solid #9a3a2a', color: '#9a3a2a', cursor: 'pointer', fontFamily: "'Space Mono', monospace", fontSize: '11px', padding: '4px 10px' };

  return (
    <>
      {route === 'sizes' && (
        <>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '12px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6b655a' }}>Pengaturan</div>
          <h1 style={{ fontFamily: "'Archivo'", fontWeight: 900, fontSize: '40px', margin: '4px 0 28px', textTransform: 'uppercase' }}>Ukuran</h1>

          <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
            <input placeholder="Nama size set (mis. Regular)" value={state.newSetName || ''} onChange={e => updateState({ newSetName: e.target.value })} style={inputStyle} />
            <button onClick={addSizeSet} style={addBtnStyle}>+ Tambah</button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {data.sizeSets.map(ss => (
              <div key={ss.id} style={{ border: '2px solid #14110D', background: '#fff' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderBottom: '1px solid #ddd5c4' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ fontFamily: "'Archivo'", fontWeight: 700, fontSize: '16px', textTransform: 'uppercase' }}>{ss.name}</div>
                    <button onClick={() => toggleSizeSet(ss.id)} style={{ background: ss.active ? '#14110D' : '#fff', color: ss.active ? '#F2EEE4' : '#14110D', border: '2px solid #14110D', cursor: 'pointer', fontFamily: "'Space Mono', monospace", fontSize: '10px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', padding: '4px 10px' }}>
                      {ss.active ? 'Aktif' : 'Nonaktif'}
                    </button>
                  </div>
                  <button onClick={() => deleteSizeSet(ss.id)} style={delBtnStyle}>Hapus</button>
                </div>
                <div style={{ padding: '14px 18px' }}>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
                    {ss.sizes.map(sz => (
                      <div key={sz} style={{ display: 'flex', alignItems: 'center', gap: '4px', border: '2px solid #14110D', padding: '6px 10px', background: '#F2EEE4' }}>
                        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '13px', fontWeight: 700 }}>{sz}</span>
                        <button onClick={() => removeSizeFromSet(ss.id, sz)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9a3a2a', fontSize: '14px', lineHeight: 1, padding: '0 0 0 4px' }}>×</button>
                      </div>
                    ))}
                    {ss.sizes.length === 0 && <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '12px', color: '#9a8f7a' }}>Belum ada ukuran.</span>}
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input placeholder="Tambah ukuran (mis. XL)" value={state.sizeInputs[ss.id] || ''} onChange={e => updateState({ sizeInputs: { ...state.sizeInputs, [ss.id]: e.target.value } })} onKeyDown={e => e.key === 'Enter' && addSizeToSet(ss.id)} style={{ ...inputStyle, flex: 'none', width: '220px' }} />
                    <button onClick={() => addSizeToSet(ss.id)} style={addBtnStyle}>+</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {route === 'colors' && (
        <>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '12px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6b655a' }}>Pengaturan</div>
          <h1 style={{ fontFamily: "'Archivo'", fontWeight: 900, fontSize: '40px', margin: '4px 0 28px', textTransform: 'uppercase' }}>Warna</h1>

          <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', flexWrap: 'wrap' }}>
            <input placeholder="Nama warna (mis. Off-White)" value={state.newColorName || ''} onChange={e => updateState({ newColorName: e.target.value })} style={inputStyle} />
            <div style={{ display: 'flex', alignItems: 'center', border: '2px solid #14110D', overflow: 'hidden' }}>
              <input type="color" value={state.newColorHex || '#D9CBB0'} onChange={e => updateState({ newColorHex: e.target.value })} style={{ width: '48px', height: '48px', border: 'none', cursor: 'pointer', padding: '4px' }} />
            </div>
            <button onClick={addColor} style={addBtnStyle}>+ Tambah Warna</button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '12px' }}>
            {data.colorOptions.map(c => (
              <div key={c.id} style={{ border: '2px solid #14110D', background: '#fff', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', background: c.hex, border: '2px solid #14110D', flex: 'none' }}></div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "'Archivo'", fontWeight: 700, fontSize: '14px', textTransform: 'uppercase' }}>{c.name}</div>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', color: '#6b655a' }}>{c.hex}</div>
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button onClick={() => toggleColor(c.id)} style={{ background: c.active ? '#14110D' : '#fff', color: c.active ? '#F2EEE4' : '#14110D', border: '2px solid #14110D', cursor: 'pointer', fontFamily: "'Space Mono', monospace", fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', padding: '4px 8px' }}>
                    {c.active ? 'ON' : 'OFF'}
                  </button>
                  <button onClick={() => deleteColor(c.id)} style={delBtnStyle}>×</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {route === 'roles' && (
        <>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '12px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6b655a' }}>Pengaturan</div>
          <h1 style={{ fontFamily: "'Archivo'", fontWeight: 900, fontSize: '40px', margin: '4px 0 28px', textTransform: 'uppercase' }}>Peran & Kolaborator</h1>

          <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', flexWrap: 'wrap' }}>
            <input placeholder="Nama organisasi / brand" value={state.newRoleName || ''} onChange={e => updateState({ newRoleName: e.target.value })} style={inputStyle} />
            <input placeholder="Nama PIC" value={state.newRolePic || ''} onChange={e => updateState({ newRolePic: e.target.value })} style={{ ...inputStyle, flex: 'none', width: '180px' }} />
            <button onClick={addRole} style={addBtnStyle}>+ Tambah Peran</button>
          </div>

          <div style={{ border: '2px solid #14110D', background: '#fff' }}>
            <div style={{ padding: '12px 20px', borderBottom: '2px solid #14110D', background: '#14110D', color: '#F2EEE4', fontFamily: "'Space Mono', monospace", fontSize: '10px', letterSpacing: '0.08em', textTransform: 'uppercase', display: 'grid', gridTemplateColumns: '80px 1fr 1fr auto' }}>
              <span>ID</span><span>Organisasi</span><span>PIC</span><span>Aksi</span>
            </div>
            {data.roles.map(r => (
              <div key={r.id} style={{ display: 'grid', gridTemplateColumns: '80px 1fr 1fr auto', padding: '14px 20px', borderBottom: '1px solid #ddd5c4', alignItems: 'center' }}>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '12px', color: '#6b655a' }}>{r.id}</span>
                <span style={{ fontFamily: "'Archivo'", fontWeight: 700, fontSize: '15px', textTransform: 'uppercase' }}>{r.name}</span>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '13px', color: '#3d382f' }}>{r.pic || '—'}</span>
                <button onClick={() => deleteRole(r.id)} style={delBtnStyle}>Hapus</button>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
}
