import React, { useContext, useRef, useState, useEffect } from 'react';
import { useStore } from '../../store';
import useProductVM from '../../hooks/useProductVM';
import useCountUp from '../../hooks/useCountUp';
import PingDot from '../shared/PingDot';
import Reveal from '../shared/Reveal';

function AnimatedNumber({ value, format, start }) {
  const animated = useCountUp(value, 1200, start);
  return <>{format ? format(animated) : animated}</>;
}

export default function Home() {
  const { data, state, updateState, openProduct, dataLoading } = useStore();
  const { getProductVM } = useProductVM();

  const allVM = data.PRODUCTS.map(getProductVM);
  const readyProducts = allVM.filter(p => !p.isPreorder);
  const preorderProducts = allVM.filter(p => p.isPreorder);
  const featured = preorderProducts.find(p => p.statusLabel === 'PRE-ORDER OPEN') || preorderProducts[0];

  const marquee = 'PORSCHE 911 ◦ VW BEETLE ◦ KARMANN GHIA ◦ TYPE 2 BUS ◦ 356 SPEEDSTER ◦ KEEP THEM COOL ◦ AIR-COOLED FOREVER ◦';

  const marqueeOuterRef = useRef(null);
  const marqueeTextRef = useRef(null);
  const [marqueeVars, setMarqueeVars] = useState({});

  useEffect(() => {
    const measure = () => {
      const cw = marqueeOuterRef.current?.offsetWidth || 0;
      const tw = marqueeTextRef.current?.offsetWidth || 0;
      if (!cw || !tw) return;
      const speedPxPerSec = 90;
      const distance = cw + tw;
      const duration = distance / speedPxPerSec;
      setMarqueeVars({
        '--marquee-start': `${cw}px`,
        '--marquee-end': `-${tw}px`,
        animationDuration: `${duration}s`
      });
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  const goShop = () => {
    updateState({ shopFilter: 'all', route: 'shop' });
    window.scrollTo(0, 0);
  };

  const goShopPreorder = () => {
    updateState({ shopFilter: 'preorder', route: 'shop' });
    window.scrollTo(0, 0);
  };

  return (
    <main>
      <style>{`
        @keyframes skelPulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
        .skel-box { animation: skelPulse 1.4s ease-in-out infinite; background: #d8d2c4; }
        .home-marquee-outer {
          position: relative;
          overflow: hidden;
          height: 34px;
        }
        .home-marquee-track {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          white-space: nowrap;
          left: var(--marquee-start, 100%);
          animation-name: homeMarqueeMove;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
        @keyframes homeMarqueeMove {
          from { left: var(--marquee-start, 100%); }
          to { left: var(--marquee-end, -100%); }
        }
        @media (max-width: 768px) {
          .home-hero-grid { grid-template-columns: 1fr !important; }
          .home-hero-copy { padding: 40px 24px 32px !important; }
          .home-hero-title { font-size: 44px !important; }
          .home-hero-featured { padding: 28px 24px !important; border-left: none !important; border-top: 2px solid #2c2820 !important; }
          .home-section-ready { padding: 36px 20px !important; }
          .home-section-preorder { padding: 0 20px 40px !important; }
          .home-ready-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 14px !important; }
          .home-preorder-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 14px !important; }
          .home-preorder-img { aspect-ratio: 1 / 1 !important; }
          .home-section-heading { font-size: 26px !important; }
        }
        @media (max-width: 420px) {
          .home-hero-title { font-size: 34px !important; }
        }
      `}</style>

      {/* HERO */}
      <section style={{ background: '#14110D', color: '#F2EEE4', padding: 0, borderBottom: '2px solid #14110D' }}>
        <div className="home-hero-grid" style={{ display: 'grid', gridTemplateColumns: '1.15fr 0.85fr' }}>
          <div className="home-hero-copy" style={{ padding: '64px 48px 56px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '12px', letterSpacing: '0.2em', color: '#F2C015', textTransform: 'uppercase', marginBottom: '22px' }}>
              ISSUE 01 — MERCH DROP / EST. 2024
            </div>
            <h1 className="home-hero-title" style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 900, fontSize: '84px', lineHeight: 0.92, letterSpacing: '-0.02em', margin: 0, textTransform: 'uppercase' }}>
              Worn by<br />the air-<br />cooled.
            </h1>
            <p style={{ maxWidth: '440px', fontSize: '16px', lineHeight: 1.6, color: '#cfcabd', margin: '26px 0 34px' }}>
              Merchandise resmi dari Aircooled Syndicate — e-magazine untuk pemuja Porsche &amp; Volkswagen berpendingin udara. Apparel ready stock &amp; drop pre-order edisi terbatas.
            </p>
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
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

          {dataLoading ? (
            <div className="home-hero-featured" style={{ borderLeft: '2px solid #2c2820', padding: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: '#1a1712' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <div className="skel-box" style={{ width: '8px', height: '8px', borderRadius: '50%' }}></div>
                <div className="skel-box" style={{ width: '120px', height: '11px' }}></div>
              </div>
              <div className="skel-box" style={{ aspectRatio: '4/3', border: '2px solid #14110D' }}></div>
              <div style={{ marginTop: '18px' }}>
                <div className="skel-box" style={{ width: '70%', height: '22px', marginBottom: '8px' }}></div>
                <div className="skel-box" style={{ width: '55%', height: '13px', marginBottom: '14px' }}></div>
                <div className="skel-box" style={{ width: '100%', height: '8px', marginBottom: '7px' }}></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div className="skel-box" style={{ width: '50%', height: '11px' }}></div>
                  <div className="skel-box" style={{ width: '15%', height: '11px' }}></div>
                </div>
                <div className="skel-box" style={{ width: '100%', height: '42px', marginTop: '16px' }}></div>
              </div>
            </div>
          ) : featured && (
            <div className="home-hero-featured" style={{ borderLeft: '2px solid #2c2820', padding: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: '#1a1712' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: "'Space Mono', monospace", fontSize: '11px', letterSpacing: '0.16em', color: '#F2C015', textTransform: 'uppercase', marginBottom: '16px' }}>
                <PingDot />
                {featured.statusLabel}
              </div>
              <div style={{ background: featured.garment, aspectRatio: '4/3', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #14110D', position: 'relative', overflow: 'hidden' }}>
                {featured.images && featured.images.length > 0 && featured.images[0].src && featured.images[0].src !== '/logo.jpg' ? (
                  <img src={featured.images[0].src} alt="Featured Image" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : featured.printLogo && (
                  <img src="/assets/logo.png" alt="Featured Logo" style={{ width: '48%', opacity: 0.95 }} />
                )}
                {featured.printText && (
                  <div style={{ color: '#F2C015', fontFamily: "'Archivo', sans-serif", fontWeight: 900, fontSize: '30px', lineHeight: 0.9, textAlign: 'center', textTransform: 'uppercase', letterSpacing: '-0.01em' }}>
                    Aircooled<br />Syndicate
                  </div>
                )}
              </div>
              <div style={{ marginTop: '18px' }}>
                <div style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 800, fontSize: '22px', textTransform: 'uppercase', lineHeight: 1 }}>
                  {featured.name}
                </div>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '13px', color: '#cfcabd', marginTop: '6px' }}>
                  {featured.priceFmt} — Tutup {featured.closes}
                </div>
                <div style={{ marginTop: '14px', height: '8px', background: '#2c2820', position: 'relative' }}>
                  <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${featured.pct}%`, background: '#F2C015' }}></div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "'Space Mono', monospace", fontSize: '11px', color: '#cfcabd', marginTop: '7px' }}>
                  <span><AnimatedNumber value={featured.committed} start={state.appReady} /> / {featured.target} TERPESAN</span>
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
      <div
        className="home-marquee-outer"
        ref={marqueeOuterRef}
        style={{ background: '#F2C015', color: '#14110D', borderBottom: '2px solid #14110D', fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: '13px', letterSpacing: '0.16em', textTransform: 'uppercase' }}
      >
        <span className="home-marquee-track" ref={marqueeTextRef} style={marqueeVars}>{marquee}</span>
      </div>

      {/* READY STOCK */}
      <section className="home-section-ready" style={{ padding: '56px 48px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '28px', borderBottom: '2px solid #14110D', paddingBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
          <h2 className="home-section-heading" style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 900, fontSize: '38px', margin: 0, textTransform: 'uppercase', letterSpacing: '-0.01em' }}>Ready Stock</h2>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#6b655a' }}>
            Kirim 1–2 hari kerja
          </div>
        </div>
        <div className="home-ready-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
          {dataLoading && Array.from({ length: 6 }).map((_, i) => (
            <div key={i}>
              <div className="skel-box" style={{ aspectRatio: '1 / 1', border: '2px solid #14110D' }}></div>
              <div style={{ paddingTop: '12px' }}>
                <div className="skel-box" style={{ height: '16px', width: '60%', marginBottom: '6px' }}></div>
                <div className="skel-box" style={{ height: '13px', width: '40%' }}></div>
              </div>
            </div>
          ))}
          {!dataLoading && readyProducts.slice(0, 6).map((item, idx) => (
            <Reveal key={item.id} delay={idx * 0.06}>
              <div style={{ cursor: 'pointer' }} onClick={() => openProduct(item.id)}>
                <div style={{ background: item.garment, aspectRatio: '1 / 1', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #14110D', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: '10px', left: '10px', background: '#14110D', color: '#F2EEE4', fontFamily: "'Space Mono', monospace", fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '4px 8px' }}>
                    {item.cat}
                  </div>
                  {item.hasDiscount && (
                    <div style={{ position: 'absolute', top: '10px', right: '10px', background: '#F2C015', color: '#14110D', fontFamily: "'Space Mono', monospace", fontSize: '11px', fontWeight: 700, padding: '4px 8px' }}>
                      −{item.discountPct}%
                    </div>
                  )}
                  {item.images && item.images.length > 0 && item.images[0].src && item.images[0].src !== '/logo.jpg' ? (
                      <img src={item.images[0].src} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : item.printLogo && (
                      <img src="/assets/logo.png" alt={item.name} style={{ width: '52%' }} />
                    )}
                  {item.printText && (
                    <div style={{ color: '#F2C015', fontFamily: "'Archivo', sans-serif", fontWeight: 900, fontSize: '24px', lineHeight: 0.9, textAlign: 'center', textTransform: 'uppercase' }}>
                      Aircooled<br />Syndicate
                    </div>
                  )}
                </div>
                <div style={{ paddingTop: '12px' }}>
                  <div style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 700, fontSize: '16px', textTransform: 'uppercase', lineHeight: 1.05 }}>
                    {item.name}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '5px' }}>
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '13px', color: '#14110D', fontWeight: 700 }}>
                      {item.priceFmt}
                    </span>
                    {item.hasDiscount && (
                      <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '12px', color: '#9a8f7a', textDecoration: 'line-through' }}>
                        {item.compareFmt}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
      <section className="home-section-preorder" style={{ padding: '0 48px 64px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '28px', borderBottom: '2px solid #14110D', paddingBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
          <h2 className="home-section-heading" style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 900, fontSize: '38px', margin: 0, textTransform: 'uppercase', letterSpacing: '-0.01em' }}>Pre-Order — Open Now</h2>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#6b655a' }}>
            Produksi setelah sesi tutup
          </div>
        </div>
        <div className="home-preorder-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
          {dataLoading && Array.from({ length: 3 }).map((_, i) => (
            <div key={i} style={{ border: '2px solid #14110D', background: '#fff', display: 'flex', flexDirection: 'column' }}>
              <div className="skel-box" style={{ aspectRatio: '4/3', borderBottom: '2px solid #14110D' }}></div>
              <div style={{ padding: '16px' }}>
                <div className="skel-box" style={{ height: '18px', width: '70%', marginBottom: '8px' }}></div>
                <div className="skel-box" style={{ height: '13px', width: '40%', marginBottom: '14px' }}></div>
                <div className="skel-box" style={{ height: '7px', width: '100%', marginBottom: '7px' }}></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div className="skel-box" style={{ height: '11px', width: '50%' }}></div>
                  <div className="skel-box" style={{ height: '11px', width: '30%' }}></div>
                </div>
              </div>
            </div>
          ))}
          {!dataLoading && preorderProducts.slice(0, 3).map((item, idx) => (
            <Reveal key={item.id} delay={idx * 0.08}>
              <div onClick={() => openProduct(item.id)} style={{ cursor: 'pointer', border: '2px solid #14110D', background: '#fff', display: 'flex', flexDirection: 'column' }}>
                <div className="home-preorder-img" style={{ background: '#F2EEE4', aspectRatio: '4/3', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', borderBottom: '2px solid #14110D' }}>
                  <div style={{ position: 'absolute', top: '10px', left: '10px', background: '#F2C015', color: '#14110D', fontFamily: "'Space Mono', monospace", fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '4px 8px', fontWeight: 700 }}>
                    {item.statusLabel}
                  </div>
                  {item.images && item.images.length > 0 && item.images[0].src && item.images[0].src !== '/logo.jpg' ? (
                      <img src={item.images[0].src} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : item.printLogo && (
                      <img src="/assets/logo.png" alt={item.name} style={{ width: '46%' }} />
                    )}
                  {item.printText && (
                    <div style={{ color: '#F2C015', fontFamily: "'Archivo', sans-serif", fontWeight: 900, fontSize: '26px', lineHeight: 0.9, textAlign: 'center', textTransform: 'uppercase' }}>
                      Aircooled<br />Syndicate
                    </div>
                  )}
                </div>
                <div style={{ padding: '16px' }}>
                  <div style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 800, fontSize: '18px', textTransform: 'uppercase', lineHeight: 1.05 }}>
                    {item.name}
                  </div>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '13px', marginTop: '5px' }}>
                    {item.priceFmt}
                  </div>
                  <div style={{ marginTop: '14px', height: '7px', background: '#e4ddcd', position: 'relative' }}>
                    <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${item.pct}%`, background: '#14110D' }}></div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "'Space Mono', monospace", fontSize: '11px', color: '#6b655a', marginTop: '7px' }}>
                    <span>{item.committed}/{item.target} terpesan</span>
                    <span>Tutup {item.closes}</span>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </main>
  );
}
