<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const emit = defineEmits<{ (e: 'registered'): void }>()

const router = useRouter()
const authStore = useAuthStore()

const formData = ref({
  username: '',
  email: '',
  password: '',
  fullName: '',
  role: 'user'
})
const errors = ref<Record<string, string>>({})
const loading = ref(false)

function validate(): boolean {
  const e: Record<string, string> = {}
  if (!formData.value.username.trim()) e.username = 'El nombre de usuario es obligatorio'
  if (!formData.value.email.trim()) e.email = 'El email es obligatorio'
  else if (!/\S+@\S+\.\S+/.test(formData.value.email)) e.email = 'Email inválido'
  if (!formData.value.password) e.password = 'La contraseña es obligatoria'
  else if (formData.value.password.length < 6) e.password = 'Mínimo 6 caracteres'
  if (!formData.value.fullName.trim()) e.fullName = 'El nombre completo es obligatorio'
  errors.value = e
  return Object.keys(e).length === 0
}

async function onSubmit() {
  if (!validate()) return
  loading.value = true
  try {
    await authStore.register(formData.value)
    emit('registered')
    router.push({ name: 'Login' })
  } catch {
    // Error handled by store
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="auth-form">
    <h2 class="text-center text-xl mb-lg">Registro</h2>
    <form @submit.prevent="onSubmit" class="flex flex-column gap-md">
      <div>
        <label>Nombre de usuario</label>
        <InputText v-model="formData.username" class="w-full" placeholder="Usuario" />
        <span v-if="errors.username" class="text-small text-danger">{{ errors.username }}</span>
      </div>
      <div>
        <label>Nombre completo</label>
        <InputText v-model="formData.fullName" class="w-full" placeholder="Nombre completo" />
        <span v-if="errors.fullName" class="text-small text-danger">{{ errors.fullName }}</span>
      </div>
      <div>
        <label>Email</label>
        <InputText v-model="formData.email" type="email" class="w-full" placeholder="email@example.com" />
        <span v-if="errors.email" class="text-small text-danger">{{ errors.email }}</span>
      </div>
      <div>
        <label>Contraseña</label>
        <Password v-model="formData.password" class="w-full" placeholder="mínimo 6 caracteres" :toggleMask="true" />
        <span v-if="errors.password" class="text-small text-danger">{{ errors.password }}</span>
      </div>
      <div>
        <label>Rol</label>
        <Dropdown v-model="formData.role" :options="['user', 'technician', 'admin']" class="w-full" />
      </div>
      <Button :label="loading ? 'Registrando...' : 'Registrarse'" type="submit" severity="primary" :loading="loading" class="mt-sm" />
      <p class="text-center text-small text-muted">
        ¿Ya tienes cuenta? <RouterLink to="/login">Inicia sesión</RouterLink>
      </p>
    </form>
  </div>
</template>

<style scoped>
.auth-form {
  max-width: 400px;
  margin: 0 auto;
  padding: var(--spacing-lg);
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
