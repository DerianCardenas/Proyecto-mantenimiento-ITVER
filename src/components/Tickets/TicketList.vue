<script setup lang="ts">
import {ref,computed,onMounted} from 'vue'
import {useRouter} from 'vue-router'
import {useToast} from 'primevue/usetoast'
import {useTicketsStore} from '@/stores/tickets'
import {useConfirmDialog} from '@/composables/useConfirmDialog'
import BaseButton from '@/components/common/BaseButton.vue'
import TicketCard from '@/components/Tickets/TicketCard.vue'
import type {FilterState} from '@/stores/tickets'
const ticketsStore=useTicketsStore(),router=useRouter(),toast=useToast(),{confirm}=useConfirmDialog()
const statusFilter=ref(''),priorityFilter=ref(''),buildingFilter=ref(''),technicianFilter=ref(''),searchQuery=ref('')
const statusOptions=[{label:'Todos los estados',value:''},{label:'Pendiente',value:'pending'},{label:'En progreso',value:'in_progress'},{label:'Resuelto',value:'resolved'},{label:'Cerrado',value:'closed'},{label:'Cancelado',value:'cancelled'}]
const priorityOptions=[{label:'Todas las prioridades',value:''},{label:'Baja',value:'low'},{label:'Media',value:'medium'},{label:'Alta',value:'high'},{label:'Urgente',value:'urgent'}]
const visibleTickets=computed(()=>{const q=searchQuery.value.trim().toLocaleLowerCase('es-MX');return q?ticketsStore.tickets.filter(t=>[t.title,t.description,t.buildingName||'',t.technicianName||''].some(v=>v.toLocaleLowerCase('es-MX').includes(q))):ticketsStore.tickets})
function applyFilters(){const f:FilterState={status:statusFilter.value||null,priority:priorityFilter.value||null,buildingName:buildingFilter.value||null,technicianName:technicianFilter.value||null};ticketsStore.setFilters(f);ticketsStore.loadTickets(f as any)}
function resetFilters(){statusFilter.value='';priorityFilter.value='';buildingFilter.value='';technicianFilter.value='';searchQuery.value='';applyFilters()}
async function handleDelete(id:string){const accepted=await confirm({title:'Eliminar ticket',message:'Esta acción eliminará el ticket y sus datos asociados. ¿Deseas continuar?',confirmLabel:'Eliminar ticket',danger:true});if(!accepted)return;try{await ticketsStore.remove(id);toast.add({severity:'success',summary:'Ticket eliminado',life:3000})}catch(error){toast.add({severity:'error',summary:'No se pudo eliminar el ticket',detail:error instanceof Error?error.message:'Inténtalo de nuevo.',life:4500})}}
onMounted(()=>ticketsStore.loadTickets())
</script>
<template><section>
<div class="page-heading"><div><h2>Tickets de mantenimiento</h2><p>Busca solicitudes y filtra por estado, prioridad o responsable.</p></div><div class="page-heading-actions"><BaseButton label="Nuevo ticket" icon="fa-solid fa-plus" severity="primary" @click="router.push({name:'TicketNew'})"/></div></div>
<section class="base-card filter-panel" aria-label="Filtros de tickets"><div class="filter-toolbar"><div class="filter-fields">
<div class="filter-field search-field"><label for="ticket-search">Buscar</label><i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i><InputText id="ticket-search" v-model="searchQuery" placeholder="Título, edificio o técnico" class="w-full"/></div>
<div class="filter-field"><label for="ticket-status">Estado</label><Dropdown id="ticket-status" v-model="statusFilter" :options="statusOptions" optionLabel="label" optionValue="value" class="w-full" @change="applyFilters"/></div>
<div class="filter-field"><label for="ticket-priority">Prioridad</label><Dropdown id="ticket-priority" v-model="priorityFilter" :options="priorityOptions" optionLabel="label" optionValue="value" class="w-full" @change="applyFilters"/></div>
<div class="filter-field"><label for="ticket-building">Edificio</label><InputText id="ticket-building" v-model="buildingFilter" placeholder="Cualquier edificio" class="w-full" @input="applyFilters"/></div>
<div class="filter-field"><label for="ticket-technician">Técnico</label><InputText id="ticket-technician" v-model="technicianFilter" placeholder="Cualquier técnico" class="w-full" @input="applyFilters"/></div>
</div><button class="filter-clear" type="button" @click="resetFilters">Limpiar filtros</button></div></section>
<div class="results-caption" aria-live="polite">{{visibleTickets.length}} {{visibleTickets.length===1?'ticket encontrado':'tickets encontrados'}}</div>
<div v-if="ticketsStore.loading" class="empty-state" role="status"><ProgressSpinner/><p class="mt-md">Cargando tickets…</p></div>
<div v-else-if="!visibleTickets.length" class="empty-state"><i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i><h3>No se encontraron tickets</h3><p>Prueba con otros términos o limpia los filtros para volver a ver todas las solicitudes.</p><button class="filter-clear mt-sm" type="button" @click="resetFilters">Limpiar búsqueda y filtros</button></div>
<div v-else class="ticket-grid"><TicketCard v-for="ticket in visibleTickets" :key="ticket.id" :ticket="ticket" @view="router.push({name:'TicketDetail',params:{id:$event}})" @edit="router.push({name:'TicketEdit',params:{id:$event}})" @delete="handleDelete"/></div>
</section></template>
