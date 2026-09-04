const fs = require("fs");
let code = fs.readFileSync("fe/src/components/admin/Dashboard.jsx", "utf8");

const startIdx = code.indexOf("  const getBreakdowns = () => {");
const endIdx = code.indexOf("  const po = calcAgg(true);");

const newGetBreakdowns = `  const getBreakdowns = () => {
    const aggs = { pengiriman: {}, pembayaran: {}, statusBayar: {}, statusKirim: {} };
    const pSizeAgg = {};
    const pFin = {};
    const sizeSetCols = new Set();
    const initBucket = () => ({ qty: 0, penjualan: 0, hpp: 0 });
    const initFin = () => ({ po: { qty: 0, penjualan: 0, ongkir: 0, hpp: 0 }, ev: { qty: 0, penjualan: 0, hpp: 0 } });

    filteredOrders.forEach(ord => {
      if (ord.status === 'Cancelled') return;
      
      const bPengiriman = ord.shipping_cost > 0 ? (ord.shipping_service ? \`Ekspedisi - \${ord.shipping_service}\` : 'Ekspedisi (Lainnya)') : 'Gratis/Ambil Sendiri';
      const bPembayaran = payMethodLabel(ord.payment_method);
      const bStatusBayar = ['Paid', 'Producing', 'Shipped'].includes(ord.status) ? 'Lunas' : (ord.status === 'Cancelled' ? 'Cancel' : 'Belum Bayar');
      const bStatusKirim = ord.status === 'Shipped' ? 'Sudah Dikirim' : 'Belum Dikirim';

      if (f.pengiriman.length > 0) {
        const p = ord.shipping_cost > 0 ? (ord.shipping_service || 'Berbayar (Tanpa Keterangan)') : 'Gratis/Ambil Sendiri';
        if (!f.pengiriman.includes(p)) return;
      }

      let matchedItems = [];
      let ordMatchedItems = 0;
      let ordHpp = 0;
      let ordBarangRevenue = 0;

      (ord.items || []).forEach(it => {
        const sku = it.product?.product_parent?.sku || (it.product?.code || '').split('-')[0];
        if (f.sku.length > 0 && !f.sku.includes(sku)) return;
        if (f.product.length > 0 && !f.product.includes(it.product?.name)) return;
        if (f.ukuran.length > 0 && !f.ukuran.includes(it.size)) return;
        if (f.paketUkuran.length > 0 && !f.paketUkuran.includes(getPaketForSize(it.size))) return;
        
        const prod = it.product || {};
        const overXxl = ['XXL', '3XL', '4XL', '5XL'].includes(it.size);
        let hpp = overXxl ? (prod.hpp_more_xxl_unit || prod.hpp_less_xxl_unit || 0) : (prod.hpp_less_xxl_unit || 0);
        if (!hpp && prod.costs) hpp = (prod.costs.production || 0) + (prod.costs.kemasan || 0) + (prod.costs.stiker || 0);
        
        ordMatchedItems += it.qty;
        ordBarangRevenue += (it.price * it.qty);
        ordHpp += (hpp * it.qty);
        
        matchedItems.push({ ...it, computedHpp: hpp });
      });

      if (ordMatchedItems > 0) {
        // Breakdowns aggregation
        if (!aggs.pengiriman[bPengiriman]) aggs.pengiriman[bPengiriman] = initBucket();
        aggs.pengiriman[bPengiriman].qty += ordMatchedItems;
        aggs.pengiriman[bPengiriman].penjualan += ordBarangRevenue;
        aggs.pengiriman[bPengiriman].hpp += ordHpp;

        if (!aggs.pembayaran[bPembayaran]) aggs.pembayaran[bPembayaran] = initBucket();
        aggs.pembayaran[bPembayaran].qty += ordMatchedItems;
        aggs.pembayaran[bPembayaran].penjualan += ordBarangRevenue;
        aggs.pembayaran[bPembayaran].hpp += ordHpp;

        if (!aggs.statusBayar[bStatusBayar]) aggs.statusBayar[bStatusBayar] = initBucket();
        aggs.statusBayar[bStatusBayar].qty += ordMatchedItems;
        aggs.statusBayar[bStatusBayar].penjualan += ordBarangRevenue;
        aggs.statusBayar[bStatusBayar].hpp += ordHpp;

        if (!aggs.statusKirim[bStatusKirim]) aggs.statusKirim[bStatusKirim] = initBucket();
        aggs.statusKirim[bStatusKirim].qty += ordMatchedItems;
        aggs.statusKirim[bStatusKirim].penjualan += ordBarangRevenue;
        aggs.statusKirim[bStatusKirim].hpp += ordHpp;

        // Financial & Size aggregation
        const isPo = ord.type === 'preorder';
        const totalOngkir = ord.shipping_cost || 0;

        matchedItems.forEach(it => {
          const prodName = it.product?.name || 'Unknown Product';
          
          // Size
          let sizeName = it.size || 'Lainnya';
          if (sizeName === 'One Size') sizeName = 'Satuan';
          if (!pSizeAgg[prodName]) pSizeAgg[prodName] = { total: 0 };
          if (!pSizeAgg[prodName][sizeName]) pSizeAgg[prodName][sizeName] = 0;
          pSizeAgg[prodName][sizeName] += it.qty;
          pSizeAgg[prodName].total += it.qty;
          sizeSetCols.add(sizeName);

          // Financial
          if (!pFin[prodName]) pFin[prodName] = initFin();
          const bucket = isPo ? pFin[prodName].po : pFin[prodName].ev;
          const itemRevenue = it.price * it.qty;
          const apportionedOngkir = (it.qty / ordMatchedItems) * totalOngkir;
          const itemHpp = it.computedHpp * it.qty;

          bucket.qty += it.qty;
          bucket.penjualan += itemRevenue;
          bucket.hpp += itemHpp;
          if (isPo) bucket.ongkir += apportionedOngkir;
        });
      }
    });

    const formatBucket = (obj) => {
      const rows = Object.entries(obj).map(([key, val]) => ({
        label: key, qty: val.qty, penjualan: val.penjualan, untung: val.penjualan - val.hpp
      })).sort((a, b) => b.qty - a.qty);
      const total = rows.reduce((acc, r) => {
        acc.qty += r.qty; acc.penjualan += r.penjualan; acc.untung += r.untung; return acc;
      }, { qty: 0, penjualan: 0, untung: 0 });
      return { rows, total };
    };

    const sizeOrder = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL', '5XL', '6XL', '7XL', '8XL', 'Satuan', 'Lainnya'];
    const sortedSizes = [...sizeSetCols].sort((a, b) => {
      let ia = sizeOrder.indexOf(a);
      let ib = sizeOrder.indexOf(b);
      if (ia === -1) ia = 999;
      if (ib === -1) ib = 999;
      if (ia === ib) return a.localeCompare(b);
      return ia - ib;
    });

    const sizeRows = Object.entries(pSizeAgg).map(([prod, sizes]) => ({
      prod, ...sizes
    })).sort((a,b) => a.prod.localeCompare(b.prod));

    const sizeTotals = { total: 0 };
    sortedSizes.forEach(s => sizeTotals[s] = 0);
    sizeRows.forEach(row => {
      sortedSizes.forEach(s => {
        if (row[s]) sizeTotals[s] += row[s];
      });
      sizeTotals.total += row.total;
    });

    const finRows = Object.entries(pFin).map(([prod, data]) => {
      const poKeuntungan = data.po.penjualan - data.po.hpp;
      const poUangMasuk = data.po.penjualan + data.po.ongkir;
      const poMargin = data.po.penjualan > 0 ? (poKeuntungan / data.po.penjualan) * 100 : 0;

      const evKeuntungan = data.ev.penjualan - data.ev.hpp;
      const evUangMasuk = data.ev.penjualan; 

      const totalQty = data.po.qty + data.ev.qty;
      const totalUangMasuk = poUangMasuk + evUangMasuk;
      const totalKeuntungan = poKeuntungan + evKeuntungan;
      const totalPenjualan = data.po.penjualan + data.ev.penjualan;
      const totalMargin = totalPenjualan > 0 ? (totalKeuntungan / totalPenjualan) * 100 : 0;

      return {
        prod,
        po: { qty: data.po.qty, uangMasuk: poUangMasuk, ongkir: data.po.ongkir, hpp: data.po.hpp, keuntungan: poKeuntungan, margin: poMargin },
        ev: { qty: data.ev.qty, penjualan: data.ev.penjualan, hpp: data.ev.hpp, keuntungan: evKeuntungan },
        tot: { qty: totalQty, uangMasuk: totalUangMasuk, keuntungan: totalKeuntungan, margin: totalMargin }
      };
    }).sort((a,b) => a.prod.localeCompare(b.prod));

    const finTot = {
      po: { qty: 0, uangMasuk: 0, ongkir: 0, hpp: 0, keuntungan: 0 },
      ev: { qty: 0, penjualan: 0, hpp: 0, keuntungan: 0 },
      tot: { qty: 0, uangMasuk: 0, keuntungan: 0 }
    };
    
    let sumPoPenjualan = 0;
    let sumTotPenjualan = 0;

    finRows.forEach(r => {
      finTot.po.qty += r.po.qty; finTot.po.uangMasuk += r.po.uangMasuk; finTot.po.ongkir += r.po.ongkir; finTot.po.hpp += r.po.hpp; finTot.po.keuntungan += r.po.keuntungan;
      sumPoPenjualan += (r.po.uangMasuk - r.po.ongkir);

      finTot.ev.qty += r.ev.qty; finTot.ev.penjualan += r.ev.penjualan; finTot.ev.hpp += r.ev.hpp; finTot.ev.keuntungan += r.ev.keuntungan;
      
      finTot.tot.qty += r.tot.qty; finTot.tot.uangMasuk += r.tot.uangMasuk; finTot.tot.keuntungan += r.tot.keuntungan;
      sumTotPenjualan += (r.tot.uangMasuk - r.po.ongkir);
    });

    finTot.po.margin = sumPoPenjualan > 0 ? (finTot.po.keuntungan / sumPoPenjualan) * 100 : 0;
    finTot.tot.margin = sumTotPenjualan > 0 ? (finTot.tot.keuntungan / sumTotPenjualan) * 100 : 0;

    return {
      pengiriman: formatBucket(aggs.pengiriman),
      pembayaran: formatBucket(aggs.pembayaran),
      statusBayar: formatBucket(aggs.statusBayar),
      statusKirim: formatBucket(aggs.statusKirim),
      productSizes: { sizes: sortedSizes, rows: sizeRows, total: sizeTotals },
      productFinancials: { rows: finRows, total: finTot }
    };
  };
`;

code = code.substring(0, startIdx) + newGetBreakdowns + code.substring(endIdx);
fs.writeFileSync("fe/src/components/admin/Dashboard.jsx", code, "utf8");
