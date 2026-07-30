import React, { useContext } from 'react';
import { AppContext } from '../../../context/AppContext';
import { rp } from '../../../utils/helpers';
import useProductVM from '../../../hooks/useProductVM';

export default function POModal() {
  const { state, updateState, data } = useContext(AppContext);
  const { getProductVM } = useProductVM();

  if (!state.poModal) return null;

  const closePoModal = () => updateState({ poModal: false, poDone: false, poMode: 'guest' });

  const ap = data.PRODUCTS.find(x => x.id === state.activeId);
  const activeP = ap ? getProductVM(ap) : null;
  const { user, poDone, poOrderId, poMode, authEmail, authName, poCity, poShip, poItems } = state;

  const poName = user ? user.name : '';
  const poEmail = user ? (user.email || '') : '';

  const poModeGuest = poMode === 'guest';
  const poModeLogin = poMode === 'login';
  const poModeRegister = poMode === 'register';
  const poOrderForm = poMode === 'guest' || poMode === 'register';

  const poSummary = {
    name: ap?.name || '',
    priceFmt: activeP ? activeP.priceFmt : '',
    eta: activeP ? activeP.eta : '',
    sessionName: activeP ? activeP.sessionName : ''
  };

  const poTotalQty = (poItems || []).reduce((a, it) => a + (it.qty || 1), 0);
  const poSubtotalN = (ap ? ap.price : 0) * poTotalQty;
  const poShipN = parseInt(poShip) || 0;
  const poTotalN = poSubtotalN + poShipN;
  const poCanSub = poShipN > 0 && (poItems || []).length > 0;

  const poSubmitStyle = {
    background: poCanSub ? '#F2C015' : '#d8d2c4',
    color: poCanSub ? '#14110D' : '#8a8377',
    cursor: poCanSub ? 'pointer' : 'not-allowed',
    width: '100%', border: 'none', fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: '14px', letterSpacing: '0.06em', textTransform: 'uppercase', padding: '16px', marginTop: '18px'
  };

  const poSubmitHint = poShipN <= 0 ? 'Masukkan ongkir untuk melanjutkan.' : '';

  const poLogin = () => {
    const em = (authEmail || '').trim();
    const name = (authName || '').trim() || (em.split('@')[0]) || 'Member';
    updateState({ user: { name, email: em }, poMode: 'guest', authName: '', authEmail: '' });
  };

  const submitPreorder = () => {
    if (!poCanSub) return;
    const ov = { ...state.committedOverride };
    ov[ap.id] = (state.committedOverride[ap.id] ?? ap.preorder.committed) + poTotalQty;
    const id = 'PO-' + (2300 + Math.floor(Math.random() * 90));
    updateState({ committedOverride: ov, poDone: true, poOrderId: id });
  };

  const poRegister = () => {
    if (!poCanSub) return;
    const name = (authName || '').trim() || 'Member';
    updateState({ user: { name, email: authEmail || '' } });
    submitPreorder();
  };

  const addPoItem = () => {
    if (!ap) return;
    const items = [...poItems];
    if (items.length >= 4) return;
    items.push({ size: (ap.sizes && ap.sizes[0]) || '-', color: (ap.colors && ap.colors[0] && ap.colors[0].name) || '-', qty: 1 });
    updateState({ poItems: items });
  };

  const removePoItem = (i) => {
    const items = [...poItems];
    if (items.length <= 1) return;
    items.splice(i, 1);
    updateState({ poItems: items });
  };

  const setPoItem = (i, field, val) => {
    const items = poItems.map((it, idx) => idx === i ? { ...it, [field]: val } : it);
    updateState({ poItems: items });
  };

  const poItemQtyDelta = (i, d) => {
    const items = poItems.map((it, idx) => idx === i ? { ...it, qty: Math.max(1, (it.qty || 1) + d) } : it);
    updateState({ poItems: items });
  };

  return (
    <>
      <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(20,17,13,0.62)', animation: 'ascOverlayIn 0.18s ease' }} onClick={closePoModal}></div>
      <div style={{ position: 'fixed', zIndex: 101, top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '480px', maxWidth: '94vw', maxHeight: '90vh', overflowY: 'auto', background: '#F2EEE4', border: '2px solid #14110D', animation: 'ascModalIn 0.26s cubic-bezier(0.22,1,0.36,1)' }}>
        <div style={{ background: '#14110D', color: '#F2EEE4', padding: '18px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#F2C015' }}>● Form Pemesanan Pre-Order</div>
          <button onClick={closePoModal} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#F2EEE4', fontSize: '24px', lineHeight: 1 }}>×</button>
        </div>

        {poDone ? (
          <div style={{ padding: '36px 28px', textAlign: 'center' }}>
            <div style={{ width: '60px', height: '60px', background: '#F2C015', border: '2px solid #14110D', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px', fontSize: '30px', fontWeight: 900 }}>✓</div>
            <h2 style={{ fontFamily: "'Archivo'", fontWeight: 900, fontSize: '26px', margin: 0, textTransform: 'uppercase' }}>Pesanan Tercatat</h2>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '13px', marginTop: '10px', color: '#3d382f' }}>No. Pre-Order {poOrderId}</div>
            <p style={{ fontSize: '14px', color: '#3d382f', lineHeight: 1.6, margin: '16px 24px 24px' }}>Pesanan {poSummary.name} masuk ke kuota sesi <strong>{poSummary.sessionName}</strong>. Produksi berjalan setelah sesi ditutup, estimasi kirim {poSummary.eta}. Instruksi pembayaran dikirim via email/WhatsApp.</p>
            <button onClick={closePoModal} style={{ background: '#14110D', color: '#F2EEE4', border: 'none', cursor: 'pointer', fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: '13px', letterSpacing: '0.06em', textTransform: 'uppercase', padding: '14px 26px' }}>Selesai</button>
          </div>
        ) : (
          <div style={{ padding: '22px 24px' }}>
            {poModeGuest && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '18px', fontFamily: "'Space Mono', monospace", fontSize: '12px', color: '#6b655a' }}>
                <span>Pesan sebagai tamu — atau</span>
                <button onClick={() => updateState({ poMode: 'login', authMode: 'login' })} style={{ background: '#14110D', color: '#F2EEE4', border: 'none', cursor: 'pointer', fontFamily: "'Space Mono', monospace", fontSize: '11px', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', padding: '7px 12px' }}>Masuk</button>
                <span>/</span>
                <button onClick={() => updateState({ poMode: 'register', authMode: 'register' })} style={{ background: '#fff', color: '#14110D', border: '2px solid #14110D', cursor: 'pointer', fontFamily: "'Space Mono', monospace", fontSize: '11px', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', padding: '5px 12px' }}>Daftar</button>
              </div>
            )}
            {poModeLogin && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
                <span style={{ fontFamily: "'Archivo'", fontWeight: 800, fontSize: '18px', textTransform: 'uppercase' }}>Masuk ke Akun</span>
                <button onClick={() => updateState({ poMode: 'guest' })} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Space Mono', monospace", fontSize: '11px', fontWeight: 700, color: '#6b655a', textTransform: 'uppercase' }}>← Pesan sebagai tamu</button>
              </div>
            )}
            {poModeRegister && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
                <span style={{ fontFamily: "'Archivo'", fontWeight: 800, fontSize: '18px', textTransform: 'uppercase' }}>Daftar Akun Baru</span>
                <button onClick={() => updateState({ poMode: 'guest' })} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Space Mono', monospace", fontSize: '11px', fontWeight: 700, color: '#6b655a', textTransform: 'uppercase' }}>← Pesan sebagai tamu</button>
              </div>
            )}

            {poModeLogin && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <input placeholder="Email" value={authEmail} onChange={(e) => updateState({ authEmail: e.target.value })} style={{ padding: '14px', border: '2px solid #14110D', background: '#fff', fontSize: '14px' }} />
                <input type="password" placeholder="Password" style={{ padding: '14px', border: '2px solid #14110D', background: '#fff', fontSize: '14px' }} />
                <button onClick={poLogin} style={{ background: '#F2C015', color: '#14110D', border: 'none', cursor: 'pointer', fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: '13px', letterSpacing: '0.06em', textTransform: 'uppercase', padding: '15px' }}>Masuk &amp; Lanjut Pesan</button>
              </div>
            )}

            {poOrderForm && (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  {poModeRegister ? (
                    <input placeholder="Nama lengkap" value={authName} onChange={(e) => updateState({ authName: e.target.value })} style={{ gridColumn: '1/3', padding: '13px', border: '2px solid #14110D', background: '#fff', fontSize: '14px' }} />
                  ) : (
                    <input placeholder="Nama lengkap" defaultValue={poName} style={{ gridColumn: '1/3', padding: '13px', border: '2px solid #14110D', background: '#fff', fontSize: '14px' }} />
                  )}
                  <input placeholder="No. Telp / WhatsApp" style={{ padding: '13px', border: '2px solid #14110D', background: '#fff', fontSize: '14px' }} />
                  {poModeRegister ? (
                    <input placeholder="Email" value={authEmail} onChange={(e) => updateState({ authEmail: e.target.value })} style={{ padding: '13px', border: '2px solid #14110D', background: '#fff', fontSize: '14px' }} />
                  ) : (
                    <input placeholder="Email" defaultValue={poEmail} style={{ padding: '13px', border: '2px solid #14110D', background: '#fff', fontSize: '14px' }} />
                  )}
                  <input placeholder="Alamat lengkap" style={{ gridColumn: '1/3', padding: '13px', border: '2px solid #14110D', background: '#fff', fontSize: '14px' }} />
                  <input placeholder="Kota" value={poCity} onChange={(e) => updateState({ poCity: e.target.value })} style={{ padding: '13px', border: '2px solid #14110D', background: '#fff', fontSize: '14px' }} />
                  <input placeholder="Kode pos" style={{ padding: '13px', border: '2px solid #14110D', background: '#fff', fontSize: '14px' }} />
                  {poModeRegister && (
                    <input type="password" placeholder="Password (untuk akun baru)" style={{ gridColumn: '1/3', padding: '13px', border: '2px solid #14110D', background: '#fff', fontSize: '14px' }} />
                  )}
                  <textarea placeholder="Keterangan (opsional)" rows="2" style={{ gridColumn: '1/3', padding: '13px', border: '2px solid #14110D', background: '#fff', fontSize: '14px', resize: 'vertical' }}></textarea>
                </div>

                <div style={{ border: '2px solid #14110D', background: '#F2EEE4', padding: '14px', marginTop: '14px' }}>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#6b655a', marginBottom: '8px' }}>Ongkos Kirim</div>
                  <div style={{ display: 'flex', alignItems: 'center', border: '2px solid #14110D', background: '#fff' }}>
                    <span style={{ padding: '0 12px', fontFamily: "'Space Mono', monospace", fontSize: '14px', color: '#6b655a' }}>Rp</span>
                    <input type="number" placeholder="mis. 10000" value={poShip} onChange={(e) => updateState({ poShip: e.target.value })} style={{ flex: 1, border: 'none', borderLeft: '2px solid #14110D', padding: '13px', fontFamily: "'Space Mono', monospace", fontSize: '14px', background: '#fff' }} />
                  </div>
                </div>

                <div style={{ border: '2px solid #14110D', background: '#fff', padding: '16px', marginTop: '18px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6b655a' }}>Detail Pesanan — {poSummary.name}</div>
                    <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', color: '#6b655a' }}>{poItems.length}/4 item</div>
                  </div>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', color: '#6b655a', marginBottom: '10px' }}>Sesi {poSummary.sessionName} · {poSummary.priceFmt}/unit · Est. kirim {poSummary.eta}</div>

                  {poItems.map((it, i) => (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: 'auto 1fr 1fr auto auto', gap: '8px', alignItems: 'center', padding: '10px 0', borderTop: '1px solid #ddd5c4' }}>
                      <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '12px', color: '#6b655a', width: '18px' }}>{i + 1}</span>
                      <select value={it.size} onChange={(e) => setPoItem(i, 'size', e.target.value)} style={{ width: '100%', height: '40px', padding: '8px', border: '2px solid #14110D', background: '#fff', fontFamily: "'Space Mono', monospace", fontSize: '13px' }}>
                        <option value="" disabled>Ukuran</option>
                        {ap?.sizes?.map(sz => <option key={sz} value={sz}>{sz}</option>)}
                      </select>
                      <select value={it.color} onChange={(e) => setPoItem(i, 'color', e.target.value)} style={{ width: '100%', height: '40px', padding: '8px', border: '2px solid #14110D', background: '#fff', fontFamily: "'Space Mono', monospace", fontSize: '13px' }}>
                        <option value="" disabled>Warna</option>
                        {ap?.colors?.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                      </select>
                      <div style={{ display: 'flex', alignItems: 'center', border: '2px solid #14110D' }}>
                        <button onClick={() => poItemQtyDelta(i, -1)} style={{ background: 'none', border: 'none', cursor: 'pointer', width: '30px', height: '38px', fontSize: '16px', fontWeight: 700 }}>−</button>
                        <div style={{ width: '28px', textAlign: 'center', fontFamily: "'Space Mono', monospace", fontSize: '13px', fontWeight: 700 }}>{it.qty}</div>
                        <button onClick={() => poItemQtyDelta(i, 1)} style={{ background: 'none', border: 'none', cursor: 'pointer', width: '30px', height: '38px', fontSize: '16px', fontWeight: 700 }}>+</button>
                      </div>
                      {poItems.length > 1 ? (
                        <button onClick={() => removePoItem(i)} style={{ background: 'none', border: '2px solid #9a3a2a', color: '#9a3a2a', cursor: 'pointer', width: '30px', height: '38px', fontSize: '15px', lineHeight: 1 }}>×</button>
                      ) : <span style={{ width: '30px' }}></span>}
                    </div>
                  ))}

                  {poItems.length < 4 && (
                    <button onClick={addPoItem} style={{ marginTop: '10px', width: '100%', background: '#F2EEE4', color: '#14110D', border: '2px dashed #14110D', cursor: 'pointer', fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: '12px', letterSpacing: '0.04em', textTransform: 'uppercase', padding: '11px' }}>
                      + Tambah Produk (maks. 4)
                    </button>
                  )}

                  <div style={{ borderTop: '2px solid #14110D', marginTop: '12px', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '6px', fontFamily: "'Space Mono', monospace", fontSize: '13px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#6b655a' }}>Subtotal ({poTotalQty} unit)</span><span>{rp(poSubtotalN)}</span></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#6b655a' }}>Ongkir</span><span>{poShipN > 0 ? rp(poShipN) : '— belum dihitung'}</span></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "'Archivo'", fontWeight: 800, fontSize: '18px', borderTop: '2px solid #14110D', paddingTop: '8px', marginTop: '4px' }}><span>TOTAL</span><span style={{ fontFamily: "'Space Mono', monospace" }}>{rp(poTotalN)}</span></div>
                  </div>
                </div>

                {poModeGuest && <button onClick={submitPreorder} style={poSubmitStyle}>Kirim Pesanan Pre-Order</button>}
                {poModeRegister && <button onClick={poRegister} style={poSubmitStyle}>Daftar &amp; Kirim Pesanan</button>}
                {poSubmitHint && <div style={{ marginTop: '8px', fontFamily: "'Space Mono', monospace", fontSize: '11px', color: '#9a3a2a', textAlign: 'center' }}>{poSubmitHint}</div>}
                
                <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', color: '#6b655a', lineHeight: 1.6, margin: '12px 0 0', textAlign: 'center' }}>
                  Pembayaran penuh di muka. Produk diproduksi setelah sesi pre-order ditutup.
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
}
