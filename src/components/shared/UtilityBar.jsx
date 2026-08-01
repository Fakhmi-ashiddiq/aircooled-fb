import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';

export default function UtilityBar() {
  const { state, updateState } = useContext(AppContext);
  const isStore = state.view === 'store';
  const isAdmin = state.view === 'admin';

  const tabActive = {
    background: '#F2C015', color: '#14110D', border: 'none', cursor: 'pointer',
    fontFamily: "'Space Mono', monospace", fontSize: '11px', letterSpacing: '0.08em', fontWeight: 700, padding: '5px 12px'
  };
  const tabIdle = {
    background: 'none', color: '#F2EEE4', border: '1px solid #4a443a', cursor: 'pointer',
    fontFamily: "'Space Mono', monospace", fontSize: '11px', letterSpacing: '0.08em', padding: '4px 12px'
  };

  return (
    <>
      <style>{`
        .utility-bar-label {
          text-transform: uppercase;
          opacity: 0.8;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          min-width: 0;
        }
        @media (max-width: 640px) {
          .utility-bar-row { padding: 9px 14px !important; }
          .utility-bar-label { font-size: 9px; }
        }
      `}</style>
      <div
        className="utility-bar-row"
        style={{
          background: '#14110D', color: '#F2EEE4', fontFamily: "'Space Mono', monospace",
          fontSize: '11px', letterSpacing: '0.08em', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', padding: '9px 24px', borderBottom: '1px solid #2c2820', gap: '10px'
        }}
      >
        <div className="utility-bar-label">AIRCOOLED SYNDICATE — OFFICIAL MERCH STORE</div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexShrink: 0 }}>
          <button onClick={() => updateState({ view: 'store' })} style={isStore ? tabActive : tabIdle}>STORE</button>
          <button onClick={() => updateState({ view: 'admin' })} style={isAdmin ? tabActive : tabIdle}>ADMIN</button>
        </div>
      </div>
    </>
  );
}