<template>
  <aside class="w-64 bg-gray-950 flex flex-col h-screen sticky top-0 select-none">
    <!-- Logo -->
    <div class="px-5 py-5 border-b border-white/5">
      <RouterLink to="/" class="flex items-center gap-3 group">
        <div class="w-8 h-8 bg-white rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
          <span class="text-gray-900 font-black text-sm">S</span>
        </div>
        <div>
          <p class="text-white font-bold text-sm leading-none">ShopGiayDep</p>
          <p class="text-gray-500 text-[11px] mt-0.5 font-medium">Admin Panel</p>
        </div>
      </RouterLink>
    </div>

    <!-- Nav -->
    <nav class="flex-1 px-3 py-4 overflow-y-auto space-y-0.5">
      <p class="px-3 text-[10px] font-bold text-gray-600 uppercase tracking-[0.15em] mb-3">Menu</p>
      <RouterLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group"
        :class="isActive(item.to)
          ? 'bg-white text-gray-900 shadow-sm'
          : 'text-gray-400 hover:bg-white/10 hover:text-white'"
      >
        <!-- Icon -->
        <span
          class="w-5 h-5 flex-shrink-0 transition-colors"
          :class="isActive(item.to) ? 'text-gray-900' : 'text-gray-500 group-hover:text-white'"
          v-html="item.icon"
        />
        <span class="flex-1">{{ item.label }}</span>
        <!-- Badge -->
        <span
          v-if="item.badge"
          class="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
          :class="isActive(item.to) ? 'bg-gray-900 text-white' : 'bg-white/10 text-gray-400'"
        >
          {{ item.badge }}
        </span>
      </RouterLink>
    </nav>

    <!-- Bottom -->
    <div class="px-3 pb-4 border-t border-white/5 pt-3">
      <RouterLink
        to="/"
        class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-white/10 hover:text-white transition-all"
      >
        <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Về trang shop
      </RouterLink>

      <!-- Logout -->
      <button
        @click="logout"
        class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-rose-500/10 hover:text-rose-400 transition-all mt-1"
      >
        <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        Đăng xuất
      </button>

      <!-- Admin info -->
      <div class="flex items-center gap-3 px-3 py-2.5 mt-1">
        <div class="w-8 h-8 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
          <span class="text-white text-xs font-bold">A</span>
        </div>
        <div class="min-w-0">
          <p class="text-white text-xs font-semibold leading-none">Admin</p>
          <p class="text-gray-500 text-[11px] mt-0.5 truncate">admin@shopgiaydep.vn</p>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useOrderStore } from '@/stores/orders'
import { useAuthStore } from '@/stores/auth'
import { computed } from 'vue'

const route = useRoute()
const router = useRouter()
const orderStore = useOrderStore()
const authStore = useAuthStore()
const pendingCount = computed(() => orderStore.orders.filter(o => o.status === 'pending').length)

function logout() {
  authStore.logout()
  router.push('/admin/login')
}

const navItems = [
  {
    to: '/admin/dashboard',
    label: 'Dashboard',
    icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>',
  },
  {
    to: '/admin/products',
    label: 'Sản phẩm',
    icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>',
  },
  {
    to: '/admin/categories',
    label: 'Danh mục',
    icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>',
  },
  {
    to: '/admin/orders',
    label: 'Đơn hàng',
    icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>',
    badge: pendingCount.value > 0 ? String(pendingCount.value) : undefined,
  },
]

function isActive(path: string) {
  return route.path.startsWith(path)
}
</script>
