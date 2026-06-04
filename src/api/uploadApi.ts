import api from './axios'

export const uploadApi = {
  /**
   * Upload 1 file ảnh lên BE, trả về URL public
   */
  uploadImage(file: File): Promise<string> {
    const formData = new FormData()
    formData.append('file', file)
    return api.post('/upload/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then(res => res.data.data.url)
  },
}
