import { useStore } from '../store';
import { rp } from '../utils/helpers';

export default function useProductVM() {
  const { committedOf } = useStore();

  const getProductVM = (p) => {
    const isPre = p.type === 'preorder';
    const hasDisc = !isPre && p.compareAt > p.price;
    const dpct = hasDisc ? Math.round(((p.compareAt - p.price) / p.compareAt) * 100) : 0;
    
    let lbl = 'Ready Stock';
    if (isPre && p.preorder) {
        lbl = p.preorder.status === 'open' ? 'PRE-ORDER OPEN' : p.preorder.status === 'production' ? 'PRODUKSI' : 'SELESAI';
    }

    return {
      ...p,
      isPreorder: isPre,
      hasDiscount: hasDisc,
      discountPct: dpct,
      priceFmt: rp(p.price),
      compareFmt: p.compareAt ? rp(p.compareAt) : '',
      statusLabel: lbl,
      closes: isPre && p.preorder ? p.preorder.closes : '',
      committed: isPre ? committedOf(p) : 0,
      target: isPre ? (p.target || 0) : 0,
      pct: isPre && p.target ? Math.min(100, Math.round((committedOf(p) / p.target) * 100)) : 0,
      printLogo: p.print === 'logo',
      printText: p.print === 'text'
    };
  };

  return { getProductVM };
}
