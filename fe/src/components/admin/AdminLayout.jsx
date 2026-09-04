import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store';
import UtilityBar from '../shared/UtilityBar';
import AdminSidebar from './AdminSidebar';
import Dashboard from './Dashboard';
import Catalog from './Catalog';
import CatalogEdit from './CatalogEdit';
import Sales from './Sales';
import PreOrderSessions from './PreOrderSessions';
import PreOrderDone from './PreOrderDone';
import Finance from './Finance';
import Settings from './Settings';
import SessionDetail from './SessionDetail';

import CategoryModal from './CategoryModal';
import ProductModal from './ProductModal';
import SessionModal from './SessionModal';
import ProdSessionModal from './ProdSessionModal';
import PayModal from './PayModal';
import ShipModal from './ShipModal';
import Preloader from '../shared/Preloader';
import ScrollToTop from '../shared/ScrollToTop';

const ADMIN_ROUTE_KEY = 'admin_route';
const ADMIN_ROUTE_EXTRA_KEY = 'admin_route_extra';

export default function AdminLayout() {
  const { state, isAdmin, updateState } = useStore();
  const navigate = useNavigate();
  const route = state.adminRoute;
  const isEditingProduct = route === 'catalog-edit' && !!state.adminProdId;

  // Restore route from sessionStorage on first mount
  useEffect(() => {
    const savedRoute = sessionStorage.getItem(ADMIN_ROUTE_KEY);
    if (savedRoute && savedRoute !== 'dashboard') {
      try {
        const extra = JSON.parse(sessionStorage.getItem(ADMIN_ROUTE_EXTRA_KEY) || '{}');
        updateState({ adminRoute: savedRoute, ...extra });
      } catch (e) {
        updateState({ adminRoute: savedRoute });
      }
    }
  }, []);

  // Save route to sessionStorage whenever it changes
  useEffect(() => {
    if (route) {
      sessionStorage.setItem(ADMIN_ROUTE_KEY, route);
      // Save extra context needed to restore certain pages
      const extra = {};
      if (route === 'catalog-edit' && state.adminProdId) {
        extra.adminProdId = state.adminProdId;
      }
      if (route === 'sessdetail' && state.sessView) {
        extra.sessView = state.sessView;
      }
      sessionStorage.setItem(ADMIN_ROUTE_EXTRA_KEY, JSON.stringify(extra));
    }
  }, [route, state.adminProdId, state.sessView]);

  useEffect(() => {
    if (!state.user || !isAdmin()) {
      navigate('/admin/login');
    }
  }, [state.user]);

  if (!state.user || !isAdmin()) return null;

  return (
    <div style={{ background: '#F2EEE4', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Preloader />
      <UtilityBar />
      <div className="admin-body-grid" style={{ display: 'grid', gridTemplateColumns: '220px 1fr', flex: 1, minHeight: 'calc(100vh - 45px)' }}>
        <AdminSidebar />
        <main className="admin-main" style={{ padding: '40px 48px', overflowY: 'auto' }}>
          {route === 'dashboard' && <Dashboard />}
          {route === 'catalog' && <Catalog />}
          {isEditingProduct && <CatalogEdit />}
          {route === 'sales' && <Sales />}
          {route === 'sessions' && <PreOrderSessions />}
          {route === 'sessdetail' && <SessionDetail />}
          {route === 'podone' && <PreOrderDone />}
          {route === 'finance' && <Finance />}
          {(route === 'sizes' || route === 'colors' || route === 'roles') && <Settings />}
        </main>
      </div>
      <style>{`
        @media (max-width: 768px) {
          .admin-body-grid { grid-template-columns: 1fr !important; }
          .admin-main { padding: 20px 16px !important; }
        }
      `}</style>
      <CategoryModal />
      <ProductModal />
      <SessionModal />
      <ProdSessionModal />
      <PayModal />
      <ShipModal />
      <ScrollToTop />
    </div>
  );
}
