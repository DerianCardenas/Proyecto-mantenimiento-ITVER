import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, LoginPayload, RegisterPayload } from '@/types'
import { useAuthService } from '@/services/auth.service'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const isAuthenticated = ref(false)
  const initialized = ref(false)

  const { login: authLogin, register: authRegister, logout: authLogout, getCurrentUser, changePassword: authChangePassword } = useAuthService()

  const userRole = computed(() => user.value?.role ?? '')
  const isAdmin = computed(() => user.value?.role === 'admin')
  const isTechnician = computed(() => user.value?.role === 'technician')

  async function login(credentials: LoginPayload) {
    const response = await authLogin(credentials)
    user.value = response.user
    isAuthenticated.value = true
    initialized.value = true
  }

  async function register(data: RegisterPayload) {
    const newUser = await authRegister(data)
    return newUser
  }

  function logout() {
    authLogout()
    user.value = null
    isAuthenticated.value = false
    initialized.value = true
  }

  async function loadUser(force = false) {
    if (initialized.value && !force) return
    if (!localStorage.getItem('token')) {
      user.value = null
      isAuthenticated.value = false
      initialized.value = true
      return
    }
    try {
      const u = await getCurrentUser()
      user.value = u
      isAuthenticated.value = true
    } catch {
      logout()
    } finally {
      initialized.value = true
    }
  }

  async function changePassword(password: string) {
    const updatedUser = await authChangePassword(password)
    user.value = updatedUser
    isAuthenticated.value = true
    initialized.value = true
  }

  return { user, isAuthenticated, initialized, userRole, isAdmin, isTechnician, login, register, logout, loadUser, changePassword }
})
