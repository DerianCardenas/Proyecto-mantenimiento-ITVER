<script setup lang="ts">
defineProps<{
  title?: string
  icon?: string
}>()
</script>

<template>
  <div class="base-card">
    <div v-if="title || icon" class="card-header flex-center gap-sm mb-md">
      <span v-if="icon" class="material-symbols-rounded text-xl">{{ icon }}</span>
      <h3 v-if="title" class="text-lg">{{ title }}</h3>
    </div>
    <slot />
  </div>
</template>

<style scoped>
.base-card {
  background: var(--white);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-sm);
  padding: var(--spacing-lg);
}
.card-header {
  border-bottom: 1px solid var(--gray-200);
  padding-bottom: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
}
</style>
