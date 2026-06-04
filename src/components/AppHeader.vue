<template>
  <header class="sticky top-0 z-50">
    <!-- Main header -->
    <div class="bg-white/80 glass border-b border-gray-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">

          <!-- Logo -->
          <RouterLink to="/" class="flex items-center gap-2.5 group flex-shrink-0">
            <!-- Badge icon -->
            <div class="w-9 h-9 flex-shrink-0 transition-transform group-hover:scale-105">
              <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
                <circle cx="32" cy="32" r="32" fill="#F59E0B"/>
                <circle cx="32" cy="32" r="26" fill="#D97706"/>
                <circle cx="32" cy="32" r="21" fill="#1C1917"/>
                <text x="32" y="28" text-anchor="middle" font-family="Arial Black, Arial, sans-serif" font-weight="900" font-size="13" fill="#F59E0B" letter-spacing="1.5">NMD</text>
                <line x1="14" y1="32" x2="50" y2="32" stroke="#F59E0B" stroke-width="0.8" opacity="0.4"/>
                <text x="32" y="42" text-anchor="middle" font-family="Arial, sans-serif" font-size="7" fill="#FCD34D" letter-spacing="0.5">nmd.vn</text>
              </svg>
            </div>
            <!-- Text -->
            <div class="hidden sm:flex flex-col leading-none">
              <span class="font-black text-base tracking-wide text-gray-900">GIAY<span class="text-amber-500">NMD</span></span>
              <span class="text-[9px] tracking-widest text-gray-400 font-medium mt-0.5">THƯƠNG HIỆU GIÀY HÀNG ĐẦU VIỆT NAM</span>
            </div>
          </RouterLink>

          <!-- Desktop nav -->
          <nav class="hidden md:flex items-center gap-1">
            <RouterLink v-for="link in navLinks" :key="link.to" :to="link.to"
              class="px-4 py-2 text-sm font-medium rounded-full transition-all duration-150"
              :class="isActive(link.to) ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'">
              {{ link.label }}
            </RouterLink>
          </nav>

          <!-- Right actions -->
          <div class="flex items-center gap-1">
            <!-- Search toggle -->
            <button
              @click="toggleSearch"
              class="btn-ghost p-2.5 transition-colors"
              :class="searchOpen ? 'text-gray-900 bg-gray-100 rounded-xl' : ''"
              aria-label="Tìm kiếm"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </button>

            <!-- Cart -->
            <button @click="cartStore.toggleCart" class="relative btn-ghost p-2.5" aria-label="Giỏ hàng">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75"
                  d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
              </svg>
              <Transition name="pop">
                <span v-if="cartStore.totalItems > 0"
                  class="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full px-1 shadow">
                  {{ cartStore.totalItems > 9 ? '9+' : cartStore.totalItems }}
                </span>
              </Transition>
            </button>

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

      <!-- Search bar (slide down) -->
      <Transition name="slide-down">
        <div v-if="searchOpen" class="border-t border-gray-100 bg-white/95 glass">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div class="relative max-w-xl mx-auto">
              <!-- Input -->
              <input
                ref="searchInputRef"
                v-model="searchQuery"
                @input="onSearchInput"
                @keydown.enter="goToSearch"
                @keydown.escape="closeSearch"
                type="text"
                placeholder="Tìm kiếm giày, thương hiệu..."
                class="w-full pl-10 pr-10 py-2.5 bg-gray-100 rounded-xl text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-gray-900/10 transition-all"
              />
              <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <button v-if="searchQuery" @click="searchQuery = ''; searchResults = []"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Search results dropdown -->
            <div v-if="searchQuery.length >= 1" class="max-w-xl mx-auto mt-2 bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden">
              <!-- Loading -->
              <div v-if="searching" class="px-4 py-3 text-sm text-gray-400 flex items-center gap-2">
                <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                Đang tìm...
              </div>

              <!-- Results -->
              <template v-else-if="searchResults.length > 0">
                <RouterLink
                  v-for="product in searchResults"
                  :key="product.id"
                  :to="`/san-pham/${product.slug}`"
                  @click="closeSearch"
                  class="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors group"
                >
                  <div class="w-10 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    <img
                      :src="product.images?.[0] || product.colorVariants?.[0]?.image"
                      :alt="product.name"
                      class="w-full h-full object-cover"
                    />
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider">{{ product.brand }}</p>
                    <p class="text-sm font-semibold text-gray-900 truncate group-hover:text-gray-600 transition-colors">{{ product.name }}</p>
                  </div>
                  <span class="text-sm font-bold text-gray-900 whitespace-nowrap">{{ formatPrice(product.price) }}</span>
                </RouterLink>

                <!-- Xem tất cả kết quả -->
                <button
                  @click="goToSearch"
                  class="w-full px-4 py-3 text-sm font-semibold text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors border-t border-gray-50 text-center"
                >
                  Xem tất cả kết quả cho "<span class="text-gray-900">{{ searchQuery }}</span>"
                  <svg class="w-3.5 h-3.5 inline ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </template>

              <!-- No results -->
              <div v-else class="px-4 py-4 text-center">
                <p class="text-sm text-gray-500">Không tìm thấy sản phẩm nào cho "<span class="font-semibold">{{ searchQuery }}</span>"</p>
                <p class="text-xs text-gray-400 mt-1">Thử tìm kiếm với từ khóa khác</p>
              </div>
            </div>
          </div>
        </div>
      </Transition>

      <!-- Mobile nav -->
      <Transition name="slide-down">
        <div v-if="mobileOpen" class="md:hidden border-t border-gray-100 bg-white">
          <nav class="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-1">
            <RouterLink v-for="link in navLinks" :key="link.to" :to="link.to" @click="mobileOpen = false"
              class="px-4 py-3 text-sm font-medium rounded-xl transition-colors"
              :class="isActive(link.to) ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-100'">
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

  <!-- Overlay khi search mở -->
  <Transition name="fade-overlay">
    <div
      v-if="searchOpen"
      class="fixed inset-0 bg-black/20 z-40"
      @click="closeSearch"
    />
  </Transition>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { productApi } from '@/api/productApi'
