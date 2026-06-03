<template>
  <div class="space-y-5">
    <!-- Toolbar -->
    <div class="flex justify-end">
      <button @click="openModal()" class="btn-primary text-sm flex items-center gap-2">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Thêm danh mục
      </button>
    </div>

    <!-- Category grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <div
        v-for="cat in categories"
        :key="cat.id"
        class="bg-white border border-gray-100 rounded-2xl overflow-hidden group hover:shadow-sm transition-shadow"
      >
        <div class="relative h-36 overflow-hidden">
          <img :src="cat.image" :alt="cat.name" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          <div class="absolute inset-0 bg-black/20" />
          <div class="absolute bottom-3 left-3">
            <span class="text-white font-bold text-lg">{{ cat.name }}</span>
          </div>
        </div>
        <div class="p-4">
          <p class="text-sm text-gray-500 mb-1">{{ cat.description }}</p>
          <p class="text-xs text-gray-400 mb-3">{{ cat.productCount }} sản phẩm</p>
          <div class="flex gap-2">
            <button
              @click="openModal(cat)"
              class="flex-1 text-xs border border-gray-200 rounded-lg hover:border-gray-400 py-1.5 transition-colors font-medium"
            >
              Chỉnh sửa
            </button>
            <button
              @click="deleteConfirmId = cat.id"
              class="px-3 text-xs text-rose-500 border border-rose-100 rounded-lg hover:bg-rose-50 py-1.5 transition-colors font-medium"
            >
              Xóa
            </button>
          </div>
        </div>
      </div>

      <!-- Add new card -->
      <button
        @click="openModal()"
        class="border-2 border-dashed border-gray-200 hover:border-gray-400 rounded-2xl h-full min-h-[200px] flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4v16m8-8H4" />
        </svg>
        <span class="text-sm font-medium">Thêm danh mục</span>
      </button>
    </div>

    <!-- Modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showModal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div class="bg-white w-full max-w-md rounded-2xl overflow-hidden">
            <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 class="font-semibold">{{ editing ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới' }}</h3>
              <button @click="showModal = false" class="text-gray-400 hover:text-gray-700">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div class="p-6 space-y-4">
              <div>
                <label class="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wider">Tên danh mục *</label>
                <input v-model="form.name" class="input-field" placeholder="Giày Nam" />
              </div>
              <div>
                <label class="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wider">Slug (URL)</label>
                <input v-model="form.slug" class="input-field" placeholder="giay-nam" />
              </div>
              <div>
                <label class="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wider">Mô tả</label>
                <input v-model="form.description" class="input-field" placeholder="Mô tả ngắn..." />
              </div>
              <div>
                <label class="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wider">URL ảnh</label>
                <input v-model="form.image" class="input-field" placeholder="https://..." />
              </div>
            </div>
            <div class="flex justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50">
              <button @click="showModal = false" class="btn-outline text-sm">Hủy</button>
              <button @click="save" class="btn-primary text-sm">{{ editing ? 'Lưu' : 'Thêm' }}</button>
            </div>
          </div>
        </div>
      </Transition>

      <Transition name="fade">
        <div v-if="deleteConfirmId" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div class="bg-white p-6 max-w-sm w-full">
            <h3 class="font-semibold mb-2">Xác nhận xóa</h3>
            <p class="text-sm text-gray-600 mb-5">Bạn có chắc muốn xóa danh mục này?</p>
            <div class="flex gap-3 justify-end">
              <button @click="deleteConfirmId = null" class="btn-outline text-sm">Hủy</button>
              <button @click="confirmDelete" class="btn-danger">Xóa</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { Category } from '@/types'
import { mockCategories } from '@/data/mockData'

const categories = ref<Category[]>([...mockCategories])
const showModal = ref(false)
const editing = ref<Category | null>(null)
const deleteConfirmId = ref<number | null>(null)

const form = reactive({ name: '', slug: '', description: '', image: '' })

function openModal(cat?: Category) {
  if (cat) {
    editing.value = cat
    form.name = cat.name
    form.slug = cat.slug
    form.description = cat.description
    form.image = cat.image
  } else {
    editing.value = null
    form.name = ''
    form.slug = ''
    form.description = ''
    form.image = ''
  }
  showModal.value = true
}

function save() {
  if (!form.name) return
  if (editing.value) {
    const idx = categories.value.findIndex(c => c.id === editing.value!.id)
    if (idx !== -1) {
      categories.value[idx] = { ...categories.value[idx], ...form }
    }
  } else {
    const newId = Math.max(...categories.value.map(c => c.id), 0) + 1
    categories.value.push({
      id: newId,
      name: form.name,
      slug: form.slug || form.name.toLowerCase().replace(/\s+/g, '-'),
      description: form.description,
      image: form.image || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80',
      productCount: 0,
    })
  }
  showModal.value = false
}

function confirmDelete() {
  if (deleteConfirmId.value) {
    categories.value = categories.value.filter(c => c.id !== deleteConfirmId.value)
    deleteConfirmId.value = null
  }
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
