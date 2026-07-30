import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { rp } from '../../utils/helpers';
import useProductVM from '../../hooks/useProductVM';

export default function CatalogEdit() {
  const { data, setData, state, updateState, go } = useContext(AppContext);
  const { getProductVM } = useProductVM();

  const p = data.PRODUCTS.find(x => x.id === state.adminProdId);
  if (!p) return null;

  const vm = getProductVM(p);
  const editP = state.editProd || p;

  const field = (k) => editP[k] ?? p[k];
  const setField = (k, v) => updateState({ editProd: { ...editP, [k]: v } });

  const save = () => {
    setData(prev => ({
      ...prev,
      PRODUCTS: prev.PRODUCTS.map(x => x.id === p.id ? { ...x, ...editP } : x)
    }));
    updateState({ adminRoute: 'catalog', adminProdId: null, editProd: null });
    window.scrollTo(0, 0);
  };

  const cancel = () => {
    updateState({ adminRoute: 'catalog', adminProdId: null, editProd: null });
    window.scrollTo(0, 0);
  };

  const inputStyle = { padding: '12px 14px', border: '2px solid #14110D', fontFamily: "'Archivo', sans-serif", fontSize: '14px', background: '#fff', width: '100%' };
  const labelStyle = { fontFamily: "'Space Mono', monospace", fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#6b655a', display: 'block', marginBottom: '6px' };

  const colorList = p.colors || [];
  const preorderSess = p.type === 'preorder' ? p.preorder : null;
  const prodSessions = p.type === 'ready' ? (p.productionSessions || []) : [];

  return (
    <>
      <button onClick={cancel} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Space Mono', monospace", fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#6b655a', marginBottom: '16px' }}>
        ← Kembali ke Katalog
      </button>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '28px' }}>
        <div>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '12px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6b655a' }}>Edit Produk</div>
          <h1 style={{ fontFamily: "'Archivo'", fontWeight: 900, fontSize: '36px', margin: '4px 0 0', textTransform: 'uppercase' }}>{p.name}</h1>
        </div>
        <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
          <button onClick={cancel} style={{ background: '#fff', color: '#14110D', border: '2px solid #14110D', cursor: 'pointer', fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: '12px', textTransform: 'uppercase', padding: '12px 18px' }}>Batal</button>
          <button onClick={save} style={{ background: '#F2C015', color: '#14110D', border: 'none', cursor: 'pointer', fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: '12px', textTransform: 'uppercase', padding: '12px 18px' }}>Simpan Perubahan</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '28px', alignItems: 'start' }}>
        {/* left: visual */}
        <div>
          <div style={{ background: field('garment'), aspectRatio: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #14110D', marginBottom: '16px' }}>
            {p.print === 'logo' && <img src="/assets/logo.png" style={{ width: '48%' }} alt="" />}
            {p.print === 'text' && <div style={{ color: '#F2C015', fontFamily: "'Archivo'", fontWeight: 900, fontSize: '44px', lineHeight: 0.9, textAlign: 'center', textTransform: 'uppercase' }}>Aircooled<br/>Syndicate</div>}
          </div>
          <div>
            <label style={labelStyle}>Warna Garmen (HEX)</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input type="color" value={field('garment') || '#D9CBB0'} onChange={e => setField('garment', e.target.value)} style={{ width: '52px', height: '52px', border: '2px solid #14110D', cursor: 'pointer', padding: '4px' }} />
              <input value={field('garment') || '#D9CBB0'} onChange={e => setField('garment', e.target.value)} style={{ ...inputStyle, flex: 1 }} />
            </div>
          </div>
        </div>

        {/* right: fields */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={labelStyle}>Nama Produk</label>
            <input value={field('name')} onChange={e => setField('name', e.target.value)} style={inputStyle} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={labelStyle}>Kategori</label>
              <select value={field('cat')} onChange={e => setField('cat', e.target.value)} style={inputStyle}>
                {data.categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Harga Jual (Rp)</label>
              <input type="number" value={field('price')} onChange={e => setField('price', parseInt(e.target.value) || 0)} style={inputStyle} />
            </div>
          </div>
          {p.type === 'ready' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={labelStyle}>Harga Coret (Rp)</label>
                <input type="number" value={field('compareAt') || ''} onChange={e => setField('compareAt', parseInt(e.target.value) || 0)} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Stok</label>
                <input type="number" value={field('stock')} onChange={e => setField('stock', parseInt(e.target.value) || 0)} style={inputStyle} />
              </div>
            </div>
          )}
          <div>
            <label style={labelStyle}>Ukuran (koma pisah)</label>
            <input value={(field('sizes') || []).join(',')} onChange={e => setField('sizes', e.target.value.split(',').map(s => s.trim()).filter(Boolean))} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Deskripsi</label>
            <textarea value={field('desc')} onChange={e => setField('desc', e.target.value)} rows={4} style={{ ...inputStyle, resize: 'vertical' }} />
          </div>
          <div>
            <label style={labelStyle}>Biaya Produksi / Kemasan / Stiker</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
              <input type="number" placeholder="Produksi" value={(field('costs') || {}).production || ''} onChange={e => setField('costs', { ...(field('costs') || {}), production: parseInt(e.target.value) || 0 })} style={inputStyle} />
              <input type="number" placeholder="Kemasan" value={(field('costs') || {}).kemasan || ''} onChange={e => setField('costs', { ...(field('costs') || {}), kemasan: parseInt(e.target.value) || 0 })} style={inputStyle} />
              <input type="number" placeholder="Stiker" value={(field('costs') || {}).stiker || ''} onChange={e => setField('costs', { ...(field('costs') || {}), stiker: parseInt(e.target.value) || 0 })} style={inputStyle} />
            </div>
          </div>
        </div>
      </div>

      {/* Production sessions (ready only) */}
      {p.type === 'ready' && prodSessions.length > 0 && (
        <div style={{ marginTop: '28px' }}>
          <div style={{ fontFamily: "'Archivo'", fontWeight: 800, fontSize: '18px', textTransform: 'uppercase', marginBottom: '14px', borderBottom: '2px solid #14110D', paddingBottom: '10px' }}>Sesi Produksi</div>
          {prodSessions.map((sess, i) => (
            <div key={i} style={{ border: '2px solid #14110D', background: '#fff', padding: '16px 20px', marginBottom: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6b655a' }}>{sess.name} · {sess.date}</div>
                  <div style={{ fontFamily: "'Archivo'", fontWeight: 700, fontSize: '15px', marginTop: '4px' }}>{sess.qty} unit diproduksi · {sess.sold} terjual</div>
                </div>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', fontWeight: 700, padding: '4px 10px', background: sess.status === 'active' ? '#F2C015' : '#14110D', color: sess.status === 'active' ? '#14110D' : '#F2EEE4', textTransform: 'uppercase' }}>
                  {sess.status === 'active' ? 'Aktif' : 'Selesai'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Preorder session info */}
      {preorderSess && (
        <div style={{ marginTop: '28px', border: '2px solid #14110D', background: '#fff', padding: '20px' }}>
          <div style={{ fontFamily: "'Archivo'", fontWeight: 800, fontSize: '18px', textTransform: 'uppercase', marginBottom: '14px' }}>Info Sesi Pre-Order — {preorderSess.sessionName}</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px', fontFamily: "'Space Mono', monospace", fontSize: '13px' }}>
            <div><div style={{ color: '#6b655a', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Status</div><div style={{ fontWeight: 700, marginTop: '3px' }}>{preorderSess.status}</div></div>
            <div><div style={{ color: '#6b655a', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Terpesan</div><div style={{ fontWeight: 700, marginTop: '3px' }}>{preorderSess.committed} / {preorderSess.target}</div></div>
            <div><div style={{ color: '#6b655a', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>ETA</div><div style={{ fontWeight: 700, marginTop: '3px' }}>{preorderSess.eta}</div></div>
          </div>
        </div>
      )}
    </>
  );
}
