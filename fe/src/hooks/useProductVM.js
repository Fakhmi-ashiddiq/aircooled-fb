import { useStore } from '../store';
import { rp } from '../utils/helpers';

const XXL_SIZES = ['XXL', '3L', '4L', '5L', '6L'];

export function isSizeOverXxl(size) {
  if (typeof size !== 'string') return false;
  return XXL_SIZES.includes(size.toUpperCase());
}

export function hasOverXxlSizes(sizes) {
  if (!Array.isArray(sizes)) return false;
  return sizes.some(sz => isSizeOverXxl(sz));
}

export default function useProductVM() {
  const { committedOf } = useStore();

  const getProductVM = (p, selectedSize) => {
    const isPre = p.type === 'preorder';

    const isOverXxl = isSizeOverXxl(selectedSize);
    const curPrice = isOverXxl ? (p.priceMoreXxl || p.price || 0) : (p.priceLessXxl || p.price || 0);
    const curDiscount = isOverXxl ? p.priceMoreXxlDiscount : p.priceLessXxlDiscount;

    const hasDisc = !isPre && curDiscount && curDiscount > curPrice;
    const dpct = hasDisc ? Math.round(((curDiscount - curPrice) / curDiscount) * 100) : 0;

    let lbl = 'Ready Stock';
    if (isPre && p.preorder) {
        lbl = p.preorder.status === 'open' ? 'PRE-ORDER OPEN' : p.preorder.status === 'production' ? 'PRODUKSI' : 'SELESAI';
    }

    return {
      ...p,
      isPreorder: isPre,
      hasDiscount: hasDisc,
      discountPct: dpct,
      priceFmt: rp(curPrice),
      compareFmt: hasDisc ? rp(curDiscount) : '',
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
