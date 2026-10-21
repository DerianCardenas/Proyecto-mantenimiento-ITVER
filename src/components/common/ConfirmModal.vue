<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import { confirmDialogState, useConfirmDialog } from '@/composables/useConfirmDialog'

const { settle } = useConfirmDialog()
const confirmButton = ref<HTMLButtonElement | null>(null)

watch(() => confirmDialogState.visible, async (visible) => {
  if (visible) {
    await nextTick()
    confirmButton.value?.focus()
  }
})

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') settle(false)
}
</script>

<template>
  <Teleport to="body">
    <div v-if="confirmDialogState.visible" class="confirm-backdrop" @click.self="settle(false)" @keydown="onKeydown">
      <section class="confirm-modal" role="alertdialog" aria-modal="true" aria-labelledby="confirm-title" aria-describedby="confirm-message">
        <div :class="['confirm-icon', { 'is-danger': confirmDialogState.danger }]" aria-hidden="true">
          <i :class="confirmDialogState.danger ? 'fa-solid fa-triangle-exclamation' : 'fa-solid fa-circle-question'"></i>
        </div>
        <h2 id="confirm-title">{{ confirmDialogState.title }}</h2>
        <p id="confirm-message">{{ confirmDialogState.message }}</p>
        <div class="confirm-actions">
          <button class="confirm-button is-secondary" type="button" @click="settle(false)">{{ confirmDialogState.cancelLabel }}</button>
          <button ref="confirmButton" :class="['confirm-button', confirmDialogState.danger ? 'is-danger' : 'is-primary']" type="button" @click="settle(true)">
            {{ confirmDialogState.confirmLabel }}
          </button>
        </div>
      </section>
    </div>
  </Teleport>
</template>
