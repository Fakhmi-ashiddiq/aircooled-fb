import React, { useEffect, useRef, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useStore } from './store';
import StoreLayout from './components/store/StoreLayout';
import AdminLayout from './components/admin/AdminLayout';
import AdminLogin from './components/admin/AdminLogin';
import Profile from './components/admin/Profile';
import Preloader from './components/shared/Preloader';
import Toast from './components/shared/Toast';

function SyncRouter() {
  const navigate = useNavigate();
  const location = useLocation();
  const { state, updateState, data, dataLoading } = useStore();
  const [hasSynced, setHasSynced] = useState(false);
  
  // Sync URL to Zustand (when user types URL or uses Back/Forward button)
  useEffect(() => {
     if (location.pathname === '/admin/login') return;
     if (location.pathname === '/profile') return;
     if (location.pathname.startsWith('/admin')) {
        let adminRoute = location.pathname.replace('/admin', '') || '/dashboard';
        adminRoute = adminRoute.replace('/', '');
        if (state.view !== 'admin' || state.adminRoute !== adminRoute) {
            updateState({ view: 'admin', adminRoute: adminRoute || 'dashboard' });
        }
     } else {
        const pathParts = location.pathname.replace(/^\//, '').split('/');
        if (pathParts[0] === 'product' && pathParts[1]) {
            const slug = pathParts[1];
            const found = data.PRODUCTS.find(p => p.id === slug || p.code === slug);
            if (found) {
                if (state.activeId !== found.id) {
                    updateState({ view: 'store', route: 'product/' + found.id, activeId: found.id, activeImg: 0 });
                }
            } else if (!dataLoading) {
                updateState({ view: 'store', route: 'product/' + slug, activeId: null });
            } else {
                if (state.route !== 'product/' + slug) {
                    updateState({ view: 'store', route: 'product/' + slug });
                }
            }
        } else {
            let storeRoute = location.pathname === '/' ? 'home' : pathParts[0] || 'home';
            if (state.view !== 'store' || state.route !== storeRoute) {
                updateState({ view: 'store', route: storeRoute || 'home' });
            }
        }
     }
     if (!hasSynced) setHasSynced(true);
  }, [location.pathname, data.PRODUCTS.length, dataLoading]);

  // Sync Zustand to URL (when components call updateState)
  useEffect(() => {
     if (!hasSynced) return;
     if (location.pathname === '/admin/login') return;
     if (location.pathname === '/profile') return;
     let expectedPath = '/';
     if (state.view === 'admin') {
         expectedPath = '/admin/' + (state.adminRoute === 'dashboard' ? '' : state.adminRoute);
         if (expectedPath === '/admin/') expectedPath = '/admin';
     } else if (state.route.startsWith('product/')) {
         expectedPath = '/' + state.route;
     } else {
         expectedPath = state.route === 'home' ? '/' : '/' + state.route;
     }
     
     if (location.pathname !== expectedPath) {
         navigate(expectedPath);
     }
  }, [state.view, state.route, state.adminRoute, hasSynced]);

  return null;
}

export default function App() {
  const { fetchInitialData, loadUser } = useStore();

  useEffect(() => {
    loadUser();
    fetchInitialData();
  }, [fetchInitialData, loadUser]);

  return (
    <Router>
      <SyncRouter />
      <Preloader />
      <Toast />
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/*" element={<AdminLayout />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/*" element={<StoreLayout />} />
      </Routes>
    </Router>
  );
}

