<script setup lang="ts">
defineProps<{
  label?: string
  icon?: string
  severity?: 'primary' | 'secondary' | 'danger' | 'success'
  disabled?: boolean
  loading?: boolean
}>()

const severityClasses: Record<string, string> = {
  primary: 'p-button-primary',
  secondary: 'p-button-secondary',
  danger: 'p-button-danger',
  success: 'p-button-success'
}
</script>

<template>
  <Button
    :label="label"
    :icon="icon"
    :severity="severity"
    :disabled="disabled"
    :loading="loading"
    :class="severityClasses[severity || 'primary']"
  />
</template>
