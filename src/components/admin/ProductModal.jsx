import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';

const blankProd = () => ({
  name: '', cat: 'Kaos', type: 'ready', price: '',
  sizes: 'S,M,L,XL', garment: '#D9CBB0', print: 'logo',
  stock: '', produksi: '', kemasan: '', stiker: ''
});

const GARMENT_SWATCHES = ['#D9CBB0', '#26231F', '#1d1a16', '#E4DCC8', '#B8B5AE', '#EFEBE2', '#1a1f2b', '#CDB892'];

export default function ProductModal() {
  const { data, setData, state, updateState } = useContext(AppContext);
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

  const addProduct = () => {
    const id = 'new-' + Date.now();
    const isPre = np.type === 'preorder';
    const sizes = (np.sizes || 'One Size').split(',').map((s) => s.trim()).filter(Boolean);
    const prod = {
      id,
      name: np.name || 'Produk Baru',
      cat: np.cat || 'Kaos',
      type: np.type,
      price: parseInt(np.price) || 0,
      garment: np.garment,
      print: np.print,
      sizes: sizes.length ? sizes : ['One Size'],
      colors: [{ name: 'Default', hex: np.garment }],
      gallery: ['Depan', 'Belakang', 'Detail'],
      costs: {
        production: parseInt(np.produksi) || 0,
        kemasan: parseInt(np.kemasan) || 0,
        stiker: parseInt(np.stiker) || 0
      },
      views: 0,
      _seq: Date.now()
    };
    if (isPre) {
      prod.preorder = { sessionName: 'BELUM ADA SESI', opens: '-', closes: '-', target: 30, committed: 0, eta: '-', status: 'open' };
    } else {
      prod.stock = parseInt(np.stock) || 0;
      prod.sold = 0;
    }
    setData((prev) => ({ ...prev, PRODUCTS: [...prev.PRODUCTS, prod] }));
    setNp(blankProd());
    updateState({ prodModal: false });
  };

  return (
    <>
      <div onClick={close} style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(20,17,13,0.62)' }} />
      <div
        style={{
          position: 'fixed', zIndex: 101, top: '50%', left: '50%',
          transform: 'translate(-50%,-50%)', width: '560px', maxWidth: '94vw',
          maxHeight: '90vh', overflowY: 'auto', background: '#F2EEE4', border: '2px solid #14110D'
        }}
      >
        <div style={{ padding: '18px 24px', borderBottom: '2px solid #14110D', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, background: '#F2EEE4' }}>
          <div style={{ fontFamily: "'Archivo'", fontWeight: 900, fontSize: '22px', textTransform: 'uppercase' }}>Produk Baru</div>
          <button onClick={close} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '24px', lineHeight: 1 }}>×</button>
        </div>

        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <div style={labelStyle}>Nama Produk</div>
            <input placeholder="mis. Targa Florio Tee" value={np.name} onChange={set('name')} style={inputStyle} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <div style={labelStyle}>Kategori</div>
              <select value={np.cat} onChange={set('cat')} style={inputStyle}>
                {data.categories.map((c) => <option key={c} value={c}>{c}</option>)}
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <div style={labelStyle}>Ukuran (pisah koma)</div>
              <input placeholder="S,M,L,XL" value={np.sizes} onChange={set('sizes')} style={inputStyle} />
            </div>
            {np.type === 'ready' && (
              <div>
                <div style={labelStyle}>Stok Awal</div>
                <input type="number" placeholder="50" value={np.stock} onChange={set('stock')} style={inputStyle} />
              </div>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <div style={labelStyle}>Warna Garment</div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {GARMENT_SWATCHES.map((hex) => (
                  <button
                    key={hex}
                    onClick={() => setNp({ ...np, garment: hex })}
                    style={{
                      width: '34px', height: '34px', cursor: 'pointer',
                      border: np.garment === hex ? '3px solid #14110D' : '2px solid #c9c1ad',
                      background: hex
                    }}
                  />
                ))}
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
            <div style={labelStyle}>Daftar Biaya per Unit</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
              <input type="number" placeholder="Produksi" value={np.produksi} onChange={set('produksi')} style={inputStyle} />
              <input type="number" placeholder="Kemasan" value={np.kemasan} onChange={set('kemasan')} style={inputStyle} />
              <input type="number" placeholder="Stiker & Aks." value={np.stiker} onChange={set('stiker')} style={inputStyle} />
            </div>
          </div>

          <button
            onClick={addProduct}
            style={{ background: '#F2C015', color: '#14110D', border: 'none', cursor: 'pointer', fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: '14px', letterSpacing: '0.06em', textTransform: 'uppercase', padding: '16px' }}
          >
            Simpan Produk ke Katalog
          </button>
        </div>
      </div>
    </>
  );
}