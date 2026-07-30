import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { rp } from '../../utils/helpers';

export default function Sales() {
  const { data } = useContext(AppContext);

  const statusStyle = (st) => {
    if (st === 'Paid' || st === 'Shipped') return { background: '#14110D', color: '#F2EEE4', fontFamily: "'Space Mono', monospace", fontSize: '10px', letterSpacing: '0.06em', textTransform: 'uppercase', padding: '4px 8px', display: 'inline-block' };
    if (st === 'Packing') return { background: '#F2C015', color: '#14110D', fontFamily: "'Space Mono', monospace", fontSize: '10px', letterSpacing: '0.06em', textTransform: 'uppercase', padding: '4px 8px', display: 'inline-block' };
    return { background: '#fff', color: '#14110D', border: '1px solid #14110D', fontFamily: "'Space Mono', monospace", fontSize: '10px', letterSpacing: '0.06em', textTransform: 'uppercase', padding: '4px 8px', display: 'inline-block' };
  };

  const typeBadge = (type) => ({
    background: type === 'preorder' ? '#F2C015' : '#14110D',
    color: type === 'preorder' ? '#14110D' : '#F2EEE4',
    fontFamily: "'Space Mono', monospace",
    fontSize: '10px',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    padding: '3px 8px',
    display: 'inline-block'
  });

  return (
    <>
      <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '12px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6b655a' }}>Manajemen</div>
      <h1 style={{ fontFamily: "'Archivo'", fontWeight: 900, fontSize: '40px', margin: '4px 0 28px', textTransform: 'uppercase' }}>Penjualan & Pesanan</h1>

      <div style={{ border: '2px solid #14110D', background: '#fff' }}>
        <div style={{ padding: '16px 20px', borderBottom: '2px solid #14110D', fontFamily: "'Archivo'", fontWeight: 800, fontSize: '16px', textTransform: 'uppercase' }}>
          Semua Pesanan
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr 1fr auto auto auto', gap: 0, padding: '10px 20px', background: '#f7f4ee', fontFamily: "'Space Mono', monospace", fontSize: '10px', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#6b655a', borderBottom: '1px solid #ddd5c4' }}>
          <span>No. Pesanan</span><span>Pelanggan</span><span>Items</span><span style={{ paddingRight: '16px', textAlign: 'right' }}>Total</span><span style={{ paddingRight: '16px', textAlign: 'center' }}>Tipe</span><span>Status</span>
        </div>
        {data.orders.map((o, idx) => (
          <div key={idx} style={{ display: 'grid', gridTemplateColumns: '120px 1fr 1fr auto auto auto', gap: 0, padding: '14px 20px', borderBottom: '1px solid #ddd5c4', alignItems: 'center' }}>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '12px', fontWeight: 700 }}>{o.id}</span>
            <div>
              <div style={{ fontFamily: "'Archivo'", fontWeight: 600, fontSize: '14px' }}>{o.customer}</div>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', color: '#6b655a' }}>{o.date} Jun 2026</div>
            </div>
            <span style={{ fontSize: '13px', color: '#3d382f' }}>{o.items}</span>
            <span style={{ paddingRight: '16px', textAlign: 'right', fontFamily: "'Space Mono', monospace", fontSize: '13px', fontWeight: 700 }}>{rp(o.total)}</span>
            <span style={{ paddingRight: '16px', textAlign: 'center' }}><span style={typeBadge(o.type)}>{o.type === 'preorder' ? 'PO' : 'RS'}</span></span>
            <span style={statusStyle(o.status)}>{o.status}</span>
          </div>
        ))}
      </div>
    </>
  );
}
