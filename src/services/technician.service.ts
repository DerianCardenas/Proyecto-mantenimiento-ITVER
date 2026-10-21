import type { User } from '@/types'
import { get, post, put, del } from './api'

export type TechnicianInput = { fullName: string; email: string; password: string }
export type TechnicianUpdate = { fullName?: string; email?: string; password?: string; isActive?: boolean }

export const technicianService = {
  list: (includeInactive = false) => get<User[]>('/technicians', includeInactive ? { includeInactive: true } : undefined),
  create: (data: TechnicianInput) => post<User>('/technicians', data),
  update: (id: string, data: TechnicianUpdate) => put<User>(`/technicians/${id}`, data),
  deactivate: (id: string) => del<User>(`/technicians/${id}`),
}
