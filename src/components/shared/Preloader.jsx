import React, { useEffect, useState } from 'react';

export default function Preloader() {
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFadeOut(true), 900);
    const removeTimer = setTimeout(() => setVisible(false), 1300);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
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
        <img src="/assets/logo-white.png" alt="Aircooled Syndicate" className="preloader-logo" style={{ height: '64px' }} />
      </div>
    </>
  );
}