import React, { useContext, useState } from 'react';
import { useStore } from '../../store';
import { rp } from '../../utils/helpers';
import useCountUp from '../../hooks/useCountUp';
import { hasOverXxlSizes } from '../../hooks/useProductVM';

function AnimatedNumber({ value, format, start }) {
  const animated = useCountUp(value, 1200, start);
  return <>{format ? format(animated) : animated}</>;
}

export default function CatalogEdit() {
  const { data, setData, state, updateState, unitsOf, committedOf, openProduct, poAggregate } = useStore();

  const p = data.PRODUCTS.find((x) => x.id === state.adminProdId);
  if (!p) return null;

  const isPre = p.type === 'preorder';

  const defaultDraft = {
    name: p.name,
    cat: p.cat,
    price: String(p.price || ''),
    compareAt: String(p.compareAt || ''),
    sizeType: (data.sizeSets || []).find(s => JSON.stringify(s.sizes) === JSON.stringify(p.sizes))?.code || ((data.sizeSets || [])[0]?.code || ''),
    manualSizes: (p.sizes || []).join(','),
    stock: typeof p.stock === 'object' ? p.stock : {},
    produksi: String(p.costs?.production || ''),
    kemasan: String(p.costs?.kemasan || ''),
    stiker: String(p.costs?.stiker || ''),
    hppLess: String(p.hppLessXxlUnit || ''),
    hppMore: String(p.hppMoreXxlUnit || ''),
    priceLess: String(p.priceLessXxl || ''),
    priceMore: String(p.priceMoreXxl || ''),
    priceLessDiscount: String(p.priceLessXxlDiscount || ''),
    priceMoreDiscount: String(p.priceMoreXxlDiscount || ''),
    parentId: String(p.parentId || ''),
    printType: p.print || 'logo',
    selectedColors: (p.colors || []).map(c => {
      if (typeof c === 'string') return c;
      const found = (data.colorOptions || []).find(co => co.name === c.name || co.hex === c.hex);
      return found || { name: c.name || c, hex: c.hex || '#000000', code: c.name || c };
    }),
    images: p.images || (p.gallery || ['Depan']).map((lbl) => ({ src: null, name: lbl })),
    defaultImg: p.defaultImg || 0,
    removedImages: []
  };

  const e = state.editProd || defaultDraft;
  const setEdit = (patch) => updateState({ editProd: { ...e, ...patch } });

  const [submitting, setSubmitting] = useState(false);
  const cancel = () => updateState({ adminRoute: 'catalog', adminProdId: null, editProd: null });

  const save = async () => {
    setSubmitting(true);
    try {
      const hasNewFiles = (e.images || []).some(im => im.file && !im._deleted);
      
      if (hasNewFiles) {
        const fd = new FormData();
        fd.append('name', e.name || p.name);
        fd.append('category', e.cat || p.category);
        if (!isPre) {
          fd.append('price', parseInt(e.price) || 0);
          const ca = parseInt(e.compareAt) || 0;
          fd.append('compare_at', ca > (parseInt(e.price) || 0) ? ca : '');
          const sizes = (data.sizeSets || []).find(s => s.code === e.sizeType)?.sizes || [];
          fd.append('sizes', JSON.stringify(sizes.length ? sizes : ['One Size']));
          fd.append('stock', JSON.stringify(typeof e.stock === 'object' ? e.stock : {}));
          fd.append('costs', JSON.stringify({
            production: parseInt(e.produksi) || 0,
            kemasan: parseInt(e.kemasan) || 0,
            stiker: parseInt(e.stiker) || 0
          }));
          const showDualPrice = hasOverXxlSizes(sizes);
          fd.append('hpp_less_xxl_unit', parseInt(e.hppLess) || 0);
          fd.append('hpp_more_xxl_unit', showDualPrice ? (parseInt(e.hppMore) || 0) : (parseInt(e.hppLess) || 0));
          fd.append('price_less_xxl', parseInt(e.priceLess) || 0);
          fd.append('price_more_xxl', showDualPrice ? (parseInt(e.priceMore) || 0) : (parseInt(e.priceLess) || 0));
          if (e.priceLessDiscount) fd.append('price_less_xxl_discount', parseInt(e.priceLessDiscount));
          fd.append('price_more_xxl_discount', showDualPrice ? (e.priceMoreDiscount ? parseInt(e.priceMoreDiscount) : '') : (e.priceLessDiscount ? parseInt(e.priceLessDiscount) : ''));
        }
        fd.append('product_parent_id', e.parentId || '');
        fd.append('print_type', e.printType || 'logo');
        fd.append('colors', JSON.stringify((e.selectedColors || []).map(c => ({ name: c.name, hex: c.hex }))));
        fd.append('defaultImg', e.defaultImg || 0);

        const existingPaths = (e.images || []).filter(im => im.src && !im.file && !im._deleted).map(im => im.src);
        fd.append('existingImages', JSON.stringify(existingPaths));
        fd.append('removedImages', JSON.stringify(e.removedImages || []));

        (e.images || []).forEach((im) => {
          if (im.file && im.file instanceof File && im.file.size > 0 && !im._deleted) {
            fd.append('images[]', im.file);
          }
        });

        await useStore.getState().updateProduct(p.db_id || p.id, fd);
      } else {
        const updated = { name: e.name || p.name, category: e.cat || p.category };
        if (!isPre) {
          updated.price = parseInt(e.price) || 0;
          const ca = parseInt(e.compareAt) || 0;
          updated.compare_at = ca > updated.price ? ca : null;
          updated.sizes = (data.sizeSets || []).find(s => s.code === e.sizeType)?.sizes || [];
          if (!updated.sizes.length) updated.sizes = ['One Size'];
          updated.stock = typeof e.stock === 'object' ? e.stock : {};
          updated.costs = {
            production: parseInt(e.produksi) || 0,
            kemasan: parseInt(e.kemasan) || 0,
            stiker: parseInt(e.stiker) || 0
          };
          updated.hpp_less_xxl_unit = parseInt(e.hppLess) || 0;
          const showDualPrice = hasOverXxlSizes(updated.sizes || []);
          updated.hpp_more_xxl_unit = showDualPrice ? (parseInt(e.hppMore) || 0) : (parseInt(e.hppLess) || 0);
          updated.price_less_xxl = parseInt(e.priceLess) || 0;
          updated.price_more_xxl = showDualPrice ? (parseInt(e.priceMore) || 0) : (parseInt(e.priceLess) || 0);
          updated.price_less_xxl_discount = parseInt(e.priceLessDiscount) || null;
          updated.price_more_xxl_discount = showDualPrice ? (parseInt(e.priceMoreDiscount) || null) : (parseInt(e.priceLessDiscount) || null);
        }
        updated.images = (e.images || []).map(im => im.src || im);
        updated.existingImages = (e.images || []).filter(im => im.src && !im.file && !im._deleted).map(im => im.src);
        updated.removedImages = e.removedImages || [];
        updated.defaultImg = e.defaultImg || 0;
        const def = updated.images[updated.defaultImg];
        if (def && def.src) updated.heroImg = def.src;
        updated.product_parent_id = e.parentId || null;
        updated.print_type = e.printType || 'logo';
        updated.colors = (e.selectedColors || []).map(c => ({ name: c.name, hex: c.hex }));
        
        await useStore.getState().updateProduct(p.db_id || p.id, updated);
      }
      updateState({ editProd: null });
      useStore.getState().showToast('Produk berhasil diperbarui');
    } catch (e) {
      const msg = e.response?.data?.message || e.response?.data?.errors?.images?.[0] || e.message || 'Gagal memperbarui produk';
      useStore.getState().showToast(msg);
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  const onUpload = (ev) => {
    const files = [...(ev.target.files || [])];
    if (!files.length) return;
    const maxSize = 10 * 1024 * 1024;
    const validFiles = files.filter(f => {
      if (f.size > maxSize) {
        useStore.getState().showToast(f.name + ' melebihi 10MB');
        return false;
      }
      return true;
    });
    if (!validFiles.length) return;
    const imgs = validFiles.map(f => ({ file: f, preview: URL.createObjectURL(f), name: f.name.replace(/\.[^.]+$/, '').slice(0, 20) }));
    setEdit({ images: [...(e.images || []), ...imgs] });
    ev.target.value = '';
  };
  const removeImage = (idx) => {
    const imgs = (e.images || []).map((im, i) => i === idx ? { ...im, _deleted: true } : im);
    const target = (e.images || [])[idx];
    const newRemovedImages = [...(e.removedImages || [])];
    if (target && target.src && !target.file && !newRemovedImages.includes(target.src)) {
      newRemovedImages.push(target.src);
    }
    setEdit({ images: imgs, removedImages: newRemovedImages });
  };

  const restoreImage = (idx) => {
    const imgs = (e.images || []).map((im, i) => i === idx ? { ...im, _deleted: false } : im);
    const target = (e.images || [])[idx];
    const newRemovedImages = (e.removedImages || []).filter(p => {
      if (target && target.src) return p !== target.src;
      return true;
    });
    setEdit({ images: imgs, removedImages: newRemovedImages });
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
  const soldUnits = isPre ? agg.committed : (p.totalSold || 0);
  const revenueN = isPre ? agg.paidIn : (p.totalRevenue || 0);
  const stockMetaLabel = isPre ? 'Target Sesi' : 'Sisa Stok';
  const stockMetaValueN = isPre ? agg.target : Object.values(e.stock || {}).reduce((a, b) => a + (b || 0), 0);
  const stockMetaFormat = isPre ? (v) => `${v} unit` : (v) => `${v} unit`;
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
        Ã¢â€ Â Kembali ke Katalog
      </button>

      <div className="ce-header-row" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '20px', marginBottom: '28px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: '18px', alignItems: 'center' }}>
          <div style={{ width: '84px', height: '84px', background: p.garment, border: '2px solid #14110D', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flex: 'none' }}>
            {p.images && p.images.length > 0 && p.images[0].src && p.images[0].src !== '/logo.jpg' ? (
              <img src={p.images[0].src} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
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
              {p.cat} â€¢ {rp(p.price)}
            </div>
          </div>
        </div>
        <button
          onClick={viewStore}
          style={{ background: '#fff', color: '#14110D', border: '2px solid #14110D', cursor: 'pointer', fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: '11px', letterSpacing: '0.04em', textTransform: 'uppercase', padding: '11px 16px' }}
        >
          Lihat di Store
        </button>
      </div>

      <div className="ce-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px', marginBottom: '24px' }}>
        <div style={{ border: '2px solid #14110D', background: '#fff', padding: '18px' }}>
          <div style={labelStyle}>{isPre ? 'Unit Terpesan' : 'Unit Terjual'}</div>
          <div style={{ fontFamily: "'Archivo'", fontWeight: 900, fontSize: '28px', marginTop: '6px' }}>
            <AnimatedNumber value={soldUnits} start={state.appReady} />
          </div>
          {isPre && <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', color: '#6b655a', marginTop: '2px' }}>{sessionsCountLabel}</div>}
        </div>
        <div style={{ border: '2px solid #14110D', background: '#fff', padding: '18px' }}>
          <div style={labelStyle}>{isPre ? 'Pendapatan Masuk' : 'Pendapatan'}</div>
          <div style={{ fontFamily: "'Archivo'", fontWeight: 900, fontSize: '28px', marginTop: '6px' }}>
            <AnimatedNumber value={revenueN} format={(v) => rp(v)} start={state.appReady} />
          </div>
          {isPre && <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', color: '#6b655a', marginTop: '2px' }}>{sessionsCountLabel}</div>}
        </div>
        <div style={{ border: '2px solid #14110D', background: '#fff', padding: '18px' }}>
          <div style={labelStyle}>{stockMetaLabel}</div>
          <div style={{ fontFamily: "'Archivo'", fontWeight: 900, fontSize: '28px', marginTop: '6px' }}>
            <AnimatedNumber value={stockMetaValueN} format={stockMetaFormat} start={state.appReady} />
          </div>
          {isPre && <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', color: '#6b655a', marginTop: '2px' }}>{sessionsCountLabel}</div>}
        </div>
      </div>

      <div style={{ border: '2px solid #14110D', background: '#fff' }}>
        <div style={{ padding: '14px 20px', borderBottom: '2px solid #14110D', fontFamily: "'Archivo'", fontWeight: 800, fontSize: '16px', textTransform: 'uppercase' }}>
          Edit Detail Produk
        </div>
        <div style={{ padding: '22px 20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="ce-form-grid-2" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '14px' }}>
            <div>
              <div style={labelStyle}>Nama Produk</div>
              <input value={e.name} onChange={(ev) => setEdit({ name: ev.target.value })} style={inputStyle} />
            </div>
            <div>
              <div style={labelStyle}>SKU (Product Parent)</div>
              <select value={e.parentId} onChange={(ev) => setEdit({ parentId: ev.target.value })} style={inputStyle}>
                <option value="">— Pilih SKU —</option>
                {(data.productParents || []).map((pp) => (
                  <option key={pp.id} value={pp.id}>{pp.sku}</option>
                ))}
              </select>
            </div>
            <div>
              <div style={labelStyle}>Kategori</div>
              <select value={e.cat} onChange={(ev) => setEdit({ cat: ev.target.value })} style={inputStyle}>
                {data.categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: !isPre ? '1fr 1fr' : '1fr', gap: '14px' }}>
            {!isPre && (
              <div>
                <div style={labelStyle}>Pilihan Ukuran</div>
                <select value={e.sizeType} onChange={(ev) => setEdit({ sizeType: ev.target.value })} style={inputStyle}>
                  {(data.sizeSets || []).map(sz => (
                    <option key={sz.code} value={sz.code}>{sz.name} ({sz.sizes.join(', ')})</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {!isPre && (
            <>
              {(() => {
                const currentSizes = (data.sizeSets || []).find(s => s.code === e.sizeType)?.sizes || [];
                if (currentSizes.length === 0) return null;
                return (
                  <div>
                    <div style={labelStyle}>Stok per Ukuran</div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '8px' }}>
                      {currentSizes.map(sz => (
                        <div key={sz}>
                          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', fontWeight: 700, marginBottom: '3px' }}>{sz}</div>
                          <input type="number" min="0"
                            value={(e.stock || {})[sz] ?? ''}
                            placeholder="0"
                            onChange={(ev) => setEdit({ stock: { ...e.stock, [sz]: Number(ev.target.value) || 0 } })}
                            style={{ ...inputStyle, padding: '9px', fontSize: '13px' }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}

              <div>
                <div style={labelStyle}>Harga & HPP per Ukuran</div>
                {(() => {
                  const currentSizes = (data.sizeSets || []).find(s => s.code === e.sizeType)?.sizes || [];
                  const showDual = hasOverXxlSizes(currentSizes);
                  if (showDual) {
                    return (
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div style={{ border: '2px solid #14110D', padding: '14px', background: '#fff' }}>
                          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', fontWeight: 700, marginBottom: '10px', color: '#14110D' }}>&lt; XXL (XS, S, M, L, XL)</div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <input type="number" placeholder="HPP / Satuan" value={e.hppLess} onChange={(ev) => setEdit({ hppLess: ev.target.value })} style={inputStyle} />
                            <input type="number" placeholder="Harga Jual" value={e.priceLess} onChange={(ev) => setEdit({ priceLess: ev.target.value })} style={inputStyle} />
                            <input type="number" placeholder="Harga Coret (opsional)" value={e.priceLessDiscount} onChange={(ev) => setEdit({ priceLessDiscount: ev.target.value })} style={inputStyle} />
                          </div>
                        </div>
                        <div style={{ border: '2px solid #14110D', padding: '14px', background: '#fff' }}>
                          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', fontWeight: 700, marginBottom: '10px', color: '#14110D' }}>&gt;= XXL (XXL, 3L, 4L, 5L, 6L)</div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <input type="number" placeholder="HPP / Satuan" value={e.hppMore} onChange={(ev) => setEdit({ hppMore: ev.target.value })} style={inputStyle} />
                            <input type="number" placeholder="Harga Jual" value={e.priceMore} onChange={(ev) => setEdit({ priceMore: ev.target.value })} style={inputStyle} />
                            <input type="number" placeholder="Harga Coret (opsional)" value={e.priceMoreDiscount} onChange={(ev) => setEdit({ priceMoreDiscount: ev.target.value })} style={inputStyle} />
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return (
                    <div style={{ border: '2px solid #14110D', padding: '14px', background: '#fff', maxWidth: '400px' }}>
                      <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', fontWeight: 700, marginBottom: '10px', color: '#14110D' }}>Harga</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <input type="number" placeholder="HPP / Satuan" value={e.hppLess} onChange={(ev) => setEdit({ hppLess: ev.target.value })} style={inputStyle} />
                        <input type="number" placeholder="Harga Jual" value={e.priceLess} onChange={(ev) => setEdit({ priceLess: ev.target.value })} style={inputStyle} />
                        <input type="number" placeholder="Harga Coret (opsional)" value={e.priceLessDiscount} onChange={(ev) => setEdit({ priceLessDiscount: ev.target.value })} style={inputStyle} />
                      </div>
                    </div>
                  );
                })()}
              </div>
            </>
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
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <div style={labelStyle}>Sablon</div>
                <div style={{ display: 'flex' }}>
                  <button onClick={() => setEdit({ printType: 'logo' })} style={{ flex: 1, background: e.printType === 'logo' ? '#14110D' : '#fff', color: e.printType === 'logo' ? '#F2EEE4' : '#14110D', border: '2px solid #14110D', cursor: 'pointer', fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: '12px', textTransform: 'uppercase', padding: '11px' }}>Logo</button>
                  <button onClick={() => setEdit({ printType: 'text' })} style={{ flex: 1, background: e.printType === 'text' ? '#14110D' : '#fff', color: e.printType === 'text' ? '#F2EEE4' : '#14110D', border: '2px solid #14110D', cursor: 'pointer', fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: '12px', textTransform: 'uppercase', padding: '11px' }}>Teks</button>
                </div>
              </div>
              <div>
                <div style={labelStyle}>Warna (Bisa Pilih &gt; 1)</div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {(data.colorOptions || []).map((col) => {
                    const isSelected = (e.selectedColors || []).find(c => c.name === col.name);
                    return (
                      <button
                        key={col.code || col.name}
                        title={col.name}
                        onClick={() => {
                          const exists = (e.selectedColors || []).find(c => c.name === col.name);
                          const newColors = exists
                            ? (e.selectedColors || []).filter(c => c.name !== col.name)
                            : [...(e.selectedColors || []), col];
                          setEdit({ selectedColors: newColors });
                        }}
                        style={{
                          width: '34px', height: '34px', cursor: 'pointer',
                          border: isSelected ? '3px solid #14110D' : '2px solid #c9c1ad',
                          background: col.hex
                        }}
                      />
                    );
                  })}
                </div>
                <div style={{ fontSize: '11px', marginTop: '6px', color: '#6b655a', fontFamily: "'Space Mono', monospace" }}>
                  Dipilih: {(e.selectedColors || []).length > 0 ? (e.selectedColors || []).map(c => c.name).join(', ') : 'Belum ada'}
                </div>
              </div>
            </div>
          </div>

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
                const isDefault = i === (e.defaultImg || 0) && !im._deleted;
                const isDeleted = im._deleted;
                return (
                  <div
                    key={i}
                    style={{
                      position: 'relative', aspectRatio: 1,
                      border: isDefault ? '3px solid #14110D' : '2px solid #c9c1ad',
                      background: (im.src || im.preview) ? '#fff' : p.garment,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
                      opacity: isDeleted ? 0.3 : 1,
                      filter: isDeleted ? 'grayscale(100%)' : 'none'
                    }}
                  >
                    {isDeleted && (
                      <div style={{ position: 'absolute', inset: 0, background: 'rgba(220,38,38,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3 }}>
                        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', fontWeight: 700, color: '#dc2626', background: '#fff', padding: '4px 8px', borderRadius: '4px' }}>DIHAPUS</span>
                      </div>
                    )}
                    <button
                      onClick={() => isDeleted ? restoreImage(i) : setDefaultImg(i)}
                      style={{ position: 'absolute', inset: 0, border: 'none', background: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}
                    >
                      {im.src || im.preview ? (
                        <img src={im.preview || im.src} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} alt={im.name} />
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
                    {isDeleted ? (
                      <button
                        onClick={() => restoreImage(i)}
                        style={{ position: 'absolute', top: '4px', right: '4px', width: '20px', height: '20px', background: '#16a34a', color: '#F2EEE4', border: 'none', cursor: 'pointer', fontSize: '11px', lineHeight: 1, zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        title="Pulihkan"
                      >
                        ↺
                      </button>
                    ) : (
                      <button
                        onClick={() => removeImage(i)}
                        style={{ position: 'absolute', top: '4px', right: '4px', width: '20px', height: '20px', background: '#14110D', color: '#F2EEE4', border: 'none', cursor: 'pointer', fontSize: '13px', lineHeight: 1, zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        ×
                      </button>
                    )}
                    <span style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(20,17,13,0.78)', color: '#F2EEE4', fontFamily: "'Space Mono', monospace", fontSize: '9px', padding: '3px 5px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', zIndex: 1 }}>
                      {im.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '6px' }}>
            <button onClick={save} disabled={submitting}
              style={{ background: submitting ? '#d4b812' : '#F2C015', color: '#14110D', border: 'none', cursor: submitting ? 'not-allowed' : 'pointer', fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: '13px', letterSpacing: '0.06em', textTransform: 'uppercase', padding: '15px 28px', opacity: submitting ? 0.7 : 1 }}>
              {submitting ? 'Menyimpan...' : 'Simpan Perubahan'}
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
                        Kelola Ã¢â‚¬Âº
                      </button>
                    </div>
                  </div>
                  <div style={{ padding: '14px 16px' }}>
                    <div className="ce-session-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '14px' }}>
                      <div><div style={labelStyle}>Periode</div><div style={{ fontFamily: "'Space Mono', monospace", fontSize: '13px', marginTop: '3px' }}>{s.opens} Ã¢â€ â€™ {s.closes}</div></div>
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
                      <span>{com} / {s.target} unit â€¢ Pendapatan {rp((s.price || 0) * com)}</span>
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
                {prodSessions.length} batch â€¢ {prodSessions.reduce((a, s) => a + (s.qty || 0), 0)} unit diproduksi
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
                      <span>{sold} terjual â€¢ Sisa {sisa} â€¢ Pendapatan {rp((s.price || p.price) * sold)}</span>
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




