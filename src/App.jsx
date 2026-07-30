import React, { useContext } from 'react';
import { AppProvider, AppContext } from './context/AppContext';
import StoreLayout from './components/store/StoreLayout';
import AdminLayout from './components/admin/AdminLayout';

function AppInner() {
  const { state } = useContext(AppContext);
  return state.view === 'admin' ? <AdminLayout /> : <StoreLayout />;
}

export default function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  );
}
