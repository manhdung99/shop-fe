import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Product, FilterState } from '@/types'
import { mockProducts } from '@/data/mockData'

export const useProductStore = defineStore('products', () => {
  const products = ref<Product[]>([...mockProducts])
  const filters = ref<FilterState>({
    category: '',
    minPrice: null,
    maxPrice: null,
    sizes: [],
    sort: 'newest',
  })

  const filteredProducts = computed(() => {
    let result = [...products.value]
    if (filters.value.category) {
      if (filters.value.category === 'new') {
        result = result.filter(p => p.isNew)
      } else {
        result = result.filter(p => p.category === filters.value.category)
      }
    }
    if (filters.value.minPrice !== null) {
      result = result.filter(p => p.price >= filters.value.minPrice!)
    }
    if (filters.value.maxPrice !== null) {
      result = result.filter(p => p.price <= filters.value.maxPrice!)
    }
    if (filters.value.sizes.length > 0) {
      result = result.filter(p =>
        filters.value.sizes.some(s => p.sizes.includes(s))
      )
    }
    switch (filters.value.sort) {
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      case 'price-asc':
        result.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        result.sort((a, b) => b.price - a.price)
        break
      case 'popular':
        result.sort((a, b) => b.reviewCount - a.reviewCount)
        break
    }
    return result
  })

  function getById(id: number) {
    return products.value.find(p => p.id === id)
  }

  function getBySlug(slug: string) {
    return products.value.find(p => p.slug === slug)
  }

  function addProduct(product: Product) {
    products.value.push(product)
  }

  function updateProduct(id: number, data: Partial<Product>) {
    const idx = products.value.findIndex(p => p.id === id)
    if (idx !== -1) {
      products.value[idx] = { ...products.value[idx], ...data }
    }
  }

  function deleteProduct(id: number) {
    products.value = products.value.filter(p => p.id !== id)
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

  return {
    products,
    filters,
    filteredProducts,
    getById,
    getBySlug,
    addProduct,
    updateProduct,
    deleteProduct,
    setFilter,
    resetFilters,
  }
})
