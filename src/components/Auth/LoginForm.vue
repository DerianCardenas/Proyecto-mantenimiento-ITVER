<script setup lang="ts">
import {ref} from 'vue'
import {useToast} from 'primevue/usetoast'
import {useAuth} from '@/composables/useAuth'
const emit=defineEmits<{(e:'login-success'):void}>(),{login}=useAuth()
const toast=useToast()
const formData=ref({email:'',password:''}),errors=ref<Record<string,string>>({}),loading=ref(false)
function validate(){const e:Record<string,string>={};if(!formData.value.email.trim())e.email='El correo electrónico es obligatorio';else if(!/\S+@\S+\.\S+/.test(formData.value.email))e.email='Ingresa un correo electrónico válido';if(!formData.value.password)e.password='La contraseña es obligatoria';errors.value=e;return !Object.keys(e).length}
async function onSubmit(){if(!validate())return;loading.value=true;try{await login(formData.value);emit('login-success')}catch(error){toast.add({severity:'error',summary:'No se pudo iniciar sesión',detail:error instanceof Error?error.message:'Verifica tus datos e inténtalo de nuevo.',life:4500})}finally{loading.value=false}}
</script>
<template><section class="auth-form"><div class="auth-mobile-brand"><span class="brand-mark"><i class="fa-solid fa-screwdriver-wrench" aria-hidden="true"></i></span>SGM-ITVER</div><div class="auth-form-header"><h2>Bienvenido de vuelta</h2><p>Inicia sesión para continuar con tu trabajo.</p></div>
<form class="flex flex-column" @submit.prevent="onSubmit"><div><label for="login-email">Correo electrónico</label><InputText id="login-email" v-model="formData.email" type="email" autocomplete="email" class="w-full" placeholder="nombre@itver.edu.mx" autofocus :aria-invalid="!!errors.email"/><span v-if="errors.email" class="field-error" role="alert">{{errors.email}}</span></div>
<div><label for="login-password">Contraseña</label><Password inputId="login-password" v-model="formData.password" autocomplete="current-password" class="w-full" placeholder="Ingresa tu contraseña" :toggleMask="true" :feedback="false" :aria-invalid="!!errors.password"/><span v-if="errors.password" class="field-error" role="alert">{{errors.password}}</span></div><Button :label="loading?'Iniciando sesión…':'Iniciar sesión'" type="submit" severity="primary" :loading="loading"/><p class="auth-switch">¿Necesitas una cuenta? Solicítala con la administración.</p></form></section></template>
