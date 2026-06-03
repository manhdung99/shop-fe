import api from './axios'
import type { Product } from '@/types'

export interface ProductParams {
  category?: string
  search?: string
  isNew?: boolean
  isSale?: boolean
  minPrice?: number
  maxPrice?: number
  page?: number
  size?: number
  sort?: string
}

export interface PageResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  number: number
  size: number
}

// Map response từ BE → Product type FE đang dùng
function mapProduct(p: any): Product {
  return {
    id: String(p.id),
    name: p.name,
    slug: p.slug,
    brand: p.brand,
    price: p.price,
    originalPrice: p.originalPrice ?? undefined,
    category: p.category,
    stock: p.stock,
    description: p.description ?? '',
    isNew: p.isNew ?? false,
    isSale: p.isSale ?? false,
    rating: p.rating ?? 0,
    reviewCount: p.reviewCount ?? 0,
    sizes: p.sizes ?? [],
    colorVariants: (p.colorVariants ?? []).map((cv: any) => ({
      color: cv.color,
      image: cv.imageUrl,
    })),
    colors: (p.colorVariants ?? []).map((cv: any) => cv.color),
    images: (p.colorVariants ?? []).map((cv: any) => cv.imageUrl),
  }
}

export const productApi = {
  getAll(params: ProductParams = {}): Promise<PageResponse<Product>> {
    return api.get('/products', { params }).then(res => {
      const page = res.data.data
      return {
        ...page,
        content: page.content.map(mapProduct),
      }
    })
  },

  getBySlug(slug: string): Promise<Product> {
    return api.get(`/products/slug/${slug}`).then(res => mapProduct(res.data.data))
  },

  getById(id: string): Promise<Product> {
    return api.get(`/products/${id}`).then(res => mapProduct(res.data.data))
  },

  create(data: any): Promise<Product> {
    return api.post('/products', data).then(res => mapProduct(res.data.data))
  },

  update(id: string, data: any): Promise<Product> {
    return api.put(`/products/${id}`, data).then(res => mapProduct(res.data.data))
  },

  delete(id: string): Promise<void> {
    return api.delete(`/products/${id}`).then(() => {})
  },
}
