import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { rp } from '../../utils/helpers';

export default function Sales() {
  const { data, unitsOf } = useContext(AppContext);

  const salesRows = data.PRODUCTS.map(p => {
    const units = unitsOf ? unitsOf(p) : 0;
    return {
      id: p.id,
      name: p.name,
      type: p.type === 'preorder' ? 'Pre-Order' : 'Ready Stock',
      typeBadgeBg: p.type === 'preorder' ? '#F2C015' : '#14110D',
      typeBadgeFg: p.type === 'preorder' ? '#14110D' : '#F2EEE4',
      units,
      price: p.price,
      revenue: p.price * units
    };
  });

  const totalUnits = salesRows.reduce((sum, row) => sum + row.units, 0);
  const totalRevenue = salesRows.reduce((sum, row) => sum + row.revenue, 0);

  const statusStyle = (st) => {
    const baseStyle = { fontFamily: "'Space Mono', monospace", fontSize: '10px', letterSpacing: '0.06em', textTransform: 'uppercase', padding: '5px 10px', display: 'inline-block', fontWeight: 700 };
    if (st === 'Paid' || st === 'Shipped') return { ...baseStyle, background: '#14110D', color: '#F2EEE4' };
    if (st === 'Packing') return { ...baseStyle, background: '#F2C015', color: '#14110D' };
    return { ...baseStyle, background: '#fff', color: '#14110D', border: '2px solid #14110D' };
  };

  const typeBadge = (type) => ({
    background: type === 'preorder' ? '#F2C015' : '#14110D',
    color: type === 'preorder' ? '#14110D' : '#F2EEE4',
    fontFamily: "'Space Mono', monospace",
    fontSize: '10px',
    fontWeight: 700,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    padding: '4px 8px',
    display: 'inline-block'
  });

  const gridTable1 = '2fr 120px 140px 100px 160px';
  const gridTable2 = '120px 1.5fr 1.5fr 140px 80px 120px';

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .sales-scroll { overflow-x: auto; -webkit-overflow-scrolling: touch; }
          .sales-inner-1 { min-width: 640px; }
          .sales-inner-2 { min-width: 780px; }
        }
      `}</style>

      <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '12px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6b655a' }}>Manajemen</div>
      <h1 style={{ fontFamily: "'Archivo'", fontWeight: 900, fontSize: '40px', margin: '4px 0 28px', textTransform: 'uppercase' }}>Penjualan & Pesanan</h1>

      <div style={{ border: '2px solid #14110D', background: '#fff', marginBottom: '32px' }}>
        <div style={{ padding: '16px 20px', borderBottom: '2px solid #14110D', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontFamily: "'Archivo'", fontWeight: 800, fontSize: '16px', textTransform: 'uppercase' }}>
            Rekap per Produk
          </div>
        </div>

        <div className="sales-scroll">
          <div className="sales-inner-1">
            <div style={{ display: 'grid', gridTemplateColumns: gridTable1, gap: '16px', padding: '12px 20px', background: '#14110D', fontFamily: "'Space Mono', monospace", fontSize: '10px', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#F2EEE4', alignItems: 'center' }}>
              <span>Produk</span>
              <span style={{ textAlign: 'center' }}>Tipe</span>
              <span style={{ textAlign: 'right' }}>Harga</span>
              <span style={{ textAlign: 'right' }}>Terjual</span>
              <span style={{ textAlign: 'right' }}>Pendapatan</span>
            </div>

            {salesRows.map((r, idx) => (
              <div key={idx} style={{ display: 'grid', gridTemplateColumns: gridTable1, gap: '16px', padding: '14px 20px', borderBottom: '1px solid #ddd5c4', alignItems: 'center' }}>
                <div style={{ fontFamily: "'Archivo'", fontWeight: 700, fontSize: '14px', textTransform: 'uppercase', lineHeight: 1.2 }}>{r.name}</div>
                <div style={{ textAlign: 'center' }}>
                  <span style={{ background: r.typeBadgeBg, color: r.typeBadgeFg, fontFamily: "'Space Mono', monospace", fontSize: '10px', fontWeight: 700, padding: '4px 10px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    {r.type}
                  </span>
                </div>
                <div style={{ textAlign: 'right', fontFamily: "'Space Mono', monospace", fontSize: '13px' }}>{rp(r.price)}</div>
                <div style={{ textAlign: 'right', fontFamily: "'Space Mono', monospace", fontSize: '13px', fontWeight: 700 }}>{r.units}</div>
                <div style={{ textAlign: 'right', fontFamily: "'Space Mono', monospace", fontSize: '13px', fontWeight: 700, color: '#1f7a3d' }}>{rp(r.revenue)}</div>
              </div>
            ))}

            <div style={{ display: 'grid', gridTemplateColumns: gridTable1, gap: '16px', padding: '16px 20px', background: '#f7f4ee', borderTop: '2px solid #14110D', alignItems: 'center' }}>
              <div style={{ fontFamily: "'Archivo'", fontWeight: 900, fontSize: '16px', textTransform: 'uppercase' }}>TOTAL</div>
              <div></div>
              <div></div>
              <div style={{ textAlign: 'right', fontFamily: "'Space Mono', monospace", fontSize: '14px', fontWeight: 700 }}>{totalUnits} unit</div>
              <div style={{ textAlign: 'right', fontFamily: "'Space Mono', monospace", fontSize: '15px', fontWeight: 900, color: '#1f7a3d' }}>{rp(totalRevenue)}</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ border: '2px solid #14110D', background: '#fff' }}>
        <div style={{ padding: '16px 20px', borderBottom: '2px solid #14110D', fontFamily: "'Archivo'", fontWeight: 800, fontSize: '16px', textTransform: 'uppercase' }}>
          Semua Pesanan
        </div>

        <div className="sales-scroll">
          <div className="sales-inner-2">
            <div style={{ display: 'grid', gridTemplateColumns: gridTable2, gap: '16px', padding: '12px 20px', background: '#14110D', fontFamily: "'Space Mono', monospace", fontSize: '10px', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#F2EEE4', alignItems: 'center' }}>
              <span>No. Pesanan</span>
              <span>Pelanggan</span>
              <span>Items</span>
              <span style={{ textAlign: 'right' }}>Total</span>
              <span style={{ textAlign: 'center' }}>Tipe</span>
              <span style={{ textAlign: 'right' }}>Status</span>
            </div>

            {data.orders.map((o, idx) => (
              <div key={idx} style={{ display: 'grid', gridTemplateColumns: gridTable2, gap: '16px', padding: '14px 20px', borderBottom: '1px solid #ddd5c4', alignItems: 'center' }}>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '12px', fontWeight: 700 }}>{o.id}</span>
                <div>
                  <div style={{ fontFamily: "'Archivo'", fontWeight: 600, fontSize: '14px' }}>{o.customer}</div>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', color: '#6b655a', marginTop: '3px' }}>{o.date} Jun 2026</div>
                </div>
                <span style={{ fontSize: '13px', color: '#3d382f', lineHeight: 1.4 }}>{o.items}</span>
                <span style={{ textAlign: 'right', fontFamily: "'Space Mono', monospace", fontSize: '13px', fontWeight: 700 }}>{rp(o.total)}</span>
                <div style={{ textAlign: 'center' }}>
                  <span style={typeBadge(o.type)}>{o.type === 'preorder' ? 'PO' : 'RS'}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={statusStyle(o.status)}>{o.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}