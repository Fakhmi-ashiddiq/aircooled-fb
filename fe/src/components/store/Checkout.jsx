import React, { useContext } from 'react';
import { useStore } from '../../store';
import { rp } from '../../utils/helpers';

export default function Checkout() {
  const { state, updateState, data, go, login, register } = useStore();

  const { cart, user, checkoutStep, orderId, authName, authEmail } = state;

  const orderPlaced = checkoutStep === 'done';
  const checkoutForm = checkoutStep === 'form';
  const checkoutMode = state.checkoutMode;
  const checkoutNotLoggedIn = !user;
  const checkoutShowLogin = checkoutMode === 'login' && !user;
  const checkoutShowForm = !(checkoutMode === 'login' && !user);
  const checkoutIsRegister = checkoutMode === 'register' && !user;
  const checkoutCtaLabel = (checkoutMode === 'register' && !user) ? 'Daftar & Buat Pesanan' : 'Buat Pesanan';

  const checkoutName = user ? user.name : '';
  const checkoutEmail = user ? (user.email || '') : '';

  const authLabel = user ? `${user.name.split(' ')[0]} · Keluar` : 'Masuk | Daftar';

  const cartLines = cart.map(c => {
    const p = data.PRODUCTS.find(x => x.id === c.id);
    const metaParts = [];
    if (c.color) metaParts.push(c.color);
    if (p.sizes.length > 1) metaParts.push('Ukuran ' + c.size);
    if (p.type === 'preorder') metaParts.push('Pre-Order');
    else metaParts.push('Ready Stock');
    return {
      name: p.name,
      meta: metaParts.join(' · '),
      label: p.name + (p.sizes.length > 1 ? ` (${c.size})` : ''),
      qty: c.qty,
      lineTotal: rp(p.price * c.qty)
    };
  });

  const subtotal = cart.reduce((s, c) => {
    const p = data.PRODUCTS.find(x => x.id === c.id);
    return s + p.price * c.qty;
  }, 0);
  const shipping = subtotal > 0 ? 25000 : 0;
  const totalFmt = rp(subtotal + shipping);

  const PM = [
    { id: 'va', name: 'Virtual Account', desc: 'BCA, Mandiri, BNI, BRI' },
    { id: 'ewallet', name: 'E-Wallet', desc: 'GoPay, OVO, Dana, ShopeePay' },
    { id: 'qris', name: 'QRIS', desc: 'Scan dari semua e-wallet & m-banking' },
    { id: 'transfer', name: 'Transfer Bank Manual', desc: 'Konfirmasi manual via WhatsApp' }
  ];

  const payMethods = PM.map(m => ({
    ...m,
    pick: () => updateState({ payMethod: m.id }),
    style: {
      border: '2px solid #14110D',
      background: state.payMethod === m.id ? '#F2C015' : '#fff',
      cursor: 'pointer', textAlign: 'left', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '3px'
    }
  }));

  const segStyle = (on) => ({
    background: on ? '#14110D' : '#fff',
    color: on ? '#F2EEE4' : '#14110D',
    border: '2px solid #14110D',
    cursor: 'pointer',
    fontFamily: "'Space Mono', monospace",
    fontWeight: 700,
    fontSize: '12px',
    textTransform: 'uppercase',
    padding: '10px 16px',
    letterSpacing: '0.04em'
  });

  const checkoutLogin = async () => {
    const em = (authEmail || '').trim();
    if (!em) return;
    try {
      await login(em, 'password');
      updateState({ checkoutMode: 'guest', authName: '', authEmail: '' });
    } catch (err) {
      // If login fails, just use email as guest
      const name = (authName || '').trim() || (em.split('@')[0]) || 'Member';
      updateState({ user: { name, email: em }, checkoutMode: 'guest', authName: '', authEmail: '' });
    }
  };

  const placeOrder = async () => {
    if (checkoutMode === 'register' && !user) {
      const name = (authName || '').trim() || 'Member';
      try {
        await register(name, authEmail || '', 'password123', 'password123');
      } catch (err) {
        updateState({ user: { name, email: authEmail || '' } });
      }
    }
    const id = 'ASC-' + (1052 + Math.floor(Math.random() * 40));
    updateState({ checkoutStep: 'done', orderId: id, cart: [], checkoutMode: 'guest', authName: '', authEmail: '' });
    window.scrollTo(0, 0);
  };

  return (
    <main className="ck-main-pad" style={{ padding: '48px' }}>
      <style>{`
        @media (max-width: 768px) {
          .ck-main-pad { padding: 20px 16px !important; }
          .ck-title { font-size: 30px !important; }
          .ck-layout-grid { grid-template-columns: 1fr !important; gap: 28px !important; }
          .ck-form-fields { grid-template-columns: 1fr !important; }
          .ck-span-full { grid-column: 1 / -1 !important; }
          .ck-summary-box { position: static !important; top: auto !important; }
          .ck-success-box { padding: 28px 20px !important; margin: 20px auto !important; }
        }
      `}</style>

      {orderPlaced && (
        <div className="ck-success-box" style={{ maxWidth: '560px', margin: '40px auto', textAlign: 'center', border: '2px solid #14110D', background: '#fff', padding: '48px' }}>
          <div style={{ width: '64px', height: '64px', background: '#F2C015', border: '2px solid #14110D', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '32px', fontWeight: 900 }}>✓</div>
          <h1 style={{ fontFamily: "'Archivo'", fontWeight: 900, fontSize: '34px', margin: 0, textTransform: 'uppercase' }}>Pesanan Diterima</h1>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '14px', marginTop: '12px', color: '#3d382f' }}>No. Order {orderId}</div>
          <p style={{ fontSize: '15px', color: '#3d382f', lineHeight: 1.6, margin: '18px 0 28px' }}>Terima kasih! Instruksi pembayaran sudah dikirim ke email kamu. Pesanan pre-order akan diproduksi setelah sesi ditutup.</p>
          <button onClick={() => go('home')} style={{ background: '#14110D', color: '#F2EEE4', border: 'none', cursor: 'pointer', fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: '13px', letterSpacing: '0.06em', textTransform: 'uppercase', padding: '15px 28px' }}>
            Kembali ke Beranda
          </button>
        </div>
      )}

      {checkoutForm && (
        <div className="ck-layout-grid" style={{ display: 'grid', gridTemplateColumns: '1.3fr 0.7fr', gap: '48px', alignItems: 'start' }}>
          <div>
            <button onClick={() => updateState({ cartOpen: true })} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Space Mono', monospace", fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#6b655a', marginBottom: '16px' }}>
              ← Kembali ke Keranjang
            </button>
            <h1 className="ck-title" style={{ fontFamily: "'Archivo'", fontWeight: 900, fontSize: '44px', margin: '0 0 28px', textTransform: 'uppercase' }}>Checkout</h1>

            {checkoutNotLoggedIn && (
              <div style={{ display: 'flex', gap: '10px', marginBottom: '22px', flexWrap: 'wrap' }}>
                <button onClick={() => updateState({ checkoutMode: 'guest' })} style={segStyle(checkoutMode === 'guest')}>Pesan sebagai Tamu</button>
                <button onClick={() => updateState({ checkoutMode: 'login' })} style={segStyle(checkoutMode === 'login')}>Masuk</button>
                <button onClick={() => updateState({ checkoutMode: 'register' })} style={segStyle(checkoutMode === 'register')}>Daftar</button>
              </div>
            )}

            {user && (
              <div style={{ border: '2px solid #14110D', background: '#F2C015', padding: '14px 16px', marginBottom: '22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#14110D', display: 'inline-block' }}></span>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '13px', fontWeight: 700 }}>Masuk sebagai {authLabel}</span>
                </div>
                <button onClick={() => updateState({ user: null })} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Space Mono', monospace", fontSize: '11px', color: '#14110D', textDecoration: 'underline' }}>Ganti Akun</button>
              </div>
            )}

            {checkoutShowLogin && (
              <div style={{ border: '2px solid #14110D', background: '#fff', padding: '24px' }}>
                <div style={{ fontFamily: "'Archivo'", fontWeight: 800, fontSize: '18px', textTransform: 'uppercase' }}>Masuk ke Akun</div>
                <p style={{ fontSize: '13px', color: '#6b655a', margin: '8px 0 16px' }}>Checkout lebih cepat &amp; alamat terisi otomatis.</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <input placeholder="Email" value={authEmail} onChange={(e) => updateState({ authEmail: e.target.value })} style={{ padding: '14px', border: '2px solid #14110D', background: '#fff', fontSize: '14px' }} />
                  <input type="password" placeholder="Password" style={{ padding: '14px', border: '2px solid #14110D', background: '#fff', fontSize: '14px' }} />
                  <button onClick={checkoutLogin} style={{ background: '#F2C015', color: '#14110D', border: 'none', cursor: 'pointer', fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: '13px', letterSpacing: '0.06em', textTransform: 'uppercase', padding: '15px' }}>
                    Masuk &amp; Lanjut Checkout
                  </button>
                </div>
              </div>
            )}

            {checkoutShowForm && (
              <>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#14110D', fontWeight: 700, marginBottom: '14px' }}>01 / Kontak &amp; Pengiriman</div>
                <div className="ck-form-fields" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '32px' }}>
                  {checkoutIsRegister ? (
                    <input className="ck-span-full" placeholder="Nama lengkap" value={authName} onChange={(e) => updateState({ authName: e.target.value })} style={{ gridColumn: '1/3', padding: '14px', border: '2px solid #14110D', background: '#fff', fontSize: '14px' }} />
                  ) : (
                    <input className="ck-span-full" placeholder="Nama lengkap" defaultValue={checkoutName} style={{ gridColumn: '1/3', padding: '14px', border: '2px solid #14110D', background: '#fff', fontSize: '14px' }} />
                  )}
                  <input placeholder="No. Telp / WhatsApp" style={{ padding: '14px', border: '2px solid #14110D', background: '#fff', fontSize: '14px' }} />

                  {checkoutIsRegister ? (
                    <input placeholder="Email" value={authEmail} onChange={(e) => updateState({ authEmail: e.target.value })} style={{ padding: '14px', border: '2px solid #14110D', background: '#fff', fontSize: '14px' }} />
                  ) : (
                    <input placeholder="Email" defaultValue={checkoutEmail} style={{ padding: '14px', border: '2px solid #14110D', background: '#fff', fontSize: '14px' }} />
                  )}

                  <input className="ck-span-full" placeholder="Alamat lengkap" style={{ gridColumn: '1/3', padding: '14px', border: '2px solid #14110D', background: '#fff', fontSize: '14px' }} />
                  <input placeholder="Kota" style={{ padding: '14px', border: '2px solid #14110D', background: '#fff', fontSize: '14px' }} />
                  <input placeholder="Kode pos" style={{ padding: '14px', border: '2px solid #14110D', background: '#fff', fontSize: '14px' }} />

                  {checkoutIsRegister && (
                    <input className="ck-span-full" type="password" placeholder="Password (untuk akun baru)" style={{ gridColumn: '1/3', padding: '14px', border: '2px solid #14110D', background: '#fff', fontSize: '14px' }} />
                  )}
                  <textarea className="ck-span-full" placeholder="Keterangan (opsional) — ukuran, warna, catatan kurir…" rows="2" style={{ gridColumn: '1/3', padding: '14px', border: '2px solid #14110D', background: '#fff', fontSize: '14px', resize: 'vertical' }}></textarea>
                </div>

                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#14110D', fontWeight: 700, marginBottom: '14px' }}>02 / Metode Pembayaran</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {payMethods.map((pm, idx) => (
                    <button key={idx} onClick={pm.pick} style={pm.style}>
                      <span style={{ fontFamily: "'Archivo'", fontWeight: 700, fontSize: '15px' }}>{pm.name}</span>
                      <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '12px', color: '#6b655a' }}>{pm.desc}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="ck-summary-box" style={{ border: '2px solid #14110D', background: '#fff', padding: '24px', position: 'sticky', top: '90px' }}>
            <div style={{ fontFamily: "'Archivo'", fontWeight: 800, fontSize: '18px', textTransform: 'uppercase', marginBottom: '16px' }}>Ringkasan</div>
            {cartLines.map((ln, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', padding: '7px 0', borderBottom: '1px solid #ddd5c4' }}>
                <span style={{ maxWidth: '170px' }}>{ln.label} × {ln.qty}</span>
                <span style={{ fontFamily: "'Space Mono', monospace" }}>{ln.lineTotal}</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', padding: '10px 0 4px' }}>
              <span style={{ color: '#6b655a' }}>Subtotal</span>
              <span style={{ fontFamily: "'Space Mono', monospace" }}>{rp(subtotal)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', padding: '4px 0' }}>
              <span style={{ color: '#6b655a' }}>Ongkir</span>
              <span style={{ fontFamily: "'Space Mono', monospace" }}>{rp(shipping)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "'Archivo'", fontWeight: 800, fontSize: '18px', padding: '14px 0 0', marginTop: '8px', borderTop: '2px solid #14110D' }}>
              <span>TOTAL</span>
              <span style={{ fontFamily: "'Space Mono', monospace" }}>{totalFmt}</span>
            </div>
            <button onClick={placeOrder} style={{ marginTop: '18px', width: '100%', background: '#F2C015', color: '#14110D', border: 'none', cursor: 'pointer', fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: '14px', letterSpacing: '0.06em', textTransform: 'uppercase', padding: '16px' }}>
              {checkoutCtaLabel}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
