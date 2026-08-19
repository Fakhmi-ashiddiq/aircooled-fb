import React, { useContext, useState } from 'react';
import { useStore } from '../../store';

const blankProd = () => ({
  name: '', cat: 'Kaos', type: 'ready', price: '',
  sizeType: 'reg', manualSizes: 'S,M,L,XL',
  selectedColors: [],
  images: [],
  print: 'logo', stock: '', produksi: '', kemasan: '', stiker: ''
});

export default function ProductModal() {
  const { data, state, updateState } = useStore();
  const [np, setNp] = useState(blankProd());

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
    let done = 0;
    const imgs = [...np.images];
    files.forEach((f) => {
      const rd = new FileReader();
      rd.onload = () => {
        imgs.push({ src: rd.result, name: f.name.replace(/\.[^.]+$/, '').slice(0, 20) });
        done++;
        if (done === files.length) setNp({ ...np, images: imgs });
      };
      rd.readAsDataURL(f);
    });
  };

  const removeImage = (idx) => {
    const imgs = [...np.images];
    imgs.splice(idx, 1);
    setNp({ ...np, images: imgs });
  };

  const addProduct = async () => {
    const isPre = np.type === 'preorder';
    
    let finalSizes = [];
    if (np.sizeType === 'manual') {
      finalSizes = np.manualSizes.split(',').map(s => s.trim()).filter(Boolean);
    } else {
      const foundSet = (data.sizeSets || []).find(s => s.code === np.sizeType);
      finalSizes = foundSet ? foundSet.sizes : [];
    }

    const finalColors = np.selectedColors.map(c => ({ name: c.name, hex: c.hex }));

    const prod = {
      code: np.name.toLowerCase().replace(/\s+/g, '-') + '-' + Math.floor(Math.random() * 1000),
      name: np.name,
      category: np.cat,
      type: np.type,
      price: Number(np.price),
      sizes: finalSizes,
      colors: finalColors,
      images: np.images.map(img => img.src),
      print_type: np.print,
      stock: isPre ? 0 : Number(np.stock),
      costs: {
        production: Number(np.produksi||0),
        kemasan: Number(np.kemasan||0),
        stiker: Number(np.stiker||0)
      }
    };

    await useStore.getState().addProduct(prod);
    setNp(blankProd());
    updateState({ prodModal: false });
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
            <div style={labelStyle}>Nama Produk</div>
            <input placeholder="mis. Targa Florio Tee" value={np.name} onChange={set('name')} style={inputStyle} />
          </div>

          <div className="prodmodal-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <div style={labelStyle}>Kategori</div>
              <select value={np.cat} onChange={set('cat')} style={inputStyle}>
                {(data.categories || []).map((c) => <option key={c.id || c.name || c} value={c.name || c}>{c.name || c}</option>)}
              </select>
            </div>
            <div>
              <div style={labelStyle}>Harga (Rp)</div>
              <input type="number" placeholder="185000" value={np.price} onChange={set('price')} style={inputStyle} />
            </div>
          </div>

          <div>
            <div style={labelStyle}>Tipe Produk</div>
            <div style={{ display: 'flex' }}>
              <button onClick={() => setNp({ ...np, type: 'ready' })} style={segStyle(np.type === 'ready')}>Ready Stock</button>
              <button onClick={() => setNp({ ...np, type: 'preorder' })} style={segStyle(np.type === 'preorder')}>Pre-Order</button>
            </div>
          </div>

          <div className="prodmodal-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <div style={labelStyle}>Pilihan Ukuran</div>
              <select value={np.sizeType} onChange={set('sizeType')} style={{ ...inputStyle, marginBottom: np.sizeType === 'manual' ? '8px' : '0' }}>
                {(data.sizeSets || []).map(sz => (
                  <option key={sz.code} value={sz.code}>{sz.name} ({sz.sizes.join(', ')})</option>
                ))}
                <option value="manual">Lainnya (Manual)</option>
              </select>
              {np.sizeType === 'manual' && (
                <input placeholder="S,M,L,XL" value={np.manualSizes} onChange={set('manualSizes')} style={inputStyle} />
              )}
            </div>
            {np.type === 'ready' && (
              <div>
                <div style={labelStyle}>Stok Awal</div>
                <input type="number" placeholder="50" value={np.stock} onChange={set('stock')} style={inputStyle} />
              </div>
            )}
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
                    <img src={im.src} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Uploaded" />
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
            style={{ background: '#F2C015', color: '#14110D', border: 'none', cursor: 'pointer', fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: '14px', letterSpacing: '0.06em', textTransform: 'uppercase', padding: '16px', marginTop: '8px' }}
          >
            Simpan Produk ke Katalog
          </button>
        </div>
      </div>
    </>
  );
}



