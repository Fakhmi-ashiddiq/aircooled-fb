import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';

export default function AdminSidebar() {
  const { state, updateState } = useContext(AppContext);
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) setIsOpen(false);
      else setIsOpen(true);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navStyle = (id, sub) => ({
    background: state.adminRoute === id ? '#F2C015' : 'none',
    color: state.adminRoute === id ? '#14110D' : '#cfcabd',
    borderLeft: state.adminRoute === id ? '4px solid #F2C015' : '4px solid transparent',
    width: '100%',
    textAlign: 'left',
    cursor: 'pointer',
    fontFamily: "'Space Mono', monospace",
    fontWeight: 700,
    fontSize: sub ? '11px' : '12px',
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    padding: sub ? '11px 22px 11px 38px' : '13px 22px'
  });

  const mkNav = ([id, label]) => ({
    id, label,
    go: () => {
      updateState({ adminRoute: id });
      window.scrollTo(0, 0);
      if (window.innerWidth <= 768) setIsOpen(false);
    },
    style: navStyle(id, false)
  });

  const adminNavTop = [['dashboard', 'Dashboard'], ['catalog', 'Katalog Produk']].map(mkNav);
  const adminNavBottom = [['sales', 'Penjualan & Pesanan'], ['sessions', 'Sesi Pre-Order'], ['podone', 'Pre-Order Selesai'], ['finance', 'Keuangan & Profit']].map(mkNav);
  const settingsSub = [['sizes', 'Ukuran'], ['colors', 'Warna'], ['roles', 'Peran']].map(([id, label]) => ({
    id, label,
    go: () => {
      updateState({ adminRoute: id });
      window.scrollTo(0, 0);
      if (window.innerWidth <= 768) setIsOpen(false);
    },
    style: navStyle(id, true)
  }));

  const settingsActive = ['sizes', 'colors', 'roles'].includes(state.adminRoute);

  const settingsHeaderStyle = {
    color: settingsActive ? '#F2C015' : '#cfcabd',
    background: 'none',
    border: 'none',
    borderLeft: '4px solid transparent',
    width: '100%',
    textAlign: 'left',
    cursor: 'pointer',
    fontFamily: "'Space Mono', monospace",
    fontWeight: 700,
    fontSize: '12px',
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    padding: '13px 22px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            position: 'fixed', top: '20px', left: '20px', zIndex: 999,
            background: '#14110D', color: '#F2C015', border: '2px solid #F2C015',
            cursor: 'pointer', fontFamily: "'Space Mono', monospace", fontWeight: 700,
            fontSize: '14px', padding: '10px 14px', boxShadow: '4px 4px 0 #14110D',
            display: 'flex', alignItems: 'center', gap: '8px'
          }}
        >
          <span>☰</span> MENU
        </button>
      )}

      {isOpen && <div className="sidebar-overlay" onClick={() => setIsOpen(false)} />}

      <style>{`
        /* DESKTOP (default): lebar mengikuti kolom grid parent (220px), TIDAK di-hardcode di sini
           supaya tidak nabrak gridTemplateColumns di AdminLayout.jsx */
        .admin-sidebar-container {
          width: 100%;
          height: 100vh;
          position: sticky;
          top: 0;
          background: #14110D;
          color: #F2EEE4;
          display: ${isOpen ? 'flex' : 'none'};
          flex-direction: column;
          border-right: 2px solid #14110D;
          z-index: 1000;
          overflow-y: auto;
          flex-shrink: 0;
        }
        .sidebar-overlay { display: none; }
        .sidebar-close-btn { display: none; } /* tersembunyi di desktop, HTML asli tidak punya tombol ini */

        @media (max-width: 768px) {
          .admin-sidebar-container {
            width: min(82vw, 280px);
            position: fixed;
            left: 0; top: 0; bottom: 0;
          }
          .sidebar-overlay {
            display: block;
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0,0,0,0.7);
            z-index: 999;
          }
          .sidebar-close-btn { display: block; }
        }
      `}</style>

      <aside className="admin-sidebar-container">
        <div style={{ padding: '24px 22px 22px', borderBottom: '1px solid #2c2820', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <img src="/assets/logo-white.png" style={{ height: '46px', display: 'block' }} alt="Logo" />
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#F2C015', marginTop: '12px' }}>
              ADMIN PANEL
            </div>
          </div>
          <button
            className="sidebar-close-btn"
            onClick={() => setIsOpen(false)}
            style={{ background: 'none', border: 'none', color: '#cfcabd', fontSize: '28px', cursor: 'pointer', lineHeight: 1, marginTop: '-4px' }}
          >
            ×
          </button>
        </div>

        <nav style={{ padding: '16px 0', flex: 1 }}>
          {adminNavTop.map((n) => <button key={n.id} onClick={n.go} style={n.style}>{n.label}</button>)}
          {adminNavBottom.map((n) => <button key={n.id} onClick={n.go} style={n.style}>{n.label}</button>)}
          <button onClick={() => updateState({ settingsOpen: !state.settingsOpen })} style={settingsHeaderStyle}>
            <span>Pengaturan</span>
            <span style={{ fontSize: '11px' }}>{state.settingsOpen ? '▾' : '▸'}</span>
          </button>
          {state.settingsOpen && settingsSub.map((n) => <button key={n.id} onClick={n.go} style={n.style}>{n.label}</button>)}
        </nav>

        <div style={{ padding: '16px 22px', borderTop: '1px solid #2c2820', fontFamily: "'Space Mono', monospace", fontSize: '11px', color: '#6b655a' }}>
          Signed in as<br /><span style={{ color: '#F2EEE4' }}>admin@aircooled</span>
        </div>
      </aside>
    </>
  );
}