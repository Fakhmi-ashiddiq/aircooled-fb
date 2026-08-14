import React from 'react';

export default function StoreFooter() {
  return (
    <>
      <style>{`
        .store-footer-pad { padding: 48px; }
        @media (max-width: 640px) {
          .store-footer-pad { padding: 32px 20px !important; }
        }
      `}</style>
      <footer className="store-footer-pad" style={{ background: '#14110D', color: '#cfcabd', borderTop: '2px solid #14110D' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '24px' }}>
          <div style={{ maxWidth: '340px' }}>
            <img src="/assets/logo-white.png" alt="Aircooled Syndicate" style={{ height: '58px', display: 'block' }} />
            <p style={{ fontSize: '13px', lineHeight: 1.6, marginTop: '14px' }}>
              E-magazine &amp; merchandise untuk pemuja Porsche &amp; VW aircooled. Keep them cool.
            </p>
          </div>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '12px', letterSpacing: '0.06em', textTransform: 'uppercase', lineHeight: 2 }}>
            <div style={{ color: '#F2C015', marginBottom: '6px' }}>WWW.AIRCOOLEDSYNDICATE.COM</div>
            <div>Instagram</div>
            <div>Shipping &amp; Returns</div>
            <div>Hubungi Kami</div>
          </div>
        </div>
      </footer>
    </>
  );
}