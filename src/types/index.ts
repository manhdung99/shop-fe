export interface ColorVariant {
  color: string      // tên màu, vd: "Nâu", "Đỏ", "Xanh navy"
  image: string      // URL ảnh cho màu này
  images?: string[]  // thêm ảnh phụ cho màu này (tuỳ chọn)
}

export interface Product {
  id: number
  name: string
  slug: string
  brand: string
  price: number
  originalPrice?: number
  images: string[]          // ảnh chính (fallback / ảnh đầu tiên)
  colorVariants: ColorVariant[]  // ảnh riêng cho từng màu
  category: 'men' | 'women' | 'kids' | 'unisex'
  tags: string[]
  sizes: string[]
  colors: string[]          // derived từ colorVariants.map(v => v.color)
  description: string
  stock: number
  isNew: boolean
  isSale: boolean
  rating: number
  reviewCount: number
  createdAt: string
}

export interface Category {
  id: number
  name: string
  slug: string
  description: string
  image: string
  productCount: number
}

export interface CartItem {
  product: Product
  size: string
  color: string
  quantity: number
}

export interface Order {
  id: string
  customerName: string
  customerEmail: string
  customerPhone: string
  address: string
  items: CartItem[]
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  createdAt: string
  updatedAt: string
}

export interface FilterState {
  category: string
  minPrice: number | null
  maxPrice: number | null
  sizes: string[]
  sort: 'newest' | 'price-asc' | 'price-desc' | 'popular'
}
