function ProductFinancialTable({ data }) {
  if (!data || data.rows.length === 0) return null;
  return (
    <div style={{ background: '#fff', border: '2px solid #14110D', marginTop: '32px' }}>
      <div style={{ background: '#14110D', color: '#F2EEE4', padding: '12px 16px', fontSize: '14px', fontFamily: "'Archivo'", fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.02em', textAlign: 'center' }}>
        RINCIAN PER PRODUK — PENJUALAN & KEUNTUNGAN (PO + EVENT)
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px', fontFamily: "'Archivo'", whiteSpace: 'nowrap' }}>
          <thead style={{ background: '#F2EEE4', borderBottom: '2px solid #14110D' }}>
            <tr>
              <th rowSpan="2" style={{ padding: '8px', borderRight: '2px solid #14110D', borderBottom: '2px solid #14110D', textAlign: 'left', minWidth: '180px' }}>Produk</th>
              <th colSpan="5" style={{ padding: '8px', borderRight: '2px solid #14110D', borderBottom: '1px solid #14110D', textAlign: 'center', background: '#e6ded1' }}>PO (PRE-ORDER)</th>
              <th colSpan="4" style={{ padding: '8px', borderRight: '2px solid #14110D', borderBottom: '1px solid #14110D', textAlign: 'center', background: '#e6ded1' }}>EVENT</th>
              <th colSpan="4" style={{ padding: '8px', textAlign: 'center', background: '#F2C015', borderBottom: '1px solid #14110D', color: '#14110D' }}>TOTAL (PO + EVENT)</th>
            </tr>
            <tr>
              {/* PO */}
              <th style={{ padding: '6px', borderRight: '1px solid #14110D', textAlign: 'center' }}>Terjual<br/>(pcs)</th>
              <th style={{ padding: '6px', borderRight: '1px solid #14110D', textAlign: 'right' }}>Uang Masuk (Rp)<br/>(termasuk ongkir)</th>
              <th style={{ padding: '6px', borderRight: '1px solid #14110D', textAlign: 'right' }}>Ongkir (Rp)</th>
              <th style={{ padding: '6px', borderRight: '1px solid #14110D', textAlign: 'right' }}>Keuntungan (Rp)</th>
              <th style={{ padding: '6px', borderRight: '2px solid #14110D', textAlign: 'center' }}>Margin (%)</th>
              {/* EVENT */}
              <th style={{ padding: '6px', borderRight: '1px solid #14110D', textAlign: 'center' }}>Terjual<br/>(pcs)</th>
              <th style={{ padding: '6px', borderRight: '1px solid #14110D', textAlign: 'right' }}>Penjualan (Rp)<br/>(tanpa ongkir)</th>
              <th style={{ padding: '6px', borderRight: '1px solid #14110D', textAlign: 'right' }}>Keuntungan (Rp)</th>
              <th style={{ padding: '6px', borderRight: '2px solid #14110D', textAlign: 'center' }}>Margin (%)</th>
              {/* TOTAL */}
              <th style={{ padding: '6px', borderRight: '1px solid #14110D', textAlign: 'center', background: 'rgba(242, 192, 21, 0.15)' }}>Terjual<br/>(pcs)</th>
              <th style={{ padding: '6px', borderRight: '1px solid #14110D', textAlign: 'right', background: 'rgba(242, 192, 21, 0.15)' }}>Tot. Uang Masuk<br/>(termasuk ongkir)</th>
              <th style={{ padding: '6px', borderRight: '1px solid #14110D', textAlign: 'right', background: 'rgba(242, 192, 21, 0.15)' }}>Keuntungan (Rp)</th>
              <th style={{ padding: '6px', textAlign: 'center', background: 'rgba(242, 192, 21, 0.15)' }}>Margin (%)</th>
            </tr>
          </thead>
          <tbody>
            {data.rows.map((r, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #ddd5c4' }}>
                <td style={{ padding: '8px', borderRight: '2px solid #14110D', fontWeight: 600 }}>{r.prod}</td>
                {/* PO */}
                <td style={{ padding: '8px', borderRight: '1px solid #14110D', textAlign: 'center', fontFamily: "'Space Mono', monospace" }}>{r.po.qty}</td>
                <td style={{ padding: '8px', borderRight: '1px solid #14110D', textAlign: 'right', fontFamily: "'Space Mono', monospace" }}>{rp(r.po.uangMasuk)}</td>
                <td style={{ padding: '8px', borderRight: '1px solid #14110D', textAlign: 'right', fontFamily: "'Space Mono', monospace" }}>{rp(r.po.ongkir)}</td>
                <td style={{ padding: '8px', borderRight: '1px solid #14110D', textAlign: 'right', fontFamily: "'Space Mono', monospace", color: '#047857', fontWeight: 700 }}>{rp(r.po.keuntungan)}</td>
                <td style={{ padding: '8px', borderRight: '2px solid #14110D', textAlign: 'center', fontFamily: "'Space Mono', monospace" }}>{r.po.margin.toFixed(1)}%</td>
                {/* EVENT */}
                <td style={{ padding: '8px', borderRight: '1px solid #14110D', textAlign: 'center', fontFamily: "'Space Mono', monospace" }}>{r.ev.qty}</td>
                <td style={{ padding: '8px', borderRight: '1px solid #14110D', textAlign: 'right', fontFamily: "'Space Mono', monospace" }}>{rp(r.ev.penjualan)}</td>
                <td style={{ padding: '8px', borderRight: '1px solid #14110D', textAlign: 'right', fontFamily: "'Space Mono', monospace", color: '#047857', fontWeight: 700 }}>{rp(r.ev.keuntungan)}</td>
                <td style={{ padding: '8px', borderRight: '2px solid #14110D', textAlign: 'center', fontFamily: "'Space Mono', monospace" }}>{r.ev.penjualan > 0 ? (r.ev.keuntungan/r.ev.penjualan*100).toFixed(1) : '0.0'}%</td>
                {/* TOTAL */}
                <td style={{ padding: '8px', borderRight: '1px solid #14110D', textAlign: 'center', fontFamily: "'Space Mono', monospace", fontWeight: 700, background: 'rgba(242, 192, 21, 0.1)' }}>{r.tot.qty}</td>
                <td style={{ padding: '8px', borderRight: '1px solid #14110D', textAlign: 'right', fontFamily: "'Space Mono', monospace", fontWeight: 700, background: 'rgba(242, 192, 21, 0.1)' }}>{rp(r.tot.uangMasuk)}</td>
                <td style={{ padding: '8px', borderRight: '1px solid #14110D', textAlign: 'right', fontFamily: "'Space Mono', monospace", fontWeight: 700, color: '#047857', background: 'rgba(242, 192, 21, 0.1)' }}>{rp(r.tot.keuntungan)}</td>
                <td style={{ padding: '8px', textAlign: 'center', fontFamily: "'Space Mono', monospace", fontWeight: 700, background: 'rgba(242, 192, 21, 0.1)' }}>{r.tot.margin.toFixed(1)}%</td>
              </tr>
            ))}
            <tr style={{ background: '#14110D', color: '#F2EEE4', fontWeight: 800 }}>
              <td style={{ padding: '10px 8px', borderRight: '2px solid #3d342b' }}>TOTAL</td>
              <td style={{ padding: '10px 8px', borderRight: '1px solid #3d342b', textAlign: 'center', fontFamily: "'Space Mono', monospace" }}>{data.total.po.qty}</td>
              <td style={{ padding: '10px 8px', borderRight: '1px solid #3d342b', textAlign: 'right', fontFamily: "'Space Mono', monospace" }}>{rp(data.total.po.uangMasuk)}</td>
              <td style={{ padding: '10px 8px', borderRight: '1px solid #3d342b', textAlign: 'right', fontFamily: "'Space Mono', monospace" }}>{rp(data.total.po.ongkir)}</td>
              <td style={{ padding: '10px 8px', borderRight: '1px solid #3d342b', textAlign: 'right', fontFamily: "'Space Mono', monospace", color: '#34d399' }}>{rp(data.total.po.keuntungan)}</td>
              <td style={{ padding: '10px 8px', borderRight: '2px solid #3d342b', textAlign: 'center', fontFamily: "'Space Mono', monospace" }}>{data.total.po.margin.toFixed(1)}%</td>
              
              <td style={{ padding: '10px 8px', borderRight: '1px solid #3d342b', textAlign: 'center', fontFamily: "'Space Mono', monospace" }}>{data.total.ev.qty}</td>
              <td style={{ padding: '10px 8px', borderRight: '1px solid #3d342b', textAlign: 'right', fontFamily: "'Space Mono', monospace" }}>{rp(data.total.ev.penjualan)}</td>
              <td style={{ padding: '10px 8px', borderRight: '1px solid #3d342b', textAlign: 'right', fontFamily: "'Space Mono', monospace", color: '#34d399' }}>{rp(data.total.ev.keuntungan)}</td>
              <td style={{ padding: '10px 8px', borderRight: '2px solid #3d342b', textAlign: 'center', fontFamily: "'Space Mono', monospace" }}>{data.total.ev.penjualan > 0 ? (data.total.ev.keuntungan/data.total.ev.penjualan*100).toFixed(1) : '0.0'}%</td>
              
              <td style={{ padding: '10px 8px', borderRight: '1px solid #3d342b', textAlign: 'center', fontFamily: "'Space Mono', monospace", color: '#F2C015' }}>{data.total.tot.qty}</td>
              <td style={{ padding: '10px 8px', borderRight: '1px solid #3d342b', textAlign: 'right', fontFamily: "'Space Mono', monospace", color: '#F2C015' }}>{rp(data.total.tot.uangMasuk)}</td>
              <td style={{ padding: '10px 8px', borderRight: '1px solid #3d342b', textAlign: 'right', fontFamily: "'Space Mono', monospace", color: '#34d399' }}>{rp(data.total.tot.keuntungan)}</td>
              <td style={{ padding: '10px 8px', textAlign: 'center', fontFamily: "'Space Mono', monospace", color: '#F2C015' }}>{data.total.tot.margin.toFixed(1)}%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
