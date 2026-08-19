import { create } from 'zustand';
import { getInitialData } from '../data';
import { slugify, normStage, stageOrder } from '../utils/helpers';
import CategoryService from '../services/CategoryService';
import SizeSetService from '../services/SizeSetService';
import ColorOptionService from '../services/ColorOptionService';
import OwnerService from '../services/OwnerService';
import ProductService from '../services/ProductService';
import OrderService from '../services/OrderService';

const deepClone = (obj) => {
    if (typeof structuredClone === 'function') return structuredClone(obj);
    return JSON.parse(JSON.stringify(obj));
};

export const useStore = create((set, get) => ({
    // Data from API (replacing data.js)
    data: getInitialData(), 
    setData: (updater) => set((prev) => ({ data: typeof updater === 'function' ? updater(prev.data) : updater })),
    
    // UI State
    state: {
        appReady: false,
        view: 'store', route: 'home', adminRoute: 'dashboard', adminProdId: null, editProd: null, poView: null, sessView: null,
        activeId: 'lemans-tee', qty: 1, selectedSize: null, selectedColor: null, activeImg: 0, lightbox: false, sizeGuideOpen: false,
        cart: [], cartOpen: false, shopFilter: 'all', shopCat: 'all', shopSearch: '',
        catalogTab: 'ready', catalogSearch: '', catalogCat: 'all', catalogSort: 'terbaru',
        payModal: null, payForm: { amount: '', method: 'Transfer BCA', date: '', proof: '' },
        shipModal: null, shipForm: { courier: 'JNE', resi: '', proof: '', cost: '' },
        checkoutStep: 'form', orderId: null, payMethod: 'va', checkoutMode: 'guest',
        poModal: false, poDone: false, poOrderId: null, poMode: 'guest', poCity: '', poShip: '', poItems: [],
        split: { syndicate: 40, creative: 25, admin: 15, platform: 20 },
        committedOverride: {},
        user: null, authOpen: false, authMode: 'login', authName: '', authEmail: '',
        catModal: false, prodModal: false, sessionModal: false, prodSessionModal: false, prodSessionPid: null,
        newProdSession: { name: '', date: '', qty: '', price: '', compareAt: '', sizeSetId: 'reg', colors: [], produksi: '', kemasan: '', stiker: '', profitBase: 'harga', mediaPct: 30, mediaRole: 'ro1', desainPct: 30, desainRole: 'ro1', prodPct: 25, prodRole: 'ro2', storePct: 15, investorPct: 0, investorRole: '' },
        newCat: '', newProd: { name: '', cat: 'Kaos', type: 'ready', price: '', sizes: 'S,M,L,XL', garment: '#D9CBB0', print: 'logo', stock: '', produksi: '', kemasan: '', stiker: '' },
        newSession: { productId: '', sessionName: '', opens: '', closes: '', target: '', eta: '', price: '', compareAt: '', sizeSetId: 'reg', colors: [], produksi: '', kemasan: '', stiker: '', profitBase: 'gross', mediaPct: 0, mediaRole: '', desainPct: 0, desainRole: '', prodPct: 0, prodRole: '', storePct: 0 },
        newSetName: '', sizeInputs: {}, newColorName: '', newColorHex: '#D9CBB0', newOwnerName: '', newOwnerPic: '', settingsOpen: false, toast: null
    },
    updateState: (updates) => set((prev) => ({ state: { ...prev.state, ...updates } })),
    showToast: (msg) => set((prev) => ({ state: { ...prev.state, toast: { message: msg } } })),

    // API Fetcher
    fetchInitialData: async () => {
        try {
            const [categories, sizeSets, colorOptions, owners, products, orders] = await Promise.all([
                CategoryService.getAll(),
                SizeSetService.getAll(),
                ColorOptionService.getAll(),
                OwnerService.getAll(),
                ProductService.getAll(),
                OrderService.getAll()
            ]);

            set((prev) => {
                const newData = { ...prev.data };
                // Mapping DB data to match expected frontend structure if needed
                newData.categories = categories.map(c => c.name);
                newData.sizeSets = sizeSets.map(ss => ({ ...ss, sizes: typeof ss.sizes === 'string' ? JSON.parse(ss.sizes || '[]') : ss.sizes }));
                newData.colorOptions = colorOptions;
                newData.owners = owners;
                newData.PRODUCTS = products.map(p => {
      let sizes = typeof p.sizes === 'string' ? JSON.parse(p.sizes || '[]') : (p.sizes || []);
      let colors = typeof p.colors === 'string' ? JSON.parse(p.colors || '[]') : (p.colors || []);
      let images = p.product_images && p.product_images.length > 0 ? p.product_images.map(img => typeof img === 'string' ? {src: img} : img) : (typeof p.images === 'string' ? JSON.parse(p.images || '[]') : (p.images || []));
      let costs = typeof p.costs === 'string' ? JSON.parse(p.costs || '{}') : (p.costs || {});
      
      let orig = (prev.data.PRODUCTS || []).find(op => op.id === p.code || op.code === p.code || op.name === p.name);
      
      let result = orig ? { ...orig } : {};
      result.db_id = p.id;
      result.id = p.code; // Use DB code as frontend id
      result.code = p.code;
      result.name = p.name;
      result.cat = p.category;
      result.category = p.category;
      result.type = p.type;
      result.price = p.price;
      result.compareAt = p.compare_at;
      result.garment = p.garment_hex;
      result.garmentHex = p.garment_hex;
      result.print = p.print_type;
      result.printType = p.print_type;
      result.sizes = sizes;
      result.colors = colors;
      result.stock = p.stock;
      result.sold = p.sold;
      
      // Use DB images if available, else keep orig
      if (images.length > 0) {
          result.images = images;
          result.gallery = images.map((img, i) => img.name || 'Gambar ' + (i+1));
      } else {
          result.images = result.images || [];
          result.gallery = result.gallery || [];
      }
      
      result.costs = Object.keys(costs).length > 0 ? costs : (result.costs || {});
      
      if (!result.preorder && p.type === 'preorder') {
          result.preorder = { sessionName: 'NEW SESSION', status: 'open', target: 50, committed: 0, eta: '-', buyers: [], price: p.price, compareAt: p.compare_at||0, sizes: sizes, colors: colors, costs: costs, split: {base: 'gross'} };
      }
      if (!result.productionSessions && p.type === 'ready') {
          result.productionSessions = [{ name: 'PRODUKSI AWAL', date: 'Hari Ini', qty: p.stock||0, sold: p.sold||0, status: 'active', price: p.price, compareAt: p.compare_at||0, sizes: sizes, costs: costs }];
      }
      result.sessionHistory = result.sessionHistory || [];
      result.views = result.views || 0;
      
      return result;
  });
                newData.orders = orders.length > 0 ? orders.map(o => ({ ...o, db_id: o.id, id: o.code || o.id })) : (prev.data.orders || []);
                return { data: newData };
            });
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    },

        addCategory: async (name) => {
        try {
            await CategoryService.create({ name });
            await get().fetchInitialData();
            get().showToast('Kategori berhasil ditambahkan');
        } catch (e) { console.error(e); }
    },
    updateCategory: async (id, name) => {
        try {
            await CategoryService.update(id, { name });
            await get().fetchInitialData();
            get().showToast('Kategori diperbarui');
        } catch (e) { console.error(e); }
    },
    deleteCategory: async (id) => {
        try {
            await CategoryService.delete(id);
            await get().fetchInitialData();
            get().showToast('Kategori dihapus');
        } catch (e) { console.error(e); }
    },

    // CRUD Actions for SizeSets
    addSizeSet: async (name) => {
        try {
            await SizeSetService.create({ name, code: name.toLowerCase().replace(/\s+/g, '-') + '-' + Math.floor(Math.random() * 1000), active: true, sizes: JSON.stringify([]) });
            await get().fetchInitialData();
            get().showToast('Pilihan ukuran ditambahkan');
        } catch (e) { console.error(e); }
    },
    updateSizeSet: async (id, data) => {
        try {
            // If data contains sizes array, we should stringify it before sending to match our previous logic, or Laravel model casts will handle it?
            // Actually Laravel casts it, so we can send array.
            await SizeSetService.update(id, data);
            await get().fetchInitialData();
            get().showToast('Pilihan ukuran diperbarui');
        } catch (e) { console.error(e); }
    },
    deleteSizeSet: async (id) => {
        try {
            await SizeSetService.delete(id);
            await get().fetchInitialData();
            get().showToast('Pilihan ukuran dihapus');
        } catch (e) { console.error(e); }
    },

    // CRUD Actions for ColorOptions
    addColorOption: async (name, hex) => {
        try {
            await ColorOptionService.create({ name, code: name.toLowerCase().replace(/\s+/g, '-') + '-' + Math.floor(Math.random() * 1000), hex, active: true });
            await get().fetchInitialData();
            get().showToast('Pilihan warna ditambahkan');
        } catch (e) { console.error(e); }
    },
    updateColorOption: async (id, data) => {
        try {
            await ColorOptionService.update(id, data);
            await get().fetchInitialData();
            get().showToast('Pilihan warna diperbarui');
        } catch (e) { console.error(e); }
    },
    deleteColorOption: async (id) => {
        try {
            await ColorOptionService.delete(id);
            await get().fetchInitialData();
            get().showToast('Pilihan warna dihapus');
        } catch (e) { console.error(e); }
    },

    // CRUD Actions for Owners
    addOwner: async (name, pic) => {
        try {
            await OwnerService.create({ name, pic, code: name.toLowerCase().replace(/\s+/g, '-') + '-' + Math.floor(Math.random() * 1000) });
            await get().fetchInitialData();
            get().showToast('Owner berhasil ditambahkan');
        } catch (e) { console.error(e); }
    },
    updateOwner: async (id, data) => {
        try {
            await OwnerService.update(id, data);
            await get().fetchInitialData();
            get().showToast('Owner diperbarui');
        } catch (e) { console.error(e); }
    },
    deleteOwner: async (id) => {
        try {
            await OwnerService.delete(id);
            await get().fetchInitialData();
            get().showToast('Owner dihapus');
        } catch (e) { console.error(e); }
    },

    // CRUD Actions for Products
    addProduct: async (data) => {
        try {
            await ProductService.create(data);
            await get().fetchInitialData();
            get().showToast('Produk berhasil ditambahkan');
        } catch (e) { console.error(e); }
    },
    updateProduct: async (id, data) => {
        try {
            await ProductService.update(id, data);
            await get().fetchInitialData();
            get().showToast('Produk diperbarui');
        } catch (e) { console.error(e); }
    },
    deleteProduct: async (id) => {
        try {
            await ProductService.delete(id);
            await get().fetchInitialData();
            get().showToast('Produk dihapus');
        } catch (e) { console.error(e); }
    },

    // Helpers ported from AppContext
    go: (route) => {
        get().updateState({ route, cartOpen: false });
        window.scrollTo(0, 0);
    },
    
    openProduct: (id) => {
        const { data, updateState, setData } = get();
        const p = data.PRODUCTS.find((x) => x.id === id);
        if (p) {
            const updatedProducts = data.PRODUCTS.map(prod => prod.id === id ? { ...prod, views: (prod.views || 0) + 1 } : prod);
            setData({ ...data, PRODUCTS: updatedProducts });
        }
        updateState({
            route: 'product',
            activeId: id,
            qty: 1,
            selectedSize: (p && p.sizes && p.sizes.length === 1) ? p.sizes[0] : null,
            selectedColor: (p && p.colors && p.colors.length === 1) ? p.colors[0].name : null,
            activeImg: 0,
            lightbox: false,
            cartOpen: false
        });
        window.scrollTo(0, 0);
    },

    committedOf: (p) => {
        const o = get().state.committedOverride[p.id];
        return o != null ? o : p.preorder?.committed || 0;
    },

    unitsOf: (p) => {
        return p.type === 'preorder' ? get().committedOf(p) : p.sold;
    },

    poBuyers: (sess) => {
        if (sess.buyers && sess.buyers.length) return sess.buyers;
        const n = Math.min(sess.committed || 0, 8);
        const names = ['Agus S.', 'Budi P.', 'Citra L.', 'Doni R.', 'Eka W.', 'Fitri N.', 'Gilang A.', 'Hana M.'];
        const out = [];
        for (let i = 0; i < n; i++) out.push({ name: names[i % names.length], size: (sess.sizes && sess.sizes[0]) || '-', color: (sess.colors && sess.colors[0] && sess.colors[0].name) || '-', qty: 1, pay: 'Lunas', ship: 'Terkirim' });
        return out;
    },

    buyerItems: (b) => {
        return b.items && b.items.length ? b.items : [{ size: b.size || '-', color: b.color || '-', qty: b.qty || 1 }];
    },

    buyerQty: (b) => {
        return get().buyerItems(b).reduce((a, it) => a + (it.qty || 1), 0);
    },

    poAggregate: (p) => {
        const _this = get();
        if (p.type !== 'preorder') return { committed: 0, paidIn: 0, target: 0, count: 0 };
        const allSess = [p.preorder].concat(p.sessionHistory || []);
        const committed = allSess.reduce((a, sess, i) => a + (i === 0 ? _this.committedOf(p) : (sess.committed || 0)), 0);
        const target = allSess.reduce((a, sess) => a + (sess.target || 0), 0);
        const paidIn = allSess.reduce((a, sess) => {
            const buyers = _this.poBuyers(sess);
            return a + buyers.reduce((x, b) => x + (b.pay === 'Lunas' ? (b.payAmount || (sess.price || 0) * _this.buyerQty(b)) : 0), 0);
        }, 0);
        return { committed, paidIn, target, count: allSess.length };
    },

    addToCart: () => {
        const { data, state, updateState } = get();
        const p = data.PRODUCTS.find(x => x.id === state.activeId);
        if (!p) return;
        if (p.sizes.length > 1 && !state.selectedSize) return;
        if (p.colors && p.colors.length > 1 && !state.selectedColor) return;
        
        const size = state.selectedSize || p.sizes[0];
        const key = p.id + '|' + size;
        const cart = [...state.cart];
        const ex = cart.find(c => c.key === key);
        
        if (ex) {
            ex.qty += state.qty;
        } else {
            cart.push({ key, id: p.id, size, qty: state.qty });
        }
        updateState({ cart, cartOpen: true });
    },

    changeQty: (key, d) => {
        const { state, updateState } = get();
        let cart = state.cart.map(c => c.key === key ? { ...c, qty: c.qty + d } : c).filter(c => c.qty > 0);
        updateState({ cart });
    },

    findSession: (productId, sessionName) => {
        const { data } = get();
        const p = data.PRODUCTS.find((x) => x.id === productId);
        if (!p) return null;
        if (p.preorder && p.preorder.sessionName === sessionName) return { p, sess: p.preorder, active: true };
        const h = (p.sessionHistory || []).find((s) => s.sessionName === sessionName);
        if (h) return { p, sess: h, active: false };
        return null;
    },

    mutateSession: async (productId, sessionName, mutator) => {
        const _this = get();
        let updatedProduct = null;
        _this.setData((prevData) => {
            const next = deepClone(prevData);
            const p = next.PRODUCTS.find((x) => x.id === productId);
            if (!p) return prevData;
            const sess = (p.preorder && p.preorder.sessionName === sessionName)
                ? p.preorder
                : (p.sessionHistory || []).find((s) => s.sessionName === sessionName);
            if (!sess) return prevData;
            mutator(sess);
            updatedProduct = p;
            return next;
        });
        if (updatedProduct) {
            await _this.updateProduct(updatedProduct.db_id || updatedProduct.id, updatedProduct);
        }
    },

    applyStageEffects: (sess) => {
        if (stageOrder().indexOf(normStage(sess.status)) >= 1 && sess.buyers) {
            sess.buyers.forEach((b) => { if (b.pay === 'Belum Lunas') b.pay = 'Batal'; });
        }
    },

    advanceSess: (productId, sessionName) => {
        const _this = get();
        _this.mutateSession(productId, sessionName, (sess) => {
            const order = stageOrder();
            const i = order.indexOf(normStage(sess.status));
            if (i < order.length - 1) {
                sess.status = order[i + 1];
                _this.applyStageEffects(sess);
            }
        });
    },

    setSessStatus: (productId, sessionName, stage) => {
        const _this = get();
        _this.mutateSession(productId, sessionName, (sess) => {
            sess.status = stage;
            _this.applyStageEffects(sess);
        });
    },

    toggleSplitBase: (productId, sessionName) => {
        get().mutateSession(productId, sessionName, (sess) => {
            if (sess.splitConfirmed) return;
            if (!sess.split) sess.split = { base: 'gross' };
            sess.split.base = sess.split.base === 'harga' ? 'gross' : 'harga';
        });
    },

    confirmSplit: (productId, sessionName) => {
        get().mutateSession(productId, sessionName, (sess) => { sess.splitConfirmed = true; });
    },

    unconfirmSplit: (productId, sessionName) => {
        get().mutateSession(productId, sessionName, (sess) => { sess.splitConfirmed = false; });
    },

    saveBuyerPayment: (productId, sessionName, idx, status, form) => {
        get().mutateSession(productId, sessionName, (sess) => {
            const b = sess.buyers && sess.buyers[idx];
            if (!b) return;
            b.pay = status;
            if (status === 'Lunas') {
                b.payAmount = parseInt(form.amount) || b.payAmount || 0;
                b.payMethod = form.method;
                b.payDate = form.date || b.payDate;
                b.payProof = form.proof;
            }
        });
    },

    saveBuyerShipping: (productId, sessionName, idx, form) => {
        get().mutateSession(productId, sessionName, (sess) => {
            const b = sess.buyers && sess.buyers[idx];
            if (!b) return;
            b.ship = 'Terkirim';
            b.shipCourier = form.courier;
            b.shipResi = form.resi;
            b.shipProof = form.proof;
            b.shipCost = parseInt(form.cost) || 0;
        });
    }
}));












