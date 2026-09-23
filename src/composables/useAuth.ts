import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

export function useAuth() {
  const authStore = useAuthStore()

  const isAuthenticated = computed(() => authStore.isAuthenticated)
  const user = computed(() => authStore.user)

  async function login(credentials: { email: string; password: string }) {
    await authStore.login(credentials)
  }

  function logout() {
    authStore.logout()
  }

  function hasRole(role: string) {
    return authStore.userRole === role
  }

  return { isAuthenticated, user, login, logout, hasRole }
}
