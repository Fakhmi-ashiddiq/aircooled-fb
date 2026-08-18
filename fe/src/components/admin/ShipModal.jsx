import React, { useContext } from 'react';
import { useStore } from '../../store';

export default function ShipModal() {
  const { state, updateState, findSession, saveBuyerShipping } = useStore();

  const m = state.shipModal;
  if (!m) return null;
  const r = findSession(m.pid, m.sname);
  const b = r?.sess?.buyers?.[m.idx];
  if (!b) return null;

  const its = b.items && b.items.length ? b.items : [{ size: b.size, color: b.color, qty: b.qty || 1 }];
  const variant = its.length > 1 ? its.map((it) => `${it.qty || 1}Ã— ${it.size} ${it.color}`).join(', ') : `${its[0].size} Â· ${its[0].color}`;

  const close = () => updateState({ shipModal: null });
  const setField = (k) => (ev) => updateState({ shipForm: { ...state.shipForm, [k]: ev.target.value } });

  const onProof = (ev) => {
    const f = ev.target.files?.[0];
    if (f) updateState({ shipForm: { ...state.shipForm, proof: f.name } });
  };

  const save = () => {
    saveBuyerShipping(m.pid, m.sname, m.idx, state.shipForm);
    close();
  };

  const inputStyle = { width: '100%', padding: '12px', border: '2px solid #14110D', background: '#fff', fontFamily: "'Space Mono', monospace", fontSize: '14px' };
  const labelStyle = { fontFamily: "'Space Mono', monospace", fontSize: '10px', letterSpacing: '0.06em', textTransform: 'uppercase', color: '#6b655a' };

  return (
    <>
      <style>{`
        @media (max-width: 480px) {
          .shipmodal-box { width: 94vw !important; }
          .shipmodal-body { padding: 18px !important; }
          .shipmodal-input-grid { grid-template-columns: 1fr !important; }
          .shipmodal-input-grid > * { grid-column: 1 / -1 !important; }
        }
      `}</style>

      <div onClick={close} style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(20,17,13,0.62)' }} />
      <div
        className="shipmodal-box"
        style={{ position: 'fixed', zIndex: 101, top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '440px', maxWidth: '94vw', maxHeight: '90vh', overflowY: 'auto', background: '#F2EEE4', border: '2px solid #14110D' }}
      >
        <div style={{ padding: '18px 24px', borderBottom: '2px solid #14110D', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontFamily: "'Archivo'", fontWeight: 900, fontSize: '20px', textTransform: 'uppercase', lineHeight: 1 }}>Pengiriman</div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', color: '#6b655a', marginTop: '4px' }}>{b.name} Â· {variant}</div>
          </div>
          <button onClick={close} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '24px', lineHeight: 1 }}>Ã—</button>
        </div>

        <div className="shipmodal-body" style={{ padding: '22px 24px' }}>
          <div className="shipmodal-input-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={labelStyle}>Kurir</label>
              <select value={state.shipForm.courier} onChange={setField('courier')} style={{ ...inputStyle, marginTop: '5px' }}>
                {['JNE', 'J&T', 'SiCepat', 'AnterAja', 'Pos Indonesia', 'Gojek', 'Grab'].map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>No. Resi</label>
              <input value={state.shipForm.resi} onChange={setField('resi')} placeholder="mis. JNE0012345" style={{ ...inputStyle, marginTop: '5px' }} />
            </div>
            <div style={{ gridColumn: '1/3' }}>
              <label style={labelStyle}>Real Ongkos Kirim (Rp) â€” sesuai resi</label>
              <input type="number" value={state.shipForm.cost} onChange={setField('cost')} placeholder="mis. 22000" style={{ ...inputStyle, marginTop: '5px' }} />
            </div>
            <div style={{ gridColumn: '1/3' }}>
              <label style={labelStyle}>Bukti Pengiriman</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '5px', flexWrap: 'wrap' }}>
                <label style={{ cursor: 'pointer', background: '#14110D', color: '#F2EEE4', fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: '11px', letterSpacing: '0.04em', textTransform: 'uppercase', padding: '11px 16px', whiteSpace: 'nowrap' }}>
                  Upload File
                  <input type="file" accept="image/*" onChange={onProof} style={{ display: 'none' }} />
                </label>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '12px', color: '#6b655a' }}>{state.shipForm.proof || '(belum ada file)'}</span>
              </div>
            </div>
          </div>
          <button onClick={save} style={{ marginTop: '22px', width: '100%', background: '#F2C015', color: '#14110D', border: 'none', cursor: 'pointer', fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: '13px', letterSpacing: '0.05em', textTransform: 'uppercase', padding: '15px' }}>
            Tandai Terkirim
          </button>
        </div>
      </div>
    </>
  );
}

