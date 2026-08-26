import React, { useContext, useEffect } from 'react';
import { useStore } from '../../store';
import useProductVM from '../../hooks/useProductVM';
import ProductService from '../../services/ProductService';

export default function ProductDetail() {
  const { state, updateState, data, openProduct, addToCart, go } = useStore();
  const { getProductVM } = useProductVM();

  const ap = data.PRODUCTS.find(x => x.id === state.activeId);

  useEffect(() => {
    if (ap && ap.db_id) {
      ProductService.getById(ap.db_id).catch(() => {});
    }
  }, [ap?.db_id]);

  if (!ap) return null;

  const activeP = getProductVM(ap, state.selectedSize);

  const sizes = ap.sizes.map(sz => ({
    label: sz,
    pick: () => updateState({ selectedSize: sz }),
    style: {
      background: state.selectedSize === sz ? '#14110D' : '#fff',
      color: state.selectedSize === sz ? '#F2EEE4' : '#14110D',
      border: '2px solid #14110D',
      cursor: 'pointer',
      fontFamily: "'Space Mono', monospace",
      fontWeight: 700,
      fontSize: '13px',
      minWidth: '48px',
      padding: '11px 8px'
    }
  }));

  const hasSizes = ap.sizes.length > 1;
  const stockTotal = Object.values(ap.stock || {}).reduce((a, b) => a + (b || 0), 0);
  const selectedSizeStock = state.selectedSize ? (ap.stock || {})[state.selectedSize] : null;
  const stockNote = ap.type === 'preorder'
    ? 'Produksi berjalan setelah sesi pre-order ditutup. Pembayaran di muka.'
    : (stockTotal > 0
      ? (state.selectedSize && selectedSizeStock !== undefined
        ? `Stok ${state.selectedSize}: ${selectedSizeStock} unit · Kirim 1–2 hari kerja`
        : `Total stok: ${stockTotal} unit · Kirim 1–2 hari kerja`)
      : 'Stok habis');
  const ctaLabel = ap.type === 'preorder' ? 'Pesan Pre-Order' : 'Tambah ke Keranjang';
  const specs = ap.type === 'preorder'
    ? [{ k: 'Kategori', v: ap.cat }, { k: 'Sesi', v: ap.preorder.sessionName }, { k: 'Estimasi Kirim', v: ap.preorder.eta }, { k: 'Pembayaran', v: 'Penuh di muka' }]
    : [{ k: 'Kategori', v: ap.cat }, { k: 'Bahan', v: 'Premium' }, { k: 'Pengiriman', v: '1–2 hari kerja' }, { k: 'Stok', v: ap.sizes.map(sz => `${sz}: ${ap.stock?.[sz] || 0}`).join(' / ') + ' unit' }];

  const colorList = (ap.colors && ap.colors.length) ? ap.colors : [{ name: 'Default', hex: ap.garment }];
  const selColor = colorList.find(c => c.name === state.selectedColor);
  const curColor = selColor || colorList[0];
  const pDisplayGarment = curColor ? curColor.hex : ap.garment;

  const colorVMs = colorList.map(c => ({
    name: c.name,
    hex: c.hex,
    swatchStyle: {
      width: '40px', height: '40px', cursor: 'pointer',
      border: state.selectedColor === c.name ? '3px solid #14110D' : '2px solid #c9c1ad',
      background: c.hex
    },
    pick: () => updateState({ selectedColor: c.name })
  }));

  const needsSize = ap.sizes.length > 1;
  const needsColor = colorList.length > 1;
  const sizeOk = !needsSize || !!state.selectedSize;
  const colorOk = !needsColor || !!selColor;
  const canBuy = sizeOk && colorOk;

  const ctaStyle = {
    flex: 1, border: 'none', fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: '14px', letterSpacing: '0.06em', textTransform: 'uppercase', padding: '0 24px',
    background: canBuy ? '#14110D' : '#d8d2c4', color: canBuy ? '#F2EEE4' : '#8a8377', cursor: canBuy ? 'pointer' : 'not-allowed'
  };

  const ctaHint = canBuy ? '' : ((!sizeOk && !colorOk) ? 'Pilih warna & ukuran dulu.' : (!sizeOk ? 'Pilih ukuran dulu.' : 'Pilih warna dulu.'));

  const galleryVMs = (ap.gallery && ap.gallery.length ? ap.gallery : ['Depan']).map((g, i) => ({
    label: g, bg: pDisplayGarment, idx: i + 1,
    thumbStyle: {
      aspectRatio: 1, cursor: 'pointer',
      border: i === state.activeImg ? '2px solid #14110D' : '2px solid #c9c1ad',
      background: pDisplayGarment, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative'
    },
    pick: () => updateState({ activeImg: i, lightbox: false })
  }));
  const activeImgIdx = Math.min(state.activeImg, galleryVMs.length - 1);
  const activeGalleryLabel = (galleryVMs[activeImgIdx] || {}).label || '';

  const allVMList = data.PRODUCTS.map(getProductVM);
  const relatedProducts = allVMList.filter(p => p.id !== state.activeId).sort((a, b) => {
    const ap0 = data.PRODUCTS.find(x => x.id === state.activeId);
    const sameA = ap0 && a.cat === ap0.cat ? 0 : 1;
    const sameB = ap0 && b.cat === ap0.cat ? 0 : 1;
    return sameA - sameB;
  }).slice(0, 4);

  const openPreorder = () => {
    if (!canBuy) return;
    const size = state.selectedSize || (ap.sizes && ap.sizes[0]) || '-';
    const color = state.selectedColor || (ap.colors && ap.colors[0] && ap.colors[0].name) || '-';
    const items = [{ size, color, qty: state.qty || 1 }];
    updateState({ poModal: true, poDone: false, poMode: 'guest', poCity: '', poShip: '', authName: '', authEmail: '', poItems: items });
  };

  const onCta = activeP.isPreorder ? openPreorder : addToCart;

  return (
    <main className="pd-main-pad" style={{ padding: '32px 48px 64px' }}>
      <style>{`
        @media (max-width: 768px) {
          .pd-main-pad { padding: 20px 16px 40px !important; }
          .pd-main-grid { grid-template-columns: 1fr !important; gap: 28px !important; }
          .pd-visual-col { position: static !important; top: auto !important; }
          .pd-title { font-size: 30px !important; }
          .pd-related-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 14px !important; }
          .pd-preorder-panel-grid { gap: 12px !important; }
        }
      `}</style>

      <button onClick={() => go('shop')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Space Mono', monospace", fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#6b655a', marginBottom: '24px' }}>
        ← Kembali ke Shop
      </button>
      <div className="pd-main-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'start' }}>

        {/* visual + slider */}
        <div className="pd-visual-col" style={{ position: 'sticky', top: '90px' }}>
          <div onClick={() => updateState({ lightbox: true })} style={{ background: pDisplayGarment, aspectRatio: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #14110D', position: 'relative', overflow: 'hidden', cursor: 'zoom-in' }}>
            <div style={{ position: 'absolute', bottom: '12px', right: '12px', background: 'rgba(20,17,13,0.82)', color: '#F2EEE4', fontFamily: "'Space Mono', monospace", fontSize: '10px', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '5px 10px', zIndex: 2 }}>
              ⤢ {activeGalleryLabel} — Klik perbesar
            </div>
            {ap.heroImg && <img src={ap.heroImg} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} alt="" />}
            {!ap.heroImg && activeP.images && activeP.images.length > 0 && activeP.images[0].src && activeP.images[0].src !== '/logo.jpg' ? (
                <img src={activeP.images[0].src} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
              ) : !ap.heroImg && activeP.printLogo && (
                <img src="/assets/logo.png" style={{ width: '50%' }} alt="" />
              )}
            {!ap.heroImg && activeP.images && activeP.images.some(im => im.src) ? null : !ap.heroImg && activeP.printText && (
              <div style={{ color: '#F2C015', fontFamily: "'Archivo'", fontWeight: 900, fontSize: '44px', lineHeight: 0.9, textAlign: 'center', textTransform: 'uppercase' }}>
                Aircooled<br/>Syndicate
              </div>
            )}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '10px', marginTop: '12px' }}>
            {galleryVMs.map((g, idx) => (
              <button key={idx} onClick={g.pick} style={g.thumbStyle}>
                {!ap.heroImg && activeP.images && activeP.images[idx]?.src && activeP.images[idx].src !== '/logo.jpg' ? (
                  <img src={activeP.images[idx].src} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} alt="" />
                ) : !ap.heroImg && activeP.images && activeP.images[0]?.src && activeP.images[0].src !== '/logo.jpg' ? (
                  <img src={activeP.images[0].src} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} alt="" />
                ) : !ap.heroImg && activeP.printLogo && (
                  <img src="/assets/logo.png" style={{ width: '54%' }} alt="" />
                )}
                {!ap.heroImg && (activeP.images && activeP.images.some(im => im.src)) ? null : !ap.heroImg && activeP.printText && (
                  <div style={{ color: '#F2C015', fontFamily: "'Archivo'", fontWeight: 900, fontSize: '13px', lineHeight: 0.9, textAlign: 'center', textTransform: 'uppercase' }}>
                    AC<br/>SYND
                  </div>
                )}
                <span style={{ position: 'absolute', bottom: '4px', left: '4px', fontFamily: "'Space Mono', monospace", fontSize: '8px', letterSpacing: '0.06em', textTransform: 'uppercase', background: '#14110D', color: '#F2EEE4', padding: '2px 4px' }}>
                  {g.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* info */}
        <div>
          <div style={{ display: 'inline-block', background: activeP.badgeBg, color: activeP.badgeFg, fontFamily: "'Space Mono', monospace", fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '5px 10px', fontWeight: 700, marginBottom: '16px' }}>
            {activeP.badgeLabel}
          </div>
          <h1 className="pd-title" style={{ fontFamily: "'Archivo'", fontWeight: 900, fontSize: '46px', margin: 0, textTransform: 'uppercase', lineHeight: 0.98, letterSpacing: '-0.02em' }}>{activeP.name}</h1>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6b655a', marginTop: '10px' }}>Kategori — {activeP.cat}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '14px', flexWrap: 'wrap' }}>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '22px', fontWeight: 700 }}>{activeP.priceFmt}</span>
            {activeP.hasDiscount && (
              <>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '16px', color: '#9a8f7a', textDecoration: 'line-through' }}>{activeP.compareFmt}</span>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '12px', fontWeight: 700, background: '#F2C015', color: '#14110D', padding: '4px 9px', letterSpacing: '0.04em' }}>−{activeP.discountPct}%</span>
              </>
            )}
          </div>
          <p style={{ fontSize: '15px', lineHeight: 1.65, color: '#3d382f', margin: '22px 0', maxWidth: '460px' }}>{activeP.desc}</p>

          {/* PRE-ORDER PANEL */}
          {activeP.isPreorder && (
            <div style={{ border: '2px solid #14110D', background: '#fff', padding: '22px', marginBottom: '24px' }}>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#F2C015', background: '#14110D', display: 'inline-block', padding: '5px 10px', fontWeight: 700 }}>
                ● {activeP.statusLabel}
              </div>
              <div className="pd-preorder-panel-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '18px' }}>
                <div><div style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6b655a' }}>Sesi Dibuka</div><div style={{ fontFamily: "'Archivo'", fontWeight: 700, fontSize: '15px', marginTop: '3px' }}>{activeP.opens}</div></div>
                <div><div style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6b655a' }}>Sesi Ditutup</div><div style={{ fontFamily: "'Archivo'", fontWeight: 700, fontSize: '15px', marginTop: '3px' }}>{activeP.closes}</div></div>
                <div><div style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6b655a' }}>Estimasi Kirim</div><div style={{ fontFamily: "'Archivo'", fontWeight: 700, fontSize: '15px', marginTop: '3px' }}>{activeP.eta}</div></div>
                <div><div style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6b655a' }}>Sesi</div><div style={{ fontFamily: "'Archivo'", fontWeight: 700, fontSize: '15px', marginTop: '3px' }}>{activeP.sessionName}</div></div>
              </div>
              <div style={{ marginTop: '18px', height: '9px', background: '#e4ddcd', position: 'relative' }}>
                <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${activeP.pct}%`, background: '#14110D' }}></div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "'Space Mono', monospace", fontSize: '12px', color: '#3d382f', marginTop: '8px', flexWrap: 'wrap', gap: '4px' }}>
                <span>{activeP.committed} / {activeP.target} unit terpesan</span>
                <span>Min. {activeP.target} agar produksi jalan</span>
              </div>
              {state.view === 'admin' && (
                <button onClick={() => { updateState({ sessionModal: true }) }} style={{ marginTop: '16px', width: '100%', background: '#fff', color: '#14110D', border: '2px dashed #14110D', cursor: 'pointer', fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: '11px', letterSpacing: '0.06em', textTransform: 'uppercase', padding: '11px' }}>
                  + Buat Sesi Pre-Order Baru (Admin)
                </button>
              )}
            </div>
          )}

          {/* COLOR SELECTOR */}
          {colorList.length > 1 && (
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6b655a', marginBottom: '10px' }}>Pilih Warna</div>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {colorVMs.map((c, idx) => (
                  <button key={idx} onClick={c.pick} title={c.name} style={c.swatchStyle}></button>
                ))}
              </div>
            </div>
          )}

          {/* SIZE SELECTOR */}
          {hasSizes && (
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', flexWrap: 'wrap' }}>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6b655a' }}>Pilih Ukuran</span>
                <button onClick={() => updateState({ sizeGuideOpen: true })} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Space Mono', monospace", fontSize: '11px', color: '#14110D', textDecoration: 'underline', textUnderlineOffset: '2px', padding: 0 }}>
                  (Lihat panduan ukuran)
                </button>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {sizes.map((sz, idx) => (
                  <button key={idx} onClick={sz.pick} style={sz.style}>{sz.label}</button>
                ))}
              </div>
            </div>
          )}

          {/* QTY + ADD */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'stretch', marginBottom: '14px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', border: '2px solid #14110D' }}>
              <button onClick={() => updateState({ qty: Math.max(1, state.qty - 1) })} style={{ background: 'none', border: 'none', cursor: 'pointer', width: '44px', height: '52px', fontSize: '20px', fontWeight: 700 }}>−</button>
              <div style={{ width: '44px', textAlign: 'center', fontFamily: "'Space Mono', monospace", fontSize: '16px', fontWeight: 700 }}>{state.qty}</div>
              <button onClick={() => updateState({ qty: state.qty + 1 })} style={{ background: 'none', border: 'none', cursor: 'pointer', width: '44px', height: '52px', fontSize: '20px', fontWeight: 700 }}>+</button>
            </div>
            <button onClick={onCta} style={{ ...ctaStyle, minWidth: '200px' }}>{ctaLabel}</button>
          </div>
          {ctaHint && (
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '12px', color: '#9a3a2a', marginBottom: '6px' }}>⚠ {ctaHint}</div>
          )}
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '12px', color: '#6b655a' }}>{stockNote}</div>

          {/* details */}
          <div style={{ marginTop: '32px', borderTop: '2px solid #14110D', paddingTop: '20px' }}>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6b655a', marginBottom: '12px' }}>Spesifikasi</div>
            {specs.map((row, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #ddd5c4', fontSize: '14px' }}>
                <span style={{ color: '#6b655a' }}>{row.k}</span><span style={{ fontWeight: 600 }}>{row.v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PRODUK LAINNYA */}
      <section style={{ marginTop: '56px', borderTop: '2px solid #14110D', paddingTop: '28px' }}>
        <h2 style={{ fontFamily: "'Archivo'", fontWeight: 900, fontSize: '30px', margin: '0 0 22px', textTransform: 'uppercase', letterSpacing: '-0.01em' }}>Produk Lainnya</h2>
        <div className="pd-related-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '20px' }}>
          {relatedProducts.map(item => (
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
                {item.printLogo && <img src="/assets/logo.png" style={{ width: '52%' }} alt="" />}
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
      </section>
    </main>
  );
}
