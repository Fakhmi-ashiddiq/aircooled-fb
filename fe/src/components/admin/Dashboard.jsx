import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useStore } from '../../store';
import { rp } from '../../utils/helpers';

function MultiSelect({ label, options, value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const handleClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);
  const toggle = (opt) => value.includes(opt) ? onChange(value.filter(v => v !== opt)) : onChange([...value, opt]);
  const isAll = value.length === 0;
  const display = isAll ? 'Semua' : (value.length === 1 ? value[0] : `${value.length} terpilih`);
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '130px 1fr', borderBottom: '2px solid #14110D', background: '#F2EEE4', alignItems: 'stretch' }}>
      <div style={{ padding: '8px 12px', fontSize: '11px', fontFamily: "'Space Mono', monospace", fontWeight: 700, color: '#14110D', display: 'flex', alignItems: 'center', textTransform: 'uppercase' }}>{label}</div>
      <div ref={ref} style={{ position: 'relative', background: '#fff', borderLeft: '2px solid #14110D' }}>
        <div onClick={() => setOpen(!open)} style={{ padding: '8px 12px', fontSize: '12px', fontFamily: "'Archivo'", fontWeight: 700, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '100%', color: '#14110D' }}>
          <span>{display}</span><span style={{ fontSize: '10px' }}>&#9660;</span>
        </div>
        {open && (
          <div style={{ position: 'absolute', top: '100%', left: '-2px', right: '-2px', background: '#fff', border: '2px solid #14110D', zIndex: 10, maxHeight: '200px', overflowY: 'auto' }}>
            <div onClick={() => { onChange([]); setOpen(false); }} style={{ padding: '8px 12px', fontSize: '12px', fontFamily: "'Archivo'", cursor: 'pointer', background: isAll ? '#F2EEE4' : '#fff', fontWeight: isAll ? 800 : 500, borderBottom: '1px solid #14110D' }}>Semua</div>
            {options.map(opt => (
              <div key={opt} onClick={() => toggle(opt)} style={{ padding: '8px 12px', fontSize: '12px', fontFamily: "'Archivo'", cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid #14110D' }}>
                <input type="checkbox" checked={value.includes(opt)} readOnly style={{ margin: 0, accentColor: '#14110D' }} />{opt}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function DateSelect({ label, value, onChange }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '130px 1fr', borderBottom: '2px solid #14110D', background: '#F2EEE4', alignItems: 'stretch' }}>
      <div style={{ padding: '8px 12px', fontSize: '11px', fontFamily: "'Space Mono', monospace", fontWeight: 700, color: '#14110D', display: 'flex', alignItems: 'center', textTransform: 'uppercase' }}>{label}</div>
      <div style={{ background: '#fff', borderLeft: '2px solid #14110D' }}>
        <input type="date" value={value} onChange={e => onChange(e.target.value)} style={{ width: '100%', border: 'none', background: 'transparent', padding: '8px 12px', fontSize: '12px', fontFamily: "'Archivo'", fontWeight: 700, color: '#14110D', outline: 'none' }} />
      </div>
    </div>
  );
}

function SummaryCard({ title, data, isEvent }) {
  const CardValue = ({ label, val, sub }) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRight: '2px solid #14110D', padding: '20px 8px' }}>
      <div style={{ fontSize: '10px', fontFamily: "'Space Mono', monospace", fontWeight: 700, color: '#6b655a', textTransform: 'uppercase', marginBottom: '8px', textAlign: 'center', letterSpacing: '0.05em' }}>{label}</div>
      <div style={{ fontSize: '22px', fontFamily: "'Archivo'", fontWeight: 900, color: '#14110D', letterSpacing: '-0.02em' }}>{val}</div>
      {sub && <div style={{ fontSize: '9px', fontFamily: "'Space Mono', monospace", color: '#6b655a', marginTop: '6px', textAlign: 'center' }}>{sub}</div>}
    </div>
  );

  return (
    <div style={{ marginBottom: '32px', background: '#fff', border: '2px solid #14110D' }}>
      <div style={{ background: '#14110D', color: '#F2EEE4', padding: '12px 16px', fontSize: '14px', fontFamily: "'Archivo'", fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.02em' }}>{title}</div>
      <div className={isEvent ? 'dash-summary-grid-event' : 'dash-summary-grid'}>
        <CardValue label="Barang Terjual (PCS)" val={data.terjual} />
        {!isEvent && <CardValue label="Total Uang Masuk (Rp)" val={rp(data.uangMasuk)} sub="(harga barang + ongkir)" />}
        {isEvent && <CardValue label="Total Penjualan (Rp)" val={rp(data.totalPenjualan)} sub="(event, tanpa ongkir)" />}
        {!isEvent && <CardValue label="Total Ongkir Real (Rp)" val={rp(data.totalOngkir)} />}
        <CardValue label="Total HPP (Rp)" val={rp(data.totalHpp)} />
      </div>
      <div className={isEvent ? 'dash-summary-grid-event-bottom' : 'dash-summary-grid-bottom'}>
        <CardValue label="Total Keuntungan (Rp)" val={rp(data.keuntungan)} />
        <CardValue label="Margin Keuntungan (%)" val={data.margin.toFixed(1) + '%'} />
        {!isEvent && <CardValue label="Selisih Ongkir (Rp)" val={rp(data.selisihOngkir)} />}
        <CardValue label="Rata-Rata Untung/Pcs (Rp)" val={rp(data.rataUntung)} />
      </div>
    </div>
  );
}

function BreakdownTable({ title, headerLabel, data }) {
  return (
    <div style={{ background: '#fff', border: '2px solid #14110D' }}>
      <div style={{ background: '#14110D', color: '#F2EEE4', padding: '8px 16px', fontSize: '13px', fontFamily: "'Archivo'", fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.02em', textAlign: 'center' }}>
        {title}
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', minWidth: '100%', borderCollapse: 'collapse', fontSize: '12px', fontFamily: "'Archivo'" }}>
          <thead style={{ background: '#F2EEE4', borderBottom: '2px solid #14110D', borderTop: '2px solid #14110D' }}>
          <tr>
            <th style={{ padding: '8px', borderRight: '1px solid #14110D', textAlign: 'left' }}>{headerLabel}</th>
            <th style={{ padding: '8px', borderRight: '1px solid #14110D', textAlign: 'center' }}>Qty</th>
            <th style={{ padding: '8px', borderRight: '1px solid #14110D', textAlign: 'right' }}>Penjualan (Rp)</th>
            <th style={{ padding: '8px', textAlign: 'right' }}>Untung (Rp)</th>
          </tr>
        </thead>
        <tbody>
          {data.rows.map((r, i) => (
            <tr key={i} style={{ borderBottom: '1px solid #ddd5c4' }}>
              <td style={{ padding: '8px', borderRight: '1px solid #14110D' }}>{r.label}</td>
              <td style={{ padding: '8px', borderRight: '1px solid #14110D', textAlign: 'center', fontFamily: "'Space Mono', monospace" }}>{r.qty}</td>
              <td style={{ padding: '8px', borderRight: '1px solid #14110D', textAlign: 'right', fontFamily: "'Space Mono', monospace" }}>{rp(r.penjualan)}</td>
              <td style={{ padding: '8px', textAlign: 'right', fontFamily: "'Space Mono', monospace", color: '#047857', fontWeight: 700 }}>{rp(r.untung)}</td>
            </tr>
          ))}
          <tr style={{ background: '#F2EEE4', borderTop: '2px solid #14110D', fontWeight: 800 }}>
            <td style={{ padding: '8px', borderRight: '1px solid #14110D' }}>TOTAL</td>
            <td style={{ padding: '8px', borderRight: '1px solid #14110D', textAlign: 'center', fontFamily: "'Space Mono', monospace" }}>{data.total.qty}</td>
            <td style={{ padding: '8px', borderRight: '1px solid #14110D', textAlign: 'right', fontFamily: "'Space Mono', monospace" }}>{rp(data.total.penjualan)}</td>
            <td style={{ padding: '8px', textAlign: 'right', fontFamily: "'Space Mono', monospace", color: '#047857' }}>{rp(data.total.untung)}</td>
          </tr>
        </tbody>
      </table>
      </div>
    </div>
  );
}

function ProductSizeTable({ data }) {
  if (!data || data.rows.length === 0) return null;
  return (
    <div style={{ background: '#fff', border: '2px solid #14110D', marginTop: '32px', marginBottom: '32px' }}>
      <div style={{ background: '#14110D', color: '#F2EEE4', padding: '12px 16px', fontSize: '14px', fontFamily: "'Archivo'", fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.02em', textAlign: 'center' }}>
        RINCIAN PER PRODUK & UKURAN YANG KELUAR (pcs) - PO + EVENT
      </div>
      <div style={{ overflowX: 'auto', overflowY: 'auto', maxHeight: '600px' }}>
        <table style={{ width: '100%', minWidth: '100%', borderCollapse: 'collapse', fontSize: '12px', fontFamily: "'Archivo'" }}>
          <thead style={{ background: '#F2EEE4', borderBottom: '2px solid #14110D', position: 'sticky', top: 0, zIndex: 2 }}>
            <tr>
              <th style={{ padding: '10px 12px', borderRight: '1px solid #14110D', textAlign: 'left', minWidth: '200px' }}>Produk</th>
              {data.sizes.map(s => (
                <th key={s} style={{ padding: '10px 12px', borderRight: '1px solid #14110D', textAlign: 'center' }}>{s}</th>
              ))}
              <th style={{ padding: '10px 12px', textAlign: 'center', background: '#F2C015', color: '#14110D' }}>TOTAL</th>
            </tr>
          </thead>
          <tbody>
            {data.rows.map((r, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #ddd5c4' }}>
                <td style={{ padding: '10px 12px', borderRight: '1px solid #14110D', fontWeight: 600 }}>{r.prod}</td>
                {data.sizes.map(s => (
                  <td key={s} style={{ padding: '10px 12px', borderRight: '1px solid #14110D', textAlign: 'center', fontFamily: "'Space Mono', monospace", color: r[s] ? '#14110D' : '#a8a296' }}>
                    {r[s] || 0}
                  </td>
                ))}
                <td style={{ padding: '10px 12px', textAlign: 'center', fontFamily: "'Space Mono', monospace", fontWeight: 700, background: 'rgba(242, 192, 21, 0.15)' }}>
                  {r.total}
                </td>
              </tr>
            ))}
            <tr style={{ background: '#14110D', color: '#F2EEE4', fontWeight: 800, position: 'sticky', bottom: 0, zIndex: 2 }}>
              <td style={{ padding: '12px', borderRight: '1px solid #3d342b' }}>TOTAL</td>
              {data.sizes.map(s => (
                <td key={s} style={{ padding: '12px', borderRight: '1px solid #3d342b', textAlign: 'center', fontFamily: "'Space Mono', monospace" }}>
                  {data.total[s]}
                </td>
              ))}
              <td style={{ padding: '12px', textAlign: 'center', fontFamily: "'Space Mono', monospace", color: '#F2C015' }}>
                {data.total.total}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ProductFinancialTable({ data }) {
  if (!data || data.rows.length === 0) return null;
  return (
    <div style={{ background: '#fff', border: '2px solid #14110D', marginTop: '32px' }}>
      <div style={{ background: '#14110D', color: '#F2EEE4', padding: '12px 16px', fontSize: '14px', fontFamily: "'Archivo'", fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.02em', textAlign: 'center' }}>
        RINCIAN PER PRODUK - PENJUALAN & KEUNTUNGAN (PO + EVENT)
      </div>
      <div style={{ overflowX: 'auto', overflowY: 'auto', maxHeight: '600px' }}>
        <table style={{ width: '100%', minWidth: '100%', borderCollapse: 'collapse', fontSize: '11px', fontFamily: "'Archivo'" }}>
          <thead style={{ background: '#F2EEE4', borderBottom: '2px solid #14110D', position: 'sticky', top: 0, zIndex: 2 }}>
            <tr>
              <th rowSpan="2" style={{ padding: '8px', borderRight: '2px solid #14110D', borderBottom: '2px solid #14110D', textAlign: 'left', minWidth: '180px' }}>Produk</th>
              <th colSpan="5" style={{ padding: '8px', borderRight: '2px solid #14110D', borderBottom: '1px solid #14110D', textAlign: 'center', background: '#e6ded1' }}>PO (PRE-ORDER)</th>
              <th colSpan="4" style={{ padding: '8px', borderRight: '2px solid #14110D', borderBottom: '1px solid #14110D', textAlign: 'center', background: '#e6ded1' }}>EVENT</th>
              <th colSpan="4" style={{ padding: '8px', textAlign: 'center', background: '#F2C015', borderBottom: '1px solid #14110D', color: '#14110D' }}>TOTAL (PO + EVENT)</th>
            </tr>
            <tr>
              {/* PO */}
              <th style={{ padding: '6px', borderRight: '1px solid #14110D', textAlign: 'center' }}>Terjual<br/>(pcs)</th>
              <th style={{ padding: '6px', borderRight: '1px solid #14110D', textAlign: 'right' }}>Uang Masuk (Rp)<br/>(termasuk ongkir)</th>
              <th style={{ padding: '6px', borderRight: '1px solid #14110D', textAlign: 'right' }}>Ongkir (Rp)</th>
              <th style={{ padding: '6px', borderRight: '1px solid #14110D', textAlign: 'right' }}>Keuntungan (Rp)</th>
              <th style={{ padding: '6px', borderRight: '2px solid #14110D', textAlign: 'center' }}>Margin (%)</th>
              {/* EVENT */}
              <th style={{ padding: '6px', borderRight: '1px solid #14110D', textAlign: 'center' }}>Terjual<br/>(pcs)</th>
              <th style={{ padding: '6px', borderRight: '1px solid #14110D', textAlign: 'right' }}>Penjualan (Rp)<br/>(tanpa ongkir)</th>
              <th style={{ padding: '6px', borderRight: '1px solid #14110D', textAlign: 'right' }}>Keuntungan (Rp)</th>
              <th style={{ padding: '6px', borderRight: '2px solid #14110D', textAlign: 'center' }}>Margin (%)</th>
              {/* TOTAL */}
              <th style={{ padding: '6px', borderRight: '1px solid #14110D', textAlign: 'center', background: 'rgba(242, 192, 21, 0.15)' }}>Terjual<br/>(pcs)</th>
              <th style={{ padding: '6px', borderRight: '1px solid #14110D', textAlign: 'right', background: 'rgba(242, 192, 21, 0.15)' }}>Tot. Uang Masuk<br/>(termasuk ongkir)</th>
              <th style={{ padding: '6px', borderRight: '1px solid #14110D', textAlign: 'right', background: 'rgba(242, 192, 21, 0.15)' }}>Keuntungan (Rp)</th>
              <th style={{ padding: '6px', textAlign: 'center', background: 'rgba(242, 192, 21, 0.15)' }}>Margin (%)</th>
            </tr>
          </thead>
          <tbody>
            {data.rows.map((r, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #ddd5c4' }}>
                <td style={{ padding: '8px', borderRight: '2px solid #14110D', fontWeight: 600 }}>{r.prod}</td>
                {/* PO */}
                <td style={{ padding: '8px', borderRight: '1px solid #14110D', textAlign: 'center', fontFamily: "'Space Mono', monospace" }}>{r.po.qty}</td>
                <td style={{ padding: '8px', borderRight: '1px solid #14110D', textAlign: 'right', fontFamily: "'Space Mono', monospace" }}>{rp(r.po.uangMasuk)}</td>
                <td style={{ padding: '8px', borderRight: '1px solid #14110D', textAlign: 'right', fontFamily: "'Space Mono', monospace" }}>{rp(r.po.ongkir)}</td>
                <td style={{ padding: '8px', borderRight: '1px solid #14110D', textAlign: 'right', fontFamily: "'Space Mono', monospace", color: '#047857', fontWeight: 700 }}>{rp(r.po.keuntungan)}</td>
                <td style={{ padding: '8px', borderRight: '2px solid #14110D', textAlign: 'center', fontFamily: "'Space Mono', monospace" }}>{r.po.margin.toFixed(1)}%</td>
                {/* EVENT */}
                <td style={{ padding: '8px', borderRight: '1px solid #14110D', textAlign: 'center', fontFamily: "'Space Mono', monospace" }}>{r.ev.qty}</td>
                <td style={{ padding: '8px', borderRight: '1px solid #14110D', textAlign: 'right', fontFamily: "'Space Mono', monospace" }}>{rp(r.ev.penjualan)}</td>
                <td style={{ padding: '8px', borderRight: '1px solid #14110D', textAlign: 'right', fontFamily: "'Space Mono', monospace", color: '#047857', fontWeight: 700 }}>{rp(r.ev.keuntungan)}</td>
                <td style={{ padding: '8px', borderRight: '2px solid #14110D', textAlign: 'center', fontFamily: "'Space Mono', monospace" }}>{r.ev.penjualan > 0 ? (r.ev.keuntungan/r.ev.penjualan*100).toFixed(1) : '0.0'}%</td>
                {/* TOTAL */}
                <td style={{ padding: '8px', borderRight: '1px solid #14110D', textAlign: 'center', fontFamily: "'Space Mono', monospace", fontWeight: 700, background: 'rgba(242, 192, 21, 0.1)' }}>{r.tot.qty}</td>
                <td style={{ padding: '8px', borderRight: '1px solid #14110D', textAlign: 'right', fontFamily: "'Space Mono', monospace", fontWeight: 700, background: 'rgba(242, 192, 21, 0.1)' }}>{rp(r.tot.uangMasuk)}</td>
                <td style={{ padding: '8px', borderRight: '1px solid #14110D', textAlign: 'right', fontFamily: "'Space Mono', monospace", fontWeight: 700, color: '#047857', background: 'rgba(242, 192, 21, 0.1)' }}>{rp(r.tot.keuntungan)}</td>
                <td style={{ padding: '8px', textAlign: 'center', fontFamily: "'Space Mono', monospace", fontWeight: 700, background: 'rgba(242, 192, 21, 0.1)' }}>{r.tot.margin.toFixed(1)}%</td>
              </tr>
            ))}
            <tr style={{ background: '#14110D', color: '#F2EEE4', fontWeight: 800, position: 'sticky', bottom: 0, zIndex: 2 }}>
              <td style={{ padding: '10px 8px', borderRight: '2px solid #3d342b' }}>TOTAL</td>
              <td style={{ padding: '10px 8px', borderRight: '1px solid #3d342b', textAlign: 'center', fontFamily: "'Space Mono', monospace" }}>{data.total.po.qty}</td>
              <td style={{ padding: '10px 8px', borderRight: '1px solid #3d342b', textAlign: 'right', fontFamily: "'Space Mono', monospace" }}>{rp(data.total.po.uangMasuk)}</td>
              <td style={{ padding: '10px 8px', borderRight: '1px solid #3d342b', textAlign: 'right', fontFamily: "'Space Mono', monospace" }}>{rp(data.total.po.ongkir)}</td>
              <td style={{ padding: '10px 8px', borderRight: '1px solid #3d342b', textAlign: 'right', fontFamily: "'Space Mono', monospace", color: '#34d399' }}>{rp(data.total.po.keuntungan)}</td>
              <td style={{ padding: '10px 8px', borderRight: '2px solid #3d342b', textAlign: 'center', fontFamily: "'Space Mono', monospace" }}>{data.total.po.margin.toFixed(1)}%</td>
              
              <td style={{ padding: '10px 8px', borderRight: '1px solid #3d342b', textAlign: 'center', fontFamily: "'Space Mono', monospace" }}>{data.total.ev.qty}</td>
              <td style={{ padding: '10px 8px', borderRight: '1px solid #3d342b', textAlign: 'right', fontFamily: "'Space Mono', monospace" }}>{rp(data.total.ev.penjualan)}</td>
              <td style={{ padding: '10px 8px', borderRight: '1px solid #3d342b', textAlign: 'right', fontFamily: "'Space Mono', monospace", color: '#34d399' }}>{rp(data.total.ev.keuntungan)}</td>
              <td style={{ padding: '10px 8px', borderRight: '2px solid #3d342b', textAlign: 'center', fontFamily: "'Space Mono', monospace" }}>{data.total.ev.penjualan > 0 ? (data.total.ev.keuntungan/data.total.ev.penjualan*100).toFixed(1) : '0.0'}%</td>
              
              <td style={{ padding: '10px 8px', borderRight: '1px solid #3d342b', textAlign: 'center', fontFamily: "'Space Mono', monospace", color: '#F2C015' }}>{data.total.tot.qty}</td>
              <td style={{ padding: '10px 8px', borderRight: '1px solid #3d342b', textAlign: 'right', fontFamily: "'Space Mono', monospace", color: '#F2C015' }}>{rp(data.total.tot.uangMasuk)}</td>
              <td style={{ padding: '10px 8px', borderRight: '1px solid #3d342b', textAlign: 'right', fontFamily: "'Space Mono', monospace", color: '#34d399' }}>{rp(data.total.tot.keuntungan)}</td>
              <td style={{ padding: '10px 8px', textAlign: 'center', fontFamily: "'Space Mono', monospace", color: '#F2C015' }}>{data.total.tot.margin.toFixed(1)}%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}




function RecapInvoiceTable({ data, biayaLainnya }) {
  const [manualAdjustments, setManualAdjustments] = useState([
    { id: 1, name: 'Reimbursement', amount: 93500, type: 'plus' },
    { id: 2, name: 'Jual Stiker', amount: 0, type: 'plus' },
    { id: 3, name: 'Kekurangan event', amount: 30000, type: 'minus' },
    { id: 4, name: 'Beli produk', amount: 950000, type: 'minus' }
  ]);

  const [extraDeductions, setExtraDeductions] = useState([
    { id: 1, name: 'Bang Kocu event', amount: 150000 },
    { id: 2, name: 'Raditya jamil 160k + 21k ongkir', amount: 181000 }
  ]);

  const addManual = () => {
    setManualAdjustments([...manualAdjustments, { id: Date.now(), name: '', amount: 0, type: 'minus' }]);
  };
  
  const updateManual = (id, field, value) => {
    setManualAdjustments(manualAdjustments.map(item => item.id === id ? { ...item, [field]: value } : item));
  };
  
  const removeManual = (id) => {
    setManualAdjustments(manualAdjustments.filter(item => item.id !== id));
  };

  const addExtra = () => {
    setExtraDeductions([...extraDeductions, { id: Date.now(), name: '', amount: 0 }]);
  };
  
  const updateExtra = (id, field, value) => {
    setExtraDeductions(extraDeductions.map(item => item.id === id ? { ...item, [field]: value } : item));
  };
  
  const removeExtra = (id) => {
    setExtraDeductions(extraDeductions.filter(item => item.id !== id));
  };

  const totalPenjualan = data.uangMasuk;
  const biayaProduksi = data.hpp;
  const biayaOngkir = data.ongkir;
  const totalProfit = totalPenjualan - biayaProduksi - biayaOngkir - biayaLainnya;

  const shareAcs = totalProfit * 0.35;
  const shareOp = totalProfit * 0.45;
  const shareTab = totalProfit * 0.20;

  let totalTransfer = shareAcs;
  manualAdjustments.forEach(adj => {
    if (adj.type === 'plus') totalTransfer += (Number(adj.amount) || 0);
    else totalTransfer -= (Number(adj.amount) || 0);
  });

  let grandFinal = totalTransfer;
  extraDeductions.forEach(ded => {
    grandFinal -= (Number(ded.amount) || 0);
  });

  const InputStyle = { background: 'transparent', border: 'none', borderBottom: '1px dashed #14110D', outline: 'none', fontFamily: "'Archivo'", fontSize: '13px', width: '100%', color: '#14110D' };
  const NumStyle = { ...InputStyle, textAlign: 'right', fontFamily: "'Space Mono', monospace", fontWeight: 700 };

  return (
    <div style={{ background: '#fff', border: '2px solid #14110D', marginBottom: '32px' }}>
      <div style={{ background: '#14110D', color: '#F2EEE4', padding: '12px 16px', fontSize: '14px', fontFamily: "'Archivo'", fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.02em', textAlign: 'center' }}>
        RECAP INVOICE ACS
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', minWidth: '100%', borderCollapse: 'collapse', fontSize: '13px', fontFamily: "'Archivo'" }}>
          <tbody>
            {/* SECTION 1: PROFIT */}
            <tr>
              <td style={{ padding: '8px 16px', borderRight: '1px solid #14110D', width: '60%' }}>Total Penjualan</td>
              <td style={{ padding: '8px 16px', textAlign: 'right', fontFamily: "'Space Mono', monospace", fontWeight: 700, color: '#2563eb' }}>{rp(totalPenjualan)}</td>
            </tr>
            <tr>
              <td style={{ padding: '8px 16px', borderRight: '1px solid #14110D' }}>- Biaya Produksi</td>
              <td style={{ padding: '8px 16px', textAlign: 'right', fontFamily: "'Space Mono', monospace", color: '#b45309' }}>{rp(biayaProduksi)}</td>
            </tr>
            <tr>
              <td style={{ padding: '8px 16px', borderRight: '1px solid #14110D' }}>- Biaya Ongkir</td>
              <td style={{ padding: '8px 16px', textAlign: 'right', fontFamily: "'Space Mono', monospace", color: '#b45309' }}>{rp(biayaOngkir)}</td>
            </tr>
            <tr>
              <td style={{ padding: '8px 16px', borderRight: '1px solid #14110D' }}>- Biaya lainnya</td>
              <td style={{ padding: '8px 16px', textAlign: 'right', fontFamily: "'Space Mono', monospace", color: '#b45309' }}>{rp(biayaLainnya)}</td>
            </tr>
            <tr style={{ background: 'rgba(242, 192, 21, 0.15)', fontWeight: 800 }}>
              <td style={{ padding: '10px 16px', borderRight: '1px solid #14110D' }}>Total Profit</td>
              <td style={{ padding: '10px 16px', textAlign: 'right', fontFamily: "'Space Mono', monospace", color: '#047857', fontSize: '15px' }}>{rp(totalProfit)}</td>
            </tr>
            <tr style={{ background: '#14110D', height: '16px' }}><td colSpan="2"></td></tr>

            {/* SECTION 2: PROFIT SHARING */}
            <tr>
              <td style={{ padding: '8px 16px', borderRight: '1px solid #14110D' }}>Share Profit ACS - (35%)</td>
              <td style={{ padding: '8px 16px', textAlign: 'right', fontFamily: "'Space Mono', monospace", color: '#047857', fontWeight: 700 }}>{rp(shareAcs)}</td>
            </tr>
            <tr>
              <td style={{ padding: '8px 16px', borderRight: '1px solid #14110D' }}>OP & Investasi - (45%)</td>
              <td style={{ padding: '8px 16px', textAlign: 'right', fontFamily: "'Space Mono', monospace", color: '#047857', fontWeight: 700 }}>{rp(shareOp)}</td>
            </tr>
            <tr>
              <td style={{ padding: '8px 16px', borderRight: '1px solid #14110D' }}>Laba ditahan & pengembangan bisnis (20%)</td>
              <td style={{ padding: '8px 16px', textAlign: 'right', fontFamily: "'Space Mono', monospace", color: '#047857', fontWeight: 700 }}>{rp(shareTab)}</td>
            </tr>
            <tr style={{ background: '#14110D', height: '16px' }}><td colSpan="2"></td></tr>

            {/* SECTION 3: TRANSFER */}
            <tr>
              <td style={{ padding: '8px 16px', borderRight: '1px solid #14110D' }}>Profit ACS</td>
              <td style={{ padding: '8px 16px', textAlign: 'right', fontFamily: "'Space Mono', monospace", fontWeight: 700 }}>{rp(shareAcs)}</td>
            </tr>
            {manualAdjustments.map((adj, idx) => (
              <tr key={adj.id}>
                <td style={{ padding: '8px 16px', borderRight: '1px solid #14110D', display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <select value={adj.type} onChange={e => updateManual(adj.id, 'type', e.target.value)} style={{ background: '#F2EEE4', border: '1px solid #14110D', outline: 'none', cursor: 'pointer' }}>
                    <option value="plus">+</option>
                    <option value="minus">-</option>
                  </select>
                  <input type="text" value={adj.name} onChange={e => updateManual(adj.id, 'name', e.target.value)} placeholder="Nama Penyesuaian" style={InputStyle} />
                  <button onClick={() => removeManual(adj.id)} style={{ background: '#ef4444', color: '#fff', border: 'none', cursor: 'pointer', padding: '2px 6px', fontSize: '10px' }}>X</button>
                </td>
                <td style={{ padding: '8px 16px', borderRight: '1px solid #14110D' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                    <span>Rp</span>
                    <input type="number" value={adj.amount === 0 ? '' : adj.amount} onChange={e => updateManual(adj.id, 'amount', e.target.value)} style={{...NumStyle, width: '100px', color: adj.type === 'plus' ? '#2563eb' : '#b45309'}} placeholder="0" />
                  </div>
                </td>
              </tr>
            ))}
            <tr>
              <td colSpan="2" style={{ padding: '4px 16px', borderBottom: '1px solid #14110D' }}>
                <button onClick={addManual} style={{ background: '#F2C015', border: '1px solid #14110D', padding: '4px 12px', fontSize: '11px', cursor: 'pointer', fontWeight: 700 }}>+ Tambah Baris Penyesuaian</button>
              </td>
            </tr>
            <tr style={{ background: '#F2EEE4', fontWeight: 800 }}>
              <td style={{ padding: '10px 16px', borderRight: '1px solid #14110D', textAlign: 'right', color: '#14110D' }}>TOTAL TRANSFER</td>
              <td style={{ padding: '10px 16px', textAlign: 'right', fontFamily: "'Space Mono', monospace", color: totalTransfer < 0 ? '#ef4444' : '#047857', fontSize: '15px' }}>{totalTransfer < 0 ? '-' : ''}{rp(Math.abs(totalTransfer))}</td>
            </tr>

            {/* SECTION 4: EXTRA DEDUCTIONS */}
            {extraDeductions.map((ded, idx) => (
              <tr key={ded.id}>
                <td style={{ padding: '8px 16px', borderRight: '1px solid #14110D', display: 'flex', gap: '8px', alignItems: 'center', paddingLeft: '32px' }}>
                  <span>-</span>
                  <input type="text" value={ded.name} onChange={e => updateExtra(ded.id, 'name', e.target.value)} placeholder="Nama Potongan Tambahan" style={InputStyle} />
                  <button onClick={() => removeExtra(ded.id)} style={{ background: '#ef4444', color: '#fff', border: 'none', cursor: 'pointer', padding: '2px 6px', fontSize: '10px' }}>X</button>
                </td>
                <td style={{ padding: '8px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                    <span>Rp</span>
                    <input type="number" value={ded.amount === 0 ? '' : ded.amount} onChange={e => updateExtra(ded.id, 'amount', e.target.value)} style={{...NumStyle, width: '100px'}} placeholder="0" />
                  </div>
                </td>
              </tr>
            ))}
            <tr>
              <td colSpan="2" style={{ padding: '4px 16px', paddingLeft: '32px', borderBottom: '1px solid #14110D' }}>
                <button onClick={addExtra} style={{ background: '#F2C015', border: '1px solid #14110D', padding: '4px 12px', fontSize: '11px', cursor: 'pointer', fontWeight: 700 }}>+ Tambah Potongan Akhir</button>
              </td>
            </tr>
            <tr style={{ background: '#F2EEE4', fontWeight: 800 }}>
              <td style={{ padding: '10px 16px', borderRight: '1px solid #14110D' }}></td>
              <td style={{ padding: '10px 16px', textAlign: 'right', fontFamily: "'Space Mono', monospace", color: grandFinal < 0 ? '#ef4444' : '#047857', fontSize: '16px' }}>{grandFinal < 0 ? '-' : ''}{rp(Math.abs(grandFinal))}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
function AssetTable({ data }) {
  if (!data) return null;
  return (
    <div style={{ background: '#fff', border: '2px solid #14110D', marginBottom: '32px' }}>
      <div style={{ background: '#14110D', color: '#F2EEE4', padding: '12px 16px', fontSize: '14px', fontFamily: "'Archivo'", fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.02em', textAlign: 'center' }}>
        ASET GUDANG — STOK AKHIR (tidak terpengaruh filter periode)
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', minWidth: '100%', borderCollapse: 'collapse', fontSize: '13px', fontFamily: "'Archivo'" }}>
          <tbody>
            {/* STOK AKHIR */}
            <tr style={{ borderBottom: '1px solid #ddd5c4', background: '#F2C015', color: '#14110D', fontWeight: 800 }}>
              <td style={{ padding: '10px 16px', textTransform: 'uppercase' }}>TOTAL STOK AKHIR GUDANG (pcs)</td>
              <td style={{ padding: '10px 16px', textAlign: 'right', fontFamily: "'Space Mono', monospace" }}>{data.stokAkhir.total}</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #ddd5c4' }}>
              <td style={{ padding: '8px 16px 8px 32px' }}>• Baju berukuran (pcs)</td>
              <td style={{ padding: '8px 16px', textAlign: 'right', fontFamily: "'Space Mono', monospace" }}>{data.stokAkhir.baju}</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #ddd5c4' }}>
              <td style={{ padding: '8px 16px 8px 32px' }}>• Satuan / sticker (pcs)</td>
              <td style={{ padding: '8px 16px', textAlign: 'right', fontFamily: "'Space Mono', monospace" }}>{data.stokAkhir.satuan}</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #14110D' }}>
              <td style={{ padding: '10px 16px', color: '#14110D' }}>Stok siap dijual (pcs)</td>
              <td style={{ padding: '10px 16px', textAlign: 'right', fontFamily: "'Space Mono', monospace", color: '#14110D' }}>{data.stokSiap.total}</td>
            </tr>
            {/* NILAI ASET */}
            <tr style={{ borderBottom: '1px solid #ddd5c4', background: '#F2C015', color: '#14110D', fontWeight: 800 }}>
              <td style={{ padding: '10px 16px', textTransform: 'uppercase' }}>NILAI ASET GUDANG (Rp)</td>
              <td style={{ padding: '10px 16px', textAlign: 'right', fontFamily: "'Space Mono', monospace", fontSize: '15px' }}>{rp(data.nilai.total)}</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #ddd5c4' }}>
              <td style={{ padding: '8px 16px 8px 32px' }}>• Nilai baju berukuran (Rp)</td>
              <td style={{ padding: '8px 16px', textAlign: 'right', fontFamily: "'Space Mono', monospace", color: '#14110D' }}>{rp(data.nilai.baju)}</td>
            </tr>
            <tr>
              <td style={{ padding: '8px 16px 8px 32px' }}>• Nilai satuan / sticker (Rp)</td>
              <td style={{ padding: '8px 16px', textAlign: 'right', fontFamily: "'Space Mono', monospace", color: '#14110D' }}>{rp(data.nilai.satuan)}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div style={{ background: '#F2EEE4', padding: '12px 16px', fontSize: '11px', color: '#14110D', fontStyle: 'italic', borderTop: '1px solid #14110D' }}>
        Sumber: sheet STOCK DASHBOARD. Stok akhir = posisi fisik gudang saat ini (termasuk barang yang sudah dipesan tapi belum dikirim). Stok siap dijual = stok akhir dikurangi order yang belum dikirim.
      </div>
    </div>
  );
}
function ProfitSharingTable({ bersih }) {
  const pAcs = bersih * 0.35;
  const pOp = bersih * 0.45;
  const pTab = bersih * 0.20;

  return (
    <div style={{ background: '#fff', border: '2px solid #14110D', marginBottom: '32px' }}>
      <div style={{ background: '#14110D', color: '#F2EEE4', padding: '12px 16px', fontSize: '14px', fontFamily: "'Archivo'", fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.02em', textAlign: 'center' }}>
        PROFIT SHARING (dari Total Untung)
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', minWidth: '100%', borderCollapse: 'collapse', fontSize: '13px', fontFamily: "'Archivo'" }}>
          <thead style={{ background: '#F2EEE4', borderBottom: '2px solid #14110D' }}>
            <tr>
              <th style={{ padding: '12px', borderRight: '1px solid #14110D', textAlign: 'center', width: '33.33%' }}>ACS (35%)</th>
              <th style={{ padding: '12px', borderRight: '1px solid #14110D', textAlign: 'center', width: '33.33%' }}>Op & Inves (45%)</th>
              <th style={{ padding: '12px', textAlign: 'center', width: '33.33%' }}>Tabungan (20%)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '16px', borderRight: '1px solid #14110D', textAlign: 'center', fontFamily: "'Space Mono', monospace", fontWeight: 900, fontSize: '18px', color: '#047857', background: 'rgba(242, 192, 21, 0.1)' }}>{rp(pAcs)}</td>
              <td style={{ padding: '16px', borderRight: '1px solid #14110D', textAlign: 'center', fontFamily: "'Space Mono', monospace", fontWeight: 900, fontSize: '18px', color: '#047857', background: 'rgba(242, 192, 21, 0.1)' }}>{rp(pOp)}</td>
              <td style={{ padding: '16px', textAlign: 'center', fontFamily: "'Space Mono', monospace", fontWeight: 900, fontSize: '18px', color: '#047857', background: 'rgba(242, 192, 21, 0.1)' }}>{rp(pTab)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
function GrandTotalTable({ data, biayaLainnya, setBiayaLainnya }) {
  const bersih = data.keuntungan - biayaLainnya;
  return (
    <div style={{ background: '#fff', border: '2px solid #14110D', marginBottom: '32px' }}>
      <div style={{ background: '#14110D', color: '#F2EEE4', padding: '12px 16px', fontSize: '14px', fontFamily: "'Archivo'", fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.02em', textAlign: 'center' }}>
        RINGKASAN TOTAL — SELURUH PENJUALAN (PO + EVENT), mengikuti filter
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', minWidth: '100%', borderCollapse: 'collapse', fontSize: '13px', fontFamily: "'Archivo'" }}>
          <thead style={{ background: '#F2EEE4', borderBottom: '2px solid #14110D' }}>
            <tr>
              <th style={{ padding: '12px', borderRight: '1px solid #14110D', textAlign: 'center', width: '20%' }}>Qty Terjual (pcs)</th>
              <th style={{ padding: '12px', borderRight: '1px solid #14110D', textAlign: 'center', width: '30%' }}>Total Uang Masuk (Rp)<br/><span style={{fontSize: '10px'}}>(harga barang + ongkir)</span></th>
              <th style={{ padding: '12px', borderRight: '1px solid #14110D', textAlign: 'center', width: '25%' }}>Biaya Lainnya</th>
              <th style={{ padding: '12px', textAlign: 'center', background: 'rgba(242, 192, 21, 0.15)', color: '#14110D', width: '25%' }}>Total Keuntungan (Rp)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '16px', borderRight: '1px solid #14110D', textAlign: 'center', fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: '16px', color: '#14110D' }}>{data.qty}</td>
              <td style={{ padding: '16px', borderRight: '1px solid #14110D', textAlign: 'center', fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: '16px', color: '#14110D' }}>{rp(data.uangMasuk)}</td>
              <td style={{ padding: '16px', borderRight: '1px solid #14110D', textAlign: 'center', fontFamily: "'Space Mono', monospace", fontWeight: 700, color: '#14110D' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <span>Rp</span>
                  <input 
                    type="number" 
                    value={biayaLainnya || ''} 
                    onChange={e => setBiayaLainnya(Number(e.target.value))}
                    placeholder="0"
                    style={{ width: '120px', padding: '4px 8px', fontFamily: "'Space Mono', monospace", fontSize: '16px', fontWeight: 700, border: '2px solid #14110D', outline: 'none', color: '#14110D', textAlign: 'right' }}
                  />
                </div>
              </td>
              <td style={{ padding: '16px', textAlign: 'center', fontFamily: "'Space Mono', monospace", fontWeight: 900, fontSize: '18px', color: '#14110D', background: 'rgba(242, 192, 21, 0.15)' }}>{rp(bersih)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
export default function Dashboard() {
  const { data } = useStore();
    const [biayaLainnya, setBiayaLainnya] = useState(0);
  const [f, setF] = useState({ sku: [], product: [], paketUkuran: [], ukuran: [], pengiriman: [], metodeBayar: [], statusKirim: [], statusBayar: [], periodeDari: '', periodeSampai: '', sumberPenjualan: [] });

  const orders = useMemo(() => data.orders || [], [data.orders]);
  const assetAgg = useMemo(() => {
    let siapBaju = 0, siapSatuan = 0;
    let pendingBaju = 0, pendingSatuan = 0;
    let nilaiBaju = 0, nilaiSatuan = 0;

    (data.products || []).forEach(prod => {
      let stockObj = {};
      try {
        if (typeof prod.stock === 'string') {
           stockObj = JSON.parse(prod.stock);
           if (typeof stockObj === 'string') stockObj = JSON.parse(stockObj);
        } else if (typeof prod.stock === 'object') {
           stockObj = prod.stock;
        }
      } catch (e) {}

      Object.entries(stockObj || {}).forEach(([size, qty]) => {
        qty = parseInt(qty) || 0;
        if (qty <= 0) return;

        const isSatuan = size === 'One Size' || size === 'Satuan' || size === 'Lainnya';
        const overXxl = ['XXL', '3XL', '4XL', '5XL'].includes(size);
        let hpp = overXxl ? (prod.hpp_more_xxl_unit || prod.hpp_less_xxl_unit || 0) : (prod.hpp_less_xxl_unit || 0);
        if (!hpp && prod.costs) {
          hpp = (prod.costs.production || 0) + (prod.costs.kemasan || 0) + (prod.costs.stiker || 0);
        }

        if (isSatuan) {
          siapSatuan += qty;
          // Nilai dihitung dari Stok Akhir (Fisik) nanti, tapi kita simpan HPP-nya dulu.
          // Wait, we need to add pending to get fisik first.
        } else {
          siapBaju += qty;
        }
      });
    });

    (data.orders || []).forEach(ord => {
      if (ord.status === 'Cancelled' || ord.status === 'Shipped') return;
      (ord.items || []).forEach(it => {
        const size = it.size;
        const isSatuan = size === 'One Size' || size === 'Satuan' || size === 'Lainnya';
        if (isSatuan) pendingSatuan += it.qty;
        else pendingBaju += it.qty;
      });
    });

    const akhirBaju = siapBaju + pendingBaju;
    const akhirSatuan = siapSatuan + pendingSatuan;

    // Hitung Nilai dari Stok Akhir Fisik (harus dilooping ulang atau dirata-rata).
    // Karena kita tidak tahu exactly pending order HPP if we just add it globally, we should iterate again.
    // Let's do it properly.
    let totalFisikBajuValue = 0, totalFisikSatuanValue = 0;
    
    // First, accumulate stock per product-size
    const stockMap = {};
    (data.products || []).forEach(prod => {
      let stockObj = {};
      try {
        if (typeof prod.stock === 'string') {
           stockObj = JSON.parse(prod.stock);
           if (typeof stockObj === 'string') stockObj = JSON.parse(stockObj);
        } else if (typeof prod.stock === 'object') stockObj = prod.stock;
      } catch (e) {}

      Object.entries(stockObj || {}).forEach(([size, qty]) => {
        qty = parseInt(qty) || 0;
        const overXxl = ['XXL', '3XL', '4XL', '5XL'].includes(size);
        let hpp = overXxl ? (prod.hpp_more_xxl_unit || prod.hpp_less_xxl_unit || 0) : (prod.hpp_less_xxl_unit || 0);
        if (!hpp && prod.costs) hpp = (prod.costs.production || 0) + (prod.costs.kemasan || 0) + (prod.costs.stiker || 0);
        
        const key = prod.id + '_' + size;
        stockMap[key] = { qty, hpp, isSatuan: (size === 'One Size' || size === 'Satuan' || size === 'Lainnya') };
      });
    });

    // Add pending orders to the physical stock
    (data.orders || []).forEach(ord => {
      if (ord.status === 'Cancelled' || ord.status === 'Shipped') return;
      (ord.items || []).forEach(it => {
        const prod = it.product;
        if (!prod) return;
        const size = it.size;
        const key = prod.id + '_' + size;
        if (stockMap[key]) {
          stockMap[key].qty += it.qty;
        } else {
          // if it doesn't exist in stockMap, it means DB stock was 0 or not set, but we have a pending order.
          const overXxl = ['XXL', '3XL', '4XL', '5XL'].includes(size);
          let hpp = overXxl ? (prod.hpp_more_xxl_unit || prod.hpp_less_xxl_unit || 0) : (prod.hpp_less_xxl_unit || 0);
          if (!hpp && prod.costs) hpp = (prod.costs.production || 0) + (prod.costs.kemasan || 0) + (prod.costs.stiker || 0);
          stockMap[key] = { qty: it.qty, hpp, isSatuan: (size === 'One Size' || size === 'Satuan' || size === 'Lainnya') };
        }
      });
    });

    Object.values(stockMap).forEach(item => {
      if (item.isSatuan) totalFisikSatuanValue += (item.qty * item.hpp);
      else totalFisikBajuValue += (item.qty * item.hpp);
    });

    return {
      stokAkhir: { baju: akhirBaju, satuan: akhirSatuan, total: akhirBaju + akhirSatuan },
      stokSiap: { total: siapBaju + siapSatuan },
      nilai: { baju: totalFisikBajuValue, satuan: totalFisikSatuanValue, total: totalFisikBajuValue + totalFisikSatuanValue }
    };
  }, [data.products, data.orders]);

  const payMethodLabel = (val) => {
    if (val === 'transfer_bca') return 'Transfer BCA';
    if (val === 'qris') return 'QRIS';
    if (val === 'manual') return 'Manual';
    return val || 'Lainnya';
  };

  const getPaketForSize = (size) => {
    const set = data.sizeSets?.find(ss => (ss.sizes || []).includes(size));
    return set ? set.name : 'Lainnya';
  };

  const opts = useMemo(() => {
    const o = {
      sku: new Set(data.productParents?.map(p => p.sku).filter(Boolean) || []),
      product: new Set((data.products || []).map(p => p.name).filter(Boolean)),
      ukuran: new Set(),
      paketUkuran: new Set(data.sizeSets?.map(ss => ss.name).filter(Boolean) || []),
      pengiriman: new Set(['Gratis/Ambil Sendiri']),
      metodeBayar: new Set(['Transfer BCA', 'QRIS']),
      statusKirim: new Set(['Dikirim', 'Belum Dikirim']),
      statusBayar: new Set(['Lunas', 'Belum Bayar']),
      sumberPenjualan: new Set(['PO', 'Event'])
    };
    
    (data.sizeSets || []).forEach(ss => {
      (ss.sizes || []).forEach(s => {
        if (s !== 'One Size') o.ukuran.add(s);
      });
    });

    orders.forEach(ord => {
      if (ord.payment_method) o.metodeBayar.add(payMethodLabel(ord.payment_method));
      if (ord.shipping_cost > 0) {
        o.pengiriman.add(ord.shipping_service || 'Berbayar (Tanpa Keterangan)');
      }
    });

    return { 
      sku: [...o.sku].sort(), 
      product: [...o.product].sort(), 
      paketUkuran: [...o.paketUkuran].sort(),
      ukuran: [...o.ukuran], 
      pengiriman: [...o.pengiriman], 
      metodeBayar: [...o.metodeBayar], 
      statusKirim: [...o.statusKirim], 
      statusBayar: [...o.statusBayar], 
      sumberPenjualan: [...o.sumberPenjualan] 
    };
  }, [orders, data]);

  const filteredOrders = useMemo(() => {
    return orders.filter(ord => {
      if (f.periodeDari && ord.created_at < f.periodeDari) return false;
      if (f.periodeSampai && ord.created_at > f.periodeSampai + 'T23:59:59') return false;
      const stBayar = ['Paid', 'Producing', 'Shipped'].includes(ord.status) ? 'Lunas' : 'Belum Bayar';
      if (f.statusBayar.length > 0 && !f.statusBayar.includes(stBayar)) return false;
      const stKirim = ord.status === 'Shipped' ? 'Dikirim' : 'Belum Dikirim';
      if (f.statusKirim.length > 0 && !f.statusKirim.includes(stKirim)) return false;
      if (f.metodeBayar.length > 0 && !f.metodeBayar.includes(payMethodLabel(ord.payment_method))) return false;
      const stSumber = ord.type === 'preorder' ? 'PO' : 'Event';
      if (f.sumberPenjualan.length > 0 && !f.sumberPenjualan.includes(stSumber)) return false;
      return true;
    });
  }, [orders, f]);

  const calcAgg = (isPo) => {
    let terjual = 0, uangMasuk = 0, totalOngkir = 0, totalHpp = 0, totalPenjualan = 0;
    const processedOrders = new Set();

    filteredOrders.forEach(ord => {
      if (isPo !== (ord.type === 'preorder')) return;
      if (ord.status === 'Cancelled') return;
      
      if (f.pengiriman.length > 0) {
        const p = ord.shipping_cost > 0 
           ? (ord.shipping_service || 'Berbayar (Tanpa Keterangan)') 
           : 'Gratis/Ambil Sendiri';
        if (!f.pengiriman.includes(p)) return;
      }

      let ordMatchedItems = 0, ordHpp = 0, ordBarangRevenue = 0;
      (ord.items || []).forEach(it => {
        const sku = it.product?.product_parent?.sku || (it.product?.code || '').split('-')[0];
        if (f.sku.length > 0 && !f.sku.includes(sku)) return;
        if (f.product.length > 0 && !f.product.includes(it.product?.name)) return;
        if (f.ukuran.length > 0 && !f.ukuran.includes(it.size)) return;
        if (f.paketUkuran.length > 0 && !f.paketUkuran.includes(getPaketForSize(it.size))) return;
        
        ordMatchedItems += it.qty;
        ordBarangRevenue += (it.price * it.qty);
        
        const prod = it.product || {};
        const overXxl = ['XXL', '3XL', '4XL', '5XL'].includes(it.size);
        let hpp = overXxl ? (prod.hpp_more_xxl_unit || prod.hpp_less_xxl_unit || 0) : (prod.hpp_less_xxl_unit || 0);
        if (!hpp && prod.costs) hpp = (prod.costs.production || 0) + (prod.costs.kemasan || 0) + (prod.costs.stiker || 0);
        ordHpp += (hpp * it.qty);
      });

      if (ordMatchedItems > 0) {
        terjual += ordMatchedItems;
        totalHpp += ordHpp;
        totalPenjualan += ordBarangRevenue;
        if (!processedOrders.has(ord.id)) {
          processedOrders.add(ord.id);
          totalOngkir += (ord.shipping_cost || 0);
        }
      }
    });

    uangMasuk = totalPenjualan + totalOngkir;
    const keuntungan = totalPenjualan - totalHpp;
    const selisihOngkir = 0;
    const margin = totalPenjualan > 0 ? (keuntungan / totalPenjualan) * 100 : 0;
    const rataUntung = terjual > 0 ? (keuntungan / terjual) : 0;
    return { terjual, uangMasuk, totalOngkir, totalHpp, totalPenjualan, keuntungan, selisihOngkir, margin, rataUntung };
  };

  const getBreakdowns = () => {
    const aggs = { pengiriman: {}, pembayaran: {}, statusBayar: {}, statusKirim: {} };
    const pSizeAgg = {};
    const pFin = {};
    const sizeSetCols = new Set();
    const initBucket = () => ({ qty: 0, penjualan: 0, hpp: 0 });
    const initFin = () => ({ po: { qty: 0, penjualan: 0, ongkir: 0, hpp: 0 }, ev: { qty: 0, penjualan: 0, hpp: 0 } });

    filteredOrders.forEach(ord => {
      if (ord.status === 'Cancelled') return;
      
      const bPengiriman = ord.shipping_cost > 0 ? (ord.shipping_service ? `Ekspedisi - ${ord.shipping_service}` : 'Ekspedisi (Lainnya)') : 'Gratis/Ambil Sendiri';
      const bPembayaran = payMethodLabel(ord.payment_method);
      const bStatusBayar = ['Paid', 'Producing', 'Shipped'].includes(ord.status) ? 'Lunas' : (ord.status === 'Cancelled' ? 'Cancel' : 'Belum Bayar');
      const bStatusKirim = ord.status === 'Shipped' ? 'Sudah Dikirim' : 'Belum Dikirim';

      if (f.pengiriman.length > 0) {
        const p = ord.shipping_cost > 0 ? (ord.shipping_service || 'Berbayar (Tanpa Keterangan)') : 'Gratis/Ambil Sendiri';
        if (!f.pengiriman.includes(p)) return;
      }

      let matchedItems = [];
      let ordMatchedItems = 0;
      let ordHpp = 0;
      let ordBarangRevenue = 0;

      (ord.items || []).forEach(it => {
        const sku = it.product?.product_parent?.sku || (it.product?.code || '').split('-')[0];
        if (f.sku.length > 0 && !f.sku.includes(sku)) return;
        if (f.product.length > 0 && !f.product.includes(it.product?.name)) return;
        if (f.ukuran.length > 0 && !f.ukuran.includes(it.size)) return;
        if (f.paketUkuran.length > 0 && !f.paketUkuran.includes(getPaketForSize(it.size))) return;
        
        const prod = it.product || {};
        const overXxl = ['XXL', '3XL', '4XL', '5XL'].includes(it.size);
        let hpp = overXxl ? (prod.hpp_more_xxl_unit || prod.hpp_less_xxl_unit || 0) : (prod.hpp_less_xxl_unit || 0);
        if (!hpp && prod.costs) hpp = (prod.costs.production || 0) + (prod.costs.kemasan || 0) + (prod.costs.stiker || 0);
        
        ordMatchedItems += it.qty;
        ordBarangRevenue += (it.price * it.qty);
        ordHpp += (hpp * it.qty);
        
        matchedItems.push({ ...it, computedHpp: hpp });
      });

      if (ordMatchedItems > 0) {
        // Breakdowns aggregation
        if (!aggs.pengiriman[bPengiriman]) aggs.pengiriman[bPengiriman] = initBucket();
        aggs.pengiriman[bPengiriman].qty += ordMatchedItems;
        aggs.pengiriman[bPengiriman].penjualan += ordBarangRevenue;
        aggs.pengiriman[bPengiriman].hpp += ordHpp;

        if (!aggs.pembayaran[bPembayaran]) aggs.pembayaran[bPembayaran] = initBucket();
        aggs.pembayaran[bPembayaran].qty += ordMatchedItems;
        aggs.pembayaran[bPembayaran].penjualan += ordBarangRevenue;
        aggs.pembayaran[bPembayaran].hpp += ordHpp;

        if (!aggs.statusBayar[bStatusBayar]) aggs.statusBayar[bStatusBayar] = initBucket();
        aggs.statusBayar[bStatusBayar].qty += ordMatchedItems;
        aggs.statusBayar[bStatusBayar].penjualan += ordBarangRevenue;
        aggs.statusBayar[bStatusBayar].hpp += ordHpp;

        if (!aggs.statusKirim[bStatusKirim]) aggs.statusKirim[bStatusKirim] = initBucket();
        aggs.statusKirim[bStatusKirim].qty += ordMatchedItems;
        aggs.statusKirim[bStatusKirim].penjualan += ordBarangRevenue;
        aggs.statusKirim[bStatusKirim].hpp += ordHpp;

        // Financial & Size aggregation
        const isPo = ord.type === 'preorder';
        const totalOngkir = ord.shipping_cost || 0;

        matchedItems.forEach(it => {
          const prodName = it.product?.name || 'Unknown Product';
          
          // Size
          let sizeName = it.size || 'Lainnya';
          if (sizeName === 'One Size') sizeName = 'Satuan';
          if (!pSizeAgg[prodName]) pSizeAgg[prodName] = { total: 0 };
          if (!pSizeAgg[prodName][sizeName]) pSizeAgg[prodName][sizeName] = 0;
          pSizeAgg[prodName][sizeName] += it.qty;
          pSizeAgg[prodName].total += it.qty;
          sizeSetCols.add(sizeName);

          // Financial
          if (!pFin[prodName]) pFin[prodName] = initFin();
          const bucket = isPo ? pFin[prodName].po : pFin[prodName].ev;
          const itemRevenue = it.price * it.qty;
          const apportionedOngkir = (it.qty / ordMatchedItems) * totalOngkir;
          const itemHpp = it.computedHpp * it.qty;

          bucket.qty += it.qty;
          bucket.penjualan += itemRevenue;
          bucket.hpp += itemHpp;
          if (isPo) bucket.ongkir += apportionedOngkir;
        });
      }
    });

    const formatBucket = (obj) => {
      const rows = Object.entries(obj).map(([key, val]) => ({
        label: key, qty: val.qty, penjualan: val.penjualan, untung: val.penjualan - val.hpp
      })).sort((a, b) => b.qty - a.qty);
      const total = rows.reduce((acc, r) => {
        acc.qty += r.qty; acc.penjualan += r.penjualan; acc.untung += r.untung; return acc;
      }, { qty: 0, penjualan: 0, untung: 0 });
      return { rows, total };
    };

    const sizeOrder = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL', '5XL', '6XL', '7XL', '8XL', 'Satuan', 'Lainnya'];
    const sortedSizes = [...sizeSetCols].sort((a, b) => {
      let ia = sizeOrder.indexOf(a);
      let ib = sizeOrder.indexOf(b);
      if (ia === -1) ia = 999;
      if (ib === -1) ib = 999;
      if (ia === ib) return a.localeCompare(b);
      return ia - ib;
    });

    const sizeRows = Object.entries(pSizeAgg).map(([prod, sizes]) => ({
      prod, ...sizes
    })).sort((a,b) => a.prod.localeCompare(b.prod));

    const sizeTotals = { total: 0 };
    sortedSizes.forEach(s => sizeTotals[s] = 0);
    sizeRows.forEach(row => {
      sortedSizes.forEach(s => {
        if (row[s]) sizeTotals[s] += row[s];
      });
      sizeTotals.total += row.total;
    });

    const finRows = Object.entries(pFin).map(([prod, data]) => {
      const poKeuntungan = data.po.penjualan - data.po.hpp;
      const poUangMasuk = data.po.penjualan + data.po.ongkir;
      const poMargin = data.po.penjualan > 0 ? (poKeuntungan / data.po.penjualan) * 100 : 0;

      const evKeuntungan = data.ev.penjualan - data.ev.hpp;
      const evUangMasuk = data.ev.penjualan; 

      const totalQty = data.po.qty + data.ev.qty;
      const totalUangMasuk = poUangMasuk + evUangMasuk;
      const totalKeuntungan = poKeuntungan + evKeuntungan;
      const totalPenjualan = data.po.penjualan + data.ev.penjualan;
      const totalMargin = totalPenjualan > 0 ? (totalKeuntungan / totalPenjualan) * 100 : 0;

      return {
        prod,
        po: { qty: data.po.qty, uangMasuk: poUangMasuk, ongkir: data.po.ongkir, hpp: data.po.hpp, keuntungan: poKeuntungan, margin: poMargin },
        ev: { qty: data.ev.qty, penjualan: data.ev.penjualan, hpp: data.ev.hpp, keuntungan: evKeuntungan },
        tot: { qty: totalQty, uangMasuk: totalUangMasuk, keuntungan: totalKeuntungan, margin: totalMargin }
      };
    }).sort((a,b) => a.prod.localeCompare(b.prod));

    const finTot = {
      po: { qty: 0, uangMasuk: 0, ongkir: 0, hpp: 0, keuntungan: 0 },
      ev: { qty: 0, penjualan: 0, hpp: 0, keuntungan: 0 },
      tot: { qty: 0, uangMasuk: 0, keuntungan: 0 }
    };
    
    let sumPoPenjualan = 0;
    let sumTotPenjualan = 0;

    finRows.forEach(r => {
      finTot.po.qty += r.po.qty; finTot.po.uangMasuk += r.po.uangMasuk; finTot.po.ongkir += r.po.ongkir; finTot.po.hpp += r.po.hpp; finTot.po.keuntungan += r.po.keuntungan;
      sumPoPenjualan += (r.po.uangMasuk - r.po.ongkir);

      finTot.ev.qty += r.ev.qty; finTot.ev.penjualan += r.ev.penjualan; finTot.ev.hpp += r.ev.hpp; finTot.ev.keuntungan += r.ev.keuntungan;
      
      finTot.tot.qty += r.tot.qty; finTot.tot.uangMasuk += r.tot.uangMasuk; finTot.tot.keuntungan += r.tot.keuntungan;
      sumTotPenjualan += (r.tot.uangMasuk - r.po.ongkir);
    });

    finTot.po.margin = sumPoPenjualan > 0 ? (finTot.po.keuntungan / sumPoPenjualan) * 100 : 0;
    finTot.tot.margin = sumTotPenjualan > 0 ? (finTot.tot.keuntungan / sumTotPenjualan) * 100 : 0;

    return {
      pengiriman: formatBucket(aggs.pengiriman),
      pembayaran: formatBucket(aggs.pembayaran),
      statusBayar: formatBucket(aggs.statusBayar),
      statusKirim: formatBucket(aggs.statusKirim),
      productSizes: { sizes: sortedSizes, rows: sizeRows, total: sizeTotals },
      productFinancials: { rows: finRows, total: finTot }
    };
  };
  const po = calcAgg(true);
  const ev = calcAgg(false);
  const bd = getBreakdowns();

  return (
    <>
      <style>{`
        .dash-layout-grid { display: grid; grid-template-columns: 320px 1fr; gap: 32px; align-items: start; }
        .dash-breakdown-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; align-items: start; }
        .dash-summary-grid { display: grid; grid-template-columns: repeat(4, 1fr); border-bottom: 2px solid #14110D; background: #fff; }
        .dash-summary-grid-event { display: grid; grid-template-columns: repeat(3, 1fr); border-bottom: 2px solid #14110D; background: #fff; }
        .dash-summary-grid-bottom { display: grid; grid-template-columns: repeat(4, 1fr); background: #fff; }
        .dash-summary-grid-event-bottom { display: grid; grid-template-columns: repeat(3, 1fr); background: #fff; }
        
        @media (max-width: 900px) { 
          .dash-layout-grid { grid-template-columns: 1fr; } 
          .dash-breakdown-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 600px) {
          .dash-summary-grid, .dash-summary-grid-bottom, .dash-summary-grid-event, .dash-summary-grid-event-bottom {
            grid-template-columns: 1fr 1fr;
          }
        }
      `}</style>
      <div>
        <div style={{ background: '#14110D', color: '#F2EEE4', padding: '16px 24px', fontSize: '24px', fontFamily: "'Archivo'", fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.02em' }}>
          DASHBOARD REKAP PENJUALAN & KEUNTUNGAN - ACS
        </div>
        <div style={{ background: '#F2C015', color: '#14110D', padding: '12px 24px', fontSize: '11px', fontFamily: "'Space Mono', monospace", fontWeight: 700, display: 'flex', gap: '12px', marginBottom: '32px', borderBottom: '2px solid #14110D' }}>
          <span>Semua angka pada dashboard ini mengikuti FILTER di sebelah kiri (termasuk periode).</span>
          <span>|</span>
          <span>Sumber data: Sistem Database ACS</span>
        </div>

        <div className="dash-layout-grid">
          <div style={{ border: '2px solid #14110D', background: '#fff' }}>
            <div style={{ background: '#14110D', color: '#F2EEE4', padding: '12px', fontSize: '14px', fontFamily: "'Archivo'", fontWeight: 800, textAlign: 'center', letterSpacing: '0.05em' }}>FILTER</div>
            <MultiSelect label="SKU" options={opts.sku} value={f.sku} onChange={v => setF({...f, sku: v})} />
            <MultiSelect label="Product" options={opts.product} value={f.product} onChange={v => setF({...f, product: v})} />
            <MultiSelect label="Paket Ukuran" options={opts.paketUkuran} value={f.paketUkuran} onChange={v => setF({...f, paketUkuran: v})} />
            <MultiSelect label="Ukuran" options={opts.ukuran} value={f.ukuran} onChange={v => setF({...f, ukuran: v})} />
            <MultiSelect label="Pengiriman" options={opts.pengiriman} value={f.pengiriman} onChange={v => setF({...f, pengiriman: v})} />
            <MultiSelect label="Metode Bayar" options={opts.metodeBayar} value={f.metodeBayar} onChange={v => setF({...f, metodeBayar: v})} />
            <MultiSelect label="Status Kirim" options={opts.statusKirim} value={f.statusKirim} onChange={v => setF({...f, statusKirim: v})} />
            <MultiSelect label="Status Bayar" options={opts.statusBayar} value={f.statusBayar} onChange={v => setF({...f, statusBayar: v})} />
            <DateSelect label="Periode Dari" value={f.periodeDari} onChange={v => setF({...f, periodeDari: v})} />
            <DateSelect label="Periode Sampai" value={f.periodeSampai} onChange={v => setF({...f, periodeSampai: v})} />
            <div style={{ borderBottom: 'none' }}>
              <MultiSelect label="Sumber Penjualan" options={opts.sumberPenjualan} value={f.sumberPenjualan} onChange={v => setF({...f, sumberPenjualan: v})} />
            </div>
          </div>

          <div style={{ minWidth: 0 }}>
            <SummaryCard title="RINGKASAN (mengikuti filter) PO" data={po} isEvent={false} />
            <SummaryCard title="RINGKASAN EVENT (mengikuti filter SKU, Produk, Metode Bayar, Status Bayar)" data={ev} isEvent={true} />
            <GrandTotalTable data={bd.productFinancials.total.tot} biayaLainnya={biayaLainnya} setBiayaLainnya={setBiayaLainnya} />
              <ProfitSharingTable bersih={bd.productFinancials.total.tot.keuntungan - biayaLainnya} />
            
            <ProductFinancialTable data={bd.productFinancials} />
            <ProductSizeTable data={bd.productSizes} />

            <RecapInvoiceTable data={bd.productFinancials.total.tot} biayaLainnya={biayaLainnya} />
              <AssetTable data={assetAgg} />
            <div className="dash-breakdown-grid">
              <BreakdownTable title="PER JENIS PENGIRIMAN / PENGAMBILAN" headerLabel="Jenis" data={bd.pengiriman} />
              <BreakdownTable title="PER METODE PEMBAYARAN (PO + EVENT)" headerLabel="Metode" data={bd.pembayaran} />
              <BreakdownTable title="PER STATUS BAYAR" headerLabel="Status" data={bd.statusBayar} />
              <BreakdownTable title="PER STATUS KIRIM" headerLabel="Status" data={bd.statusKirim} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
































