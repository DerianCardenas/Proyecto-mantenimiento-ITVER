<script setup lang="ts">
import { onMounted } from 'vue'
import BaseLayout from '@/components/common/BaseLayout.vue'
import StatsCards from '@/components/Dashboard/StatsCards.vue'
import TicketCard from '@/components/Tickets/TicketCard.vue'
import { useTicketsStore } from '@/stores/tickets'

const ticketsStore = useTicketsStore()

onMounted(() => {
  ticketsStore.loadTickets()
})
</script>

<template>
  <BaseLayout>
    <StatsCards />
    <div class="mt-lg">
      <h3 class="mb-md">Tickets Recientes</h3>
      <div v-if="ticketsStore.tickets.length === 0" class="text-center p-lg text-muted">
        <span class="material-symbols-rounded" style="font-size: 48px;">inventory</span>
        <p class="mt-md">No hay tickets aún</p>
      </div>
      <div v-else class="ticket-grid">
        <TicketCard v-for="t in ticketsStore.tickets.slice(0, 10)" :key="t.id" :ticket="t" @view="$router.push({ name: 'TicketDetail', params: { id: t.id } })" />
      </div>
    </div>
  </BaseLayout>
</template>

<style scoped>
.ticket-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: var(--spacing-md); }
</style>
