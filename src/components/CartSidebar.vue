<template>
  <!-- Overlay -->
  <Transition name="fade">
    <div
      v-if="cartStore.isOpen"
      class="fixed inset-0 bg-black/40 z-50"
      @click="cartStore.closeCart"
    />
  </Transition>

  <!-- Sidebar -->
  <Transition name="slide-right">
    <div
      v-if="cartStore.isOpen"
      class="fixed top-0 right-0 h-full w-full max-w-sm bg-white z-50 flex flex-col shadow-2xl rounded-l-2xl"
    >
      <!-- Header -->
      <div class="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <h2 class="font-semibold text-lg">
          Giỏ hàng
          <span v-if="cartStore.totalItems > 0" class="text-sm font-normal text-gray-500 ml-1">
            ({{ cartStore.totalItems }} sản phẩm)
          </span>
        </h2>
        <button
          @click="cartStore.closeCart"
          class="p-2 text-gray-400 hover:text-gray-700 transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Empty state -->
      <div v-if="cartStore.items.length === 0" class="flex-1 flex flex-col items-center justify-center text-center px-6">
        <div class="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
          <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
              d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
          </svg>
        </div>
        <p class="text-gray-600 font-medium mb-1">Giỏ hàng của bạn đang trống</p>
        <p class="text-sm text-gray-400 mb-6">Hãy thêm sản phẩm để bắt đầu mua sắm</p>
        <button
          @click="cartStore.closeCart"
          class="btn-primary text-sm"
        >
          Tiếp tục mua sắm
        </button>
      </div>

      <!-- Items list -->
      <div v-else class="flex-1 overflow-y-auto px-5 py-3 space-y-4">
        <div
          v-for="item in cartStore.items"
          :key="`${item.product.id}-${item.size}-${item.color}`"
          class="flex gap-3"
        >
          <!-- Image -->
          <div class="w-20 h-24 bg-gray-100 flex-shrink-0 overflow-hidden rounded-xl">
            <img
              :src="item.product.images[0]"
              :alt="item.product.name"
              class="w-full h-full object-cover"
            />
          </div>

          <!-- Info -->
          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold text-gray-900 truncate">{{ item.product.name }}</p>
            <p class="text-xs text-gray-400 mt-0.5">Size {{ item.size }} · {{ item.color }}</p>
            <p class="text-sm font-bold mt-1">{{ formatPrice(item.product.price) }}</p>

            <!-- Quantity -->
            <div class="flex items-center gap-2 mt-2">
              <button
                @click="cartStore.updateQuantity(item.product.id, item.size, item.color, item.quantity - 1)"
                class="w-7 h-7 rounded-lg border border-gray-200 text-gray-600 hover:border-gray-900 hover:bg-gray-900 hover:text-white text-sm flex items-center justify-center transition-all"
              >−</button>
              <span class="text-sm w-5 text-center font-bold">{{ item.quantity }}</span>
              <button
                @click="cartStore.updateQuantity(item.product.id, item.size, item.color, item.quantity + 1)"
                class="w-7 h-7 rounded-lg border border-gray-200 text-gray-600 hover:border-gray-900 hover:bg-gray-900 hover:text-white text-sm flex items-center justify-center transition-all"
              >+</button>
              <button
                @click="cartStore.removeItem(item.product.id, item.size, item.color)"
                class="ml-auto text-gray-400 hover:text-red-500 transition-colors"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div v-if="cartStore.items.length > 0" class="border-t border-gray-100 px-5 py-4 space-y-3">
        <div class="flex justify-between text-sm">
          <span class="text-gray-500">Tạm tính</span>
          <span class="font-medium">{{ formatPrice(cartStore.totalPrice) }}</span>
        </div>
        <div class="flex justify-between text-sm">
          <span class="text-gray-500">Phí vận chuyển</span>
          <span class="text-green-600 font-medium">{{ cartStore.totalPrice >= 500000 ? 'Miễn phí' : formatPrice(30000) }}</span>
        </div>
        <div class="flex justify-between font-semibold text-base border-t border-gray-100 pt-3">
          <span>Tổng cộng</span>
          <span>{{ formatPrice(finalTotal) }}</span>
        </div>
        <RouterLink
          to="/thanh-toan"
          @click="cartStore.closeCart"
          class="block btn-primary text-center w-full text-sm"
        >
          Thanh toán
        </RouterLink>
        <RouterLink
          to="/gio-hang"
          @click="cartStore.closeCart"
          class="block btn-outline text-center w-full text-sm"
        >
          Xem giỏ hàng
        </RouterLink>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { formatPrice } from '@/utils/format'

const cartStore = useCartStore()

const finalTotal = computed(() => {
  const shipping = cartStore.totalPrice >= 500000 ? 0 : 30000
  return cartStore.totalPrice + shipping
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.25s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.slide-right-enter-active, .slide-right-leave-active {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-right-enter-from, .slide-right-leave-to {
  transform: translateX(100%);
}
</style>
