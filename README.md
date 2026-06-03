# ShopGiayDep – Vue 3 + TypeScript + Tailwind CSS

## Cài đặt & chạy dự án

```bash
# 1. Cài dependencies
npm install

# 2. Chạy dev server
npm run dev

# 3. Build production
npm run build
```

## Cấu trúc thư mục

```
src/
├── assets/         # CSS (Tailwind)
├── components/
│   ├── AppHeader.vue
│   ├── AppFooter.vue
│   ├── CartSidebar.vue
│   ├── ProductCard.vue
│   ├── QuickAddModal.vue
│   └── admin/
│       └── AdminSidebar.vue
├── data/
│   └── mockData.ts   # Mock data (thay bằng API call sau)
├── layouts/
│   ├── ShopLayout.vue
│   └── AdminLayout.vue
├── router/
│   └── index.ts
├── stores/           # Pinia stores
│   ├── cart.ts
│   ├── products.ts
│   └── orders.ts
├── types/
│   └── index.ts
├── utils/
│   └── format.ts
└── views/
    ├── shop/
    │   ├── HomeView.vue
    │   ├── NewArrivalsView.vue
    │   ├── MenView.vue
    │   ├── WomenView.vue
    │   ├── ProductListView.vue
    │   ├── ProductDetailView.vue
    │   ├── CartView.vue
    │   └── CheckoutView.vue
    └── admin/
        ├── DashboardView.vue
        ├── ProductsView.vue
        ├── CategoriesView.vue
        └── OrdersView.vue
```

## Routes

| URL                    | Trang                   |
|------------------------|-------------------------|
| `/`                    | Trang chủ               |
| `/hang-moi`            | Hàng mới                |
| `/nam`                 | Giày nam                |
| `/nu`                  | Giày nữ                 |
| `/san-pham`            | Tất cả sản phẩm         |
| `/san-pham/:slug`      | Chi tiết sản phẩm       |
| `/gio-hang`            | Giỏ hàng                |
| `/thanh-toan`          | Thanh toán              |
| `/admin/dashboard`     | Admin – Dashboard       |
| `/admin/products`      | Admin – Sản phẩm CRUD   |
| `/admin/categories`    | Admin – Danh mục        |
| `/admin/orders`        | Admin – Đơn hàng        |

## Kết nối Backend (sau này)

Thay mock data trong `src/data/mockData.ts` bằng API calls.  
Stores trong `src/stores/` sử dụng Pinia – chỉ cần thay `ref([...mockData])` bằng `await fetch(...)`.
"# shop-fe" 
