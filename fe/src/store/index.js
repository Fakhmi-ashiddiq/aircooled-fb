import { create } from 'zustand';
import { persist } from 'zustand/middleware'
import { slugify, normStage, stageOrder } from '../utils/helpers';
import CategoryService from '../services/CategoryService';
import SizeSetService from '../services/SizeSetService';
import ColorOptionService from '../services/ColorOptionService';
import OwnerService from '../services/OwnerService';
import ProductService from '../services/ProductService';
import ProductParentService from '../services/ProductParentService';
import OrderService from '../services/OrderService';
import CartService from '../services/CartService';
import AuthService from '../services/AuthService';
import PreorderSessionService from '../services/PreorderSessionService';

const deepClone = (obj) => {
    if (typeof structuredClone === 'function') return structuredClone(obj);
    return JSON.parse(JSON.stringify(obj));
};

export const useStore = create((set, get) => ({
    // Data from API (replacing data.js)
    data: { PRODUCTS: [], categories: [], sizeSets: [], colorOptions: [], owners: [], orders: [], productParents: [] },
    dataLoading: true,
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

    // Auth Actions
    login: async (email, password) => {
        try {
            const result = await AuthService.login({ email, password });
            localStorage.setItem('auth_token', result.token);
            localStorage.setItem('auth_user', JSON.stringify(result.user));
            set((prev) => ({ state: { ...prev.state, user: result.user, authOpen: false } }));
            get().showToast('Login berhasil');
            await get().loadCartFromDB();
            return result;
        } catch (error) {
            get().showToast(error.response?.data?.message || 'Login gagal');
            throw error;
        }
    },
    register: async (name, email, password, password_confirmation, extra = {}) => {
        try {
            const payload = { name, email, password, password_confirmation, ...extra };
            const result = await AuthService.register(payload);
            localStorage.setItem('auth_token', result.token);
            localStorage.setItem('auth_user', JSON.stringify(result.user));
            set((prev) => ({ state: { ...prev.state, user: result.user, authOpen: false } }));
            get().showToast('Registrasi berhasil');
            await get().loadCartFromDB();
            return result;
        } catch (error) {
            get().showToast(error.response?.data?.message || 'Registrasi gagal');
            throw error;
        }
    },
    logout: async () => {
        try {
            await CartService.clear();
        } catch (e) {}
        try {
            await AuthService.logout();
        } catch (error) {}
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        set((prev) => ({ state: { ...prev.state, user: null, cart: [] } }));
        get().showToast('Logout berhasil');
    },
    loadUser: async () => {
        const token = localStorage.getItem('auth_token');
        const savedUser = localStorage.getItem('auth_user');
        if (token && savedUser) {
            try {
                const user = await AuthService.me();
                localStorage.setItem('auth_user', JSON.stringify(user));
                set((prev) => ({ state: { ...prev.state, user } }));
                await get().loadCartFromDB();
            } catch (error) {
                localStorage.removeItem('auth_token');
                localStorage.removeItem('auth_user');
                if (window.location.pathname.startsWith('/admin')) {
                    window.location.href = '/admin/login';
                }
            }
        }
    },
    isAdmin: () => {
        const { state } = get();
        return state.user?.role === 'admin' || state.user?.role === '1';
    },
    
    // API Fetcher
    fetchInitialData: async () => {
        try {
            const [categories, sizeSets, colorOptions, owners, products, orders, productParents] = await Promise.all([
                CategoryService.getAll(),
                SizeSetService.getAll(),
                ColorOptionService.getAll(),
                OwnerService.getAll(),
                ProductService.getAll(),
                OrderService.getAll(),
                ProductParentService.getAll()
            ]);

            set((prev) => {
                const newData = { ...prev.data };
                // Mapping DB data to match expected frontend structure if needed
                newData.categories = categories.map(c => c.name);
                newData.sizeSets = sizeSets.map(ss => ({
                    ...ss,
                    sizes: typeof ss.sizes === 'string' ? JSON.parse(ss.sizes || '[]') : ss.sizes,
                    guideImg: ss.guideImg ? (ss.guideImg.startsWith('http') ? ss.guideImg : 'http://localhost:8000/storage/' + ss.guideImg) : null
                }));
                newData.colorOptions = colorOptions;
                newData.owners = owners;
                newData.productParents = productParents;
                newData.PRODUCTS = products.map(p => {
      const API_BASE = 'http://localhost:8000/storage/';
      let sizes = typeof p.sizes === 'string' ? JSON.parse(p.sizes || '[]') : (p.sizes || []);
      let colors = typeof p.colors === 'string' ? JSON.parse(p.colors || '[]') : (p.colors || []);
      let images = [];
      if (p.product_images && p.product_images.length > 0) {
          images = p.product_images.map(img => {
              const src = typeof img === 'string' ? img : (img.src || '');
              const fullSrc = src.startsWith('http') ? src : API_BASE + src;
              return { src: fullSrc, name: img.name || '' };
          });
      } else {
          images = typeof p.images === 'string' ? JSON.parse(p.images || '[]') : (p.images || []);
      }
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
      result.stock = typeof p.stock === 'string' ? JSON.parse(p.stock || '{}') : (p.stock || {});
      result.stockTotal = Object.values(result.stock).reduce((a, b) => a + (b || 0), 0);
      result.sold = p.sold;
      result.weight = p.weight || 1000;
      result.committed = p.committed || 0;
      result.target = p.target || 0;
      result.hppLessXxlUnit = p.hpp_less_xxl_unit || 0;
      result.hppMoreXxlUnit = p.hpp_more_xxl_unit || 0;
      result.priceLessXxl = p.price_less_xxl || 0;
      result.priceMoreXxl = p.price_more_xxl || 0;
      result.priceLessXxlDiscount = p.price_less_xxl_discount || null;
      result.priceMoreXxlDiscount = p.price_more_xxl_discount || null;
      result.parentId = p.product_parent_id || null;
      result.parentSku = p.product_parent?.sku || null;
      result.totalSold = p.totalSold || 0;
      result.totalRevenue = p.totalRevenue || 0;
      
      const sessions = p.preorder_sessions || [];
      const openSession = sessions.find(s => s.status !== 'done');
      
      const formatDbDate = (str) => {
          if (!str) return '';
          const parts = str.split('-');
          if (parts.length !== 3) return str;
          const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          const m = parseInt(parts[1], 10) - 1;
          const d = parseInt(parts[2], 10);
          return `${d} ${months[m]}`;
      };

      if (openSession) {
          result.preorder = {
              id: openSession.id,
              sessionName: openSession.session_name,
              opens: formatDbDate(openSession.opened_at),
              closes: formatDbDate(openSession.closed_at),
              target: openSession.target_min,
              eta: formatDbDate(openSession.estimated_delivery),
              status: openSession.status,
              split: typeof openSession.profit_split === 'string' ? JSON.parse(openSession.profit_split || '{}') : (openSession.profit_split || {}),
              committed: result.committed
          };
      } else {
          result.preorder = null;
      }
      
      result.sessionHistory = sessions.filter(s => s.status === 'done').map(s => ({
          id: s.id,
          sessionName: s.session_name,
          opens: formatDbDate(s.opened_at),
          closes: formatDbDate(s.closed_at),
          target: s.target_min,
          eta: formatDbDate(s.estimated_delivery),
          status: s.status,
          split: typeof s.profit_split === 'string' ? JSON.parse(s.profit_split || '{}') : (s.profit_split || {}),
          committed: p.committed || 0
      }));
      
      result.productionSessions = sessions.map(s => ({
          id: s.id,
          sessionName: s.session_name,
          opens: formatDbDate(s.opened_at),
          closes: formatDbDate(s.closed_at),
          target: s.target_min,
          eta: formatDbDate(s.estimated_delivery),
          status: s.status,
          active: s.status !== 'done',
          split: typeof s.profit_split === 'string' ? JSON.parse(s.profit_split || '{}') : (s.profit_split || {}),
          committed: p.committed || 0
      }));

      // Use DB images if available, else keep orig
      if (images.length > 0) {
          result.images = images;
          result.gallery = images.map((img, i) => img.name || 'Gambar ' + (i+1));
      } else {
          result.images = result.images || [];
          result.gallery = result.gallery || [];
      }
      
      result.costs = Object.keys(costs).length > 0 ? costs : (result.costs || {});
      

      if (!result.productionSessions && p.type === 'ready') {
          result.productionSessions = [{ name: 'PRODUKSI AWAL', date: 'Hari Ini', qty: result.stockTotal||0, sold: p.sold||0, status: 'active', price: p.price, compareAt: p.compare_at||0, sizes: sizes, costs: costs }];
      }
      result.sessionHistory = result.sessionHistory || [];
      result.views = p.views || result.views || 0;
      
      return result;
  });
                newData.orders = orders.length > 0 ? orders.map(o => ({ ...o, db_id: o.id, id: o.code || o.id })) : (prev.data.orders || []);
                return { data: newData, dataLoading: false };
            });
        } catch (error) {
            console.error("Error fetching data:", error);
            set({ dataLoading: false });
        }
    },

        addCategory: async (name) => {
        try {
            await CategoryService.create({ name });
            await get().fetchInitialData();
            get().showToast('Kategori berhasil ditambahkan');
        } catch (e) { get().showToast(e.response?.data?.message || 'Gagal menambahkan kategori'); console.error(e); }
    },
    updateCategory: async (id, name) => {
        try {
            await CategoryService.update(id, { name });
            await get().fetchInitialData();
            get().showToast('Kategori diperbarui');
        } catch (e) { get().showToast(e.response?.data?.message || 'Gagal memperbarui kategori'); console.error(e); }
    },
    deleteCategory: async (id) => {
        try {
            await CategoryService.delete(id);
            await get().fetchInitialData();
            get().showToast('Kategori dihapus');
        } catch (e) { get().showToast(e.response?.data?.message || 'Gagal menghapus kategori'); console.error(e); }
    },

    // CRUD Actions for SizeSets
    addSizeSet: async (name) => {
        try {
            await SizeSetService.create({ name, code: name.toLowerCase().replace(/\s+/g, '-') + '-' + Math.floor(Math.random() * 1000), active: true, sizes: JSON.stringify([]) });
            await get().fetchInitialData();
            get().showToast('Pilihan ukuran ditambahkan');
        } catch (e) { get().showToast(e.response?.data?.message || 'Gagal menambahkan ukuran'); console.error(e); }
    },
    updateSizeSet: async (id, data) => {
        try {
            await SizeSetService.update(id, data);
            await get().fetchInitialData();
            get().showToast('Pilihan ukuran diperbarui');
        } catch (e) { get().showToast(e.response?.data?.message || 'Gagal memperbarui ukuran'); console.error(e); }
    },
    deleteSizeSet: async (id) => {
        try {
            await SizeSetService.delete(id);
            await get().fetchInitialData();
            get().showToast('Pilihan ukuran dihapus');
        } catch (e) { get().showToast(e.response?.data?.message || 'Gagal menghapus ukuran'); console.error(e); }
    },

    // CRUD Actions for ColorOptions
    addColorOption: async (name, hex) => {
        try {
            await ColorOptionService.create({ name, code: name.toLowerCase().replace(/\s+/g, '-') + '-' + Math.floor(Math.random() * 1000), hex, active: true });
            await get().fetchInitialData();
            get().showToast('Pilihan warna ditambahkan');
        } catch (e) { get().showToast(e.response?.data?.message || 'Gagal menambahkan warna'); console.error(e); }
    },
    updateColorOption: async (id, data) => {
        try {
            await ColorOptionService.update(id, data);
            await get().fetchInitialData();
            get().showToast('Pilihan warna diperbarui');
        } catch (e) { get().showToast(e.response?.data?.message || 'Gagal memperbarui warna'); console.error(e); }
    },
    deleteColorOption: async (id) => {
        try {
            await ColorOptionService.delete(id);
            await get().fetchInitialData();
            get().showToast('Pilihan warna dihapus');
        } catch (e) { get().showToast(e.response?.data?.message || 'Gagal menghapus warna'); console.error(e); }
    },

    // CRUD Actions for Owners
    addOwner: async (name, pic) => {
        try {
            await OwnerService.create({ name, pic, code: name.toLowerCase().replace(/\s+/g, '-') + '-' + Math.floor(Math.random() * 1000) });
            await get().fetchInitialData();
            get().showToast('Owner berhasil ditambahkan');
        } catch (e) { get().showToast(e.response?.data?.message || 'Gagal menambahkan owner'); console.error(e); }
    },
    updateOwner: async (id, data) => {
        try {
            await OwnerService.update(id, data);
            await get().fetchInitialData();
            get().showToast('Owner diperbarui');
        } catch (e) { get().showToast(e.response?.data?.message || 'Gagal memperbarui owner'); console.error(e); }
    },
    deleteOwner: async (id) => {
        try {
            await OwnerService.delete(id);
            await get().fetchInitialData();
            get().showToast('Owner dihapus');
        } catch (e) { get().showToast(e.response?.data?.message || 'Gagal menghapus owner'); console.error(e); }
    },

    // CRUD Actions for Products
    addProduct: async (data) => {
        try {
            if (data instanceof FormData) {
                await ProductService.createWithFiles(data);
            } else {
                await ProductService.create(data);
            }
            await get().fetchInitialData();
            get().showToast('Produk berhasil ditambahkan');
        } catch (e) { get().showToast(e.response?.data?.message || e.response?.data?.errors?.images?.[0] || e.message || 'Gagal menambahkan produk'); console.error(e); }
    },
    updateProduct: async (id, data) => {
        try {
            if (data instanceof FormData) {
                await ProductService.updateWithFiles(id, data);
            } else {
                await ProductService.update(id, data);
            }
            await get().fetchInitialData();
            get().showToast('Produk diperbarui');
        } catch (e) { get().showToast(e.response?.data?.message || e.response?.data?.errors?.images?.[0] || e.message || 'Gagal memperbarui produk'); console.error(e); }
    },
    deleteProduct: async (id) => {
        try {
            await ProductService.delete(id);
            await get().fetchInitialData();
            get().showToast('Produk dihapus');
        } catch (e) { get().showToast(e.response?.data?.message || 'Gagal menghapus produk'); console.error(e); }
    },

    // Submit Pre-Order
    submitPreOrder: async ({ product, items, shippingCost, name, email, phone, address, cityId, notes, userId }) => {
        try {
            const totalQty = items.reduce((a, it) => a + (it.qty || 1), 0);
            const subtotal = (product.price || 0) * totalQty;
            const total = subtotal + (shippingCost || 0);
            const code = 'PO-' + Date.now().toString(36).toUpperCase() + Math.floor(Math.random() * 100);
            const today = new Date();
            const dateStr = today.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });

            const orderItems = items.map(it => ({
                product_id: product.db_id || product.id,
                size: it.size,
                color: it.color,
                qty: it.qty || 1,
                price: product.price || 0,
                type: 'preorder'
            }));

            const orderData = {
                code,
                customer: name,
                total,
                date: dateStr,
                type: 'preorder',
                status: 'Awaiting',
                user_id: userId || null,
                product_id: product.db_id || product.id,
                session_name: product.preorder?.sessionName || '',
                phone,
                email,
                address,
                city_id: cityId || null,
                shipping_cost: shippingCost,
                notes: notes || '',
                order_items: orderItems
            };

            const result = await OrderService.create(orderData);
            await get().fetchInitialData();
            return { success: true, orderId: code, data: result.data };
        } catch (error) {
            get().showToast(error.response?.data?.message || 'Gagal mengirim pesanan');
            return { success: false, error };
        }
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
        if (!p) return 0;
        const o = get().state.committedOverride?.[p.id];
        return o != null ? o : (p.committed || 0);
    },

    unitsOf: (p) => {
        if (!p || typeof p !== 'object') return 0;
        return p.type === 'preorder' ? get().committedOf(p) : p.totalSold || 0;
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
        const allSess = [p.preorder].concat(p.sessionHistory || []).filter(Boolean);
        const committed = allSess.reduce((a, sess) => a + (sess === p.preorder ? _this.committedOf(p) : (sess.committed || 0)), 0);
        const target = allSess.reduce((a, sess) => a + (sess.target || 0), 0);
        const paidIn = allSess.reduce((a, sess) => {
            const buyers = _this.poBuyers(sess);
            return a + buyers.reduce((x, b) => x + (b.pay === 'Lunas' ? (b.payAmount || (sess.price || 0) * _this.buyerQty(b)) : 0), 0);
        }, 0);
        return { committed, paidIn, target, count: allSess.length };
    },

    addToCart: async () => {
        const { data, state, updateState, showToast } = get();
        const user = state.user;
        const p = data.PRODUCTS.find(x => x.id === state.activeId);
        if (!p) return;
        if (p.sizes.length > 1 && !state.selectedSize) return;
        if (p.colors && p.colors.length > 1 && !state.selectedColor) return;
        
        const size = state.selectedSize || p.sizes[0];
        if (p.type === 'ready' && p.stock) {
            const sizeStock = p.stock[size] || 0;
            if (sizeStock <= 0) {
                showToast('Stok ' + size + ' habis');
                return;
            }
        }
        const color = state.selectedColor || (p.colors && p.colors[0]) || '';
        const key = p.id + '|' + size + '|' + color;
        const cart = [...state.cart];
        const ex = cart.find(c => c.key === key);
        
        if (ex) {
            ex.qty += state.qty;
        } else {
            cart.push({ key, id: p.id, size, color, qty: state.qty });
        }
        updateState({ cart, cartOpen: true });

        if (user) {
            try {
                await CartService.add({ product_id: p.db_id, size, color, qty: state.qty });
                await get().loadCartFromDB();
            } catch (e) {
                console.error('Cart add failed:', e.response?.data || e.message);
                get().showToast('Gagal simpan keranjang: ' + (e.response?.data?.message || e.message));
            }
        }
    },

    changeQty: async (key, d) => {
        const { state, updateState } = get();
        const user = state.user;
        const item = state.cart.find(c => c.key === key);
        let cart = state.cart.map(c => c.key === key ? { ...c, qty: c.qty + d } : c).filter(c => c.qty > 0);
        updateState({ cart });

        if (user && item) {
            const newQty = item.qty + d;
            try {
                if (newQty <= 0 && item.dbId) {
                    await CartService.remove(item.dbId);
                } else if (item.dbId) {
                    await CartService.update(item.dbId, newQty);
                }
                await get().loadCartFromDB();
            } catch (e) {}
        }
    },

    removeCartItem: async (key) => {
        const { state, updateState } = get();
        const user = state.user;
        const item = state.cart.find(c => c.key === key);
        let cart = state.cart.filter(c => c.key !== key);
        updateState({ cart });

        if (user && item?.dbId) {
            try { await CartService.remove(item.dbId); } catch (e) {}
        }
    },

    loadCartFromDB: async () => {
        try {
            const items = await CartService.getAll();
            const cart = items.map(item => {
                const p = get().data.PRODUCTS.find(x => x.db_id === item.product_id);
                const pid = p ? p.id : 'product-' + item.product_id;
                return {
                    key: pid + '|' + (item.size || '') + '|' + (item.color || ''),
                    id: pid,
                    size: item.size || '',
                    color: item.color || '',
                    qty: item.qty,
                    dbId: item.id
                };
            });
            set((prev) => ({ state: { ...prev.state, cart } }));
        } catch (e) {}
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
        let targetSessId = null;
        let updatedSess = null;
        
        _this.setData((prevData) => {
            const next = deepClone(prevData);
            const p = next.PRODUCTS.find((x) => x.id === productId);
            if (!p) return prevData;
            const sess = (p.preorder && p.preorder.sessionName === sessionName)
                ? p.preorder
                : (p.sessionHistory || []).find((s) => s.sessionName === sessionName);
            if (!sess) return prevData;
            
            targetSessId = sess.id;
            mutator(sess);
            updatedSess = sess;
            return next;
        });
        
        if (targetSessId && updatedSess) {
            try {
                await PreorderSessionService.update(targetSessId, {
                    session_name: updatedSess.sessionName,
                    opened_at: updatedSess.opens,
                    closed_at: updatedSess.closes,
                    target_min: updatedSess.target,
                    estimated_delivery: updatedSess.eta,
                    status: updatedSess.status,
                    profit_split: JSON.stringify(updatedSess.split || {})
                });
                await _this.fetchInitialData();
            } catch (e) {
                console.error("Failed to update session", e);
            }
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












