<template>
  <!-- Overlay -->
  <div class="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" @click.self="$emit('close')">
    <div class="bg-white w-full sm:max-w-md sm:w-full max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl">
      <!-- Header -->
      <div class="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <h3 class="font-semibold">Chọn phiên bản</h3>
        <button @click="$emit('close')" class="p-1 text-gray-400 hover:text-gray-700">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="p-5">
        <!-- Product info -->
        <div class="flex gap-4 mb-5">
          <img :src="product.images[0]" :alt="product.name" class="w-20 h-24 object-cover bg-gray-100 rounded-xl" />
          <div>
            <p class="text-xs text-gray-400 uppercase tracking-wider">{{ product.brand }}</p>
            <p class="font-medium text-sm mt-0.5">{{ product.name }}</p>
            <p class="text-sm font-bold mt-1">{{ formatPrice(product.price) }}</p>
          </div>
        </div>

        <!-- Color -->
        <div class="mb-4">
          <p class="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wider">
            Màu: <span class="font-normal normal-case text-gray-500">{{ selectedColor }}</span>
          </p>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="color in product.colors"
              :key="color"
              @click="selectedColor = color"
              class="px-3 py-1.5 text-xs border rounded-full transition-colors font-medium"
              :class="selectedColor === color
                ? 'border-gray-900 bg-gray-900 text-white'
                : 'border-gray-200 hover:border-gray-600'"
            >
              {{ color }}
            </button>
          </div>
        </div>

        <!-- Size -->
        <div class="mb-6">
          <p class="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wider">Chọn size:</p>
          <div class="grid grid-cols-4 gap-2">
            <button
              v-for="size in product.sizes"
              :key="size"
              @click="selectedSize = size"
              class="py-2.5 text-sm border rounded-xl transition-colors font-bold"
              :class="selectedSize === size
                ? 'border-gray-900 bg-gray-900 text-white'
                : 'border-gray-200 hover:border-gray-600'"
            >
              {{ size }}
            </button>
          </div>
        </div>

        <!-- Error -->
        <p v-if="error" class="text-red-500 text-xs mb-3">{{ error }}</p>

        <!-- Add to cart -->
        <button
          @click="handleAdd"
          class="btn-primary w-full text-sm py-4"
        >
          Thêm vào giỏ hàng
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Product } from '@/types'
import { useCartStore } from '@/stores/cart'
import { formatPrice } from '@/utils/format'

const props = defineProps<{ product: Product }>()
const emit = defineEmits<{ close: [] }>()

const cartStore = useCartStore()
const selectedSize = ref(props.product.sizes[0] ?? '')
const selectedColor = ref(props.product.colors[0] ?? '')
const error = ref('')

function handleAdd() {
  if (!selectedSize.value) {
    error.value = 'Vui lòng chọn size'
    return
  }
  if (!selectedColor.value) {
    error.value = 'Vui lòng chọn màu'
    return
  }
  cartStore.addItem(props.product, selectedSize.value, selectedColor.value)
  emit('close')
}
</script>
