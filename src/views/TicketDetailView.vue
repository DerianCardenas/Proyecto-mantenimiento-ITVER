<script setup lang="ts">
import {ref,onMounted} from 'vue'
import {useRouter,useRoute} from 'vue-router'
import {useToast} from 'primevue/usetoast'
import {useTicketsStore} from '@/stores/tickets'
import {useConfirmDialog} from '@/composables/useConfirmDialog'
import {formatDateOnly,formatDateTime} from '@/utils/dates'
import BaseLayout from '@/components/common/BaseLayout.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseCard from '@/components/common/BaseCard.vue'
import DocumentUpload from '@/components/Tickets/DocumentUpload.vue'
import type {Ticket,TicketStatus} from '@/types'
const ticketsStore=useTicketsStore(),router=useRouter(),route=useRoute(),toast=useToast(),{confirm}=useConfirmDialog()
const ticket=ref<Ticket|null>(null),documents=ref<any[]>([]),loading=ref(false),statusChanging=ref(false)
const statusOptions:{label:string;value:TicketStatus}[]=[{label:'Pendiente',value:'pending'},{label:'En progreso',value:'in_progress'},{label:'Resuelto',value:'resolved'},{label:'Cerrado',value:'closed'},{label:'Cancelado',value:'cancelled'}]
const priorityLabels:Record<string,string>={low:'Baja',medium:'Media',high:'Alta',urgent:'Urgente'}
async function loadData(){loading.value=true;try{await ticketsStore.loadTicket(String(route.params.id));ticket.value=ticketsStore.currentTicket;documents.value=await ticketsStore.listDocuments(String(route.params.id))}finally{loading.value=false}}
async function changeStatus(status:TicketStatus){if(!ticket.value||ticket.value.status===status)return;const label=statusOptions.find((option)=>option.value===status)?.label||status;const accepted=await confirm({title:'Cambiar estado del ticket',message:`¿Deseas cambiar el estado de este ticket a «${label}»?`,confirmLabel:'Cambiar estado'});if(!accepted)return;statusChanging.value=true;try{await ticketsStore.changeStatus(String(route.params.id),status);ticket.value=ticketsStore.currentTicket;toast.add({severity:'success',summary:'Estado actualizado',detail:`El ticket ahora está ${label.toLocaleLowerCase('es-MX')}.`,life:3200})}catch(error){toast.add({severity:'error',summary:'No se pudo cambiar el estado',detail:error instanceof Error?error.message:'Inténtalo de nuevo.',life:4500})}finally{statusChanging.value=false}}
onMounted(loadData)
</script>
<template><BaseLayout>
<div v-if="loading" class="empty-state" role="status"><ProgressSpinner/><p class="mt-md">Cargando información…</p></div>
<section v-else-if="ticket !== null" class="detail-page">
<div class="detail-title-row"><div class="detail-title"><BaseButton label="Volver" icon="fa-solid fa-arrow-left" severity="secondary" @click="router.push('/tickets')"/><div><span :class="['status-chip','is-'+ticket!.status]">{{statusOptions.find(o=>o.value===ticket!.status)?.label}}</span><h2>{{ticket!.title}}</h2></div></div><RouterLink :to="{name:'TicketEdit',params:{id:ticket!.id}}" aria-label="Editar ticket" title="Editar ticket"><Button icon="fa-regular fa-pen-to-square" severity="secondary" outlined aria-label="Editar ticket"/></RouterLink></div>
<div class="detail-layout"><div class="detail-stack">
<BaseCard title="Información de la solicitud" icon="fa-solid fa-circle-info">
<div class="detail-grid"><div><span class="detail-item-label">Estado</span><span :class="['status-chip','is-'+ticket!.status]">{{statusOptions.find(o=>o.value===ticket!.status)?.label}}</span></div><div><span class="detail-item-label">Prioridad</span><span :class="['priority-chip','is-'+ticket!.priority]">{{priorityLabels[ticket!.priority]||ticket!.priority}}</span></div><div><span class="detail-item-label">Edificio</span><span class="detail-item-value">{{ticket!.buildingName||'Sin especificar'}}</span></div><div><span class="detail-item-label">Técnico asignado</span><span class="detail-item-value">{{ticket!.technicianName||'Sin asignar'}}</span></div><div><span class="detail-item-label">Fecha de atención</span><span class="detail-item-value">{{formatDateOnly(ticket!.attentionDate,{day:'numeric',month:'long',year:'numeric'})}}</span></div><div><span class="detail-item-label">Fecha de creación</span><span class="detail-item-value">{{formatDateTime(ticket!.createdAt,{day:'numeric',month:'long',year:'numeric'})}}</span></div></div>
<div class="detail-description"><h4>Descripción</h4><p>{{ticket!.description}}</p></div><div v-if="ticket!.recommendations" class="detail-description"><h4>Recomendaciones</h4><p>{{ticket!.recommendations}}</p></div><div v-if="ticket!.observations" class="detail-description"><h4>Observaciones</h4><p>{{ticket!.observations}}</p></div>
</BaseCard>
<BaseCard title="Cambiar estado" icon="fa-solid fa-arrow-right-arrow-left"><div class="status-actions"><Button v-for="option in statusOptions" :key="option.value" :label="option.label" :severity="option.value===ticket.status?'primary':'secondary'" :outlined="option.value!==ticket.status" :disabled="statusChanging||option.value===ticket.status" :loading="statusChanging&&option.value!==ticket.status" @click="changeStatus(option.value)"/></div></BaseCard>
<BaseCard title="Documentos adjuntos" icon="fa-regular fa-folder-open"><DocumentUpload :ticketId="ticket.id" :documents="documents" @uploaded="loadData"/></BaseCard>
</div>
<BaseCard title="Resumen" icon="fa-solid fa-list-check"><div class="summary-list"><div class="summary-row"><span>ID del ticket</span><strong>{{ticket!.id}}</strong></div><div class="summary-row"><span>Creado por</span><strong>{{ticket!.createdBy||'No disponible'}}</strong></div><div class="summary-row"><span>Asignado a</span><strong>{{ticket!.technicianName||'Sin asignar'}}</strong></div><div class="summary-row"><span>Última actualización</span><strong>{{formatDateTime(ticket!.updatedAt,{day:'numeric',month:'long',year:'numeric'})}}</strong></div></div></BaseCard>
</div></section>
</BaseLayout></template>
