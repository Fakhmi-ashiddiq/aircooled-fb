import React, { useContext } from 'react';
import { useStore } from '../../store';
import { rp } from '../../utils/helpers';

export default function PayModal() {
  const { state, updateState, findSession, buyerItems, buyerQty, saveBuyerPayment } = useStore();

  const m = state.payModal;
  if (!m) return null;
  const r = findSession(m.pid, m.sname);
  const b = r?.sess?.buyers?.[m.idx];
  if (!b) return null;

  const price = r.sess.price || 0;
  const items = buyerItems(b);
  const q = buyerQty(b);
  const subtotal = price * q;
  const shipCost = 25000;
  const grand = subtotal + shipCost;

  const close = () => updateState({ payModal: null });
  const setField = (k) => (ev) => updateState({ payForm: { ...state.payForm, [k]: ev.target.value } });

  const save = (status) => {
    saveBuyerPayment(m.pid, m.sname, m.idx, status, state.payForm);
    close();
  };

  const onProof = (ev) => {
    const f = ev.target.files?.[0];
    if (f) updateState({ payForm: { ...state.payForm, proof: f.name } });
  };

  const inputStyle = { width: '100%', padding: '12px', border: '2px solid #14110D', background: '#fff', fontFamily: "'Space Mono', monospace", fontSize: '14px' };
  const labelStyle = { fontFamily: "'Space Mono', monospace", fontSize: '10px', letterSpacing: '0.06em', textTransform: 'uppercase', color: '#6b655a' };

  return (
    <>
      <style>{`
        @media (max-width: 480px) {
          .paymodal-box { width: 94vw !important; }
          .paymodal-body { padding: 18px !important; }
          .paymodal-input-grid { grid-template-columns: 1fr !important; }
          .paymodal-input-grid > * { grid-column: 1 / -1 !important; }
          .paymodal-status-row { flex-wrap: wrap !important; }
          .paymodal-status-row > button { flex: 1 1 100% !important; min-width: 0 !important; }
        }
      `}</style>

      <div onClick={close} style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(20,17,13,0.62)' }} />
      <div
        className="paymodal-box"
        style={{ position: 'fixed', zIndex: 101, top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '480px', maxWidth: '94vw', maxHeight: '90vh', overflowY: 'auto', background: '#F2EEE4', border: '2px solid #14110D' }}
      >
        <div style={{ padding: '18px 24px', borderBottom: '2px solid #14110D', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontFamily: "'Archivo'", fontWeight: 900, fontSize: '20px', textTransform: 'uppercase', lineHeight: 1 }}>Pembayaran</div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', color: '#6b655a', marginTop: '4px' }}>{b.name}</div>
          </div>
          <button onClick={close} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '24px', lineHeight: 1 }}>×</button>
        </div>

        <div className="paymodal-body" style={{ padding: '22px 24px' }}>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6b655a', marginBottom: '10px' }}>Detail Pesanan</div>
          <div style={{ border: '2px solid #14110D', background: '#fff' }}>
            {items.map((it, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 14px', borderBottom: '1px solid #ddd5c4' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '13px', fontWeight: 700 }}>{it.qty || 1} ×</span>
                  <span style={{ fontSize: '13px' }}>{it.size} · {it.color}</span>
                </div>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '13px' }}>{rp(price * (it.qty || 1))}</span>
              </div>
            ))}
            <div style={{ padding: '10px 14px', display: 'flex', justifyContent: 'space-between', fontFamily: "'Space Mono', monospace", fontSize: '12px', color: '#6b655a' }}>
              <span>Subtotal Produk</span><span>{rp(subtotal)}</span>
            </div>
            <div style={{ padding: '0 14px 10px', display: 'flex', justifyContent: 'space-between', fontFamily: "'Space Mono', monospace", fontSize: '12px', color: '#6b655a' }}>
              <span>Ongkos Kirim</span><span>{rp(shipCost)}</span>
            </div>
            <div style={{ padding: '12px 14px', display: 'flex', justifyContent: 'space-between', borderTop: '2px solid #14110D', fontFamily: "'Archivo'", fontWeight: 800, fontSize: '16px', textTransform: 'uppercase' }}>
              <span>Grand Total</span><span style={{ fontFamily: "'Space Mono', monospace" }}>{rp(grand)}</span>
            </div>
          </div>

          <div style={{ ...labelStyle, margin: '20px 0 10px' }}>Input Pembayaran</div>
          <div className="paymodal-input-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={{ gridColumn: '1/3' }}>
              <label style={labelStyle}>Total Bayar (Rp)</label>
              <input type="number" value={state.payForm.amount} onChange={setField('amount')} placeholder="0" style={{ ...inputStyle, marginTop: '5px' }} />
            </div>
            <div>
              <label style={labelStyle}>Metode</label>
              <select value={state.payForm.method} onChange={setField('method')} style={{ ...inputStyle, marginTop: '5px' }}>
                {['Transfer BCA', 'Transfer Mandiri', 'Transfer BNI', 'QRIS', 'GoPay', 'OVO', 'Dana', 'COD'].map((m2) => <option key={m2} value={m2}>{m2}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Tanggal Bayar</label>
              <input value={state.payForm.date} onChange={setField('date')} placeholder="mis. 18 Jun 2026" style={{ ...inputStyle, marginTop: '5px' }} />
            </div>
            <div style={{ gridColumn: '1/3' }}>
              <label style={labelStyle}>Bukti Bayar</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '5px', flexWrap: 'wrap' }}>
                <label style={{ cursor: 'pointer', background: '#14110D', color: '#F2EEE4', fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: '11px', letterSpacing: '0.04em', textTransform: 'uppercase', padding: '11px 16px', whiteSpace: 'nowrap' }}>
                  Upload File
                  <input type="file" accept="image/*" onChange={onProof} style={{ display: 'none' }} />
                </label>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '12px', color: '#6b655a' }}>{state.payForm.proof || '(belum ada file)'}</span>
              </div>
            </div>
          </div>

          <div style={{ ...labelStyle, margin: '22px 0 10px' }}>Ubah Status</div>
          <div className="paymodal-status-row" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button onClick={() => save('Lunas')} style={{ flex: 1, minWidth: '130px', background: '#14110D', color: '#F2EEE4', border: 'none', cursor: 'pointer', fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: '12px', letterSpacing: '0.05em', textTransform: 'uppercase', padding: '14px' }}>
              Lunas
            </button>
            <button onClick={() => save('Belum Lunas')} style={{ flex: 1, minWidth: '130px', background: '#fff', color: '#14110D', border: '2px solid #14110D', cursor: 'pointer', fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: '12px', letterSpacing: '0.05em', textTransform: 'uppercase', padding: '12px' }}>
              Belum Lunas
            </button>
            <button onClick={() => save('Batal')} style={{ flex: 1, minWidth: '100px', background: '#fff', color: '#9a3a2a', border: '2px solid #9a3a2a', cursor: 'pointer', fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: '12px', letterSpacing: '0.05em', textTransform: 'uppercase', padding: '12px' }}>
              Batal
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
