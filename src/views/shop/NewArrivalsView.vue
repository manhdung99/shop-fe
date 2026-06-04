<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Breadcrumb -->
    <nav class="text-sm text-gray-500 mb-6 flex items-center gap-2">
      <RouterLink to="/" class="hover:text-gray-900 transition-colors">Trang chủ</RouterLink>
      <span>/</span>
      <span class="text-gray-900 font-medium">Hàng mới nhất</span>
    </nav>

    <!-- Header -->
    <div class="mb-8">
      <p class="text-xs font-bold tracking-[0.2em] text-gray-400 uppercase mb-1">Vừa về kho</p>
      <h1 class="text-3xl font-black text-gray-900">Hàng mới nhất</h1>
      <p class="text-sm text-gray-500 mt-1">
        {{ loading ? 'Đang tải...' : `${productStore.totalElements} sản phẩm mới nhất` }}
      </p>
    </div>

    <!-- Sort bar -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex gap-2 flex-wrap">
        <button
          v-for="s in sortOptions"
          :key="s.value"
          @click="changeSort(s.value)"
          class="px-4 py-2 text-sm rounded-xl border transition-colors font-medium"
          :class="currentSort === s.value
            ? 'bg-gray-900 text-white border-gray-900'
            : 'border-gray-200 text-gray-600 hover:border-gray-400'"
        >
          {{ s.label }}
        </button>
      </div>
      <p class="text-xs text-gray-400 hidden sm:block">Hiển thị {{ products.length }} sản phẩm</p>
    </div>

    <!-- Loading skeleton -->
    <div v-if="loading" class="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
      <div v-for="i in 8" :key="i" class="animate-pulse">
        <div class="bg-gray-100 rounded-2xl aspect-[3/4] mb-3" />
        <div class="h-3 bg-gray-100 rounded-full w-2/3 mb-2" />
        <div class="h-4 bg-gray-100 rounded-full w-full mb-2" />
        <div class="h-3 bg-gray-100 rounded-full w-1/3" />
      </div>
    </div>

    <!-- Product grid -->
    <div v-else-if="products.length > 0" class="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
      <ProductCard
        v-for="product in products"
        :key="product.id"
        :product="product"
        :showRating="true"
        @quick-add="openQuickAdd"
      />
    </div>

    <!-- Empty -->
    <div v-else class="text-center py-24">
      <p class="text-gray-400 text-lg mb-4">Chưa có sản phẩm nào</p>
      <RouterLink to="/san-pham" class="btn-primary text-sm">Xem tất cả sản phẩm</RouterLink>
    </div>

    <QuickAddModal v-if="quickAddProduct" :product="quickAddProduct" @close="quickAddProduct = null" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useProductStore } from '@/stores/products'
import type { Product } from '@/types'
import ProductCard from '@/components/ProductCard.vue'
import QuickAddModal from '@/components/QuickAddModal.vue'

const productStore = useProductStore()
const quickAddProduct = ref<Product | null>(null)
const currentSort = ref('newest')
const loading = computed(() => productStore.loading)
const products = computed(() => productStore.products)

const sortOptions = [
  { label: 'Mới nhất', value: 'newest' },
  { label: 'Phổ biến nhất', value: 'popular' },
  { label: 'Giá thấp → cao', value: 'price-asc' },
  { label: 'Giá cao → thấp', value: 'price-desc' },
]

async function fetchNewArrivals(sort = 'newest') {
  // Lấy 40 sản phẩm mới nhất, không filter isNew
  productStore.resetFilters()
  await productStore.fetchProducts({ size: 40, sort })
}

async function changeSort(sort: string) {
  currentSort.value = sort
  await fetchNewArrivals(sort)
}

function openQuickAdd(product: Product) {
  quickAddProduct.value = product
}

onMounted(() => fetchNewArrivals())
</script>
