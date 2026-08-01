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
import SessionDetail from './SessionDetail';

import CategoryModal from './CategoryModal';
import ProductModal from './ProductModal';
import SessionModal from './SessionModal';
import ProdSessionModal from './ProdSessionModal';
import PayModal from './PayModal';
import ShipModal from './ShipModal';

export default function AdminLayout() {
  const { state } = useContext(AppContext);
  const route = state.adminRoute;
  const isEditingProduct = route === 'catalog-edit' && !!state.adminProdId;

  return (
    <div style={{ background: '#F2EEE4', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <UtilityBar />
      <style>{`
        .admin-body-grid {
          display: grid;
          grid-template-columns: 220px 1fr; /* sama persis seperti sebelumnya di desktop */
          flex: 1;
          min-height: calc(100vh - 45px);
        }
        .admin-main {
          padding: 40px 48px;
          overflow-y: auto;
        }
        @media (max-width: 768px) {
          .admin-body-grid {
            grid-template-columns: 1fr; /* sidebar jadi overlay, tidak makan ruang kolom lagi */
          }
          .admin-main {
            padding: 20px 16px; /* konten mepet lebar penuh di layar kecil */
          }
        }
      `}</style>
      <div className="admin-body-grid">
        <AdminSidebar />
        <main className="admin-main">
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
      <CategoryModal />
      <ProductModal />
      <SessionModal />
      <ProdSessionModal />
      <PayModal />
      <ShipModal />
    </div>
  );
}