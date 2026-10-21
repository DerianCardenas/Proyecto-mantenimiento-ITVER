<script setup lang="ts">
import { computed } from 'vue'
import { useTheme } from '@/composables/useTheme'
const {theme,toggleTheme}=useTheme()
const label=computed(()=>theme.value==='light'?'Activar modo oscuro':'Activar modo claro')
const icon=computed(()=>theme.value==='light'?'fa-solid fa-moon':'fa-solid fa-sun')
</script>
<template><button class="theme-toggle" type="button" :aria-label="label" :title="label" @click="toggleTheme"><i :class="icon" aria-hidden="true"></i></button></template>
