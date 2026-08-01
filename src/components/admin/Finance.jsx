import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { rp } from '../../utils/helpers';

export default function Finance() {
  const { data, unitsOf } = useContext(AppContext);
  const products = data.PRODUCTS;

  // --- STATE LOKAL UNTUK SIMULASI BAGI HASIL ---
  const [splits, setSplits] = useState({
    syndicate: 40,
    creative: 25,
    admin: 15,
    platform: 20
  });

  // --- LOGIKA PERHITUNGAN TABEL ---
  const rows = products.map(p => {
    const units = unitsOf ? unitsOf(p) : 0;
    const gross = p.price * units;
    const production = (p.costs?.production || 0) * units;
    const kemasan = (p.costs?.kemasan || 0) * units;
    const stiker = (p.costs?.stiker || 0) * units;
    const totalCost = production + kemasan + stiker;
    const profit = gross - totalCost;

    return { 
      id: p.id, 
      name: p.name, 
      units, 
      gross, 
      production, 
      kemasan, 
      stiker, 
      totalCost, 
      profit 
    };
  });

  // --- PERHITUNGAN TOTAL ---
  const totalUnits = rows.reduce((a, r) => a + r.units, 0);
  const totalGross = rows.reduce((a, r) => a + r.gross, 0);
  const totalProduction = rows.reduce((a, r) => a + r.production, 0);
  const totalKemasan = rows.reduce((a, r) => a + r.kemasan, 0);
  const totalStiker = rows.reduce((a, r) => a + r.stiker, 0);
  const totalProfit = rows.reduce((a, r) => a + r.profit, 0);
  const totalBiayaKeseluruhan = totalProduction + totalKemasan + totalStiker;

  // --- LOGIKA SIMULASI ALOKASI ---
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

  // --- TEMPLATE GRID ---
  const gridTable = 'minmax(200px, 1.8fr) 60px repeat(5, 1fr)';

  return (
    <>
      <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '12px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6b655a' }}>
        Rekap Biaya & Bagi Hasil
      </div>
      <h1 style={{ fontFamily: "'Archivo'", fontWeight: 900, fontSize: '40px', margin: '4px 0 28px', textTransform: 'uppercase' }}>
        Keuangan & Profit
      </h1>

      {/* ======================= TABEL REKAP BIAYA PRODUKSI ======================= */}
      <div style={{ border: '2px solid #14110D', background: '#fff', marginBottom: '24px' }}>
        <div style={{ padding: '16px 20px', borderBottom: '2px solid #14110D', fontFamily: "'Archivo'", fontWeight: 800, fontSize: '16px', textTransform: 'uppercase' }}>
          Rekap Biaya Produksi per Produk
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: gridTable, gap: '16px', padding: '12px 20px', borderBottom: '1px solid #14110D', fontFamily: "'Space Mono', monospace", fontSize: '10px', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#9a8f7a', alignItems: 'center' }}>
          <span>Produk</span>
          <span style={{ textAlign: 'right' }}>Unit</span>
          <span style={{ textAlign: 'right' }}>Pendapatan</span>
          <span style={{ textAlign: 'right' }}>Produksi</span>
          <span style={{ textAlign: 'right' }}>Kemasan</span>
          <span style={{ textAlign: 'right' }}>Stiker & Aks.</span>
          <span style={{ textAlign: 'right' }}>Profit Kotor</span>
        </div>
        
        {rows.map((r, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: gridTable, gap: '16px', padding: '14px 20px', borderBottom: '1px solid #ddd5c4', alignItems: 'center', fontFamily: "'Space Mono', monospace", fontSize: '12px' }}>
            <div style={{ fontFamily: "'Archivo'", fontWeight: 700, fontSize: '14px' }}>{r.name}</div>
            <div style={{ textAlign: 'right' }}>{r.units}</div>
            <div style={{ textAlign: 'right' }}>{r.gross === 0 ? 'Rp 0' : rp(r.gross)}</div>
            <div style={{ textAlign: 'right', color: '#6b655a' }}>{r.production === 0 ? 'Rp 0' : rp(r.production)}</div>
            <div style={{ textAlign: 'right', color: '#6b655a' }}>{r.kemasan === 0 ? 'Rp 0' : rp(r.kemasan)}</div>
            <div style={{ textAlign: 'right', color: '#6b655a' }}>{r.stiker === 0 ? 'Rp 0' : rp(r.stiker)}</div>
            <div style={{ textAlign: 'right', fontWeight: 700 }}>{r.profit === 0 ? 'Rp 0' : rp(r.profit)}</div>
          </div>
        ))}

        <div style={{ display: 'grid', gridTemplateColumns: gridTable, gap: '16px', padding: '16px 20px', fontFamily: "'Space Mono', monospace", fontSize: '13px', fontWeight: 700, alignItems: 'center' }}>
          <div style={{ fontFamily: "'Archivo'", fontWeight: 900, fontSize: '15px', textTransform: 'uppercase' }}>Total</div>
          <div style={{ textAlign: 'right' }}>{totalUnits}</div>
          <div style={{ textAlign: 'right' }}>{rp(totalGross)}</div>
          <div style={{ textAlign: 'right', color: '#6b655a' }}>{rp(totalProduction)}</div>
          <div style={{ textAlign: 'right', color: '#6b655a' }}>{rp(totalKemasan)}</div>
          <div style={{ textAlign: 'right', color: '#6b655a' }}>{rp(totalStiker)}</div>
          <div style={{ textAlign: 'right', fontSize: '14px' }}>{rp(totalProfit)}</div>
        </div>
      </div>

      {/* ======================= BAGIAN BAWAH ======================= */}
      {/* alignItems: 'flex-start' memastikan kotak hitam tidak melar ke bawah menyesuaikan kotak kanan */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', alignItems: 'flex-start' }}>
        
        {/* KOTAK KIRI: Total Profit Kotor */}
        <div style={{ background: '#14110D', color: '#F2EEE4', padding: '36px' }}>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#F2C015', marginBottom: '16px' }}>
            Total Profit Kotor
          </div>
          <div style={{ fontFamily: "'Archivo'", fontWeight: 900, fontSize: '48px', letterSpacing: '-0.02em', lineHeight: 1, marginBottom: '20px' }}>
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

        {/* KOTAK KANAN: Kalkulator Simulasi Pembagian Profit */}
        <div style={{ border: '2px solid #14110D', background: '#fff' }}>
          <div style={{ padding: '20px 24px', borderBottom: '2px solid #14110D', fontFamily: "'Archivo'", fontWeight: 900, fontSize: '15px', textTransform: 'uppercase' }}>
            Pembagian Profit
          </div>
          
          <div style={{ padding: '0 24px' }}>
            {splitDefs.map((sp, idx) => (
              <div key={sp.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 0', borderBottom: idx !== splitDefs.length - 1 ? '1px solid #ddd5c4' : 'none' }}>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '220px' }}>
                  <div style={{ width: '12px', height: '12px', background: sp.color }}></div>
                  <span style={{ fontFamily: "'Archivo'", fontWeight: 700, fontSize: '15px' }}>{sp.label}</span>
                </div>
                
                {/* WADAH INPUT PERSENTASE BERSATU DENGAN "%" */}
                <div style={{ display: 'flex', alignItems: 'center', border: '2px solid #14110D', width: '86px', background: '#fff' }}>
                  <input 
                    type="number" 
                    value={splits[sp.key] === 0 ? '' : splits[sp.key]} 
                    onChange={(e) => handleSplitChange(sp.key, e.target.value)}
                    style={{ flex: 1, minWidth: 0, padding: '10px 0 10px 14px', border: 'none', fontFamily: "'Space Mono', monospace", fontSize: '13px', textAlign: 'center', outline: 'none' }} 
                  />
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '12px', paddingRight: '14px', color: '#14110D' }}>%</span>
                </div>
                
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '14px', fontWeight: 700, textAlign: 'right', minWidth: '140px' }}>
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