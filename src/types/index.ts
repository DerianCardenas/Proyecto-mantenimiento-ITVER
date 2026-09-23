export interface User {
  id: string
  username: string
  email: string
  role: string
  fullName: string
  isActive: boolean
  createdAt?: string
}

export interface Building {
  id: number
  name: string
  location: string
}

export type TicketStatus = 'pending' | 'in_progress' | 'resolved' | 'closed' | 'cancelled'
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent'

export interface Ticket {
  id: string
  title: string
  description: string
  buildingId: number | null
  buildingName: string | null
  technicianName: string | null
  attentionDate: string | null
  recommendations: string | null
  observations: string | null
  status: TicketStatus
  priority: TicketPriority
  createdBy: string | null
  assignedTo: string | null
  createdAt: string
  updatedAt: string
}

export interface TicketWithDocuments extends Ticket {
  documents: TicketDocument[]
}

export interface TicketDocument {
  id: string
  ticketId: string
  fileKey: string
  originalName: string
  mimeType: string | null
  fileSize: number | null
  uploadedBy: string | null
  uploadedAt: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  username: string
  email: string
  password: string
  fullName: string
  role: string
}

export interface LoginResponse {
  token: string
  user: User
}

// ---- API envelopes (backend contract) ----

export interface ApiEnvelope<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedEnvelope<T> {
  success: boolean
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
  message?: string
}

// ---- Filters / stats ----

export interface TicketFilters {
  status?: TicketStatus
  priority?: TicketPriority
  buildingName?: string
  technicianName?: string
  page?: number
  limit?: number
  sort?: string
}

export interface StatsByKey {
  status: string
  count: number
}

export interface StatsResponse {
  byStatus: StatsByKey[]
  byPriority: StatsByKey[]
  byBuilding: { buildingName: string; count: number }[]
}