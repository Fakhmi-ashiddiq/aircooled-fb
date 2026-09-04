import React, { useContext, useEffect } from 'react';
import { useStore } from '../../../store';

export default function ImageLightbox() {
  const { state, updateState, data } = useStore();

  useEffect(() => {
    if (!state.lightbox) return;
    const handleKey = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        const ap = data.PRODUCTS.find(x => x.id === state.activeId);
        const total = ap?.gallery?.length || 1;
        updateState({ activeImg: ((state.activeImg || 0) + 1) % total });
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        const ap = data.PRODUCTS.find(x => x.id === state.activeId);
        const total = ap?.gallery?.length || 1;
        updateState({ activeImg: ((state.activeImg || 0) - 1 + total) % total });
      } else if (e.key === 'Escape') {
        updateState({ lightbox: false });
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [state.lightbox, state.activeImg, state.activeId]);

  if (!state.lightbox) return null;

  const ap = data.PRODUCTS.find(x => x.id === state.activeId);
  if (!ap) return null;

  const colorList = (ap.colors && ap.colors.length) ? ap.colors : [{ name: 'Default', hex: ap.garment }];
  const selColor = colorList.find(c => c.name === state.selectedColor);
  const curColor = selColor || colorList[0];
  const pDisplayGarment = curColor ? curColor.hex : ap.garment;

  const galleryVMs = (ap.gallery && ap.gallery.length ? ap.gallery : ['Depan']).map((g, i) => ({ label: g }));
  const activeImgIdx = Math.min(state.activeImg, galleryVMs.length - 1);
  const pActiveLabel = (galleryVMs[activeImgIdx] || {}).label || '';

  const closeLightbox = () => updateState({ lightbox: false });

  const goNext = (e) => {
    e.stopPropagation();
    const next = (activeImgIdx + 1) % galleryVMs.length;
    updateState({ activeImg: next });
  };

  const goPrev = (e) => {
    e.stopPropagation();
    const prev = (activeImgIdx - 1 + galleryVMs.length) % galleryVMs.length;
    updateState({ activeImg: prev });
  };

  const pPrintLogo = ap.print === 'logo' && !ap.heroImg;
  const pPrintText = ap.print === 'text' && !ap.heroImg;

  const activeImgSrc = (() => {
    if (ap.heroImg) return null;
    const images = [];
    const pImages = ap.images || [];
    if (pImages[activeImgIdx]?.src && pImages[activeImgIdx].src !== '/logo.jpg') {
      return pImages[activeImgIdx].src;
    }
    return null;
  })();

  return (
    <>
      <style>{`
        @media (max-width: 480px) {
          .lightbox-overlay { padding: 16px !important; }
          .lightbox-close-btn { top: 12px !important; right: 12px !important; font-size: 28px !important; }
          .lightbox-nav-btn { font-size: 28px !important; width: 40px !important; height: 40px !important; }
        }
      `}</style>
      <div
        className="lightbox-overlay"
        style={{ position: 'fixed', inset: 0, zIndex: 110, background: 'rgba(20,17,13,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}
        onClick={closeLightbox}
      >
        <button className="lightbox-close-btn" onClick={closeLightbox} style={{ position: 'absolute', top: '24px', right: '28px', background: 'none', border: 'none', cursor: 'pointer', color: '#F2EEE4', fontSize: '34px', lineHeight: 1 }}>×</button>

        {galleryVMs.length > 1 && (
          <button className="lightbox-nav-btn" onClick={goPrev} style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(20,17,13,0.7)', border: '2px solid #F2EEE4', cursor: 'pointer', color: '#F2EEE4', fontSize: '36px', lineHeight: 1, width: '52px', height: '52px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            ‹
          </button>
        )}

        {galleryVMs.length > 1 && (
          <button className="lightbox-nav-btn" onClick={goNext} style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(20,17,13,0.7)', border: '2px solid #F2EEE4', cursor: 'pointer', color: '#F2EEE4', fontSize: '36px', lineHeight: 1, width: '52px', height: '52px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            ›
          </button>
        )}

        <div onClick={(e) => e.stopPropagation()} style={{ width: 'min(72vh,640px)', aspectRatio: 1, background: pDisplayGarment, border: '2px solid #F2EEE4', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
          {ap.heroImg && <img src={ap.heroImg} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />}
          {!ap.heroImg && activeImgSrc && <img src={activeImgSrc} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />}
          {!ap.heroImg && !activeImgSrc && pPrintLogo && <img src="/assets/logo.png" style={{ width: '50%' }} alt="" />}
          {!ap.heroImg && !activeImgSrc && pPrintText && (
            <div style={{ color: '#F2C015', fontFamily: "'Archivo'", fontWeight: 900, fontSize: '60px', lineHeight: 0.9, textAlign: 'center', textTransform: 'uppercase' }}>
              Aircooled<br/>Syndicate
            </div>
          )}
          <span style={{ position: 'absolute', bottom: '16px', left: '16px', fontFamily: "'Space Mono', monospace", fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase', background: '#14110D', color: '#F2EEE4', padding: '6px 12px' }}>
            {pActiveLabel} {galleryVMs.length > 1 ? `(${activeImgIdx + 1}/${galleryVMs.length})` : ''}
          </span>
        </div>
      </div>
    </>
  );
}
