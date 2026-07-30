import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import useProductVM from '../../hooks/useProductVM';

export default function Home() {
  const { data, updateState, openProduct } = useContext(AppContext);
  const { getProductVM } = useProductVM();

  const allVM = data.PRODUCTS.map(getProductVM);
  const readyProducts = allVM.filter(p => !p.isPreorder);
  const preorderProducts = allVM.filter(p => p.isPreorder);
  const featured = preorderProducts.find(p => p.statusLabel === 'PRE-ORDER OPEN') || preorderProducts[0];

  const marquee = 'PORSCHE 911 ◦ VW BEETLE ◦ KARMANN GHIA ◦ TYPE 2 BUS ◦ 356 SPEEDSTER ◦ KEEP THEM COOL ◦ AIR-COOLED FOREVER ◦';

  const goShop = () => { updateState({ shopFilter: 'all', route: 'shop' }); window.scrollTo(0, 0); };
  const goShopPreorder = () => { updateState({ shopFilter: 'preorder', route: 'shop' }); window.scrollTo(0, 0); };

  return (
    <main>
      {/* HERO */}
      <section style={{ background: '#14110D', color: '#F2EEE4', padding: 0, borderBottom: '2px solid #14110D' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.15fr 0.85fr' }}>
          <div style={{ padding: '64px 48px 56px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '12px', letterSpacing: '0.2em', color: '#F2C015', textTransform: 'uppercase', marginBottom: '22px' }}>
              ISSUE 01 — MERCH DROP / EST. 2024
            </div>
            <h1 style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 900, fontSize: '84px', lineHeight: 0.92, letterSpacing: '-0.02em', margin: 0, textTransform: 'uppercase' }}>
              Worn by<br/>the air-<br/>cooled.
            </h1>
            <p style={{ maxWidth: '440px', fontSize: '16px', lineHeight: 1.6, color: '#cfcabd', margin: '26px 0 34px' }}>
              Merchandise resmi dari Aircooled Syndicate — e-magazine untuk pemuja Porsche &amp; Volkswagen berpendingin udara. Apparel ready stock &amp; drop pre-order edisi terbatas.
            </p>
            <div style={{ display: 'flex', gap: '14px' }}>
              <button 
                onClick={goShop} 
                style={{ background: '#F2C015', color: '#14110D', border: 'none', cursor: 'pointer', fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: '13px', letterSpacing: '0.06em', textTransform: 'uppercase', padding: '16px 28px' }}
              >
                Belanja Sekarang →
              </button>
              <button 
                onClick={goShopPreorder} 
                style={{ background: 'none', color: '#F2EEE4', border: '2px solid #4a443a', cursor: 'pointer', fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: '13px', letterSpacing: '0.06em', textTransform: 'uppercase', padding: '14px 26px' }}
              >
                Lihat Pre-Order
              </button>
            </div>
          </div>
          
          {/* featured preorder */}
          {featured && (
            <div style={{ borderLeft: '2px solid #2c2820', padding: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: '#1a1712' }}>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', letterSpacing: '0.16em', color: '#F2C015', textTransform: 'uppercase', marginBottom: '16px' }}>
                ● {featured.statusLabel}
              </div>
              <div style={{ background: featured.garment, aspectRatio: '4/3', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #14110D', position: 'relative', overflow: 'hidden' }}>
                {featured.printLogo && <img src="/assets/logo.png" style={{ width: '48%', opacity: 0.95 }} />}
                {featured.printText && (
                  <div style={{ color: '#F2C015', fontFamily: "'Archivo'", fontWeight: 900, fontSize: '30px', lineHeight: 0.9, textAlign: 'center', textTransform: 'uppercase', letterSpacing: '-0.01em' }}>
                    Aircooled<br/>Syndicate
                  </div>
                )}
              </div>
              <div style={{ marginTop: '18px' }}>
                <div style={{ fontFamily: "'Archivo'", fontWeight: 800, fontSize: '22px', textTransform: 'uppercase', lineHeight: 1 }}>{featured.name}</div>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '13px', color: '#cfcabd', marginTop: '6px' }}>
                  {featured.priceFmt} — Tutup {featured.closes}
                </div>
                <div style={{ marginTop: '14px', height: '8px', background: '#2c2820', position: 'relative' }}>
                  <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${featured.pct}%`, background: '#F2C015' }}></div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "'Space Mono', monospace", fontSize: '11px', color: '#cfcabd', marginTop: '7px' }}>
                  <span>{featured.committed} / {featured.target} TERPESAN</span>
                  <span>{featured.pct}%</span>
                </div>
                <button 
                  onClick={() => openProduct(featured.id)} 
                  style={{ marginTop: '16px', width: '100%', background: '#F2EEE4', color: '#14110D', border: 'none', cursor: 'pointer', fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: '12px', letterSpacing: '0.06em', textTransform: 'uppercase', padding: '13px' }}
                >
                  Pesan / Detail Drop
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* MARQUEE STRIP */}
      <div style={{ background: '#F2C015', color: '#14110D', overflow: 'hidden', borderBottom: '2px solid #14110D', padding: '11px 0', fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: '13px', letterSpacing: '0.16em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
        <div style={{ display: 'flex', gap: '40px', justifyContent: 'center' }}>
          <span>{marquee}</span><span>{marquee}</span>
        </div>
      </div>

      {/* READY STOCK */}
      <section style={{ padding: '56px 48px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '28px', borderBottom: '2px solid #14110D', paddingBottom: '14px' }}>
          <h2 style={{ fontFamily: "'Archivo'", fontWeight: 900, fontSize: '38px', margin: 0, textTransform: 'uppercase', letterSpacing: '-0.01em' }}>Ready Stock</h2>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#6b655a' }}>
            Kirim 1–2 hari kerja
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '20px' }}>
          {readyProducts.slice(0, 4).map(item => (
            <div key={item.id} style={{ cursor: 'pointer' }} onClick={() => openProduct(item.id)}>
              <div style={{ background: item.garment, aspectRatio: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #14110D', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '10px', left: '10px', background: '#14110D', color: '#F2EEE4', fontFamily: "'Space Mono', monospace", fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '4px 8px' }}>
                  {item.cat}
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
                <div style={{ fontFamily: "'Archivo'", fontWeight: 700, fontSize: '16px', textTransform: 'uppercase', lineHeight: 1.05 }}>{item.name}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '5px' }}>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '13px', color: '#14110D', fontWeight: 700 }}>{item.priceFmt}</span>
                  {item.hasDiscount && (
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '12px', color: '#9a8f7a', textDecoration: 'line-through' }}>{item.compareFmt}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PRE-ORDER */}
      <section style={{ padding: '0 48px 64px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '28px', borderBottom: '2px solid #14110D', paddingBottom: '14px' }}>
          <h2 style={{ fontFamily: "'Archivo'", fontWeight: 900, fontSize: '38px', margin: 0, textTransform: 'uppercase', letterSpacing: '-0.01em' }}>Pre-Order — Open Now</h2>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#6b655a' }}>
            Produksi setelah sesi tutup
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '20px' }}>
          {preorderProducts.slice(0, 3).map(item => (
            <div key={item.id} onClick={() => openProduct(item.id)} style={{ cursor: 'pointer', border: '2px solid #14110D', background: '#fff', display: 'flex', flexDirection: 'column' }}>
              <div style={{ background: item.garment, aspectRatio: '4/3', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', borderBottom: '2px solid #14110D' }}>
                <div style={{ position: 'absolute', top: '10px', left: '10px', background: '#F2C015', color: '#14110D', fontFamily: "'Space Mono', monospace", fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '4px 8px', fontWeight: 700 }}>
                  {item.statusLabel}
                </div>
                {item.printLogo && <img src="/assets/logo.png" style={{ width: '46%' }} />}
                {item.printText && (
                  <div style={{ color: '#F2C015', fontFamily: "'Archivo'", fontWeight: 900, fontSize: '26px', lineHeight: 0.9, textAlign: 'center', textTransform: 'uppercase' }}>
                    Aircooled<br/>Syndicate
                  </div>
                )}
              </div>
              <div style={{ padding: '16px' }}>
                <div style={{ fontFamily: "'Archivo'", fontWeight: 800, fontSize: '18px', textTransform: 'uppercase', lineHeight: 1.05 }}>{item.name}</div>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '13px', marginTop: '5px' }}>{item.priceFmt}</div>
                <div style={{ marginTop: '14px', height: '7px', background: '#e4ddcd', position: 'relative' }}>
                  <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${item.pct}%`, background: '#14110D' }}></div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "'Space Mono', monospace", fontSize: '11px', color: '#6b655a', marginTop: '7px' }}>
                  <span>{item.committed}/{item.target} terpesan</span>
                  <span>Tutup {item.closes}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
