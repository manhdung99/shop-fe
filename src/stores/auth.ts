import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi } from '@/api/authApi'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('admin_token') ?? '')
  const username = ref(localStorage.getItem('admin_username') ?? '')

  const isLoggedIn = computed(() => !!token.value)

  async function login(user: string, password: string) {
    const data = await authApi.login(user, password)
    token.value = data.token
    username.value = data.username
    localStorage.setItem('admin_token', data.token)
    localStorage.setItem('admin_username', data.username)
  }

  function logout() {
    token.value = ''
    username.value = ''
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_username')
  }

  return { token, username, isLoggedIn, login, logout }
})
