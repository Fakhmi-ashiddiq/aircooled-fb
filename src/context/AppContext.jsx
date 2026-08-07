import React, { createContext, useState, useEffect } from 'react';
import { getInitialData } from '../data';
import { slugify, normStage, stageOrder } from '../utils/helpers';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [data, setData] = useState(() => getInitialData());
  const [state, setState] = useState({
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
    newSetName: '', sizeInputs: {}, newColorName: '', newColorHex: '#D9CBB0', newRoleName: '', newRolePic: '', settingsOpen: false
  });

  const updateState = (updates) => setState((prev) => ({ ...prev, ...updates }));

  const go = (route) => {
    updateState({ route, cartOpen: false });
    window.scrollTo(0, 0);
  };

  const openProduct = (id) => {
    const p = data.PRODUCTS.find((x) => x.id === id);
    if (p) {
      const updatedProducts = data.PRODUCTS.map(prod => prod.id === id ? { ...prod, views: (prod.views || 0) + 1 } : prod);
      setData(prev => ({ ...prev, PRODUCTS: updatedProducts }));
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
  };

  const committedOf = (p) => {
    const o = state.committedOverride[p.id];
    return o != null ? o : p.preorder?.committed || 0;
  };

  const unitsOf = (p) => {
    return p.type === 'preorder' ? committedOf(p) : p.sold;
  };

  const poAggregate = (p) => {
    if (p.type !== 'preorder') return { committed: 0, paidIn: 0, target: 0, count: 0 };
    const allSess = [p.preorder].concat(p.sessionHistory || []);
    const committed = allSess.reduce((a, sess, i) => a + (i === 0 ? committedOf(p) : (sess.committed || 0)), 0);
    const target = allSess.reduce((a, sess) => a + (sess.target || 0), 0);
    const paidIn = allSess.reduce((a, sess) => {
      const buyers = poBuyers(sess);
      return a + buyers.reduce((x, b) => x + (b.pay === 'Lunas' ? (b.payAmount || (sess.price || 0) * buyerQty(b)) : 0), 0);
    }, 0);
    return { committed, paidIn, target, count: allSess.length };
  };

  const poBuyers = (sess) => {
    if (sess.buyers && sess.buyers.length) return sess.buyers;
    const n = Math.min(sess.committed || 0, 8);
    const names = ['Agus S.', 'Budi P.', 'Citra L.', 'Doni R.', 'Eka W.', 'Fitri N.', 'Gilang A.', 'Hana M.'];
    const out = [];
    for (let i = 0; i < n; i++) out.push({ name: names[i % names.length], size: (sess.sizes && sess.sizes[0]) || '-', color: (sess.colors && sess.colors[0] && sess.colors[0].name) || '-', qty: 1, pay: 'Lunas', ship: 'Terkirim' });
    return out;
  };

  const buyerItems = (b) => {
    return b.items && b.items.length ? b.items : [{ size: b.size || '-', color: b.color || '-', qty: b.qty || 1 }];
  };

  const buyerQty = (b) => {
    return buyerItems(b).reduce((a, it) => a + (it.qty || 1), 0);
  };

  const addToCart = () => {
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
  };

  const changeQty = (key, d) => {
    let cart = state.cart.map(c => c.key === key ? { ...c, qty: c.qty + d } : c).filter(c => c.qty > 0);
    updateState({ cart });
  };

  // ---- deep clone helper (aman untuk mutasi nested object lalu commit ke state) ----
  const deepClone = (obj) => {
    if (typeof structuredClone === 'function') return structuredClone(obj);
    return JSON.parse(JSON.stringify(obj));
  };

  // ---- cari sesi (aktif ATAU histori) berdasar productId + sessionName ----
  const findSession = (productId, sessionName) => {
    const p = data.PRODUCTS.find((x) => x.id === productId);
    if (!p) return null;
    if (p.preorder && p.preorder.sessionName === sessionName) return { p, sess: p.preorder, active: true };
    const h = (p.sessionHistory || []).find((s) => s.sessionName === sessionName);
    if (h) return { p, sess: h, active: false };
    return null;
  };

  const mutateSession = (productId, sessionName, mutator) => {
    setData((prev) => {
      const next = deepClone(prev);
      const p = next.PRODUCTS.find((x) => x.id === productId);
      if (!p) return prev;
      const sess = (p.preorder && p.preorder.sessionName === sessionName)
        ? p.preorder
        : (p.sessionHistory || []).find((s) => s.sessionName === sessionName);
      if (!sess) return prev;
      mutator(sess);
      return next;
    });
  };

  const applyStageEffects = (sess) => {
    if (stageOrder().indexOf(normStage(sess.status)) >= 1 && sess.buyers) {
      sess.buyers.forEach((b) => { if (b.pay === 'Belum Lunas') b.pay = 'Batal'; });
    }
  };

  const advanceSess = (productId, sessionName) => {
    mutateSession(productId, sessionName, (sess) => {
      const order = stageOrder();
      const i = order.indexOf(normStage(sess.status));
      if (i < order.length - 1) {
        sess.status = order[i + 1];
        applyStageEffects(sess);
      }
    });
  };

  const setSessStatus = (productId, sessionName, stage) => {
    mutateSession(productId, sessionName, (sess) => {
      sess.status = stage;
      applyStageEffects(sess);
    });
  };

  const toggleSplitBase = (productId, sessionName) => {
    mutateSession(productId, sessionName, (sess) => {
      if (sess.splitConfirmed) return;
      if (!sess.split) sess.split = { base: 'gross' };
      sess.split.base = sess.split.base === 'harga' ? 'gross' : 'harga';
    });
  };

  const confirmSplit = (productId, sessionName) => {
    mutateSession(productId, sessionName, (sess) => { sess.splitConfirmed = true; });
  };

  const unconfirmSplit = (productId, sessionName) => {
    mutateSession(productId, sessionName, (sess) => { sess.splitConfirmed = false; });
  };

  const saveBuyerPayment = (productId, sessionName, idx, status, form) => {
    mutateSession(productId, sessionName, (sess) => {
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
  };

  const saveBuyerShipping = (productId, sessionName, idx, form) => {
    mutateSession(productId, sessionName, (sess) => {
      const b = sess.buyers && sess.buyers[idx];
      if (!b) return;
      b.ship = 'Terkirim';
      b.shipCourier = form.courier;
      b.shipResi = form.resi;
      b.shipProof = form.proof;
      b.shipCost = parseInt(form.cost) || 0;
    });
  };

  return (
    <AppContext.Provider value={{
      data, setData, state, updateState, go, openProduct,
      committedOf, unitsOf, poAggregate, poBuyers, buyerItems, buyerQty,
      addToCart, changeQty,
      findSession, advanceSess, setSessStatus, toggleSplitBase, confirmSplit, unconfirmSplit,
      saveBuyerPayment, saveBuyerShipping
    }}>
      {children}
    </AppContext.Provider>
  );
};
