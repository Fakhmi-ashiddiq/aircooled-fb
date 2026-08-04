import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { rp } from '../../utils/helpers';

export default function CatalogEdit() {
  const { data, setData, state, updateState, unitsOf, committedOf, openProduct, poAggregate } = useContext(AppContext);

  const p = data.PRODUCTS.find((x) => x.id === state.adminProdId);
  if (!p) return null;

  const isPre = p.type === 'preorder';

  const defaultDraft = {
    name: p.name,
    cat: p.cat,
    price: String(p.price || ''),
    compareAt: String(p.compareAt || ''),
    sizes: (p.sizes || []).join(', '),
    stock: String(p.stock != null ? p.stock : ''),
    produksi: String(p.costs?.production || ''),
    kemasan: String(p.costs?.kemasan || ''),
    stiker: String(p.costs?.stiker || ''),
    images: p.images || (p.gallery || ['Depan']).map((lbl) => ({ src: null, name: lbl })),
    defaultImg: p.defaultImg || 0
  };

  const e = state.editProd || defaultDraft;
  const setEdit = (patch) => updateState({ editProd: { ...e, ...patch } });

  const cancel = () => updateState({ adminRoute: 'catalog', adminProdId: null, editProd: null });

  const save = () => {
    setData((prev) => ({
      ...prev,
      PRODUCTS: prev.PRODUCTS.map((x) => {
        if (x.id !== p.id) return x;
        const updated = { ...x, name: e.name || x.name, cat: e.cat || x.cat };
        if (!isPre) {
          updated.price = parseInt(e.price) || 0;
          const ca = parseInt(e.compareAt) || 0;
          updated.compareAt = ca > updated.price ? ca : null;
          updated.sizes = (e.sizes || '').split(',').map((s) => s.trim()).filter(Boolean);
          if (!updated.sizes.length) updated.sizes = ['One Size'];
          updated.stock = parseInt(e.stock) || 0;
          updated.costs = {
            production: parseInt(e.produksi) || 0,
            kemasan: parseInt(e.kemasan) || 0,
            stiker: parseInt(e.stiker) || 0
          };
        }
        updated.images = (e.images || []).map((im) => ({ ...im }));
        updated.defaultImg = e.defaultImg || 0;
        const def = updated.images[updated.defaultImg];
        if (def && def.src) updated.heroImg = def.src;
        return updated;
      })
    }));
    updateState({ adminRoute: 'catalog', adminProdId: null, editProd: null });
    window.scrollTo(0, 0);
  };

  const onUpload = (ev) => {
    const files = [...(ev.target.files || [])];
    if (!files.length) return;
    let done = 0;
    const imgs = (e.images || []).slice();
    files.forEach((f) => {
      const rd = new FileReader();
      rd.onload = () => {
        imgs.push({ src: rd.result, name: f.name.replace(/\.[^.]+$/, '').slice(0, 20) });
        done++;
        if (done === files.length) setEdit({ images: imgs });
      };
      rd.readAsDataURL(f);
    });
    ev.target.value = '';
  };
  const removeImage = (idx) => {
    const imgs = (e.images || []).filter((_, i) => i !== idx);
    let def = e.defaultImg || 0;
    if (idx === def) def = 0;
    else if (idx < def) def = def - 1;
    setEdit({ images: imgs, defaultImg: Math.max(0, Math.min(def, imgs.length - 1)) });
  };
  const setDefaultImg = (idx) => setEdit({ defaultImg: idx });

  const viewStore = () => {
    updateState({ view: 'store' });
    openProduct(p.id);
  };

  const openSessionDetail = (sessionName) => {
    updateState({
      adminRoute: 'sessdetail',
      sessView: { productId: p.id, sessionName, backTo: 'catalog-edit' }
    });
    window.scrollTo(0, 0);
  };

  const labelStyle = { fontFamily: "'Space Mono', monospace", fontSize: '10px', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#6b655a', marginBottom: '7px' };
  const inputStyle = { width: '100%', padding: '13px', border: '2px solid #14110D', background: '#fff', fontSize: '14px' };

  const agg = isPre ? poAggregate(p) : null;
  const soldUnits = isPre ? agg.committed : unitsOf(p);
  const revenue = isPre ? rp(agg.paidIn) : rp(p.price * (p.sold || 0));
  const stockMetaLabel = isPre ? 'Target Sesi' : 'Sisa Stok';
  const stockMetaValue = isPre ? `${agg.target} unit` : `${p.stock || 0} unit`;
  const sessionsCountLabel = isPre ? `${agg.count} sesi` : '';

  const activeOpen = isPre && p.preorder.status === 'open';
  const preSessions = isPre
    ? [{ ...p.preorder, active: true }, ...((p.sessionHistory || []).map((s) => ({ ...s, active: false })))]
    : [];
  const prodSessions = !isPre ? (p.productionSessions || []) : [];

  const openMakeSession = () => {
    if (isPre) {
      if (activeOpen) return;
      updateState({ sessionModal: true, sessionModalPid: p.id });
    } else {
      updateState({ prodSessionModal: true, prodSessionPid: p.id });
    }
  };

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .ce-header-row { flex-wrap: wrap !important; gap: 16px !important; }
          .ce-stats-grid { grid-template-columns: 1fr !important; }
          .ce-form-grid-2 { grid-template-columns: 1fr !important; }
          .ce-form-grid-4 { grid-template-columns: 1fr 1fr !important; }
          .ce-images-grid { grid-template-columns: repeat(3,1fr) !important; }
          .ce-session-header { flex-wrap: wrap !important; gap: 10px !important; }
          .ce-session-stats-grid { grid-template-columns: 1fr 1fr !important; }
          .ce-cost-grid { grid-template-columns: 1fr !important; }
          .ce-prod-stats-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>

      <button
        onClick={cancel}
        style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Space Mono', monospace", fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#6b655a', marginBottom: '18px' }}
      >
        ← Kembali ke Katalog
      </button>

      <div className="ce-header-row" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '20px', marginBottom: '28px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: '18px', alignItems: 'center' }}>
          <div style={{ width: '84px', height: '84px', background: p.garment, border: '2px solid #14110D', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flex: 'none' }}>
            {p.heroImg ? (
              <img src={p.heroImg} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
            ) : p.print === 'logo' ? (
              <img src="/assets/logo.png" style={{ width: '60%' }} alt="" />
            ) : (
              <div style={{ color: '#F2C015', fontFamily: "'Archivo'", fontWeight: 900, fontSize: '13px', lineHeight: 0.9, textAlign: 'center', textTransform: 'uppercase' }}>
                AC<br />SYND
              </div>
            )}
          </div>
          <div>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', letterSpacing: '0.06em', textTransform: 'uppercase', padding: '4px 9px', fontWeight: 700, background: isPre ? '#F2C015' : '#14110D', color: isPre ? '#14110D' : '#F2EEE4' }}>
              {isPre ? 'Pre-Order' : 'Ready Stock'}
            </span>
            <h1 style={{ fontFamily: "'Archivo'", fontWeight: 900, fontSize: '32px', margin: '8px 0 0', textTransform: 'uppercase', lineHeight: 1 }}>{p.name}</h1>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '12px', color: '#6b655a', marginTop: '5px' }}>
              {p.cat} · {rp(p.price)}
            </div>
          </div>
        </div>
        <button
          onClick={viewStore}
          style={{ background: '#fff', color: '#14110D', border: '2px solid #14110D', cursor: 'pointer', fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: '11px', letterSpacing: '0.04em', textTransform: 'uppercase', padding: '11px 16px' }}
        >
          Lihat di Storefront ↗
        </button>
      </div>

      <div className="ce-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px', marginBottom: '24px' }}>
        <div style={{ border: '2px solid #14110D', background: '#fff', padding: '18px' }}>
          <div style={labelStyle}>{isPre ? 'Unit Terpesan' : 'Unit Terjual'}</div>
          <div style={{ fontFamily: "'Archivo'", fontWeight: 900, fontSize: '28px', marginTop: '6px' }}>{soldUnits}</div>
          {isPre && <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', color: '#6b655a', marginTop: '2px' }}>{sessionsCountLabel}</div>}
        </div>
        <div style={{ border: '2px solid #14110D', background: '#fff', padding: '18px' }}>
          <div style={labelStyle}>{isPre ? 'Pendapatan Masuk' : 'Pendapatan'}</div>
          <div style={{ fontFamily: "'Archivo'", fontWeight: 900, fontSize: '28px', marginTop: '6px' }}>{revenue}</div>
          {isPre && <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', color: '#6b655a', marginTop: '2px' }}>{sessionsCountLabel}</div>}
        </div>
        <div style={{ border: '2px solid #14110D', background: '#fff', padding: '18px' }}>
          <div style={labelStyle}>{stockMetaLabel}</div>
          <div style={{ fontFamily: "'Archivo'", fontWeight: 900, fontSize: '28px', marginTop: '6px' }}>{stockMetaValue}</div>
          {isPre && <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', color: '#6b655a', marginTop: '2px' }}>{sessionsCountLabel}</div>}
        </div>
      </div>

      <div style={{ border: '2px solid #14110D', background: '#fff' }}>
        <div style={{ padding: '14px 20px', borderBottom: '2px solid #14110D', fontFamily: "'Archivo'", fontWeight: 800, fontSize: '16px', textTransform: 'uppercase' }}>
          Edit Detail Produk
        </div>
        <div style={{ padding: '22px 20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="ce-form-grid-2" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '14px' }}>
            <div>
              <div style={labelStyle}>Nama Produk</div>
              <input value={e.name} onChange={(ev) => setEdit({ name: ev.target.value })} style={inputStyle} />
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', color: '#6b655a', marginTop: '6px' }}>
                Slug: <span style={{ color: '#14110D' }}>/produk/{(e.name || p.name).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')}</span>
              </div>
            </div>
            <div>
              <div style={labelStyle}>Kategori</div>
              <select value={e.cat} onChange={(ev) => setEdit({ cat: ev.target.value })} style={inputStyle}>
                {data.categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {!isPre && (
            <div className="ce-form-grid-4" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '14px' }}>
              <div>
                <div style={labelStyle}>Harga Jual (Rp)</div>
                <input type="number" value={e.price} onChange={(ev) => setEdit({ price: ev.target.value })} style={inputStyle} />
              </div>
              <div>
                <div style={labelStyle}>Harga Coret</div>
                <input type="number" value={e.compareAt} onChange={(ev) => setEdit({ compareAt: ev.target.value })} style={inputStyle} />
              </div>
              <div>
                <div style={labelStyle}>Ukuran (koma)</div>
                <input value={e.sizes} onChange={(ev) => setEdit({ sizes: ev.target.value })} style={inputStyle} />
              </div>
              <div>
                <div style={labelStyle}>Stok</div>
                <input type="number" value={e.stock} onChange={(ev) => setEdit({ stock: ev.target.value })} style={inputStyle} />
              </div>
            </div>
          )}

          {isPre ? (
            <div style={{ background: '#F2EEE4', border: '2px solid #14110D', padding: '13px 16px', fontFamily: "'Space Mono', monospace", fontSize: '12px', color: '#6b655a', lineHeight: 1.5 }}>
              Harga, ukuran, warna &amp; biaya produk pre-order diatur per <strong style={{ color: '#14110D' }}>sesi pre-order</strong> di bawah — buat sesi baru untuk mengubahnya.
            </div>
          ) : (
            <div style={{ background: '#F2EEE4', border: '2px solid #14110D', padding: '13px 16px', fontFamily: "'Space Mono', monospace", fontSize: '12px', color: '#6b655a', lineHeight: 1.5 }}>
              Harga jual, harga coret &amp; ukuran diatur per <strong style={{ color: '#14110D' }}>sesi produksi</strong> di bawah — buat sesi produksi baru untuk mengubahnya. Stok mengikuti total jumlah produksi.
            </div>
          )}

          {!isPre && (
            <div style={{ borderTop: '1px solid #ddd5c4', paddingTop: '16px' }}>
              <div style={labelStyle}>Biaya per Unit</div>
              <div className="ce-cost-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <input type="number" placeholder="Produksi" value={e.produksi} onChange={(ev) => setEdit({ produksi: ev.target.value })} style={inputStyle} />
                <input type="number" placeholder="Kemasan" value={e.kemasan} onChange={(ev) => setEdit({ kemasan: ev.target.value })} style={inputStyle} />
                <input type="number" placeholder="Stiker & Aks." value={e.stiker} onChange={(ev) => setEdit({ stiker: ev.target.value })} style={inputStyle} />
              </div>
            </div>
          )}

          <div style={{ borderTop: '1px solid #ddd5c4', paddingTop: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={labelStyle}>Gambar Produk — klik gambar untuk jadikan default</div>
              <label style={{ background: '#14110D', color: '#F2EEE4', cursor: 'pointer', fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: '11px', letterSpacing: '0.04em', textTransform: 'uppercase', padding: '10px 16px', display: 'inline-block' }}>
                + Upload Gambar
                <input type="file" accept="image/*" multiple onChange={onUpload} style={{ display: 'none' }} />
              </label>
            </div>
            <div className="ce-images-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: '12px' }}>
              {(e.images || []).map((im, i) => {
                const isDefault = i === (e.defaultImg || 0);
                return (
                  <div
                    key={i}
                    style={{
                      position: 'relative', aspectRatio: 1,
                      border: isDefault ? '3px solid #14110D' : '2px solid #c9c1ad',
                      background: im.src ? '#fff' : p.garment,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden'
                    }}
                  >
                    <button
                      onClick={() => setDefaultImg(i)}
                      style={{ position: 'absolute', inset: 0, border: 'none', background: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}
                    >
                      {im.src ? (
                        <img src={im.src} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} alt={im.name} />
                      ) : p.print === 'logo' ? (
                        <img src="/assets/logo.png" style={{ width: '55%' }} alt="" />
                      ) : (
                        <div style={{ color: '#F2C015', fontFamily: "'Archivo'", fontWeight: 900, fontSize: '11px', lineHeight: 0.9, textAlign: 'center', textTransform: 'uppercase' }}>
                          AC<br />SYND
                        </div>
                      )}
                    </button>
                    {isDefault && (
                      <span style={{ position: 'absolute', top: '5px', left: '5px', background: '#F2C015', color: '#14110D', fontFamily: "'Space Mono', monospace", fontSize: '8px', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', padding: '2px 5px', zIndex: 2 }}>
                        DEFAULT
                      </span>
                    )}
                    <button
                      onClick={() => removeImage(i)}
                      style={{ position: 'absolute', top: '4px', right: '4px', width: '20px', height: '20px', background: '#14110D', color: '#F2EEE4', border: 'none', cursor: 'pointer', fontSize: '13px', lineHeight: 1, zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      ×
                    </button>
                    <span style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(20,17,13,0.78)', color: '#F2EEE4', fontFamily: "'Space Mono', monospace", fontSize: '9px', padding: '3px 5px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', zIndex: 1 }}>
                      {im.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '6px' }}>
            <button onClick={save} style={{ background: '#F2C015', color: '#14110D', border: 'none', cursor: 'pointer', fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: '13px', letterSpacing: '0.06em', textTransform: 'uppercase', padding: '15px 28px' }}>
              Simpan Perubahan
            </button>
            <button onClick={cancel} style={{ background: '#fff', color: '#14110D', border: '2px solid #14110D', cursor: 'pointer', fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: '13px', letterSpacing: '0.06em', textTransform: 'uppercase', padding: '13px 24px' }}>
              Batal
            </button>
          </div>
        </div>
      </div>

      {isPre && (
        <div style={{ border: '2px solid #14110D', background: '#fff', marginTop: '24px' }}>
          <div className="ce-session-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: '2px solid #14110D', gap: '14px', flexWrap: 'wrap' }}>
            <div style={{ fontFamily: "'Archivo'", fontWeight: 800, fontSize: '16px', textTransform: 'uppercase' }}>Sesi Pre-Order</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
              {activeOpen && (
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', color: '#9a3a2a', maxWidth: '300px', textAlign: 'right', lineHeight: 1.4 }}>
                  Sesi {p.preorder.sessionName} masih OPEN — tutup sesi (mulai produksi) sebelum membuat sesi baru.
                </span>
              )}
              <button
                onClick={openMakeSession}
                disabled={activeOpen}
                style={{
                  background: activeOpen ? '#e4ddcd' : '#F2C015',
                  color: activeOpen ? '#9a8f7a' : '#14110D',
                  border: 'none', cursor: activeOpen ? 'not-allowed' : 'pointer',
                  fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: '11px', letterSpacing: '0.06em', textTransform: 'uppercase', padding: '10px 16px'
                }}
              >
                + Buat Sesi Baru
              </button>
            </div>
          </div>
          <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {preSessions.map((s, i) => {
              const com = s.active ? committedOf(p) : s.committed;
              const pct = Math.min(100, Math.round((com / (s.target || 1)) * 100));
              const ns = s.status === 'closed' ? 'done' : (s.status || 'open');
              const stLabel = ns === 'open' ? 'OPEN' : ns === 'production' ? 'PRODUKSI' : ns === 'shipping' ? 'PENGIRIMAN' : 'SELESAI';
              const stStyle = ns === 'open'
                ? { background: '#F2C015', color: '#14110D' }
                : ns === 'production'
                ? { background: '#14110D', color: '#F2EEE4', border: '1px solid #14110D' }
                : ns === 'shipping'
                ? { background: '#2a5fb0', color: '#fff' }
                : { background: '#e4ddcd', color: '#6b655a' };
              const hasCompare = s.compareAt && s.compareAt > s.price;
              return (
                <div key={i} style={{ border: `2px solid ${s.active ? '#14110D' : '#ddd5c4'}`, background: '#fff' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 16px', borderBottom: '1px solid #ddd5c4', background: s.active ? '#F2EEE4' : '#fff', flexWrap: 'wrap', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontFamily: "'Archivo'", fontWeight: 800, fontSize: '15px', textTransform: 'uppercase' }}>{s.sessionName}</span>
                      {s.active && (
                        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '9px', letterSpacing: '0.06em', textTransform: 'uppercase', background: '#14110D', color: '#F2EEE4', padding: '2px 7px' }}>AKTIF</span>
                      )}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 700, padding: '4px 9px', ...stStyle }}>{stLabel}</span>
                      <button
                        onClick={() => openSessionDetail(s.sessionName)}
                        style={{ background: '#14110D', color: '#F2EEE4', border: 'none', cursor: 'pointer', fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: '10px', letterSpacing: '0.05em', textTransform: 'uppercase', padding: '7px 12px', whiteSpace: 'nowrap' }}
                      >
                        Kelola ›
                      </button>
                    </div>
                  </div>
                  <div style={{ padding: '14px 16px' }}>
                    <div className="ce-session-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '14px' }}>
                      <div><div style={labelStyle}>Periode</div><div style={{ fontFamily: "'Space Mono', monospace", fontSize: '13px', marginTop: '3px' }}>{s.opens} → {s.closes}</div></div>
                      <div><div style={labelStyle}>Estimasi Kirim</div><div style={{ fontFamily: "'Space Mono', monospace", fontSize: '13px', marginTop: '3px' }}>{s.eta}</div></div>
                      <div>
                        <div style={labelStyle}>Harga</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '3px' }}>
                          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '13px', fontWeight: 700 }}>{rp(s.price || 0)}</span>
                          {hasCompare && <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', color: '#9a8f7a', textDecoration: 'line-through' }}>{rp(s.compareAt)}</span>}
                        </div>
                      </div>
                      <div><div style={labelStyle}>Ukuran</div><div style={{ fontFamily: "'Space Mono', monospace", fontSize: '13px', marginTop: '3px' }}>{(s.sizes || []).join(', ')}</div></div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '14px' }}>
                      <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '9px', letterSpacing: '0.06em', textTransform: 'uppercase', color: '#6b655a' }}>Warna</span>
                      <div style={{ display: 'flex', gap: '5px' }}>
                        {(s.colors || []).map((c, ci) => (
                          <span key={ci} style={{ width: '18px', height: '18px', border: '1px solid #14110D', background: c.hex, display: 'inline-block' }} />
                        ))}
                      </div>
                    </div>
                    <div style={{ marginTop: '14px', height: '8px', background: '#e4ddcd', position: 'relative' }}>
                      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${pct}%`, background: com >= s.target ? '#1f7a3d' : '#14110D' }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "'Space Mono', monospace", fontSize: '11px', color: '#6b655a', marginTop: '7px' }}>
                      <span>{com} / {s.target} unit · Pendapatan {rp((s.price || 0) * com)}</span>
                      <span>{pct}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {!isPre && (
        <div style={{ border: '2px solid #14110D', background: '#fff', marginTop: '24px' }}>
          <div className="ce-session-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: '2px solid #14110D', gap: '14px', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontFamily: "'Archivo'", fontWeight: 800, fontSize: '16px', textTransform: 'uppercase' }}>Sesi Produksi</div>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', color: '#6b655a', marginTop: '2px' }}>
                {prodSessions.length} batch · {prodSessions.reduce((a, s) => a + (s.qty || 0), 0)} unit diproduksi
              </div>
            </div>
            <button
              onClick={openMakeSession}
              style={{ background: '#F2C015', color: '#14110D', border: 'none', cursor: 'pointer', fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: '11px', letterSpacing: '0.06em', textTransform: 'uppercase', padding: '10px 16px' }}
            >
              + Buat Sesi Produksi
            </button>
          </div>
          <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {prodSessions.map((s, i) => {
              const qty = s.qty || 0, sold = s.sold || 0, sisa = Math.max(0, qty - sold);
              const pct = qty ? Math.min(100, Math.round((sold / qty) * 100)) : 0;
              const unitCost = (s.costs?.production || 0) + (s.costs?.kemasan || 0) + (s.costs?.stiker || 0);
              const active = s.status === 'active';
              const priceFmt = rp(s.price || p.price);
              const hasCompare = s.compareAt && s.compareAt > (s.price || 0);
              const sizesLabel = (s.sizes && s.sizes.length ? s.sizes : p.sizes || []).join(', ');
              return (
                <div key={i} style={{ border: `2px solid ${active ? '#14110D' : '#ddd5c4'}`, background: '#fff' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 16px', borderBottom: '1px solid #ddd5c4', background: active ? '#F2EEE4' : '#fff', flexWrap: 'wrap', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontFamily: "'Archivo'", fontWeight: 800, fontSize: '15px', textTransform: 'uppercase' }}>{s.name}</span>
                      {active && (
                        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '9px', letterSpacing: '0.06em', textTransform: 'uppercase', background: '#14110D', color: '#F2EEE4', padding: '2px 7px' }}>AKTIF</span>
                      )}
                    </div>
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 700, padding: '4px 9px', background: active ? '#F2C015' : '#e4ddcd', color: active ? '#14110D' : '#6b655a' }}>
                      {active ? 'AKTIF' : 'SELESAI'}
                    </span>
                  </div>
                  <div style={{ padding: '14px 16px' }}>
                    <div className="ce-prod-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '14px' }}>
                      <div><div style={labelStyle}>Tanggal Produksi</div><div style={{ fontFamily: "'Space Mono', monospace", fontSize: '13px', marginTop: '3px' }}>{s.date}</div></div>
                      <div><div style={labelStyle}>Jumlah Produksi</div><div style={{ fontFamily: "'Space Mono', monospace", fontSize: '13px', marginTop: '3px', fontWeight: 700 }}>{qty} unit</div></div>
                      <div><div style={labelStyle}>Biaya / Unit</div><div style={{ fontFamily: "'Space Mono', monospace", fontSize: '13px', marginTop: '3px' }}>{rp(unitCost)}</div></div>
                      <div><div style={labelStyle}>Total Biaya</div><div style={{ fontFamily: "'Space Mono', monospace", fontSize: '13px', marginTop: '3px' }}>{rp(unitCost * qty)}</div></div>
                    </div>
                    <div className="ce-prod-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '14px', marginTop: '12px' }}>
                      <div>
                        <div style={labelStyle}>Harga Jual</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '3px' }}>
                          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '13px', fontWeight: 700 }}>{priceFmt}</span>
                          {hasCompare && <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', color: '#9a8f7a', textDecoration: 'line-through' }}>{rp(s.compareAt)}</span>}
                        </div>
                      </div>
                      <div style={{ gridColumn: 'span 3' }}>
                        <div style={labelStyle}>Ukuran</div>
                        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '13px', marginTop: '3px' }}>{sizesLabel}</div>
                      </div>
                    </div>
                    <div style={{ marginTop: '14px', height: '8px', background: '#e4ddcd', position: 'relative' }}>
                      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${pct}%`, background: sold >= qty ? '#1f7a3d' : '#14110D' }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "'Space Mono', monospace", fontSize: '11px', color: '#6b655a', marginTop: '7px' }}>
                      <span>{sold} terjual · Sisa {sisa} · Pendapatan {rp((s.price || p.price) * sold)}</span>
                      <span>{pct}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}