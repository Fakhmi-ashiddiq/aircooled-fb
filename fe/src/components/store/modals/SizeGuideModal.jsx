import React, { useContext } from 'react';
import { useStore } from '../../../store';

const API_BASE = 'http://localhost:8000/storage/';

export default function SizeGuideModal() {
  const { state, updateState, data } = useStore();

  if (!state.sizeGuideOpen) return null;

  const closeSizeGuide = () => updateState({ sizeGuideOpen: false });

  const activeProduct = data.PRODUCTS.find(x => x.id === state.activeId);
  const sizeSetCode = activeProduct?.sizeType || 'reg';
  const currentSizeSet = (data.sizeSets || []).find(s => s.code === sizeSetCode);
  const sizes = currentSizeSet?.sizes || ['S', 'M', 'L', 'XL', 'XXL'];

  const sizeChart = [
    { size: 'S', chest: 48, length: 68 },
    { size: 'M', chest: 51, length: 71 },
    { size: 'L', chest: 54, length: 73 },
    { size: 'XL', chest: 57, length: 75 },
    { size: 'XXL', chest: 60, length: 77 }
  ].filter(r => sizes.includes(r.size));

  const allSizeSets = (data.sizeSets || []).filter(ss => ss.active !== false);

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

            {allSizeSets.length > 0 && allSizeSets.map((ss) => {
              const img = ss.guideImg ? (ss.guideImg.startsWith('http') ? ss.guideImg : API_BASE + ss.guideImg) : null;
              if (!img) return null;
              return (
                <div key={ss.id} style={{ marginBottom: '20px' }}>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '12px', fontWeight: 700, color: '#14110D', marginBottom: '8px' }}>{ss.name}</div>
                  <img src={img} alt={`Panduan ${ss.name}`} style={{ width: '100%', borderRadius: '4px', border: '2px solid #14110D' }} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
