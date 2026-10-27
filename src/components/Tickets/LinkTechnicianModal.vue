<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useTicketsStore } from '@/stores/tickets'
import { technicianService } from '@/services/technician.service'
import type { User } from '@/types'

const props = defineProps<{ ticketId: string; initialName?: string | null }>()
const emit = defineEmits<{ (e: 'close'): void; (e: 'linked'): void }>()

const toast = useToast()
const ticketsStore = useTicketsStore()

const TEMP_PASSWORD = 'temporal123'

const mode = ref<'existing' | 'new'>('existing')
const loading = ref(false)
const saving = ref(false)
const technicians = ref<User[]>([])
const selectedId = ref<string | null>(null)
const errors = ref<Record<string, string>>({})

const newForm = ref({
  fullName: props.initialName?.trim() || '',
  email: '',
  password: TEMP_PASSWORD,
})

onMounted(async () => {
  loading.value = true
  try {
    technicians.value = await technicianService.list()
    // Si el ticket ya trae un nombre que coincide con un técnico activo, lo preselecciona.
    if (props.initialName) {
      const match = technicians.value.find(
        (t) => t.fullName.toLocaleLowerCase('es-MX') === props.initialName!.trim().toLocaleLowerCase('es-MX')
      )
      if (match) selectedId.value = match.id
    }
    // Si no hay técnicos registrados, arranca directo en el alta de uno nuevo.
    if (!technicians.value.length) mode.value = 'new'
  } catch (error) {
    toast.add({ severity: 'error', summary: 'No se pudieron cargar los técnicos', detail: getError(error), life: 4500 })
  } finally {
    loading.value = false
  }
})

function getError(error: unknown) {
  return error instanceof Error ? error.message : 'Inténtalo de nuevo.'
}

function validate() {
  const next: Record<string, string> = {}
  if (mode.value === 'existing') {
    if (!selectedId.value) next.selected = 'Selecciona un técnico de la lista.'
  } else {
    if (newForm.value.fullName.trim().length < 2) next.fullName = 'Escribe el nombre completo.'
    if (!/^\S+@\S+\.\S+$/.test(newForm.value.email.trim())) next.email = 'Escribe un correo electrónico válido.'
    if (newForm.value.password.length < 8) next.password = 'La contraseña temporal debe tener al menos 8 caracteres.'
  }
  errors.value = next
  return Object.keys(next).length === 0
}

async function submit() {
  if (!validate()) return
  saving.value = true
  try {
    let technicianId = selectedId.value

    // El nombre no está en la plataforma: se crea la cuenta con contraseña temporal.
    if (mode.value === 'new') {
      const created = await technicianService.create({
        fullName: newForm.value.fullName.trim(),
        email: newForm.value.email.trim(),
        password: newForm.value.password,
      })
      technicianId = created.id
      toast.add({ severity: 'success', summary: 'Técnico registrado', detail: 'Deberá cambiar su contraseña temporal al iniciar sesión.', life: 4000 })
    }

    await ticketsStore.update(props.ticketId, { assignedTo: technicianId })
    toast.add({ severity: 'success', summary: 'Técnico vinculado', life: 3000 })
    emit('linked')
  } catch (error) {
    toast.add({ severity: 'error', summary: 'No se pudo vincular al técnico', detail: getError(error), life: 5000 })
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="form-modal-backdrop" @click.self="emit('close')">
    <section class="form-modal" role="dialog" aria-modal="true" aria-labelledby="link-technician-title">
      <div class="form-modal-header">
        <div>
          <span class="form-modal-kicker">Asignación</span>
          <h2 id="link-technician-title">Vincular técnico</h2>
        </div>
        <button class="modal-close" type="button" aria-label="Cerrar" @click="emit('close')"><i class="fa-solid fa-xmark" aria-hidden="true"></i></button>
      </div>

      <div v-if="loading" class="flex-center gap-sm" role="status"><ProgressSpinner style="width:2rem;height:2rem" /><span class="text-small">Cargando técnicos…</span></div>

      <template v-else>
        <div class="link-mode-switch" role="group" aria-label="Tipo de técnico">
          <button type="button" :class="['link-mode-btn', mode === 'existing' && 'is-active']" @click="mode = 'existing'">En la plataforma</button>
          <button type="button" :class="['link-mode-btn', mode === 'new' && 'is-active']" @click="mode = 'new'">No está en la plataforma</button>
        </div>

        <form class="form-grid" @submit.prevent="submit">
          <!-- Técnico existente -->
          <div v-if="mode === 'existing'" class="form-field form-field--full">
            <label for="link-existing">Técnico</label>
            <Dropdown id="link-existing" v-model="selectedId" :options="technicians" optionLabel="fullName" optionValue="id" filter filterPlaceholder="Buscar técnico" showClear placeholder="Seleccionar técnico" class="w-full" :aria-invalid="!!errors.selected" />
            <span v-if="errors.selected" class="field-error" role="alert">{{ errors.selected }}</span>
          </div>

          <!-- Técnico nuevo: se crea con contraseña temporal -->
          <template v-else>
            <p class="form-field--full text-small text-muted"><i class="fa-solid fa-circle-info" aria-hidden="true"></i> La persona no tiene cuenta. Se creará una con una contraseña temporal que deberá cambiar al ingresar.</p>
            <div class="form-field form-field--full">
              <label for="link-name">Nombre completo</label>
              <InputText id="link-name" v-model="newForm.fullName" class="w-full" placeholder="Nombre y apellidos" :aria-invalid="!!errors.fullName" />
              <span v-if="errors.fullName" class="field-error" role="alert">{{ errors.fullName }}</span>
            </div>
            <div class="form-field form-field--full">
              <label for="link-email">Correo electrónico</label>
              <InputText id="link-email" v-model="newForm.email" class="w-full" type="email" autocomplete="email" placeholder="tecnico@itver.edu.mx" :aria-invalid="!!errors.email" />
              <span v-if="errors.email" class="field-error" role="alert">{{ errors.email }}</span>
            </div>
            <div class="form-field form-field--full">
              <label for="link-password">Contraseña temporal</label>
              <Password inputId="link-password" v-model="newForm.password" class="w-full" :feedback="false" :toggleMask="true" autocomplete="new-password" :aria-invalid="!!errors.password" />
              <span v-if="errors.password" class="field-error" role="alert">{{ errors.password }}</span>
            </div>
          </template>

          <div class="form-actions form-field--full">
            <Button label="Cancelar" severity="secondary" type="button" @click="emit('close')" />
            <Button :label="saving ? 'Vinculando…' : 'Vincular técnico'" icon="fa-solid fa-link" type="submit" :loading="saving" />
          </div>
        </form>
      </template>
    </section>
  </div>
</template>

<style scoped>
.link-mode-switch {
  display: flex;
  gap: 0.5rem;
  margin: 0.25rem 0 1rem;
}
.link-mode-btn {
  flex: 1;
  padding: 0.55rem 0.75rem;
  border-radius: 0.6rem;
  border: 1px solid var(--surface-border, #d1d5db);
  background: transparent;
  color: var(--text-color, inherit);
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
}
.link-mode-btn.is-active {
  border-color: var(--primary, #2563eb);
  background: color-mix(in srgb, var(--primary, #2563eb) 12%, transparent);
  color: var(--primary, #2563eb);
}
</style>
