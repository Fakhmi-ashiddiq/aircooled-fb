import React, { useContext } from 'react';
import { useStore } from '../../store';

export default function Settings() {
  const { data, setData, state, updateState } = useStore();

  const route = state.adminRoute;

  const addSizeSet = async () => {
    const name = (state.newSetName || '').trim();
    if (!name) return;
    await useStore.getState().addSizeSet(name);
    updateState({ newSetName: '' });
  };

  const toggleSizeSet = async (id) => {
    const ss = data.sizeSets.find(s => s.id === id);
    if(ss) await useStore.getState().updateSizeSet(id, { active: !ss.active });
  };

  const deleteSizeSet = async (id) => {
    await useStore.getState().deleteSizeSet(id);
  };

  const addSizeToSet = async (id) => {
    const val = (state.sizeInputs[id] || '').trim().toUpperCase();
    if (!val) return;
    const ss = data.sizeSets.find(s => s.id === id);
    if(ss) {
        await useStore.getState().updateSizeSet(id, { sizes: [...new Set([...ss.sizes, val])] });
        updateState({ sizeInputs: { ...state.sizeInputs, [id]: '' } });
    }
  };

  const removeSizeFromSet = async (setId, sz) => {
    const ss = data.sizeSets.find(s => s.id === setId);
    if(ss) await useStore.getState().updateSizeSet(setId, { sizes: ss.sizes.filter(s => s !== sz) });
  };

  const handleUploadGuide = async (id, event) => {
    const file = event.target.files[0];
    if (!file) return;
    const imageUrl = URL.createObjectURL(file);
    await useStore.getState().updateSizeSet(id, { guideImg: imageUrl });
  };

  const addColor = async () => {
    const name = (state.newColorName || '').trim();
    if (!name) return;
    await useStore.getState().addColorOption(name, state.newColorHex || '#D9CBB0');
    updateState({ newColorName: '', newColorHex: '#D9CBB0' });
  };

  const toggleColor = async (id) => {
    const c = data.colorOptions.find(o => o.id === id);
    if(c) await useStore.getState().updateColorOption(id, { active: !c.active });
  };

  const deleteColor = async (id) => {
    await useStore.getState().deleteColorOption(id);
  };

  const addOwner = async () => {
    const name = (state.newOwnerName || '').trim();
    if (!name) return;
    await useStore.getState().addOwner(name, state.newOwnerPic || '');
    updateState({ newOwnerName: '', newOwnerPic: '' });
  };

  const deleteOwner = async (id) => {
    await useStore.getState().deleteOwner(id);
  };

  const inputStyle = { padding: '12px 16px', border: '2px solid #14110D', fontFamily: "'Archivo', sans-serif", fontSize: '14px', background: '#fff', flex: 1, outline: 'none', minWidth: '140px' };

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .settings-new-row { flex-wrap: wrap !important; }
          .settings-new-row > input, .settings-new-row > button, .settings-new-row > div { width: 100% !important; }
          .settings-sizesets-grid { grid-template-columns: 1fr !important; }
          .settings-colors-scroll { overflow-x: auto !important; -webkit-overflow-scrolling: touch; }
          .settings-colors-inner { min-width: 640px; }
          .settings-role-row { flex-wrap: wrap !important; gap: 10px !important; }
        }
      `}</style>

      {route === 'sizes' && (
        <>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '12px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6b655a' }}>Pengaturan</div>
          <h1 style={{ fontFamily: "'Archivo'", fontWeight: 900, fontSize: '40px', margin: '4px 0 8px', textTransform: 'uppercase' }}>Pilihan Ukuran</h1>
          <p style={{ margin: '0 0 24px', fontSize: '14px', color: '#6b655a', lineHeight: 1.5, maxWidth: '800px' }}>
            Buat set ukuran (mis. Regular, Oversized) — tiap set punya daftar ukuran sendiri, gambar panduan, dan status aktif. Saat membuat sesi pre-order, pilih salah satu set.
          </p>

          <div className="settings-new-row" style={{ display: 'flex', alignItems: 'center', gap: '16px', border: '2px solid #14110D', background: '#fff', padding: '10px 16px', marginBottom: '32px' }}>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', color: '#9a8f7a', letterSpacing: '0.08em', textTransform: 'uppercase', flexShrink: 0 }}>Set Baru:</span>
            <input placeholder="mis. Longsleeve" value={state.newSetName || ''} onChange={e => updateState({ newSetName: e.target.value })} style={inputStyle} />
            <button onClick={addSizeSet} style={{ background: '#F2C015', color: '#14110D', border: 'none', cursor: 'pointer', fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: '11px', textTransform: 'uppercase', padding: '14px 24px', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>
              + Tambah Set
            </button>
          </div>

          <div className="settings-sizesets-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
            {data.sizeSets.map(ss => (
              <div key={ss.id} style={{ border: '2px solid #14110D', background: '#fff', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '2px solid #14110D', flexWrap: 'wrap', gap: '8px' }}>
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

                  <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
                    <input placeholder="mis. XXL" value={state.sizeInputs[ss.id] || ''} onChange={e => updateState({ sizeInputs: { ...state.sizeInputs, [ss.id]: e.target.value } })} onKeyDown={e => e.key === 'Enter' && addSizeToSet(ss.id)} style={{ ...inputStyle, minWidth: '100px' }} />
                    <button onClick={() => addSizeToSet(ss.id)} style={{ background: '#14110D', color: '#F2EEE4', border: 'none', cursor: 'pointer', fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: '11px', letterSpacing: '0.06em', textTransform: 'uppercase', padding: '0 20px', whiteSpace: 'nowrap', minHeight: '46px' }}>
                      + UKURAN
                    </button>
                  </div>

                  <div style={{ borderBottom: '1px solid #ddd5c4', marginBottom: '24px' }}></div>

                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', color: '#9a8f7a', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>Gambar Panduan Ukuran</div>
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div style={{ width: '64px', height: '64px', border: '2px solid #14110D', background: '#e4ddcd', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Space Mono', monospace", fontSize: '10px', color: '#9a8f7a', textAlign: 'center', overflow: 'hidden', flexShrink: 0 }}>
                      {ss.guideImg ? (
                        <img src={ss.guideImg} alt={`Panduan ${ss.name}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <>Belum<br/>ada</>
                      )}
                    </div>

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

      {route === 'colors' && (
        <>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '12px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6b655a' }}>Pengaturan</div>
          <h1 style={{ fontFamily: "'Archivo'", fontWeight: 900, fontSize: '40px', margin: '4px 0 8px', textTransform: 'uppercase' }}>Pilihan Warna</h1>
          <p style={{ margin: '0 0 24px', fontSize: '14px', color: '#6b655a', lineHeight: 1.5, maxWidth: '800px' }}>
            Daftar warna yang bisa dipilih saat membuat sesi pre-order. Atur nama, kode warna, dan status aktif.
          </p>

          <div className="settings-new-row" style={{ display: 'flex', alignItems: 'center', gap: '16px', border: '2px solid #14110D', background: '#fff', padding: '10px 16px', marginBottom: '32px' }}>
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

          <div style={{ border: '2px solid #14110D', background: '#fff' }} className="settings-colors-scroll">
            <div className="settings-colors-inner">
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
          </div>
        </>
      )}

      {route === 'roles' && (
        <>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '12px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6b655a' }}>Pengaturan</div>
          <h1 style={{ fontFamily: "'Archivo'", fontWeight: 900, fontSize: '40px', margin: '4px 0 8px', textTransform: 'uppercase' }}>Peran</h1>
          <p style={{ margin: '0 0 24px', fontSize: '14px', color: '#6b655a', lineHeight: 1.5, maxWidth: '800px' }}>
            Daftar peran/pihak yang bisa dipilih saat mengatur pembagian profit sesi pre-order (mis. Aircooled Syndicate, pic Atot | RDPL, pic Dzikri).
          </p>

          <div className="settings-new-row" style={{ display: 'flex', alignItems: 'center', gap: '16px', border: '2px solid #14110D', background: '#fff', padding: '10px 16px', marginBottom: '32px' }}>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', color: '#9a8f7a', letterSpacing: '0.08em', textTransform: 'uppercase', flexShrink: 0 }}>Peran Baru:</span>
            <input placeholder="Nama (mis. RDPL)" value={state.newOwnerName || ''} onChange={e => updateState({ newOwnerName: e.target.value })} style={inputStyle} />
            <input placeholder="PIC (mis. Atot)" value={state.newOwnerPic || ''} onChange={e => updateState({ newOwnerPic: e.target.value })} style={inputStyle} />
            <button onClick={addOwner} style={{ background: '#F2C015', color: '#14110D', border: 'none', cursor: 'pointer', fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: '11px', textTransform: 'uppercase', padding: '14px 24px', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>
              + Tambah Peran
            </button>
          </div>

          <div style={{ border: '2px solid #14110D', background: '#fff' }}>
            {data.owners.map(r => (
              <div key={r.id} className="settings-role-row" style={{ padding: '16px 20px', borderBottom: '1px solid #ddd5c4', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: "'Archivo'", fontWeight: 900, fontSize: '16px' }}>{r.name}</span>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', color: '#9a8f7a', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    PIC: <span style={{ color: '#14110D' }}>{r.pic || '—'}</span>
                  </span>
                </div>
                <button onClick={() => deleteOwner(r.id)} style={{ background: '#14110D', color: '#F2EEE4', border: 'none', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontFamily: "'Space Mono', monospace", fontSize: '14px' }}>
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

