<template>
  <div class="flex min-h-screen bg-gray-50">
    <AdminSidebar />

    <div class="flex-1 flex flex-col min-w-0">
      <!-- Top bar -->
      <header class="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-20">
        <div>
          <h1 class="text-base font-bold text-gray-900">{{ pageTitle }}</h1>
          <p class="text-xs text-gray-400 mt-0.5">{{ pageSubtitle }}</p>
        </div>
        <div class="flex items-center gap-2">
          <!-- Notification -->
          <button class="relative w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors text-gray-500">
            <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span class="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-rose-500 rounded-full" />
          </button>
          <!-- Avatar -->
          <button class="flex items-center gap-2.5 hover:bg-gray-100 px-3 py-2 rounded-xl transition-colors">
            <div class="w-7 h-7 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
              <span class="text-white text-xs font-bold">A</span>
            </div>
            <span class="text-sm font-semibold text-gray-700 hidden sm:block">Admin</span>
            <svg class="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </header>

      <!-- Content -->
      <main class="flex-1 p-6">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import AdminSidebar from '@/components/admin/AdminSidebar.vue'

const route = useRoute()
const pageMeta: Record<string, { title: string; subtitle: string }> = {
  '/admin/dashboard':  { title: 'Dashboard', subtitle: 'Tổng quan hoạt động kinh doanh' },
  '/admin/products':   { title: 'Quản lý sản phẩm', subtitle: 'Thêm, sửa, xóa sản phẩm' },
  '/admin/categories': { title: 'Quản lý danh mục', subtitle: 'Phân loại sản phẩm' },
  '/admin/orders':     { title: 'Quản lý đơn hàng', subtitle: 'Theo dõi và cập nhật trạng thái đơn hàng' },
}
const pageTitle = computed(() => pageMeta[route.path]?.title ?? 'Admin')
const pageSubtitle = computed(() => pageMeta[route.path]?.subtitle ?? '')
</script>
