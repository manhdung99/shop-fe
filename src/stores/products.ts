import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Product, FilterState } from '@/types'
import { productApi } from '@/api/productApi'

export const useProductStore = defineStore('products', () => {
  const products = ref<Product[]>([])
  const loading = ref(false)
  const error = ref('')
  const totalPages = ref(0)
  const totalElements = ref(0)

  const filters = ref<FilterState>({
    category: '',
    minPrice: null,
    maxPrice: null,
    sizes: [],
    sort: 'newest',
  })

  // Fetch từ API
  async function fetchProducts(extraParams: Record<string, any> = {}) {
    loading.value = true
    error.value = ''
    try {
      const res = await productApi.getAll({
        category: filters.value.category || undefined,
        minPrice: filters.value.minPrice ?? undefined,
        maxPrice: filters.value.maxPrice ?? undefined,
        sort: filters.value.sort,
        size: 100, // lấy nhiều để filter client-side sizes
        ...extraParams,
      })
      products.value = res.content
      totalPages.value = res.totalPages
      totalElements.value = res.totalElements
    } catch (e: any) {
      error.value = e.response?.data?.message ?? 'Lỗi tải sản phẩm'
      console.error(e)
    } finally {
      loading.value = false
    }
  }

  // Filter client-side cho sizes (sizes filter không gửi lên BE)
  const filteredProducts = computed(() => {
    let result = [...products.value]
    if (filters.value.sizes.length > 0) {
      result = result.filter(p =>
        filters.value.sizes.some(s => p.sizes.includes(s))
      )
    }
    return result
  })

  function getById(id: number | string) {
    return products.value.find(p => String(p.id) === String(id))
  }

  function getBySlug(slug: string) {
    return products.value.find(p => p.slug === slug)
  }

  function setFilter(key: keyof FilterState, value: FilterState[typeof key]) {
    ;(filters.value as Record<string, unknown>)[key] = value
  }

  function resetFilters() {
    filters.value = {
      category: '',
      minPrice: null,
      maxPrice: null,
      sizes: [],
      sort: 'newest',
    }
  }

  // Admin CRUD
  async function addProduct(data: any): Promise<Product> {
    const created = await productApi.create(data)
    products.value.unshift(created)
    return created
  }

  async function updateProduct(id: string, data: any): Promise<Product> {
    const updated = await productApi.update(id, data)
    const idx = products.value.findIndex(p => String(p.id) === String(id))
    if (idx !== -1) products.value[idx] = updated
    return updated
  }

  async function deleteProduct(id: string | number) {
    await productApi.delete(String(id))
    products.value = products.value.filter(p => String(p.id) !== String(id))
  }

  return {
    products,
    loading,
    error,
    totalPages,
    totalElements,
    filters,
    filteredProducts,
    fetchProducts,
    getById,
    getBySlug,
    addProduct,
    updateProduct,
    deleteProduct,
    setFilter,
    resetFilters,
  }
})
