<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useTicketsStore } from '@/stores/tickets'
import { useTicketService } from '@/services/ticket.service'
import BaseLayout from '@/components/common/BaseLayout.vue'
import BaseCard from '@/components/common/BaseCard.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import DocumentUpload from '@/components/Tickets/DocumentUpload.vue'
import type { Ticket } from '@/types'

const ticketsStore = useTicketsStore()
const router = useRouter()
const route = useRoute()
const { getBuildings } = useTicketService()

const ticket = ref<Ticket | null>(null)
const documents = ref<any[]>([])
const loading = ref(false)
const statusChanging = ref(false)

const statusOptions = [
  { label: 'Pendiente', value: 'pending' },
  { label: 'En progreso', value: 'in_progress' },
  { label: 'Resuelto', value: 'resolved' },
  { label: 'Cerrado', value: 'closed' },
  { label: 'Cancelado', value: 'cancelled' }
]

async function loadData() {
  loading.value = true
  try {
    await ticketsStore.loadTicket(String(route.params.id))
    ticket.value = ticketsStore.currentTicket
    documents.value = await ticketsStore.listDocuments(String(route.params.id))
  } finally {
    loading.value = false
  }
}

async function changeStatus(status: string) {
  statusChanging.value = true
  try {
    await ticketsStore.changeStatus(String(route.params.id), status)
    ticket.value = ticketsStore.currentTicket
  } finally {
    statusChanging.value = false
  }
}

onMounted(() => { loadData() })
</script>

<template>
  <BaseLayout>
    <div v-if="loading" class="flex-center p-lg"><ProgressSpinner /></div>

    <div v-else-if="ticket" class="ticket-detail">
      <div class="flex-between mb-md">
        <div class="flex-center gap-sm">
          <BaseButton label="Volver" icon="mdi-arrow-left" severity="secondary" @click="router.push('/tickets')" />
          <h2>{{ ticket.title }}</h2>
        </div>
        <div class="flex-center gap-sm">
          <RouterLink :to="{ name: 'TicketEdit', params: { id: ticket.id } }">
            <Button icon="mdi-pencil" severity="secondary" outlined />
          </RouterLink>
        </div>
      </div>

      <div class="grid grid-nocol gutters gap-md">
        <div class="col-12 md:col-8">
          <BaseCard title="Información del Ticket" icon="info">
            <div class="detail-grid">
              <div><strong>Estado:</strong> <span :class="'badge badge-' + (ticket.status === 'pending' ? 'warning' : ticket.status === 'resolved' ? 'success' : 'info')">{{ ticket.status }}</span></div>
              <div><strong>Prioridad:</strong> <span :class="'badge badge-' + (ticket.priority === 'high' || ticket.priority === 'urgent' ? 'danger' : ticket.priority === 'medium' ? 'warning' : 'info')">{{ ticket.priority }}</span></div>
              <div><strong>Edificio:</strong> {{ ticket.buildingName || 'N/A' }}</div>
              <div><strong>Técnico:</strong> {{ ticket.technicianName || 'No asignado' }}</div>
              <div><strong>Fecha de atención:</strong> {{ ticket.attentionDate || 'Pendiente' }}</div>
              <div><strong>Creado:</strong> {{ new Date(ticket.createdAt).toLocaleDateString('es-MX') }}</div>
            </div>
            <div class="mt-md"><strong>Descripción:</strong><p>{{ ticket.description }}</p></div>
            <div v-if="ticket.recommendations" class="mt-md"><strong>Recomendaciones:</strong><p>{{ ticket.recommendations }}</p></div>
            <div v-if="ticket.observations" class="mt-md"><strong>Observaciones:</strong><p>{{ ticket.observations }}</p></div>
          </BaseCard>

          <div class="mt-lg">
            <h4 class="mb-sm">Cambiar Estado</h4>
            <div class="flex-center gap-sm">
              <Button v-for="s in statusOptions" :key="s.value" :label="s.label"
                :severity="s.value === 'resolved' ? 'success' : s.value === 'closed' ? 'secondary' : 'primary'"
                :loading="statusChanging" @click="changeStatus(s.value)" />
            </div>
          </div>

          <div class="mt-lg">
            <h4 class="mb-sm">Documentos</h4>
            <DocumentUpload :ticketId="ticket.id" :documents="documents" />
          </div>
        </div>

        <div class="col-12 md:col-4">
          <BaseCard title="Resumen" icon="summary">
            <div class="flex flex-column gap-sm">
              <div class="text-small text-muted">ID: {{ ticket.id }}</div>
              <div class="text-small text-muted">Creado por: {{ ticket.createdBy || 'N/A' }}</div>
              <div class="text-small text-muted">Asignado a: {{ ticket.assignedTo || 'N/A' }}</div>
              <div class="text-small text-muted">Actualizado: {{ new Date(ticket.updatedAt).toLocaleDateString('es-MX') }}</div>
            </div>
          </BaseCard>
        </div>
      </div>
    </div>
  </BaseLayout>
</template>

<style scoped>
.ticket-detail { padding: var(--spacing-lg); }
.detail-grid { display: grid; gap: var(--spacing-sm); }
</style>
