const fs = require('fs');
let txt = fs.readFileSync('fe/src/components/admin/Dashboard.jsx', 'utf8');
txt = txt.replace(/â€”/g, '-');
txt = txt.replace(/â–¼/g, '&#9660;');
fs.writeFileSync('fe/src/components/admin/Dashboard.jsx', txt, 'utf8');
