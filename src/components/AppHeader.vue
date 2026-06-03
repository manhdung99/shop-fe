<template>
  <header class="sticky top-0 z-50">
    <!-- Announcement bar -->
    <div class="bg-gray-900 text-white text-xs text-center py-2 tracking-wide">
      🚚 Miễn phí vận chuyển cho đơn từ 500.000₫ &nbsp;·&nbsp; Đổi trả 30 ngày không cần lý do
    </div>

    <!-- Main header -->
    <div class="bg-white/80 glass border-b border-gray-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">

          <!-- Logo -->
          <RouterLink to="/" class="flex items-center gap-2.5 group flex-shrink-0">
            <div class="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center shadow-sm group-hover:shadow transition-shadow">
              <span class="text-white font-black text-sm tracking-tight">S</span>
            </div>
            <span class="font-black text-xl tracking-tight text-gray-900 hidden sm:block">
              ShopGiayDep
            </span>
          </RouterLink>

          <!-- Desktop nav -->
          <nav class="hidden md:flex items-center gap-1">
            <RouterLink
              v-for="link in navLinks"
              :key="link.to"
              :to="link.to"
              class="px-4 py-2 text-sm font-medium rounded-full transition-all duration-150"
              :class="isActive(link.to)
                ? 'bg-gray-900 text-white'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'"
            >
              {{ link.label }}
            </RouterLink>
          </nav>

          <!-- Right actions -->
          <div class="flex items-center gap-1">
            <!-- Search -->
            <button class="btn-ghost p-2.5" aria-label="Tìm kiếm">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </button>

            <!-- Cart -->
            <button
              @click="cartStore.toggleCart"
              class="relative btn-ghost p-2.5"
              aria-label="Giỏ hàng"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75"
                  d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
              </svg>
              <Transition name="pop">
                <span
                  v-if="cartStore.totalItems > 0"
                  class="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full px-1 shadow"
                >
                  {{ cartStore.totalItems > 9 ? '9+' : cartStore.totalItems }}
                </span>
              </Transition>
            </button>

            <!-- Admin -->
            <RouterLink
              to="/admin"
              class="hidden sm:flex btn-ghost items-center gap-1.5 px-3 py-2 text-xs font-semibold text-gray-500"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Admin
            </RouterLink>

            <!-- Mobile menu toggle -->
            <button @click="mobileOpen = !mobileOpen" class="md:hidden btn-ghost p-2.5">
              <svg v-if="!mobileOpen" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile nav -->
      <Transition name="slide-down">
        <div v-if="mobileOpen" class="md:hidden border-t border-gray-100 bg-white">
          <nav class="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-1">
            <RouterLink
              v-for="link in navLinks"
              :key="link.to"
              :to="link.to"
              @click="mobileOpen = false"
              class="px-4 py-3 text-sm font-medium rounded-xl transition-colors"
              :class="isActive(link.to)
                ? 'bg-gray-900 text-white'
                : 'text-gray-700 hover:bg-gray-100'"
            >
              {{ link.label }}
            </RouterLink>
            <RouterLink to="/admin" @click="mobileOpen = false"
              class="px-4 py-3 text-sm font-medium rounded-xl text-gray-400 hover:bg-gray-50 border-t border-gray-100 mt-1 pt-3">
              ⚙ Trang quản trị
            </RouterLink>
          </nav>
        </div>
      </Transition>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useCartStore } from '@/stores/cart'

const cartStore = useCartStore()
const route = useRoute()
const mobileOpen = ref(false)

const navLinks = [
  { label: 'Trang chủ', to: '/' },
  { label: 'Hàng mới', to: '/hang-moi' },
  { label: 'Nam', to: '/nam' },
  { label: 'Nữ', to: '/nu' },
  { label: 'Tất cả', to: '/san-pham' },
]

function isActive(path: string) {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}
</script>

<style scoped>
.slide-down-enter-active, .slide-down-leave-active { transition: all 0.2s ease; }
.slide-down-enter-from, .slide-down-leave-to { opacity: 0; transform: translateY(-6px); }
.pop-enter-active { transition: all 0.2s cubic-bezier(0.34,1.56,0.64,1); }
.pop-enter-from { opacity: 0; transform: scale(0.5); }
</style>
