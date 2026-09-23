import { ref } from 'vue'
import type { Ticket, TicketDocument, Building } from '@/types'
import { get, post, put, del } from './api'

export const useTicketService = () => {
  const getTickets = async (params?: Record<string, unknown>) => {
    return get<Ticket[]>('/tickets', params)
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
    return put<Ticket>(`/tickets/${id}/status`, { status })
  }

  const deleteTicket = async (id: string) => {
    return del<void>(`/tickets/${id}`)
  }

  const getStats = async () => {
    return get<Record<string, number>>('/tickets/stats')
  }

  const uploadDocument = async (ticketId: string, formData: FormData) => {
    return post<TicketDocument>(`/tickets/${ticketId}/documents`, formData)
  }

  const getDocuments = async (ticketId: string) => {
    return get<TicketDocument[]>(`/tickets/${ticketId}/documents`)
  }

  const getBuildings = async () => {
    return get<Building[]>('/buildings')
  }

  return {
    getTickets, getTicket, createTicket, updateTicket, updateStatus,
    deleteTicket, getStats, uploadDocument, getDocuments, getBuildings
  }
}
