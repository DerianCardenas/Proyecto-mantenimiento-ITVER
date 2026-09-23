<script setup lang="ts">
import { onMounted } from 'vue'
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
  <div class="login-page flex-center">
    <LoginForm @login-success="router.push({ name: 'Dashboard' })" />
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #1565c0, #1976d2);
}
</style>
