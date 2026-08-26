import React, { useContext, useState, useEffect, useRef } from 'react';
import { useStore } from '../../store';
import { rp } from '../../utils/helpers';
import CityService from '../../services/CityService';
import OrderService from '../../services/OrderService';
import CartService from '../../services/CartService';
import ShippingService from '../../services/ShippingService';
import { isSizeOverXxl } from '../../hooks/useProductVM';

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
  const checkoutPhone = user ? (user.phone || '') : '';
  const checkoutAddress = user ? (user.address || '') : '';
  const checkoutCity = user ? (user.city || '') : '';
  const checkoutPostalCode = user ? (user.postal_code || '') : '';

  const [citySearch, setCitySearch] = useState(checkoutCity);
  const [cityResults, setCityResults] = useState([]);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedPostalCode, setSelectedPostalCode] = useState(checkoutPostalCode);
  const [shippingOptions, setShippingOptions] = useState([]);
  const [selectedShipping, setSelectedShipping] = useState(null);
  const [shippingLoading, setShippingLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const cityRef = useRef(null);
  const searchTimeout = useRef(null);

  const authLabel = user ? `${user.name.split(' ')[0]} · Keluar` : 'Masuk | Daftar';

  const cartLines = cart.map(c => {
    const p = data.PRODUCTS.find(x => x.id === c.id);
    if (!p) return null;
    const metaParts = [];
    if (c.color) metaParts.push(c.color);
    if (p.sizes.length > 1) metaParts.push('Ukuran ' + c.size);
    if (p.type === 'preorder') metaParts.push('Pre-Order');
    else metaParts.push('Ready Stock');
    const unitPrice = isSizeOverXxl(c.size) ? (p.priceMoreXxl || p.price || 0) : (p.priceLessXxl || p.price || 0);
    return {
      name: p.name,
      meta: metaParts.join(' · '),
      label: p.name + (p.sizes.length > 1 ? ` (${c.size})` : ''),
      qty: c.qty,
      lineTotal: rp(unitPrice * c.qty)
    };
  }).filter(Boolean);

  const subtotal = cart.reduce((s, c) => {
    const p = data.PRODUCTS.find(x => x.id === c.id);
    if (!p) return s;
    const unitPrice = isSizeOverXxl(c.size) ? (p.priceMoreXxl || p.price || 0) : (p.priceLessXxl || p.price || 0);
    return s + unitPrice * c.qty;
  }, 0);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (cityRef.current && !cityRef.current.contains(e.target)) {
        setShowCityDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchCity = (query) => {
    setCitySearch(query);
    setSelectedCity(null);
    setSelectedPostalCode('');
    if (query.length < 2) {
      setCityResults([]);
      setShowCityDropdown(false);
      return;
    }
    clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(async () => {
      try {
        const results = await CityService.getAll(query);
        setCityResults(results);
        setShowCityDropdown(true);
      } catch (e) {
        setCityResults([]);
      }
    }, 500);
  };

  const selectCity = async (city) => {
    const displayName = city.label || city.city_name;
    setCitySearch(displayName);
    setSelectedPostalCode(String(city.zip_code || ''));
    setSelectedCity({ id: city.id, name: displayName });
    setShowCityDropdown(false);

    setShippingLoading(true);
    setSelectedShipping(null);
    try {
      const totalWeight = cart.reduce((sum, c) => {
        const p = data.PRODUCTS.find(x => x.id === c.id);
        return sum + ((p?.weight || 1000) * c.qty);
      }, 0);
      const result = await ShippingService.getCost(city.id, Math.max(totalWeight, 100));
      const regOnly = (result.results || []).filter(o => o.service && o.service.toUpperCase().includes('REG'));
      setShippingOptions(regOnly);
      if (regOnly.length > 0) {
        setSelectedShipping(regOnly[0]);
      }
    } catch (e) {
      setShippingOptions([]);
    }
    setShippingLoading(false);
  };

  const shipping = selectedShipping ? selectedShipping.cost : 0;
  const totalFmt = rp(subtotal + shipping);

  const PM = [
    { id: 'transfer_bca', name: 'Transfer Bank BCA', desc: 'Transfer ke rekening BCA' },
    { id: 'qris', name: 'QRIS', desc: 'Scan dari semua e-wallet & m-banking' }
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
    setSubmitting(true);
    try {
      if (checkoutMode === 'register' && !user) {
        const name = (authName || '').trim() || 'Member';
        try {
          await register(name, authEmail || '', 'password123', 'password123', {
            city_id: selectedCity ? selectedCity.id : null,
          });
        } catch (err) {
          updateState({ user: { name, email: authEmail || '' } });
        }
      }

      const name = (authName || user?.name || '').trim() || 'Member';
      const email = (authEmail || user?.email || '').trim();
      const code = 'ASC-' + Date.now().toString(36).toUpperCase() + Math.floor(Math.random() * 100);
      const today = new Date();
      const dateStr = today.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });

      const orderItems = cart.map(c => {
        const p = data.PRODUCTS.find(x => x.id === c.id);
        const unitPrice = p ? (p.priceLessXxl || p.price || 0) : 0;
        return {
          product_id: p?.db_id || p?.id || null,
          size: c.size,
          color: c.color,
          qty: c.qty,
          price: unitPrice,
          type: p?.type || 'ready'
        };
      });

      const orderData = {
        code,
        customer: name,
        total: subtotal + shipping,
        date: dateStr,
        type: 'ready',
        status: 'Awaiting',
        user_id: user?.id || null,
        phone: user?.phone || '',
        email,
        address: '',
        city_id: user ? (selectedCity?.id || null) : null,
        shipping_cost: shipping,
        payment_method: state.payMethod || '',
        notes: '',
        order_items: orderItems
      };

      const result = await OrderService.create(orderData);
      if (user) {
        try { await CartService.clear(); } catch (e) {}
      }

      updateState({ checkoutStep: 'done', orderId: code, cart: [], checkoutMode: 'guest', authName: '', authEmail: '' });
      go('invoice/' + code);
    } catch (e) {
      useStore.getState().showToast(e.response?.data?.message || 'Gagal menyimpan pesanan');
    } finally {
      setSubmitting(false);
    }
  };

  const canSubmit = selectedCity && state.payMethod && !submitting;

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
                  <input placeholder="No. Telp / WhatsApp" defaultValue={checkoutPhone} style={{ padding: '14px', border: '2px solid #14110D', background: '#fff', fontSize: '14px' }} />

                  {checkoutIsRegister ? (
                    <input placeholder="Email" value={authEmail} onChange={(e) => updateState({ authEmail: e.target.value })} style={{ padding: '14px', border: '2px solid #14110D', background: '#fff', fontSize: '14px' }} />
                  ) : (
                    <input placeholder="Email" defaultValue={checkoutEmail} style={{ padding: '14px', border: '2px solid #14110D', background: '#fff', fontSize: '14px' }} />
                  )}

                  <input className="ck-span-full" placeholder="Alamat lengkap" defaultValue={checkoutAddress} style={{ gridColumn: '1/3', padding: '14px', border: '2px solid #14110D', background: '#fff', fontSize: '14px' }} />
                  <div ref={cityRef} style={{ position: 'relative' }}>
                    <input placeholder="Kota / Kabupaten" value={citySearch} onChange={e => searchCity(e.target.value)} onFocus={() => cityResults.length > 0 && setShowCityDropdown(true)} style={{ width: '100%', padding: '14px', border: '2px solid #14110D', background: '#fff', fontSize: '14px', boxSizing: 'border-box' }} />
                    {showCityDropdown && cityResults.length > 0 && (
                      <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#fff', border: '2px solid #14110D', borderTop: 'none', maxHeight: '200px', overflowY: 'auto', zIndex: 10 }}>
                        {cityResults.slice(0, 30).map(city => (
                          <div key={city.id} onClick={() => selectCity(city)} style={{ padding: '10px 13px', cursor: 'pointer', fontSize: '13px', borderBottom: '1px solid #ddd5c4' }}
                            onMouseEnter={e => e.currentTarget.style.background = '#F2EEE4'}
                            onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
                            <span style={{ fontWeight: 700 }}>{city.label || city.city_name}</span>
                            <span style={{ color: '#6b655a', marginLeft: '6px' }}>{city.province_name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <input placeholder="Kode pos" value={selectedPostalCode} readOnly style={{ padding: '14px', border: '2px solid #14110D', background: selectedCity ? '#e4ddcd' : '#fff', fontSize: '14px', cursor: selectedCity ? 'not-allowed' : 'text' }} />

                  {checkoutIsRegister && (
                    <input className="ck-span-full" type="password" placeholder="Password (untuk akun baru)" style={{ gridColumn: '1/3', padding: '14px', border: '2px solid #14110D', background: '#fff', fontSize: '14px' }} />
                  )}
                  <textarea className="ck-span-full" placeholder="Keterangan (opsional) — ukuran, warna, catatan kurir…" rows="2" style={{ gridColumn: '1/3', padding: '14px', border: '2px solid #14110D', background: '#fff', fontSize: '14px', resize: 'vertical' }}></textarea>
                </div>

                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#14110D', fontWeight: 700, marginBottom: '14px' }}>02 / Pengiriman (JNE)</div>
                {shippingLoading ? (
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '13px', color: '#6b655a', marginBottom: '16px' }}>Menghitung ongkir...</div>
                ) : shippingOptions.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
                    {shippingOptions.map((opt, idx) => (
                      <button key={idx} onClick={() => setSelectedShipping(opt)} style={{
                        border: '2px solid #14110D',
                        background: selectedShipping?.service === opt.service ? '#F2C015' : '#fff',
                        cursor: 'pointer', textAlign: 'left', padding: '14px 16px',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                      }}>
                        <div>
                          <span style={{ fontFamily: "'Archivo'", fontWeight: 700, fontSize: '14px' }}>{opt.service}</span>
                          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '12px', color: '#6b655a', marginLeft: '8px' }}>Est. {opt.etd} hari</span>
                        </div>
                        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '14px', fontWeight: 700 }}>{rp(opt.cost)}</span>
                      </button>
                    ))}
                  </div>
                ) : selectedCity ? (
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '13px', color: '#6b655a', marginBottom: '16px' }}>Tidak ada opsi pengiriman</div>
                ) : (
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '13px', color: '#6b655a', marginBottom: '16px' }}>Pilih kota tujuan terlebih dahulu</div>
                )}

                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#14110D', fontWeight: 700, marginBottom: '14px' }}>03 / Metode Pembayaran</div>
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
            <button onClick={placeOrder} disabled={!canSubmit} style={{ marginTop: '18px', width: '100%', background: canSubmit ? '#F2C015' : '#d4d4d4', color: '#14110D', border: 'none', cursor: canSubmit ? 'pointer' : 'not-allowed', fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: '14px', letterSpacing: '0.06em', textTransform: 'uppercase', padding: '16px', opacity: submitting ? 0.7 : 1 }}>
              {submitting ? 'Memproses...' : checkoutCtaLabel}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
