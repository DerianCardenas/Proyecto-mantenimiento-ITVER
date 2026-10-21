<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { useAuthStore } from '@/stores/auth'
import ThemeToggle from '@/components/common/ThemeToggle.vue'

const authStore = useAuthStore()
const router = useRouter()
const toast = useToast()
const password = ref('')
const confirmation = ref('')
const loading = ref(false)
const error = ref('')

async function submit() {
  error.value = ''
  if (password.value.length < 8) {
    error.value = 'La contraseña debe tener al menos 8 caracteres.'
    return
  }
  if (password.value !== confirmation.value) {
    error.value = 'Las contraseñas no coinciden.'
    return
  }
  loading.value = true
  try {
    await authStore.changePassword(password.value)
    toast.add({ severity: 'success', summary: 'Contraseña actualizada', detail: 'Ya puedes acceder a la plataforma.', life: 3500 })
    router.replace({ name: 'Dashboard' })
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : 'No se pudo actualizar la contraseña.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="auth-page">
    <aside class="auth-aside">
      <div class="auth-brand"><div class="brand-mark"><i class="fa-solid fa-screwdriver-wrench" aria-hidden="true"></i></div><div><div class="auth-brand-name">SGM-ITVER</div><div class="auth-brand-caption">Gestión de mantenimiento</div></div></div>
      <div class="auth-aside-content"><h1>Un acceso seguro para tu trabajo.</h1><p>Antes de continuar, configura una contraseña personal para proteger tu cuenta.</p></div>
      <div class="auth-aside-note">Instituto Tecnológico de Veracruz · {{ new Date().getFullYear() }}</div>
    </aside>
    <main class="auth-main">
      <div class="auth-theme-control"><ThemeToggle /></div>
      <section class="auth-form" aria-labelledby="change-password-title">
        <div class="auth-mobile-brand"><span class="brand-mark"><i class="fa-solid fa-screwdriver-wrench" aria-hidden="true"></i></span>SGM-ITVER</div>
        <div class="auth-form-header"><h2 id="change-password-title">Crea tu contraseña</h2><p>Este paso es obligatorio antes de entrar al panel.</p></div>
        <form class="flex flex-column" @submit.prevent="submit">
          <div><label for="new-password">Nueva contraseña</label><Password inputId="new-password" v-model="password" class="w-full" autocomplete="new-password" placeholder="Al menos 8 caracteres" :feedback="false" :toggleMask="true"/><small class="text-muted">Usa al menos 8 caracteres.</small></div>
          <div><label for="confirm-password">Confirmar contraseña</label><Password inputId="confirm-password" v-model="confirmation" class="w-full" autocomplete="new-password" placeholder="Repite la contraseña" :feedback="false" :toggleMask="true"/></div>
          <p v-if="error" class="field-error" role="alert">{{ error }}</p>
          <Button :label="loading ? 'Guardando…' : 'Guardar contraseña y continuar'" icon="fa-solid fa-lock" type="submit" :loading="loading" />
        </form>
      </section>
    </main>
  </div>
</template>
