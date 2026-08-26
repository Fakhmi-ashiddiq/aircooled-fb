import React, { useState, useEffect } from 'react';
import { useStore } from '../../store';
import { rp } from '../../utils/helpers';
import OrderService from '../../services/OrderService';

export default function MyOrders() {
  const { state, go } = useStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = state.user;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const allOrders = await OrderService.getAll();
        const userOrders = user
          ? allOrders.filter(o => o.user_id === user.id || o.email === user.email)
          : [];
        setOrders(userOrders.sort((a, b) => (b.id || 0) - (a.id || 0)));
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    };
    fetchOrders();
  }, [user]);

  const statusColors = {
    'Awaiting': { bg: '#FEF3C7', text: '#92400E', label: 'Menunggu Pembayaran' },
    'Paid': { bg: '#D1FAE5', text: '#065F46', label: 'Sudah Dibayar' },
    'Producing': { bg: '#DBEAFE', text: '#1E40AF', label: 'Diproduksi' },
    'Shipping': { bg: '#E0E7FF', text: '#3730A3', label: 'Dikirim' },
    'Shipped': { bg: '#D1FAE5', text: '#065F46', label: 'Terkirim' },
    'Done': { bg: '#D1FAE5', text: '#065F46', label: 'Selesai' },
    'Batal': { bg: '#FEE2E2', text: '#991B1B', label: 'Dibatalkan' },
  };

  return (
    <main style={{ padding: '48px', maxWidth: '700px', margin: '0 auto' }}>
      <button onClick={() => go('home')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Space Mono', monospace", fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#6b655a', marginBottom: '24px' }}>
        ← Kembali ke Beranda
      </button>

      <h1 style={{ fontFamily: "'Archivo'", fontWeight: 900, fontSize: '28px', margin: '0 0 24px', textTransform: 'uppercase' }}>Pesanan Saya</h1>

      {loading ? (
        <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '14px', color: '#6b655a', textAlign: 'center', padding: '40px' }}>Memuat data...</p>
      ) : orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', border: '2px solid #14110D', background: '#fff' }}>
          <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '14px', color: '#6b655a', marginBottom: '20px' }}>Belum ada pesanan.</p>
          <button onClick={() => go('shop')} style={{ background: '#14110D', color: '#F2EEE4', border: 'none', cursor: 'pointer', fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: '12px', letterSpacing: '0.06em', textTransform: 'uppercase', padding: '12px 24px' }}>
            Mulai Belanja
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {orders.map(order => {
            const st = statusColors[order.status] || { bg: '#F3F4F6', text: '#374151', label: order.status };
            return (
              <div key={order.id} onClick={() => go('invoice/' + order.code)} style={{ border: '2px solid #14110D', background: '#fff', padding: '16px 20px', cursor: 'pointer' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div>
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '13px', fontWeight: 700 }}>{order.code}</span>
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', color: '#6b655a', marginLeft: '10px' }}>{order.date}</span>
                  </div>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', fontWeight: 700, padding: '3px 8px', textTransform: 'uppercase', background: st.bg, color: st.text }}>
                    {st.label}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', color: '#3d382f' }}>{order.type === 'preorder' ? 'Pre-Order' : 'Ready Stock'}</span>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '14px', fontWeight: 700 }}>{rp(order.total || 0)}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
