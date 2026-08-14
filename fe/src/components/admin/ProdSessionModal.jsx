import React, { useContext, useState, useEffect } from 'react';
import { useStore } from '../../store';
import { rp } from '../../utils/helpers';

const blankBatch = () => ({
  name: '', date: '', qty: '', price: '', compareAt: '', sizes: '',
  produksi: '', kemasan: '', stiker: '',
  colors: [],
  profitBase: 'harga',
  mediaPct: 30, mediaRole: '',
  desainPct: 30, desainRole: '',
  prodPct: 25, prodRole: '',
  investorPct: 0, investorRole: '',
  storePct: 15
});

const PCT_OPTIONS = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50];

export default function ProdSessionModal() {
  const { data, setData, state, updateState } = useStore();
  const [nps, setNps] = useState(blankBatch());

  const pid = state.prodSessionPid;
  const p = data.PRODUCTS.find((x) => x.id === pid);
  const colorOptions = (data.colorOptions || []).filter((c) => c.active !== false);
  const roles = data.roles || [];

  useEffect(() => {
    if (state.prodSessionModal && p) {
      const n = (p.productionSessions?.length || 0) + 1;
      const nm = 'PRODUKSI ' + (n < 10 ? '0' + n : n);
      setNps({
        ...blankBatch(),
        name: nm,
        price: String(p.price || ''),
        compareAt: String(p.compareAt || ''),
        sizes: (p.sizes || []).join(', '),
        produksi: String(p.costs?.production || ''),
        kemasan: String(p.costs?.kemasan || ''),
        stiker: String(p.costs?.stiker || ''),
        colors: p.colors ? p.colors.map((c) => ({ ...c })) : []
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.prodSessionModal, pid]);

  if (!state.prodSessionModal || !p) return null;

  const close = () => updateState({ prodSessionModal: false, prodSessionPid: null });
  const set = (k) => (ev) => setNps({ ...nps, [k]: ev.target.value });
  const setNum = (k) => (ev) => setNps({ ...nps, [k]: parseInt(ev.target.value) || 0 });

  const inputStyle = { width: '100%', padding: '12px', border: '2px solid #14110D', background: '#fff', fontFamily: "'Space Mono', monospace", fontSize: '14px' };
  const labelStyle = { fontFamily: "'Space Mono', monospace", fontSize: '10px', letterSpacing: '0.06em', textTransform: 'uppercase', color: '#6b655a', marginBottom: '5px', display: 'block' };

  const toggleColor = (hex, name) => {
    const cs = (nps.colors || []).slice();
    const i = cs.findIndex((c) => c.hex === hex);
    if (i >= 0) cs.splice(i, 1);
    else cs.push({ name: name || hex, hex });
    setNps({ ...nps, colors: cs });
  };

  const price = parseInt(nps.price) || 0;
  const totalBiaya = (parseInt(nps.produksi) || 0) + (parseInt(nps.kemasan) || 0) + (parseInt(nps.stiker) || 0);
  const gross = price - totalBiaya;
  const isGross = nps.profitBase === 'gross';
  const base = isGross ? gross : price;

  const roleOptions = () => [{ value: '', label: '— pilih peran —' }].concat(roles.map((r) => ({ value: r.id, label: r.name })));

  const profitRows = [
    { label: 'Media Platform', hasRole: true, pctKey: 'mediaPct', roleKey: 'mediaRole' },
    { label: 'Desain & Kreatif', hasRole: true, pctKey: 'desainPct', roleKey: 'desainRole' },
    { label: 'Produksi & Pengiriman', hasRole: true, pctKey: 'prodPct', roleKey: 'prodRole' },
    { label: 'Investor', hasRole: true, pctKey: 'investorPct', roleKey: 'investorRole' },
    { label: 'Store Platform', hasRole: false, pctKey: 'storePct', roleKey: null }
  ];

  const totalPct = (Number(nps.mediaPct) || 0) + (Number(nps.desainPct) || 0) + (Number(nps.prodPct) || 0) + (Number(nps.investorPct) || 0) + (Number(nps.storePct) || 0);
  const over = totalPct > 100;
  const totalNominal = Math.round(base * Math.min(totalPct, 100) / 100);

  const segStyleYellow = (on) => ({
    background: on ? '#F2C015' : '#1f1c17',
    color: on ? '#14110D' : '#9a9384',
    border: `2px solid ${on ? '#F2C015' : '#4a443a'}`,
    cursor: 'pointer',
    fontFamily: "'Space Mono', monospace",
    fontWeight: 700,
    fontSize: '12px',
    textTransform: 'uppercase',
    padding: '11px 16px',
    letterSpacing: '0.04em',
    flex: 1
  });

  const createBatch = () => {
    const qty = parseInt(nps.qty) || 0;
    const ca = parseInt(nps.compareAt) || 0;
    const sizes = (nps.sizes || '').split(',').map((s) => s.trim()).filter(Boolean);
    const costs = {
      production: parseInt(nps.produksi) || 0,
      kemasan: parseInt(nps.kemasan) || 0,
      stiker: parseInt(nps.stiker) || 0
    };
    const colors = (nps.colors && nps.colors.length) ? nps.colors.map((c) => ({ ...c })) : [{ name: 'Default', hex: p.garment }];
    const split = {
      base: nps.profitBase,
      mediaPct: Number(nps.mediaPct) || 0, mediaRole: nps.mediaRole,
      desainPct: Number(nps.desainPct) || 0, desainRole: nps.desainRole,
      prodPct: Number(nps.prodPct) || 0, prodRole: nps.prodRole,
      investorPct: Number(nps.investorPct) || 0, investorRole: nps.investorRole,
      storePct: Number(nps.storePct) || 0
    };

    setData((prev) => ({
      ...prev,
      PRODUCTS: prev.PRODUCTS.map((x) => {
        if (x.id !== p.id) return x;
        const batch = {
          name: nps.name || 'PRODUKSI',
          date: nps.date || '—',
          qty, sold: 0, status: 'active',
          price, compareAt: ca > price ? ca : 0,
          sizes: sizes.length ? sizes : (x.sizes || []),
          colors,
          costs,
          split
        };
        const prevSessions = (x.productionSessions || []).map((b) => ({ ...b, status: 'done' }));
        return {
          ...x,
          productionSessions: [batch, ...prevSessions],
          stock: (x.stock || 0) + qty,
          price: price || x.price,
          compareAt: ca > price ? ca : null,
          sizes: sizes.length ? sizes : x.sizes,
          colors,
          costs
        };
      })
    }));

    close();
  };

  return (
    <>
      <style>{`
        @media (max-width: 640px) {
          .prodsess-box { width: 94vw !important; }
          .prodsess-body { padding: 18px !important; }
          .prodsess-grid-2 { grid-template-columns: 1fr !important; }
          .prodsess-cost-grid { grid-template-columns: 1fr !important; }
          .prodsess-profit-row {
            grid-template-columns: 1fr !important;
            row-gap: 6px !important;
            padding: 12px 0 !important;
          }
          .prodsess-profit-head { display: none !important; }
          .prodsess-summary-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>

      <div onClick={close} style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(20,17,13,0.62)' }} />
      <div
        className="prodsess-box"
        style={{
          position: 'fixed', zIndex: 101, top: '50%', left: '50%',
          transform: 'translate(-50%,-50%)', width: '720px', maxWidth: '94vw',
          maxHeight: '90vh', overflowY: 'auto', background: '#F2EEE4', border: '2px solid #14110D'
        }}
      >
        {/* FIX: header sekarang sticky, tombol × tetap terlihat walau konten di-scroll */}
        <div style={{ padding: '18px 24px', borderBottom: '2px solid #14110D', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, background: '#F2EEE4', zIndex: 1 }}>
          <div style={{ fontFamily: "'Archivo'", fontWeight: 900, fontSize: '20px', textTransform: 'uppercase' }}>
            Sesi Produksi Baru
          </div>
          <button onClick={close} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '24px', lineHeight: 1 }}>×</button>
        </div>

        <div className="prodsess-body" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="prodsess-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={labelStyle}>Nama Batch</label>
              <input value={nps.name} onChange={set('name')} placeholder="PRODUKSI 02" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Tanggal Produksi</label>
              <input value={nps.date} onChange={set('date')} placeholder="mis. 20 Jun 2026" style={inputStyle} />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Jumlah Produksi (unit)</label>
            <input type="number" value={nps.qty} onChange={set('qty')} placeholder="0" style={inputStyle} />
          </div>

          <div className="prodsess-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={labelStyle}>Harga Jual (Rp)</label>
              <input type="number" value={nps.price} onChange={set('price')} placeholder="0" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Harga Coret (opsional)</label>
              <input type="number" value={nps.compareAt} onChange={set('compareAt')} placeholder="kosongkan jika tdk diskon" style={inputStyle} />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Ukuran (pisah koma)</label>
            <input value={nps.sizes} onChange={set('sizes')} placeholder="S,M,L,XL" style={inputStyle} />
          </div>

          <div>
            <label style={labelStyle}>Pilihan Warna (klik untuk pilih)</label>
            <div style={{ display: 'flex', gap: '9px', flexWrap: 'wrap', marginTop: '8px' }}>
              {colorOptions.map((c) => {
                const on = (nps.colors || []).some((x) => x.hex === c.hex);
                return (
                  <button
                    key={c.id || c.hex}
                    onClick={() => toggleColor(c.hex, c.name)}
                    title={c.name}
                    style={{
                      width: '34px', height: '34px', cursor: 'pointer',
                      border: on ? '3px solid #14110D' : '2px solid #c9c1ad',
                      background: c.hex,
                      position: 'relative'
                    }}
                  />
                );
              })}
            </div>
          </div>

          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#6b655a' }}>
            Biaya per Unit
          </div>
          <div className="prodsess-cost-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
            <div>
              <label style={labelStyle}>Produksi</label>
              <input type="number" value={nps.produksi} onChange={set('produksi')} placeholder="0" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Kemasan</label>
              <input type="number" value={nps.kemasan} onChange={set('kemasan')} placeholder="0" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Stiker & Aks.</label>
              <input type="number" value={nps.stiker} onChange={set('stiker')} placeholder="0" style={inputStyle} />
            </div>
          </div>

          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', color: '#6b655a', lineHeight: 1.5 }}>
            Batch baru akan ditandai AKTIF dan menambah stok produk sebanyak jumlah produksi.
          </div>

          <div style={{ border: '2px solid #14110D', background: '#14110D', color: '#F2EEE4', padding: '16px' }}>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#F2C015', marginBottom: '12px' }}>
              Estimasi Pembagian Profit
            </div>

            <div style={{ display: 'flex', gap: 0, marginBottom: '12px' }}>
              <button onClick={() => setNps({ ...nps, profitBase: 'harga' })} style={segStyleYellow(!isGross)}>Dari Harga Jual</button>
              <button onClick={() => setNps({ ...nps, profitBase: 'gross' })} style={segStyleYellow(isGross)}>Dari Gross Profit</button>
            </div>

            <div className="prodsess-summary-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', fontFamily: "'Space Mono', monospace", fontSize: '11px', marginBottom: '14px' }}>
              <div style={{ background: '#1f1c17', padding: '9px 10px' }}>
                <div style={{ color: '#9a9384', fontSize: '9px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Harga Jual</div>
                <div style={{ marginTop: '3px' }}>{rp(price)}</div>
              </div>
              <div style={{ background: '#1f1c17', padding: '9px 10px' }}>
                <div style={{ color: '#9a9384', fontSize: '9px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Total Biaya</div>
                <div style={{ marginTop: '3px' }}>{rp(totalBiaya)}</div>
              </div>
              <div style={{ background: '#1f1c17', padding: '9px 10px' }}>
                <div style={{ color: '#9a9384', fontSize: '9px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Dasar Hitung</div>
                <div style={{ marginTop: '3px', color: '#F2C015' }}>{rp(base)}</div>
              </div>
            </div>

            <div className="prodsess-profit-head" style={{ display: 'grid', gridTemplateColumns: '1.3fr 1.3fr 0.7fr 1fr', gap: '8px', fontFamily: "'Space Mono', monospace", fontSize: '9px', letterSpacing: '0.05em', textTransform: 'uppercase', color: '#9a9384', paddingBottom: '6px', borderBottom: '1px solid #2c2820' }}>
              <span>Pihak</span><span>Peran</span><span style={{ textAlign: 'center' }}>%</span><span style={{ textAlign: 'right' }}>Nominal</span>
            </div>

            {profitRows.map((row) => {
              const pct = Number(nps[row.pctKey]) || 0;
              const nominal = Math.round(base * pct / 100);
              return (
                <div key={row.pctKey} className="prodsess-profit-row" style={{ display: 'grid', gridTemplateColumns: '1.3fr 1.3fr 0.7fr 1fr', gap: '8px', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #2c2820' }}>
                  <span style={{ fontFamily: "'Archivo'", fontWeight: 700, fontSize: '13px' }}>{row.label}</span>
                  {row.hasRole ? (
                    <select
                      value={nps[row.roleKey] || ''}
                      onChange={(ev) => setNps({ ...nps, [row.roleKey]: ev.target.value })}
                      style={{ width: '100%', padding: '8px', border: '2px solid #4a443a', background: '#1f1c17', color: '#F2EEE4', fontFamily: "'Space Mono', monospace", fontSize: '11px' }}
                    >
                      {roleOptions().map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  ) : (
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', color: '#6b655a' }}>—</span>
                  )}
                  <select
                    value={String(pct)}
                    onChange={setNum(row.pctKey)}
                    style={{ width: '100%', padding: '8px', border: '2px solid #4a443a', background: '#1f1c17', color: '#F2EEE4', fontFamily: "'Space Mono', monospace", fontSize: '11px' }}
                  >
                    {PCT_OPTIONS.map((v) => <option key={v} value={v}>{v}%</option>)}
                  </select>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '12px', textAlign: 'right' }}>{rp(nominal)}</span>
                </div>
              );
            })}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', flexWrap: 'wrap', gap: '6px' }}>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', color: over ? '#ff6b53' : '#6b655a' }}>
                {over ? `Total ${totalPct}% melebihi 100% — kurangi salah satu` : `Sisa belum dialokasi: ${100 - totalPct}%`}
              </span>
              <span style={{ fontFamily: "'Archivo'", fontWeight: 800, fontSize: '15px' }}>
                Total {totalPct}% · {rp(totalNominal)}
              </span>
            </div>
          </div>

          <button
            onClick={createBatch}
            style={{ background: '#F2C015', color: '#14110D', border: 'none', cursor: 'pointer', fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: '14px', letterSpacing: '0.06em', textTransform: 'uppercase', padding: '16px' }}
          >
            Tambah Sesi Produksi
          </button>
        </div>
      </div>
    </>
  );
}
