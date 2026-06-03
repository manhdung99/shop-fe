import api from './axios'
import type { Order } from '@/types'

function mapOrder(o: any): Order {
  return {
    id: String(o.id),
    customerName: o.customerName,
    customerEmail: o.customerEmail,
    customerPhone: o.customerPhone,
    address: o.address,
    note: o.note ?? '',
    status: o.status?.toLowerCase() ?? 'pending',
    total: o.total,
    shippingMethod: o.shippingMethod,
    paymentMethod: o.paymentMethod,
    createdAt: o.createdAt,
    items: (o.items ?? []).map((item: any) => ({
      product: {
        id: String(item.productId),
        name: item.productName,
        images: [item.productImage ?? ''],
        price: item.price,
        slug: '',
        brand: '',
        category: '',
        stock: 0,
        description: '',
        isNew: false,
        isSale: false,
        rating: 0,
        reviewCount: 0,
        sizes: [],
        colorVariants: [],
        colors: [],
      },
      size: item.size,
      color: item.color,
      quantity: item.quantity,
    })),
  }
}

export const orderApi = {
  getAll(params: { status?: string; search?: string; page?: number; size?: number } = {}) {
    return api.get('/orders', { params }).then(res => {
      const page = res.data.data
      return { ...page, content: page.content.map(mapOrder) }
    })
  },

  getById(id: string): Promise<Order> {
    return api.get(`/orders/${id}`).then(res => mapOrder(res.data.data))
  },

  create(data: any): Promise<Order> {
    return api.post('/orders', data).then(res => mapOrder(res.data.data))
  },

  updateStatus(id: string, status: string): Promise<Order> {
    return api.put(`/orders/${id}/status`, { status: status.toUpperCase() })
      .then(res => mapOrder(res.data.data))
  },

  getStats() {
    return api.get('/orders/stats').then(res => res.data.data)
  },
}
