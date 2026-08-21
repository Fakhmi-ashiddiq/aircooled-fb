import React, { useState, useEffect } from 'react';
import { useStore } from '../../store';
import { rp } from '../../utils/helpers';
import OrderService from '../../services/OrderService';

export default function InvoiceTrack() {
  const { state, data, go } = useStore();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const orderCode = state.route.replace('invoice/', '');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const orders = await OrderService.getAll();
        const found = orders.find(o => o.code === orderCode);
        if (found) {
          setOrder(found);
        } else {
          setError('Pesanan tidak ditemukan');
        }
      } catch (e) {
        setError('Gagal memuat data pesanan');
      }
      setLoading(false);
    };
    fetchOrder();
  }, [orderCode]);

  if (loading) {
    return (
      <main style={{ padding: '48px', textAlign: 'center' }}>
        <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '14px', color: '#6b655a' }}>Memuat data pesanan...</p>
      </main>
    );
  }

  if (error || !order) {
    return (
      <main style={{ padding: '48px', textAlign: 'center' }}>
        <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '14px', color: '#dc2626' }}>{error || 'Pesanan tidak ditemukan'}</p>
        <button onClick={() => go('home')} style={{ marginTop: '16px', background: '#14110D', color: '#F2EEE4', border: 'none', cursor: 'pointer', fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: '12px', padding: '12px 24px', textTransform: 'uppercase' }}>
          Kembali ke Beranda
        </button>
      </main>
    );
  }

  const statusColors = {
    'Awaiting': { bg: '#FEF3C7', text: '#92400E', label: 'Menunggu Pembayaran' },
    'Paid': { bg: '#D1FAE5', text: '#065F46', label: 'Sudah Dibayar' },
    'Producing': { bg: '#DBEAFE', text: '#1E40AF', label: 'Sedang Diproduksi' },
    'Shipping': { bg: '#E0E7FF', text: '#3730A3', label: 'Dalam Pengiriman' },
    'Shipped': { bg: '#D1FAE5', text: '#065F46', label: 'Terkirim' },
    'Done': { bg: '#D1FAE5', text: '#065F46', label: 'Selesai' },
    'Batal': { bg: '#FEE2E2', text: '#991B1B', label: 'Dibatalkan' },
  };

  const status = statusColors[order.status] || { bg: '#F3F4F6', text: '#374151', label: order.status };

  const items = order.items || order.order_items || [];

  return (
    <main style={{ padding: '48px', maxWidth: '700px', margin: '0 auto' }}>
      <button onClick={() => go('home')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Space Mono', monospace", fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#6b655a', marginBottom: '24px' }}>
        ← Kembali ke Beranda
      </button>

      <div style={{ border: '2px solid #14110D', background: '#fff', padding: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 style={{ fontFamily: "'Archivo'", fontWeight: 900, fontSize: '28px', margin: 0, textTransform: 'uppercase' }}>Invoice</h1>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '13px', color: '#6b655a', marginTop: '4px' }}>No. {order.code}</div>
          </div>
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', fontWeight: 700, padding: '6px 12px', borderRadius: '4px', textTransform: 'uppercase', background: status.bg, color: status.text }}>
            {status.label}
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px', paddingBottom: '20px', borderBottom: '1px solid #ddd5c4' }}>
          <div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', color: '#6b655a', textTransform: 'uppercase', marginBottom: '4px' }}>Pelanggan</div>
            <div style={{ fontFamily: "'Archivo'", fontWeight: 700, fontSize: '15px' }}>{order.customer}</div>
          </div>
          <div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', color: '#6b655a', textTransform: 'uppercase', marginBottom: '4px' }}>Tanggal</div>
            <div style={{ fontFamily: "'Archivo'", fontWeight: 700, fontSize: '15px' }}>{order.date}</div>
          </div>
          {order.email && (
            <div>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', color: '#6b655a', textTransform: 'uppercase', marginBottom: '4px' }}>Email</div>
              <div style={{ fontSize: '14px' }}>{order.email}</div>
            </div>
          )}
          {order.phone && (
            <div>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', color: '#6b655a', textTransform: 'uppercase', marginBottom: '4px' }}>Telepon</div>
              <div style={{ fontSize: '14px' }}>{order.phone}</div>
            </div>
          )}
        </div>

        <div style={{ marginBottom: '24px' }}>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', color: '#6b655a', textTransform: 'uppercase', marginBottom: '10px' }}>Item Pesanan</div>
          {items.map((item, idx) => (
            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #ddd5c4', fontSize: '14px' }}>
              <div>
                <span style={{ fontWeight: 600 }}>{item.product?.name || 'Produk'}</span>
                {item.size && <span style={{ color: '#6b655a', marginLeft: '6px' }}>({item.size})</span>}
                {item.color && <span style={{ color: '#6b655a', marginLeft: '6px' }}>{item.color}</span>}
                <span style={{ color: '#6b655a', marginLeft: '6px' }}>× {item.qty}</span>
              </div>
              <span style={{ fontFamily: "'Space Mono', monospace", fontWeight: 700 }}>{rp((item.price || 0) * (item.qty || 1))}</span>
            </div>
          ))}
        </div>

        <div style={{ borderTop: '2px solid #14110D', paddingTop: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', padding: '4px 0' }}>
            <span style={{ color: '#6b655a' }}>Subtotal</span>
            <span style={{ fontFamily: "'Space Mono', monospace" }}>{rp((order.total || 0) - (order.shipping_cost || 0))}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', padding: '4px 0' }}>
            <span style={{ color: '#6b655a' }}>Ongkir</span>
            <span style={{ fontFamily: "'Space Mono', monospace" }}>{rp(order.shipping_cost || 0)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "'Archivo'", fontWeight: 800, fontSize: '18px', padding: '12px 0 0', marginTop: '8px', borderTop: '2px solid #14110D' }}>
            <span>TOTAL</span>
            <span style={{ fontFamily: "'Space Mono', monospace" }}>{rp(order.total || 0)}</span>
          </div>
        </div>

        {order.status === 'Awaiting' && (
          <div style={{ marginTop: '24px', padding: '16px', background: '#FEF3C7', border: '1px solid #F59E0B', borderRadius: '4px', fontSize: '13px', color: '#92400E' }}>
            <strong>Menunggu Pembayaran</strong><br />
            Silakan lakukan pembayaran sesuai metode yang dipilih. Pembayaran akan dikonfirmasi otomatis.
          </div>
        )}
      </div>
    </main>
  );
}
