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
      type: p.type === 'preorder' ? 'Pre-Order' : 'Ready',
      typeColor: p.type === 'preorder' ? '#9a7a10' : '#3d382f',
      units,
      price: p.price,
      revenue: p.price * units
    };
  });

  const totalUnits = salesRows.reduce((sum, row) => sum + row.units, 0);
  const totalRevenue = salesRows.reduce((sum, row) => sum + row.revenue, 0);

  const statusStyle = (st) => {
    const baseStyle = { fontFamily: "'Space Mono', monospace", fontSize: '10px', letterSpacing: '0.06em', textTransform: 'uppercase', padding: '3px 8px', display: 'inline-block' };
    if (st === 'Paid' || st === 'Shipped') return { ...baseStyle, background: '#14110D', color: '#F2EEE4' };
    if (st === 'Packing') return { ...baseStyle, background: '#F2C015', color: '#14110D' };
    return { ...baseStyle, background: '#fff', color: '#14110D', border: '1px solid #14110D' };
  };

  // FIX: kolom Terjual diberi lebar lebih (0.7fr) + paddingRight lebih besar (24px)
  // supaya ada jarak yang jelas dari kolom Harga di sebelahnya (yang juga rata kanan).
  const gridTable1 = '2fr 0.9fr 0.7fr 1fr 1fr';
  const gridTable2 = 'auto 1.6fr 1fr auto auto';

  const cell1 = { padding: '13px 12px 13px 0', borderBottom: '1px solid #ddd5c4', display: 'flex', alignItems: 'center' };
  const head1 = { padding: '12px 12px 12px 0', borderBottom: '1px solid #ddd5c4', fontFamily: "'Space Mono', monospace", fontSize: '10px', letterSpacing: '0.06em', textTransform: 'uppercase', color: '#6b655a', display: 'flex', alignItems: 'center' };
  // sel & header khusus kolom Terjual — jarak kanan diperbesar jadi 24px
  const cellTerjual = { ...cell1, padding: '13px 24px 13px 0' };
  const headTerjual = { ...head1, padding: '12px 24px 12px 0' };

  const cell2 = { padding: '13px 14px 13px 0', borderBottom: '1px solid #ddd5c4', display: 'flex', alignItems: 'center' };

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .sales-scroll { overflow-x: auto; -webkit-overflow-scrolling: touch; }
          .sales-inner-1 { min-width: 600px; }
          .sales-inner-2 { min-width: 620px; }
        }
      `}</style>

      <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '12px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6b655a' }}>Manajemen</div>
      <h1 style={{ fontFamily: "'Archivo'", fontWeight: 900, fontSize: '40px', margin: '4px 0 28px', textTransform: 'uppercase' }}>Penjualan &amp; Pesanan</h1>

      <div style={{ border: '2px solid #14110D', background: '#fff', marginBottom: '28px' }}>
        <div style={{ padding: '14px 20px', borderBottom: '2px solid #14110D', fontFamily: "'Archivo'", fontWeight: 800, fontSize: '16px', textTransform: 'uppercase' }}>
          Rekap per Produk
        </div>
        <div className="sales-scroll">
          <div className="sales-inner-1" style={{ padding: '0 20px', display: 'grid', gridTemplateColumns: gridTable1 }}>
            <div style={head1}>Produk</div>
            <div style={head1}>Tipe</div>
            <div style={{ ...headTerjual, justifyContent: 'flex-end' }}>Terjual</div>
            <div style={{ ...head1, justifyContent: 'flex-end' }}>Harga</div>
            <div style={{ ...head1, justifyContent: 'flex-end', paddingRight: 0 }}>Pendapatan</div>

            {salesRows.map((r, idx) => (
              <React.Fragment key={idx}>
                <div style={{ ...cell1, fontSize: '14px', fontWeight: 600 }}>{r.name}</div>
                <div style={{ ...cell1, fontFamily: "'Space Mono', monospace", fontSize: '11px', color: r.typeColor }}>{r.type}</div>
                <div style={{ ...cellTerjual, justifyContent: 'flex-end', fontFamily: "'Space Mono', monospace", fontSize: '13px' }}>{r.units}</div>
                <div style={{ ...cell1, justifyContent: 'flex-end', fontFamily: "'Space Mono', monospace", fontSize: '13px' }}>{rp(r.price)}</div>
                <div style={{ ...cell1, justifyContent: 'flex-end', fontFamily: "'Space Mono', monospace", fontSize: '13px', fontWeight: 700, paddingRight: 0 }}>{rp(r.revenue)}</div>
              </React.Fragment>
            ))}

            <div style={{ padding: '14px 12px 14px 0', fontFamily: "'Archivo'", textTransform: 'uppercase', fontWeight: 800 }}>Total</div>
            <div style={{ padding: '14px 12px 14px 0' }}></div>
            <div style={{ padding: '14px 24px 14px 0', textAlign: 'right', fontFamily: "'Space Mono', monospace", fontSize: '13px', fontWeight: 800 }}>{totalUnits}</div>
            <div style={{ padding: '14px 12px 14px 0' }}></div>
            <div style={{ padding: '14px 0', textAlign: 'right', fontFamily: "'Space Mono', monospace", fontSize: '14px', fontWeight: 800 }}>{rp(totalRevenue)}</div>
          </div>
        </div>
      </div>

      <div style={{ border: '2px solid #14110D', background: '#fff' }}>
        <div style={{ padding: '14px 20px', borderBottom: '2px solid #14110D', fontFamily: "'Archivo'", fontWeight: 800, fontSize: '16px', textTransform: 'uppercase' }}>
          Daftar Pesanan
        </div>
        <div className="sales-scroll">
          <div className="sales-inner-2" style={{ padding: '0 20px', display: 'grid', gridTemplateColumns: gridTable2 }}>
            {data.orders.map((o, idx) => (
              <React.Fragment key={idx}>
                <div style={{ ...cell2, fontFamily: "'Space Mono', monospace", fontSize: '12px', color: '#6b655a' }}>{o.id}</div>
                <div style={{ ...cell2, fontSize: '13px', flexDirection: 'column', alignItems: 'flex-start', gap: '2px' }}>
                  <span>{o.customer}</span>
                  <span style={{ color: '#6b655a', fontSize: '12px' }}>{o.items}</span>
                </div>
                <div style={{ ...cell2, fontFamily: "'Space Mono', monospace", fontSize: '11px', color: '#6b655a' }}>{o.date}</div>
                <div style={{ ...cell2, fontFamily: "'Space Mono', monospace", fontSize: '13px', fontWeight: 700 }}>{rp(o.total)}</div>
                <div style={{ ...cell2, paddingRight: 0 }}><span style={statusStyle(o.status)}>{o.status}</span></div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}