<script setup lang="ts">
import {onMounted} from 'vue'
import {useRouter} from 'vue-router'
import {useAuth} from '@/composables/useAuth'
import LoginForm from '@/components/Auth/LoginForm.vue'
import ThemeToggle from '@/components/common/ThemeToggle.vue'
const {isAuthenticated}=useAuth(),router=useRouter()
onMounted(()=>{if(isAuthenticated.value)router.push({name:'Dashboard'})})
</script>
<template><div class="auth-page"><aside class="auth-aside"><div class="auth-brand"><div class="brand-mark"><i class="fa-solid fa-screwdriver-wrench" aria-hidden="true"></i></div><div><div class="auth-brand-name">SGM-ITVER</div><div class="auth-brand-caption">Gestión de mantenimiento</div></div></div><div class="auth-aside-content"><h1>Espacios en condiciones, servicios al día.</h1><p>Organiza y da seguimiento a las solicitudes de mantenimiento del Instituto Tecnológico de Veracruz.</p></div><div class="auth-aside-note">Instituto Tecnológico de Veracruz · {{new Date().getFullYear()}}</div></aside><main class="auth-main"><div class="auth-theme-control"><ThemeToggle/></div><LoginForm @login-success="router.push({name:'Dashboard'})"/></main></div></template>
