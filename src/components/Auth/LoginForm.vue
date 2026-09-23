<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const emit = defineEmits<{ (e: 'login-success'): void }>()

const router = useRouter()
const { login } = useAuth()

const formData = ref({
  email: '',
  password: ''
})
const errors = ref<Record<string, string>>({})
const loading = ref(false)

function validate(): boolean {
  const e: Record<string, string> = {}
  if (!formData.value.email.trim()) e.email = 'El email es obligatorio'
  else if (!/\S+@\S+\.\S+/.test(formData.value.email)) e.email = 'Email inválido'
  if (!formData.value.password) e.password = 'La contraseña es obligatoria'
  errors.value = e
  return Object.keys(e).length === 0
}

async function onSubmit() {
  if (!validate()) return
  loading.value = true
  try {
    await login(formData.value)
    emit('login-success')
    router.push({ name: 'Dashboard' })
  } catch {
    // Error handled
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="auth-form">
    <div class="text-center mb-lg">
      <span class="material-symbols-rounded" style="font-size: 48px; color: var(--primary);">building</span>
      <h2 class="mt-md text-xl">SGM-ITVER</h2>
      <p class="text-muted">Sistema de Gestión de Mantenimiento</p>
    </div>
    <form @submit.prevent="onSubmit" class="flex flex-column gap-md">
      <div>
        <label>Email</label>
        <InputText v-model="formData.email" type="email" class="w-full" placeholder="email@example.com" autofocus />
        <span v-if="errors.email" class="text-small text-danger">{{ errors.email }}</span>
      </div>
      <div>
        <label>Contraseña</label>
        <Password v-model="formData.password" class="w-full" placeholder="Tu contraseña" :toggleMask="true" />
        <span v-if="errors.password" class="text-small text-danger">{{ errors.password }}</span>
      </div>
      <Button :label="loading ? 'Iniciando...' : 'Iniciar sesión'" type="submit" severity="primary" :loading="loading" class="mt-sm" />
      <p class="text-center text-small text-muted mt-sm">
        ¿No tienes cuenta? <RouterLink to="/register">Regístrate</RouterLink>
      </p>
    </form>
  </div>
</template>

<style scoped>
.auth-form {
  max-width: 400px;
  margin: 0 auto;
  padding: var(--spacing-xl);
  background: var(--white);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-md);
}
.auth-form label {
  display: block;
  font-size: var(--font-size-sm);
  font-weight: 600;
  margin-bottom: 4px;
  color: var(--gray-700);
}
</style>
