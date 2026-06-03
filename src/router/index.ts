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
        {
          path: '',
          name: 'home',
          component: () => import('@/views/shop/HomeView.vue'),
        },
        {
          path: 'hang-moi',
          name: 'new-arrivals',
          component: () => import('@/views/shop/NewArrivalsView.vue'),
        },
        {
          path: 'nam',
          name: 'men',
          component: () => import('@/views/shop/MenView.vue'),
        },
        {
          path: 'nu',
          name: 'women',
          component: () => import('@/views/shop/WomenView.vue'),
        },
        {
          path: 'san-pham',
          name: 'products',
          component: () => import('@/views/shop/ProductListView.vue'),
        },
        {
          path: 'san-pham/:slug',
          name: 'product-detail',
          component: () => import('@/views/shop/ProductDetailView.vue'),
        },
        {
          path: 'gio-hang',
          name: 'cart',
          component: () => import('@/views/shop/CartView.vue'),
        },
        {
          path: 'thanh-toan',
          name: 'checkout',
          component: () => import('@/views/shop/CheckoutView.vue'),
        },
      ],
    },

    // ─── Admin ───────────────────────────────────────────────────────
    {
      path: '/admin',
      component: () => import('@/layouts/AdminLayout.vue'),
      children: [
        {
          path: '',
          redirect: '/admin/dashboard',
        },
        {
          path: 'dashboard',
          name: 'admin-dashboard',
          component: () => import('@/views/admin/DashboardView.vue'),
        },
        {
          path: 'products',
          name: 'admin-products',
          component: () => import('@/views/admin/ProductsView.vue'),
        },
        {
          path: 'categories',
          name: 'admin-categories',
          component: () => import('@/views/admin/CategoriesView.vue'),
        },
        {
          path: 'orders',
          name: 'admin-orders',
          component: () => import('@/views/admin/OrdersView.vue'),
        },
      ],
    },
  ],
})

export default router
