<script setup lang="ts">
import {computed} from 'vue'
import {useRoute,useRouter} from 'vue-router'
import {useAuthStore} from '@/stores/auth'
import ThemeToggle from './ThemeToggle.vue'
defineProps<{title?:string;icon?:string}>()
const route=useRoute(),router=useRouter(),authStore=useAuthStore()
const pageTitles: Record<string,string> = {Dashboard:'Panel de control',Tickets:'Gestión de tickets',TicketNew:'Nuevo ticket',TicketEdit:'Editar ticket',TicketDetail:'Detalle del ticket',Technicians:'Técnicos'}
const pageTitle=computed(()=>pageTitles[String(route.name)]||'SGM-ITVER')
const userName=computed(()=>authStore.user?.fullName||'Usuario')
const initials=computed(()=>userName.value.split(/\s+/).filter(Boolean).slice(0,2).map(part=>part[0]?.toUpperCase()).join(''))
const roleLabels: Record<string,string> = {admin:'Administrador',technician:'Técnico',receptionist:'Recepción'}
const roleLabel=computed(()=>roleLabels[authStore.userRole]||'Personal')
function handleLogout(){authStore.logout();router.push({name:'Login'})}
</script>
<template>
<div class="app-shell">
<aside class="app-sidebar" aria-label="Navegación principal">
<div class="brand-lockup"><div class="brand-mark"><i class="fa-solid fa-screwdriver-wrench" aria-hidden="true"></i></div><div class="brand-copy"><span class="brand-name">SGM-ITVER</span><span class="brand-caption">Mantenimiento</span></div></div>
<div class="nav-caption">Menú principal</div><nav class="primary-nav"><RouterLink to="/" class="nav-item"><i class="fa-solid fa-chart-pie" aria-hidden="true"></i><span>Panel de control</span></RouterLink><RouterLink to="/tickets" class="nav-item"><i class="fa-solid fa-ticket" aria-hidden="true"></i><span>Tickets</span></RouterLink><RouterLink v-if="authStore.isAdmin" to="/technicians" class="nav-item"><i class="fa-solid fa-user-gear" aria-hidden="true"></i><span>Técnicos</span></RouterLink></nav>
<div class="sidebar-spacer"></div><div class="sidebar-user"><div class="user-avatar" aria-hidden="true">{{initials}}</div><div class="sidebar-user-copy"><div class="sidebar-user-name">{{userName}}</div><div class="sidebar-user-role">{{roleLabel}}</div></div><button class="logout-button" type="button" aria-label="Cerrar sesión" title="Cerrar sesión" @click="handleLogout"><i class="fa-solid fa-arrow-right-from-bracket" aria-hidden="true"></i></button></div>
</aside>
<div class="app-main"><header class="topbar"><div><div class="topbar-kicker">Sistema de Gestión de Mantenimiento · ITVER</div><h1>{{pageTitle}}</h1></div><div class="topbar-actions"><ThemeToggle/><div class="topbar-user"><div class="user-avatar" aria-hidden="true">{{initials}}</div><div class="topbar-user-copy"><div class="topbar-user-name">{{userName}}</div><div class="sidebar-user-role">{{roleLabel}}</div></div></div><button class="logout-button topbar-logout" type="button" aria-label="Cerrar sesión" title="Cerrar sesión" @click="handleLogout"><i class="fa-solid fa-arrow-right-from-bracket" aria-hidden="true"></i></button></div></header>
<main class="main-content"><slot/></main><footer class="layout-footer">SGM-ITVER · Instituto Tecnológico de Veracruz · {{new Date().getFullYear()}}</footer></div>
<nav :class="['mobile-nav', {'has-technicians': authStore.isAdmin}]" aria-label="Navegación móvil"><RouterLink to="/" class="nav-item"><i class="fa-solid fa-chart-pie" aria-hidden="true"></i><span>Inicio</span></RouterLink><RouterLink to="/tickets" class="nav-item"><i class="fa-solid fa-ticket" aria-hidden="true"></i><span>Tickets</span></RouterLink><RouterLink v-if="authStore.isAdmin" to="/technicians" class="nav-item"><i class="fa-solid fa-user-gear" aria-hidden="true"></i><span>Técnicos</span></RouterLink></nav>
</div>
</template>
