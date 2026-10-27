import type { Ticket, TicketDocument, Building, TicketFilters, StatsResponse, ImportTicketSuggestion } from '@/types'
import { get, getPaginated, post, put, patch, del } from './api'

export const useTicketService = () => {
  const getTickets = async (params?: TicketFilters) => {
    return getPaginated<Ticket>('/tickets', params as Record<string, unknown>)
  }

  const getTicket = async (id: string) => {
    return get<Ticket>(`/tickets/${id}`)
  }

  const createTicket = async (data: Partial<Ticket>) => {
    return post<Ticket>('/tickets', data)
  }

  const updateTicket = async (id: string, data: Partial<Ticket>) => {
    return put<Ticket>(`/tickets/${id}`, data)
  }

  const updateStatus = async (id: string, status: string) => {
    return patch<Ticket>(`/tickets/${id}/status`, { status })
  }

  const deleteTicket = async (id: string) => {
    return del<void>(`/tickets/${id}`)
  }

  const getStats = async () => {
    return get<StatsResponse>('/tickets/stats')
  }

  // Documents are mounted at /api/documents in the backend
  const uploadDocument = async (ticketId: string, formData: FormData) => {
    return post<TicketDocument>(`/documents/${ticketId}`, formData,)
  }

  const getDocuments = async (ticketId: string) => {
    return get<TicketDocument[]>(`/documents/${ticketId}`)
  }

  const getDownloadUrl = async (fileKey: string) => {
    return get<{ downloadUrl: string; document: TicketDocument }>(`/documents/download/${encodeURIComponent(fileKey)}`)
  }

  const getBuildings = async () => {
    return get<Building[]>('/buildings')
  }

  // Envía un PDF de solicitud; el backend devuelve los campos sugeridos (no persiste)
  const importPdf = async (formData: FormData) => {
    return post<ImportTicketSuggestion>('/tickets/import/parse', formData)
  }

  return {
    getTickets, getTicket, createTicket, updateTicket, updateStatus,
    deleteTicket, getStats, uploadDocument, getDocuments, getDownloadUrl, getBuildings, importPdf
  }
}

export const ticketService = useTicketService()