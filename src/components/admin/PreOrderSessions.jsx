import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { rp, normStage, stageOrder } from '../../utils/helpers';

const STAGES = [
  { id: 'open', label: 'Open' },
  { id: 'production', label: 'Produksi' },
  { id: 'shipping', label: 'Pengiriman' },
  { id: 'done', label: 'Selesai' }
];

function stageRank(s) {
  return stageOrder().indexOf(normStage(s));
}

function StageDots({ current }) {
  const rank = stageRank(current);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
      {STAGES.map((st, i) => {
        const active = i === rank;
        const done = i < rank;
        return (
          <React.Fragment key={st.id}>
            <div style={{
              width: active ? '14px' : '10px', height: active ? '14px' : '10px',
              borderRadius: '50%',
              background: done ? '#14110D' : (active ? '#F2C015' : '#ddd5c4'),
              border: active ? '2px solid #14110D' : 'none',
              transition: 'all 0.2s'
            }}></div>
            {i < STAGES.length - 1 && <div style={{ width: '24px', height: '2px', background: done ? '#14110D' : '#ddd5c4' }}></div>}
          </React.Fragment>
        );
      })}
    </div>
  );
}

export default function PreOrderSessions() {
  const { data, state, updateState, committedOf, poBuyers, buyerItems, buyerQty } = useContext(AppContext);

  const poProducts = data.PRODUCTS.filter(p => p.type === 'preorder');

  const selId = state.sessView;
  const selProd = poProducts.find(p => p.id === selId);

  const openSess = (id) => { updateState({ sessView: id }); window.scrollTo(0, 0); };
  const closeSess = () => { updateState({ sessView: null }); };

  const setStageReal = (id, stage) => {
    setData(prev => ({
      ...prev,
      PRODUCTS: prev.PRODUCTS.map(p => p.id === id ? { ...p, preorder: { ...p.preorder, status: stage } } : p)
    }));
  };

  const payBuyer = (prodId, buyerIdx, form) => {
    setData(prev => ({
      ...prev,
      PRODUCTS: prev.PRODUCTS.map(p => {
        if (p.id !== prodId) return p;
        const newBuyers = p.preorder.buyers.map((b, i) => i === buyerIdx ? { ...b, pay: 'Lunas', payAmount: form.amount, payMethod: form.method, payDate: form.date } : b);
        return { ...p, preorder: { ...p.preorder, buyers: newBuyers } };
      })
    }));
  };

  const shipBuyer = (prodId, buyerIdx, form) => {
    setData(prev => ({
      ...prev,
      PRODUCTS: prev.PRODUCTS.map(p => {
        if (p.id !== prodId) return p;
        const newBuyers = p.preorder.buyers.map((b, i) => i === buyerIdx ? { ...b, ship: 'Terkirim', courier: form.courier, resi: form.resi } : b);
        return { ...p, preorder: { ...p.preorder, buyers: newBuyers } };
      })
    }));
  };

  if (selProd) {
    const sess = selProd.preorder;
    const buyers = poBuyers(sess);
    const committed = committedOf(selProd);
    const pct = Math.min(100, Math.round((committed / (sess.target || 1)) * 100));
    const paidCount = buyers.filter(b => b.pay === 'Lunas').length;
    const shipCount = buyers.filter(b => b.ship === 'Terkirim').length;

    return (
      <>
        <button onClick={closeSess} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Space Mono', monospace", fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#6b655a', marginBottom: '16px' }}>
          ← Kembali ke Sesi
        </button>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '28px' }}>
          <div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '12px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6b655a' }}>{sess.sessionName}</div>
            <h1 style={{ fontFamily: "'Archivo'", fontWeight: 900, fontSize: '36px', margin: '4px 0 0', textTransform: 'uppercase' }}>{selProd.name}</h1>
          </div>
          <StageDots current={sess.status} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '14px', marginBottom: '24px' }}>
          {[{ label: 'Target', v: sess.target + ' unit' }, { label: 'Terpesan', v: committed + ' unit' }, { label: 'Bayar Lunas', v: paidCount + ' / ' + buyers.length }, { label: 'Terkirim', v: shipCount + ' / ' + buyers.length }].map((k, i) => (
            <div key={i} style={{ border: '2px solid #14110D', background: '#fff', padding: '16px' }}>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6b655a' }}>{k.label}</div>
              <div style={{ fontFamily: "'Archivo'", fontWeight: 900, fontSize: '24px', marginTop: '6px' }}>{k.v}</div>
            </div>
          ))}
        </div>

        <div style={{ marginBottom: '20px', height: '10px', background: '#ddd5c4', position: 'relative', border: '1px solid #c9c1ad' }}>
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: pct + '%', background: '#F2C015' }}></div>
        </div>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', flexWrap: 'wrap' }}>
          {STAGES.map(st => (
            <button key={st.id} onClick={() => setStageReal(selProd.id, st.id)} style={{ background: normStage(sess.status) === st.id ? '#14110D' : '#fff', color: normStage(sess.status) === st.id ? '#F2EEE4' : '#14110D', border: '2px solid #14110D', cursor: 'pointer', fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: '11px', letterSpacing: '0.04em', textTransform: 'uppercase', padding: '10px 14px' }}>
              {st.label}
            </button>
          ))}
        </div>

        <div style={{ border: '2px solid #14110D', background: '#fff' }}>
          <div style={{ padding: '14px 20px', borderBottom: '2px solid #14110D', fontFamily: "'Archivo'", fontWeight: 800, fontSize: '16px', textTransform: 'uppercase' }}>Daftar Pemesan</div>
          {buyers.map((b, idx) => {
            const bItems = buyerItems(b);
            const bQty = buyerQty(b);
            return (
              <div key={idx} style={{ padding: '16px 20px', borderBottom: '1px solid #ddd5c4' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                  <div>
                    <div style={{ fontFamily: "'Archivo'", fontWeight: 700, fontSize: '15px' }}>{b.name}</div>
                    <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', color: '#6b655a', marginTop: '3px' }}>
                      {bItems.map((it, ii) => `${it.size}/${it.color} ×${it.qty}`).join(' · ')} · {bQty} unit
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', fontWeight: 700, padding: '5px 10px', background: b.pay === 'Lunas' ? '#14110D' : '#fff', color: b.pay === 'Lunas' ? '#F2EEE4' : '#14110D', border: '1px solid #14110D' }}>
                      {b.pay === 'Lunas' ? '✓ Lunas' : 'Belum Lunas'}
                    </span>
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', fontWeight: 700, padding: '5px 10px', background: b.ship === 'Terkirim' ? '#14110D' : '#fff', color: b.ship === 'Terkirim' ? '#F2EEE4' : '#14110D', border: '1px solid #14110D' }}>
                      {b.ship === 'Terkirim' ? '✓ Terkirim' : 'Belum Kirim'}
                    </span>
                    {b.pay !== 'Lunas' && (
                      <button onClick={() => {
                        const form = { amount: sess.price * bQty, method: 'Transfer BCA', date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) };
                        payBuyer(selProd.id, idx, form);
                      }} style={{ background: '#F2C015', color: '#14110D', border: 'none', cursor: 'pointer', fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: '11px', textTransform: 'uppercase', padding: '5px 12px' }}>
                        ✓ Tandai Lunas
                      </button>
                    )}
                    {b.ship !== 'Terkirim' && (
                      <button onClick={() => {
                        const form = { courier: 'JNE', resi: 'JNE' + Math.floor(Math.random() * 1000000000), proof: '' };
                        shipBuyer(selProd.id, idx, form);
                      }} style={{ background: '#14110D', color: '#F2EEE4', border: 'none', cursor: 'pointer', fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: '11px', textTransform: 'uppercase', padding: '5px 12px' }}>
                        Kirim →
                      </button>
                    )}
                  </div>
                </div>
                {b.pay === 'Lunas' && (
                  <div style={{ marginTop: '8px', fontFamily: "'Space Mono', monospace", fontSize: '11px', color: '#6b655a' }}>
                    {rp(b.payAmount || 0)} · {b.payMethod || '-'} · {b.payDate || '-'}
                  </div>
                )}
                {b.ship === 'Terkirim' && b.resi && (
                  <div style={{ marginTop: '4px', fontFamily: "'Space Mono', monospace", fontSize: '11px', color: '#6b655a' }}>
                    Resi: {b.courier} {b.resi}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </>
    );
  }

  return (
    <>
      <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '12px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6b655a' }}>Manajemen</div>
      <h1 style={{ fontFamily: "'Archivo'", fontWeight: 900, fontSize: '40px', margin: '4px 0 28px', textTransform: 'uppercase' }}>Sesi Pre-Order Aktif</h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {poProducts.map(p => {
          const sess = p.preorder;
          const committed = committedOf(p);
          const pct = Math.min(100, Math.round((committed / (sess.target || 1)) * 100));
          return (
            <div key={p.id} style={{ border: '2px solid #14110D', background: '#fff', cursor: 'pointer' }} onClick={() => openSess(p.id)}>
              <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr auto', gap: 0 }}>
                <div style={{ background: p.garment, borderRight: '2px solid #14110D', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100px' }}>
                  {p.print === 'logo' && <img src="/assets/logo.png" style={{ width: '60%' }} alt="" />}
                  {p.print === 'text' && <div style={{ color: '#F2C015', fontFamily: "'Archivo'", fontWeight: 900, fontSize: '10px', lineHeight: 0.9, textAlign: 'center', textTransform: 'uppercase' }}>AC<br/>SYND</div>}
                </div>
                <div style={{ padding: '16px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6b655a' }}>{sess.sessionName}</span>
                    <StageDots current={sess.status} />
                  </div>
                  <div style={{ fontFamily: "'Archivo'", fontWeight: 800, fontSize: '18px', textTransform: 'uppercase', lineHeight: 1.05 }}>{p.name}</div>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '12px', color: '#3d382f', marginTop: '6px' }}>
                    {committed} / {sess.target} unit · {pct}% terpesan · Tutup {sess.closes} · ETA {sess.eta}
                  </div>
                  <div style={{ marginTop: '10px', height: '6px', background: '#e4ddcd', position: 'relative' }}>
                    <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: pct + '%', background: '#14110D' }}></div>
                  </div>
                </div>
                <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderLeft: '2px solid #14110D' }}>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '13px', fontWeight: 700 }}>{rp(p.price)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
