import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { rp } from '../../utils/helpers';

export default function Finance() {
  const { data, unitsOf } = useContext(AppContext);
  const products = data.PRODUCTS;

  const [splits, setSplits] = useState({
    syndicate: 40,
    creative: 25,
    admin: 15,
    platform: 20
  });

  const rows = products.map(p => {
    const units = unitsOf ? unitsOf(p) : 0;
    const gross = p.price * units;
    const production = (p.costs?.production || 0) * units;
    const kemasan = (p.costs?.kemasan || 0) * units;
    const stiker = (p.costs?.stiker || 0) * units;
    const totalCost = production + kemasan + stiker;
    const profit = gross - totalCost;

    return { id: p.id, name: p.name, units, gross, production, kemasan, stiker, totalCost, profit };
  });

  const totalUnits = rows.reduce((a, r) => a + r.units, 0);
  const totalGross = rows.reduce((a, r) => a + r.gross, 0);
  const totalProduction = rows.reduce((a, r) => a + r.production, 0);
  const totalKemasan = rows.reduce((a, r) => a + r.kemasan, 0);
  const totalStiker = rows.reduce((a, r) => a + r.stiker, 0);
  const totalProfit = rows.reduce((a, r) => a + r.profit, 0);
  const totalBiayaKeseluruhan = totalProduction + totalKemasan + totalStiker;

  const splitDefs = [
    { key: 'syndicate', label: 'Aircooled Syndicate', color: '#F2C015' },
    { key: 'creative', label: 'Desain / Kreatif', color: '#14110D' },
    { key: 'admin', label: 'Admin', color: '#9a7a10' },
    { key: 'platform', label: 'Platform', color: '#c9c1ad' }
  ];

  const splitSum = Object.values(splits).reduce((a, b) => a + (Number(b) || 0), 0);
  const splitOk = splitSum === 100;

  const handleSplitChange = (key, val) => {
    const num = parseInt(val);
    setSplits(prev => ({ ...prev, [key]: isNaN(num) ? 0 : num }));
  };

  const gridTable = 'minmax(200px, 1.8fr) 60px repeat(5, 1fr)';
  const cellStyle = { padding: '14px 20px', borderBottom: '1px solid #ddd5c4', display: 'flex', alignItems: 'center', fontFamily: "'Space Mono', monospace", fontSize: '12px' };
  const headCellStyle = { padding: '12px 20px', borderBottom: '1px solid #14110D', fontFamily: "'Space Mono', monospace", fontSize: '10px', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#9a8f7a', display: 'flex', alignItems: 'center' };
  const totalCellStyle = { padding: '16px 20px', fontFamily: "'Space Mono', monospace", fontSize: '13px', fontWeight: 700, display: 'flex', alignItems: 'center' };

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .finance-table-scroll { overflow-x: auto; -webkit-overflow-scrolling: touch; }
          .finance-table-grid { min-width: 760px; }
          .finance-bottom-grid { grid-template-columns: 1fr !important; }
          .finance-left-box { padding: 24px !important; }
          .finance-left-value { font-size: 34px !important; }
          .finance-split-row { flex-wrap: wrap !important; row-gap: 10px !important; padding: 16px 0 !important; }
          .finance-split-label { width: auto !important; flex: 1 1 60% !important; }
          .finance-split-input { order: 3 !important; }
          .finance-split-value { order: 4 !important; min-width: 0 !important; flex: 1 1 100% !important; text-align: left !important; }
          .finance-new-row { flex-wrap: wrap !important; }
        }
      `}</style>

      <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '12px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6b655a' }}>
        Rekap Biaya & Bagi Hasil
      </div>
      <h1 style={{ fontFamily: "'Archivo'", fontWeight: 900, fontSize: '40px', margin: '4px 0 28px', textTransform: 'uppercase' }}>
        Keuangan & Profit
      </h1>

      <div style={{ border: '2px solid #14110D', background: '#fff', marginBottom: '24px' }}>
        <div style={{ padding: '16px 20px', borderBottom: '2px solid #14110D', fontFamily: "'Archivo'", fontWeight: 800, fontSize: '16px', textTransform: 'uppercase' }}>
          Rekap Biaya Produksi per Produk
        </div>

        {/* ==== SATU grid container tunggal untuk header + semua baris + total ==== */}
        <div className="finance-table-scroll">
          <div className="finance-table-grid" style={{ display: 'grid', gridTemplateColumns: gridTable, columnGap: '16px' }}>
            {/* header row */}
            <div style={headCellStyle}>Produk</div>
            <div style={{ ...headCellStyle, justifyContent: 'flex-end' }}>Unit</div>
            <div style={{ ...headCellStyle, justifyContent: 'flex-end' }}>Pendapatan</div>
            <div style={{ ...headCellStyle, justifyContent: 'flex-end' }}>Produksi</div>
            <div style={{ ...headCellStyle, justifyContent: 'flex-end' }}>Kemasan</div>
            <div style={{ ...headCellStyle, justifyContent: 'flex-end' }}>Stiker & Aks.</div>
            <div style={{ ...headCellStyle, justifyContent: 'flex-end' }}>Profit Kotor</div>

            {/* data rows */}
            {rows.map((r, i) => (
              <React.Fragment key={i}>
                <div style={{ ...cellStyle, fontFamily: "'Archivo'", fontWeight: 700, fontSize: '14px' }}>{r.name}</div>
                <div style={{ ...cellStyle, justifyContent: 'flex-end' }}>{r.units}</div>
                <div style={{ ...cellStyle, justifyContent: 'flex-end' }}>{r.gross === 0 ? 'Rp 0' : rp(r.gross)}</div>
                <div style={{ ...cellStyle, justifyContent: 'flex-end', color: '#6b655a' }}>{r.production === 0 ? 'Rp 0' : rp(r.production)}</div>
                <div style={{ ...cellStyle, justifyContent: 'flex-end', color: '#6b655a' }}>{r.kemasan === 0 ? 'Rp 0' : rp(r.kemasan)}</div>
                <div style={{ ...cellStyle, justifyContent: 'flex-end', color: '#6b655a' }}>{r.stiker === 0 ? 'Rp 0' : rp(r.stiker)}</div>
                <div style={{ ...cellStyle, justifyContent: 'flex-end', fontWeight: 700 }}>{r.profit === 0 ? 'Rp 0' : rp(r.profit)}</div>
              </React.Fragment>
            ))}

            {/* total row */}
            <div style={{ ...totalCellStyle, fontFamily: "'Archivo'", fontWeight: 900, fontSize: '15px', textTransform: 'uppercase' }}>Total</div>
            <div style={{ ...totalCellStyle, justifyContent: 'flex-end' }}>{totalUnits}</div>
            <div style={{ ...totalCellStyle, justifyContent: 'flex-end' }}>{rp(totalGross)}</div>
            <div style={{ ...totalCellStyle, justifyContent: 'flex-end', color: '#6b655a' }}>{rp(totalProduction)}</div>
            <div style={{ ...totalCellStyle, justifyContent: 'flex-end', color: '#6b655a' }}>{rp(totalKemasan)}</div>
            <div style={{ ...totalCellStyle, justifyContent: 'flex-end', color: '#6b655a' }}>{rp(totalStiker)}</div>
            <div style={{ ...totalCellStyle, justifyContent: 'flex-end', fontSize: '14px' }}>{rp(totalProfit)}</div>
          </div>
        </div>
      </div>

      <div className="finance-bottom-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', alignItems: 'flex-start' }}>
        <div className="finance-left-box" style={{ background: '#14110D', color: '#F2EEE4', padding: '36px' }}>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#F2C015', marginBottom: '16px' }}>
            Total Profit Kotor
          </div>
          <div className="finance-left-value" style={{ fontFamily: "'Archivo'", fontWeight: 900, fontSize: '48px', letterSpacing: '-0.02em', lineHeight: 1, marginBottom: '20px' }}>
            {rp(totalProfit)}
          </div>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '12px', color: '#cfcabd', lineHeight: 1.6 }}>
            Dari {rp(totalGross)} pendapatan,<br/>
            dikurangi {rp(totalBiayaKeseluruhan)} biaya.
          </div>

          <div style={{ marginTop: '48px', borderTop: '1px solid #2c2820', paddingTop: '24px', fontFamily: "'Space Mono', monospace", fontSize: '11px', letterSpacing: '0.1em', fontWeight: 700, color: splitOk ? '#F2C015' : '#ff6b53', textTransform: 'uppercase' }}>
            {splitOk ? 'TOTAL ALOKASI: 100% ✓' : `TOTAL ALOKASI: ${splitSum}% — HARUS 100%`}
          </div>
        </div>

        <div style={{ border: '2px solid #14110D', background: '#fff' }}>
          <div style={{ padding: '20px 24px', borderBottom: '2px solid #14110D', fontFamily: "'Archivo'", fontWeight: 900, fontSize: '15px', textTransform: 'uppercase' }}>
            Pembagian Profit
          </div>

          <div style={{ padding: '0 24px' }}>
            {splitDefs.map((sp, idx) => (
              <div key={sp.key} className="finance-split-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 0', borderBottom: idx !== splitDefs.length - 1 ? '1px solid #ddd5c4' : 'none' }}>

                <div className="finance-split-label" style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '220px' }}>
                  <div style={{ width: '12px', height: '12px', background: sp.color, flexShrink: 0 }}></div>
                  <span style={{ fontFamily: "'Archivo'", fontWeight: 700, fontSize: '15px' }}>{sp.label}</span>
                </div>

                <div className="finance-split-input" style={{ display: 'flex', alignItems: 'center', border: '2px solid #14110D', width: '86px', background: '#fff', flexShrink: 0 }}>
                  <input
                    type="number"
                    value={splits[sp.key] === 0 ? '' : splits[sp.key]}
                    onChange={(e) => handleSplitChange(sp.key, e.target.value)}
                    style={{ flex: 1, minWidth: 0, padding: '10px 0 10px 14px', border: 'none', fontFamily: "'Space Mono', monospace", fontSize: '13px', textAlign: 'center', outline: 'none' }}
                  />
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '12px', paddingRight: '14px', color: '#14110D' }}>%</span>
                </div>

                <div className="finance-split-value" style={{ fontFamily: "'Space Mono', monospace", fontSize: '14px', fontWeight: 700, textAlign: 'right', minWidth: '140px' }}>
                  {rp(Math.round(totalProfit * (splits[sp.key] / 100)))}
                </div>

              </div>
            ))}
          </div>

          <div style={{ padding: '16px 24px', borderTop: '1px solid #ddd5c4', fontFamily: "'Space Mono', monospace", fontSize: '11px', color: '#6b655a' }}>
            Ubah persentase untuk simulasi bagi hasil secara langsung.
          </div>
        </div>

      </div>
    </>
  );
}