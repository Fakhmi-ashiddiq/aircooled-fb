import React, { useEffect, useState } from 'react';

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      style={{
        position: 'fixed', bottom: '24px', right: '24px', zIndex: 70,
        width: '46px', height: '46px', borderRadius: '50%',
        background: '#14110D', color: '#F2C015', border: '2px solid #F2C015',
        cursor: 'pointer', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 4px 12px rgba(20,17,13,0.35)'
      }}
      aria-label="Scroll ke atas"
    >
      ↑
    </button>
  );
}