import React, { useContext } from 'react';
import { useStore } from '../../store';
import { rp, normStage, stageOrder } from '../../utils/helpers';
import useCountUp from '../../hooks/useCountUp';

function AnimatedNumber({ value, format, start }) {
  const animated = useCountUp(value, 1200, start);
  return <>{format ? format(animated) : animated}</>;
}

const STAGE_LABELS = [['open', 'Dibuka'], ['production', 'Produksi'], ['shipping', 'Pengiriman'], ['done', 'Selesai']];

export default function SessionDetail() {
  const {
    data, state, updateState, committedOf, poBuyers, buyerItems, buyerQty,
    findSession, advanceSess, setSessStatus, toggleSplitBase, confirmSplit, unconfirmSplit
  } = useStore();

  const view = state.sessView;
  if (!view) return null;
  const r = findSession(view.productId, view.sessionName);
  if (!r) return null;
  const { p, sess } = r;

  const back = () => {
    updateState({ adminRoute: view.backTo || 'catalog-edit', sessView: null, adminProdId: view.backTo === 'sessions' ? null : p.id });
    window.scrollTo(0, 0);
  };

  const cur = normStage(sess.status);
  const order = stageOrder();
  const curIdx = order.indexOf(cur);
  const nextStage = curIdx < order.length - 1 ? STAGE_LABELS[curIdx + 1] : null;

  const active = r.active;
  const committed = active ? committedOf(p) : (sess.committed || 0);
  const buyers = poBuyers(sess);
  const price = sess.price || 0;

  const payOf = (b) => (b.pay === 'Batal' ? 0 : b.pay === 'Lunas' ? (b.payAmount || price * buyerQty(b)) : 0);
  const orderValue = buyers.reduce((a, b) => a + (b.pay === 'Batal' ? 0 : price * buyerQty(b)), 0);
  const paid = buyers.reduce((a, b) => a + payOf(b), 0);

  const labelStyle = { fontFamily: "'Space Mono', monospace", fontSize: '10px', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#6b655a' };

  const curLabel = cur === 'open' ? 'OPEN' : cur === 'production' ? 'PRODUKSI' : cur === 'shipping' ? 'PENGIRIMAN' : 'SELESAI';
  const curStyle = cur === 'open'
    ? { background: '#F2C015', color: '#14110D' }
    : cur === 'production'
    ? { background: '#14110D', color: '#F2EEE4' }
    : cur === 'shipping'
    ? { background: '#2a5fb0', color: '#fff' }
    : { background: '#1f7a3d', color: '#fff' };

  const canManagePay = cur === 'open';
  const canManageShip = cur === 'shipping';

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

  const openPay = (idx) => updateState({
    payModal: { pid: p.id, sname: sess.sessionName, idx },
    payForm: { amount: '', method: 'Transfer BCA', date: '', proof: '' }
  });
  const openShip = (idx) => updateState({
    shipModal: { pid: p.id, sname: sess.sessionName, idx },
    shipForm: { courier: 'JNE', resi: '', proof: '', cost: '' }
  });

  const sp = sess.split || { base: 'gross', mediaPct: 0, desainPct: 0, prodPct: 0, storePct: 0 };
  const paidUnits = buyers.reduce((a, b) => a + (b.pay === 'Lunas' ? buyerQty(b) : 0), 0);
  const cProd = (sess.costs?.production || 0) * paidUnits;
  const cKemasan = (sess.costs?.kemasan || 0) * paidUnits;
  const cStiker = (sess.costs?.stiker || 0) * paidUnits;
  const cRealShip = buyers.reduce((a, b) => a + (b.pay === 'Lunas' && b.shipCost ? b.shipCost : 0), 0);
  const realizedRevenue = price * paidUnits;
  const costExShip = cProd + cKemasan + cStiker;
  const realizedGross = realizedRevenue - costExShip;
  const isHarga = sp.base === 'harga';
  const reportBase = isHarga ? realizedRevenue : realizedGross;
  const realizedCost = costExShip + cRealShip;

  const costRows = [
    { label: 'Biaya Produksi', perUnit: sess.costs?.production || 0, total: cProd },
    { label: 'Biaya Kemasan', perUnit: sess.costs?.kemasan || 0, total: cKemasan },
    { label: 'Biaya Stiker & Aksesoris', perUnit: sess.costs?.stiker || 0, total: cStiker },
    { label: 'Real Ongkos Kirim', perUnit: null, total: cRealShip }
  ];

  const rolesMap = (id) => (data.owners || []).find((x) => x.id === id)?.name || 'â€”';
  const splitDefs = [
    ['Media Platform', sp.mediaPct, sp.mediaRole, true],
    ['Desain & Kreatif', sp.desainPct, sp.desainRole, true],
    ['Produksi & Pengiriman', sp.prodPct, sp.prodRole, true],
    ['Store Platform', sp.storePct, null, false]
  ];
  const reportTotalPct = (Number(sp.mediaPct) || 0) + (Number(sp.desainPct) || 0) + (Number(sp.prodPct) || 0) + (Number(sp.storePct) || 0);
  const reportRows = splitDefs.map(([label, pct, rid, hasRole]) => ({
    label, hasRole, role: hasRole ? rolesMap(rid) : 'â€”',
    pct: Number(pct) || 0,
    nominal: Math.round(reportBase * (Number(pct) || 0) / 100)
  }));
  const reportAllocated = Math.round(reportBase * Math.min(reportTotalPct, 100) / 100);
  const splitOk100 = reportTotalPct === 100;

  const selisih = paid - realizedCost - reportAllocated;
  const selisihPositive = selisih >= 0;

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .sd-header-row { flex-wrap: wrap !important; }
          .sd-stepper-scroll { overflow-x: auto; -webkit-overflow-scrolling: touch; }
          .sd-stepper-inner { min-width: 420px; }
          .sd-recap-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .sd-buyer-scroll { overflow-x: auto; -webkit-overflow-scrolling: touch; }
          .sd-buyer-inner { min-width: 620px; }
          .sd-report-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .sd-costrow-scroll { overflow-x: auto; -webkit-overflow-scrolling: touch; }
          .sd-costrow-inner { min-width: 460px; }
          .sd-reportrow-scroll { overflow-x: auto; -webkit-overflow-scrolling: touch; }
          .sd-reportrow-inner { min-width: 460px; }
          .sd-selisih-box { flex-direction: column !important; align-items: flex-start !important; gap: 10px !important; }
          .sd-confirm-box { flex-direction: column !important; align-items: flex-start !important; }
        }
      `}</style>

      <button onClick={back} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Space Mono', monospace", fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#6b655a', marginBottom: '18px' }}>
        â† Kembali ke Produk
      </button>

      <div className="sd-header-row" style={{ display: 'flex', alignItems: 'center', gap: '18px', marginBottom: '24px' }}>
        <div style={{ width: '64px', height: '64px', background: p.garment, border: '2px solid #14110D', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flex: 'none' }}>
          {p.heroImg ? <img src={p.heroImg} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" /> : p.print === 'logo' ? <img src="/assets/logo.png" style={{ width: '58%' }} alt="" /> : (
            <div style={{ color: '#F2C015', fontFamily: "'Archivo'", fontWeight: 900, fontSize: '12px', lineHeight: 0.9, textAlign: 'center', textTransform: 'uppercase' }}>AC<br />SYND</div>
          )}
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 700, padding: '4px 9px', ...curStyle }}>{curLabel}</span>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '12px', color: '#6b655a' }}>{sess.sessionName} Â· {sess.opens} â†’ {sess.closes}</span>
          </div>
          <h1 style={{ fontFamily: "'Archivo'", fontWeight: 900, fontSize: '32px', margin: '8px 0 0', textTransform: 'uppercase', lineHeight: 1 }}>{p.name}</h1>
        </div>
      </div>

      {/* STATUS STEPPER */}
      <div style={{ border: '2px solid #14110D', background: '#fff', marginBottom: '24px' }}>
        <div style={{ padding: '14px 20px', borderBottom: '2px solid #14110D', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ fontFamily: "'Archivo'", fontWeight: 800, fontSize: '16px', textTransform: 'uppercase' }}>Status Sesi</div>
          {nextStage && (
            <button onClick={() => advanceSess(p.id, sess.sessionName)} style={{ background: '#F2C015', color: '#14110D', border: 'none', cursor: 'pointer', fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: '12px', letterSpacing: '0.05em', textTransform: 'uppercase', padding: '11px 18px' }}>
              Lanjut ke {nextStage[1]} â†’
            </button>
          )}
        </div>
        <div style={{ padding: '24px 20px' }}>
          <div className="sd-stepper-scroll">
            <div className="sd-stepper-inner" style={{ display: 'flex', alignItems: 'flex-start' }}>
              {STAGE_LABELS.map(([key, label], i) => {
                const isActive = i === curIdx;
                const isDone = i < curIdx;
                return (
                  <React.Fragment key={key}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 'none', width: '84px' }}>
                      <button
                        onClick={() => setSessStatus(p.id, sess.sessionName, key)}
                        style={{
                          width: '38px', height: '38px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: '14px', cursor: 'pointer',
                          background: isDone || isActive ? '#14110D' : '#fff',
                          color: isDone || isActive ? '#F2EEE4' : '#9a8f7a',
                          border: isDone || isActive ? '2px solid #14110D' : '2px solid #c9c1ad'
                        }}
                      >
                        {i + 1}
                      </button>
                      <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', letterSpacing: '0.04em', textTransform: 'uppercase', marginTop: '9px', textAlign: 'center', color: isActive ? '#14110D' : '#6b655a', fontWeight: isActive ? 700 : 400 }}>
                        {label}
                      </div>
                    </div>
                    {i < STAGE_LABELS.length - 1 && (
                      <div style={{ background: i < curIdx ? '#14110D' : '#c9c1ad', flex: 1, height: '2px', margin: '0 4px', alignSelf: 'flex-start', marginTop: '18px' }} />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', color: '#6b655a', marginTop: '18px' }}>
            Klik nomor tahap untuk mengubah status secara langsung, atau gunakan tombol lanjut.
          </div>
        </div>
      </div>

      {/* RECAP STATS â€” CountUp diterapkan di sini */}
      <div className="sd-recap-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '16px', marginBottom: '24px' }}>
        <div style={{ border: '2px solid #14110D', background: '#fff', padding: '18px' }}>
          <div style={labelStyle}>Terpesan</div>
          <div style={{ fontFamily: "'Archivo'", fontWeight: 900, fontSize: '26px', marginTop: '6px' }}>
            <AnimatedNumber value={committed} start={state.appReady} /> / {sess.target}
          </div>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '12px', color: '#6b655a', marginTop: '2px' }}>{Math.min(100, Math.round((committed / (sess.target || 1)) * 100))}% target</div>
        </div>
        <div style={{ border: '2px solid #14110D', background: '#fff', padding: '18px' }}>
          <div style={labelStyle}>Nilai Pesanan</div>
          <div style={{ fontFamily: "'Archivo'", fontWeight: 900, fontSize: '22px', marginTop: '6px' }}>
            <AnimatedNumber value={orderValue} format={(v) => rp(v)} start={state.appReady} />
          </div>
        </div>
        <div style={{ border: '2px solid #14110D', background: '#fff', padding: '18px' }}>
          <div style={labelStyle}>Pembayaran Masuk</div>
          <div style={{ fontFamily: "'Archivo'", fontWeight: 900, fontSize: '22px', marginTop: '6px' }}>
            <AnimatedNumber value={paid} format={(v) => rp(v)} start={state.appReady} />
          </div>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '12px', color: '#9a3a2a', marginTop: '2px' }}>Sisa {rp(orderValue - paid)}</div>
        </div>
        <div style={{ border: '2px solid #14110D', background: '#14110D', color: '#F2EEE4', padding: '18px' }}>
          <div style={{ ...labelStyle, color: '#F2C015' }}>Harga / Unit</div>
          <div style={{ fontFamily: "'Archivo'", fontWeight: 900, fontSize: '22px', marginTop: '6px' }}>{rp(price)}</div>
        </div>
      </div>

      {/* DAFTAR PEMESANAN */}
      <div style={{ border: '2px solid #14110D', background: '#fff' }}>
        <div style={{ padding: '14px 20px', borderBottom: '2px solid #14110D', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '14px', flexWrap: 'wrap' }}>
          <div style={{ fontFamily: "'Archivo'", fontWeight: 800, fontSize: '16px', textTransform: 'uppercase' }}>Daftar Pemesanan ({buyers.length})</div>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', letterSpacing: '0.04em', textTransform: 'uppercase', color: '#6b655a' }}>
            {cur === 'open' ? 'Tahap OPEN â€” klik status bayar untuk mengelola pembayaran.'
              : cur === 'production' ? 'Tahap PRODUKSI â€” pembayaran terkunci; pesanan belum lunas otomatis dibatalkan.'
              : cur === 'shipping' ? 'Tahap PENGIRIMAN â€” klik status kirim untuk input resi & bukti.'
              : 'Sesi SELESAI â€” pengelolaan pesanan ditutup.'}
          </div>
        </div>
        <div className="sd-buyer-scroll">
          <div className="sd-buyer-inner" style={{ padding: '0 20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'auto 1.6fr 1.2fr auto auto auto 1fr', gap: '10px', padding: '11px 0', borderBottom: '1px solid #ddd5c4', fontFamily: "'Space Mono', monospace", fontSize: '9px', letterSpacing: '0.05em', textTransform: 'uppercase', color: '#6b655a' }}>
              <span>#</span><span>Nama</span><span>Varian</span><span style={{ textAlign: 'center' }}>Qty</span><span style={{ textAlign: 'center' }}>Bayar</span><span style={{ textAlign: 'center' }}>Kirim</span><span style={{ textAlign: 'right' }}>Total</span>
            </div>
            {buyers.map((b, i) => {
              const its = buyerItems(b);
              const q = buyerQty(b);
              const variant = its.length > 1 ? its.length + ' item' : `${its[0].size} Â· ${its[0].color}`;
              const payClickable = canManagePay && b.pay !== 'Batal';
              const shipClickable = canManageShip && b.ship !== 'Terkirim' && b.pay !== 'Batal';
              return (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: 'auto 1.6fr 1.2fr auto auto auto 1fr', gap: '10px', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #ddd5c4' }}>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '12px', color: '#6b655a' }}>{i + 1}</span>
                  <span style={{ fontSize: '13px', fontWeight: 600 }}>{b.name}</span>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', color: '#6b655a' }}>{variant}</span>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '12px', textAlign: 'center' }}>{q}</span>
                  <button
                    onClick={() => payClickable && openPay(i)}
                    disabled={!payClickable}
                    style={{ fontFamily: "'Space Mono', monospace", fontSize: '9px', letterSpacing: '0.04em', textTransform: 'uppercase', fontWeight: 700, padding: '5px 7px', textAlign: 'center', border: 'none', cursor: payClickable ? 'pointer' : 'default', ...payColor(b.pay) }}
                  >
                    {b.pay}
                  </button>
                  <button
                    onClick={() => shipClickable && openShip(i)}
                    disabled={!shipClickable}
                    style={{ fontFamily: "'Space Mono', monospace", fontSize: '9px', letterSpacing: '0.04em', textTransform: 'uppercase', fontWeight: 700, padding: '5px 7px', textAlign: 'center', border: 'none', cursor: shipClickable ? 'pointer' : 'default', ...shipColor(b.ship) }}
                  >
                    {b.ship}
                  </button>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '12px', fontWeight: 700, textAlign: 'right' }}>{rp(b.pay === 'Batal' ? 0 : price * q)}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* LAPORAN PEMBAGIAN HASIL */}
      <div style={{ border: '2px solid #14110D', background: '#fff', marginTop: '24px' }}>
        <div style={{ padding: '14px 20px', borderBottom: '2px solid #14110D', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ fontFamily: "'Archivo'", fontWeight: 800, fontSize: '16px', textTransform: 'uppercase' }}>Laporan Pembagian Hasil</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 700, background: '#F2C015', color: '#14110D', padding: '5px 10px' }}>
              Metode: {isHarga ? 'Dari Harga Jual' : 'Dari Gross Profit'}
            </span>
            {!sess.splitConfirmed && (
              <button onClick={() => toggleSplitBase(p.id, sess.sessionName)} style={{ background: '#14110D', color: '#F2EEE4', border: 'none', cursor: 'pointer', fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: '10px', letterSpacing: '0.05em', textTransform: 'uppercase', padding: '8px 12px', whiteSpace: 'nowrap' }}>
                â‡„ Ganti ke {isHarga ? 'Gross Profit' : 'Harga Jual'}
              </button>
            )}
            {sess.splitConfirmed && (
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', letterSpacing: '0.05em', textTransform: 'uppercase', fontWeight: 700, background: '#1f7a3d', color: '#fff', padding: '6px 11px' }}>
                âœ“ Terkonfirmasi
              </span>
            )}
          </div>
        </div>
        <div style={{ padding: '20px' }}>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', color: '#6b655a', marginBottom: '16px' }}>
            {isHarga ? 'Dasar hitung = Harga jual Ã— unit lunas (pendapatan produk).' : 'Dasar hitung = Harga jual âˆ’ total biaya di luar real ongkos kirim (produksi + kemasan + stiker).'}
          </div>

          <div className="sd-report-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '12px', marginBottom: '20px' }}>
            <div style={{ border: '1px solid #c9c1ad', background: '#F2EEE4', padding: '14px' }}>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '9px', letterSpacing: '0.06em', textTransform: 'uppercase', color: '#6b655a' }}>Pembayaran Masuk</div>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '16px', fontWeight: 700, marginTop: '5px' }}>{rp(paid)}</div>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', color: '#6b655a', marginTop: '2px' }}>{paidUnits} unit lunas</div>
            </div>
            <div style={{ border: '1px solid #c9c1ad', background: '#F2EEE4', padding: '14px' }}>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '9px', letterSpacing: '0.06em', textTransform: 'uppercase', color: '#6b655a' }}>Pendapatan Produk</div>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '16px', fontWeight: 700, marginTop: '5px' }}>{rp(realizedRevenue)}</div>
            </div>
            <div style={{ border: '1px solid #c9c1ad', background: '#F2EEE4', padding: '14px' }}>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '9px', letterSpacing: '0.06em', textTransform: 'uppercase', color: '#6b655a' }}>Total Biaya</div>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '16px', fontWeight: 700, marginTop: '5px', color: '#9a3a2a' }}>{rp(realizedCost)}</div>
            </div>
            <div style={{ border: '2px solid #14110D', background: '#14110D', color: '#F2EEE4', padding: '14px' }}>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '9px', letterSpacing: '0.06em', textTransform: 'uppercase', color: '#F2C015' }}>Dasar Hitung</div>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '16px', fontWeight: 700, marginTop: '5px' }}>{rp(reportBase)}</div>
            </div>
          </div>

          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6b655a', marginBottom: '8px' }}>Rincian Total Biaya</div>
          <div className="sd-costrow-scroll" style={{ border: '1px solid #c9c1ad', marginBottom: '22px' }}>
            <div className="sd-costrow-inner">
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '12px', padding: '10px 14px', borderBottom: '1px solid #ddd5c4', background: '#F2EEE4', fontFamily: "'Space Mono', monospace", fontSize: '9px', letterSpacing: '0.05em', textTransform: 'uppercase', color: '#6b655a' }}>
                <span>Komponen</span><span style={{ textAlign: 'right' }}>Per Unit</span><span style={{ textAlign: 'right' }}>Total (Ã— unit lunas)</span>
              </div>
              {costRows.map((cr, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '12px', padding: '11px 14px', borderBottom: '1px solid #ddd5c4', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', fontWeight: 600 }}>{cr.label}</span>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '12px', color: '#6b655a', textAlign: 'right' }}>{cr.perUnit != null ? rp(cr.perUnit) : 'sesuai resi'}</span>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '13px', fontWeight: 700, textAlign: 'right' }}>{rp(cr.total)}</span>
                </div>
              ))}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '12px', padding: '12px 14px', background: '#14110D', color: '#F2EEE4' }}>
                <span style={{ fontFamily: "'Archivo'", fontWeight: 800, fontSize: '14px', textTransform: 'uppercase' }}>Total Biaya</span>
                <span></span>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '14px', fontWeight: 700, textAlign: 'right' }}>{rp(realizedCost)}</span>
              </div>
            </div>
          </div>

          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6b655a', marginBottom: '8px' }}>Pembagian Hasil (Total 100%)</div>
          <div className="sd-reportrow-scroll">
            <div className="sd-reportrow-inner">
              <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1.4fr auto 1.1fr', gap: '12px', padding: '10px 0', borderBottom: '1px solid #ddd5c4', fontFamily: "'Space Mono', monospace", fontSize: '9px', letterSpacing: '0.06em', textTransform: 'uppercase', color: '#6b655a' }}>
                <span>Pihak</span><span>Peran</span><span style={{ textAlign: 'center' }}>%</span><span style={{ textAlign: 'right' }}>Nominal</span>
              </div>
              {reportRows.map((rr, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1.4fr 1.4fr auto 1.1fr', gap: '12px', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #ddd5c4' }}>
                  <span style={{ fontFamily: "'Archivo'", fontWeight: 700, fontSize: '14px' }}>{rr.label}</span>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '12px', color: '#6b655a' }}>{rr.role}</span>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '13px', fontWeight: 700, textAlign: 'center' }}>{rr.pct}%</span>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '14px', fontWeight: 700, textAlign: 'right' }}>{rp(rr.nominal)}</span>
                </div>
              ))}
              <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1.4fr auto 1.1fr', gap: '12px', alignItems: 'center', padding: '14px 0 2px' }}>
                <span style={{ fontFamily: "'Archivo'", fontWeight: 800, fontSize: '15px', textTransform: 'uppercase' }}>Total Dialokasikan</span>
                <span></span>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '13px', fontWeight: 700, textAlign: 'center' }}>{reportTotalPct}%</span>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '15px', fontWeight: 700, textAlign: 'right' }}>{rp(reportAllocated)}</span>
              </div>
            </div>
          </div>
          {!splitOk100 && (
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', color: '#9a3a2a', marginTop: '6px' }}>
              âš  Total persentase {reportTotalPct}% â€” sebaiknya 100%
            </div>
          )}

          <div className="sd-selisih-box" style={{ marginTop: '18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '14px', padding: '16px 18px', background: selisihPositive ? '#14110D' : '#9a3a2a', color: selisihPositive ? '#F2EEE4' : '#fff' }}>
            <div>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', letterSpacing: '0.08em', textTransform: 'uppercase', opacity: 0.85 }}>
                Selisih = Pembayaran Masuk âˆ’ Total Biaya âˆ’ Pembagian Hasil
              </div>
              <div style={{ fontFamily: "'Archivo'", fontWeight: 900, fontSize: '20px', textTransform: 'uppercase', marginTop: '4px' }}>
                {selisihPositive ? 'Kas (Surplus)' : 'Kerugian (Defisit)'}
              </div>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', opacity: 0.85, marginTop: '2px' }}>
                {selisihPositive ? 'Sisa dana dicatat sebagai kas.' : 'Selisih negatif dicatat sebagai kerugian.'}
              </div>
            </div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '24px', fontWeight: 700, whiteSpace: 'nowrap' }}>{rp(selisih)}</div>
          </div>

          {cur === 'done' && !sess.splitConfirmed && (
            <div className="sd-confirm-box" style={{ marginTop: '18px', border: '2px dashed #14110D', background: '#F2EEE4', padding: '18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '14px', flexWrap: 'wrap' }}>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', color: '#3d382f', lineHeight: 1.5, maxWidth: '420px' }}>
                Sesi sudah <strong>SELESAI</strong>. Konfirmasi pembagian hasil untuk mengunci metode &amp; angka. Setelah dikonfirmasi, metode tidak bisa diubah.
              </div>
              <button onClick={() => confirmSplit(p.id, sess.sessionName)} style={{ background: '#1f7a3d', color: '#fff', border: 'none', cursor: 'pointer', fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: '13px', letterSpacing: '0.05em', textTransform: 'uppercase', padding: '14px 22px', whiteSpace: 'nowrap' }}>
                âœ“ Konfirmasi Pembagian Hasil
              </button>
            </div>
          )}
          {sess.splitConfirmed && (
            <div className="sd-confirm-box" style={{ marginTop: '18px', border: '2px solid #1f7a3d', background: '#eef6ef', padding: '16px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '14px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ width: '30px', height: '30px', background: '#1f7a3d', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, flex: 'none' }}>âœ“</span>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '12px', color: '#1f5a2e', fontWeight: 700 }}>Pembagian hasil sudah dikonfirmasi &amp; dikunci.</div>
              </div>
              <button onClick={() => unconfirmSplit(p.id, sess.sessionName)} style={{ background: 'none', color: '#1f5a2e', border: '1px solid #1f7a3d', cursor: 'pointer', fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: '10px', letterSpacing: '0.05em', textTransform: 'uppercase', padding: '8px 12px' }}>
                Buka Kunci
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}


