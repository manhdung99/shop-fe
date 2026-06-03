<template>
  <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
    <h1 class="text-2xl font-bold mb-8">Thanh toán</h1>

    <!-- Steps -->
    <div class="flex items-center gap-2 mb-10 text-sm">
      <span
        v-for="(step, i) in steps"
        :key="step"
        class="flex items-center gap-2"
      >
        <span
          class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2"
          :class="currentStep > i
            ? 'border-gray-900 bg-gray-900 text-white'
            : currentStep === i
            ? 'border-gray-900 text-gray-900'
            : 'border-gray-200 text-gray-400'"
        >
          <template v-if="currentStep > i">✓</template>
          <template v-else>{{ i + 1 }}</template>
        </span>
        <span :class="currentStep === i ? 'font-semibold text-gray-900' : 'text-gray-400'">{{ step }}</span>
        <span v-if="i < steps.length - 1" class="text-gray-300 mx-1">—</span>
      </span>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-10">
      <!-- Form -->
      <div class="lg:col-span-2">

        <!-- Step 1: Shipping info -->
        <div v-if="currentStep === 0" class="space-y-4">
          <h2 class="font-semibold text-lg mb-4">Thông tin giao hàng</h2>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1.5 uppercase tracking-wider">Họ</label>
              <input v-model="form.lastName" type="text" class="input-field" placeholder="Nguyễn" />
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1.5 uppercase tracking-wider">Tên</label>
              <input v-model="form.firstName" type="text" class="input-field" placeholder="Văn An" />
            </div>
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1.5 uppercase tracking-wider">Email</label>
            <input v-model="form.email" type="email" class="input-field" placeholder="email@example.com" />
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1.5 uppercase tracking-wider">Số điện thoại</label>
            <input v-model="form.phone" type="tel" class="input-field" placeholder="0901 234 567" />
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1.5 uppercase tracking-wider">Địa chỉ</label>
            <input v-model="form.address" type="text" class="input-field" placeholder="Số nhà, tên đường" />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1.5 uppercase tracking-wider">Quận/Huyện</label>
              <input v-model="form.district" type="text" class="input-field" placeholder="Quận 1" />
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1.5 uppercase tracking-wider">Tỉnh/Thành phố</label>
              <select v-model="form.city" class="input-field bg-white">
                <option value="">Chọn tỉnh/thành</option>
                <option>TP. Hồ Chí Minh</option>
                <option>Hà Nội</option>
                <option>Đà Nẵng</option>
                <option>Cần Thơ</option>
              </select>
            </div>
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1.5 uppercase tracking-wider">Ghi chú (tùy chọn)</label>
            <textarea v-model="form.note" rows="2" class="input-field resize-none" placeholder="Yêu cầu đặc biệt..."></textarea>
          </div>

          <button @click="currentStep = 1" class="btn-primary w-full mt-2 py-4">
            Tiếp theo: Phương thức giao hàng
          </button>
        </div>

        <!-- Step 2: Shipping method -->
        <div v-if="currentStep === 1" class="space-y-4">
          <h2 class="font-semibold text-lg mb-4">Phương thức giao hàng</h2>

          <div
            v-for="method in shippingMethods"
            :key="method.id"
            @click="selectedShipping = method.id"
            class="flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer transition-colors"
            :class="selectedShipping === method.id ? 'border-gray-900 bg-gray-50' : 'border-gray-200 hover:border-gray-400'"
          >
            <div class="flex items-center gap-3">
              <div
                class="w-4 h-4 border-2 rounded-full flex items-center justify-center"
                :class="selectedShipping === method.id ? 'border-gray-900' : 'border-gray-300'"
              >
                <div v-if="selectedShipping === method.id" class="w-2 h-2 bg-gray-900 rounded-full" />
              </div>
              <div>
                <p class="font-medium text-sm">{{ method.name }}</p>
                <p class="text-xs text-gray-500">{{ method.desc }}</p>
              </div>
            </div>
            <span class="font-semibold text-sm">
              {{ method.price === 0 ? 'Miễn phí' : formatPrice(method.price) }}
            </span>
          </div>

          <div class="flex gap-3 mt-4">
            <button @click="currentStep = 0" class="btn-outline flex-1">← Quay lại</button>
            <button @click="currentStep = 2" class="btn-primary flex-1 py-4">Tiếp theo: Thanh toán</button>
          </div>
        </div>

        <!-- Step 3: Payment -->
        <div v-if="currentStep === 2" class="space-y-4">
          <h2 class="font-semibold text-lg mb-4">Phương thức thanh toán</h2>

          <div
            v-for="method in paymentMethods"
            :key="method.id"
            @click="selectedPayment = method.id"
            class="flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-colors"
            :class="selectedPayment === method.id ? 'border-gray-900 bg-gray-50' : 'border-gray-200 hover:border-gray-400'"
          >
            <div
              class="w-4 h-4 border-2 rounded-full flex items-center justify-center flex-shrink-0"
              :class="selectedPayment === method.id ? 'border-gray-900' : 'border-gray-300'"
            >
              <div v-if="selectedPayment === method.id" class="w-2 h-2 bg-gray-900 rounded-full" />
            </div>
            <span class="text-xl">{{ method.icon }}</span>
            <div>
              <p class="font-medium text-sm">{{ method.name }}</p>
              <p class="text-xs text-gray-500">{{ method.desc }}</p>
            </div>
          </div>

          <!-- COD detail -->
          <div v-if="selectedPayment === 'cod'" class="bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-700">
            Bạn sẽ thanh toán khi nhận hàng. Vui lòng chuẩn bị đúng số tiền.
          </div>

          <div class="flex gap-3 mt-4">
            <button @click="currentStep = 1" class="btn-outline flex-1">← Quay lại</button>
            <button @click="placeOrder" class="btn-primary flex-1 py-4">Đặt hàng</button>
          </div>
        </div>

        <!-- Step 4: Success -->
        <div v-if="currentStep === 3" class="text-center py-12">
          <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 class="text-2xl font-bold mb-2">Đặt hàng thành công!</h2>
          <p class="text-gray-500 mb-2">Mã đơn hàng: <span class="font-semibold text-gray-900">{{ orderId }}</span></p>
          <p class="text-sm text-gray-400 mb-8">Chúng tôi sẽ gửi email xác nhận đến {{ form.email }}</p>
          <RouterLink to="/" class="btn-primary">Tiếp tục mua sắm</RouterLink>
        </div>
      </div>

      <!-- Order summary sidebar -->
      <div v-if="currentStep < 3" class="lg:col-span-1">
        <div class="bg-white border border-gray-100 rounded-2xl p-5 sticky top-24">
          <h3 class="font-semibold mb-4 pb-3 border-b border-gray-200">
            Đơn hàng ({{ cartStore.totalItems }} sản phẩm)
          </h3>
          <div class="space-y-3 mb-4">
            <div
              v-for="item in cartStore.items"
              :key="`${item.product.id}-${item.size}`"
              class="flex gap-3"
            >
              <div class="relative w-14 h-16 bg-gray-100 flex-shrink-0 rounded-xl overflow-hidden">
                <img :src="item.product.images[0]" :alt="item.product.name" class="w-full h-full object-cover" />
                <span class="absolute -top-1.5 -right-1.5 w-5 h-5 bg-gray-700 text-white text-xs rounded-full flex items-center justify-center">
                  {{ item.quantity }}
                </span>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-xs font-medium truncate">{{ item.product.name }}</p>
                <p class="text-xs text-gray-500">Size {{ item.size }}</p>
                <p class="text-xs font-semibold mt-0.5">{{ formatPrice(item.product.price * item.quantity) }}</p>
              </div>
            </div>
          </div>
          <div class="border-t border-gray-200 pt-3 space-y-1.5 text-sm">
            <div class="flex justify-between text-gray-600">
              <span>Tạm tính</span><span>{{ formatPrice(cartStore.totalPrice) }}</span>
            </div>
            <div class="flex justify-between text-gray-600">
              <span>Vận chuyển</span>
              <span class="text-green-600">{{ cartStore.totalPrice >= 500000 ? 'Miễn phí' : formatPrice(30000) }}</span>
            </div>
            <div class="flex justify-between font-bold text-base border-t border-gray-200 pt-2 mt-2">
              <span>Tổng</span><span>{{ formatPrice(finalTotal) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { RouterLink } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { formatPrice } from '@/utils/format'

const cartStore = useCartStore()
const currentStep = ref(0)
const orderId = ref('')
const selectedShipping = ref('standard')
const selectedPayment = ref('cod')

const steps = ['Thông tin', 'Giao hàng', 'Thanh toán', 'Hoàn tất']

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  district: '',
  city: '',
  note: '',
})

