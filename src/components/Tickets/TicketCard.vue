<script setup lang="ts">
import { ref, defineProps } from 'vue'
import { useRouter } from 'vue-router'
import { useTicketsStore } from '@/stores/tickets'
import type { Ticket } from '@/types'

const props = defineProps<{ ticket: Ticket }>()
const emit = defineEmits<{(e: 'view', id: string): void; (e: 'edit', id: string): void; (e: 'delete', id: string): void }>()

const router = useRouter()
const ticketsStore = useTicketsStore()

function handleView() { emit('view', props.ticket.id) }
function handleEdit() { emit('edit', props.ticket.id) }
function handleDelete() { emit('delete', props.ticket.id) }

const statusColors: Record<string, string> = {
  open: 'warning', in_progress: 'info', resolved: 'success', closed: 'secondary'
}
const priorityColors: Record<string, string> = {
  low: 'info', medium: 'warning', high: 'danger', critical: 'danger'
}
</script>

<template>
  <div class="ticket-card" @click="handleView">
    <div class="ticket-card-header flex-between">
      <h3 class="ticket-title">{{ ticket.title }}</h3>
      <span :class="['badge', 'badge-' + (statusColors[ticket.status] || 'info')]">
        {{ ticket.status }}
      </span>
    </div>
    <div class="ticket-card-body">
      <div class="flex-center gap-sm mt-sm">
        <span :class="['badge', 'badge-' + (priorityColors[ticket.priority] || 'info')]">
          {{ ticket.priority }}
        </span>
        <span class="text-small text-muted">|</span>
        <span class="text-small text-muted">{{ ticket.buildingName || 'Sin edificio' }}</span>
      </div>
      <div v-if="ticket.technicianName" class="text-small text-muted mt-sm">
        <span class="material-symbols-rounded" style="font-size: 16px;">person</span>
        {{ ticket.technicianName }}
      </div>
      <div v-if="ticket.attentionDate" class="text-small text-muted">
        {{ new Date(ticket.attentionDate).toLocaleDateString('es-MX') }}
      </div>
    </div>
    <div class="ticket-card-actions flex-between">
      <div class="flex-center gap-sm">
        <Button icon="mdi-eye" text small @click.stop="handleView" title="Ver" />
        <Button icon="mdi-pencil" text small @click.stop="handleEdit" title="Editar" />
        <Button icon="mdi-delete" text small severity="danger" @click.stop="handleDelete" title="Eliminar" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.ticket-card {
  background: var(--white);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-sm);
  padding: var(--spacing-md);
  cursor: pointer;
  transition: box-shadow var(--transition-fast);
  border: 1px solid var(--gray-200);
}
.ticket-card:hover { box-shadow: var(--shadow-md); }
.ticket-card-header { margin-bottom: var(--spacing-sm); }
.ticket-title { font-size: var(--font-size-lg); margin: 0; }
.ticket-card-body { padding: var(--spacing-sm) 0; }
.ticket-card-actions { padding-top: var(--spacing-sm); border-top: 1px solid var(--gray-200); }
</style>
