import React, { useContext } from 'react';
import { useStore } from '../../store';
import { rp } from '../../utils/helpers';
import useCountUp from '../../hooks/useCountUp';

function AnimatedNumber({ value, format, start }) {
  const animated = useCountUp(value, 1200, start);
  return <>{format ? format(animated) : animated}</>;
}

export default function Dashboard() {
  const { data, state, unitsOf } = useStore();

  const totalRevenueN = data.PRODUCTS.reduce((s, p) => s + p.price * unitsOf(p), 0);
  const totalCostN = data.PRODUCTS.reduce((s, p) => {
    const units = unitsOf(p);
    return s + ((p.costs.production || 0) + (p.costs.kemasan || 0) + (p.costs.stiker || 0)) * units;
  }, 0);
  const totalProfitN = totalRevenueN - totalCostN;
  const preorderProducts = data.PRODUCTS.filter(p => p.type === 'preorder');
  const preorderCommitted = preorderProducts.reduce((s, p) => s + unitsOf(p), 0);
  const totalOrdersN = data.orders.length + 18;

  const kpis = [
    { label: 'Pendapatan', value: totalRevenueN, format: (v) => rp(v), delta: '▲ Total tercatat', deltaColor: '#1f7a3d' },
    { label: 'Total Pesanan', value: totalOrdersN, format: (v) => String(v), delta: '▲ 6 minggu ini', deltaColor: '#1f7a3d' },
    { label: 'Pre-Order Terpesan', value: preorderCommitted, format: (v) => String(v) + ' unit', delta: `Lintas ${preorderProducts.length} drop`, deltaColor: '#6b655a' },
    { label: 'Profit Kotor', value: totalProfitN, format: (v) => rp(v), delta: 'Setelah biaya', deltaColor: '#6b655a' }
  ];

  const statusStyleOf = (st) => {
    if (st === 'Paid' || st === 'Shipped') return { background: '#14110D', color: '#F2EEE4' };
    if (st === 'Packing') return { background: '#F2C015', color: '#14110D' };
    return { background: '#fff', color: '#14110D', border: '1px solid #14110D' };
  };

  const orders = data.orders.map(o => ({ ...o, totalFmt: rp(o.total), statusStyle: statusStyleOf(o.status) }));

  const topSorted = [...data.PRODUCTS].sort((a, b) => unitsOf(b) - unitsOf(a)).slice(0, 4);
  const maxU = unitsOf(topSorted[0]) || 1;
  const topProducts = topSorted.map(p => ({ name: p.name, units: unitsOf(p), pct: Math.round((unitsOf(p) / maxU) * 100) }));

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .dash-kpi-grid { grid-template-columns: repeat(2,1fr) !important; gap: 10px !important; }
          .dash-kpi-box { min-width: 0 !important; padding: 14px !important; }
          .dash-kpi-value { font-size: 20px !important; word-break: break-word !important; }
          .dash-bottom-grid { grid-template-columns: 1fr !important; gap: 20px !important; }
          .dash-order-row { grid-template-columns: auto 1fr !important; row-gap: 6px !important; }
          .dash-order-total, .dash-order-status { grid-column: 2 / 3 !important; justify-self: start !important; }
        }
      `}</style>

      <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '12px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6b655a' }}>Ringkasan</div>
      <h1 style={{ fontFamily: "'Archivo'", fontWeight: 900, fontSize: '40px', margin: '4px 0 28px', textTransform: 'uppercase' }}>Dashboard</h1>

      <div className="dash-kpi-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '16px', marginBottom: '32px' }}>
        {kpis.map((k, idx) => (
          <div key={idx} className="dash-kpi-box" style={{ border: '2px solid #14110D', background: '#fff', padding: '20px', minWidth: 0 }}>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6b655a' }}>{k.label}</div>
            <div className="dash-kpi-value" style={{ fontFamily: "'Archivo'", fontWeight: 900, fontSize: '30px', marginTop: '8px', letterSpacing: '-0.01em' }}>
              <AnimatedNumber value={k.value} format={k.format} start={state.appReady} />
            </div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', color: k.deltaColor, marginTop: '4px' }}>{k.delta}</div>
          </div>
        ))}
      </div>

      <div className="dash-bottom-grid" style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '24px' }}>
        <div style={{ border: '2px solid #14110D', background: '#fff' }}>
          <div style={{ padding: '16px 20px', borderBottom: '2px solid #14110D', fontFamily: "'Archivo'", fontWeight: 800, fontSize: '16px', textTransform: 'uppercase' }}>Pesanan Terbaru</div>
          <div style={{ padding: '8px 20px' }}>
            {orders.map((o, idx) => (
              <div key={idx} className="dash-order-row" style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto auto', gap: '12px', alignItems: 'center', padding: '11px 0', borderBottom: '1px solid #ddd5c4' }}>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '12px', color: '#6b655a' }}>{o.id}</span>
                <span style={{ fontSize: '13px' }}>{o.customer} — {o.items}</span>
                <span className="dash-order-total" style={{ fontFamily: "'Space Mono', monospace", fontSize: '12px', fontWeight: 700 }}>{o.totalFmt}</span>
                <span className="dash-order-status" style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', letterSpacing: '0.06em', textTransform: 'uppercase', padding: '3px 8px', ...o.statusStyle }}>{o.status}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ border: '2px solid #14110D', background: '#fff' }}>
          <div style={{ padding: '16px 20px', borderBottom: '2px solid #14110D', fontFamily: "'Archivo'", fontWeight: 800, fontSize: '16px', textTransform: 'uppercase' }}>Produk Terlaris</div>
          <div style={{ padding: '8px 20px' }}>
            {topProducts.map((t, idx) => (
              <div key={idx} style={{ padding: '12px 0', borderBottom: '1px solid #ddd5c4' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 600 }}>
                  <span>{t.name}</span><span style={{ fontFamily: "'Space Mono', monospace" }}>{t.units} unit</span>
                </div>
                <div style={{ marginTop: '6px', height: '6px', background: '#e4ddcd', position: 'relative' }}>
                  <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${t.pct}%`, background: '#F2C015' }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
