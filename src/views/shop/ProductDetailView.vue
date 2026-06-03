<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Not found -->
    <div v-if="!product" class="text-center py-24">
      <p class="text-gray-400 text-xl mb-4">Không tìm thấy sản phẩm</p>
      <RouterLink to="/san-pham" class="btn-primary text-sm">Xem tất cả sản phẩm</RouterLink>
    </div>

    <template v-else>
      <!-- Breadcrumb -->
      <nav class="text-sm text-gray-500 mb-6 flex items-center gap-2 flex-wrap">
        <RouterLink to="/" class="hover:text-gray-900 transition-colors">Trang chủ</RouterLink>
        <span>/</span>
        <RouterLink to="/san-pham" class="hover:text-gray-900 transition-colors">Sản phẩm</RouterLink>
        <span>/</span>
        <span class="text-gray-900">{{ product.name }}</span>
      </nav>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <!-- Image gallery -->
        <div class="space-y-3">
          <!-- Main image -->
          <div class="aspect-square bg-gray-100 overflow-hidden rounded-2xl">
            <Transition name="img-fade" mode="out-in">
              <img
                :key="activeImage"
                :src="activeImage"
                :alt="product.name"
                class="w-full h-full object-cover"
              />
            </Transition>
          </div>

          <!-- Thumbnails: ảnh của màu đang chọn (nếu có) + fallback product images -->
          <div class="grid grid-cols-4 gap-2">
            <button
              v-for="(imgUrl, i) in activeColorImages"
              :key="i"
              @click="activeImage = imgUrl"
              class="aspect-square bg-gray-100 overflow-hidden border-2 rounded-xl transition-all"
              :class="activeImage === imgUrl ? 'border-gray-900 scale-105' : 'border-transparent hover:border-gray-300'"
            >
              <img :src="imgUrl" :alt="`${product.name} ${i+1}`" class="w-full h-full object-cover" />
            </button>
          </div>
        </div>

        <!-- Product info -->
        <div>
          <!-- Brand + badges -->
          <div class="flex items-center gap-2 mb-2">
            <span class="text-xs font-semibold text-gray-400 uppercase tracking-widest">{{ product.brand }}</span>
            <span v-if="product.isNew" class="badge-new">MỚI</span>
            <span v-if="product.isSale" class="badge-sale">SALE</span>
          </div>

          <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">{{ product.name }}</h1>

          <!-- Rating -->
          <div class="flex items-center gap-2 mb-4">
            <div class="flex">
              <span v-for="i in 5" :key="i" class="text-lg"
                :class="i <= Math.round(product.rating) ? 'text-amber-400' : 'text-gray-200'"
              >★</span>
            </div>
            <span class="text-sm text-gray-500">{{ product.rating }} ({{ product.reviewCount }} đánh giá)</span>
          </div>

          <!-- Price -->
          <div class="flex items-baseline gap-3 mb-6">
            <span class="text-3xl font-bold text-gray-900">{{ formatPrice(product.price) }}</span>
            <span v-if="product.originalPrice" class="text-lg text-gray-400 line-through">
              {{ formatPrice(product.originalPrice) }}
            </span>
            <span v-if="product.originalPrice" class="text-sm font-medium text-red-600">
              Tiết kiệm {{ discountPercent(product.originalPrice, product.price) }}%
            </span>
          </div>

          <div class="h-px bg-gray-100 mb-6" />

          <!-- Color (with image swatches) -->
          <div class="mb-5">
            <p class="text-sm font-semibold mb-3">
              Màu sắc: <span class="font-normal text-gray-500">{{ selectedColor }}</span>
            </p>
            <div class="flex flex-wrap gap-3">
              <button
                v-for="variant in product.colorVariants"
                :key="variant.color"
                @click="selectColor(variant.color)"
                class="flex flex-col items-center gap-1.5 group"
                :title="variant.color"
              >
                <!-- Ảnh swatch -->
                <div
                  class="w-14 h-16 border-2 rounded-xl overflow-hidden transition-all"
                  :class="selectedColor === variant.color
                    ? 'border-gray-900 shadow-md scale-105'
                    : 'border-transparent hover:border-gray-300'"
                >
                  <img
                    :src="variant.image"
                    :alt="variant.color"
                    class="w-full h-full object-cover"
                  />
                </div>
                <!-- Tên màu -->
                <span
                  class="text-xs transition-colors leading-tight text-center"
                  :class="selectedColor === variant.color ? 'font-semibold text-gray-900' : 'text-gray-500 group-hover:text-gray-700'"
                >
                  {{ variant.color }}
                </span>
              </button>
            </div>
          </div>

          <!-- Size -->
          <div class="mb-6">
            <div class="flex items-center justify-between mb-3">
              <p class="text-sm font-semibold">Chọn size:</p>
              <button class="text-xs text-gray-400 hover:text-gray-700 underline transition-colors">
                Hướng dẫn chọn size
              </button>
            </div>
            <div class="grid grid-cols-5 sm:grid-cols-7 gap-2">
              <button
                v-for="size in product.sizes"
                :key="size"
                @click="selectedSize = size"
                class="py-3 text-sm border rounded-xl transition-colors font-bold"
                :class="selectedSize === size
                  ? 'border-gray-900 bg-gray-900 text-white'
                  : 'border-gray-200 hover:border-gray-600 text-gray-700'"
              >
                {{ size }}
              </button>
            </div>
          </div>

          <!-- Error -->
          <p v-if="error" class="text-red-500 text-sm mb-3">{{ error }}</p>

          <!-- Quantity + Add -->
          <div class="flex gap-3 mb-4">
            <div class="flex items-center border border-gray-200 rounded-xl overflow-hidden">
              <button
                @click="qty > 1 && qty--"
                class="w-11 h-12 text-gray-600 hover:bg-gray-100 transition-colors text-lg"
              >−</button>
              <span class="w-10 text-center text-sm font-bold">{{ qty }}</span>
              <button
                @click="qty++"
                class="w-11 h-12 text-gray-600 hover:bg-gray-100 transition-colors text-lg"
              >+</button>
            </div>
            <button
              @click="handleAddToCart"
              class="flex-1 btn-primary text-sm"
            >
              Thêm vào giỏ hàng
            </button>
          </div>

          <!-- Buy now -->
          <RouterLink to="/thanh-toan" @click="handleBuyNow" class="block btn-outline w-full text-center text-sm mb-6">
            Mua ngay
          </RouterLink>

          <!-- Info -->
          <div class="space-y-2 text-sm text-gray-600 border-t border-gray-100 pt-4">
            <p class="flex items-center gap-2">
              <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              Miễn phí vận chuyển cho đơn từ 500.000₫
            </p>
            <p class="flex items-center gap-2">
              <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              Đổi trả trong 30 ngày
            </p>
            <p class="flex items-center gap-2">
              <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              Hàng chính hãng 100%
            </p>
          </div>

          <!-- Description -->
          <div class="mt-6 border-t border-gray-100 pt-6">
            <h2 class="font-semibold mb-2 text-sm uppercase tracking-wider">Mô tả sản phẩm</h2>
            <p class="text-sm text-gray-600 leading-relaxed">{{ product.description }}</p>
          </div>

          <!-- Available sizes -->
          <div class="mt-4">
            <p class="text-xs text-gray-400">Còn lại: {{ product.stock }} đôi</p>
          </div>
        </div>
      </div>

      <!-- Related products -->
      <div class="mt-16">
        <h2 class="text-2xl font-bold mb-6">Sản phẩm liên quan</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <ProductCard
            v-for="p in relatedProducts"
            :key="p.id"
            :product="p"
            @quick-add="handleQuickAdd"
          />
        </div>
      </div>
    </template>

    <QuickAddModal v-if="quickAddProduct" :product="quickAddProduct" @close="quickAddProduct = null" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useProductStore } from '@/stores/products'
