import React, { useContext } from 'react';
import { useStore } from '../../store';
import useProductVM from '../../hooks/useProductVM';
import Reveal from '../shared/Reveal';

export default function Shop() {
  const { state, updateState, data, openProduct, dataLoading } = useStore();
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
    <main className="shop-main-pad" style={{ padding: '48px' }}>
      <style>{`
        @keyframes skelPulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
        .skel-box { animation: skelPulse 1.4s ease-in-out infinite; background: #d8d2c4; }
        @media (max-width: 768px) {
          .shop-main-pad { padding: 24px 20px !important; }
          .shop-title { font-size: 32px !important; }
          .shop-filter-row { flex-direction: column !important; align-items: stretch !important; }
          .shop-search-wrap { min-width: 0 !important; width: 100% !important; }
          .shop-cat-select, .shop-type-select { width: 100% !important; }
          .shop-products-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 14px !important; }
        }
      `}</style>

      <h1 className="shop-title" style={{ fontFamily: "'Archivo'", fontWeight: 900, fontSize: '52px', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '-0.02em' }}>Shop</h1>
      <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '13px', color: '#6b655a', marginBottom: '24px' }}>{shopCountLabel}</div>

      <div className="shop-filter-row" style={{ display: 'flex', gap: '12px', marginBottom: '32px', borderBottom: '2px solid #14110D', paddingBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div className="shop-search-wrap" style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
          <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '15px', color: '#6b655a', pointerEvents: 'none' }}>⌕</span>
          <input
            placeholder="Cari produk…"
            value={state.shopSearch}
            onChange={(e) => updateState({ shopSearch: e.target.value })}
            style={{ width: '100%', padding: '13px 14px', paddingLeft: '38px', border: '2px solid #14110D', background: '#fff', fontSize: '14px', fontFamily: "'Archivo', sans-serif" }}
          />
        </div>

        <select
          className="shop-cat-select"
          value={state.shopCat}
          onChange={(e) => updateState({ shopCat: e.target.value })}
          style={{ width: '180px', flex: 'none', padding: '13px', border: '2px solid #14110D', fontFamily: "'Space Mono', monospace", fontSize: '13px' }}
        >
          {shopCatOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>

        <select
          className="shop-type-select"
          value={state.shopFilter}
          onChange={(e) => updateState({ shopFilter: e.target.value })}
          style={{ width: '160px', flex: 'none', padding: '13px', border: '2px solid #14110D', fontFamily: "'Space Mono', monospace", fontSize: '13px' }}
        >
          {shopTypeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
      </div>

      <div className="shop-products-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '22px' }}>
        {dataLoading && Array.from({ length: 8 }).map((_, i) => (
          <div key={i}>
            <div className="skel-box" style={{ aspectRatio: 1, border: '2px solid #14110D' }}></div>
            <div style={{ paddingTop: '12px' }}>
              <div className="skel-box" style={{ height: '10px', width: '35%', marginBottom: '5px' }}></div>
              <div className="skel-box" style={{ height: '16px', width: '75%', marginBottom: '5px' }}></div>
              <div className="skel-box" style={{ height: '13px', width: '45%' }}></div>
            </div>
          </div>
        ))}
        {!dataLoading && shopProducts.map((item, idx) => (
          <Reveal key={item.id} delay={(idx % 4) * 0.06}>
            <div style={{ cursor: 'pointer' }} onClick={() => openProduct(item.id)}>
              <div style={{ background: item.garment, aspectRatio: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #14110D', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '10px', left: '10px', background: item.badgeBg, color: item.badgeFg, fontFamily: "'Space Mono', monospace", fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '4px 8px', fontWeight: 700 }}>
                  {item.badgeLabel}
                </div>
                {item.hasDiscount && (
                  <div style={{ position: 'absolute', top: '10px', right: '10px', background: '#F2C015', color: '#14110D', fontFamily: "'Space Mono', monospace", fontSize: '11px', fontWeight: 700, padding: '4px 8px' }}>
                    −{item.discountPct}%
                  </div>
                )}
                {item.images && item.images.length > 0 && item.images[0].src && item.images[0].src !== '/logo.jpg' ? (
                  <img src={item.images[0].src} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : item.printLogo ? (
                  <img src="/assets/logo.png" style={{ width: '52%' }} />
                ) : item.printText ? (
                  <div style={{ color: '#F2C015', fontFamily: "'Archivo'", fontWeight: 900, fontSize: '24px', lineHeight: 0.9, textAlign: 'center', textTransform: 'uppercase' }}>
                    Aircooled<br/>Syndicate
                  </div>
                ) : null}
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
          </Reveal>
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
