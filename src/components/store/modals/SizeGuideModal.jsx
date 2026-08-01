import React, { useContext } from 'react';
import { AppContext } from '../../../context/AppContext';

export default function SizeGuideModal() {
  const { state, updateState } = useContext(AppContext);

  if (!state.sizeGuideOpen) return null;

  const closeSizeGuide = () => updateState({ sizeGuideOpen: false });

  const sizeChart = [
    { size: 'S', chest: 48, length: 68 },
    { size: 'M', chest: 51, length: 71 },
    { size: 'L', chest: 54, length: 73 },
    { size: 'XL', chest: 57, length: 75 },
    { size: 'XXL', chest: 60, length: 77 }
  ];

  return (
    <>
      <style>{`
        @media (max-width: 480px) {
          .sg-overlay { padding: 16px !important; }
          .sg-close-btn { top: 12px !important; right: 12px !important; font-size: 28px !important; }
          .sg-body { padding: 16px !important; }
        }
      `}</style>
      <div className="sg-overlay" style={{ position: 'fixed', inset: 0, zIndex: 110, background: 'rgba(20,17,13,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', animation: 'ascOverlayIn 0.18s ease' }} onClick={closeSizeGuide}>
        <button className="sg-close-btn" onClick={closeSizeGuide} style={{ position: 'absolute', top: '24px', right: '28px', background: 'none', border: 'none', cursor: 'pointer', color: '#F2EEE4', fontSize: '34px', lineHeight: 1 }}>×</button>
        <div style={{ width: 'min(92vw,540px)', maxHeight: '88vh', overflowY: 'auto', background: '#F2EEE4', border: '2px solid #F2EEE4', animation: 'ascPopIn 0.24s cubic-bezier(0.22,1,0.36,1)' }} onClick={e => e.stopPropagation()}>
          <div style={{ background: '#14110D', color: '#F2EEE4', padding: '18px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontFamily: "'Archivo'", fontWeight: 900, fontSize: '22px', textTransform: 'uppercase' }}>Panduan Ukuran</div>
            <img src="/assets/logo-white.png" style={{ height: '30px', display: 'block' }} alt="Logo" />
          </div>
          <div className="sg-body" style={{ padding: '22px' }}>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#6b655a', marginBottom: '12px' }}>Apparel — pengukuran datar (cm)</div>
            <div style={{ border: '2px solid #14110D' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', background: '#14110D', color: '#F2EEE4', fontFamily: "'Space Mono', monospace", fontSize: '11px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                <div style={{ padding: '10px 12px' }}>Ukuran</div>
                <div style={{ padding: '10px 12px', borderLeft: '1px solid #3a352b' }}>Lebar Dada</div>
                <div style={{ padding: '10px 12px', borderLeft: '1px solid #3a352b' }}>Panjang Badan</div>
              </div>
              {sizeChart.map((r, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', borderTop: '1px solid #ddd5c4', fontFamily: "'Space Mono', monospace", fontSize: '13px' }}>
                  <div style={{ padding: '10px 12px', fontWeight: 700 }}>{r.size}</div>
                  <div style={{ padding: '10px 12px', borderLeft: '1px solid #ddd5c4' }}>{r.chest} cm</div>
                  <div style={{ padding: '10px 12px', borderLeft: '1px solid #ddd5c4' }}>{r.length} cm</div>
                </div>
              ))}
            </div>
            <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', color: '#6b655a', lineHeight: 1.6, margin: '14px 0 0' }}>
              Toleransi ±1–2 cm karena pengukuran manual. Lebar dada diukur 2 cm di bawah ketiak. Ragu di antara dua ukuran? Ambil yang lebih besar.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}