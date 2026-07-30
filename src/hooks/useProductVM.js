import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { rp } from '../utils/helpers';

export default function useProductVM() {
  const { committedOf } = useContext(AppContext);

  const getProductVM = (p) => {
    const isPre = p.type === 'preorder';
    const committed = isPre ? committedOf(p) : 0;
    const target = isPre ? p.preorder.target : 0;
    const pct = isPre ? Math.min(100, Math.round((committed / target) * 100)) : 0;
    
    let statusLabel = '', badgeBg = '#F2C015', badgeFg = '#14110D', badgeLabel = '';
    
    if (isPre) {
      const st = p.preorder.status;
      statusLabel = st === 'open' ? 'PRE-ORDER OPEN' : st === 'production' ? 'PRODUKSI' : 'DITUTUP';
      badgeLabel = 'PRE-ORDER'; 
      badgeBg = '#F2C015'; 
      badgeFg = '#14110D';
    } else {
      badgeLabel = 'READY STOCK'; 
      badgeBg = '#14110D'; 
      badgeFg = '#F2EEE4';
    }
    
    const hasDiscount = !!(p.compareAt && p.compareAt > p.price);
    const discountPct = hasDiscount ? Math.round(((p.compareAt - p.price) / p.compareAt) * 100) : 0;
    
    return {
      ...p,
      isPreorder: isPre,
      priceFmt: rp(p.price),
      hasDiscount,
      discountPct,
      compareFmt: hasDiscount ? rp(p.compareAt) : '',
      printLogo: p.print === 'logo',
      printText: p.print === 'text',
      committed,
      target,
      pct,
      closes: isPre ? p.preorder.closes : '',
      opens: isPre ? p.preorder.opens : '',
      eta: isPre ? p.preorder.eta : '',
      sessionName: isPre ? p.preorder.sessionName : '',
      statusLabel,
      badgeBg,
      badgeFg,
      badgeLabel
    };
  };

  return { getProductVM };
}
