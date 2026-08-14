import React, { useContext } from 'react';
import { useStore } from '../../../store';

export default function ImageLightbox() {
  const { state, updateState, data } = useStore();

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

  const pPrintLogo = ap.print === 'logo' && !ap.heroImg;
  const pPrintText = ap.print === 'text' && !ap.heroImg;

  return (
    <>
      <style>{`
        @media (max-width: 480px) {
          .lightbox-overlay { padding: 16px !important; }
          .lightbox-close-btn { top: 12px !important; right: 12px !important; font-size: 28px !important; }
        }
      `}</style>
      <div
        className="lightbox-overlay"
        style={{ position: 'fixed', inset: 0, zIndex: 110, background: 'rgba(20,17,13,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}
        onClick={closeLightbox}
      >
        <button className="lightbox-close-btn" onClick={closeLightbox} style={{ position: 'absolute', top: '24px', right: '28px', background: 'none', border: 'none', cursor: 'pointer', color: '#F2EEE4', fontSize: '34px', lineHeight: 1 }}>×</button>
        <div style={{ width: 'min(72vh,640px)', aspectRatio: 1, background: pDisplayGarment, border: '2px solid #F2EEE4', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
          {ap.heroImg && <img src={ap.heroImg} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />}
          {!ap.heroImg && pPrintLogo && <img src="/assets/logo.png" style={{ width: '50%' }} alt="" />}
          {!ap.heroImg && pPrintText && (
            <div style={{ color: '#F2C015', fontFamily: "'Archivo'", fontWeight: 900, fontSize: '60px', lineHeight: 0.9, textAlign: 'center', textTransform: 'uppercase' }}>
              Aircooled<br/>Syndicate
            </div>
          )}
          <span style={{ position: 'absolute', bottom: '16px', left: '16px', fontFamily: "'Space Mono', monospace", fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase', background: '#14110D', color: '#F2EEE4', padding: '6px 12px' }}>
            {pActiveLabel}
          </span>
        </div>
      </div>
    </>
  );
}
