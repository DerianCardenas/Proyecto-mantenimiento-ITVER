<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useTicketsStore } from '@/stores/tickets'
import BaseCard from '@/components/common/BaseCard.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import TicketCard from '@/components/Tickets/TicketCard.vue'
import type { FilterState } from '@/stores/tickets'

const ticketsStore = useTicketsStore()
const router = useRouter()

const statusFilter = ref('')
const priorityFilter = ref('')
const buildingFilter = ref('')
const technicianFilter = ref('')
const searchQuery = ref('')

const statusOptions = [
  { label: 'Todos', value: '' },
  { label: 'Abierto', value: 'open' },
  { label: 'En progreso', value: 'in_progress' },
  { label: 'Resuelto', value: 'resolved' },
  { label: 'Cerrado', value: 'closed' }
]

const priorityOptions = [
  { label: 'Todas', value: '' },
  { label: 'Baja', value: 'low' },
  { label: 'Media', value: 'medium' },
  { label: 'Alta', value: 'high' },
  { label: 'Crítica', value: 'critical' }
]

function applyFilters() {
  const filters: FilterState = {
    status: statusFilter.value || null,
    priority: priorityFilter.value || null,
    building: buildingFilter.value || null,
    technician: technicianFilter.value || null
  }
  ticketsStore.setFilters(filters)
  ticketsStore.loadTickets(filters as any)
}

function handleNew() {
  router.push({ name: 'TicketNew' })
}

function handleEdit(ticketId: string) {
  router.push({ name: 'TicketEdit', params: { id: ticketId } })
}

function handleView(ticketId: string) {
  router.push({ name: 'TicketDetail', params: { id: ticketId } })
}

function handleDelete(ticketId: string) {
  if (confirm('¿Seguro que deseas eliminar este ticket?')) {
    ticketsStore.remove(ticketId)
  }
}

onMounted(() => {
  ticketsStore.loadTickets()
})
</script>

<template>
  <div class="ticket-list-page">
    <div class="flex-between mb-md">
      <h2>Tickets</h2>
      <BaseButton label="Nuevo Ticket" icon="mdi-plus" severity="primary" @click="handleNew" />
    </div>

    <BaseCard class="mb-md">
      <template #icon>
        <span class="material-symbols-rounded">filter_list</span>
      </template>
      <div class="filters-grid">
        <div>
          <label class="text-small text-muted">Estado</label>
          <Dropdown v-model="statusFilter" :options="statusOptions" optionLabel="label" optionValue="value" class="w-full" @change="applyFilters" />
        </div>
        <div>
          <label class="text-small text-muted">Prioridad</label>
          <Dropdown v-model="priorityFilter" :options="priorityOptions" optionLabel="label" optionValue="value" class="w-full" @change="applyFilters" />
        </div>
        <div>
          <label class="text-small text-muted">Edificio</label>
          <InputText v-model="buildingFilter" placeholder="Buscar..." class="w-full" @input="applyFilters" />
        </div>
        <div>
          <label class="text-small text-muted">Técnico</label>
          <InputText v-model="technicianFilter" placeholder="Buscar..." class="w-full" @input="applyFilters" />
        </div>
      </div>
    </BaseCard>

    <div v-if="ticketsStore.loading" class="flex-center p-lg">
      <ProgressSpinner />
    </div>

    <div v-else-if="ticketsStore.tickets.length === 0" class="text-center p-lg text-muted">
      <span class="material-symbols-rounded" style="font-size: 48px;">search_off</span>
      <p class="mt-md">No se encontraron tickets</p>
    </div>

    <div v-else class="ticket-grid">
      <TicketCard
        v-for="ticket in ticketsStore.tickets"
        :key="ticket.id"
        :ticket="ticket"
        @view="handleView"
        @edit="handleEdit"
        @delete="handleDelete"
      />
    </div>
  </div>
</template>

<style scoped>
.ticket-list-page { padding: var(--spacing-lg); }
.filters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: var(--spacing-md);
}
.filters-grid label { display: block; margin-bottom: 4px; }
.ticket-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: var(--spacing-md);
}
</style>
