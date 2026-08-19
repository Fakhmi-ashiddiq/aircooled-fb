import React, { useContext, useState, useEffect } from 'react';
import { useStore } from '../../store';

export default function AdminSidebar() {
  const { state, updateState } = useStore();
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

  const activeSection = (() => {
    const r = state.adminRoute;
    if (r === 'catalog' || r === 'catalog-edit') return 'catalog';
    if (r === 'sessdetail') return state.sessView?.backTo === 'sessions' ? 'sessions' : 'catalog';
    return r;
  })();

  const currentLabel = {
    dashboard: 'Dashboard', catalog: 'Katalog Produk', sales: 'Penjualan & Pesanan',
    sessions: 'Sesi Pre-Order', podone: 'Pre-Order Selesai', finance: 'Keuangan & Profit',
    sizes: 'Ukuran', colors: 'Warna', roles: 'Peran'
  }[activeSection] || '';

  const navStyle = (id, sub) => ({
    background: activeSection === id ? '#F2C015' : 'none',
    color: activeSection === id ? '#14110D' : '#cfcabd',
    borderLeft: activeSection === id ? '4px solid #F2C015' : '4px solid transparent',
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
      updateState({ adminRoute: id, adminProdId: null, editProd: null, sessView: null });
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

  const settingsActive = ['sizes', 'colors', 'roles'].includes(activeSection);

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
      <div className="admin-mobile-topbar">
        <button onClick={() => setIsOpen(true)} className="admin-mobile-hamburger">
          <span>☰</span>
        </button>
        <span className="admin-mobile-title">{currentLabel}</span>
      </div>

      {isOpen && <div className="sidebar-overlay" onClick={() => setIsOpen(false)} />}

      <style>{`
        .admin-mobile-topbar { display: none; }

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
          z-index: 40;
          overflow-y: auto;
          flex-shrink: 0;
        }
        .sidebar-overlay { display: none; }
        .sidebar-close-btn { display: none; }

        @media (max-width: 768px) {
          .admin-mobile-topbar {
            display: flex;
            align-items: center;
            gap: 12px;
            position: sticky;
            top: 0;
            z-index: 38;
            background: #14110D;
            color: #F2EEE4;
            padding: 14px 16px;
            border-bottom: 2px solid #F2C015;
          }
          .admin-mobile-hamburger {
            background: none;
            border: 2px solid #F2C015;
            color: #F2C015;
            cursor: pointer;
            font-size: 16px;
            padding: 6px 10px;
            line-height: 1;
            flex: none;
          }
          .admin-mobile-title {
            font-family: 'Space Mono', monospace;
            font-size: 12px;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            color: #F2C015;
          }

          .admin-sidebar-container {
            width: min(82vw, 280px);
            position: fixed;
            left: 0; top: 0; bottom: 0;
            z-index: 40;
          }
          .sidebar-overlay {
            display: block;
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0,0,0,0.7);
            z-index: 39;
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
