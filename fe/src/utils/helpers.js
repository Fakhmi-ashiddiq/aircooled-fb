export const rp = (n) => { 
  if (n == null) return 'Rp 0';
  return 'Rp ' + Math.round(n).toLocaleString('id-ID'); 
};

export const slugify = (s) => { 
  return (s || '').toLowerCase().trim().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'') || 'produk'; 
};

export const normStage = (s) => { 
  return s === 'closed' ? 'done' : (s || 'open'); 
};

export const stageOrder = () => { 
  return ['open', 'production', 'shipping', 'done']; 
};

export const stageRank = (s) => { 
  return stageOrder().indexOf(normStage(s)); 
};
