<script setup lang="ts">
import { ref } from 'vue'
import { useTicketService } from '@/services/ticket.service'
import type { TicketDocument } from '@/types'

const props = defineProps<{ ticketId: string; documents: TicketDocument[] }>()
const emit = defineEmits<{(e: 'uploaded'): void }>()

const { uploadDocument, getDownloadUrl } = useTicketService()
const uploading = ref(false)

async function onFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  if (!target.files || target.files.length === 0) return
  const file = target.files[0]
  if (file.size > 10 * 1024 * 1024) {
    alert('El archivo no puede superar los 10MB')
    return
  }
  const formData = new FormData()
  formData.append('file', file)
  uploading.value = true
  try {
    await uploadDocument(props.ticketId, formData)
    emit('uploaded')
  } finally {
    uploading.value = false
  }
}

async function download(doc: TicketDocument) {
  try {
    const { downloadUrl } = await getDownloadUrl(doc.fileKey)
    window.open(downloadUrl, '_blank')
  } catch {
    alert('No se pudo generar la URL de descarga')
  }
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}
</script>

<template>
  <div class="document-upload">
    <div class="flex-center gap-sm mb-sm">
      <label for="fileInput" class="btn" style="cursor: pointer;">
        <span class="material-symbols-rounded">upload_file</span>
        Subir documento
      </label>
      <input id="fileInput" type="file" accept=".pdf,.jpg,.png,.doc,.docx" style="display: none" @change="onFileChange" />
      <span class="text-small text-muted">PDF, JPG, PNG, DOC (max 10MB)</span>
    </div>

    <div v-if="uploading" class="flex-center gap-sm">
      <ProgressSpinner />
      <span class="text-small">Subiendo...</span>
    </div>

    <div v-if="documents.length > 0" class="documents-list mt-md flex flex-column gap-sm">
      <div v-for="doc in documents" :key="doc.id" class="document-item flex-center gap-sm p-sm" style="border: 1px solid var(--gray-200); border-radius: var(--border-radius-sm);">
        <span class="material-symbols-rounded" style="color: var(--primary);">article</span>
        <span class="text-small">{{ doc.originalName }}</span>
        <span class="text-small text-muted">({{ formatSize(doc.fileSize || 0) }})</span>
        <Button icon="mdi-download" @click="download(doc)" />
      </div>
    </div>

    <div v-else class="text-small text-muted mt-sm">
      No hay documentos adjuntos
    </div>
  </div>
</template>

<style scoped>
.document-item { margin-bottom: var(--spacing-xs); }
</style>
