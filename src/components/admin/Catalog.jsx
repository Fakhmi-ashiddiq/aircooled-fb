import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { rp } from '../../utils/helpers';

export default function Catalog() {
  const { data, state, updateState } = useContext(AppContext);
  const { catalogTab, catalogSearch, catalogCat, catalogSort } = state;

  const isReady = catalogTab !== 'preorder';

  // ---- helper: replikasi logika poAggregate dari script asli ----
  const buyerQty = (b) => {
    const items = b.items && b.items.length ? b.items : [{ qty: b.qty || 1 }];
    return items.reduce((a, it) => a + (it.qty || 1), 0);
  };
  const committedOf = (p) => {
    const o = state.committedOverride && state.committedOverride[p.id];
    return o != null ? o : p.preorder.committed;
  };
  const poAggregate = (p) => {
    if (p.type !== 'preorder') return { committed: 0, paidIn: 0 };
    const allSess = [p.preorder].concat(p.sessionHistory || []);
    const committed = allSess.reduce(
      (a, sess, i) => a + (i === 0 ? committedOf(p) : sess.committed || 0),
      0
    );
    const paidIn = allSess.reduce((a, sess) => {
      const buyers = sess.buyers || [];
      return (
        a +
        buyers.reduce(
          (x, b) =>
            x + (b.pay === 'Lunas' ? b.payAmount || (sess.price || 0) * buyerQty(b) : 0),
          0
        )
      );
    }, 0);
    return { committed, paidIn };
  };
  const unitsOf = (p) => (p.type === 'preorder' ? committedOf(p) : p.sold || 0);

  // ---- filter & sort (persis logika asli: terbaru / terpopuler / terlaris) ----
  let display = data.PRODUCTS.filter((p) => (isReady ? p.type === 'ready' : p.type === 'preorder'));
  const q = (catalogSearch || '').trim().toLowerCase();
  if (q) display = display.filter((p) => (p.name + ' ' + p.cat).toLowerCase().includes(q));
  if (catalogCat && catalogCat !== 'all') display = display.filter((p) => p.cat === catalogCat);

  const sort = catalogSort || 'terbaru';
  display = [...display].sort((a, b) => {
    if (sort === 'terpopuler') return (b.views || 0) - (a.views || 0);
    if (sort === 'terlaris') return unitsOf(b) - unitsOf(a);
    return (b._seq || 0) - (a._seq || 0); // terbaru
  });

  // ---- actions ----
  const editProduct = (p) => {
    updateState({ adminRoute: 'catalog-edit', adminProdId: p.id, editProd: null }); // ⬅️ null, bukan {...p}
    window.scrollTo(0, 0);
  };
  const addProduct = () => updateState({ prodModal: true });
  const addCategory = () => updateState({ catModal: true, newCat: '' });

  // ---- styles (disamakan 1:1 dengan HTML asli) ----
  const tabStyle = (on) => ({
    background: on ? '#14110D' : '#fff',
    color: on ? '#F2EEE4' : '#14110D',
    border: '2px solid #14110D',
    cursor: 'pointer',
    fontFamily: "'Archivo', sans-serif",
    fontWeight: 800,
    fontSize: '14px',
    letterSpacing: '0.02em',
    textTransform: 'uppercase',
    padding: '13px 26px'
  });

  const selectStyle = (width) => ({
    width,
    flex: 'none',
    padding: '13px 14px',
    border: '2px solid #14110D',
    background: '#fff',
    fontFamily: "'Space Mono', monospace",
    fontSize: '13px',
    color: '#14110D',
    height: '48px'
  });

  const catalogCountLabel = `${display.length} produk`;

  return (
    <>
      {/* HEADER */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '12px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6b655a' }}>
            Manajemen
          </div>
          <h1 style={{ fontFamily: "'Archivo'", fontWeight: 900, fontSize: '40px', margin: '4px 0 0', textTransform: 'uppercase' }}>
            Katalog Produk
          </h1>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={addCategory}
            style={{ background: '#fff', color: '#14110D', border: '2px solid #14110D', cursor: 'pointer', fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: '12px', letterSpacing: '0.06em', textTransform: 'uppercase', padding: '11px 18px' }}
          >
            + Kategori
          </button>
          <button
            onClick={addProduct}
            style={{ background: '#F2C015', color: '#14110D', border: 'none', cursor: 'pointer', fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: '12px', letterSpacing: '0.06em', textTransform: 'uppercase', padding: '13px 20px' }}
          >
            + Produk Baru
          </button>
        </div>
      </div>

      {/* TABS */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '18px' }}>
        <button onClick={() => updateState({ catalogTab: 'ready' })} style={tabStyle(isReady)}>
          Ready Stock
        </button>
        <button onClick={() => updateState({ catalogTab: 'preorder' })} style={tabStyle(!isReady)}>
          Pre-Order
        </button>
      </div>

      {/* CONTROLS: search + kategori + sort */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '18px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
          <input
            value={catalogSearch || ''}
            onChange={(e) => updateState({ catalogSearch: e.target.value })}
            placeholder="Cari produk…"
            style={{ width: '100%', padding: '13px 14px', border: '2px solid #14110D', background: '#fff', fontFamily: "'Space Mono', monospace", fontSize: '13px' }}
          />
        </div>
        <select
          value={catalogCat || 'all'}
          onChange={(e) => updateState({ catalogCat: e.target.value })}
          style={selectStyle('170px')}
        >
          <option value="all">Semua Kategori</option>
          {data.categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select
          value={sort}
          onChange={(e) => updateState({ catalogSort: e.target.value })}
          style={selectStyle('200px')}
        >
          <option value="terbaru">Terbaru</option>
          <option value="terpopuler">Terpopuler (views)</option>
          <option value="terlaris">Terlaris (terjual)</option>
        </select>
      </div>

      {/* LIST PRODUK — grid 5 kolom, tanpa header row, 1 tombol Edit, row clickable */}
      <div style={{ border: '2px solid #14110D', background: '#fff' }}>
        <div style={{ padding: '14px 20px', borderBottom: '2px solid #14110D', fontFamily: "'Archivo'", fontWeight: 800, fontSize: '16px', textTransform: 'uppercase' }}>
          {isReady ? 'Ready Stock' : 'Pre-Order'} — {catalogCountLabel}
        </div>
        <div style={{ padding: '0 20px' }}>
          {display.map((p) => {
            const isPre = p.type === 'preorder';
            const agg = poAggregate(p);
            const sold = unitsOf(p);
            const stockLabel = isPre ? `${agg.committed} terpesan` : `${p.stock || 0} stok`;
            const revenueLabel = isPre
              ? `Pendapatan masuk ${rp(agg.paidIn)}`
              : `Terjual ${p.sold || 0} · ${rp(p.price * (p.sold || 0))}`;
            const viewsLabel = `${(p.views || 0).toLocaleString('id-ID')} views`;
            const soldShort = isPre ? `· ${sold} terpesan` : `· ${sold} terjual`;

            return (
              <div
                key={p.id}
                onClick={() => editProduct(p)}
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'auto 2fr auto 1fr auto',
                  gap: '14px',
                  alignItems: 'center',
                  padding: '12px 0',
                  borderBottom: '1px solid #ddd5c4',
                  cursor: 'pointer'
                }}
              >
                <div style={{ width: '48px', height: '48px', background: p.garment, border: '2px solid #14110D', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  {p.print === 'logo' && <img src="/assets/logo.png" style={{ width: '60%' }} alt="" />}
                  {p.print === 'text' && (
                    <div style={{ color: '#F2C015', fontFamily: "'Archivo'", fontWeight: 900, fontSize: '9px', lineHeight: 0.9, textAlign: 'center', textTransform: 'uppercase' }}>
                      AC<br />SYND
                    </div>
                  )}
                </div>
                <div>
                  <div style={{ fontFamily: "'Archivo'", fontWeight: 700, fontSize: '14px' }}>{p.name}</div>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', color: '#6b655a', marginTop: '2px' }}>
                    {p.cat} · {viewsLabel} {soldShort}
                  </div>
                </div>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '13px', fontWeight: 700 }}>{rp(p.price)}</span>
                <div>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '12px', color: '#14110D', fontWeight: 700 }}>{stockLabel}</div>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', color: '#6b655a', marginTop: '2px' }}>{revenueLabel}</div>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); editProduct(p); }}
                  style={{ background: '#fff', color: '#14110D', border: '2px solid #14110D', cursor: 'pointer', fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: '10px', letterSpacing: '0.04em', textTransform: 'uppercase', padding: '8px 14px', whiteSpace: 'nowrap' }}
                >
                  Edit ›
                </button>
              </div>
            );
          })}
          {display.length === 0 && (
            <div style={{ padding: '40px 0', textAlign: 'center', fontFamily: "'Space Mono', monospace", fontSize: '13px', color: '#6b655a' }}>
              Tidak ada produk yang cocok dengan pencarian / filter.
            </div>
          )}
        </div>
      </div>
    </>
  );
}