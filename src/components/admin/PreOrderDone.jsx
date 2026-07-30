import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { rp, normStage } from '../../utils/helpers';

export default function PreOrderDone() {
  const { data, state, updateState, poBuyers, buyerItems, buyerQty } = useContext(AppContext);

  const poProducts = data.PRODUCTS.filter(p => p.type === 'preorder');
  const doneHistory = poProducts.flatMap(p =>
    (p.sessionHistory || []).map(sess => ({ prod: p, sess }))
  );

  const selPoId = state.poView;
  const selEntry = doneHistory.find(e => e.prod.id + '_' + e.sess.sessionName === selPoId);

  const openPO = (prodId, sessName) => {
    updateState({ poView: prodId + '_' + sessName });
    window.scrollTo(0, 0);
  };
  const closePO = () => updateState({ poView: null });

  if (selEntry) {
    const { prod, sess } = selEntry;
    const buyers = poBuyers(sess);
    const paidIn = buyers.filter(b => b.pay === 'Lunas').reduce((a, b) => a + (b.payAmount || sess.price * buyerQty(b)), 0);
    const totalUnits = buyers.reduce((a, b) => a + buyerQty(b), 0);
    const costPerUnit = (sess.costs.production || 0) + (sess.costs.kemasan || 0) + (sess.costs.stiker || 0);
    const grossRevenue = sess.price * totalUnits;
    const totalCost = costPerUnit * totalUnits;
    const grossProfit = grossRevenue - totalCost;

    return (
      <>
        <button onClick={closePO} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Space Mono', monospace", fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#6b655a', marginBottom: '16px' }}>
          ← Kembali ke Pre-Order Selesai
        </button>
        <div style={{ marginBottom: '28px' }}>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '12px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6b655a' }}>{sess.sessionName} — {prod.name}</div>
          <h1 style={{ fontFamily: "'Archivo'", fontWeight: 900, fontSize: '36px', margin: '4px 0 0', textTransform: 'uppercase' }}>Detail Sesi Selesai</h1>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '14px', marginBottom: '24px' }}>
          {[
            { label: 'Gross Revenue', v: rp(grossRevenue) },
            { label: 'Total Biaya', v: rp(totalCost) },
            { label: 'Gross Profit', v: rp(grossProfit) },
            { label: 'Dana Masuk', v: rp(paidIn) }
          ].map((k, i) => (
            <div key={i} style={{ border: '2px solid #14110D', background: '#fff', padding: '16px' }}>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6b655a' }}>{k.label}</div>
              <div style={{ fontFamily: "'Archivo'", fontWeight: 900, fontSize: '22px', marginTop: '6px' }}>{k.v}</div>
            </div>
          ))}
        </div>

        <div style={{ border: '2px solid #14110D', background: '#fff' }}>
          <div style={{ padding: '14px 20px', borderBottom: '2px solid #14110D', fontFamily: "'Archivo'", fontWeight: 800, fontSize: '16px', textTransform: 'uppercase' }}>Daftar Pemesan</div>
          {buyers.map((b, idx) => {
            const bItems = buyerItems(b);
            const bQty = buyerQty(b);
            return (
              <div key={idx} style={{ padding: '14px 20px', borderBottom: '1px solid #ddd5c4', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                <div>
                  <div style={{ fontFamily: "'Archivo'", fontWeight: 700, fontSize: '15px' }}>{b.name}</div>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', color: '#6b655a', marginTop: '3px' }}>
                    {bItems.map(it => `${it.size}/${it.color} ×${it.qty}`).join(' · ')}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', fontWeight: 700, padding: '5px 10px', background: b.pay === 'Lunas' ? '#14110D' : '#fff', color: b.pay === 'Lunas' ? '#F2EEE4' : '#14110D', border: '1px solid #14110D' }}>
                    {b.pay === 'Lunas' ? '✓ Lunas' : b.pay}
                  </span>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', fontWeight: 700, padding: '5px 10px', background: b.ship === 'Terkirim' ? '#14110D' : '#fff', color: b.ship === 'Terkirim' ? '#F2EEE4' : '#14110D', border: '1px solid #14110D' }}>
                    {b.ship === 'Terkirim' ? '✓ Terkirim' : b.ship || 'Proses'}
                  </span>
                </div>
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
      <h1 style={{ fontFamily: "'Archivo'", fontWeight: 900, fontSize: '40px', margin: '4px 0 28px', textTransform: 'uppercase' }}>Pre-Order Selesai</h1>

      {doneHistory.length === 0 && (
        <div style={{ textAlign: 'center', padding: '48px', border: '2px dashed #c9c1ad', fontFamily: "'Space Mono', monospace", fontSize: '13px', color: '#6b655a' }}>
          Belum ada sesi pre-order yang selesai.
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {doneHistory.map(({ prod, sess }, i) => {
          const buyers = poBuyers(sess);
          const totalUnits = buyers.reduce((a, b) => a + buyerQty(b), 0);
          const paidCount = buyers.filter(b => b.pay === 'Lunas').length;
          const pct = Math.min(100, Math.round((sess.committed || 0) / (sess.target || 1) * 100));
          return (
            <div key={i} style={{ border: '2px solid #14110D', background: '#fff', cursor: 'pointer' }} onClick={() => openPO(prod.id, sess.sessionName)}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: 0 }}>
                <div style={{ padding: '16px 20px' }}>
                  <div style={{ display: 'flex', gap: '10px', marginBottom: '4px', alignItems: 'center' }}>
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', background: '#14110D', color: '#F2EEE4', padding: '3px 8px' }}>SELESAI</span>
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6b655a' }}>{sess.sessionName}</span>
                  </div>
                  <div style={{ fontFamily: "'Archivo'", fontWeight: 800, fontSize: '18px', textTransform: 'uppercase', lineHeight: 1.05 }}>{prod.name}</div>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '12px', color: '#3d382f', marginTop: '6px' }}>
                    {sess.committed} terpesan · {paidCount}/{buyers.length} lunas · Buka {sess.opens} – Tutup {sess.closes}
                  </div>
                </div>
                <div style={{ padding: '16px 20px', borderLeft: '2px solid #14110D', display: 'flex', alignItems: 'center' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', color: '#6b655a', textTransform: 'uppercase' }}>Harga/Unit</div>
                    <div style={{ fontFamily: "'Archivo'", fontWeight: 800, fontSize: '18px', marginTop: '2px' }}>{rp(sess.price)}</div>
                  </div>
                </div>
                <div style={{ padding: '16px 20px', borderLeft: '2px solid #14110D', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f7f4ee' }}>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '12px', fontWeight: 700, color: '#14110D' }}>Lihat Detail →</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
