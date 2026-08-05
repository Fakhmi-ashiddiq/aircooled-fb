import React, { useEffect, useState } from 'react';

// Ditampilkan sekali per sesi browser (pakai sessionStorage) — supaya kalau
// komponen ini ke-mount lebih dari sekali (misal ada di StoreLayout & AdminLayout),
// preloader tidak muncul berulang tiap kali user pindah mode Store/Admin.
export default function Preloader() {
  const alreadyShown = typeof window !== 'undefined' && sessionStorage.getItem('asc_preloaded') === '1';
  const [visible, setVisible] = useState(!alreadyShown);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (alreadyShown) return;
    sessionStorage.setItem('asc_preloaded', '1');
    const fadeTimer = setTimeout(() => setFadeOut(true), 900);
    const removeTimer = setTimeout(() => setVisible(false), 1300);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!visible) return null;

  return (
    <>
      <style>{`
        @keyframes preloaderPulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(0.92); opacity: 0.7; }
        }
        .preloader-logo { animation: preloaderPulse 1.1s ease-in-out infinite; }
      `}</style>
      <div
        style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: '#14110D',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'opacity 0.4s ease',
          opacity: fadeOut ? 0 : 1,
          pointerEvents: fadeOut ? 'none' : 'auto'
        }}
      >
        <img src="/assets/logo.png" alt="Aircooled Syndicate" className="preloader-logo" style={{ height: '64px' }} />
      </div>
    </>
  );
}