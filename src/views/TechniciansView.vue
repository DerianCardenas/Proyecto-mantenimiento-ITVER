<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import BaseLayout from '@/components/common/BaseLayout.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import { useConfirmDialog } from '@/composables/useConfirmDialog'
import { technicianService } from '@/services/technician.service'
import type { User } from '@/types'

const toast = useToast()
const { confirm } = useConfirmDialog()
const technicians = ref<User[]>([])
const loading = ref(false)
const saving = ref(false)
const search = ref('')
const dialogOpen = ref(false)
const editingId = ref<string | null>(null)
const errors = ref<Record<string, string>>({})
const form = reactive({ fullName: '', email: '', password: '' })

const filteredTechnicians = computed(() => {
  const query = search.value.trim().toLocaleLowerCase('es-MX')
  if (!query) return technicians.value
  return technicians.value.filter((technician) =>
    `${technician.fullName} ${technician.email}`.toLocaleLowerCase('es-MX').includes(query)
  )
})

async function loadTechnicians() {
  loading.value = true
  try {
    technicians.value = await technicianService.list(true)
  } catch (error) {
    toast.add({ severity: 'error', summary: 'No se pudieron cargar los técnicos', detail: getError(error), life: 4500 })
  } finally {
    loading.value = false
  }
}

function resetForm() {
  form.fullName = ''
  form.email = ''
  form.password = ''
  errors.value = {}
}

function openCreate() {
  editingId.value = null
  resetForm()
  dialogOpen.value = true
}

function openEdit(technician: User) {
  editingId.value = technician.id
  form.fullName = technician.fullName
  form.email = technician.email
  form.password = ''
  errors.value = {}
  dialogOpen.value = true
}

function validate() {
  const next: Record<string, string> = {}
  if (form.fullName.trim().length < 2) next.fullName = 'Escribe el nombre completo.'
  if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) next.email = 'Escribe un correo electrónico válido.'
  if (!editingId.value && form.password.length < 8) next.password = 'La contraseña inicial debe tener al menos 8 caracteres.'
  if (editingId.value && form.password && form.password.length < 8) next.password = 'Usa al menos 8 caracteres para restablecerla.'
  errors.value = next
  return Object.keys(next).length === 0
}

async function saveTechnician() {
  if (!validate()) return
  saving.value = true
  try {
    if (editingId.value) {
      const data: { fullName: string; email: string; password?: string } = {
        fullName: form.fullName.trim(),
        email: form.email.trim(),
      }
      if (form.password) data.password = form.password
      await technicianService.update(editingId.value, data)
      toast.add({ severity: 'success', summary: 'Técnico actualizado', detail: form.password ? 'Se solicitará cambiar la contraseña al iniciar sesión.' : 'Los datos se guardaron correctamente.', life: 3500 })
    } else {
      await technicianService.create({ fullName: form.fullName.trim(), email: form.email.trim(), password: form.password })
      toast.add({ severity: 'success', summary: 'Técnico registrado', detail: 'Deberá cambiar su contraseña al iniciar sesión.', life: 4000 })
    }
    dialogOpen.value = false
    await loadTechnicians()
  } catch (error) {
    toast.add({ severity: 'error', summary: 'No se pudo guardar el técnico', detail: getError(error), life: 4500 })
  } finally {
    saving.value = false
  }
}

async function setActive(technician: User, active: boolean) {
  const accepted = await confirm({
    title: active ? 'Reactivar técnico' : 'Desactivar técnico',
    message: active
      ? `Se volverá a permitir el acceso a ${technician.fullName}. ¿Deseas continuar?`
      : `${technician.fullName} ya no podrá iniciar sesión ni recibir nuevas asignaciones. ¿Deseas continuar?`,
    confirmLabel: active ? 'Reactivar' : 'Desactivar',
    danger: !active,
  })
  if (!accepted) return
  try {
    if (active) await technicianService.update(technician.id, { isActive: true })
    else await technicianService.deactivate(technician.id)
    toast.add({ severity: 'success', summary: active ? 'Técnico reactivado' : 'Técnico desactivado', life: 3200 })
    await loadTechnicians()
  } catch (error) {
    toast.add({ severity: 'error', summary: 'No se pudo actualizar el acceso', detail: getError(error), life: 4500 })
  }
}

function getError(error: unknown) {
  return error instanceof Error ? error.message : 'Inténtalo de nuevo.'
}

onMounted(loadTechnicians)
</script>