import { formatPrice } from '@/utils/format'
import type { Product } from '@/types'

const cartStore = useCartStore()
const route  = useRoute()
const router = useRouter()

const mobileOpen    = ref(false)
const searchOpen    = ref(false)
const searchQuery   = ref('')
const searchResults = ref<Product[]>([])
const searching     = ref(false)
const searchInputRef = ref<HTMLInputElement | null>(null)

let debounceTimer: ReturnType<typeof setTimeout> | null = null

const navLinks = [
  { label: 'Trang chủ', to: '/' },
  { label: 'Hàng mới',  to: '/hang-moi' },
  { label: 'Nam',       to: '/nam' },
  { label: 'Nữ',        to: '/nu' },
  { label: 'Tất cả',   to: '/san-pham' },
]

function isActive(path: string) {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}

function toggleSearch() {
  searchOpen.value = !searchOpen.value
  if (searchOpen.value) {
    nextTick(() => searchInputRef.value?.focus())
  } else {
    clearSearch()
  }
}

function closeSearch() {
  searchOpen.value = false
  clearSearch()
}

function clearSearch() {
  searchQuery.value  = ''
  searchResults.value = []
}

function onSearchInput() {
  if (debounceTimer) clearTimeout(debounceTimer)
  const q = searchQuery.value.trim()
  if (!q) { searchResults.value = []; return }

  debounceTimer = setTimeout(() => doSearch(q), 300)
}

async function doSearch(q: string) {
  searching.value = true
  try {
    const res = await productApi.getAll({ search: q, size: 6, sort: 'newest' })
    searchResults.value = res.content
  } catch {
    searchResults.value = []
  } finally {
    searching.value = false
  }
}

function goToSearch() {
  if (!searchQuery.value.trim()) return
  router.push({ path: '/san-pham', query: { search: searchQuery.value.trim() } })
  closeSearch()
}
</script>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.2s ease;
}
.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

.fade-overlay-enter-active,
.fade-overlay-leave-active {
  transition: opacity 0.2s ease;
}
.fade-overlay-enter-from,
.fade-overlay-leave-to {
  opacity: 0;
}

.pop-enter-active {
  transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.pop-enter-from {
  opacity: 0;
  transform: scale(0.5);
}
</style>
