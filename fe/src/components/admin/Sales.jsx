import React, { useState, useMemo } from 'react';
import { useStore } from '../../store';
import { rp } from '../../utils/helpers';
import Pagination from '../shared/Pagination';
import OrderService from '../../services/OrderService';

const PER_PAGE = 10;

export default function Sales() {
  const { data, unitsOf, showToast, fetchInitialData } = useStore();
  const [productSearch, setProductSearch] = useState('');
  const [productPage, setProductPage] = useState(1);
  const [orderSearch, setOrderSearch] = useState('');
  const [orderPage, setOrderPage] = useState(1);
  const [confirmModal, setConfirmModal] = useState(null);

  const salesRows = useMemo(() => {
    return data.PRODUCTS.map(p => {
      const units = unitsOf ? unitsOf(p) : 0;
      return {
        id: p.id,
        name: p.name,
        type: p.type === 'preorder' ? 'Pre-Order' : 'Ready',
        typeColor: p.type === 'preorder' ? '#9a7a10' : '#3d382f',
        units,
        price: p.price,
        revenue: p.totalRevenue || 0
      };
    }).sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
  }, [data.PRODUCTS, unitsOf]);

  const filteredProducts = useMemo(() => {
    if (!productSearch.trim()) return salesRows;
    const q = productSearch.toLowerCase();
    return salesRows.filter(r => r.name.toLowerCase().includes(q));
  }, [salesRows, productSearch]);

  const totalUnits = salesRows.reduce((sum, row) => sum + row.units, 0);
  const totalRevenue = salesRows.reduce((sum, row) => sum + row.revenue, 0);

  const productTotalPages = Math.ceil(filteredProducts.length / PER_PAGE);
  const pagedProducts = filteredProducts.slice((productPage - 1) * PER_PAGE, productPage * PER_PAGE);

  const filteredOrders = useMemo(() => {
    let result = data.orders;
    if (orderSearch.trim()) {
      const q = orderSearch.toLowerCase();
      result = result.filter(o =>
        (o.customer || '').toLowerCase().includes(q) ||
        (o.code || '').toLowerCase().includes(q) ||
        (o.email || '').toLowerCase().includes(q)
      );
    }
    return [...result].sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
  }, [data.orders, orderSearch]);

  const orderTotalPages = Math.ceil(filteredOrders.length / PER_PAGE);
  const pagedOrders = filteredOrders.slice((orderPage - 1) * PER_PAGE, orderPage * PER_PAGE);

  const statusStyle = (st) => {
    const baseStyle = { fontFamily: "'Space Mono', monospace", fontSize: '10px', letterSpacing: '0.06em', textTransform: 'uppercase', padding: '3px 8px', display: 'inline-block' };
    if (st === 'Paid' || st === 'Shipped') return { ...baseStyle, background: '#14110D', color: '#F2EEE4' };
    if (st === 'Packing') return { ...baseStyle, background: '#F2C015', color: '#14110D' };
    return { ...baseStyle, background: '#fff', color: '#14110D', border: '1px solid #14110D' };
  };

  const gridTable1 = '2fr 0.9fr 0.7fr 1fr 1fr';
  const gridTable2 = 'auto 1.6fr 1fr auto auto auto';

  const cell1 = { padding: '13px 12px 13px 0', borderBottom: '1px solid #ddd5c4', display: 'flex', alignItems: 'center' };
  const head1 = { padding: '12px 12px 12px 0', borderBottom: '1px solid #ddd5c4', fontFamily: "'Space Mono', monospace", fontSize: '10px', letterSpacing: '0.06em', textTransform: 'uppercase', color: '#6b655a', display: 'flex', alignItems: 'center' };
  const cellTerjual = { ...cell1, padding: '13px 24px 13px 0' };
  const headTerjual = { ...head1, padding: '12px 24px 12px 0' };
  const cell2 = { padding: '13px 14px 13px 0', borderBottom: '1px solid #ddd5c4', display: 'flex', alignItems: 'center' };

  const searchStyle = { width: '100%', padding: '10px 14px', border: '2px solid #14110D', background: '#fff', fontSize: '13px', fontFamily: "'Space Mono', monospace" };

  const handleConfirmPayment = async (orderId, proofFile) => {
    try {
      const fd = new FormData();
      fd.append('status', 'Paid');
      if (proofFile) fd.append('payment_proof', proofFile);
      await OrderService.update(orderId, fd);
      showToast('Pembayaran dikonfirmasi');
      setConfirmModal(null);
      fetchInitialData();
    } catch (e) {
      showToast('Gagal mengkonfirmasi pembayaran');
    }
  };

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .sales-scroll { overflow-x: auto; -webkit-overflow-scrolling: touch; }
          .sales-inner-1 { min-width: 600px; }
          .sales-inner-2 { min-width: 620px; }
        }
      `}</style>

      {confirmModal && (
        <ConfirmPaymentModal order={confirmModal} onConfirm={handleConfirmPayment} onClose={() => setConfirmModal(null)} />
      )}

      <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '12px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6b655a' }}>Manajemen</div>
      <h1 style={{ fontFamily: "'Archivo'", fontWeight: 900, fontSize: '40px', margin: '4px 0 28px', textTransform: 'uppercase' }}>Penjualan &amp; Pesanan</h1>

      <div style={{ border: '2px solid #14110D', background: '#fff', marginBottom: '28px' }}>
        <div style={{ padding: '14px 20px', borderBottom: '2px solid #14110D', fontFamily: "'Archivo'", fontWeight: 800, fontSize: '16px', textTransform: 'uppercase', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Rekap per Produk</span>
          <input placeholder="Cari produk..." value={productSearch} onChange={e => { setProductSearch(e.target.value); setProductPage(1); }} style={{ ...searchStyle, width: '200px' }} />
        </div>
        <div className="sales-scroll">
          <div className="sales-inner-1" style={{ padding: '0 20px', display: 'grid', gridTemplateColumns: gridTable1 }}>
            <div style={head1}>Produk</div>
            <div style={head1}>Tipe</div>
            <div style={{ ...headTerjual, justifyContent: 'flex-end' }}>Terjual</div>
            <div style={{ ...head1, justifyContent: 'flex-end' }}>Harga</div>
            <div style={{ ...head1, justifyContent: 'flex-end', paddingRight: 0 }}>Pendapatan</div>

            {pagedProducts.map((r, idx) => (
              <React.Fragment key={idx}>
                <div style={{ ...cell1, fontSize: '14px', fontWeight: 600 }}>{r.name}</div>
                <div style={{ ...cell1, fontFamily: "'Space Mono', monospace", fontSize: '11px', color: r.typeColor }}>{r.type}</div>
                <div style={{ ...cellTerjual, justifyContent: 'flex-end', fontFamily: "'Space Mono', monospace", fontSize: '13px' }}>{r.units}</div>
                <div style={{ ...cell1, justifyContent: 'flex-end', fontFamily: "'Space Mono', monospace", fontSize: '13px' }}>{rp(r.price)}</div>
                <div style={{ ...cell1, justifyContent: 'flex-end', fontFamily: "'Space Mono', monospace", fontSize: '13px', fontWeight: 700, paddingRight: 0 }}>{rp(r.revenue)}</div>
              </React.Fragment>
            ))}

            <div style={{ padding: '14px 12px 14px 0', fontFamily: "'Archivo'", textTransform: 'uppercase', fontWeight: 800 }}>Total</div>
            <div style={{ padding: '14px 12px 14px 0' }}></div>
            <div style={{ padding: '14px 24px 14px 0', textAlign: 'right', fontFamily: "'Space Mono', monospace", fontSize: '13px', fontWeight: 800 }}>{totalUnits}</div>
            <div style={{ padding: '14px 12px 14px 0' }}></div>
            <div style={{ padding: '14px 0', textAlign: 'right', fontFamily: "'Space Mono', monospace", fontSize: '14px', fontWeight: 800 }}>{rp(totalRevenue)}</div>
          </div>
        </div>
        <div style={{ padding: '0 20px 16px' }}>
          <Pagination currentPage={productPage} totalPages={productTotalPages} onPageChange={setProductPage} />
        </div>
      </div>

      <div style={{ border: '2px solid #14110D', background: '#fff' }}>
        <div style={{ padding: '14px 20px', borderBottom: '2px solid #14110D', fontFamily: "'Archivo'", fontWeight: 800, fontSize: '16px', textTransform: 'uppercase', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Daftar Pesanan</span>
          <input placeholder="Cari pesanan..." value={orderSearch} onChange={e => { setOrderSearch(e.target.value); setOrderPage(1); }} style={{ ...searchStyle, width: '200px' }} />
        </div>
        <div className="sales-scroll">
          <div className="sales-inner-2" style={{ padding: '0 20px', display: 'grid', gridTemplateColumns: gridTable2 }}>
            <div style={{ ...cell2, fontFamily: "'Space Mono', monospace", fontSize: '10px', letterSpacing: '0.06em', textTransform: 'uppercase', color: '#6b655a' }}>ID</div>
            <div style={{ ...cell2, fontFamily: "'Space Mono', monospace", fontSize: '10px', letterSpacing: '0.06em', textTransform: 'uppercase', color: '#6b655a' }}>Pelanggan</div>
            <div style={{ ...cell2, fontFamily: "'Space Mono', monospace", fontSize: '10px', letterSpacing: '0.06em', textTransform: 'uppercase', color: '#6b655a' }}>Tanggal</div>
            <div style={{ ...cell2, fontFamily: "'Space Mono', monospace", fontSize: '10px', letterSpacing: '0.06em', textTransform: 'uppercase', color: '#6b655a' }}>Total</div>
            <div style={{ ...cell2, fontFamily: "'Space Mono', monospace", fontSize: '10px', letterSpacing: '0.06em', textTransform: 'uppercase', color: '#6b655a' }}>Status</div>
            <div style={{ ...cell2, fontFamily: "'Space Mono', monospace", fontSize: '10px', letterSpacing: '0.06em', textTransform: 'uppercase', color: '#6b655a', paddingRight: 0 }}>Aksi</div>

            {pagedOrders.map((o, idx) => (
              <React.Fragment key={idx}>
                <div style={{ ...cell2, fontFamily: "'Space Mono', monospace", fontSize: '12px', color: '#6b655a' }}>{o.code}</div>
                <div style={{ ...cell2, fontSize: '13px', flexDirection: 'column', alignItems: 'flex-start', gap: '2px' }}>
                  <span>{o.customer}</span>
                  <span style={{ color: '#6b655a', fontSize: '12px' }}>{Array.isArray(o.items) ? o.items.map(it => `${it.product?.name || it.product_id} ×${it.qty}`).join(', ') : o.items}</span>
                </div>
                <div style={{ ...cell2, fontFamily: "'Space Mono', monospace", fontSize: '11px', color: '#6b655a' }}>{o.date}</div>
                <div style={{ ...cell2, fontFamily: "'Space Mono', monospace", fontSize: '13px', fontWeight: 700 }}>{rp(o.total)}</div>
                <div style={{ ...cell2 }}><span style={statusStyle(o.status)}>{o.status}</span></div>
                <div style={{ ...cell2, paddingRight: 0 }}>
                  {o.status === 'Awaiting' && (
                    <button onClick={() => setConfirmModal(o)} style={{ background: '#F2C015', color: '#14110D', border: 'none', cursor: 'pointer', fontFamily: "'Space Mono', monospace", fontSize: '10px', fontWeight: 700, padding: '5px 10px', textTransform: 'uppercase' }}>
                      Konfirmasi
                    </button>
                  )}
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
        <div style={{ padding: '0 20px 16px' }}>
          <Pagination currentPage={orderPage} totalPages={orderTotalPages} onPageChange={setOrderPage} />
        </div>
      </div>
    </>
  );
}

function ConfirmPaymentModal({ order, onConfirm, onClose }) {
  const [proofFile, setProofFile] = useState(null);
  const [proofPreview, setProofPreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProofFile(file);
      setProofPreview(URL.createObjectURL(file));
    }
  };

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(20,17,13,0.62)' }} />
      <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 101, width: '440px', maxWidth: '92vw', background: '#F2EEE4', border: '2px solid #14110D', padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ fontFamily: "'Archivo'", fontWeight: 900, fontSize: '18px', textTransform: 'uppercase' }}>Konfirmasi Pembayaran</div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '24px' }}>×</button>
        </div>

        <div style={{ marginBottom: '16px', fontSize: '13px' }}>
          <div><strong>No. Pesanan:</strong> {order.code}</div>
          <div><strong>Pelanggan:</strong> {order.customer}</div>
          <div><strong>Total:</strong> {rp(order.total)}</div>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', color: '#6b655a', marginBottom: '6px', textTransform: 'uppercase' }}>Bukti Pembayaran</div>
          <input type="file" accept="image/*" onChange={handleFileChange} style={{ width: '100%', padding: '10px', border: '2px solid #14110D', background: '#fff', fontSize: '13px' }} />
          {proofPreview && (
            <img src={proofPreview} style={{ width: '100%', maxHeight: '200px', objectFit: 'contain', marginTop: '8px', border: '2px solid #14110D' }} alt="Bukti" />
          )}
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={onClose} style={{ flex: 1, background: '#fff', color: '#14110D', border: '2px solid #14110D', cursor: 'pointer', fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: '12px', padding: '12px', textTransform: 'uppercase' }}>
            Batal
          </button>
          <button onClick={() => onConfirm(order.id, proofFile)} style={{ flex: 1, background: '#14110D', color: '#F2EEE4', border: 'none', cursor: 'pointer', fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: '12px', padding: '12px', textTransform: 'uppercase' }}>
            Konfirmasi Bayar
          </button>
        </div>
      </div>
    </>
  );
}
