import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { rp } from '../../utils/helpers';

export default function Finance() {
  const { data, unitsOf, committedOf, poBuyers, buyerQty } = useContext(AppContext);

  const products = data.PRODUCTS;

  const computeProfitRows = () => {
    return products.map(p => {
      const units = unitsOf(p);
      const gross = p.price * units;
      const costPerUnit = (p.costs.production || 0) + (p.costs.kemasan || 0) + (p.costs.stiker || 0);
      const totalCost = costPerUnit * units;
      const profit = gross - totalCost;

      let splits = [];
      const sess = p.type === 'preorder' ? p.preorder : (p.productionSessions && p.productionSessions[0]);
      if (sess && sess.split) {
        const s = sess.split;
        const base = (s.base === 'gross') ? gross : profit;
        const roles = data.roles;
        const getRoleName = (id) => (roles.find(r => r.id === id) || {}).name || id || '-';
        splits = [
          { role: getRoleName(s.mediaRole), label: 'Media', pct: s.mediaPct || 0, amount: Math.round(base * (s.mediaPct || 0) / 100) },
          { role: getRoleName(s.desainRole), label: 'Desain', pct: s.desainPct || 0, amount: Math.round(base * (s.desainPct || 0) / 100) },
          { role: getRoleName(s.prodRole), label: 'Produksi', pct: s.prodPct || 0, amount: Math.round(base * (s.prodPct || 0) / 100) },
          { role: 'Store', label: 'Store', pct: s.storePct || 0, amount: Math.round(base * (s.storePct || 0) / 100) }
        ].filter(r => r.pct > 0);
      }

      return { id: p.id, name: p.name, cat: p.cat, type: p.type, units, gross, totalCost, profit, splits };
    });
  };

  const rows = computeProfitRows();
  const totalGross = rows.reduce((a, r) => a + r.gross, 0);
  const totalCost = rows.reduce((a, r) => a + r.totalCost, 0);
  const totalProfit = rows.reduce((a, r) => a + r.profit, 0);

  return (
    <>
      <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '12px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6b655a' }}>Laporan</div>
      <h1 style={{ fontFamily: "'Archivo'", fontWeight: 900, fontSize: '40px', margin: '4px 0 28px', textTransform: 'uppercase' }}>Keuangan & Profit</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px', marginBottom: '32px' }}>
        {[
          { label: 'Total Gross Revenue', v: rp(totalGross) },
          { label: 'Total Biaya', v: rp(totalCost) },
          { label: 'Total Profit Kotor', v: rp(totalProfit) }
        ].map((k, i) => (
          <div key={i} style={{ border: '2px solid #14110D', background: '#fff', padding: '20px' }}>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6b655a' }}>{k.label}</div>
            <div style={{ fontFamily: "'Archivo'", fontWeight: 900, fontSize: '28px', marginTop: '8px' }}>{k.v}</div>
          </div>
        ))}
      </div>

      <div style={{ border: '2px solid #14110D', background: '#fff' }}>
        <div style={{ padding: '14px 20px', borderBottom: '2px solid #14110D', fontFamily: "'Archivo'", fontWeight: 800, fontSize: '16px', textTransform: 'uppercase' }}>Rincian per Produk</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr auto auto auto auto', gap: 0, padding: '10px 20px', background: '#f7f4ee', fontFamily: "'Space Mono', monospace", fontSize: '10px', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#6b655a', borderBottom: '1px solid #ddd5c4' }}>
          <span>Produk</span>
          <span style={{ textAlign: 'right', paddingRight: '16px' }}>Unit</span>
          <span style={{ textAlign: 'right', paddingRight: '16px' }}>Gross</span>
          <span style={{ textAlign: 'right', paddingRight: '16px' }}>Biaya</span>
          <span style={{ textAlign: 'right' }}>Profit</span>
        </div>
        {rows.map((r, i) => (
          <React.Fragment key={r.id}>
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr auto auto auto auto', gap: 0, padding: '14px 20px', borderBottom: r.splits.length ? 'none' : '1px solid #ddd5c4', alignItems: 'center' }}>
              <div>
                <div style={{ fontFamily: "'Archivo'", fontWeight: 700, fontSize: '14px', textTransform: 'uppercase' }}>{r.name}</div>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', color: '#6b655a', marginTop: '2px' }}>{r.cat} · {r.type === 'preorder' ? 'Pre-Order' : 'Ready Stock'}</div>
              </div>
              <span style={{ textAlign: 'right', paddingRight: '16px', fontFamily: "'Space Mono', monospace", fontSize: '13px' }}>{r.units}</span>
              <span style={{ textAlign: 'right', paddingRight: '16px', fontFamily: "'Space Mono', monospace", fontSize: '13px' }}>{rp(r.gross)}</span>
              <span style={{ textAlign: 'right', paddingRight: '16px', fontFamily: "'Space Mono', monospace", fontSize: '13px' }}>{rp(r.totalCost)}</span>
              <span style={{ textAlign: 'right', fontFamily: "'Space Mono', monospace", fontSize: '13px', fontWeight: 700, color: r.profit >= 0 ? '#1f7a3d' : '#9a3a2a' }}>{rp(r.profit)}</span>
            </div>
            {r.splits.length > 0 && (
              <div style={{ padding: '8px 20px 14px 36px', borderBottom: '1px solid #ddd5c4', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                {r.splits.map((sp, si) => (
                  <div key={si} style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', background: '#f7f4ee', border: '1px solid #ddd5c4', padding: '6px 12px' }}>
                    <span style={{ color: '#6b655a' }}>{sp.label} ({sp.pct}%) — {sp.role}: </span>
                    <span style={{ fontWeight: 700 }}>{rp(sp.amount)}</span>
                  </div>
                ))}
              </div>
            )}
          </React.Fragment>
        ))}
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr auto auto auto auto', gap: 0, padding: '14px 20px', background: '#F2C015', borderTop: '2px solid #14110D' }}>
          <span style={{ fontFamily: "'Archivo'", fontWeight: 800, fontSize: '15px', textTransform: 'uppercase' }}>Total</span>
          <span style={{ textAlign: 'right', paddingRight: '16px' }}></span>
          <span style={{ textAlign: 'right', paddingRight: '16px', fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: '14px' }}>{rp(totalGross)}</span>
          <span style={{ textAlign: 'right', paddingRight: '16px', fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: '14px' }}>{rp(totalCost)}</span>
          <span style={{ textAlign: 'right', fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: '14px' }}>{rp(totalProfit)}</span>
        </div>
      </div>
    </>
  );
}
