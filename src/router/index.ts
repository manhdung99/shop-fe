import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior(_, __, savedPosition) {
    if (savedPosition) return savedPosition
    return { top: 0 }
  },
  routes: [
    // ─── Shop (Storefront) ───────────────────────────────────────────
    {
      path: '/',
      component: () => import('@/layouts/ShopLayout.vue'),
      children: [
        { path: '', name: 'home', component: () => import('@/views/shop/HomeView.vue') },
        { path: 'hang-moi', name: 'new-arrivals', component: () => import('@/views/shop/NewArrivalsView.vue') },
        { path: 'nam', name: 'men', component: () => import('@/views/shop/MenView.vue') },
        { path: 'nu', name: 'women', component: () => import('@/views/shop/WomenView.vue') },
        { path: 'san-pham', name: 'products', component: () => import('@/views/shop/ProductListView.vue') },
        { path: 'san-pham/:slug', name: 'product-detail', component: () => import('@/views/shop/ProductDetailView.vue') },
        { path: 'gio-hang', name: 'cart', component: () => import('@/views/shop/CartView.vue') },
        { path: 'thanh-toan', name: 'checkout', component: () => import('@/views/shop/CheckoutView.vue') },
      ],
    },

    // ─── Admin Login (không cần layout admin) ────────────────────────
    {
      path: '/admin/login',
      name: 'admin-login',
      component: () => import('@/views/admin/LoginView.vue'),
    },

    // ─── Admin (cần đăng nhập) ───────────────────────────────────────
    {
      path: '/admin',
      component: () => import('@/layouts/AdminLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        { path: '', redirect: '/admin/dashboard' },
        { path: 'dashboard', name: 'admin-dashboard', component: () => import('@/views/admin/DashboardView.vue') },
        { path: 'products', name: 'admin-products', component: () => import('@/views/admin/ProductsView.vue') },
        { path: 'categories', name: 'admin-categories', component: () => import('@/views/admin/CategoriesView.vue') },
        { path: 'orders', name: 'admin-orders', component: () => import('@/views/admin/OrdersView.vue') },
      ],
    },
  ],
})

// Route guard: bảo vệ admin routes
router.beforeEach((to) => {
  const token = localStorage.getItem('admin_token')
  if (to.meta.requiresAuth && !token) {
    return { name: 'admin-login' }
  }
  // Nếu đã login mà vào trang login → redirect dashboard
  if (to.name === 'admin-login' && token) {
    return { name: 'admin-dashboard' }
  }
})

export default router
