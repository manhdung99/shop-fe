import api from './axios'

export interface Category {
  id: number
  name: string
  slug: string
  description: string
  imageUrl: string
  productCount: number
}

export const categoryApi = {
  getAll(): Promise<Category[]> {
    return api.get('/categories').then(res => res.data.data)
  },

  create(data: Partial<Category>): Promise<Category> {
    return api.post('/categories', data).then(res => res.data.data)
  },

  update(id: number, data: Partial<Category>): Promise<Category> {
    return api.put(`/categories/${id}`, data).then(res => res.data.data)
  },

  delete(id: number): Promise<void> {
    return api.delete(`/categories/${id}`).then(() => {})
  },
}
