import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { rp } from '../../utils/helpers';

export default function Catalog() {
  const { data, setData, state, updateState, openProduct, unitsOf } = useContext(AppContext);

  const { catalogTab, catalogSearch, catalogCat, catalogSort } = state;
  const readyProducts = data.PRODUCTS.filter(p => p.type === 'ready');
  const preorderProducts = data.PRODUCTS.filter(p => p.type === 'preorder');
  const isReady = catalogTab === 'ready';

  let display = isReady ? readyProducts : preorderProducts;
  const q = (catalogSearch || '').trim().toLowerCase();
  if (q) display = display.filter(p => (p.name + ' ' + p.cat).toLowerCase().includes(q));
  if (catalogCat !== 'all') display = display.filter(p => p.cat === catalogCat);
  if (catalogSort === 'terbaru') display = [...display].sort((a, b) => b._seq - a._seq);
  if (catalogSort === 'harga-asc') display = [...display].sort((a, b) => a.price - b.price);
  if (catalogSort === 'harga-desc') display = [...display].sort((a, b) => b.price - a.price);
  if (catalogSort === 'terlaris') display = [...display].sort((a, b) => unitsOf(b) - unitsOf(a));

  const tabBtn = (id, label) => ({
    label,
    style: {
      background: catalogTab === id ? '#14110D' : '#fff',
      color: catalogTab === id ? '#F2EEE4' : '#14110D',
      border: '2px solid #14110D',
      cursor: 'pointer',
      fontFamily: "'Space Mono', monospace",
      fontWeight: 700,
      fontSize: '12px',
      letterSpacing: '0.04em',
      textTransform: 'uppercase',
      padding: '10px 18px'
    },
    click: () => updateState({ catalogTab: id })
  });

  const tabs = [tabBtn('ready', `Ready Stock (${readyProducts.length})`), tabBtn('preorder', `Pre-Order (${preorderProducts.length})`)];

  const addProduct = () => {
    updateState({ prodModal: true });
  };

  const editProduct = (p) => {
    updateState({ adminRoute: 'catalog-edit', adminProdId: p.id, editProd: { ...p } });
    window.scrollTo(0, 0);
  };

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '12px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6b655a' }}>Manajemen</div>
          <h1 style={{ fontFamily: "'Archivo'", fontWeight: 900, fontSize: '40px', margin: '4px 0 0', textTransform: 'uppercase' }}>Katalog Produk</h1>
        </div>
        <button onClick={addProduct} style={{ background: '#F2C015', color: '#14110D', border: 'none', cursor: 'pointer', fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: '12px', letterSpacing: '0.06em', textTransform: 'uppercase', padding: '14px 20px', marginTop: '8px', whiteSpace: 'nowrap' }}>
          + Produk Baru
        </button>
      </div>

      <div style={{ display: 'flex', gap: 0, marginBottom: '24px' }}>
        {tabs.map((t, i) => <button key={i} onClick={t.click} style={t.style}>{t.label}</button>)}
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
          <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6b655a' }}>⌕</span>
          <input placeholder="Cari produk..." value={catalogSearch} onChange={e => updateState({ catalogSearch: e.target.value })} style={{ width: '100%', padding: '12px 12px 12px 34px', border: '2px solid #14110D', fontFamily: 'inherit', fontSize: '14px' }} />
        </div>
        <select value={catalogCat} onChange={e => updateState({ catalogCat: e.target.value })} style={{ padding: '12px', border: '2px solid #14110D', fontFamily: "'Space Mono', monospace", fontSize: '13px' }}>
          <option value="all">Semua Kategori</option>
          {data.categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={catalogSort} onChange={e => updateState({ catalogSort: e.target.value })} style={{ padding: '12px', border: '2px solid #14110D', fontFamily: "'Space Mono', monospace", fontSize: '13px' }}>
          <option value="terbaru">Terbaru</option>
          <option value="harga-asc">Harga ↑</option>
          <option value="harga-desc">Harga ↓</option>
          <option value="terlaris">Terlaris</option>
        </select>
      </div>

      <div style={{ border: '2px solid #14110D', background: '#fff' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr auto auto auto auto auto', gap: 0, padding: '12px 16px', background: '#14110D', color: '#F2EEE4', fontFamily: "'Space Mono', monospace", fontSize: '10px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          <span>Thumb</span><span>Produk</span><span style={{ textAlign: 'right', paddingRight: '16px' }}>Stok/Unit</span><span style={{ textAlign: 'right', paddingRight: '16px' }}>Terjual</span><span style={{ textAlign: 'right', paddingRight: '16px' }}>Harga</span><span style={{ textAlign: 'center', paddingRight: '16px' }}>Views</span><span>Aksi</span>
        </div>
        {display.map((p) => (
          <div key={p.id} style={{ display: 'grid', gridTemplateColumns: '80px 1fr auto auto auto auto auto', gap: 0, padding: '14px 16px', borderTop: '1px solid #ddd5c4', alignItems: 'center' }}>
            <div style={{ width: '60px', height: '60px', background: p.garment, border: '2px solid #14110D', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              {p.print === 'logo' && <img src="/assets/logo.png" style={{ width: '60%' }} alt="" />}
              {p.print === 'text' && <div style={{ color: '#F2C015', fontFamily: "'Archivo'", fontWeight: 900, fontSize: '9px', lineHeight: 0.9, textAlign: 'center', textTransform: 'uppercase' }}>AC<br/>SYND</div>}
            </div>
            <div style={{ paddingLeft: '12px' }}>
              <div style={{ fontFamily: "'Archivo'", fontWeight: 700, fontSize: '15px', textTransform: 'uppercase', lineHeight: 1.1 }}>{p.name}</div>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', color: '#6b655a', marginTop: '2px' }}>{p.cat} · {p.type === 'preorder' ? 'Pre-Order' : 'Ready Stock'}</div>
            </div>
            <div style={{ textAlign: 'right', paddingRight: '16px', fontFamily: "'Space Mono', monospace", fontSize: '13px' }}>{p.type === 'preorder' ? (p.preorder?.committed || 0) + ' order' : (p.stock || 0) + ' unit'}</div>
            <div style={{ textAlign: 'right', paddingRight: '16px', fontFamily: "'Space Mono', monospace", fontSize: '13px' }}>{unitsOf(p)}</div>
            <div style={{ textAlign: 'right', paddingRight: '16px', fontFamily: "'Space Mono', monospace", fontSize: '13px' }}>{rp(p.price)}</div>
            <div style={{ textAlign: 'center', paddingRight: '16px', fontFamily: "'Space Mono', monospace", fontSize: '13px' }}>{(p.views || 0).toLocaleString('id-ID')}</div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => editProduct(p)} style={{ background: '#F2C015', color: '#14110D', border: 'none', cursor: 'pointer', fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: '11px', textTransform: 'uppercase', padding: '7px 12px', whiteSpace: 'nowrap' }}>Edit</button>
              <button onClick={() => openProduct(p.id)} style={{ background: 'none', color: '#14110D', border: '2px solid #14110D', cursor: 'pointer', fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: '11px', textTransform: 'uppercase', padding: '5px 10px' }}>Lihat</button>
            </div>
          </div>
        ))}
        {display.length === 0 && (
          <div style={{ padding: '40px', textAlign: 'center', fontFamily: "'Space Mono', monospace", fontSize: '13px', color: '#6b655a' }}>Tidak ada produk ditemukan.</div>
        )}
      </div>
    </>
  );
}
