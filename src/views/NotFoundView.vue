<script setup lang="ts">
import { useRouter } from 'vue-router'
</script>

<template>
  <div class="not-found flex-center flex-column">
    <h1 class="mb-sm">404</h1>
    <p class="text-muted mb-lg">La página que buscas no existe.</p>
    <Button label="Ir al inicio" icon="mdi-home" @click="useRouter().push({ name: 'Dashboard' })" />
  </div>
</template>

<style scoped>
.not-found {
  min-height: 100vh;
  text-align: center;
}
.not-found h1 { font-size: 96px; color: var(--primary); margin: 0; }
</style>