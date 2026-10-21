<script setup lang="ts">
import {useRouter} from 'vue-router'
const router=useRouter()
</script>
<template><main class="not-found"><i class="fa-solid fa-triangle-exclamation" aria-hidden="true"></i><h1>404</h1><p class="text-muted mb-lg">La página que buscas no existe.</p><Button label="Ir al inicio" icon="fa-solid fa-house" @click="router.push({name:'Dashboard'})"/></main></template>
