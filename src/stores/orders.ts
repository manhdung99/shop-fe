import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Order } from '@/types'
import { orderApi } from '@/api/orderApi'

export const useOrderStore = defineStore('orders', () => {
  const orders = ref<Order[]>([])
  const loading = ref(false)
  const error = ref('')
  const totalPages = ref(0)

  async function fetchOrders(params: { status?: string; search?: string; page?: number } = {}) {
    loading.value = true
    error.value = ''
    try {
      const res = await orderApi.getAll({ size: 100, ...params })
      orders.value = res.content
      totalPages.value = res.totalPages
    } catch (e: any) {
      error.value = e.response?.data?.message ?? 'Lỗi tải đơn hàng'
      console.error(e)
    } finally {
      loading.value = false
    }
  }

  async function updateStatus(id: string, status: Order['status']) {
    const updated = await orderApi.updateStatus(id, status)
    const order = orders.value.find(o => o.id === id)
    if (order) {
      order.status = updated.status
    }
  }

  async function addOrder(data: any): Promise<Order> {
    const created = await orderApi.create(data)
    orders.value.unshift(created)
    return created
  }

  return { orders, loading, error, totalPages, fetchOrders, updateStatus, addOrder }
})
