<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import LoginForm from '@/components/Auth/LoginForm.vue'

const { isAuthenticated } = useAuth()
const router = useRouter()

onMounted(() => {
  if (isAuthenticated.value) {
    router.push({ name: 'Dashboard' })
  }
})
</script>

<template>
  <div class="register-page flex-center">
    <RegisterForm @registered="router.push({ name: 'Login' })" />
  </div>
</template>

<style scoped>
.register-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #1565c0, #1976d2);
}
</style>
