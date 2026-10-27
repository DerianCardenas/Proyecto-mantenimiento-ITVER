import axios from 'axios'
import type { ApiEnvelope, PaginatedEnvelope } from '@/types'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  // Para FormData hay que quitar el Content-Type application/json por defecto:
  // así Axios/el navegador fijan multipart/form-data con el boundary correcto.
  // (Con application/json, Axios 1.x serializa el FormData a JSON y el archivo se pierde.)
  if (typeof FormData !== 'undefined' && config.data instanceof FormData) {
    const headers = config.headers as unknown as { delete?: (name: string) => void }
    if (typeof headers?.delete === 'function') {
      headers.delete('Content-Type')
    } else {
      delete (config.headers as Record<string, unknown>)['Content-Type']
    }
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    const requestUrl = error.config?.url ?? ''
    const apiMessage = error.response?.data?.error || error.response?.data?.message
    const isLoginRequest = requestUrl.includes('/auth/login')

    if (apiMessage) {
      error.message = apiMessage
    }

    if (status === 401 && !isLoginRequest) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')

      if (window.location.pathname !== '/login') {
        window.location.assign('/login')
      }
    }

    return Promise.reject(error)
  }
)

// Unwraps the { success, data, ... } envelope returning only `data`
function unwrap<T>(response: { data: ApiEnvelope<T> }): T {
  const env = response.data
  if (env && env.success === false) {
    throw new Error(env.error || 'Request failed')
  }
  return env?.data ?? (env as unknown as T)
}

export function get<T>(url: string, params?: Record<string, unknown>): Promise<T> {
  return api.get(url, { params }).then((r) => unwrap<T>(r))
}

// For paginated lists, returns the full envelope (data + total + page + limit)
export function getPaginated<T>(url: string, params?: Record<string, unknown>): Promise<PaginatedEnvelope<T>> {
  return api.get(url, { params }).then((r) => r.data as PaginatedEnvelope<T>)
}

export function post<T>(url: string, data?: unknown): Promise<T> {
  return api.post(url, data).then((r) => unwrap<T>(r))
}

export function put<T>(url: string, data?: unknown): Promise<T> {
  return api.put(url, data).then((r) => unwrap<T>(r))
}

export function patch<T>(url: string, data?: unknown): Promise<T> {
  return api.patch(url, data).then((r) => unwrap<T>(r))
}

export function del<T>(url: string): Promise<T> {
  return api.delete(url).then((r) => unwrap<T>(r))
}

export { api }
