<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Breadcrumb -->
    <nav class="text-sm text-gray-500 mb-6 flex items-center gap-2">
      <RouterLink to="/" class="hover:text-gray-900 transition-colors">Trang chủ</RouterLink>
      <span>/</span>
      <span class="text-gray-900 font-medium">{{ pageTitle }}</span>
    </nav>

    <div class="flex gap-8">
      <!-- Filter sidebar -->
      <aside
        class="w-56 flex-shrink-0 hidden md:block"
        :class="{ '!block fixed inset-0 z-40 bg-white overflow-y-auto p-6 w-80': mobileFilterOpen }"
      >
        <!-- Mobile close -->
        <div v-if="mobileFilterOpen" class="flex items-center justify-between mb-6">
          <h2 class="font-semibold text-lg">Bộ lọc</h2>
          <button @click="mobileFilterOpen = false">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="space-y-6">
          <!-- Category -->
          <div>
            <h3 class="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-3">Danh mục</h3>
            <div class="space-y-1">
              <button
                v-for="cat in categoryOptions"
                :key="cat.value"
                @click="setCategory(cat.value)"
                class="w-full text-left px-3 py-1.5 text-sm transition-colors flex items-center justify-between rounded-xl"
                :class="productStore.filters.category === cat.value
                  ? 'bg-gray-900 text-white font-semibold'
                  : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'"
              >
                <span>{{ cat.label }}</span>
                <span class="text-xs text-gray-400">{{ cat.count }}</span>
              </button>
            </div>
          </div>

          <!-- Price range -->
          <div>
            <h3 class="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-3">Giá</h3>
            <div class="space-y-1">
              <button
                v-for="range in priceRanges"
                :key="range.label"
                @click="setPriceRange(range.min, range.max)"
                class="w-full text-left px-3 py-1.5 text-sm transition-colors rounded-xl"
                :class="isActivePriceRange(range.min, range.max)
                  ? 'bg-gray-900 text-white font-semibold'
                  : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'"
              >
                {{ range.label }}
              </button>
            </div>
          </div>

          <!-- Size -->
          <div>
            <h3 class="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-3">Size</h3>
            <div class="flex flex-wrap gap-1.5">
              <button
                v-for="size in allSizes"
                :key="size"
                @click="toggleSize(size)"
                class="w-10 h-10 text-xs border rounded-xl transition-colors font-semibold"
                :class="productStore.filters.sizes.includes(size)
                  ? 'border-gray-900 bg-gray-900 text-white'
                  : 'border-gray-200 text-gray-600 hover:border-gray-600'"
              >
                {{ size }}
              </button>
            </div>
          </div>

          <!-- Reset -->
          <button
            v-if="hasActiveFilters"
            @click="productStore.resetFilters(); setCategory(defaultCategory)"
            class="text-sm text-gray-500 hover:text-gray-900 transition-colors underline"
          >
            Xóa bộ lọc
          </button>
        </div>
      </aside>

      <!-- Main content -->
      <div class="flex-1 min-w-0">
        <!-- Top bar -->
        <div class="flex items-center gap-3 mb-6">
          <!-- Mobile filter btn -->
          <button
            @click="mobileFilterOpen = true"
            class="md:hidden flex items-center gap-2 text-sm border border-gray-200 px-4 py-2 rounded-xl hover:border-gray-900 transition-colors font-medium"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Bộ lọc
          </button>

          <p class="text-sm text-gray-500 mr-auto">
            <span class="font-semibold text-gray-900">{{ productStore.filteredProducts.length }}</span> sản phẩm
          </p>

          <!-- Sort -->
          <select
            :value="productStore.filters.sort"
            @change="e => productStore.setFilter('sort', (e.target as HTMLSelectElement).value as 'newest')"
            class="text-sm border border-gray-200 px-3 py-2 rounded-xl focus:outline-none focus:border-gray-900 bg-white"
          >
            <option value="newest">Mới nhất</option>
            <option value="popular">Phổ biến nhất</option>
            <option value="price-asc">Giá: Thấp đến cao</option>
            <option value="price-desc">Giá: Cao đến thấp</option>
          </select>
        </div>

        <!-- Products grid -->
        <div v-if="productStore.filteredProducts.length > 0" class="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <ProductCard
            v-for="product in productStore.filteredProducts"
            :key="product.id"
            :product="product"
            :showRating="true"
            @quick-add="openQuickAdd"
          />
        </div>

        <!-- Empty -->
        <div v-else class="text-center py-20">
          <p class="text-gray-400 text-lg mb-2">Không tìm thấy sản phẩm nào</p>
          <button @click="productStore.resetFilters" class="text-sm text-gray-600 underline">Xóa bộ lọc</button>
        </div>
      </div>
    </div>

    <!-- Quick Add Modal -->
    <QuickAddModal v-if="quickAddProduct" :product="quickAddProduct" @close="quickAddProduct = null" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useProductStore } from '@/stores/products'
