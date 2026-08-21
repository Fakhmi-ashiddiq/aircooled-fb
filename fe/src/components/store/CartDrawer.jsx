import React, { useContext } from 'react';
import { useStore } from '../../store';
import { rp } from '../../utils/helpers';
import { isSizeOverXxl } from '../../hooks/useProductVM';

export default function CartDrawer() {
  const { state, updateState, data, go, changeQty } = useStore();

  if (!state.cartOpen) return null;

  const cartLines = state.cart.map(c => {
    const p = data.PRODUCTS.find(x => x.id === c.id);
    if (!p) return null;
    const metaParts = [];
    if (c.color) metaParts.push(c.color);
    if (p.sizes.length > 1) metaParts.push('Ukuran ' + c.size);
    if (p.type === 'preorder') metaParts.push('Pre-Order');
    else metaParts.push('Ready Stock');
    const unitPrice = isSizeOverXxl(c.size) ? (p.priceMoreXxl || p.price || 0) : (p.priceLessXxl || p.price || 0);
    return {
      key: c.key,
      name: p.name,
      meta: metaParts.join(' · '),
      qty: c.qty,
      unitPrice,
      garment: p.garment,
      printLogo: p.print === 'logo',
      printText: p.print === 'text',
      image: p.images && p.images.length > 0 && p.images[0].src ? p.images[0].src : null,
      lineTotal: rp(unitPrice * c.qty),
      inc: () => changeQty(c.key, 1),
      dec: () => changeQty(c.key, -1)
    };
  }).filter(Boolean);

  const cartEmpty = state.cart.length === 0;
  const cartHasItems = state.cart.length > 0;
  const subtotal = state.cart.reduce((s, c) => {
    const p = data.PRODUCTS.find(x => x.id === c.id);
    if (!p) return s;
    const unitPrice = isSizeOverXxl(c.size) ? (p.priceMoreXxl || p.price || 0) : (p.priceLessXxl || p.price || 0);
    return s + unitPrice * c.qty;
  }, 0);
  const cartCount = state.cart.reduce((s, c) => s + c.qty, 0);

  const toggleCart = () => updateState({ cartOpen: !state.cartOpen });

  const goCheckout = () => {
    updateState({ checkoutStep: 'form', cartOpen: false });
    go('checkout');
  };

  const goShop = () => {
    updateState({ shopFilter: 'all', cartOpen: false });
    go('shop');
  };

  return (
    <>
      <div style={{ position: 'fixed', inset: 0, zIndex: 90, background: 'rgba(20,17,13,0.55)' }} onClick={toggleCart}></div>
      <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, zIndex: 91, width: '420px', maxWidth: '92vw', background: '#F2EEE4', borderLeft: '2px solid #14110D', display: 'flex', flexDirection: 'column', animation: 'ascDrawerIn 0.28s ease' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 22px', borderBottom: '2px solid #14110D' }}>
          <div style={{ fontFamily: "'Archivo'", fontWeight: 900, fontSize: '22px', textTransform: 'uppercase' }}>Keranjang ({cartCount})</div>
          <button onClick={toggleCart} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '24px', fontWeight: 700, lineHeight: 1 }}>×</button>
        </div>
        
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 22px' }}>
          {cartEmpty && (
            <div style={{ textAlign: 'center', padding: '60px 20px', fontFamily: "'Space Mono', monospace", fontSize: '13px', color: '#6b655a' }}>
              Keranjang masih kosong.<br/><br/>
              <button onClick={goShop} style={{ background: '#14110D', color: '#F2EEE4', border: 'none', cursor: 'pointer', fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: '12px', letterSpacing: '0.06em', textTransform: 'uppercase', padding: '12px 20px' }}>Mulai Belanja</button>
            </div>
          )}
          
          {cartLines.map((ln) => (
            <div key={ln.key} style={{ display: 'flex', gap: '14px', padding: '16px 0', borderBottom: '1px solid #ddd5c4' }}>
              <div style={{ width: '64px', height: '64px', flex: 'none', background: ln.garment, border: '2px solid #14110D', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                {ln.image ? (
                  <img src={ln.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                ) : ln.printLogo ? (
                  <img src="/assets/logo.png" style={{ width: '60%' }} />
                ) : ln.printText ? (
                  <div style={{ color: '#F2C015', fontFamily: "'Archivo'", fontWeight: 900, fontSize: '9px', lineHeight: 0.9, textAlign: 'center', textTransform: 'uppercase' }}>AC<br/>SYND</div>
                ) : null}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "'Archivo'", fontWeight: 700, fontSize: '14px', textTransform: 'uppercase', lineHeight: 1.05 }}>{ln.name}</div>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', color: '#6b655a', marginTop: '2px' }}>{ln.meta}</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #14110D' }}>
                    <button onClick={ln.dec} style={{ background: 'none', border: 'none', cursor: 'pointer', width: '26px', height: '26px', fontSize: '15px' }}>−</button>
                    <div style={{ width: '26px', textAlign: 'center', fontFamily: "'Space Mono', monospace", fontSize: '12px' }}>{ln.qty}</div>
                    <button onClick={ln.inc} style={{ background: 'none', border: 'none', cursor: 'pointer', width: '26px', height: '26px', fontSize: '15px' }}>+</button>
                  </div>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '13px', fontWeight: 700 }}>{ln.lineTotal}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {cartHasItems && (
          <div style={{ borderTop: '2px solid #14110D', padding: '20px 22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "'Archivo'", fontWeight: 800, fontSize: '20px', textTransform: 'uppercase', marginBottom: '14px' }}>
              <span>Subtotal</span><span style={{ fontFamily: "'Space Mono', monospace" }}>{rp(subtotal)}</span>
            </div>
            <button onClick={goCheckout} style={{ width: '100%', background: '#F2C015', color: '#14110D', border: 'none', cursor: 'pointer', fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: '14px', letterSpacing: '0.06em', textTransform: 'uppercase', padding: '16px' }}>
              Checkout →
            </button>
          </div>
        )}
      </div>
    </>
  );
}

