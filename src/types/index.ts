export interface User {
  id: string
  username: string
  email: string
  role: string
  fullName: string
  isActive: boolean
}

export interface Building {
  id: number
  name: string
  location: string
}

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
  status: string
  priority: string
  createdBy: string | null
  assignedTo: string | null
  createdAt: string
  updatedAt: string
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

export interface LoginResponse {
  token: string
  user: User
}
