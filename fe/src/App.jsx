import React, { useEffect } from 'react';
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
  const { state, updateState } = useStore();
  
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
        let storeRoute = location.pathname === '/' ? 'home' : location.pathname.replace('/', '');
        if (state.view !== 'store' || state.route !== storeRoute) {
            updateState({ view: 'store', route: storeRoute || 'home' });
        }
     }
  }, [location.pathname]);

  // Sync Zustand to URL (when components call updateState)
  useEffect(() => {
     if (location.pathname === '/admin/login') return;
     if (location.pathname === '/profile') return;
     let expectedPath = '/';
     if (state.view === 'admin') {
         expectedPath = '/admin/' + (state.adminRoute === 'dashboard' ? '' : state.adminRoute);
         if (expectedPath === '/admin/') expectedPath = '/admin';
     } else {
         expectedPath = state.route === 'home' ? '/' : '/' + state.route;
     }
     
     if (location.pathname !== expectedPath) {
         navigate(expectedPath);
     }
  }, [state.view, state.route, state.adminRoute]);

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

