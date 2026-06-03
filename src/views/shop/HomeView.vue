<template>
  <div>
    <!-- ── Hero ── -->
    <section class="relative overflow-hidden bg-gray-950 min-h-[90vh] flex items-center">
      <!-- Background image -->
      <img
        src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1600&q=85"
        alt="Hero"
        class="absolute inset-0 w-full h-full object-cover opacity-35 scale-105"
        style="object-position: center 40%"
      />
      <!-- Gradient overlay -->
      <div class="absolute inset-0 bg-gradient-to-r from-gray-950/80 via-gray-950/40 to-transparent" />

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
        <div class="max-w-2xl">
          <div class="inline-flex items-center gap-2 bg-white/10 glass text-white/80 text-xs font-semibold tracking-[0.15em] uppercase px-4 py-2 rounded-full mb-8">
            <span class="w-1.5 h-1.5 bg-rose-400 rounded-full animate-pulse" />
            Bộ sưu tập 2025
          </div>
          <h1 class="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-[1.05] mb-6 tracking-tight">
            Phong cách<br/>
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-400">
              Không giới hạn
            </span>
          </h1>
          <p class="text-gray-300 text-lg sm:text-xl mb-10 leading-relaxed max-w-lg">
            Khám phá bộ sưu tập giày dép mới nhất từ các thương hiệu hàng đầu thế giới.
          </p>
          <div class="flex flex-wrap gap-4">
            <RouterLink to="/hang-moi" class="btn-primary bg-white text-gray-900 hover:bg-gray-100 px-8 py-4 text-base shadow-2xl">
              Mua sắm ngay
            </RouterLink>
            <RouterLink to="/san-pham" class="btn-outline border-white/40 text-white hover:bg-white hover:text-gray-900 px-8 py-4 text-base">
              Xem tất cả
            </RouterLink>
          </div>

          <!-- Stats -->
          <div class="flex gap-8 mt-12 pt-8 border-t border-white/10">
            <div v-for="s in heroStats" :key="s.label">
              <p class="text-2xl font-black text-white">{{ s.value }}</p>
              <p class="text-xs text-gray-400 font-medium mt-0.5">{{ s.label }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Scroll indicator -->
      <div class="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40 animate-bounce">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </section>

    <!-- ── Categories ── -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div class="text-center mb-12">
        <p class="text-xs font-bold tracking-[0.2em] text-gray-400 uppercase mb-2">Danh mục</p>
        <h2 class="text-4xl font-black text-gray-900">Tìm đôi giày của bạn</h2>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <RouterLink
          v-for="cat in categories"
          :key="cat.slug"
          :to="cat.link"
          class="group relative overflow-hidden rounded-3xl aspect-[4/3]"
        >
          <img
            :src="cat.image"
            :alt="cat.label"
            class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <!-- Tag count -->
          <div class="absolute top-4 right-4 bg-white/20 glass text-white text-xs font-semibold px-3 py-1 rounded-full">
            {{ cat.count }} sản phẩm
          </div>
          <div class="absolute bottom-0 left-0 p-6">
            <h3 class="text-white font-black text-2xl mb-1">{{ cat.label }}</h3>
            <span class="inline-flex items-center gap-1.5 text-white/70 text-sm font-medium group-hover:text-white transition-colors">
              Khám phá
              <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </RouterLink>
      </div>
    </section>

    <!-- ── New Arrivals ── -->
    <section class="bg-gray-50 py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-end justify-between mb-10">
          <div>
            <p class="text-xs font-bold tracking-[0.2em] text-gray-400 uppercase mb-1">Vừa về kho</p>
            <h2 class="text-3xl font-black text-gray-900">Hàng mới nhất</h2>
          </div>
          <RouterLink to="/hang-moi" class="btn-ghost font-semibold text-gray-700 flex items-center gap-1">
            Xem tất cả
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </RouterLink>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <ProductCard
            v-for="product in newProducts"
            :key="product.id"
            :product="product"
            :showRating="true"
            @quick-add="openQuickAdd"
          />
        </div>
      </div>
    </section>

    <!-- ── Bestsellers ── -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div class="flex items-end justify-between mb-10">
        <div>
          <p class="text-xs font-bold tracking-[0.2em] text-gray-400 uppercase mb-1">Được yêu thích nhất</p>
          <h2 class="text-3xl font-black text-gray-900">Bán chạy nhất</h2>
        </div>
        <RouterLink to="/san-pham" class="btn-ghost font-semibold text-gray-700 flex items-center gap-1">
          Xem tất cả
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </RouterLink>
      </div>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <ProductCard
          v-for="product in bestsellers"
          :key="product.id"
          :product="product"
          :showRating="true"
          @quick-add="openQuickAdd"
        />
      </div>
    </section>

    <!-- ── Sale banner ── -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
      <div class="relative overflow-hidden rounded-3xl bg-gray-900">
        <img
          src="https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=1200&q=80"
          alt="Sale"
          class="absolute inset-0 w-full h-full object-cover opacity-20"
        />
        <!-- Decorative blobs -->
        <div class="absolute -top-20 -right-20 w-80 h-80 bg-rose-500/20 rounded-full blur-3xl" />
        <div class="absolute -bottom-20 -left-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />

        <div class="relative px-8 py-14 sm:px-16 sm:py-16 flex flex-col sm:flex-row items-center justify-between gap-8">
          <div>
            <span class="badge-sale text-sm px-4 py-1.5 mb-5 inline-flex">SALE UP TO 30%</span>
            <h2 class="text-4xl font-black text-white mb-3">Ưu đãi cuối mùa</h2>
            <p class="text-gray-400 text-lg">Giảm giá lên đến 30% cho hàng trăm mẫu giày chất lượng</p>
          </div>
          <RouterLink to="/san-pham" class="btn-primary bg-white text-gray-900 hover:bg-gray-100 px-10 py-4 text-base shadow-2xl whitespace-nowrap flex-shrink-0">
            Mua ngay →
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- ── Features ── -->
    <section class="border-t border-gray-100 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div v-for="feat in features" :key="feat.title" class="flex flex-col items-center text-center gap-3">
            <div class="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center" v-html="feat.icon" />
            <div>
              <p class="font-bold text-sm text-gray-900">{{ feat.title }}</p>
              <p class="text-xs text-gray-500 mt-0.5">{{ feat.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <QuickAddModal v-if="quickAddProduct" :product="quickAddProduct" @close="quickAddProduct = null" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useProductStore } from '@/stores/products'
import type { Product } from '@/types'
import ProductCard from '@/components/ProductCard.vue'
import QuickAddModal from '@/components/QuickAddModal.vue'

const productStore = useProductStore()
const quickAddProduct = ref<Product | null>(null)

const newProducts = computed(() =>
  productStore.products.filter(p => p.isNew).slice(0, 4)
)
const bestsellers = computed(() =>
  [...productStore.products].sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 4)
)
function openQuickAdd(product: Product) { quickAddProduct.value = product }

const heroStats = [
  { value: '500+', label: 'Mẫu giày' },
  { value: '50K+', label: 'Khách hàng' },
  { value: '4.9★', label: 'Đánh giá' },
]

const categories = [
  { label: 'Giày Nam', slug: 'men', link: '/nam', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80', count: productStore.products.filter(p => p.category === 'men').length },
  { label: 'Giày Nữ', slug: 'women', link: '/nu', image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&q=80', count: productStore.products.filter(p => p.category === 'women').length },
  { label: 'Hàng Mới', slug: 'new', link: '/hang-moi', image: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800&q=80', count: productStore.products.filter(p => p.isNew).length },
]

const features = [
  { title: 'Miễn phí vận chuyển', desc: 'Đơn từ 500.000₫', icon: '<svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>' },
  { title: 'Đổi trả 30 ngày', desc: 'Không cần lý do', icon: '<svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>' },
  { title: 'Hàng chính hãng', desc: '100% authentic', icon: '<svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>' },
  { title: 'Hỗ trợ 24/7', desc: 'Hotline: 1800 1234', icon: '<svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" /></svg>' },
]
</script>
