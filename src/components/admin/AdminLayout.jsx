import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
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

export default function AdminLayout() {
  const { state } = useContext(AppContext);
  const route = state.adminRoute;

  const showCatalogEdit = route === 'catalog-edit' || route === 'catalog' && state.adminProdId;

  return (
    <div style={{ background: '#F2EEE4', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <UtilityBar />
      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', flex: 1, minHeight: 'calc(100vh - 45px)' }}>
        <AdminSidebar />
        <main style={{ padding: '40px 48px', overflowY: 'auto' }}>
          {route === 'dashboard' && <Dashboard />}
          {route === 'catalog' && !state.adminProdId && <Catalog />}
          {(route === 'catalog-edit' || (route === 'catalog' && state.adminProdId)) && <CatalogEdit />}
          {route === 'sales' && <Sales />}
          {route === 'sessions' && <PreOrderSessions />}
          {route === 'podone' && <PreOrderDone />}
          {route === 'finance' && <Finance />}
          {(route === 'sizes' || route === 'colors' || route === 'roles') && <Settings />}
        </main>
      </div>
    </div>
  );
}
