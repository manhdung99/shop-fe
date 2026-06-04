<template>
  <div class="space-y-5">
    <!-- Toolbar -->
    <div class="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
      <div class="flex gap-2 flex-1 max-w-sm">
        <input v-model="search" type="text" placeholder="Tìm sản phẩm..." class="input-field text-sm" />
      </div>
      <div class="flex gap-2 flex-wrap">
        <select v-model="filterCat" class="input-field text-sm bg-white">
          <option value="">Tất cả danh mục</option>
          <option value="men">Nam</option>
          <option value="women">Nữ</option>
          <option value="unisex">Unisex</option>
        </select>

        <!-- Download file mẫu -->
        <a
          href="/san_pham_mau.xlsx"
          download
          class="flex items-center gap-1.5 text-sm border border-gray-200 px-3 py-2 rounded-xl hover:border-gray-400 transition-colors font-medium text-gray-600"
          title="Tải file Excel mẫu"
        >
          <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          File mẫu
        </a>

        <!-- Import Excel -->
        <button
          @click="triggerImport"
          :disabled="importing"
          class="flex items-center gap-1.5 text-sm border border-gray-200 px-3 py-2 rounded-xl hover:border-emerald-500 hover:text-emerald-600 transition-colors font-medium text-gray-600 disabled:opacity-50"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          {{ importing ? 'Đang import...' : 'Import Excel' }}
        </button>
        <input ref="importFileRef" type="file" accept=".xlsx,.xls" class="hidden" @change="handleImport" />

        <button @click="openModal()" class="btn-primary text-sm flex items-center gap-2 whitespace-nowrap">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Thêm sản phẩm
        </button>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white border border-gray-100 rounded-2xl overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-gray-100 bg-gray-50">
              <th class="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider w-12">#</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Sản phẩm</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider hidden md:table-cell">Danh mục</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Giá</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider hidden sm:table-cell">Màu sắc</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider hidden sm:table-cell">Tồn kho</th>
              <th class="text-right px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Thao tác</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-for="product in filteredProducts" :key="product.id" class="hover:bg-gray-50 transition-colors">
              <td class="px-4 py-3 text-gray-400 text-xs">{{ product.id }}</td>
              <td class="px-4 py-3">
                <div class="flex items-center gap-3">
                  <!-- Hiển thị ảnh thumbnail theo màu đầu tiên -->
                  <div class="relative w-10 h-12 flex-shrink-0">
                    <img
                      :src="product.colorVariants[0]?.image || product.images[0]"
                      :alt="product.name"
                      class="w-full h-full object-cover bg-gray-100 rounded-lg"
                    />
                  </div>
                  <div>
                    <p class="font-medium text-gray-900 leading-snug">{{ product.name }}</p>
                    <p class="text-xs text-gray-400">{{ product.brand }}</p>
                  </div>
                </div>
              </td>
              <td class="px-4 py-3 hidden md:table-cell">
                <span class="inline-flex items-center px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full font-medium">
                  {{ categoryLabel(product.category) }}
                </span>
              </td>
              <td class="px-4 py-3 font-medium">
                <div>
                  {{ formatPrice(product.price) }}
                  <span v-if="product.originalPrice" class="block text-xs text-gray-400 line-through">
                    {{ formatPrice(product.originalPrice) }}
                  </span>
                </div>
              </td>
              <!-- Color previews -->
              <td class="px-4 py-3 hidden sm:table-cell">
                <div class="flex gap-1 flex-wrap">
                  <div
                    v-for="cv in product.colorVariants.slice(0, 4)"
                    :key="cv.color"
                    class="w-7 h-8 border border-gray-200 rounded-md overflow-hidden"
                    :title="cv.color"
                  >
                    <img :src="cv.image" :alt="cv.color" class="w-full h-full object-cover" />
                  </div>
                  <span v-if="product.colorVariants.length > 4" class="text-xs text-gray-400 self-center ml-1">
                    +{{ product.colorVariants.length - 4 }}
                  </span>
                </div>
              </td>
              <td class="px-4 py-3 hidden sm:table-cell">
                <span class="text-xs font-medium"
                  :class="product.stock > 20 ? 'text-green-600' : product.stock > 5 ? 'text-amber-500' : 'text-red-500'">
                  {{ product.stock }} đôi
                </span>
              </td>
              <td class="px-4 py-3 text-right">
                <div class="flex items-center justify-end gap-2">
                  <button @click="openModal(product)" class="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Chỉnh sửa">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button @click="deleteProduct(product.id)" class="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Xóa">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="px-4 py-3 border-t border-gray-100 text-xs text-gray-400">
        Hiển thị {{ filteredProducts.length }} / {{ productStore.products.length }} sản phẩm
      </div>
    </div>

    <!-- ═══════════ PRODUCT MODAL ═══════════ -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showModal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div class="bg-white w-full max-w-3xl max-h-[92vh] overflow-y-auto flex flex-col rounded-2xl">

            <!-- Modal header -->
            <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
              <h3 class="font-semibold text-lg">
                {{ editingProduct ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới' }}
              </h3>
              <button @click="showModal = false" class="p-2 text-gray-400 hover:text-gray-700 transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Modal body -->
            <div class="p-6 space-y-6 flex-1">

              <!-- ── Thông tin cơ bản ── -->
              <section>
                <h4 class="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <span class="w-5 h-5 bg-gray-900 text-white flex items-center justify-center text-xs">1</span>
                  Thông tin cơ bản
                </h4>
                <div class="grid grid-cols-2 gap-4">
                  <div class="col-span-2">
                    <label class="label-sm">Tên sản phẩm *</label>
                    <input v-model="form.name" type="text" class="input-field" placeholder="Nike Air Max 270" />
                  </div>
                  <div>
                    <label class="label-sm">Thương hiệu *</label>
                    <input v-model="form.brand" type="text" class="input-field" placeholder="Nike" />
                  </div>
                  <div>
                    <label class="label-sm">Danh mục *</label>
                    <select v-model="form.category" class="input-field bg-white">
                      <option value="men">Giày Nam</option>
                      <option value="women">Giày Nữ</option>
                      <option value="unisex">Unisex</option>
                      <option value="kids">Trẻ em</option>
                    </select>
                  </div>
                  <div>
                    <label class="label-sm">Giá bán *</label>
                    <input v-model.number="form.price" type="number" class="input-field" placeholder="2850000" />
                  </div>
                  <div>
                    <label class="label-sm">Giá gốc (nếu có sale)</label>
                    <input v-model.number="form.originalPrice" type="number" class="input-field" placeholder="3500000" />
                  </div>
                  <div>
                    <label class="label-sm">Tồn kho (đôi)</label>
                    <input v-model.number="form.stock" type="number" class="input-field" placeholder="50" />
                  </div>
                  <div class="col-span-2">
                    <label class="label-sm">Mô tả sản phẩm</label>
                    <textarea v-model="form.description" rows="2" class="input-field resize-none" placeholder="Mô tả ngắn về sản phẩm..." />
                  </div>
                  <div>
                    <label class="label-sm">Sizes (cách nhau dấu phẩy)</label>
                    <input v-model="form.sizes" type="text" class="input-field" placeholder="38,39,40,41,42" />
                  </div>
                  <div class="flex items-center gap-6 pt-5">
                    <label class="flex items-center gap-2 cursor-pointer">
                      <input v-model="form.isNew" type="checkbox" class="w-4 h-4 accent-gray-900" />
                      <span class="text-sm font-medium">Hàng mới</span>
                    </label>
                    <label class="flex items-center gap-2 cursor-pointer">
                      <input v-model="form.isSale" type="checkbox" class="w-4 h-4 accent-gray-900" />
                      <span class="text-sm font-medium">Đang sale</span>
                    </label>
                  </div>
                </div>
              </section>

              <!-- ── Màu sắc & Ảnh ── -->
              <section>
                <h4 class="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <span class="w-5 h-5 bg-gray-900 text-white flex items-center justify-center text-xs">2</span>
                  Màu sắc & Ảnh sản phẩm
                  <span class="text-gray-400 font-normal normal-case ml-1 text-xs">– mỗi màu 1 ảnh riêng</span>
                </h4>

                <div class="space-y-3">
                  <!-- Color variant rows -->
                  <div
                    v-for="(variant, idx) in form.colorVariants"
                    :key="idx"
                    class="border border-gray-200 hover:border-gray-300 transition-colors"
                  >
                    <!-- Row header -->
                    <div class="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-200">
                      <span class="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Màu {{ idx + 1 }}
                        <span v-if="variant.color" class="font-normal text-gray-800 normal-case ml-1">– {{ variant.color }}</span>
                      </span>
                      <button
                        v-if="form.colorVariants.length > 1"
                        @click="removeVariant(idx)"
                        class="text-gray-400 hover:text-red-500 transition-colors p-0.5 flex items-center gap-1 text-xs"
                        title="Xóa màu này"
                      >
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Xóa
                      </button>
                    </div>

                    <div class="p-4 flex gap-4 items-start">
                      <!-- Upload zone + Preview -->
                      <div class="flex-shrink-0">
                        <!-- Hidden file input -->
                        <input
                          :ref="el => { if(el) fileInputRefs[idx] = el as HTMLInputElement }"
                          type="file"
                          accept="image/*"
                          class="hidden"
                          @change="onFileChange(idx, $event)"
                        />

                        <!-- Preview box / upload trigger -->
                        <button
                          type="button"
                          @click="triggerFileInput(idx)"
                          class="w-28 h-36 border-2 border-dashed border-gray-300 hover:border-gray-500 bg-gray-50 hover:bg-gray-100 transition-all flex flex-col items-center justify-center gap-2 overflow-hidden relative group"
                          :title="variant.image ? 'Đổi ảnh' : 'Tải ảnh lên'"
                        >
                          <!-- Uploading spinner -->
                          <template v-if="variant.uploading">
                            <img v-if="variant.image" :src="variant.image" class="absolute inset-0 w-full h-full object-cover opacity-50" />
                            <div class="absolute inset-0 flex flex-col items-center justify-center bg-white/70 gap-1">
                              <svg class="w-6 h-6 text-gray-500 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                              </svg>
                              <span class="text-xs text-gray-500">Đang upload...</span>
                            </div>
                          </template>

                          <!-- Has image: show it -->
                          <template v-else-if="variant.image">
                            <img
                              :src="variant.image"
                              :alt="variant.color"
                              class="absolute inset-0 w-full h-full object-cover"
                            />
                            <!-- Overlay on hover -->
                            <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <span class="text-white text-xs font-medium">Đổi ảnh</span>
                            </div>
                          </template>

                          <!-- No image: show upload prompt -->
                          <template v-else>
                            <svg class="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span class="text-xs text-gray-400 text-center leading-tight">Tải ảnh lên</span>
                          </template>
                        </button>

                        <!-- File name / size info -->
                        <p v-if="variant.fileName" class="text-xs text-gray-400 mt-1 w-28 truncate text-center" :title="variant.fileName">
                          {{ variant.fileName }}
                        </p>
                      </div>

                      <!-- Right: color name -->
                      <div class="flex-1 space-y-3 pt-1">
                        <div>
                          <label class="label-sm">Tên màu *</label>
                          <input
                            v-model="variant.color"
                            type="text"
                            class="input-field text-sm"
                            placeholder="vd: Nâu, Đỏ, Xanh navy..."
                          />
                        </div>
                        <p class="text-xs text-gray-400 leading-relaxed">
                          Click vào ô ảnh để tải ảnh từ máy tính lên.<br/>
                          <span class="text-gray-300">Hỗ trợ: JPG, PNG, WebP – tối đa 5MB.</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <!-- Add color button -->
                  <button
                    type="button"
                    @click="addVariant"
                    class="w-full border-2 border-dashed border-gray-200 hover:border-gray-400 py-3 text-sm text-gray-500 hover:text-gray-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Thêm màu mới
                  </button>
                </div>
              </section>

            </div>

            <!-- Modal footer -->
            <div class="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50 sticky bottom-0">
              <p class="text-xs text-gray-400">* Bắt buộc điền</p>
              <div class="flex gap-3">
                <button @click="showModal = false" class="btn-outline text-sm">Hủy</button>
                <button @click="saveProduct" class="btn-primary text-sm">
                  {{ editingProduct ? 'Lưu thay đổi' : 'Thêm sản phẩm' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>

      <!-- Delete confirm -->
      <Transition name="fade">
        <div v-if="deleteConfirmId" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div class="bg-white rounded-2xl p-6 max-w-sm w-full">
            <h3 class="font-semibold text-lg mb-2">Xác nhận xóa</h3>
            <p class="text-sm text-gray-600 mb-5">Bạn có chắc muốn xóa sản phẩm này? Hành động này không thể hoàn tác.</p>
            <div class="flex gap-3 justify-end">
              <button @click="deleteConfirmId = null" class="btn-outline text-sm">Hủy</button>
              <button @click="confirmDelete" class="btn-danger">Xóa</button>
            </div>
          </div>
        </div>
      </Transition>

      <!-- Import result modal -->
      <Transition name="fade">
        <div v-if="importResult" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div class="bg-white rounded-2xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-10 h-10 rounded-xl flex items-center justify-center"
                :class="importResult.failed === 0 ? 'bg-emerald-50' : 'bg-amber-50'">
                <svg class="w-5 h-5" :class="importResult.failed === 0 ? 'text-emerald-600' : 'text-amber-500'"
                  fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    :d="importResult.failed === 0
                      ? 'M5 13l4 4L19 7'
                      : 'M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z'" />
                </svg>
              </div>
              <div>
                <h3 class="font-bold text-gray-900">Kết quả Import</h3>
                <p class="text-sm text-gray-500">
                  <span class="text-emerald-600 font-semibold">{{ importResult.imported }} thành công</span>
                  <span v-if="importResult.failed > 0"> · <span class="text-rose-500 font-semibold">{{ importResult.failed }} lỗi</span></span>
                </p>
              </div>
            </div>

            <div v-if="importResult.errors?.length > 0" class="bg-rose-50 rounded-xl p-3 mb-4">
              <p class="text-xs font-semibold text-rose-600 mb-2 uppercase tracking-wider">Chi tiết lỗi:</p>
              <ul class="space-y-1">
                <li v-for="err in importResult.errors" :key="err" class="text-xs text-rose-600">• {{ err }}</li>
              </ul>
            </div>

            <button @click="importResult = null; productStore.fetchProducts({ size: 200 })"
              class="btn-primary w-full text-sm">
              Đóng &amp; Tải lại danh sách
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, nextTick, onMounted } from 'vue'
import { useProductStore } from '@/stores/products'
import { productApi } from '@/api/productApi'
import { uploadApi } from '@/api/uploadApi'
import type { Product, ColorVariant } from '@/types'
import { formatPrice } from '@/utils/format'

const productStore = useProductStore()
const search = ref('')
const filterCat = ref('')
const showModal = ref(false)
const editingProduct = ref<Product | null>(null)
const deleteConfirmId = ref<number | null>(null)

// Refs đến các <input type="file"> ẩn (1 cái per color variant)
const fileInputRefs = ref<HTMLInputElement[]>([])

// Form variant: thêm field `fileName` để hiển thị tên file
interface FormVariant {
  color: string
  image: string      // URL thật từ BE sau khi upload (hoặc blob tạm thời lúc đang upload)
  fileName: string   // tên file để hiển thị
  uploading: boolean // đang upload lên BE
}

const form = reactive({
  name: '',
  brand: '',
  category: 'men' as Product['category'],
  price: 0,
  originalPrice: undefined as number | undefined,
  stock: 0,
  description: '',
  sizes: '39,40,41,42',
  isNew: false,
  isSale: false,
  colorVariants: [] as FormVariant[],
})

// ── Filtered products ──────────────────────────────────────
const filteredProducts = computed(() => {
  return productStore.products.filter(p => {
    const matchSearch = !search.value ||
      p.name.toLowerCase().includes(search.value.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.value.toLowerCase())
    const matchCat = !filterCat.value || p.category === filterCat.value
    return matchSearch && matchCat
  })
})

function categoryLabel(cat: string) {
  return { men: 'Nam', women: 'Nữ', unisex: 'Unisex', kids: 'Trẻ em' }[cat] ?? cat
}

// ── Modal open/close ──────────────────────────────────────
function openModal(product?: Product) {
  // Revoke cũ để tránh memory leak
  revokeOldObjectUrls()
  fileInputRefs.value = []

  if (product) {
    editingProduct.value = product
    form.name = product.name
    form.brand = product.brand
    form.category = product.category
    form.price = product.price
    form.originalPrice = product.originalPrice
    form.stock = product.stock
    form.description = product.description
    form.sizes = product.sizes.join(',')
    form.isNew = product.isNew
    form.isSale = product.isSale
    form.colorVariants = product.colorVariants.map(v => ({
      color: v.color,
      image: v.image,
      fileName: '',
      uploading: false,
    }))
  } else {
    editingProduct.value = null
    form.name = ''
    form.brand = ''
    form.category = 'men'
    form.price = 0
    form.originalPrice = undefined
    form.stock = 0
    form.description = ''
    form.sizes = '39,40,41,42'
    form.isNew = false
    form.isSale = false
    form.colorVariants = [{ color: '', image: '', fileName: '', uploading: false }]
  }
  showModal.value = true
}

// ── Color variant helpers ──────────────────────────────────
function addVariant() {
  form.colorVariants.push({ color: '', image: '', fileName: '', uploading: false })
}

function removeVariant(idx: number) {
  // Revoke object URL nếu là local
  const v = form.colorVariants[idx]
  if (v.image.startsWith('blob:')) URL.revokeObjectURL(v.image)
  form.colorVariants.splice(idx, 1)
}

// ── File upload ───────────────────────────────────────────
function triggerFileInput(idx: number) {
  nextTick(() => {
    fileInputRefs.value[idx]?.click()
  })
}

async function onFileChange(idx: number, event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  input.value = ''

  if (file.size > 5 * 1024 * 1024) {
    alert('Ảnh quá lớn! Vui lòng chọn ảnh dưới 5MB.')
    return
  }

  // Hiện preview blob ngay lập tức để UX mượt
  const previewUrl = URL.createObjectURL(file)
  const old = form.colorVariants[idx]?.image
  if (old?.startsWith('blob:')) URL.revokeObjectURL(old)
  form.colorVariants[idx].image = previewUrl
  form.colorVariants[idx].fileName = file.name
  form.colorVariants[idx].uploading = true

  // Upload lên BE, lấy URL thật
  try {
    const realUrl = await uploadApi.uploadImage(file)
    // Thay preview blob bằng URL thật
    URL.revokeObjectURL(previewUrl)
    form.colorVariants[idx].image = realUrl
    form.colorVariants[idx].uploading = false
  } catch (e: any) {
    alert(e.response?.data?.message ?? 'Upload ảnh thất bại')
    form.colorVariants[idx].image = ''
    form.colorVariants[idx].uploading = false
  }
}

// Revoke tất cả blob URL khi đóng modal
const objectUrls = ref<string[]>([])

function revokeOldObjectUrls() {
  form.colorVariants.forEach(v => {
    if (v.image.startsWith('blob:')) URL.revokeObjectURL(v.image)
  })
}

// ── Fetch khi vào trang ────────────────────────────────────
onMounted(() => productStore.fetchProducts({ size: 200 }))

// ── Import Excel ────────────────────────────────────────────
const importFileRef = ref<HTMLInputElement | null>(null)
const importing = ref(false)
const importResult = ref<{ imported: number; failed: number; errors: string[] } | null>(null)

function triggerImport() {
  importFileRef.value?.click()
}

async function handleImport(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  input.value = ''

  importing.value = true
  try {
    const result = await productApi.importExcel(file)
    importResult.value = result
  } catch (e: any) {
    alert(e.response?.data?.message ?? 'Import thất bại')
  } finally {
    importing.value = false
  }
}

// ── Save / Delete ──────────────────────────────────────────
const saving = ref(false)

async function saveProduct() {
  if (!form.name || !form.brand || !form.price) return
  if (form.colorVariants.length === 0 || !form.colorVariants[0].color) return

  // Kiểm tra nếu còn ảnh đang upload
  const stillUploading = form.colorVariants.some(v => v.uploading)
  if (stillUploading) {
    alert('Vui lòng chờ ảnh upload xong trước khi lưu')
    return
  }

  const payload = {
    name: form.name,
    brand: form.brand,
    category: form.category,
    price: form.price,
    originalPrice: form.originalPrice || null,
    stock: form.stock,
    description: form.description,
    sizes: form.sizes.split(',').map(s => s.trim()).filter(Boolean),
    isNew: form.isNew,
    isSale: form.isSale,
    colorVariants: form.colorVariants
      .filter(v => v.color.trim())
      .map(v => ({
        color: v.color.trim(),
        imageUrl: v.image || '',  // URL thật từ BE sau khi upload
      })),
  }

  saving.value = true
  try {
    if (editingProduct.value) {
      await productStore.updateProduct(String(editingProduct.value.id), payload)
    } else {
      await productStore.addProduct(payload)
    }
    showModal.value = false
  } catch (e: any) {
    alert(e.response?.data?.message ?? 'Lỗi lưu sản phẩm')
  } finally {
    saving.value = false
  }
}

function deleteProduct(id: number | string) {
  deleteConfirmId.value = Number(id)
}

async function confirmDelete() {
  if (deleteConfirmId.value) {
    await productStore.deleteProduct(deleteConfirmId.value)
    deleteConfirmId.value = null
  }
}
</script>

<style scoped>
.label-sm {
  @apply block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wider;
}
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
