import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import UtilityBar from '../shared/UtilityBar';
import StoreHeader from './StoreHeader';
import StoreFooter from './StoreFooter';
import Home from './Home';
import Shop from './Shop';
import ProductDetail from './ProductDetail';
import Checkout from './Checkout';
import CartDrawer from './CartDrawer';
import AuthModal from './modals/AuthModal';
import POModal from './modals/POModal';
import SizeGuideModal from './modals/SizeGuideModal';
import ImageLightbox from './modals/ImageLightbox';

export default function StoreLayout() {
  const { state } = useContext(AppContext);
  const { route } = state;

  return (
    <div style={{ background: '#F2EEE4', minHeight: '100vh' }}>
      <UtilityBar />
      <StoreHeader />
      
      {route === 'home' && <Home />}
      {route === 'shop' && <Shop />}
      {route === 'product' && <ProductDetail />}
      {route === 'checkout' && <Checkout />}
      
      <StoreFooter />
      
      <CartDrawer />
      <AuthModal />
      <POModal />
      <SizeGuideModal />
      <ImageLightbox />
    </div>
  );
}
