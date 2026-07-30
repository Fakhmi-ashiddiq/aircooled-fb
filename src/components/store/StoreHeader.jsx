import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';

export default function StoreHeader() {
  const { state, updateState, go } = useContext(AppContext);

  const cartCount = state.cart.reduce((s, c) => s + c.qty, 0);
  const user = state.user;
  const authLabel = user ? `${user.name.split(' ')[0]} · Keluar` : 'Masuk | Daftar';

  const onAuthClick = () => {
    if (user) {
      updateState({ user: null }); // logout
    } else {
      updateState({ authOpen: true, authMode: 'login' });
    }
  };

  const navBtnStyle = {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontFamily: "'Space Mono', monospace",
    fontSize: '12px',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: '#14110D'
  };

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 40, background: '#F2EEE4',
      borderBottom: '2px solid #14110D', display: 'flex', alignItems: 'center',
      justifyContent: 'space-between', padding: '16px 24px'
    }}>
      <button 
        onClick={() => go('home')} 
        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}
      >
        <img src="/assets/logo.png" alt="Aircooled Syndicate" style={{ height: '42px', display: 'block' }} />
      </button>
      <nav style={{ display: 'flex', gap: '28px', alignItems: 'center' }}>
        <button 
          onClick={() => { updateState({ shopFilter: 'all' }); go('shop'); }} 
          style={{ ...navBtnStyle, fontWeight: 700 }}
        >
          Shop
        </button>
        <button 
          onClick={() => { updateState({ shopFilter: 'ready' }); go('shop'); }} 
          style={navBtnStyle}
        >
          Ready Stock
        </button>
        <button 
          onClick={() => { updateState({ shopFilter: 'preorder' }); go('shop'); }} 
          style={navBtnStyle}
        >
          Pre-Order
        </button>
        <button 
          onClick={onAuthClick} 
          style={{ ...navBtnStyle, display: 'flex', alignItems: 'center', gap: '7px', letterSpacing: '0.1em' }}
        >
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#F2C015', display: 'inline-block' }}></span>
          {authLabel}
        </button>
        <button 
          onClick={() => updateState({ cartOpen: !state.cartOpen })} 
          style={{
            background: '#14110D', border: 'none', cursor: 'pointer', color: '#F2EEE4',
            fontFamily: "'Space Mono', monospace", fontSize: '12px', letterSpacing: '0.08em',
            textTransform: 'uppercase', fontWeight: 700, padding: '10px 16px',
            display: 'flex', gap: '8px', alignItems: 'center'
          }}
        >
          <span>CART</span>
          <span style={{
            background: '#F2C015', color: '#14110D', minWidth: '20px', height: '20px',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '11px', padding: '0 5px'
          }}>
            {cartCount}
          </span>
        </button>
      </nav>
    </header>
  );
}
