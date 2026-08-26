import React, { useContext, useState } from 'react';
import { useStore } from '../../store';
import { hasOverXxlSizes } from '../../hooks/useProductVM';

const blankProd = () => ({
  name: '', cat: 'Kaos', type: 'ready', price: '',
  parentId: '',
  sizeType: 'reg', manualSizes: 'S,M,L,XL',
  selectedColors: [],
  images: [],
  print: 'logo', stockSizes: {}, weight: '1000', targetUnit: '',
  produksi: '', kemasan: '', stiker: '',
  hppLess: '', hppMore: '',
  priceLess: '', priceMore: '',
  priceLessDiscount: '', priceMoreDiscount: ''
});

export default function ProductModal() {
  const { data, state, updateState } = useStore();
  const [np, setNp] = useState(blankProd());
  const [submitting, setSubmitting] = useState(false);

  if (!state.prodModal) return null;

  const close = () => updateState({ prodModal: false });
  const set = (k) => (e) => setNp({ ...np, [k]: e.target.value });

  const segStyle = (on) => ({
    background: on ? '#14110D' : '#fff',
    color: on ? '#F2EEE4' : '#14110D',
    border: '2px solid #14110D',
    cursor: 'pointer',
    fontFamily: "'Space Mono', monospace",
    fontWeight: 700,
    fontSize: '12px',
    textTransform: 'uppercase',
    padding: '11px',
    flex: 1
  });

  const inputStyle = { width: '100%', padding: '13px', border: '2px solid #14110D', background: '#fff', fontSize: '14px' };
  const labelStyle = { fontFamily: "'Space Mono', monospace", fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6b655a', marginBottom: '7px' };

  const toggleColor = (colorObj) => {
    const exists = np.selectedColors.find(c => c.code === colorObj.code);
    if (exists) {
      setNp({ ...np, selectedColors: np.selectedColors.filter(c => c.code !== colorObj.code) });
    } else {
      setNp({ ...np, selectedColors: [...np.selectedColors, colorObj] });
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
    setNp({ ...np, images: [...np.images, ...imgs] });
  };

  const removeImage = (idx) => {
    const imgs = [...np.images];
    imgs.splice(idx, 1);
    setNp({ ...np, images: imgs });
  };

  const addProduct = async () => {
    setSubmitting(true);
    try {
      const isPre = np.type === 'preorder';
      
      let finalSizes = [];
      if (np.sizeType === 'manual') {
        finalSizes = np.manualSizes.split(',').map(s => s.trim()).filter(Boolean);
      } else {
        const foundSet = (data.sizeSets || []).find(s => s.code === np.sizeType);
        finalSizes = foundSet ? foundSet.sizes : [];
      }

      const finalColors = np.selectedColors.map(c => ({ name: c.name, hex: c.hex }));

      const fd = new FormData();
      fd.append('code', np.name.toLowerCase().replace(/\s+/g, '-') + '-' + Math.floor(Math.random() * 1000));
      fd.append('name', np.name);
      fd.append('category', np.cat);
      fd.append('type', np.type);
      fd.append('price', Number(np.price));
      fd.append('product_parent_id', np.parentId || '');
      fd.append('target', np.type === 'preorder' ? Number(np.targetUnit) || 0 : 0);
      fd.append('sizes', JSON.stringify(finalSizes));
      fd.append('colors', JSON.stringify(finalColors));
      fd.append('print_type', np.print);
      fd.append('stock', JSON.stringify(isPre ? {} : np.stockSizes));
      fd.append('weight', Number(np.weight) || 1000);
      fd.append('costs', JSON.stringify({
        production: Number(np.produksi||0),
        kemasan: Number(np.kemasan||0),
        stiker: Number(np.stiker||0)
      }));
      fd.append('hpp_less_xxl_unit', Number(np.hppLess || 0));
      const showDualPrice = hasOverXxlSizes(finalSizes);
      fd.append('hpp_more_xxl_unit', showDualPrice ? Number(np.hppMore || 0) : Number(np.hppLess || 0));
      fd.append('price_less_xxl', Number(np.priceLess || np.price || 0));
      fd.append('price_more_xxl', showDualPrice ? Number(np.priceMore || 0) : Number(np.priceLess || np.price || 0));
      if (np.priceLessDiscount) fd.append('price_less_xxl_discount', Number(np.priceLessDiscount));
      fd.append('price_more_xxl_discount', showDualPrice ? (np.priceMoreDiscount ? Number(np.priceMoreDiscount) : '') : (np.priceLessDiscount ? Number(np.priceLessDiscount) : ''));

      np.images.forEach((img) => {
        if (img.file && img.file instanceof File && img.file.size > 0) {
          fd.append('images[]', img.file);
        }
      });

      await useStore.getState().addProduct(fd);
      setNp(blankProd());
      updateState({ prodModal: false });
    } catch (e) {
      const msg = e.response?.data?.message || e.response?.data?.errors?.images?.[0] || e.message || 'Gagal menambahkan produk';
      useStore.getState().showToast(msg);
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <style>{"@media (max-width: 640px) { .prodmodal-box { width: 94vw !important; } .prodmodal-body { padding: 18px !important; } .prodmodal-grid-2 { grid-template-columns: 1fr !important; } .prodmodal-grid-3 { grid-template-columns: 1fr !important; } }"}</style>
      <div onClick={close} style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(20,17,13,0.62)' }} />
      <div
        className="prodmodal-box"
        style={{
          position: 'fixed', zIndex: 101, top: '50%', left: '50%',
          transform: 'translate(-50%,-50%)', width: '640px', maxWidth: '94vw',
          maxHeight: '90vh', overflowY: 'auto', background: '#F2EEE4', border: '2px solid #14110D'
        }}
      >
        <div style={{ padding: '18px 24px', borderBottom: '2px solid #14110D', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, background: '#F2EEE4', zIndex: 10 }}>
          <div style={{ fontFamily: "'Archivo'", fontWeight: 900, fontSize: '22px', textTransform: 'uppercase' }}>Produk Baru</div>
          <button onClick={close} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '24px', lineHeight: 1 }}>×</button>
        </div>

        <div className="prodmodal-body" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <div style={labelStyle}>SKU (Product Parent)</div>
            <select value={np.parentId} onChange={set('parentId')} style={inputStyle}>
              <option value="">— Pilih SKU —</option>
              {(data.productParents || []).map((pp) => (
                <option key={pp.id} value={pp.id}>{pp.sku}</option>
              ))}
            </select>
          </div>

          <div>
            <div style={labelStyle}>Nama Produk</div>
            <input placeholder="mis. Targa Florio Tee" value={np.name} onChange={set('name')} style={inputStyle} />
          </div>

          <div>
            <div style={labelStyle}>Tipe Produk</div>
            <div style={{ display: 'flex' }}>
              <button onClick={() => setNp({ ...np, type: 'ready' })} style={segStyle(np.type === 'ready')}>Ready Stock</button>
              <button onClick={() => setNp({ ...np, type: 'preorder' })} style={segStyle(np.type === 'preorder')}>Pre-Order</button>
            </div>
          </div>

          {np.type === 'preorder' && (
            <div>
              <div style={labelStyle}>Target Unit</div>
              <input type="number" placeholder="mis. 50" min="0" value={np.targetUnit} onChange={set('targetUnit')} style={{ ...inputStyle, maxWidth: '200px' }} />
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', color: '#6b655a', marginTop: '4px' }}>Jumlah unit yang ingin diproduksi</div>
            </div>
          )}

          <div className="prodmodal-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <div style={labelStyle}>Kategori</div>
              <select value={np.cat} onChange={set('cat')} style={inputStyle}>
                {(data.categories || []).map((c) => <option key={c.id || c.name || c} value={c.name || c}>{c.name || c}</option>)}
              </select>
            </div>
            <div>
              <div style={labelStyle}>Pilihan Ukuran</div>
              <select value={np.sizeType} onChange={(e) => {
                const newType = e.target.value;
                const foundSet = (data.sizeSets || []).find(s => s.code === newType);
                const sizes = foundSet ? foundSet.sizes : [];
                const newStockSizes = {};
                sizes.forEach(sz => { newStockSizes[sz] = np.stockSizes[sz] || 0; });
                setNp({ ...np, sizeType: newType, stockSizes: newStockSizes });
              }} style={inputStyle}>
                {(data.sizeSets || []).map(sz => (
                  <option key={sz.code} value={sz.code}>{sz.name} ({sz.sizes.join(', ')})</option>
                ))}
              </select>
            </div>
          </div>

          {(() => {
            const finalSizes = (data.sizeSets || []).find(s => s.code === np.sizeType)?.sizes || [];
            if (finalSizes.length === 0) return null;
            return (
              <div>
                <div style={labelStyle}>Stok per Ukuran</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '10px' }}>
                  {finalSizes.map(sz => (
                    <div key={sz}>
                      <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', fontWeight: 700, marginBottom: '4px' }}>{sz}</div>
                      <input type="number" placeholder="0" min="0"
                        value={np.stockSizes[sz] || ''}
                        onChange={(e) => setNp({ ...np, stockSizes: { ...np.stockSizes, [sz]: Number(e.target.value) || 0 } })}
                        style={{ ...inputStyle, padding: '10px', fontSize: '13px' }}
                      />
                    </div>
                  ))}
                </div>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', color: '#6b655a', marginTop: '8px' }}>
                  Total: {Object.values(np.stockSizes).reduce((a, b) => a + (b || 0), 0)} unit
                </div>
              </div>
            );
          })()}

          <div style={{ borderTop: '1px solid #ddd5c4', paddingTop: '16px' }}>
            <div style={labelStyle}>Berat Produk (gram)</div>
            <input type="number" placeholder="1000" value={np.weight} onChange={set('weight')} style={{ ...inputStyle, maxWidth: '200px' }} />
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', color: '#6b655a', marginTop: '4px' }}>Default 1000 gram (1 kg)</div>
          </div>

          <div style={{ borderTop: '1px solid #ddd5c4', paddingTop: '16px' }}>
            <div style={labelStyle}>Harga & HPP per Ukuran</div>
            {(() => {
              const currentSizes = (data.sizeSets || []).find(s => s.code === np.sizeType)?.sizes || [];
              const showDual = hasOverXxlSizes(currentSizes);
              if (showDual) {
                return (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div style={{ border: '2px solid #14110D', padding: '14px', background: '#fff' }}>
                      <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', fontWeight: 700, marginBottom: '10px', color: '#14110D' }}>&lt; XXL (XS, S, M, L, XL)</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <input type="number" placeholder="HPP / Satuan" value={np.hppLess} onChange={set('hppLess')} style={inputStyle} />
                        <input type="number" placeholder="Harga Jual" value={np.priceLess} onChange={set('priceLess')} style={inputStyle} />
                        <input type="number" placeholder="Harga Coret (opsional)" value={np.priceLessDiscount} onChange={set('priceLessDiscount')} style={inputStyle} />
                      </div>
                    </div>
                    <div style={{ border: '2px solid #14110D', padding: '14px', background: '#fff' }}>
                      <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', fontWeight: 700, marginBottom: '10px', color: '#14110D' }}>&gt;= XXL (XXL, 3L, 4L, 5L, 6L)</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <input type="number" placeholder="HPP / Satuan" value={np.hppMore} onChange={set('hppMore')} style={inputStyle} />
                        <input type="number" placeholder="Harga Jual" value={np.priceMore} onChange={set('priceMore')} style={inputStyle} />
                        <input type="number" placeholder="Harga Coret (opsional)" value={np.priceMoreDiscount} onChange={set('priceMoreDiscount')} style={inputStyle} />
                      </div>
                    </div>
                  </div>
                );
              }
              return (
                <div style={{ border: '2px solid #14110D', padding: '14px', background: '#fff', maxWidth: '400px' }}>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', fontWeight: 700, marginBottom: '10px', color: '#14110D' }}>Harga</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <input type="number" placeholder="HPP / Satuan" value={np.hppLess} onChange={set('hppLess')} style={inputStyle} />
                    <input type="number" placeholder="Harga Jual" value={np.priceLess} onChange={set('priceLess')} style={inputStyle} />
                    <input type="number" placeholder="Harga Coret (opsional)" value={np.priceLessDiscount} onChange={set('priceLessDiscount')} style={inputStyle} />
                  </div>
                </div>
              );
            })()}
          </div>

          <div className="prodmodal-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <div style={labelStyle}>Warna (Bisa Pilih &gt; 1)</div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {(data.colorOptions || []).map((col) => {
                  const isSelected = np.selectedColors.find(c => c.code === col.code);
                  return (
                    <button
                      key={col.code}
                      title={col.name}
                      onClick={() => toggleColor(col)}
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
                Dipilih: {np.selectedColors.length > 0 ? np.selectedColors.map(c => c.name).join(', ') : 'Belum ada'}
              </div>
            </div>
            <div>
              <div style={labelStyle}>Sablon</div>
              <div style={{ display: 'flex' }}>
                <button onClick={() => setNp({ ...np, print: 'logo' })} style={segStyle(np.print === 'logo')}>Logo</button>
                <button onClick={() => setNp({ ...np, print: 'text' })} style={segStyle(np.print === 'text')}>Teks</button>
              </div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid #ddd5c4', paddingTop: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={labelStyle}>Gambar Produk</div>
              <label style={{ background: '#14110D', color: '#F2EEE4', cursor: 'pointer', fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: '11px', letterSpacing: '0.04em', textTransform: 'uppercase', padding: '8px 12px', display: 'inline-block' }}>
                + Upload Foto
                <input type="file" accept="image/*" multiple onChange={onUpload} style={{ display: 'none' }} />
              </label>
            </div>
            {np.images.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px' }}>
                {np.images.map((im, i) => (
                  <div key={i} style={{ position: 'relative', aspectRatio: 1, border: '2px solid #14110D', background: '#e0d8c3' }}>
                    <img src={im.preview || im.src} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Uploaded" />
                    <button onClick={() => removeImage(i)} style={{ position: 'absolute', top: 0, right: 0, background: '#14110D', color: '#F2EEE4', border: 'none', cursor: 'pointer', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>×</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ borderTop: '1px solid #ddd5c4', paddingTop: '16px' }}>
            <div style={labelStyle}>Daftar Biaya per Unit</div>
            <div className="prodmodal-grid-3" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
              <input type="number" placeholder="Produksi" value={np.produksi} onChange={set('produksi')} style={inputStyle} />
              <input type="number" placeholder="Kemasan" value={np.kemasan} onChange={set('kemasan')} style={inputStyle} />
              <input type="number" placeholder="Stiker & Aks." value={np.stiker} onChange={set('stiker')} style={inputStyle} />
            </div>
          </div>

          <button
            onClick={addProduct}
            disabled={submitting}
            style={{ background: submitting ? '#d4b812' : '#F2C015', color: '#14110D', border: 'none', cursor: submitting ? 'not-allowed' : 'pointer', fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: '14px', letterSpacing: '0.06em', textTransform: 'uppercase', padding: '16px', marginTop: '8px', width: '100%', opacity: submitting ? 0.7 : 1 }}
          >
            {submitting ? 'Menyimpan...' : 'Simpan Produk ke Katalog'}
          </button>
        </div>
      </div>
    </>
  );
}



