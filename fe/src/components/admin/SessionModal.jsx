import React, { useContext, useState, useEffect } from 'react';
import { useStore } from '../../store';
import { rp } from '../../utils/helpers';

const blankSession = (defaultSizeSetId) => ({
  productId: '', sessionName: '', opens: '', closes: '', target: '', eta: '',
  price: '', compareAt: '',
  sizeSetId: defaultSizeSetId || 'reg',
  colors: [],
  produksi: '', kemasan: '', stiker: '',
  profitBase: 'gross',
  mediaPct: 0, mediaRole: '',
  desainPct: 0, desainRole: '',
  prodPct: 0, prodRole: '',
  storePct: 0
});

const PCT_OPTIONS = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50];

export default function SessionModal() {
  const { data, setData, state, updateState } = useStore();
  const [ns, setNs] = useState(blankSession());

  const preorderProducts = data.PRODUCTS.filter((x) => x.type === 'preorder');
  const pid = state.sessionModalPid || ns.productId || preorderProducts[0]?.id || '';
  const p = data.PRODUCTS.find((x) => x.id === pid);
  const colorOptions = (data.colorOptions || []).filter((c) => c.active !== false);
  const owners = data.owners || [];
  const sizeSets = (data.sizeSets || []).filter((s) => s.active !== false);

  useEffect(() => {
    if (state.sessionModal && p) {
      const pre = p.preorder;
      const sp = pre?.split || {};
      setNs({
        productId: p.id,
        sessionName: '', opens: '', closes: '', target: '', eta: '',
        price: pre ? String(pre.price || '') : '',
        compareAt: '',
        sizeSetId: pre?.sizeSetId || sizeSets[0]?.id || 'reg',
        colors: pre?.colors ? pre.colors.map((c) => ({ ...c })) : (p.colors ? p.colors.map((c) => ({ ...c })) : []),
        produksi: pre ? String(pre.costs?.production || '') : String(p.costs?.production || ''),
        kemasan: pre ? String(pre.costs?.kemasan || '') : String(p.costs?.kemasan || ''),
        stiker: pre ? String(pre.costs?.stiker || '') : String(p.costs?.stiker || ''),
        profitBase: sp.base || 'gross',
        mediaPct: sp.mediaPct || 0, mediaRole: sp.mediaRole || '',
        desainPct: sp.desainPct || 0, desainRole: sp.desainRole || '',
        prodPct: sp.prodPct || 0, prodRole: sp.prodRole || '',
        storePct: sp.storePct || 0
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.sessionModal, state.sessionModalPid]);

  if (!state.sessionModal) return null;

  const close = () => updateState({ sessionModal: false, sessionModalPid: null });
  const set = (k) => (ev) => setNs({ ...ns, [k]: ev.target.value });
  const setNum = (k) => (ev) => setNs({ ...ns, [k]: parseInt(ev.target.value) || 0 });

  const inputStyle = { width: '100%', padding: '13px', border: '2px solid #14110D', background: '#fff', fontSize: '14px' };
  const labelStyle = { fontFamily: "'Space Mono', monospace", fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6b655a', marginBottom: '7px' };

  const toggleColor = (hex, name) => {
    const cs = (ns.colors || []).slice();
    const i = cs.findIndex((c) => c.hex === hex);
    if (i >= 0) cs.splice(i, 1);
    else cs.push({ name: name || hex, hex });
    setNs({ ...ns, colors: cs });
  };

  const price = parseInt(ns.price) || 0;
  const totalBiaya = (parseInt(ns.produksi) || 0) + (parseInt(ns.kemasan) || 0) + (parseInt(ns.stiker) || 0);
  const gross = price - totalBiaya;
  const isGross = ns.profitBase === 'gross';
  const base = isGross ? gross : price;

  const roleOptions = () => [{ value: '', label: 'â€” pilih peran â€”' }].concat(owners.map((r) => ({ value: r.id, label: r.name })));

  const profitRows = [
    { label: 'Media Platform', hasRole: true, pctKey: 'mediaPct', roleKey: 'mediaRole' },
    { label: 'Desain & Kreatif', hasRole: true, pctKey: 'desainPct', roleKey: 'desainRole' },
    { label: 'Produksi & Pengiriman', hasRole: true, pctKey: 'prodPct', roleKey: 'prodRole' },
    { label: 'Store Platform', hasRole: false, pctKey: 'storePct', roleKey: null }
  ];

  const totalPct = (Number(ns.mediaPct) || 0) + (Number(ns.desainPct) || 0) + (Number(ns.prodPct) || 0) + (Number(ns.storePct) || 0);
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

  const createSession = () => {
    if (!p) return;
    const priceN = parseInt(ns.price) || 0;
    const ca = parseInt(ns.compareAt) || 0;
    const set_ = sizeSets.find((s) => s.id === ns.sizeSetId) || sizeSets[0];
    const sizes = set_ && set_.sizes.length ? set_.sizes.slice() : ['One Size'];
    const colors = (ns.colors && ns.colors.length) ? ns.colors.map((c) => ({ ...c })) : [{ name: 'Default', hex: p.garment }];
    const costs = {
      production: parseInt(ns.produksi) || 0,
      kemasan: parseInt(ns.kemasan) || 0,
      stiker: parseInt(ns.stiker) || 0
    };
    const split = {
      base: ns.profitBase,
      mediaPct: Number(ns.mediaPct) || 0, mediaRole: ns.mediaRole,
      desainPct: Number(ns.desainPct) || 0, desainRole: ns.desainRole,
      prodPct: Number(ns.prodPct) || 0, prodRole: ns.prodRole,
      storePct: Number(ns.storePct) || 0
    };

    setData((prev) => ({
      ...prev,
      PRODUCTS: prev.PRODUCTS.map((x) => {
        if (x.id !== p.id) return x;
        const updated = { ...x };
        if (updated.preorder) {
          updated.sessionHistory = [
            { ...updated.preorder, status: updated.preorder.status === 'open' ? 'closed' : updated.preorder.status },
            ...(updated.sessionHistory || [])
          ];
        }
        updated.preorder = {
          sessionName: ns.sessionName || 'DROP BARU',
          opens: ns.opens || '-',
          closes: ns.closes || '-',
          target: parseInt(ns.target) || 30,
          committed: 0,
          eta: ns.eta || '-',
          status: 'open',
          price: priceN,
          compareAt: ca > priceN ? ca : 0,
          sizeSetId: set_ ? set_.id : 'reg',
          sizeSetName: set_ ? set_.name : '',
          sizes,
          colors,
          costs,
          split
        };
        updated.price = priceN;
        updated.compareAt = ca > priceN ? ca : null;
        updated.sizes = sizes;
        updated.colors = colors;
        updated.costs = costs;
        return updated;
      })
    }));

    const ov = { ...state.committedOverride, [p.id]: 0 };
    updateState({ sessionModal: false, sessionModalPid: null, committedOverride: ov });
  };

  return (
    <>
      <style>{`
        @media (max-width: 640px) {
          .sessmodal-box { width: 94vw !important; }
          .sessmodal-body { padding: 18px !important; }
          .sessmodal-grid-2 { grid-template-columns: 1fr !important; }
          .sessmodal-cost-grid { grid-template-columns: 1fr !important; }
          .sessmodal-profit-row {
            grid-template-columns: 1fr !important;
            row-gap: 6px !important;
            padding: 12px 0 !important;
          }
          .sessmodal-profit-head { display: none !important; }
          .sessmodal-summary-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>

      <div onClick={close} style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(20,17,13,0.62)' }} />
      <div
        className="sessmodal-box"
        style={{
          position: 'fixed', zIndex: 101, top: '50%', left: '50%',
          transform: 'translate(-50%,-50%)', width: '720px', maxWidth: '92vw',
          maxHeight: '90vh', overflowY: 'auto', background: '#F2EEE4', border: '2px solid #14110D'
        }}
      >
        {/* FIX: header sekarang sticky di dalam kotak modal, tidak ikut ter-scroll ke atas
            bersama konten â€” sama seperti pola di ProductModal.jsx */}
        <div style={{ padding: '18px 24px', borderBottom: '2px solid #14110D', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, background: '#F2EEE4', zIndex: 1 }}>
          <div style={{ fontFamily: "'Archivo'", fontWeight: 900, fontSize: '20px', textTransform: 'uppercase' }}>
            Sesi Pre-Order Baru
          </div>
          <button onClick={close} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '24px', lineHeight: 1 }}>Ã—</button>
        </div>

        <div className="sessmodal-body" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <div style={labelStyle}>Produk</div>
            <select
              value={pid}
              onChange={(ev) => updateState({ sessionModalPid: ev.target.value })}
              style={inputStyle}
            >
              {preorderProducts.map((prod) => (
                <option key={prod.id} value={prod.id}>{prod.name}</option>
              ))}
            </select>
          </div>

          <div>
            <div style={labelStyle}>Nama Sesi / Drop</div>
            <input placeholder="mis. DROP 04" value={ns.sessionName} onChange={set('sessionName')} style={inputStyle} />
          </div>

          <div className="sessmodal-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <div style={labelStyle}>Dibuka</div>
              <input placeholder="1 Jul" value={ns.opens} onChange={set('opens')} style={inputStyle} />
            </div>
            <div>
              <div style={labelStyle}>Ditutup</div>
              <input placeholder="31 Jul" value={ns.closes} onChange={set('closes')} style={inputStyle} />
            </div>
          </div>

          <div className="sessmodal-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <div style={labelStyle}>Target Min. (unit)</div>
              <input type="number" placeholder="40" value={ns.target} onChange={set('target')} style={inputStyle} />
            </div>
            <div>
              <div style={labelStyle}>Estimasi Kirim</div>
              <input placeholder="25 Agu" value={ns.eta} onChange={set('eta')} style={inputStyle} />
            </div>
          </div>

          <div style={{ borderTop: '1px solid #ddd5c4', paddingTop: '14px', fontFamily: "'Space Mono', monospace", fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#14110D', fontWeight: 700 }}>
            Harga &amp; Varian Sesi Ini
          </div>

          <div className="sessmodal-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <div style={labelStyle}>Harga Jual (Rp)</div>
              <input type="number" placeholder="220000" value={ns.price} onChange={set('price')} style={inputStyle} />
            </div>
            <div>
              <div style={labelStyle}>Harga Coret (opsional)</div>
              <input type="number" placeholder="kosongkan jika tdk diskon" value={ns.compareAt} onChange={set('compareAt')} style={inputStyle} />
            </div>
          </div>

          <div>
            <div style={labelStyle}>Set Ukuran</div>
            <select value={ns.sizeSetId} onChange={set('sizeSetId')} style={inputStyle}>
              {sizeSets.map((s) => (
                <option key={s.id} value={s.id}>{s.name} ({s.sizes.join(', ')})</option>
              ))}
            </select>
          </div>

          <div>
            <div style={labelStyle}>Pilihan Warna (klik untuk pilih)</div>
            <div style={{ display: 'flex', gap: '9px', flexWrap: 'wrap', marginTop: '8px' }}>
              {colorOptions.map((c) => {
                const on = (ns.colors || []).some((x) => x.hex === c.hex);
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

          <div>
            <div style={labelStyle}>Daftar Biaya per Unit</div>
            <div className="sessmodal-cost-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
              <input type="number" placeholder="Produksi" value={ns.produksi} onChange={set('produksi')} style={inputStyle} />
              <input type="number" placeholder="Kemasan" value={ns.kemasan} onChange={set('kemasan')} style={inputStyle} />
              <input type="number" placeholder="Stiker & Aks." value={ns.stiker} onChange={set('stiker')} style={inputStyle} />
            </div>
          </div>

          <div style={{ border: '2px solid #14110D', background: '#14110D', color: '#F2EEE4', padding: '16px' }}>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#F2C015', marginBottom: '12px' }}>
              Estimasi Pembagian Profit
            </div>

            <div style={{ display: 'flex', gap: 0, marginBottom: '12px' }}>
              <button onClick={() => setNs({ ...ns, profitBase: 'harga' })} style={segStyleYellow(!isGross)}>Dari Harga Jual</button>
              <button onClick={() => setNs({ ...ns, profitBase: 'gross' })} style={segStyleYellow(isGross)}>Dari Gross Profit</button>
            </div>

            <div className="sessmodal-summary-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', fontFamily: "'Space Mono', monospace", fontSize: '11px', marginBottom: '14px' }}>
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

            <div className="sessmodal-profit-head" style={{ display: 'grid', gridTemplateColumns: '1.3fr 1.3fr 0.7fr 1fr', gap: '8px', fontFamily: "'Space Mono', monospace", fontSize: '9px', letterSpacing: '0.05em', textTransform: 'uppercase', color: '#9a9384', paddingBottom: '6px', borderBottom: '1px solid #2c2820' }}>
              <span>Pihak</span><span>Peran</span><span style={{ textAlign: 'center' }}>%</span><span style={{ textAlign: 'right' }}>Nominal</span>
            </div>

            {profitRows.map((row) => {
              const pct = Number(ns[row.pctKey]) || 0;
              const nominal = Math.round(base * pct / 100);
              return (
                <div key={row.pctKey} className="sessmodal-profit-row" style={{ display: 'grid', gridTemplateColumns: '1.3fr 1.3fr 0.7fr 1fr', gap: '8px', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #2c2820' }}>
                  <span style={{ fontFamily: "'Archivo'", fontWeight: 700, fontSize: '13px' }}>{row.label}</span>
                  {row.hasRole ? (
                    <select
                      value={ns[row.roleKey] || ''}
                      onChange={(ev) => setNs({ ...ns, [row.roleKey]: ev.target.value })}
                      style={{ width: '100%', padding: '8px', border: '2px solid #4a443a', background: '#1f1c17', color: '#F2EEE4', fontFamily: "'Space Mono', monospace", fontSize: '11px' }}
                    >
                      {roleOptions().map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  ) : (
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', color: '#6b655a' }}>â€”</span>
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
                {over ? `Total ${totalPct}% melebihi 100% â€” kurangi salah satu` : `Sisa belum dialokasi: ${100 - totalPct}%`}
              </span>
              <span style={{ fontFamily: "'Archivo'", fontWeight: 800, fontSize: '15px' }}>
                Total {totalPct}% Â· {rp(totalNominal)}
              </span>
            </div>
          </div>

          <button
            onClick={createSession}
            style={{ background: '#F2C015', color: '#14110D', border: 'none', cursor: 'pointer', fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: '14px', letterSpacing: '0.06em', textTransform: 'uppercase', padding: '16px' }}
          >
            Buka Sesi Pre-Order
          </button>
        </div>
      </div>
    </>
  );
}


