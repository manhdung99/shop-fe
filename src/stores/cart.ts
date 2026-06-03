import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { CartItem, Product } from '@/types'

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([])
  const isOpen = ref(false)

  const totalItems = computed(() =>
    items.value.reduce((sum, item) => sum + item.quantity, 0)
  )

  const totalPrice = computed(() =>
    items.value.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  )

  function addItem(product: Product, size: string, color: string, quantity = 1) {
    const existing = items.value.find(
      i => i.product.id === product.id && i.size === size && i.color === color
    )
    if (existing) {
      existing.quantity += quantity
    } else {
      items.value.push({ product, size, color, quantity })
    }
    isOpen.value = true
  }

  function removeItem(productId: number, size: string, color: string) {
    const idx = items.value.findIndex(
      i => i.product.id === productId && i.size === size && i.color === color
    )
    if (idx !== -1) items.value.splice(idx, 1)
  }

  function updateQuantity(productId: number, size: string, color: string, qty: number) {
    const item = items.value.find(
      i => i.product.id === productId && i.size === size && i.color === color
    )
    if (item) {
      if (qty <= 0) removeItem(productId, size, color)
      else item.quantity = qty
    }
  }

  function clearCart() {
    items.value = []
  }

  function openCart() { isOpen.value = true }
  function closeCart() { isOpen.value = false }
  function toggleCart() { isOpen.value = !isOpen.value }

  return {
    items,
    isOpen,
    totalItems,
    totalPrice,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    openCart,
    closeCart,
    toggleCart,
  }
})
