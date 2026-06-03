<template>
  <footer class="bg-gray-950 text-gray-300">
    <!-- Main footer -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-10">

        <!-- Brand -->
        <div class="md:col-span-1">
          <div class="flex items-center gap-2.5 mb-4">
            <div class="w-8 h-8 bg-white rounded-xl flex items-center justify-center shadow-sm">
              <span class="text-gray-900 font-black text-sm">S</span>
            </div>
            <span class="font-black text-xl text-white tracking-tight">ShopGiayDep</span>
          </div>
          <p class="text-sm text-gray-500 leading-relaxed">
            Mang đến những đôi giày chất lượng cao từ các thương hiệu hàng đầu thế giới với giá cả hợp lý nhất.
          </p>
          <div class="flex gap-2 mt-5">
            <a href="#" class="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition-colors">
              <span class="text-xs font-bold text-white">f</span>
            </a>
            <a href="#" class="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition-colors">
              <span class="text-xs font-bold text-white">in</span>
            </a>
            <a href="#" class="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition-colors">
              <span class="text-xs font-bold text-white">ig</span>
            </a>
          </div>
        </div>

        <!-- Links -->
        <div v-for="section in footerLinks" :key="section.title">
          <h3 class="font-bold text-white mb-4 text-xs tracking-[0.15em] uppercase">
            {{ section.title }}
          </h3>
          <ul class="space-y-2.5">
            <li v-for="link in section.links" :key="link.label">
              <a href="#" class="text-sm text-gray-500 hover:text-white transition-colors">
                {{ link.label }}
              </a>
            </li>
          </ul>
        </div>

        <!-- Newsletter -->
        <div>
          <h3 class="font-bold text-white mb-4 text-xs tracking-[0.15em] uppercase">Nhận ưu đãi</h3>
          <p class="text-sm text-gray-500 mb-4">Đăng ký để nhận thông tin khuyến mãi mới nhất.</p>
          <div class="flex gap-2">
            <input
              type="email"
              placeholder="Email của bạn"
              class="flex-1 bg-white/5 border border-white/10 text-white text-sm px-4 py-2.5 rounded-xl placeholder-gray-600 focus:outline-none focus:border-white/30 transition-colors"
            />
            <button class="bg-white text-gray-900 text-sm font-bold px-4 py-2.5 rounded-xl hover:bg-gray-100 transition-colors whitespace-nowrap">
              Gửi
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom bar -->
    <div class="border-t border-white/5">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p class="text-xs text-gray-600">
          © 2025 ShopGiayDep. Bảo lưu mọi quyền.
        </p>
        <div class="flex items-center gap-2 text-xs text-gray-600">
          <span>Thanh toán:</span>
          <span class="bg-white/10 px-2.5 py-1 rounded-lg text-gray-400 font-medium">VISA</span>
          <span class="bg-white/10 px-2.5 py-1 rounded-lg text-gray-400 font-medium">MC</span>
          <span class="bg-white/10 px-2.5 py-1 rounded-lg text-gray-400 font-medium">MoMo</span>
          <span class="bg-white/10 px-2.5 py-1 rounded-lg text-gray-400 font-medium">VNPay</span>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const footerLinks = [
  {
    title: 'Mua sắm',
    links: [
      { label: 'Hàng mới về' },
      { label: 'Giày nam' },
      { label: 'Giày nữ' },
      { label: 'Đang giảm giá' },
      { label: 'Tất cả sản phẩm' },
    ],
  },
  {
    title: 'Hỗ trợ',
    links: [
      { label: 'Chính sách đổi trả' },
      { label: 'Hướng dẫn chọn size' },
      { label: 'Theo dõi đơn hàng' },
      { label: 'FAQs' },
      { label: 'Liên hệ' },
    ],
  },
]
</script>
