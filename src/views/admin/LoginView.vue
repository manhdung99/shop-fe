<template>
  <div class="min-h-screen bg-gray-950 flex items-center justify-center p-4">
    <div class="w-full max-w-sm">
      <!-- Logo -->
      <div class="flex items-center justify-center gap-3 mb-10">
        <div class="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-sm">
          <span class="text-gray-900 font-black text-lg">S</span>
        </div>
        <div>
          <p class="text-white font-black text-xl leading-none">ShopGiayDep</p>
          <p class="text-gray-500 text-xs mt-0.5">Admin Panel</p>
        </div>
      </div>

      <!-- Card -->
      <div class="bg-white/5 border border-white/10 rounded-2xl p-8">
        <h1 class="text-white font-bold text-xl mb-6">Đăng nhập</h1>

        <form @submit.prevent="handleLogin" class="space-y-4">
          <div>
            <label class="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">Username</label>
            <input
              v-model="form.username"
              type="text"
              placeholder="admin"
              class="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded-xl placeholder-gray-600 focus:outline-none focus:border-white/30 transition-colors"
              autocomplete="username"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">Password</label>
            <input
              v-model="form.password"
              type="password"
              placeholder="••••••••"
              class="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded-xl placeholder-gray-600 focus:outline-none focus:border-white/30 transition-colors"
              autocomplete="current-password"
            />
          </div>

          <p v-if="error" class="text-rose-400 text-sm">{{ error }}</p>

          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-white text-gray-900 font-bold py-3 rounded-xl hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {{ loading ? 'Đang đăng nhập...' : 'Đăng nhập' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({ username: '', password: '' })
const loading = ref(false)
const error = ref('')

async function handleLogin() {
  if (!form.value.username || !form.value.password) {
    error.value = 'Vui lòng nhập đầy đủ thông tin'
    return
  }
  loading.value = true
  error.value = ''
  try {
    await authStore.login(form.value.username, form.value.password)
    router.push('/admin/dashboard')
  } catch (e: any) {
    error.value = e.response?.data?.message ?? 'Sai username hoặc password'
  } finally {
    loading.value = false
  }
}
</script>
