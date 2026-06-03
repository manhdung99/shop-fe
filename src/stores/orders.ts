import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Order } from '@/types'
import { mockOrders } from '@/data/mockData'

export const useOrderStore = defineStore('orders', () => {
  const orders = ref<Order[]>([...mockOrders])

  function updateStatus(id: string, status: Order['status']) {
    const order = orders.value.find(o => o.id === id)
    if (order) {
      order.status = status
      order.updatedAt = new Date().toISOString().split('T')[0]
    }
  }

  function addOrder(order: Order) {
    orders.value.unshift(order)
  }

  return { orders, updateStatus, addOrder }
})
