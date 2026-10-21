<script setup lang="ts">
import { RouterView } from 'vue-router'
import { initializeTheme } from '@/composables/useTheme'
import ConfirmModal from '@/components/common/ConfirmModal.vue'
initializeTheme()
</script>
<template><RouterView /><Toast position="top-right"/><ConfirmModal/></template>