import type { Product } from '@/types'
import ProductCard from '@/components/ProductCard.vue'
import QuickAddModal from '@/components/QuickAddModal.vue'

const productStore = useProductStore()
const route = useRoute()
const mobileFilterOpen = ref(false)
const quickAddProduct = ref<Product | null>(null)

// Set category filter based on route
const defaultCategory = computed(() => {
  const path = route.path
  if (path === '/nam') return 'men'
  if (path === '/nu') return 'women'
  if (path === '/hang-moi') return 'new'
  return ''
})

const pageTitle = computed(() => {
  if (route.query.search) return `Kết quả: "${route.query.search}"`
  const path = route.path
  if (path === '/nam') return 'Giày Nam'
  if (path === '/nu') return 'Giày Nữ'
  if (path === '/hang-moi') return 'Hàng Mới'
  return 'Tất cả sản phẩm'
})

onMounted(async () => {
  productStore.resetFilters()
  if (defaultCategory.value) {
    productStore.setFilter('category', defaultCategory.value)
  }
  // Đọc query param ?search= từ URL (khi navigate từ thanh tìm kiếm)
  if (route.query.search) {
    productStore.setFilter('search' as any, String(route.query.search))
  }
  await productStore.fetchProducts()
})

onUnmounted(() => productStore.resetFilters())

function setCategory(value: string) {
  productStore.setFilter('category', value)
}

function toggleSize(size: string) {
  const sizes = [...productStore.filters.sizes]
  const idx = sizes.indexOf(size)
  if (idx === -1) sizes.push(size)
  else sizes.splice(idx, 1)
  productStore.setFilter('sizes', sizes)
}

function setPriceRange(min: number | null, max: number | null) {
  if (isActivePriceRange(min, max)) {
    productStore.setFilter('minPrice', null)
    productStore.setFilter('maxPrice', null)
  } else {
    productStore.setFilter('minPrice', min)
    productStore.setFilter('maxPrice', max)
  }
}

function isActivePriceRange(min: number | null, max: number | null) {
  return productStore.filters.minPrice === min && productStore.filters.maxPrice === max
}

const hasActiveFilters = computed(() =>
  !!productStore.filters.category ||
  productStore.filters.minPrice !== null ||
  productStore.filters.maxPrice !== null ||
  productStore.filters.sizes.length > 0
)

function openQuickAdd(product: Product) {
  quickAddProduct.value = product
}

const categoryOptions = computed(() => [
  { label: 'Tất cả', value: '', count: productStore.products.length },
  { label: 'Giày Nam', value: 'men', count: productStore.products.filter(p => p.category === 'men').length },
  { label: 'Giày Nữ', value: 'women', count: productStore.products.filter(p => p.category === 'women').length },
  { label: 'Unisex', value: 'unisex', count: productStore.products.filter(p => p.category === 'unisex').length },
  { label: 'Hàng mới', value: 'new', count: productStore.products.filter(p => p.isNew).length },
])

const priceRanges = [
  { label: 'Tất cả giá', min: null, max: null },
  { label: 'Dưới 1.500.000₫', min: null, max: 1500000 },
  { label: '1.500.000 – 2.500.000₫', min: 1500000, max: 2500000 },
  { label: '2.500.000 – 4.000.000₫', min: 2500000, max: 4000000 },
  { label: 'Trên 4.000.000₫', min: 4000000, max: null },
]

const allSizes = ['35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45']
</script>
