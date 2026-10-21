<script setup lang="ts">
import {computed} from 'vue'
import {useTicketsStore} from '@/stores/tickets'
const ticketsStore=useTicketsStore()
const stats=computed(()=>({total:ticketsStore.tickets.length,pending:ticketsStore.tickets.filter(t=>t.status==='pending').length,resolved:ticketsStore.tickets.filter(t=>t.status==='resolved').length,thisMonth:ticketsStore.tickets.filter(t=>{const d=new Date(t.createdAt),n=new Date();return d.getMonth()===n.getMonth()&&d.getFullYear()===n.getFullYear()}).length}))
</script>
<template><section class="stats-cards" aria-label="Resumen de tickets">
<article class="stat-card"><div class="stat-icon stat-icon--tickets"><i class="fa-solid fa-ticket" aria-hidden="true"></i></div><div><span class="stat-value">{{stats.total}}</span><span class="stat-label">Tickets registrados</span></div></article>
<article class="stat-card"><div class="stat-icon stat-icon--pending"><i class="fa-regular fa-clock" aria-hidden="true"></i></div><div><span class="stat-value">{{stats.pending}}</span><span class="stat-label">Pendientes</span></div></article>
<article class="stat-card"><div class="stat-icon stat-icon--resolved"><i class="fa-solid fa-circle-check" aria-hidden="true"></i></div><div><span class="stat-value">{{stats.resolved}}</span><span class="stat-label">Resueltos</span></div></article>
<article class="stat-card"><div class="stat-icon stat-icon--month"><i class="fa-regular fa-calendar" aria-hidden="true"></i></div><div><span class="stat-value">{{stats.thisMonth}}</span><span class="stat-label">Ingresados este mes</span></div></article>
</section></template>
