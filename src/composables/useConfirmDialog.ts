import { reactive } from 'vue'

export interface ConfirmOptions {
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  danger?: boolean
}

export const confirmDialogState = reactive({
  visible: false,
  title: '',
  message: '',
  confirmLabel: 'Confirmar',
  cancelLabel: 'Cancelar',
  danger: false,
})

let settleCurrent: ((confirmed: boolean) => void) | null = null

export function useConfirmDialog() {
  function confirm(options: ConfirmOptions): Promise<boolean> {
    confirmDialogState.title = options.title
    confirmDialogState.message = options.message
    confirmDialogState.confirmLabel = options.confirmLabel || 'Confirmar'
    confirmDialogState.cancelLabel = options.cancelLabel || 'Cancelar'
    confirmDialogState.danger = options.danger || false
    confirmDialogState.visible = true

    return new Promise((resolve) => {
      settleCurrent = resolve
    })
  }

  function settle(confirmed: boolean) {
    confirmDialogState.visible = false
    settleCurrent?.(confirmed)
    settleCurrent = null
  }

  return { confirm, settle }
}
