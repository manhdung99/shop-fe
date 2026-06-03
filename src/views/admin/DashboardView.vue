<template>
  <div class="space-y-6">

    <!-- Stats grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <div
        v-for="stat in stats"
        :key="stat.label"
        class="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-sm transition-shadow"
      >
        <div class="flex items-start justify-between mb-4">
          <div class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" :class="stat.iconBg" v-html="stat.icon" />
          <span class="text-xs font-bold flex items-center gap-0.5 px-2 py-1 rounded-full"
            :class="stat.change >= 0 ? 'text-emerald-700 bg-emerald-50' : 'text-rose-600 bg-rose-50'"
          >
            {{ stat.change >= 0 ? '↑' : '↓' }} {{ Math.abs(stat.change) }}%
          </span>
        </div>
        <p class="text-2xl font-black text-gray-900 mb-0.5">{{ stat.value }}</p>
        <p class="text-xs font-medium text-gray-500">{{ stat.label }}</p>
      </div>
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-3 gap-5">
      <!-- Recent orders -->
      <div class="xl:col-span-2 bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div class="flex items-center justify-between px-5 py-4 border-b border-gray-50">
          <h2 class="font-bold text-gray-900">Đơn hàng gần đây</h2>
          <RouterLink to="/admin/orders" class="text-xs font-semibold text-gray-400 hover:text-gray-700 transition-colors flex items-center gap-1">
            Xem tất cả <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
          </RouterLink>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="bg-gray-50/50">
                <th class="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Mã đơn</th>
                <th class="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Khách hàng</th>
                <th class="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Tổng tiền</th>
                <th class="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Trạng thái</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              <tr v-for="order in recentOrders" :key="order.id" class="hover:bg-gray-50/50 transition-colors">
                <td class="px-5 py-3.5 font-mono text-xs text-gray-500 font-medium">{{ order.id }}</td>
                <td class="px-5 py-3.5 font-semibold text-gray-800">{{ order.customerName }}</td>
                <td class="px-5 py-3.5 font-bold text-gray-900">{{ formatPrice(order.total) }}</td>
                <td class="px-5 py-3.5">
                  <span class="badge-status" :class="statusClass(order.status)">
                    {{ statusLabel(order.status) }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Top products -->
      <div class="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div class="flex items-center justify-between px-5 py-4 border-b border-gray-50">
          <h2 class="font-bold text-gray-900">Bán chạy</h2>
          <RouterLink to="/admin/products" class="text-xs font-semibold text-gray-400 hover:text-gray-700 transition-colors flex items-center gap-1">
            Xem tất cả <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
          </RouterLink>
        </div>
        <div class="divide-y divide-gray-50">
          <div
            v-for="(product, i) in topProducts"
            :key="product.id"
            class="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50/50 transition-colors"
          >
            <span class="text-xs font-black text-gray-300 w-4 flex-shrink-0">{{ i + 1 }}</span>
            <div class="w-9 h-11 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
              <img :src="product.images[0]" :alt="product.name" class="w-full h-full object-cover" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-xs font-bold text-gray-900 truncate leading-snug">{{ product.name }}</p>
              <p class="text-[11px] text-gray-400 mt-0.5">{{ product.reviewCount }} đánh giá</p>
            </div>
            <span class="text-xs font-bold text-gray-900 whitespace-nowrap">{{ formatPrice(product.price) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick actions -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <RouterLink
        v-for="action in quickActions"
        :key="action.label"
        :to="action.to"
        class="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-sm hover:border-gray-200 transition-all flex flex-col items-center gap-3 text-center group"
      >
        <div class="w-11 h-11 rounded-2xl flex items-center justify-center text-xl transition-transform group-hover:scale-110" :class="action.bg">
          {{ action.emoji }}
        </div>
        <span class="text-xs font-bold text-gray-700">{{ action.label }}</span>
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useProductStore } from '@/stores/products'
import { useOrderStore } from '@/stores/orders'
import { formatPrice } from '@/utils/format'

const productStore = useProductStore()
const orderStore = useOrderStore()

const recentOrders = computed(() => orderStore.orders.slice(0, 5))
const topProducts = computed(() =>
  [...productStore.products].sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 5)
)
const totalRevenue = computed(() =>
  orderStore.orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + o.total, 0)
)

const stats = computed(() => [
  {
    label: 'Tổng doanh thu',
    value: formatPrice(totalRevenue.value),
    change: 12.5,
    iconBg: 'bg-emerald-50',
    icon: '<svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>',
  },
  {
    label: 'Tổng đơn hàng',
    value: orderStore.orders.length,
    change: 8.2,
    iconBg: 'bg-blue-50',
    icon: '<svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>',
  },
  {
    label: 'Tổng sản phẩm',
    value: productStore.products.length,
    change: 3.1,
    iconBg: 'bg-violet-50',
    icon: '<svg class="w-5 h-5 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>',
  },
  {
    label: 'Đơn chờ xử lý',
    value: orderStore.orders.filter(o => o.status === 'pending').length,
    change: -5.4,
    iconBg: 'bg-amber-50',
    icon: '<svg class="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>',
  },
])

function statusClass(status: string) {
  return {
    pending:    'bg-amber-50 text-amber-700',
    processing: 'bg-blue-50 text-blue-700',
    shipped:    'bg-violet-50 text-violet-700',
    delivered:  'bg-emerald-50 text-emerald-700',
    cancelled:  'bg-rose-50 text-rose-600',
  }[status] ?? 'bg-gray-100 text-gray-600'
}

function statusLabel(status: string) {
  return { pending: 'Chờ xác nhận', processing: 'Đang xử lý', shipped: 'Đang giao', delivered: 'Đã giao', cancelled: 'Đã hủy' }[status] ?? status
}

const quickActions = [
  { label: 'Thêm sản phẩm', to: '/admin/products', emoji: '➕', bg: 'bg-violet-50' },
  { label: 'Đơn hàng', to: '/admin/orders', emoji: '📦', bg: 'bg-blue-50' },
  { label: 'Danh mục', to: '/admin/categories', emoji: '🏷️', bg: 'bg-amber-50' },
  { label: 'Về shop', to: '/', emoji: '🏪', bg: 'bg-emerald-50' },
]
</script>
