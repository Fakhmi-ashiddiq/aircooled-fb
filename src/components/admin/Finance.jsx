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

  const gridTable = '1.8fr 0.8fr 1fr 1fr 1fr 1fr 1.1fr';
  const costColor = '#9a3a2a';

  const headCell = { padding: '12px 0', borderBottom: '1px solid #ddd5c4', fontFamily: "'Space Mono', monospace", fontSize: '10px', letterSpacing: '0.04em', textTransform: 'uppercase', color: '#6b655a', display: 'flex', alignItems: 'center' };
  const dataCell = { padding: '12px 0', borderBottom: '1px solid #ddd5c4', display: 'flex', alignItems: 'center', fontFamily: "'Space Mono', monospace", fontSize: '12px' };
  const totalCell = { padding: '14px 0', display: 'flex', alignItems: 'center', fontFamily: "'Space Mono', monospace", fontSize: '13px', fontWeight: 700 };

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .finance-bottom-grid { grid-template-columns: 1fr !important; }
          .finance-left-box { padding: 20px !important; }
          .finance-left-value { font-size: 32px !important; }
          .finance-split-row { flex-wrap: wrap !important; row-gap: 8px !important; }
          .finance-split-label { flex: 1 1 100% !important; }
          .finance-split-input { order: 2 !important; }
          .finance-split-value { order: 3 !important; margin-left: auto !important; }
          .finance-new-row { flex-wrap: wrap !important; }
        }
      `}</style>

      <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '12px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6b655a' }}>
        Rekap Biaya & Bagi Hasil
      </div>
      <h1 style={{ fontFamily: "'Archivo'", fontWeight: 900, fontSize: '40px', margin: '4px 0 28px', textTransform: 'uppercase' }}>
        Keuangan &amp; Profit
      </h1>

      {/* overflow-x:auto memang bagian dari desain asli (tabel lebar), bukan cuma penyesuaian mobile */}
      <div style={{ border: '2px solid #14110D', background: '#fff', marginBottom: '28px', overflowX: 'auto' }}>
        <div style={{ padding: '14px 20px', borderBottom: '2px solid #14110D', fontFamily: "'Archivo'", fontWeight: 800, fontSize: '16px', textTransform: 'uppercase' }}>
          Rekap Biaya Produksi per Produk
        </div>
        <div style={{ padding: '0 20px', minWidth: '760px', display: 'grid', gridTemplateColumns: gridTable, columnGap: '10px' }}>
          <div style={headCell}>Produk</div>
          <div style={{ ...headCell, justifyContent: 'flex-end' }}>Unit</div>
          <div style={{ ...headCell, justifyContent: 'flex-end' }}>Pendapatan</div>
          <div style={{ ...headCell, justifyContent: 'flex-end' }}>Produksi</div>
          <div style={{ ...headCell, justifyContent: 'flex-end' }}>Kemasan</div>
          <div style={{ ...headCell, justifyContent: 'flex-end' }}>Stiker & Aks.</div>
          <div style={{ ...headCell, justifyContent: 'flex-end' }}>Profit Kotor</div>

          {rows.map((r, i) => (
            <React.Fragment key={i}>
              <div style={{ ...dataCell, fontFamily: "'Archivo'", fontWeight: 700, fontSize: '14px' }}>{r.name}</div>
              <div style={{ ...dataCell, justifyContent: 'flex-end' }}>{r.units}</div>
              <div style={{ ...dataCell, justifyContent: 'flex-end' }}>{rp(r.gross)}</div>
              <div style={{ ...dataCell, justifyContent: 'flex-end', color: costColor }}>{rp(r.production)}</div>
              <div style={{ ...dataCell, justifyContent: 'flex-end', color: costColor }}>{rp(r.kemasan)}</div>
              <div style={{ ...dataCell, justifyContent: 'flex-end', color: costColor }}>{rp(r.stiker)}</div>
              <div style={{ ...dataCell, justifyContent: 'flex-end', fontWeight: 700 }}>{rp(r.profit)}</div>
            </React.Fragment>
          ))}

          <div style={{ ...totalCell, fontFamily: "'Archivo'", fontWeight: 900, fontSize: '15px', textTransform: 'uppercase' }}>Total</div>
          <div style={{ ...totalCell, justifyContent: 'flex-end' }}>{totalUnits}</div>
          <div style={{ ...totalCell, justifyContent: 'flex-end' }}>{rp(totalGross)}</div>
          <div style={{ ...totalCell, justifyContent: 'flex-end', color: costColor }}>{rp(totalProduction)}</div>
          <div style={{ ...totalCell, justifyContent: 'flex-end', color: costColor }}>{rp(totalKemasan)}</div>
          <div style={{ ...totalCell, justifyContent: 'flex-end', color: costColor }}>{rp(totalStiker)}</div>
          <div style={{ ...totalCell, justifyContent: 'flex-end', fontSize: '14px' }}>{rp(totalProfit)}</div>
        </div>
      </div>

      <div className="finance-bottom-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '24px', alignItems: 'start' }}>
        <div className="finance-left-box" style={{ border: '2px solid #14110D', background: '#14110D', color: '#F2EEE4', padding: '24px' }}>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#F2C015' }}>
            Total Profit Kotor
          </div>
          <div className="finance-left-value" style={{ fontFamily: "'Archivo'", fontWeight: 900, fontSize: '42px', marginTop: '6px', letterSpacing: '-0.01em' }}>
            {rp(totalProfit)}
          </div>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '12px', color: '#cfcabd', marginTop: '8px', lineHeight: 1.6 }}>
            Dari {rp(totalGross)} pendapatan,<br/>dikurangi {rp(totalBiayaKeseluruhan)} biaya.
          </div>
          <div style={{ marginTop: '24px', borderTop: '1px solid #2c2820', paddingTop: '18px', fontFamily: "'Space Mono', monospace", fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', color: splitOk ? '#F2C015' : '#ff6b53' }}>
            {splitOk ? 'TOTAL ALOKASI: 100% ✓' : `TOTAL ALOKASI: ${splitSum}% — HARUS 100%`}
          </div>
        </div>

        <div style={{ border: '2px solid #14110D', background: '#fff' }}>
          <div style={{ padding: '14px 20px', borderBottom: '2px solid #14110D', fontFamily: "'Archivo'", fontWeight: 800, fontSize: '16px', textTransform: 'uppercase' }}>
            Pembagian Profit
          </div>

          <div style={{ padding: '8px 20px 18px' }}>
            {splitDefs.map((sp) => (
              <div key={sp.key} className="finance-split-row" style={{ display: 'grid', gridTemplateColumns: '1.4fr auto 1.2fr', gap: '14px', alignItems: 'center', padding: '13px 0', borderBottom: '1px solid #ddd5c4' }}>

                <div className="finance-split-label" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ width: '12px', height: '12px', background: sp.color, display: 'inline-block', flexShrink: 0 }}></span>
                  <span style={{ fontFamily: "'Archivo'", fontWeight: 700, fontSize: '14px' }}>{sp.label}</span>
                </div>

                <div className="finance-split-input" style={{ display: 'flex', alignItems: 'center', border: '2px solid #14110D' }}>
                  <input
                    type="number"
                    value={splits[sp.key] === 0 ? '' : splits[sp.key]}
                    onChange={(e) => handleSplitChange(sp.key, e.target.value)}
                    style={{ width: '56px', border: 'none', padding: '8px', fontFamily: "'Space Mono', monospace", fontSize: '14px', textAlign: 'right', background: '#fff', outline: 'none' }}
                  />
                  <span style={{ padding: '0 9px', fontFamily: "'Space Mono', monospace", fontSize: '13px', color: '#6b655a' }}>%</span>
                </div>

                <span className="finance-split-value" style={{ fontFamily: "'Space Mono', monospace", fontSize: '15px', fontWeight: 700, textAlign: 'right' }}>
                  {rp(Math.round(totalProfit * (splits[sp.key] / 100)))}
                </span>

              </div>
            ))}
            <div style={{ marginTop: '10px', fontFamily: "'Space Mono', monospace", fontSize: '11px', color: '#6b655a' }}>
              Ubah persentase untuk simulasi bagi hasil secara langsung.
            </div>
          </div>
        </div>
      </div>
    </>
  );
}