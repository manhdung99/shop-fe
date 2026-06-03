<template>
  <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
    <h1 class="text-2xl font-bold mb-8">Giỏ hàng của bạn</h1>

    <div v-if="cartStore.items.length === 0" class="text-center py-24">
      <div class="w-24 h-24 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
        </svg>
      </div>
      <p class="text-gray-500 mb-6 text-lg">Giỏ hàng của bạn đang trống</p>
      <RouterLink to="/san-pham" class="btn-primary">Tiếp tục mua sắm</RouterLink>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-10">
      <!-- Items -->
      <div class="lg:col-span-2 space-y-4">
        <div
          v-for="item in cartStore.items"
          :key="`${item.product.id}-${item.size}-${item.color}`"
          class="flex gap-4 bg-white border border-gray-100 rounded-2xl p-4"
        >
          <!-- Image -->
          <RouterLink :to="`/san-pham/${item.product.slug}`" class="w-28 h-36 bg-gray-100 flex-shrink-0 block overflow-hidden rounded-xl">
            <img :src="item.product.images[0]" :alt="item.product.name" class="w-full h-full object-cover" />
          </RouterLink>

          <!-- Info -->
          <div class="flex-1 min-w-0">
            <div class="flex justify-between">
              <div>
                <p class="text-xs text-gray-400 uppercase tracking-wider">{{ item.product.brand }}</p>
                <RouterLink :to="`/san-pham/${item.product.slug}`" class="font-medium hover:text-gray-600 transition-colors">
                  {{ item.product.name }}
                </RouterLink>
              </div>
              <button
                @click="cartStore.removeItem(item.product.id, item.size, item.color)"
                class="text-gray-300 hover:text-red-500 transition-colors p-1 flex-shrink-0"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div class="flex gap-3 mt-1 text-sm text-gray-500">
              <span>Size: {{ item.size }}</span>
              <span>·</span>
              <span>{{ item.color }}</span>
            </div>

            <div class="flex items-center justify-between mt-3">
              <!-- Quantity -->
              <div class="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                <button
                  @click="cartStore.updateQuantity(item.product.id, item.size, item.color, item.quantity - 1)"
                  class="w-8 h-8 text-gray-600 hover:bg-gray-100 transition-colors text-lg"
                >−</button>
                <span class="w-8 text-center text-sm font-bold">{{ item.quantity }}</span>
                <button
                  @click="cartStore.updateQuantity(item.product.id, item.size, item.color, item.quantity + 1)"
                  class="w-8 h-8 text-gray-600 hover:bg-gray-100 transition-colors text-lg"
                >+</button>
              </div>
              <span class="font-semibold">{{ formatPrice(item.product.price * item.quantity) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Order summary -->
      <div class="lg:col-span-1">
        <div class="bg-white border border-gray-100 rounded-2xl p-6 sticky top-24 space-y-4">
          <h2 class="font-semibold text-lg border-b border-gray-200 pb-3">Tóm tắt đơn hàng</h2>

          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-600">Tạm tính ({{ cartStore.totalItems }} sản phẩm)</span>
              <span>{{ formatPrice(cartStore.totalPrice) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Phí vận chuyển</span>
              <span :class="shipping === 0 ? 'text-green-600 font-medium' : ''">
                {{ shipping === 0 ? 'Miễn phí' : formatPrice(shipping) }}
              </span>
            </div>
            <div v-if="cartStore.totalPrice < 500000" class="text-xs text-gray-400">
              Thêm {{ formatPrice(500000 - cartStore.totalPrice) }} để được miễn phí ship
            </div>
          </div>

          <!-- Coupon -->
          <div class="flex gap-2">
            <input
              v-model="coupon"
              type="text"
              placeholder="Mã giảm giá"
              class="input-field text-sm"
            />
            <button class="btn-outline text-sm px-4 whitespace-nowrap">Áp dụng</button>
          </div>

          <div class="border-t border-gray-200 pt-3 flex justify-between font-bold text-base">
            <span>Tổng cộng</span>
            <span>{{ formatPrice(cartStore.totalPrice + shipping) }}</span>
          </div>

          <RouterLink to="/thanh-toan" class="block btn-primary text-center w-full text-sm py-4">
            Tiến hành thanh toán
          </RouterLink>

          <RouterLink to="/san-pham" class="block text-center text-sm text-gray-500 hover:text-gray-900 transition-colors">
            ← Tiếp tục mua sắm
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { formatPrice } from '@/utils/format'

const cartStore = useCartStore()
const coupon = ref('')

const shipping = computed(() => cartStore.totalPrice >= 500000 ? 0 : 30000)
</script>
