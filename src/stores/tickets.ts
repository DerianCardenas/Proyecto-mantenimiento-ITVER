import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Ticket, TicketDocument } from '@/types'
import { useTicketService } from '@/services/ticket.service'

interface FilterState {
  status: string | null
  priority: string | null
  building: string | null
  technician: string | null
  dateFrom: string | null
  dateTo: string | null
}

export const useTicketsStore = defineStore('tickets', () => {
  const tickets = ref<Ticket[]>([])
  const currentTicket = ref<Ticket | null>(null)
  const filters = ref<FilterState>({
    status: null,
    priority: null,
    building: null,
    technician: null,
    dateFrom: null,
    dateTo: null
  })
  const loading = ref(false)

  const {
    getTickets, getTicket, createTicket, updateTicket, updateStatus,
    deleteTicket, getStats, uploadDocument, getDocuments
  } = useTicketService()

  async function loadTickets(params?: Record<string, unknown>) {
    loading.value = true
    try {
      const f = params || filters.value
      tickets.value = await getTickets(f as Record<string, unknown>)
    } finally {
      loading.value = false
    }
  }

  async function loadTicket(id: string) {
    loading.value = true
    try {
      currentTicket.value = await getTicket(id)
    } finally {
      loading.value = false
    }
  }

  async function create(data: Partial<Ticket>) {
    const t = await createTicket(data)
    tickets.value.unshift(t)
    return t
  }

  async function update(id: string, data: Partial<Ticket>) {
    const t = await updateTicket(id, data)
    const idx = tickets.value.findIndex((x) => x.id === id)
    if (idx !== -1) tickets.value[idx] = t
    currentTicket.value = t
    return t
  }

  async function remove(id: string) {
    await deleteTicket(id)
    tickets.value = tickets.value.filter((x) => x.id !== id)
  }

  async function changeStatus(id: string, status: string) {
    const t = await updateStatus(id, status)
    const idx = tickets.value.findIndex((x) => x.id === id)
    if (idx !== -1) tickets.value[idx] = t
    if (currentTicket.value?.id === id) currentTicket.value = t
    return t
  }

  async function loadStats() {
    return getStats()
  }

  async function uploadDoc(ticketId: string, formData: FormData) {
    return uploadDocument(ticketId, formData)
  }

  function setFilters(f: Partial<FilterState>) {
    filters.value = { ...filters.value, ...f }
  }

  return {
    tickets, currentTicket, filters, loading,
    loadTickets, loadTicket, create, update, remove, changeStatus,
    loadStats, uploadDoc, setFilters, getDocuments
  }
})
