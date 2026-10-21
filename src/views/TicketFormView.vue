<script setup lang="ts">
import {ref,onMounted} from 'vue'
import {useRouter,useRoute} from 'vue-router'
import {useTicketsStore} from '@/stores/tickets'
import {useTicketService} from '@/services/ticket.service'
import BaseLayout from '@/components/common/BaseLayout.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import { technicianService } from '@/services/technician.service'
import { parseDateOnly, toDateOnly } from '@/utils/dates'
import type { User, Ticket } from '@/types'
import type {TicketStatus,TicketPriority} from '@/types'
const ticketsStore=useTicketsStore(),router=useRouter(),route=useRoute(),{getBuildings}=useTicketService()
const formData=ref({title:'',description:'',buildingId:null as number|null,buildingName:'',technicianName:'',assignedTo:null as string|null,attentionDate:null as Date|null,recommendations:'',observations:'',priority:'medium' as TicketPriority,status:'pending' as TicketStatus})
const buildings=ref<any[]>([]),technicians=ref<User[]>([]),initialAssignedTo=ref<string|null>(null),errors=ref<Record<string,string>>({}),loading=ref(false),isEdit=ref(false)
const priorityOptions=[{label:'Baja',value:'low'},{label:'Media',value:'medium'},{label:'Alta',value:'high'},{label:'Urgente',value:'urgent'}],statusOptions=[{label:'Pendiente',value:'pending'},{label:'En progreso',value:'in_progress'},{label:'Resuelto',value:'resolved'},{label:'Cerrado',value:'closed'},{label:'Cancelado',value:'cancelled'}]
async function loadBuildings(){buildings.value=await getBuildings()}
async function loadTechnicians(){technicians.value=await technicianService.list()}
async function loadExistingTicket(){await ticketsStore.loadTicket(String(route.params.id));const t=ticketsStore.currentTicket;if(t){formData.value={title:t.title,description:t.description,buildingId:t.buildingId,buildingName:t.buildingName||'',technicianName:t.technicianName||'',assignedTo:t.assignedTo||null,attentionDate:parseDateOnly(t.attentionDate),recommendations:t.recommendations||'',observations:t.observations||'',priority:t.priority,status:t.status};initialAssignedTo.value=t.assignedTo||null;isEdit.value=true}}
function validate(){const e:Record<string,string>={};if(!formData.value.title.trim())e.title='El título es obligatorio';if(!formData.value.description.trim())e.description='La descripción es obligatoria';errors.value=e;return !Object.keys(e).length}
function toPayload():Partial<Ticket>{const payload:Partial<Ticket>={...formData.value,attentionDate:toDateOnly(formData.value.attentionDate),technicianName:formData.value.technicianName||null};const selected=technicians.value.find((technician)=>technician.id===formData.value.assignedTo);if(isEdit.value&&formData.value.assignedTo===initialAssignedTo.value){delete payload.assignedTo;delete payload.technicianName}else{payload.assignedTo=formData.value.assignedTo;payload.technicianName=selected?.fullName||null}return payload}
async function onSubmit(){if(!validate())return;loading.value=true;try{if(isEdit.value&&route.params.id)await ticketsStore.update(String(route.params.id),toPayload());else await ticketsStore.create(toPayload());router.push('/tickets')}finally{loading.value=false}}
onMounted(()=>{loadBuildings();loadTechnicians();if(route.name==='TicketEdit'&&route.params.id)loadExistingTicket()})
</script>
<template><BaseLayout><section class="form-page">
<div class="page-heading"><div><h2>{{isEdit?'Editar ticket':'Registrar un ticket'}}</h2><p>Completa los datos para documentar y dar seguimiento a la solicitud.</p></div></div>
<form class="base-card form-card form-grid" @submit.prevent="onSubmit">
<div class="form-field form-field--full"><label for="ticket-title">Título <span aria-hidden="true">*</span></label><InputText id="ticket-title" v-model="formData.title" class="w-full" placeholder="Ej. Falla en equipo de climatización" :aria-invalid="!!errors.title"/><span v-if="errors.title" class="field-error" role="alert">{{errors.title}}</span></div>
<div class="form-field form-field--full"><label for="ticket-description">Descripción <span aria-hidden="true">*</span></label><Textarea id="ticket-description" v-model="formData.description" class="w-full" rows="4" placeholder="Describe el problema y cuándo comenzó." :aria-invalid="!!errors.description"/><span v-if="errors.description" class="field-error" role="alert">{{errors.description}}</span></div>
<div class="form-field"><label for="ticket-building">Edificio</label><Dropdown id="ticket-building" v-model="formData.buildingId" :options="buildings" optionLabel="name" optionValue="id" placeholder="Seleccionar edificio" class="w-full"/></div><div class="form-field"><label for="ticket-building-alt">Edificio alternativo</label><InputText id="ticket-building-alt" v-model="formData.buildingName" class="w-full" placeholder="Nombre del edificio"/></div>
<div class="form-field"><label for="ticket-technician">Técnico asignado</label><Dropdown id="ticket-technician" v-model="formData.assignedTo" :options="technicians" optionLabel="fullName" optionValue="id" filter filterPlaceholder="Buscar técnico" showClear class="w-full" placeholder="Seleccionar técnico"/></div><div class="form-field"><label for="ticket-date">Fecha de atención</label><DatePicker id="ticket-date" v-model="formData.attentionDate" class="w-full" dateFormat="dd/mm/yy" placeholder="Seleccionar fecha" showIcon iconDisplay="input"/></div>
<div class="form-field"><label for="ticket-priority">Prioridad</label><Dropdown id="ticket-priority" v-model="formData.priority" :options="priorityOptions" optionLabel="label" optionValue="value" class="w-full"/></div><div class="form-field"><label for="ticket-state">Estado</label><Dropdown id="ticket-state" v-model="formData.status" :options="statusOptions" optionLabel="label" optionValue="value" class="w-full"/></div>
<div class="form-field form-field--full"><label for="ticket-recommendations">Recomendaciones</label><Textarea id="ticket-recommendations" v-model="formData.recommendations" class="w-full" rows="3" placeholder="Acciones sugeridas para atender el caso."/></div><div class="form-field form-field--full"><label for="ticket-observations">Observaciones</label><Textarea id="ticket-observations" v-model="formData.observations" class="w-full" rows="3" placeholder="Notas adicionales sobre la solicitud."/></div>
<div class="form-actions form-field--full"><BaseButton label="Cancelar" icon="fa-solid fa-xmark" severity="secondary" type="button" @click="router.push('/tickets')"/><BaseButton :label="loading?'Guardando…':'Guardar ticket'" icon="fa-regular fa-floppy-disk" severity="primary" :loading="loading" type="submit"/></div>
</form></section></BaseLayout></template>
