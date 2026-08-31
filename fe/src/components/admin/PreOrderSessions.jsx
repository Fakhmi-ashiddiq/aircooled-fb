import React, { useContext } from 'react';
import { useStore } from '../../store';
import { rp, normStage, stageOrder } from '../../utils/helpers';

export default function PreOrderSessions() {
  const { data, state, updateState, committedOf, advanceSess } = useStore();

  const poProducts = data.PRODUCTS.filter((p) => p.type === 'preorder' && p.preorder);

  const statusLabel = (status) => (status === 'open' ? 'OPEN' : status === 'production' ? 'PRODUKSI' : status === 'shipping' ? 'PENGIRIMAN' : 'DITUTUP');
  const statusStyle = (status) => ({
    background: status === 'open' ? '#F2C015' : status === 'production' ? '#14110D' : status === 'shipping' ? '#2a5fb0' : '#fff',
    color: status === 'open' || status === 'production' || status === 'shipping' ? (status === 'open' ? '#14110D' : '#F2EEE4') : '#14110D',
    border: status === 'closed' || status === 'done' ? '1px solid #14110D' : 'none'
  });

  // label & aksi tombol cepat ubah status — mengikuti tahap 4-langkah yang sama dengan SessionDetail
  const advanceLabel = (status) => {
    const cur = normStage(status);
    if (cur === 'open') return 'Tutup Sesi → Produksi';
    if (cur === 'production') return 'Lanjut ke Pengiriman';
    if (cur === 'shipping') return 'Tandai Selesai';
    return 'Sesi Selesai';
  };
  const canAdvance = (status) => normStage(status) !== 'done';

  const labelStyle = { fontFamily: "'Space Mono', monospace", fontSize: '10px', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#6b655a' };

  const openDetail = (p) => {
    updateState({ adminRoute: 'sessdetail', sessView: { productId: p.id, sessionName: p.preorder.sessionName, backTo: 'sessions' } });
    window.scrollTo(0, 0);
  };

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .pos-cards-grid { grid-template-columns: 1fr !important; }
          .pos-header-row { flex-wrap: wrap !important; gap: 12px !important; }
          .pos-card-head { flex-wrap: wrap !important; gap: 8px !important; }
          .pos-card-stats-grid { grid-template-columns: 1fr 1fr !important; }
          .pos-actions-row { flex-direction: column !important; }
        }
      `}</style>

      <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '12px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6b655a' }}>
        Manajemen Drop
      </div>
      <div className="pos-header-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '4px 0 28px' }}>
        <h1 style={{ fontFamily: "'Archivo'", fontWeight: 900, fontSize: '40px', margin: 0, textTransform: 'uppercase' }}>
          Sesi Pre-Order
        </h1>
        <button
          onClick={() => updateState({ sessionModal: true, sessionModalPid: poProducts[0]?.id || '' })}
          style={{ background: '#F2C015', color: '#14110D', border: 'none', cursor: 'pointer', fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: '12px', letterSpacing: '0.06em', textTransform: 'uppercase', padding: '13px 20px' }}
        >
          + Sesi Baru
        </button>
      </div>

      <div className="pos-cards-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '20px' }}>
        {poProducts.map((p) => {
          const sess = p.preorder;
          const committed = committedOf(p);
          const pct = Math.min(100, Math.round((committed / (sess.target || 1)) * 100));
          const reached = committed >= sess.target;

          return (
            <div key={p.id} style={{ border: '2px solid #14110D', background: '#fff' }}>
              <div className="pos-card-head" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '2px solid #14110D' }}>
                <div style={{ fontFamily: "'Archivo'", fontWeight: 800, fontSize: '17px', textTransform: 'uppercase', lineHeight: 1.05 }}>
                  {p.name}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', letterSpacing: '0.06em', textTransform: 'uppercase', padding: '4px 9px', fontWeight: 700, ...statusStyle(sess.status) }}>
                    {statusLabel(sess.status)}
                  </span>
                  <button
                    onClick={() => openDetail(p)}
                    style={{ background: '#14110D', color: '#F2EEE4', border: 'none', cursor: 'pointer', fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: '10px', letterSpacing: '0.05em', textTransform: 'uppercase', padding: '7px 12px', whiteSpace: 'nowrap' }}
                  >
                    Kelola ›
                  </button>
                </div>
              </div>

              <div style={{ padding: '20px' }}>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '12px', color: '#6b655a' }}>
                  {sess.sessionName} · {sess.opens} → {sess.closes}
                </div>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '16px' }}>
                  <span style={{ fontFamily: "'Archivo'", fontWeight: 900, fontSize: '34px' }}>{committed}</span>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '13px', color: '#6b655a' }}>
                    / {sess.target} unit (min. produksi)
                  </span>
                </div>

                <div style={{ marginTop: '12px', height: '9px', background: '#e4ddcd', position: 'relative' }}>
                  <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${pct}%`, background: reached ? '#1f7a3d' : '#14110D' }} />
                </div>

                <div className="pos-card-stats-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginTop: '18px' }}>
                  <div>
                    <div style={labelStyle}>Estimasi Kirim</div>
                    <div style={{ fontWeight: 700, fontSize: '14px', marginTop: '3px' }}>{sess.eta}</div>
                  </div>
                  <div>
                    <div style={labelStyle}>Nilai Pesanan</div>
                    <div style={{ fontWeight: 700, fontSize: '14px', marginTop: '3px', fontFamily: "'Space Mono', monospace" }}>
                      {rp(p.price * committed)}
                    </div>
                  </div>
                </div>

                <div className="pos-actions-row" style={{ display: 'flex', gap: '10px', marginTop: '18px' }}>
                  {canAdvance(sess.status) && (
                    <button
                      onClick={() => advanceSess(p.id, sess.sessionName)}
                      style={{ flex: 1, background: '#14110D', color: '#F2EEE4', border: 'none', cursor: 'pointer', fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: '11px', letterSpacing: '0.06em', textTransform: 'uppercase', padding: '11px' }}
                    >
                      {advanceLabel(sess.status)}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
