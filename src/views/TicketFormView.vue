<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useTicketsStore } from '@/stores/tickets'
import { useTicketService } from '@/services/ticket.service'
import BaseLayout from '@/components/common/BaseLayout.vue'
import BaseCard from '@/components/common/BaseCard.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import DocumentUpload from '@/components/Tickets/DocumentUpload.vue'
import type { Ticket, TicketStatus, TicketPriority } from '@/types'

const ticketsStore = useTicketsStore()
const router = useRouter()
const route = useRoute()
const { getBuildings } = useTicketService()

const formData = ref({
  title: '',
  description: '',
  buildingId: null as number | null,
  buildingName: '',
  technicianName: '',
  attentionDate: null as Date | null,
  recommendations: '',
  observations: '',
  priority: 'medium' as TicketPriority,
  status: 'pending' as TicketStatus
})
const buildings = ref<any[]>([])
const errors = ref<Record<string, string>>({})
const loading = ref(false)
const isEdit = ref(false)

const priorityOptions = [
  { label: 'Baja', value: 'low' },
  { label: 'Media', value: 'medium' },
  { label: 'Alta', value: 'high' },
  { label: 'Urgente', value: 'urgent' }
]

const statusOptions = [
  { label: 'Pendiente', value: 'pending' },
  { label: 'En progreso', value: 'in_progress' },
  { label: 'Resuelto', value: 'resolved' },
  { label: 'Cerrado', value: 'closed' },
  { label: 'Cancelado', value: 'cancelled' }
]

async function loadBuildings() {
  buildings.value = await getBuildings()
}

async function loadExistingTicket() {
  const ticketId = String(route.params.id)
  await ticketsStore.loadTicket(ticketId)
  const t = ticketsStore.currentTicket
  if (t) {
    formData.value = {
      title: t.title,
      description: t.description,
      buildingId: t.buildingId,
      buildingName: t.buildingName || '',
      technicianName: t.technicianName || '',
      attentionDate: t.attentionDate ? new Date(t.attentionDate) : null,
      recommendations: t.recommendations || '',
      observations: t.observations || '',
      priority: t.priority,
      status: t.status
    }
    isEdit.value = true
  }
}

function validate(): boolean {
  const e: Record<string, string> = {}
  if (!formData.value.title.trim()) e.title = 'El título es obligatorio'
  if (!formData.value.description.trim()) e.description = 'La descripción es obligatoria'
  errors.value = e
  return Object.keys(e).length === 0
}

function toPayload() {
  return {
    ...formData.value,
    attentionDate: formData.value.attentionDate ? formData.value.attentionDate.toISOString() : null
  }
}

async function onSubmit() {
  if (!validate()) return
  loading.value = true
  try {
    if (isEdit.value && route.params.id) {
      await ticketsStore.update(String(route.params.id), toPayload())
    } else {
      await ticketsStore.create(toPayload())
    }
    router.push('/tickets')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadBuildings()
  if (route.name === 'TicketEdit' && route.params.id) {
    loadExistingTicket()
  }
})
</script>

<template>
  <BaseLayout>
    <div class="ticket-form-page">
      <div class="flex-between mb-lg">
        <h2>{{ isEdit ? 'Editar Ticket' : 'Nuevo Ticket' }}</h2>
      </div>

      <BaseCard>
        <form @submit.prevent="onSubmit" class="flex flex-column gap-md">
          <div>
            <label>Título *</label>
            <InputText v-model="formData.title" class="w-full" placeholder="Título del ticket" />
            <span v-if="errors.title" class="text-small text-danger">{{ errors.title }}</span>
          </div>
          <div>
            <label>Descripción *</label>
            <Textarea v-model="formData.description" class="w-full" rows="4" placeholder="Descripción detallada del problema" />
            <span v-if="errors.description" class="text-small text-danger">{{ errors.description }}</span>
          </div>
          <div class="grid grid-nocol gutters gap-md">
            <div>
              <label>Edificio</label>
              <Dropdown v-model="formData.buildingId" :options="buildings" optionLabel="name" optionValue="id" placeholder="Seleccionar edificio" class="w-full" />
            </div>
            <div>
              <label>Nombre del Edificio (alternativo)</label>
              <InputText v-model="formData.buildingName" class="w-full" placeholder="Nombre alternativo" />
            </div>
          </div>
          <div>
            <label>Nombre del Técnico</label>
            <InputText v-model="formData.technicianName" class="w-full" placeholder="Nombre del técnico asignado" />
          </div>
          <div class="grid grid-nocol gutters gap-md">
            <div>
              <label>Fecha de Atención</label>
              <DatePicker v-model="formData.attentionDate" class="w-full" dateFormat="dd/mm/yy" />
            </div>
            <div>
              <label>Prioridad</label>
              <Dropdown v-model="formData.priority" :options="priorityOptions" optionLabel="label" optionValue="value" class="w-full" />
            </div>
          </div>
          <div class="grid grid-nocol gutters gap-md">
            <div>
              <label>Estado</label>
              <Dropdown v-model="formData.status" :options="statusOptions" optionLabel="label" optionValue="value" class="w-full" />
            </div>
          </div>
          <div>
            <label>Recomendaciones</label>
            <Textarea v-model="formData.recommendations" class="w-full" rows="3" placeholder="Recomendaciones" />
          </div>
          <div>
            <label>Observaciones</label>
            <Textarea v-model="formData.observations" class="w-full" rows="3" placeholder="Observaciones" />
          </div>
          <div class="flex-center gap-md mt-md">
            <BaseButton :label="loading ? 'Guardando...' : 'Guardar'" icon="mdi-content-save" severity="primary" :loading="loading" type="submit" />
            <BaseButton label="Cancelar" icon="mdi-cancel" severity="secondary" @click="router.push('/tickets')" />
          </div>
        </form>
      </BaseCard>
    </div>
  </BaseLayout>
</template>

<style scoped>
.ticket-form-page { max-width: 800px; margin: 0 auto; padding: var(--spacing-lg); }
.ticket-form-page label { display: block; font-size: var(--font-size-sm); font-weight: 600; margin-bottom: 4px; color: var(--gray-700); }
</style>
