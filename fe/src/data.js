export const getInitialData = () => {
  const P = [
    { id:'classic-tee', name:'Syndicate Classic Tee', cat:'Kaos', type:'ready', price:185000, compareAt:225000, garment:'#D9CBB0', print:'logo', sizes:['S','M','L','XL','XXL'], stock:48, sold:126, costs:{production:62000, kemasan:16000, stiker:11000}, desc:'Kaos cotton combed 24s dengan sablon plastisol logo Aircooled Syndicate. Potongan reguler unisex. Heritage staple yang dipakai sehari-hari.' },
    { id:'boxer-tee', name:'Boxer Engine Tee', cat:'Kaos', type:'ready', price:195000, garment:'#26231F', print:'text', sizes:['S','M','L','XL','XXL'], stock:31, sold:88, costs:{production:64000, kemasan:16000, stiker:11000}, desc:'Kaos hitam dengan grafis flat-four boxer engine di punggung. Cotton combed 24s, sablon discharge halus.' },
    { id:'flatsix-cap', name:'Flat-Six Cap', cat:'Topi', type:'ready', price:165000, garment:'#1d1a16', print:'text', sizes:['One Size'], stock:54, sold:72, costs:{production:58000, kemasan:14000, stiker:9000}, desc:'Topi 6-panel unstructured, bordir logo di depan, strap kuningan adjustable. Warna hitam pekat.' },
    { id:'pit-tote', name:'Pit Crew Tote', cat:'Goodie Bag', type:'ready', price:120000, compareAt:150000, garment:'#E4DCC8', print:'logo', sizes:['One Size'], stock:67, sold:54, costs:{production:38000, kemasan:13000, stiker:8000}, desc:'Tote bag kanvas 12oz natural, sablon logo besar. Muat majalah, helm cap, dan belanjaan part.' },
    { id:'heritage-hoodie', name:'Heritage Hoodie', cat:'Hoodie', type:'ready', price:385000, garment:'#B8B5AE', print:'logo', sizes:['S','M','L','XL','XXL'], stock:22, sold:41, costs:{production:168000, kemasan:24000, stiker:16000}, desc:'Hoodie fleece 320gsm heather grey, kantong kangguru, drawstring kuning. Hangat untuk morning run.' },
    { id:'sticker-vol1', name:'Sticker Pack Vol.1', cat:'Stiker', type:'ready', price:55000, compareAt:75000, garment:'#EFEBE2', print:'logo', sizes:['One Size'], stock:140, sold:210, costs:{production:14000, kemasan:8000, stiker:5000}, desc:'Set 8 stiker die-cut vinyl tahan air & UV. Tempel di toolbox, laptop, atau bumper.' },
    { id:'lemans-tee', name:"Le Mans '70 Teek", cat:'Kaos', type:'preorder', price:220000, garment:'#EFEBE2', print:'logo', sizes:['S','M','L','XL','XXL'], costs:{production:68000, kemasan:17000, stiker:13000}, preorder:{ sessionName:'DROP 03', opens:'1 Jun', closes:'30 Jun', target:50, committed:34, eta:'25 Jul', status:'open', price:220000, compareAt:0, sizes:['S','M','L','XL','XXL'], colors:[{name:'Off-White',hex:'#EFEBE2'},{name:'Sand',hex:'#D9CBB0'}], costs:{production:68000, kemasan:17000, stiker:13000}, split:{base:'harga', mediaPct:30, mediaRole:'ro1', desainPct:30, desainRole:'ro1', prodPct:25, prodRole:'ro2', storePct:15}, buyers:[{name:'Galih Pratomo', items:[{size:'L',color:'Off-White',qty:1}], pay:'Lunas', ship:'Belum Terkirim', payAmount:245000, payMethod:'Transfer BCA', payDate:'12 Jun 2026'},{name:'Intan Permata', items:[{size:'M',color:'Sand',qty:1},{size:'L',color:'Off-White',qty:1}], pay:'Belum Lunas', ship:'Belum Terkirim'},{name:'Bagas Saputra', items:[{size:'XL',color:'Off-White',qty:1}], pay:'Lunas', ship:'Belum Terkirim', payAmount:245000, payMethod:'QRIS', payDate:'13 Jun 2026'},{name:'Maya Lestari', items:[{size:'S',color:'Sand',qty:2}], pay:'Belum Lunas', ship:'Belum Terkirim'},{name:'Rizky Ananda', items:[{size:'L',color:'Off-White',qty:1}], pay:'Belum Lunas', ship:'Belum Terkirim'},{name:'Dewi Anggraini', items:[{size:'M',color:'Off-White',qty:1}], pay:'Lunas', ship:'Belum Terkirim', payAmount:245000, payMethod:'GoPay', payDate:'15 Jun 2026'}] }, sessionHistory:[{ sessionName:'DROP 01', opens:'5 Jan', closes:'31 Jan', target:40, committed:46, eta:'25 Feb', status:'closed', price:195000, compareAt:0, sizes:['S','M','L','XL'], colors:[{name:'Off-White',hex:'#EFEBE2'}], costs:{production:64000, kemasan:16000, stiker:11000}, split:{base:'gross', mediaPct:30, mediaRole:'ro1', desainPct:30, desainRole:'ro1', prodPct:25, prodRole:'ro2', storePct:15}, buyers:[{name:'Bayu Pratama', size:'L', color:'Off-White', qty:2, pay:'Lunas', ship:'Terkirim'},{name:'Rangga Wijaya', size:'M', color:'Off-White', qty:1, pay:'Lunas', ship:'Terkirim'},{name:'Sari Indah', size:'XL', color:'Off-White', qty:1, pay:'Lunas', ship:'Terkirim'},{name:'Dimas Aditya', size:'L', color:'Off-White', qty:1, pay:'Lunas', ship:'Proses'},{name:'Putri Maharani', size:'S', color:'Off-White', qty:1, pay:'Lunas', ship:'Terkirim'},{name:'Wisnu Gunawan', size:'M', color:'Off-White', qty:2, pay:'Lunas', ship:'Terkirim'},{name:'Andre Kurnia', size:'XL', color:'Off-White', qty:1, pay:'Lunas', ship:'Terkirim'},{name:'Fajar Nugraha', size:'L', color:'Off-White', qty:1, pay:'Lunas', ship:'Proses'}] }], desc:'Edisi terbatas memperingati Le Mans 1970. Sablon 3 warna premium di cotton combed 20s. Hanya diproduksi sesuai jumlah pemesan.' },
    { id:'club-jacket', name:'Air-Cooled Club Jacket', cat:'Jacket', type:'preorder', price:650000, garment:'#1a1f2b', print:'text', sizes:['M','L','XL','XXL'], costs:{production:340000, kemasan:30000, stiker:24000}, preorder:{ sessionName:'DROP 03', opens:'1 Jun', closes:'30 Jun', target:30, committed:12, eta:'10 Agu', status:'open', price:650000, compareAt:0, sizes:['M','L','XL','XXL'], colors:[{name:'Navy',hex:'#1a1f2b'},{name:'Black',hex:'#14110D'}], costs:{production:340000, kemasan:30000, stiker:24000}, split:{base:'gross', mediaPct:30, mediaRole:'ro1', desainPct:30, desainRole:'ro1', prodPct:25, prodRole:'ro2', storePct:15}, buyers:[{name:'Surya Mahendra', items:[{size:'L',color:'Navy',qty:1}], pay:'Lunas', ship:'Belum Terkirim', payAmount:680000, payMethod:'Transfer BCA', payDate:'11 Jun 2026'},{name:'Anton Wijaya', items:[{size:'XL',color:'Black',qty:1}], pay:'Belum Lunas', ship:'Belum Terkirim'},{name:'Yusuf Hakim', items:[{size:'M',color:'Navy',qty:1}], pay:'Belum Lunas', ship:'Belum Terkirim'}] }, sessionHistory:[], desc:'Coach jacket navy dengan bordir punggung penuh dan patch lengan. Bahan taslan anti air, lining flanel.' },
    { id:'rally-goodie', name:'Vintage Rally Goodie Set', cat:'Goodie Bag', type:'preorder', price:275000, garment:'#CDB892', print:'logo', sizes:['One Size'], costs:{production:96000, kemasan:20000, stiker:14000}, preorder:{ sessionName:'DROP 02', opens:'1 Mei', closes:'20 Mei', target:40, committed:40, eta:'15 Jun', status:'production', price:275000, compareAt:300000, sizes:['One Size'], colors:[{name:'Kraft',hex:'#CDB892'}], costs:{production:96000, kemasan:20000, stiker:14000}, split:{base:'gross', mediaPct:30, mediaRole:'ro1', desainPct:30, desainRole:'ro1', prodPct:25, prodRole:'ro2', storePct:15}, buyers:[{name:'Prabowo Adi', items:[{size:'One Size',color:'Kraft',qty:1}], pay:'Lunas', ship:'Belum Terkirim', payAmount:300000, payMethod:'Transfer BCA', payDate:'5 Mei 2026'},{name:'Sinta Dewanti', items:[{size:'One Size',color:'Kraft',qty:2}], pay:'Lunas', ship:'Belum Terkirim', payAmount:575000, payMethod:'QRIS', payDate:'6 Mei 2026'},{name:'Oka Pranata', items:[{size:'One Size',color:'Kraft',qty:1}], pay:'Batal', ship:'Belum Terkirim'},{name:'Lia Kusuma', items:[{size:'One Size',color:'Kraft',qty:1}], pay:'Lunas', ship:'Belum Terkirim', payAmount:300000, payMethod:'GoPay', payDate:'7 Mei 2026'}] }, sessionHistory:[{ sessionName:'DROP 01', opens:'10 Feb', closes:'28 Feb', target:30, committed:38, eta:'25 Mar', status:'closed', price:250000, compareAt:0, sizes:['One Size'], colors:[{name:'Kraft',hex:'#CDB892'}], costs:{production:92000, kemasan:19000, stiker:12000}, split:{base:'gross', mediaPct:30, mediaRole:'ro1', desainPct:30, desainRole:'ro1', prodPct:25, prodRole:'ro2', storePct:15}, buyers:[{name:'Hendra Saputra', size:'One Size', color:'Kraft', qty:1, pay:'Lunas', ship:'Terkirim'},{name:'Nadia Rahman', size:'One Size', color:'Kraft', qty:2, pay:'Lunas', ship:'Terkirim'},{name:'Yoga Pratama', size:'One Size', color:'Kraft', qty:1, pay:'Lunas', ship:'Proses'},{name:'Kirana Dewi', size:'One Size', color:'Kraft', qty:1, pay:'Lunas', ship:'Terkirim'},{name:'Reza Maulana', size:'One Size', color:'Kraft', qty:3, pay:'Lunas', ship:'Terkirim'},{name:'Lestari W.', size:'One Size', color:'Kraft', qty:1, pay:'Lunas', ship:'Terkirim'}] }], desc:'Bundle berisi tote, enamel pin set, patch, dan majalah edisi cetak terbatas. Dikemas dalam box kraft.' }
  ];

  const COLORS = {
    'classic-tee':[['Sand','#D9CBB0'],['Charcoal','#26231F'],['Off-White','#EFEBE2']],
    'boxer-tee':[['Charcoal','#26231F'],['Sand','#D9CBB0']],
    'flatsix-cap':[['Black','#1d1a16'],['Khaki','#B7A98A']],
    'pit-tote':[['Natural','#E4DCC8']],
    'heritage-hoodie':[['Heather Grey','#B8B5AE'],['Charcoal','#26231F']],
    'sticker-vol1':[['Mix','#EFEBE2']],
    'lemans-tee':[['Off-White','#EFEBE2'],['Sand','#D9CBB0']],
    'club-jacket':[['Navy','#1a1f2b'],['Black','#14110D']],
    'rally-goodie':[['Kraft','#CDB892']]
  };

  P.forEach(p=>{ 
    p.colors = (COLORS[p.id]||[['Default',p.garment]]).map(([name,hex])=>({name,hex})); 
    p.gallery = ['Depan','Belakang','Detail','Dipakai']; 
  });

  const _prodDates=['12 Jan 2026','24 Feb 2026','18 Apr 2026'];
  P.forEach((p,idx)=>{
    if(p.type==='ready' && !p.productionSessions){
      const produced=(p.stock||0)+(p.sold||0);
      if(produced>=120){
        const b1=Math.round(produced*0.55), b2=produced-b1;
        const sold1=Math.min(p.sold||0,b1), sold2=(p.sold||0)-sold1;
        p.productionSessions=[
          {name:'PRODUKSI 02', date:_prodDates[(idx+1)%3], qty:b2, sold:sold2, status:'active', price:p.price, compareAt:p.compareAt||0, sizes:[...p.sizes], costs:{...p.costs}},
          {name:'PRODUKSI 01', date:_prodDates[idx%3], qty:b1, sold:sold1, status:'done', price:p.price, compareAt:p.compareAt||0, sizes:[...p.sizes], costs:{...p.costs}}
        ];
      } else {
        p.productionSessions=[{name:'PRODUKSI 01', date:_prodDates[idx%3], qty:produced, sold:p.sold||0, status:'active', price:p.price, compareAt:p.compareAt||0, sizes:[...p.sizes], costs:{...p.costs}}];
      }
    }
  });

  const _views={'classic-tee':2140,'boxer-tee':1320,'flatsix-cap':980,'pit-tote':760,'heritage-hoodie':1510,'sticker-vol1':2980,'lemans-tee':1870,'club-jacket':640,'rally-goodie':1120};
  P.forEach((p,i)=>{ 
    p.views = p.views != null ? p.views : (_views[p.id] || (500+i*40)); 
    p._seq = p._seq != null ? p._seq : i; 
  });

  const categories = ['Kaos','Topi','Goodie Bag','Hoodie','Jacket','Stiker','Print'];
  
  const sizeSets = [
    { id:'reg', name:'Regular', active:true, sizes:['S','M','L','XL','XXL'], guideImg:null },
    { id:'over', name:'Oversized', active:true, sizes:['M','L','XL','XXL'], guideImg:null },
    { id:'one', name:'One Size', active:true, sizes:['One Size'], guideImg:null }
  ];

  const colorOptions = [
    {id:'co1',name:'Off-White',hex:'#EFEBE2',active:true},
    {id:'co2',name:'Sand',hex:'#D9CBB0',active:true},
    {id:'co3',name:'Charcoal',hex:'#26231F',active:true},
    {id:'co4',name:'Black',hex:'#14110D',active:true},
    {id:'co5',name:'Navy',hex:'#1a1f2b',active:true},
    {id:'co6',name:'Kraft',hex:'#CDB892',active:true},
    {id:'co7',name:'Heather Grey',hex:'#B8B5AE',active:true},
    {id:'co8',name:'Khaki',hex:'#B7A98A',active:false}
  ];

  const owners = [
    {id:'ro1', name:'Aircooled Syndicate', pic:'Atot'},
    {id:'ro2', name:'RDPL', pic:'Dzikri'}
  ];

  const orders = [
    { id:'ASC-1051', customer:'Bayu Pratama', items:'Classic Tee ×2, Sticker Pack', total:425000, date:'18 Jun', type:'ready', status:'Paid' },
    { id:'ASC-1050', customer:'Rangga W.', items:"Le Mans '70 Tee ×1", total:220000, date:'17 Jun', type:'preorder', status:'Awaiting' },
    { id:'ASC-1049', customer:'Sari Indah', items:'Heritage Hoodie ×1', total:385000, date:'17 Jun', type:'ready', status:'Packing' },
    { id:'ASC-1048', customer:'Dimas A.', items:'Club Jacket ×1', total:650000, date:'16 Jun', type:'preorder', status:'Awaiting' },
    { id:'ASC-1047', customer:'Putri M.', items:'Flat-Six Cap ×1, Tote', total:285000, date:'15 Jun', type:'ready', status:'Shipped' },
    { id:'ASC-1046', customer:'Wisnu G.', items:'Boxer Engine Tee ×2', total:390000, date:'14 Jun', type:'ready', status:'Shipped' }
  ];

  return {
    PRODUCTS: P,
    categories,
    sizeSets,
    colorOptions,
    owners,
    orders
  };
};

