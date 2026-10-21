<script setup lang="ts">
import {defineProps} from 'vue'
import type {Ticket} from '@/types'
import {formatDateOnly} from '@/utils/dates'
const props=defineProps<{ticket:Ticket}>()
const emit=defineEmits<{(e:'view',id:string):void;(e:'edit',id:string):void;(e:'delete',id:string):void}>()
const statusLabels:Record<string,string>={pending:'Pendiente',in_progress:'En progreso',resolved:'Resuelto',closed:'Cerrado',cancelled:'Cancelado'}
const priorityLabels:Record<string,string>={low:'Baja',medium:'Media',high:'Alta',urgent:'Urgente'}
function handleView(){emit('view',props.ticket.id)}
</script>
<template><article class="ticket-card" tabindex="0" @click="handleView" @keydown.enter.self="handleView" @keydown.space.self.prevent="handleView">
<div class="ticket-card-header"><h3 class="ticket-title">{{ticket.title}}</h3><span :class="['status-chip','is-'+ticket.status]">{{statusLabels[ticket.status]||ticket.status}}</span></div>
<div class="ticket-card-meta"><span :class="['priority-chip','is-'+ticket.priority]">{{priorityLabels[ticket.priority]||ticket.priority}}</span><span class="ticket-card-location"><i class="fa-regular fa-building" aria-hidden="true"></i>{{ticket.buildingName||'Edificio sin especificar'}}</span></div>
<div v-if="ticket.technicianName" class="ticket-card-technician"><i class="fa-solid fa-user-gear" aria-hidden="true"></i><span>{{ticket.technicianName}}</span></div>
<div v-if="ticket.attentionDate" class="ticket-card-date"><i class="fa-regular fa-calendar-check" aria-hidden="true"></i><span>Atención: {{formatDateOnly(ticket.attentionDate,{day:'numeric',month:'short',year:'numeric'})}}</span></div>
<div class="ticket-card-actions"><Button icon="fa-regular fa-eye" text rounded aria-label="Ver ticket" title="Ver ticket" @click.stop="emit('view',ticket.id)"/><Button icon="fa-regular fa-pen-to-square" text rounded aria-label="Editar ticket" title="Editar ticket" @click.stop="emit('edit',ticket.id)"/><Button icon="fa-regular fa-trash-can" text rounded severity="danger" aria-label="Eliminar ticket" title="Eliminar ticket" @click.stop="emit('delete',ticket.id)"/></div>
</article></template>
