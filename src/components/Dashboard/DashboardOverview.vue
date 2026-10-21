<script setup lang="ts">
import {onMounted} from 'vue'
import BaseLayout from '@/components/common/BaseLayout.vue'
import StatsCards from '@/components/Dashboard/StatsCards.vue'
import TicketCard from '@/components/Tickets/TicketCard.vue'
import {useTicketsStore} from '@/stores/tickets'
const ticketsStore=useTicketsStore()
onMounted(()=>ticketsStore.loadTickets())
</script>
<template><BaseLayout><StatsCards/><section class="mt-lg"><div class="section-heading"><h3>Tickets recientes</h3><RouterLink to="/tickets" class="section-link">Ver todos <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></RouterLink></div><div v-if="!ticketsStore.tickets.length" class="empty-state"><i class="fa-regular fa-folder-open" aria-hidden="true"></i><h3>Aún no hay tickets</h3><p>Las solicitudes registradas aparecerán aquí.</p></div><div v-else class="ticket-grid"><TicketCard v-for="ticket in ticketsStore.tickets.slice(0,10)" :key="ticket.id" :ticket="ticket" @view="$router.push({name:'TicketDetail',params:{id:$event}})"/></div></section></BaseLayout></template>
