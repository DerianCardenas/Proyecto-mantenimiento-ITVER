<script setup lang="ts">
import {onMounted,computed} from 'vue'
import {useRouter} from 'vue-router'
import BaseLayout from '@/components/common/BaseLayout.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import StatsCards from '@/components/Dashboard/StatsCards.vue'
import TicketCard from '@/components/Tickets/TicketCard.vue'
import {useTicketsStore} from '@/stores/tickets'
import {useAuthStore} from '@/stores/auth'
const router=useRouter(),ticketsStore=useTicketsStore(),authStore=useAuthStore()
const greeting=computed(()=>{const h=new Date().getHours();return h<12?'Buenos días':h<19?'Buenas tardes':'Buenas noches'})
onMounted(()=>ticketsStore.loadTickets())
</script>
<template><BaseLayout>
<div class="page-heading"><div><h2>{{greeting}}, {{authStore.user?.fullName?.split(' ')[0]||'bienvenido'}}</h2><p>Consulta el estado de las solicitudes de mantenimiento.</p></div><div class="page-heading-actions"><BaseButton label="Crear ticket" icon="fa-solid fa-plus" severity="primary" @click="router.push({name:'TicketNew'})"/></div></div>
<StatsCards/><section><div class="section-heading"><h3>Tickets recientes</h3><RouterLink to="/tickets" class="section-link">Ver todos <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></RouterLink></div>
<div v-if="ticketsStore.loading" class="empty-state" role="status"><ProgressSpinner/><p class="mt-md">Cargando tickets…</p></div>
<div v-else-if="!ticketsStore.tickets.length" class="empty-state"><i class="fa-regular fa-folder-open" aria-hidden="true"></i><h3>Aún no hay tickets</h3><p>Cuando se registre una solicitud, aparecerá aquí para que puedas darle seguimiento.</p><BaseButton label="Crear primer ticket" icon="fa-solid fa-plus" severity="primary" class="mt-md" @click="router.push({name:'TicketNew'})"/></div>
<div v-else class="ticket-grid"><TicketCard v-for="ticket in ticketsStore.tickets.slice(0,8)" :key="ticket.id" :ticket="ticket" @view="router.push({name:'TicketDetail',params:{id:$event}})"/></div></section>
</BaseLayout></template>
