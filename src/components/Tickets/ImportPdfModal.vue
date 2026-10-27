<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useTicketsStore } from '@/stores/tickets'
import { useTicketService } from '@/services/ticket.service'
import { toDateOnly } from '@/utils/dates'
import type { Building, ImportTicketSuggestion, TicketPriority, Ticket } from '@/types'

const emit = defineEmits<{ (e: 'close'): void; (e: 'imported'): void }>()

const toast = useToast()
const ticketsStore = useTicketsStore()
const { importPdf, getBuildings } = useTicketService()

const MAX_SIZE = 10 * 1024 * 1024

const step = ref<'select' | 'review'>('select')
const parsing = ref(false)
const saving = ref(false)
const selectedFile = ref<File | null>(null)
const buildings = ref<Building[]>([])
const suggestion = ref<ImportTicketSuggestion | null>(null)
const errors = ref<Record<string, string>>({})

const priorityOptions = [
  { label: 'Baja', value: 'low' },
  { label: 'Media', value: 'medium' },
  { label: 'Alta', value: 'high' },
  { label: 'Urgente', value: 'urgent' },
]

const form = ref({
  title: '',
  description: '',
  buildingId: null as number | null,
  attentionDate: null as Date | null,
  priority: 'medium' as TicketPriority,
  observations: '',
})

onMounted(async () => {
  try {
    buildings.value = await getBuildings()
  } catch {
    // El edificio es opcional; si falla, se puede crear el ticket sin él.
  }
})

function getError(error: unknown) {
  return error instanceof Error ? error.message : 'Inténtalo de nuevo.'
}

async function onFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  if (!target.files?.length) return
  const file = target.files[0]
  target.value = ''

  if (file.type !== 'application/pdf') {
    toast.add({ severity: 'warn', summary: 'Formato no válido', detail: 'Selecciona un archivo PDF.', life: 4000 })
    return
  }
  if (file.size > MAX_SIZE) {
    toast.add({ severity: 'warn', summary: 'Archivo demasiado grande', detail: 'El PDF no puede superar los 10 MB.', life: 4000 })
    return
  }

  parsing.value = true
  try {
    const data = new FormData()
    data.append('file', file)
    const result = await importPdf(data)
    selectedFile.value = file
    suggestion.value = result
    form.value = {
      title: result.title,
      description: result.description,
      buildingId: null,
      attentionDate: null,
      priority: result.priority,
      observations: result.observations,
    }
    step.value = 'review'
  } catch (error) {
    toast.add({ severity: 'error', summary: 'No se pudo leer el PDF', detail: getError(error), life: 5000 })
  } finally {
    parsing.value = false
  }
}

function validate() {
  const next: Record<string, string> = {}
  if (form.value.title.trim().length < 3) next.title = 'El título debe tener al menos 3 caracteres.'
  if (form.value.description.trim().length < 10) next.description = 'La descripción debe tener al menos 10 caracteres.'
  errors.value = next
  return Object.keys(next).length === 0
}

