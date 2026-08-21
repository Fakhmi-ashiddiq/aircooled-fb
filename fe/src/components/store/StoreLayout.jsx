import React, { useContext } from 'react';
import { useStore } from '../../store';
import UtilityBar from '../shared/UtilityBar';
import StoreHeader from './StoreHeader';
import StoreFooter from './StoreFooter';
import Home from './Home';
import Shop from './Shop';
import ProductDetail from './ProductDetail';
import Checkout from './Checkout';
import InvoiceTrack from './InvoiceTrack';
import CartDrawer from './CartDrawer';
import AuthModal from './modals/AuthModal';
import POModal from './modals/POModal';
import SizeGuideModal from './modals/SizeGuideModal';
import ImageLightbox from './modals/ImageLightbox';
import Preloader from '../shared/Preloader';
import ScrollToTop from '../shared/ScrollToTop';

export default function StoreLayout() {
  const { state } = useStore();
  const { route } = state;

  return (
    <div style={{ background: '#F2EEE4', minHeight: '100vh' }}>
      <Preloader />
      <UtilityBar />
      <StoreHeader />

      {route === 'home' && <Home />}
      {route === 'shop' && <Shop />}
      {route === 'product' && <ProductDetail />}
      {route === 'checkout' && <Checkout />}
      {route.startsWith('invoice/') && <InvoiceTrack />}

      <StoreFooter />

      <CartDrawer />
      <AuthModal />
      <POModal />
      <SizeGuideModal />
      <ImageLightbox />
      <ScrollToTop />
    </div>
  );
}
