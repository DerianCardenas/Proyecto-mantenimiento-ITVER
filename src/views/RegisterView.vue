<script setup lang="ts">
import {onMounted} from 'vue'
import {useRouter} from 'vue-router'
import {useAuth} from '@/composables/useAuth'
import RegisterForm from '@/components/Auth/RegisterForm.vue'
import ThemeToggle from '@/components/common/ThemeToggle.vue'
const {isAuthenticated}=useAuth(),router=useRouter()
onMounted(()=>{if(isAuthenticated.value)router.push({name:'Dashboard'})})
</script>
<template><div class="auth-page"><aside class="auth-aside"><div class="auth-brand"><div class="brand-mark"><i class="fa-solid fa-screwdriver-wrench" aria-hidden="true"></i></div><div><div class="auth-brand-name">SGM-ITVER</div><div class="auth-brand-caption">Gestión de mantenimiento</div></div></div><div class="auth-aside-content"><h1>Un espacio de trabajo más claro para cada solicitud.</h1><p>Registra y consulta el avance de las tareas de mantenimiento desde una plataforma centralizada.</p></div><div class="auth-aside-note">Instituto Tecnológico de Veracruz · {{new Date().getFullYear()}}</div></aside><main class="auth-main"><div class="auth-theme-control"><ThemeToggle/></div><RegisterForm @registered="router.push({name:'Login'})"/></main></div></template>
