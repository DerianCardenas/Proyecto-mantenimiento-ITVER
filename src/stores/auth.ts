import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, LoginPayload, RegisterPayload } from '@/types'
import { useAuthService } from '@/services/auth.service'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const isAuthenticated = ref(false)

  const { login: authLogin, register: authRegister, logout: authLogout, getCurrentUser } = useAuthService()

  const userRole = computed(() => user.value?.role ?? '')
  const isAdmin = computed(() => user.value?.role === 'admin')
  const isTechnician = computed(() => user.value?.role === 'technician')

  async function login(credentials: LoginPayload) {
    const response = await authLogin(credentials)
    user.value = response.user
    isAuthenticated.value = true
  }

  async function register(data: RegisterPayload) {
    const newUser = await authRegister(data)
    return newUser
  }

  function logout() {
    authLogout()
    user.value = null
    isAuthenticated.value = false
  }

  async function loadUser() {
    try {
      const u = await getCurrentUser()
      user.value = u
      isAuthenticated.value = true
    } catch {
      const stored = localStorage.getItem('user')
      if (stored) {
        user.value = JSON.parse(stored)
        isAuthenticated.value = true
      }
    }
  }

  return { user, isAuthenticated, userRole, isAdmin, isTechnician, login, register, logout, loadUser }
})