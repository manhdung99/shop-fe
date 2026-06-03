<template>
  <div class="space-y-5">
    <!-- Filter bar -->
    <div class="flex flex-col sm:flex-row gap-3">
      <input
        v-model="search"
        type="text"
        placeholder="Tìm theo mã đơn, tên khách..."
        class="input-field text-sm max-w-xs"
      />
      <div class="flex gap-2 flex-wrap">
        <button
          v-for="tab in statusTabs"
          :key="tab.value"
          @click="filterStatus = tab.value"
          class="px-4 py-2 text-sm font-medium border rounded-xl transition-colors"
          :class="filterStatus === tab.value
            ? 'bg-gray-900 text-white border-gray-900'
            : 'border-gray-200 text-gray-600 hover:border-gray-400'"
        >
          {{ tab.label }}
          <span v-if="tab.count > 0" class="ml-1.5 text-xs opacity-70">({{ tab.count }})</span>
        </button>
      </div>
    </div>

    <!-- Orders table -->
    <div class="bg-white border border-gray-100 rounded-2xl overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-gray-100 bg-gray-50">
              <th class="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Mã đơn</th>
              <th class="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Khách hàng</th>
              <th class="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider hidden md:table-cell">Sản phẩm</th>
              <th class="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Tổng tiền</th>
              <th class="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Trạng thái</th>
              <th class="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider hidden lg:table-cell">Ngày đặt</th>
              <th class="text-right px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Thao tác</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr
              v-for="order in filteredOrders"
              :key="order.id"
              class="hover:bg-gray-50 transition-colors"
            >
              <td class="px-5 py-4 font-mono text-xs font-medium text-gray-700">{{ order.id }}</td>
              <td class="px-5 py-4">
                <p class="font-medium">{{ order.customerName }}</p>
                <p class="text-xs text-gray-400">{{ order.customerPhone }}</p>
              </td>
              <td class="px-5 py-4 hidden md:table-cell">
                <p class="text-xs text-gray-600">{{ order.items.length }} sản phẩm</p>
                <p class="text-xs text-gray-400 truncate max-w-32">
                  {{ order.items.map(i => i.product.name).join(', ') }}
                </p>
              </td>
              <td class="px-5 py-4 font-semibold">{{ formatPrice(order.total) }}</td>
              <td class="px-5 py-4">
                <span
                  class="inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full"
                  :class="statusClass(order.status)"
                >
                  {{ statusLabel(order.status) }}
                </span>
              </td>
              <td class="px-5 py-4 hidden lg:table-cell text-xs text-gray-400">{{ formatDate(order.createdAt) }}</td>
              <td class="px-5 py-4 text-right">
                <div class="flex items-center justify-end gap-1">
                  <button
                    @click="viewOrder(order)"
                    class="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Chi tiết"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  <!-- Status update dropdown -->
                  <select
                    :value="order.status"
                    @change="e => updateStatus(order.id, (e.target as HTMLSelectElement).value as Order['status'])"
                    class="text-xs border border-gray-200 px-2 py-1 rounded-lg bg-white hover:border-gray-400 transition-colors focus:outline-none"
                  >
                    <option value="pending">Chờ xác nhận</option>
                    <option value="processing">Đang xử lý</option>
                    <option value="shipped">Đang giao</option>
                    <option value="delivered">Đã giao</option>
                    <option value="cancelled">Đã hủy</option>
                  </select>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="px-5 py-3 border-t border-gray-100 text-xs text-gray-400">
        Hiển thị {{ filteredOrders.length }} / {{ orderStore.orders.length }} đơn hàng
      </div>
    </div>

    <!-- Order detail modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="selectedOrder" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div class="bg-white w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-2xl">
            <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div>
                <h3 class="font-semibold">Chi tiết đơn hàng</h3>
                <p class="text-xs text-gray-400 font-mono">{{ selectedOrder.id }}</p>
              </div>
              <button @click="selectedOrder = null" class="text-gray-400 hover:text-gray-700">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div class="p-6 space-y-5">
              <!-- Customer info -->
              <div>
                <h4 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Thông tin khách hàng</h4>
                <div class="space-y-1 text-sm">
                  <p><span class="text-gray-500">Tên:</span> <span class="font-medium">{{ selectedOrder.customerName }}</span></p>
                  <p><span class="text-gray-500">Email:</span> {{ selectedOrder.customerEmail }}</p>
                  <p><span class="text-gray-500">SĐT:</span> {{ selectedOrder.customerPhone }}</p>
                  <p><span class="text-gray-500">Địa chỉ:</span> {{ selectedOrder.address }}</p>
                </div>
              </div>

              <!-- Items -->
              <div>
                <h4 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Sản phẩm đặt mua</h4>
                <div class="space-y-2">
                  <div
                    v-for="item in selectedOrder.items"
                    :key="`${item.product.id}-${item.size}`"
                    class="flex items-center gap-3 text-sm"
                  >
                    <img :src="item.product.images[0]" :alt="item.product.name" class="w-10 h-12 object-cover bg-gray-100 rounded-lg" />
                    <div class="flex-1">
                      <p class="font-medium">{{ item.product.name }}</p>
                      <p class="text-xs text-gray-500">Size {{ item.size }} · {{ item.color }} · SL: {{ item.quantity }}</p>
                    </div>
                    <span class="font-semibold">{{ formatPrice(item.product.price * item.quantity) }}</span>
                  </div>
                </div>
              </div>

              <!-- Total -->
              <div class="border-t border-gray-100 pt-4">
                <div class="flex justify-between font-bold">
                  <span>Tổng cộng</span>
                  <span>{{ formatPrice(selectedOrder.total) }}</span>
                </div>
              </div>

              <!-- Status -->
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-500">Trạng thái:</span>
                <span class="px-3 py-1 text-sm font-semibold rounded-full" :class="statusClass(selectedOrder.status)">
                  {{ statusLabel(selectedOrder.status) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useOrderStore } from '@/stores/orders'
import type { Order } from '@/types'
import { formatPrice, formatDate } from '@/utils/format'

const orderStore = useOrderStore()
const search = ref('')
const filterStatus = ref('')
const selectedOrder = ref<Order | null>(null)

const statusTabs = computed(() => [
  { label: 'Tất cả', value: '', count: 0 },
  { label: 'Chờ xác nhận', value: 'pending', count: orderStore.orders.filter(o => o.status === 'pending').length },
  { label: 'Đang xử lý', value: 'processing', count: orderStore.orders.filter(o => o.status === 'processing').length },
  { label: 'Đang giao', value: 'shipped', count: orderStore.orders.filter(o => o.status === 'shipped').length },
  { label: 'Đã giao', value: 'delivered', count: orderStore.orders.filter(o => o.status === 'delivered').length },
  { label: 'Đã hủy', value: 'cancelled', count: orderStore.orders.filter(o => o.status === 'cancelled').length },
])

const filteredOrders = computed(() => {
  return orderStore.orders.filter(o => {
    const matchSearch = !search.value ||
      o.id.includes(search.value) ||
      o.customerName.toLowerCase().includes(search.value.toLowerCase())
    const matchStatus = !filterStatus.value || o.status === filterStatus.value
    return matchSearch && matchStatus
  })
})

function statusClass(status: string) {
  return {
    pending:    'bg-amber-100 text-amber-700',
    processing: 'bg-blue-100 text-blue-700',
    shipped:    'bg-purple-100 text-purple-700',
    delivered:  'bg-green-100 text-green-700',
    cancelled:  'bg-red-100 text-red-600',
  }[status] ?? 'bg-gray-100 text-gray-600'
}

function statusLabel(status: string) {
  return {
    pending:    'Chờ xác nhận',
    processing: 'Đang xử lý',
    shipped:    'Đang giao',
    delivered:  'Đã giao',
    cancelled:  'Đã hủy',
  }[status] ?? status
}

function viewOrder(order: Order) {
  selectedOrder.value = order
}

function updateStatus(id: string, status: Order['status']) {
  orderStore.updateStatus(id, status)
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
