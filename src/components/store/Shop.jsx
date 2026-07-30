import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import useProductVM from '../../hooks/useProductVM';

export default function Shop() {
  const { state, updateState, data, openProduct } = useContext(AppContext);
  const { getProductVM } = useProductVM();

  const allVM = data.PRODUCTS.map(getProductVM);
  const readyProducts = allVM.filter(p => !p.isPreorder);
  const preorderProducts = allVM.filter(p => p.isPreorder);

  let shopProducts = allVM;
  if (state.shopFilter === 'ready') shopProducts = readyProducts;
  if (state.shopFilter === 'preorder') shopProducts = preorderProducts;
  if (state.shopCat && state.shopCat !== 'all') shopProducts = shopProducts.filter(p => p.cat === state.shopCat);
  
  const q = (state.shopSearch || '').trim().toLowerCase();
  if (q) shopProducts = shopProducts.filter(p => (p.name + ' ' + p.cat).toLowerCase().includes(q));

  const shopCountLabel = `${shopProducts.length} produk`;

  const shopCatOptions = [{ value: 'all', label: 'Semua Kategori' }].concat(data.categories.map(c => ({ value: c, label: c })));
  const shopTypeOptions = [
    { value: 'all', label: 'Semua' },
    { value: 'ready', label: 'Ready Stock' },
    { value: 'preorder', label: 'Pre-Order' }
  ];

  return (
    <main style={{ padding: '48px' }}>
      <h1 style={{ fontFamily: "'Archivo'", fontWeight: 900, fontSize: '52px', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '-0.02em' }}>Shop</h1>
      <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '13px', color: '#6b655a', marginBottom: '24px' }}>{shopCountLabel}</div>
      
      <div style={{ display: 'flex', gap: '12px', marginBottom: '32px', borderBottom: '2px solid #14110D', paddingBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
          <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '15px', color: '#6b655a', pointerEvents: 'none' }}>⌕</span>
          <input 
            placeholder="Cari produk…" 
            value={state.shopSearch} 
            onChange={(e) => updateState({ shopSearch: e.target.value })} 
            style={{ width: '100%', padding: '13px 14px', paddingLeft: '38px', border: '2px solid #14110D', background: '#fff', fontSize: '14px', fontFamily: "'Archivo', sans-serif" }} 
          />
        </div>
        
        <select 
          value={state.shopCat} 
          onChange={(e) => updateState({ shopCat: e.target.value })} 
          style={{ width: '180px', flex: 'none', padding: '13px', border: '2px solid #14110D', fontFamily: "'Space Mono', monospace", fontSize: '13px' }}
        >
          {shopCatOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>

        <select 
          value={state.shopFilter} 
          onChange={(e) => updateState({ shopFilter: e.target.value })} 
          style={{ width: '160px', flex: 'none', padding: '13px', border: '2px solid #14110D', fontFamily: "'Space Mono', monospace", fontSize: '13px' }}
        >
          {shopTypeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '22px' }}>
        {shopProducts.map(item => (
          <div key={item.id} style={{ cursor: 'pointer' }} onClick={() => openProduct(item.id)}>
            <div style={{ background: item.garment, aspectRatio: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #14110D', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: '10px', left: '10px', background: item.badgeBg, color: item.badgeFg, fontFamily: "'Space Mono', monospace", fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '4px 8px', fontWeight: 700 }}>
                {item.badgeLabel}
              </div>
              {item.hasDiscount && (
                <div style={{ position: 'absolute', top: '10px', right: '10px', background: '#F2C015', color: '#14110D', fontFamily: "'Space Mono', monospace", fontSize: '11px', fontWeight: 700, padding: '4px 8px' }}>
                  −{item.discountPct}%
                </div>
              )}
              {item.printLogo && <img src="/assets/logo.png" style={{ width: '52%' }} />}
              {item.printText && (
                <div style={{ color: '#F2C015', fontFamily: "'Archivo'", fontWeight: 900, fontSize: '24px', lineHeight: 0.9, textAlign: 'center', textTransform: 'uppercase' }}>
                  Aircooled<br/>Syndicate
                </div>
              )}
            </div>
            <div style={{ paddingTop: '12px' }}>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6b655a' }}>{item.cat}</div>
              <div style={{ fontFamily: "'Archivo'", fontWeight: 700, fontSize: '16px', textTransform: 'uppercase', lineHeight: 1.05, marginTop: '3px' }}>{item.name}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '5px' }}>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '13px', fontWeight: 700 }}>{item.priceFmt}</span>
                {item.hasDiscount && (
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '12px', color: '#9a8f7a', textDecoration: 'line-through' }}>{item.compareFmt}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {shopProducts.length === 0 && (
        <div style={{ textAlign: 'center', padding: '64px 20px', border: '2px dashed #c9c1ad', fontFamily: "'Space Mono', monospace", fontSize: '14px', color: '#6b655a' }}>
          Tidak ada produk yang cocok dengan pencarian / filter.
        </div>
      )}
    </main>
  );
}
