import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store';
import PingDot from '../shared/PingDot';

export default function StoreHeader() {
  const { state, updateState, go, logout } = useStore();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onResize = () => { if (window.innerWidth > 768) setMenuOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const cartCount = state.cart.reduce((s, c) => s + c.qty, 0);
  const user = state.user;

  const onAuthClick = () => {
    updateState({ authOpen: true, authMode: 'login' });
  };

  const onLogoutClick = () => {
    logout();
    navigate('/');
  };

  const onProfileClick = () => {
    navigate('/profile');
  };

  const isShopPage = state.route === 'shop';
  const shopFilter = state.shopFilter || 'all';
  const isAll = isShopPage && shopFilter === 'all';
  const isReady = isShopPage && shopFilter === 'ready';
  const isPreorder = isShopPage && shopFilter === 'preorder';

  const navBtnStyle = {
    background: 'none', border: 'none', cursor: 'pointer',
    fontFamily: "'Space Mono', monospace", fontSize: '12px', letterSpacing: '0.12em',
    textTransform: 'uppercase', color: '#14110D', padding: 0, fontWeight: 400
  };
  const navBtnActive = {
    ...navBtnStyle,
    fontWeight: 700,
  };

  const goAnd = (fn) => () => { fn(); setMenuOpen(false); };

  return (
    <>
      <style>{`
        .store-nav-desktop { display: flex; gap: 28px; align-items: center; }
        .store-hamburger-btn { display: none; }

        @media (max-width: 768px) {
          .store-header-row { padding: 14px 16px !important; }
          .store-nav-desktop { display: none; }
          .store-hamburger-btn { display: flex; }
        }
      `}</style>

      {menuOpen && (
        <>
          <div
            onClick={() => setMenuOpen(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(20,17,13,0.55)', zIndex: 59 }}
          />
          <div
            style={{
              position: 'fixed', top: 0, right: 0, bottom: 0, zIndex: 60,
              width: 'min(78vw, 300px)', background: '#F2EEE4', borderLeft: '2px solid #14110D',
              display: 'flex', flexDirection: 'column', padding: '20px', gap: '4px', overflowY: 'auto'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
              <button onClick={() => setMenuOpen(false)} style={{ background: 'none', border: 'none', fontSize: '26px', cursor: 'pointer', lineHeight: 1 }}>×</button>
            </div>
            <button onClick={goAnd(() => { updateState({ shopFilter: 'all' }); go('shop'); })} style={{ ...navBtnStyle, textAlign: 'left', padding: '14px 4px', fontWeight: isAll ? 700 : 400 }}>Shop</button>
            <button onClick={goAnd(() => { updateState({ shopFilter: 'ready' }); go('shop'); })} style={{ ...navBtnStyle, textAlign: 'left', padding: '14px 4px', fontWeight: isReady ? 700 : 400, borderBottom: '1px solid #ddd5c4' }}>Ready Stock</button>
            <button onClick={goAnd(() => { updateState({ shopFilter: 'preorder' }); go('shop'); })} style={{ ...navBtnStyle, textAlign: 'left', padding: '14px 4px', fontWeight: isPreorder ? 700 : 400 }}>Pre-Order</button>
            {user ? (
              <>
                <button onClick={goAnd(() => go('orders'))} style={{ ...navBtnStyle, textAlign: 'left', padding: '14px 4px' }}>Pesanan Saya</button>
                <button onClick={goAnd(onProfileClick)} style={{ ...navBtnStyle, textAlign: 'left', padding: '14px 4px', display: 'flex', alignItems: 'center', gap: '7px' }}>
                  <PingDot />
                  {user.name.split(' ')[0]}
                </button>
                <button onClick={goAnd(onLogoutClick)} style={{ ...navBtnStyle, textAlign: 'left', padding: '14px 4px', color: '#9a3a2a' }}>Keluar</button>
              </>
            ) : (
              <button onClick={goAnd(onAuthClick)} style={{ ...navBtnStyle, textAlign: 'left', padding: '14px 4px', display: 'flex', alignItems: 'center', gap: '7px' }}>
                <PingDot />
                Masuk | Daftar
              </button>
            )}
          </div>
        </>
      )}

      <header
        className="store-header-row"
        style={{
          position: 'sticky', top: 0, zIndex: 40, background: '#F2EEE4',
          borderBottom: '2px solid #14110D', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', padding: '16px 24px'
        }}
      >
        <button
          onClick={() => go('home')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}
        >
          <img src="/assets/logo.png" alt="Aircooled Syndicate" style={{ height: '42px', display: 'block' }} />
        </button>

        <nav className="store-nav-desktop">
          <button onClick={() => { updateState({ shopFilter: 'all' }); go('shop'); }} style={isAll ? navBtnActive : navBtnStyle}>Shop</button>
          <button onClick={() => { updateState({ shopFilter: 'ready' }); go('shop'); }} style={isReady ? navBtnActive : navBtnStyle}>Ready Stock</button>
          <button onClick={() => { updateState({ shopFilter: 'preorder' }); go('shop'); }} style={isPreorder ? navBtnActive : navBtnStyle}>Pre-Order</button>
          {user ? (
            <>
              <button onClick={() => go('orders')} style={{ ...navBtnStyle, letterSpacing: '0.1em' }}>Pesanan Saya</button>
              <button onClick={onProfileClick} style={{ ...navBtnStyle, display: 'flex', alignItems: 'center', gap: '7px', letterSpacing: '0.1em', color: '#F2C015' }}>
                <PingDot />
                {user.name.split(' ')[0]}
              </button>
              <button onClick={onLogoutClick} style={{ ...navBtnStyle, letterSpacing: '0.1em', color: '#9a3a2a' }}>Keluar</button>
            </>
          ) : (
            <button onClick={onAuthClick} style={{ ...navBtnStyle, display: 'flex', alignItems: 'center', gap: '7px', letterSpacing: '0.1em' }}>
              <PingDot />
              Masuk | Daftar
            </button>
          )}
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
            <span style={{ background: '#F2C015', color: '#14110D', minWidth: '20px', height: '20px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', padding: '0 5px' }}>
              {cartCount}
            </span>
          </button>
        </nav>

        <div className="store-hamburger-btn" style={{ alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => updateState({ cartOpen: !state.cartOpen })}
            style={{
              background: '#14110D', border: 'none', cursor: 'pointer', color: '#F2EEE4',
              display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 12px',
              fontFamily: "'Space Mono', monospace", fontSize: '11px', fontWeight: 700
            }}
          >
            <span>CART</span>
            <span style={{ background: '#F2C015', color: '#14110D', minWidth: '18px', height: '18px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', padding: '0 4px' }}>
              {cartCount}
            </span>
          </button>
          <button
            onClick={() => setMenuOpen(true)}
            style={{ background: 'none', border: '2px solid #14110D', cursor: 'pointer', padding: '8px 10px', fontSize: '18px', lineHeight: 1 }}
          >
            ☰
          </button>
        </div>
      </header>
    </>
  );
}
