import api from './axios'

export const authApi = {
  login(username: string, password: string) {
    return api.post('/auth/login', { username, password }).then(res => res.data.data)
  },
}