<template>
  <BaseLayout>
    <section class="technicians-page">
      <div class="page-heading">
        <div><h2>Técnicos</h2><p>Administra las cuentas que pueden recibir tickets de mantenimiento.</p></div>
        <div class="page-heading-actions"><BaseButton label="Agregar técnico" icon="fa-solid fa-user-plus" severity="primary" @click="openCreate" /></div>
      </div>

      <section class="base-card technicians-panel" aria-label="Directorio de técnicos">
        <div class="technicians-toolbar">
          <div class="filter-field search-field">
            <label for="technician-search">Buscar técnico</label>
            <i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
            <InputText id="technician-search" v-model="search" class="w-full" placeholder="Nombre o correo electrónico" />
          </div>
          <span class="technician-count">{{ filteredTechnicians.length }} {{ filteredTechnicians.length === 1 ? 'cuenta' : 'cuentas' }}</span>
        </div>

        <div v-if="loading" class="empty-state" role="status"><ProgressSpinner /><p class="mt-md">Cargando técnicos…</p></div>
        <div v-else-if="!filteredTechnicians.length" class="empty-state">
          <i class="fa-solid fa-user-gear" aria-hidden="true"></i>
          <h3>{{ search ? 'No se encontraron técnicos' : 'Aún no hay técnicos registrados' }}</h3>
          <p>{{ search ? 'Prueba con otro nombre o correo.' : 'Agrega una cuenta para asignar tickets al personal técnico.' }}</p>
        </div>
        <div v-else class="technicians-table-wrap">
          <table class="technicians-table">
            <thead><tr><th>Nombre</th><th>Correo electrónico</th><th>Acceso</th><th class="technicians-actions-heading">Acciones</th></tr></thead>
            <tbody>
              <tr v-for="technician in filteredTechnicians" :key="technician.id">
                <td data-label="Nombre"><div class="technician-name-cell"><span class="user-avatar" aria-hidden="true">{{ technician.fullName.split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase()).join('') }}</span><strong>{{ technician.fullName }}</strong></div></td>
                <td data-label="Correo electrónico">{{ technician.email }}</td>
                <td data-label="Acceso"><span :class="['technician-state', technician.isActive ? 'is-active' : 'is-inactive']">{{ technician.isActive ? 'Activo' : 'Inactivo' }}</span><span v-if="technician.mustChangePassword" class="technician-pending-password">Cambio de contraseña pendiente</span></td>
                <td data-label="Acciones" class="technicians-row-actions">
                  <Button icon="fa-regular fa-pen-to-square" text rounded aria-label="Editar técnico" title="Editar técnico" @click="openEdit(technician)" />
                  <Button v-if="technician.isActive" icon="fa-solid fa-user-slash" text rounded severity="danger" aria-label="Desactivar técnico" title="Desactivar técnico" @click="setActive(technician, false)" />
                  <Button v-else icon="fa-solid fa-user-check" text rounded severity="success" aria-label="Reactivar técnico" title="Reactivar técnico" @click="setActive(technician, true)" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <div v-if="dialogOpen" class="form-modal-backdrop" @click.self="dialogOpen = false">
        <section class="form-modal" role="dialog" aria-modal="true" aria-labelledby="technician-form-title">
          <div class="form-modal-header"><div><span class="form-modal-kicker">Directorio de técnicos</span><h2 id="technician-form-title">{{ editingId ? 'Editar técnico' : 'Agregar técnico' }}</h2></div><button class="modal-close" type="button" aria-label="Cerrar" @click="dialogOpen = false"><i class="fa-solid fa-xmark" aria-hidden="true"></i></button></div>
          <p class="form-modal-description">{{ editingId ? 'Actualiza los datos de la cuenta. Si defines una contraseña, deberá cambiarla al ingresar.' : 'La persona deberá cambiar la contraseña inicial antes de acceder a la plataforma.' }}</p>
          <form class="form-grid" @submit.prevent="saveTechnician">
            <div class="form-field form-field--full"><label for="technician-name">Nombre completo</label><InputText id="technician-name" v-model="form.fullName" class="w-full" autocomplete="name" placeholder="Nombre y apellidos" :aria-invalid="!!errors.fullName"/><span v-if="errors.fullName" class="field-error" role="alert">{{ errors.fullName }}</span></div>
            <div class="form-field form-field--full"><label for="technician-email">Correo electrónico</label><InputText id="technician-email" v-model="form.email" class="w-full" type="email" autocomplete="email" placeholder="tecnico@itver.edu.mx" :aria-invalid="!!errors.email"/><span v-if="errors.email" class="field-error" role="alert">{{ errors.email }}</span></div>
            <div class="form-field form-field--full"><label for="technician-password">{{ editingId ? 'Nueva contraseña (opcional)' : 'Contraseña inicial' }}</label><Password inputId="technician-password" v-model="form.password" class="w-full" :feedback="false" :toggleMask="true" :autocomplete="editingId ? 'new-password' : 'new-password'" :placeholder="editingId ? 'Déjala vacía para conservarla' : 'Al menos 8 caracteres'" :aria-invalid="!!errors.password"/><span v-if="errors.password" class="field-error" role="alert">{{ errors.password }}</span></div>
            <div class="form-actions form-field--full"><Button label="Cancelar" severity="secondary" type="button" @click="dialogOpen = false"/><Button :label="saving ? 'Guardando…' : 'Guardar técnico'" icon="fa-regular fa-floppy-disk" type="submit" :loading="saving"/></div>
          </form>
        </section>
      </div>
    </section>
  </BaseLayout>
</template>