import { useCartStore } from '@/stores/cart'
import type { Product } from '@/types'
import { formatPrice, discountPercent } from '@/utils/format'
import ProductCard from '@/components/ProductCard.vue'
import QuickAddModal from '@/components/QuickAddModal.vue'

const route = useRoute()
const router = useRouter()
const productStore = useProductStore()
const cartStore = useCartStore()

const product = computed(() => productStore.getBySlug(route.params.slug as string))
const activeImage = ref(product.value?.colorVariants[0]?.image ?? product.value?.images[0] ?? '')
const selectedSize = ref(product.value?.sizes[0] ?? '')
const selectedColor = ref(product.value?.colorVariants[0]?.color ?? product.value?.colors[0] ?? '')
const qty = ref(1)
const error = ref('')
const quickAddProduct = ref<Product | null>(null)

// Ảnh gallery của màu đang chọn
const activeColorImages = computed(() => {
  if (!product.value) return []
  const variant = product.value.colorVariants.find(v => v.color === selectedColor.value)
  if (variant?.images && variant.images.length > 0) return variant.images
  if (variant?.image) return [variant.image]
  return product.value.images
})

// Khi chọn màu: cập nhật ảnh gallery + activeImage
function selectColor(color: string) {
  selectedColor.value = color
  const variant = product.value?.colorVariants.find(v => v.color === color)
  if (variant) {
    activeImage.value = variant.image
  }
}

watch(() => product.value, (p) => {
  if (p) {
    const firstVariant = p.colorVariants[0]
    activeImage.value = firstVariant?.image ?? p.images[0]
    selectedSize.value = p.sizes[0]
    selectedColor.value = firstVariant?.color ?? p.colors[0]
  }
})

const relatedProducts = computed(() =>
  product.value
    ? productStore.products
        .filter(p => p.id !== product.value!.id && (p.category === product.value!.category || p.brand === product.value!.brand))
        .slice(0, 4)
    : []
)

function handleAddToCart() {
  if (!selectedSize.value) { error.value = 'Vui lòng chọn size'; return }
  error.value = ''
  cartStore.addItem(product.value!, selectedSize.value, selectedColor.value, qty.value)
}

function handleBuyNow() {
  if (!selectedSize.value) { error.value = 'Vui lòng chọn size'; return }
  error.value = ''
  cartStore.addItem(product.value!, selectedSize.value, selectedColor.value, qty.value)
}

function handleQuickAdd(p: Product) {
  quickAddProduct.value = p
}
</script>

<style scoped>
.img-fade-enter-active,
.img-fade-leave-active {
  transition: opacity 0.25s ease;
}
.img-fade-enter-from,
.img-fade-leave-to {
  opacity: 0;
}
</style>