const shippingMethods = [
  { id: 'standard', name: 'Giao hàng tiêu chuẩn', desc: '3-5 ngày làm việc', price: 0 },
  { id: 'express', name: 'Giao hàng nhanh', desc: '1-2 ngày làm việc', price: 30000 },
  { id: 'sameday', name: 'Giao trong ngày', desc: 'TP.HCM, Hà Nội (trước 15:00)', price: 60000 },
]

const paymentMethods = [
  { id: 'cod', name: 'Thanh toán khi nhận hàng (COD)', desc: 'Trả tiền mặt khi nhận', icon: '💵' },
  { id: 'momo', name: 'Ví MoMo', desc: 'Thanh toán qua ví điện tử MoMo', icon: '💜' },
  { id: 'vnpay', name: 'VNPay', desc: 'Thẻ ATM nội địa, Visa, Mastercard', icon: '💳' },
  { id: 'bank', name: 'Chuyển khoản ngân hàng', desc: 'MB Bank, VCB, Techcombank...', icon: '🏦' },
]

const shipping = computed(() => cartStore.totalPrice >= 500000 ? 0 : 30000)
const finalTotal = computed(() => cartStore.totalPrice + shipping.value)

function placeOrder() {
  orderId.value = `ORD-${Date.now()}`
  cartStore.clearCart()
  currentStep.value = 3
}
</script>
