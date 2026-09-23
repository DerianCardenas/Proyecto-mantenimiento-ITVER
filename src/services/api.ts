import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export function get<T>(url: string, params?: Record<string, unknown>): Promise<T> {
  return api.get(url, { params }).then((r) => r.data)
}

export function post<T>(url: string, data?: unknown): Promise<T> {
  return api.post(url, data).then((r) => r.data)
}

export function put<T>(url: string, data?: unknown): Promise<T> {
  return api.put(url, data).then((r) => r.data)
}

export function del<T>(url: string): Promise<T> {
  return api.delete(url).then((r) => r.data)
}

export { api }
