import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { rp } from '../../utils/helpers';

export default function PreOrderDone() {
  const { data, state, updateState, poBuyers, buyerItems, buyerQty } = useContext(AppContext);

  // ==== kumpulkan SEMUA sesi yang bukan 'open' — aktif (production/closed/done) + histori ====
  const completed = [];
  data.PRODUCTS.filter((p) => p.type === 'preorder').forEach((p) => {
    if (p.preorder && p.preorder.status !== 'open') {
      completed.push({ prod: p, sess: p.preorder, isActive: true });
    }
    (p.sessionHistory || []).forEach((s) => completed.push({ prod: p, sess: s, isActive: false }));
  });

  const statusLabel = (status) => {
    if (status === 'production') return 'PRODUKSI';
    if (status === 'shipping') return 'PENGIRIMAN';
    if (status === 'closed') return 'DITUTUP';
    return 'SELESAI';
  };
  const statusStyle = (status) => (
    status === 'production' ? { background: '#14110D', color: '#F2EEE4' }
    : status === 'shipping' ? { background: '#2a5fb0', color: '#fff' }
    : { background: '#e4ddcd', color: '#6b655a' }
  );

  const selPoId = state.poView;
  const selEntry = completed.find((e) => e.prod.id + '_' + e.sess.sessionName === selPoId);

  const openPO = (prodId, sessName) => {
    updateState({ poView: prodId + '_' + sessName });
    window.scrollTo(0, 0);
  };
  const closePO = () => updateState({ poView: null });

  const labelStyle = { fontFamily: "'Space Mono', monospace", fontSize: '10px', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#6b655a' };

  // ==================== DETAIL VIEW ====================
  if (selEntry) {
    const { prod: p, sess } = selEntry;
    const buyers = poBuyers(sess);
    const price = sess.price || 0;
    const units = buyers.reduce((a, b) => a + buyerQty(b), 0) || sess.committed || 0;
    const orderValue = price * units;

    const payOf = (b) => (b.pay === 'Lunas' ? (b.payAmount || price * buyerQty(b)) : 0);
    const paid = buyers.reduce((a, b) => a + payOf(b), 0);

    const unitCost = (sess.costs?.production || 0) + (sess.costs?.kemasan || 0) + (sess.costs?.stiker || 0);
    const totalCost = unitCost * units;
    const profit = orderValue - totalCost;

    const sp = sess.split || { base: 'gross', mediaPct: 0, desainPct: 0, prodPct: 0, storePct: 0 };
    const isHarga = sp.base === 'harga';
    const base = isHarga ? orderValue : profit;

    const roleName = (id) => (data.roles || []).find((r) => r.id === id)?.name || '—';
    const splitDefs = [
      ['Media Platform', sp.mediaPct, sp.mediaRole, true],
      ['Desain & Kreatif', sp.desainPct, sp.desainRole, true],
      ['Produksi & Pengiriman', sp.prodPct, sp.prodRole, true],
      ['Store Platform', sp.storePct, null, false]
    ];
    const splitRows = splitDefs.map(([label, pct, rid, hasRole]) => ({
      label, hasRole, role: hasRole ? roleName(rid) : '—',
      pct: Number(pct) || 0,
      nominal: Math.round(base * (Number(pct) || 0) / 100)
    }));
    const totalPct = (Number(sp.mediaPct) || 0) + (Number(sp.desainPct) || 0) + (Number(sp.prodPct) || 0) + (Number(sp.storePct) || 0);
    const splitTotal = Math.round(base * Math.min(totalPct, 100) / 100);

    const payColor = (st) => (
      st === 'Lunas' ? { background: '#14110D', color: '#F2EEE4' }
      : st === 'Batal' ? { background: '#e4ddcd', color: '#9a3a2a', textDecoration: 'line-through' }
      : { background: '#fff', color: '#9a3a2a', border: '1px solid #9a3a2a' }
    );
    const shipColor = (st) => (
      st === 'Terkirim' ? { background: '#14110D', color: '#F2EEE4' }
      : st === 'Proses' ? { background: '#F2C015', color: '#14110D' }
      : { background: '#fff', color: '#6b655a', border: '1px solid #c9c1ad' }
    );

    return (
      <>
        <button onClick={closePO} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Space Mono', monospace", fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#6b655a', marginBottom: '18px' }}>
          ← Kembali ke Pre-Order Selesai
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '18px', marginBottom: '26px' }}>
          <div style={{ width: '72px', height: '72px', background: p.garment, border: '2px solid #14110D', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flex: 'none' }}>
            {p.heroImg ? (
              <img src={p.heroImg} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
            ) : p.print === 'logo' ? (
              <img src="/assets/logo.png" style={{ width: '58%' }} alt="" />
            ) : (
              <div style={{ color: '#F2C015', fontFamily: "'Archivo'", fontWeight: 900, fontSize: '12px', lineHeight: 0.9, textAlign: 'center', textTransform: 'uppercase' }}>AC<br />SYND</div>
            )}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 700, padding: '4px 9px', ...statusStyle(sess.status) }}>
                {statusLabel(sess.status)}
              </span>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '12px', color: '#6b655a' }}>{sess.sessionName} · {sess.opens} → {sess.closes}</span>
            </div>
            <h1 style={{ fontFamily: "'Archivo'", fontWeight: 900, fontSize: '32px', margin: '8px 0 0', textTransform: 'uppercase', lineHeight: 1 }}>{p.name}</h1>
          </div>
        </div>

        {/* RECAP STATS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '16px', marginBottom: '24px' }}>
          <div style={{ border: '2px solid #14110D', background: '#fff', padding: '18px' }}>
            <div style={labelStyle}>Total Pesanan</div>
            <div style={{ fontFamily: "'Archivo'", fontWeight: 900, fontSize: '26px', marginTop: '6px' }}>{units} unit</div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '12px', color: '#6b655a', marginTop: '2px' }}>{rp(orderValue)}</div>
          </div>
          <div style={{ border: '2px solid #14110D', background: '#fff', padding: '18px' }}>
            <div style={labelStyle}>Total Pembayaran</div>
            <div style={{ fontFamily: "'Archivo'", fontWeight: 900, fontSize: '24px', marginTop: '6px' }}>{rp(paid)}</div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '12px', color: '#9a3a2a', marginTop: '2px' }}>Sisa {rp(orderValue - paid)}</div>
          </div>
          <div style={{ border: '2px solid #14110D', background: '#fff', padding: '18px' }}>
            <div style={labelStyle}>Total Biaya</div>
            <div style={{ fontFamily: "'Archivo'", fontWeight: 900, fontSize: '24px', marginTop: '6px' }}>{rp(totalCost)}</div>
          </div>
          <div style={{ border: '2px solid #14110D', background: '#14110D', color: '#F2EEE4', padding: '18px' }}>
            <div style={{ ...labelStyle, color: '#F2C015' }}>Profit Kotor</div>
            <div style={{ fontFamily: "'Archivo'", fontWeight: 900, fontSize: '24px', marginTop: '6px' }}>{rp(profit)}</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '24px', alignItems: 'start' }}>
          {/* DAFTAR PEMESAN */}
          <div style={{ border: '2px solid #14110D', background: '#fff' }}>
            <div style={{ padding: '14px 20px', borderBottom: '2px solid #14110D', fontFamily: "'Archivo'", fontWeight: 800, fontSize: '16px', textTransform: 'uppercase' }}>
              Daftar Pemesan ({buyers.length})
            </div>
            <div style={{ padding: '0 20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1.2fr auto auto auto', gap: '10px', padding: '11px 0', borderBottom: '1px solid #ddd5c4', fontFamily: "'Space Mono', monospace", fontSize: '9px', letterSpacing: '0.05em', textTransform: 'uppercase', color: '#6b655a' }}>
                <span>Nama</span><span>Varian</span><span style={{ textAlign: 'center' }}>Qty</span><span style={{ textAlign: 'center' }}>Bayar</span><span style={{ textAlign: 'center' }}>Kirim</span>
              </div>
              {buyers.map((b, i) => {
                const its = buyerItems(b);
                const q = buyerQty(b);
                const variant = its.length > 1 ? its.length + ' item' : `${its[0].size} · ${its[0].color}`;
                return (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '1.6fr 1.2fr auto auto auto', gap: '10px', alignItems: 'center', padding: '11px 0', borderBottom: '1px solid #ddd5c4' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600 }}>{b.name}</span>
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', color: '#6b655a' }}>{variant}</span>
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '12px', textAlign: 'center' }}>{q}</span>
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '9px', letterSpacing: '0.04em', textTransform: 'uppercase', fontWeight: 700, padding: '3px 7px', textAlign: 'center', ...payColor(b.pay) }}>{b.pay}</span>
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '9px', letterSpacing: '0.04em', textTransform: 'uppercase', fontWeight: 700, padding: '3px 7px', textAlign: 'center', ...shipColor(b.ship) }}>{b.ship}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* PEMBAGIAN HASIL */}
          <div style={{ border: '2px solid #14110D', background: '#fff' }}>
            <div style={{ padding: '14px 20px', borderBottom: '2px solid #14110D', fontFamily: "'Archivo'", fontWeight: 800, fontSize: '16px', textTransform: 'uppercase' }}>
              Pembagian Hasil
            </div>
            <div style={{ padding: '16px 20px' }}>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', color: '#6b655a', marginBottom: '14px' }}>
                Dasar: {isHarga ? 'Nilai Pesanan' : 'Gross Profit'} — {rp(base)}
              </div>
              {splitRows.map((sp2, i) => (
                <div key={i} style={{ padding: '11px 0', borderBottom: '1px solid #ddd5c4' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontFamily: "'Archivo'", fontWeight: 700, fontSize: '14px' }}>{sp2.label}</span>
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '14px', fontWeight: 700 }}>{rp(sp2.nominal)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '3px', fontFamily: "'Space Mono', monospace", fontSize: '11px', color: '#6b655a' }}>
                    <span>{sp2.role}</span><span>{sp2.pct}%</span>
                  </div>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', paddingTop: '12px', fontFamily: "'Archivo'", fontWeight: 800, fontSize: '16px' }}>
                <span>Total {totalPct}%</span><span style={{ fontFamily: "'Space Mono', monospace" }}>{rp(splitTotal)}</span>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // ==================== LIST VIEW ====================
  return (
    <>
      <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '12px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6b655a' }}>Arsip</div>
      <h1 style={{ fontFamily: "'Archivo'", fontWeight: 900, fontSize: '40px', margin: '4px 0 8px', textTransform: 'uppercase' }}>Pre-Order Selesai</h1>
      <p style={{ fontSize: '14px', color: '#6b655a', maxWidth: '560px', margin: '0 0 26px' }}>
        Sesi pre-order yang sudah ditutup atau dalam produksi. Klik untuk melihat daftar pemesan, status pembayaran &amp; pengiriman, dan rekap profit.
      </p>

      <div style={{ border: '2px solid #14110D', background: '#fff' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.3fr 1.3fr auto 1fr auto', gap: '14px', padding: '12px 20px', borderBottom: '2px solid #14110D', fontFamily: "'Space Mono', monospace", fontSize: '10px', letterSpacing: '0.06em', textTransform: 'uppercase', color: '#6b655a' }}>
          <span>Produk</span><span>Sesi</span><span>Periode</span><span style={{ textAlign: 'right' }}>Unit</span><span style={{ textAlign: 'right' }}>Pendapatan</span><span></span>
        </div>
        <div style={{ padding: '0 20px' }}>
          {completed.map(({ prod: p, sess }, i) => {
            const buyers = poBuyers(sess);
            const units = buyers.reduce((a, b) => a + buyerQty(b), 0) || sess.committed || 0;
            const revenue = (sess.price || 0) * units;
            return (
              <div
                key={i}
                onClick={() => openPO(p.id, sess.sessionName)}
                style={{ display: 'grid', gridTemplateColumns: '2fr 1.3fr 1.3fr auto 1fr auto', gap: '14px', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid #ddd5c4', cursor: 'pointer' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '9px', letterSpacing: '0.05em', textTransform: 'uppercase', fontWeight: 700, padding: '3px 8px', ...statusStyle(sess.status) }}>
                    {statusLabel(sess.status)}
                  </span>
                  <span style={{ fontFamily: "'Archivo'", fontWeight: 700, fontSize: '14px' }}>{p.name}</span>
                </div>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '13px' }}>{sess.sessionName}</span>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '12px', color: '#6b655a' }}>{sess.opens} → {sess.closes}</span>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '13px', textAlign: 'right' }}>{units}</span>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '13px', fontWeight: 700, textAlign: 'right' }}>{rp(revenue)}</span>
                <button
                  onClick={(ev) => { ev.stopPropagation(); openPO(p.id, sess.sessionName); }}
                  style={{ background: '#fff', color: '#14110D', border: '2px solid #14110D', cursor: 'pointer', fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: '10px', letterSpacing: '0.04em', textTransform: 'uppercase', padding: '8px 12px', whiteSpace: 'nowrap' }}
                >
                  Detail ›
                </button>
              </div>
            );
          })}
          {completed.length === 0 && (
            <div style={{ padding: '40px 0', textAlign: 'center', fontFamily: "'Space Mono', monospace", fontSize: '13px', color: '#6b655a' }}>
              Belum ada sesi pre-order yang selesai.
            </div>
          )}
        </div>
      </div>
    </>
  );
}