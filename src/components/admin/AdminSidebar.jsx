import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';

export default function AdminSidebar() {
  const { state, updateState } = useContext(AppContext);

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
    go: () => { updateState({ adminRoute: id }); window.scrollTo(0, 0); }, 
    style: navStyle(id, false)
  });

  const adminNavTop = [['dashboard', 'Dashboard'], ['catalog', 'Katalog Produk']].map(mkNav);
  const adminNavBottom = [['sales', 'Penjualan & Pesanan'], ['sessions', 'Sesi Pre-Order'], ['podone', 'Pre-Order Selesai'], ['finance', 'Keuangan & Profit']].map(mkNav);
  const settingsSub = [['sizes', 'Ukuran'], ['colors', 'Warna'], ['roles', 'Peran']].map(([id, label]) => ({
    id, label, 
    go: () => { updateState({ adminRoute: id }); window.scrollTo(0, 0); }, 
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
    <aside style={{ background: '#14110D', color: '#F2EEE4', padding: '24px 0', display: 'flex', flexDirection: 'column', borderRight: '2px solid #14110D' }}>
      <div style={{ padding: '0 22px 22px', borderBottom: '1px solid #2c2820' }}>
        <img src="/assets/logo-white.png" style={{ height: '46px', display: 'block' }} alt="Logo" />
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#F2C015', marginTop: '12px' }}>
          ADMIN PANEL
        </div>
      </div>
      <nav style={{ padding: '16px 0', flex: 1 }}>
        {adminNavTop.map(n => (
          <button key={n.id} onClick={n.go} style={n.style}>{n.label}</button>
        ))}
        {adminNavBottom.map(n => (
          <button key={n.id} onClick={n.go} style={n.style}>{n.label}</button>
        ))}
        <button onClick={() => updateState({ settingsOpen: !state.settingsOpen })} style={settingsHeaderStyle}>
          <span>Pengaturan</span>
          <span style={{ fontSize: '11px' }}>{state.settingsOpen ? '▾' : '▸'}</span>
        </button>
        {state.settingsOpen && settingsSub.map(n => (
          <button key={n.id} onClick={n.go} style={n.style}>{n.label}</button>
        ))}
      </nav>
      <div style={{ padding: '16px 22px', borderTop: '1px solid #2c2820', fontFamily: "'Space Mono', monospace", fontSize: '11px', color: '#6b655a' }}>
        Signed in as<br/><span style={{ color: '#F2EEE4' }}>admin@aircooled</span>
      </div>
    </aside>
  );
}
