import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';

export default function CategoryModal() {
  const { data, setData, state, updateState } = useContext(AppContext);

  if (!state.catModal) return null;

  const close = () => updateState({ catModal: false });

  const addCategory = () => {
    const c = (state.newCat || '').trim();
    if (!c) return;
    setData((prev) => ({
      ...prev,
      categories: prev.categories.includes(c) ? prev.categories : [...prev.categories, c]
    }));
    updateState({ catModal: false, newCat: '' });
  };

  return (
    <>
      <style>{`
        @media (max-width: 480px) {
          .catmodal-box { width: 94vw !important; }
          .catmodal-body { padding: 18px !important; }
        }
      `}</style>
      <div onClick={close} style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(20,17,13,0.62)' }} />
      <div
        className="catmodal-box"
        style={{ position: 'fixed', zIndex: 101, top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '400px', maxWidth: '92vw', background: '#F2EEE4', border: '2px solid #14110D' }}
      >
        <div style={{ padding: '18px 22px', borderBottom: '2px solid #14110D', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontFamily: "'Archivo'", fontWeight: 900, fontSize: '20px', textTransform: 'uppercase' }}>Tambah Kategori</div>
          <button onClick={close} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '24px', lineHeight: 1 }}>×</button>
        </div>
        <div className="catmodal-body" style={{ padding: '22px' }}>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6b655a', marginBottom: '8px' }}>
            Nama Kategori
          </div>
          <input
            placeholder="mis. Patch, Enamel Pin"
            value={state.newCat || ''}
            onChange={(e) => updateState({ newCat: e.target.value })}
            style={{ width: '100%', padding: '14px', border: '2px solid #14110D', background: '#fff', fontSize: '14px' }}
          />
          <button
            onClick={addCategory}
            style={{ marginTop: '18px', width: '100%', background: '#14110D', color: '#F2EEE4', border: 'none', cursor: 'pointer', fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: '13px', letterSpacing: '0.06em', textTransform: 'uppercase', padding: '14px' }}
          >
            Simpan Kategori
          </button>
        </div>
      </div>
    </>
  );
}