async function createFromPdf() {
  if (!validate() || !selectedFile.value) return
  saving.value = true
  try {
    const payload: Partial<Ticket> = {
      title: form.value.title.trim(),
      description: form.value.description.trim(),
      buildingId: form.value.buildingId,
      buildingName: buildings.value.find((b) => b.id === form.value.buildingId)?.name ?? null,
      attentionDate: toDateOnly(form.value.attentionDate),
      priority: form.value.priority,
      observations: form.value.observations,
    }
    const ticket = await ticketsStore.create(payload)

    // Adjunta el PDF original al ticket recién creado.
    try {
      const data = new FormData()
      data.append('file', selectedFile.value)
      await ticketsStore.uploadDoc(ticket.id, data)
    } catch (error) {
      toast.add({ severity: 'warn', summary: 'Ticket creado, pero el PDF no se adjuntó', detail: getError(error), life: 5000 })
    }

    toast.add({ severity: 'success', summary: 'Ticket creado desde PDF', detail: 'Revisa y asigna un técnico cuando corresponda.', life: 4000 })
    emit('imported')
  } catch (error) {
    toast.add({ severity: 'error', summary: 'No se pudo crear el ticket', detail: getError(error), life: 5000 })
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="form-modal-backdrop" @click.self="emit('close')">
    <section class="form-modal" role="dialog" aria-modal="true" aria-labelledby="import-pdf-title">
      <div class="form-modal-header">
        <div>
          <span class="form-modal-kicker">Importar solicitud</span>
          <h2 id="import-pdf-title">Crear ticket desde PDF</h2>
        </div>
        <button class="modal-close" type="button" aria-label="Cerrar" @click="emit('close')"><i class="fa-solid fa-xmark" aria-hidden="true"></i></button>
      </div>

      <!-- Paso 1: seleccionar PDF -->
      <template v-if="step === 'select'">
        <p class="form-modal-description">Sube el PDF de la solicitud de mantenimiento. Leeremos los datos para precargar el ticket; podrás revisarlos antes de guardar.</p>
        <div class="import-dropzone">
          <label for="import-pdf-input" class="document-upload-trigger">
            <i class="fa-solid fa-file-arrow-up" aria-hidden="true"></i> Seleccionar PDF
          </label>
          <input id="import-pdf-input" class="visually-hidden-input" type="file" accept="application/pdf,.pdf" :disabled="parsing" @change="onFileChange" />
          <span class="text-small text-muted">PDF · Máximo 10 MB</span>
        </div>
        <div v-if="parsing" class="flex-center gap-sm mt-md" role="status"><ProgressSpinner style="width:2rem;height:2rem" /><span class="text-small">Leyendo el PDF…</span></div>
      </template>

      <!-- Paso 2: revisar y crear -->
      <template v-else>
        <p class="form-modal-description">Revisa los datos extraídos del PDF. El técnico se vincula después; el PDF se adjuntará al ticket.</p>
        <form class="form-grid" @submit.prevent="createFromPdf">
          <div class="form-field form-field--full">
            <label for="import-title">Título <span aria-hidden="true">*</span></label>
            <InputText id="import-title" v-model="form.title" class="w-full" :aria-invalid="!!errors.title" />
            <span v-if="errors.title" class="field-error" role="alert">{{ errors.title }}</span>
          </div>
          <div class="form-field form-field--full">
            <label for="import-description">Descripción <span aria-hidden="true">*</span></label>
            <Textarea id="import-description" v-model="form.description" class="w-full" rows="3" :aria-invalid="!!errors.description" />
            <span v-if="errors.description" class="field-error" role="alert">{{ errors.description }}</span>
          </div>
          <div class="form-field">
            <label for="import-building">Edificio</label>
            <Dropdown id="import-building" v-model="form.buildingId" :options="buildings" optionLabel="name" optionValue="id" showClear placeholder="Seleccionar edificio" class="w-full" />
          </div>
          <div class="form-field">
            <label for="import-date">Fecha de atención</label>
            <DatePicker id="import-date" v-model="form.attentionDate" class="w-full" dateFormat="dd/mm/yy" placeholder="Seleccionar fecha" showIcon iconDisplay="input" />
          </div>
          <div class="form-field">
            <label for="import-priority">Prioridad</label>
            <Dropdown id="import-priority" v-model="form.priority" :options="priorityOptions" optionLabel="label" optionValue="value" class="w-full" />
          </div>
          <div class="form-field form-field--full">
            <label for="import-observations">Observaciones</label>
            <Textarea id="import-observations" v-model="form.observations" class="w-full" rows="4" />
          </div>
          <p v-if="suggestion?.parsed?.solicitante" class="form-field--full text-small text-muted">
            <i class="fa-solid fa-circle-info" aria-hidden="true"></i>
            Solicitante detectado: <strong>{{ suggestion.parsed.solicitante }}</strong> · {{ selectedFile?.name }}
          </p>
          <div class="form-actions form-field--full">
            <Button label="Cancelar" severity="secondary" type="button" @click="emit('close')" />
            <Button :label="saving ? 'Creando…' : 'Crear ticket'" icon="fa-regular fa-floppy-disk" type="submit" :loading="saving" />
          </div>
        </form>
      </template>
    </section>
  </div>
</template>

<style scoped>
.import-dropzone {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: flex-start;
  margin-top: 0.5rem;
}
</style>
