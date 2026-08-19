# Analisis Project Aircooled-FB

## Ringkasan

Project ini adalah **toko online apparel** (kaos, hoodie, topi, dll) dengan merek "Aircooled Syndicate" dan "RDPL", dibangun dengan arsitektur **Laravel 10 (backend API) + React 19 (frontend SPA)**.

## Struktur

```
aircooled-fb/
├── be/          # Laravel 10 + Sanctum (API)
└── fe/          # React 19 + Vite + Zustand
```

## Backend (Laravel 10)

- **PHP ^8.1**, **Laravel ^10.10**, **Sanctum ^3.3**
- **6 Resource API**: Categories, Owners, ColorOptions, SizeSets, Products, Orders
- **6 Model**: Category, Owner, ColorOption, SizeSet, Product, Order
- Semua controller menggunakan CRUD sederhana tanpa validasi
- Tidak ada authentication middleware untuk API (open access)
- Database menggunakan JSON columns untuk `sizes`, `colors`, `costs`, `items`
- Seeder sudah ada data sample (1 produk, 1 order)

### Database Schema (Produk)

| Field | Type | Keterangan |
|-------|------|------------|
| code | string, unique | Kode produk |
| name | string | Nama produk |
| category | string, nullable | Kategori |
| type | enum (ready/preorder) | Tipe penjualan |
| price | integer | Harga jual |
| compare_at | integer, nullable | Harga coret |
| garment_hex | string, nullable | Warna garment |
| print_type | string, nullable | Tipe sablon |
| sizes | json, nullable | Daftar ukuran |
| colors | json, nullable | Daftar warna |
| stock | integer | Stok tersedia |
| sold | integer | Terjual |
| costs | json, nullable | Biaya produksi |
| description | text, nullable | Deskripsi |

### Database Schema (Order)

| Field | Type | Keterangan |
|-------|------|------------|
| code | string, unique | Kode order |
| customer | string | Nama pembeli |
| items | string | Item yang dibeli |
| total | integer | Total harga |
| date | string, nullable | Tanggal order |
| type | enum (ready/preorder) | Tipe order |
| status | string | Status order (default: Awaiting) |

### Routes API

```
GET/POST          /api/categories
GET/PUT/DELETE     /api/categories/{id}
GET/POST          /api/owners
GET/PUT/DELETE     /api/owners/{id}
GET/POST          /api/color-options
GET/PUT/DELETE     /api/color-options/{id}
GET/POST          /api/size-sets
GET/PUT/DELETE     /api/size-sets/{id}
GET/POST          /api/products
GET/PUT/DELETE     /api/products/{id}
GET/POST          /api/orders
GET/PUT/DELETE     /api/orders/{id}
```

## Frontend (React 19)

- **React ^19.2.7**, **Vite ^8.1.1**, **Zustand ^5.0.15**
- **State management**: Zustand (sangat kompleks, ~370 baris store)
- **6 Service API**: Category, Owner, ColorOption, SizeSet, Product, Order (menggunakan axios)
- **Custom hooks**: useReveal, useProductVM, useCountUp

### Halaman Store (Publik)

- `Home` - Landing page
- `Shop` - Daftar produk dengan filter
- `ProductDetail` - Detail produk
- `CartDrawer` - Keranjang belanja
- `Checkout` - Proses checkout
- Modals: SizeGuide, PO (PreOrder), ImageLightbox, Auth

### Halaman Admin

- `Dashboard` - Ringkasan data
- `Catalog` / `CatalogEdit` - Manajemen produk
- `Sales` - Penjualan
- `Finance` - Keuangan
- `PreOrderSessions` / `SessionDetail` / `PreOrderDone` - Sesi pre-order
- `Settings` - Pengaturan
- Modals: ProductModal, CategoryModal, SessionModal, ProdSessionModal, PayModal, ShipModal

### Fitur Yang Sudah Ada

- [ ] Shopping cart (add, change qty)
- [ ] Checkout flow (guest mode)
- [ ] Pre-order system dengan session management
- [ ] Payment tracking (Transfer BCA, VA, dll)
- [ ] Shipping tracking (JNE, resi)
- [ ] Split profit calculation (Syndicate, Creative, Admin, Platform)
- [ ] Admin CRUD untuk semua entitas
- [ ] Product images & gallery
- [ ] Size guide modal
- [ ] Toast notifications
- [ ] Scroll reveal animations
- [ ] Preloader

### State Management (Zustand Store)

Store terbagi menjadi:
1. **Data** - Data dari API (categories, sizeSets, colorOptions, owners, products, orders)
2. **UI State** - State antarmuka (view, route, modals, cart, checkout, dll)
3. **API Fetcher** - Fungsi untuk ambil data dari backend
4. **CRUD Actions** - Fungsi untuk create/update/delete semua entitas
5. **Helpers** - Fungsi pembantu (committedOf, unitsOf, poBuyers, addToCart, dll)

## Masalah / Catatan

### 1. Keamanan (KRITIS)

- **Tidak ada validasi input** di backend - semua controller menggunakan `$request->all()` tanpa validation rules
- **API terbuka** - tidak ada authentication/autorisasi untuk endpoint manapun
- **Tidak ada CSRF protection** pada API calls

### 2. Backend

- **`orders.items` column**: Migration pakai `string` tapi Model cast ke `array` - seharusnya `json`
- **Controller repetitif**: Semua 6 controller CRUD identik, bisa di-refactor ke base controller
- **Tidak ada error handling** yang konsisten
- **Tidak ada pagination** pada index endpoint
- **Tidak ada soft delete** pada model

### 3. Frontend

- **Store masih campuran**: Masih ada `data.js` (data dummy) yang di-load di store, belum sepenuhnya dari database
- **Zustand store sangat panjang** (~370 baris) - pertimbangkan split per domain (productStore, cartStore, adminStore, dll)
- **Tidak ada error handling** yang konsisten pada API calls
- **Tidak ada loading state** yang konsisten
- **Tidak ada TypeScript** - semua file masih JavaScript

### 4. Infrastructure

- **Tidak ada `.env.example`** yang sudah dikonfigurasi untuk frontend
- **Tidak ada Docker/docker-compose** untuk development environment
- **Tidak ada CI/CD** configuration
- **Tidak ada automated testing** yang signifikan

## Rekomendasi Perbaikan

### Prioritas Tinggi

1. Tambahkan validasi input di semua controller
2. Tambahkan authentication middleware untuk admin routes
3. Fix `orders.items` column type dari `string` ke `json`
4. Sembunyikan data dummy dari `data.js` dan gunakan data dari database

### Prioritas Menengah

5. Refactor controller repetitif ke base controller
6. Split Zustand store menjadi beberapa store kecil
7. Tambahkan error handling yang konsisten
8. Tambahkan loading state
9. Tambahkan pagination

### Prioritas Rendah

10. Migrasi ke TypeScript
11. Tambahkan automated testing
12. Setup Docker untuk development
13. Setup CI/CD pipeline
14. Tambahkan logging dan monitoring

---

*Analisis ini dibuat pada: 18 Agustus 2026*
