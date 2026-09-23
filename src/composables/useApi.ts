import { ref } from 'vue'
import { get, post, put, del } from '@/services/api'

export function useApi<T>(url: string) {
  const data = ref<T | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchData(params?: Record<string, unknown>) {
    loading.value = true
    error.value = null
    try {
      data.value = await get<T>(url, params)
    } catch (e: any) {
      error.value = e.message || 'Error al obtener datos'
    } finally {
      loading.value = false
    }
  }

  async function postData(body?: unknown) {
    loading.value = true
    error.value = null
    try {
      data.value = await post<T>(url, body)
    } catch (e: any) {
      error.value = e.message || 'Error al enviar datos'
    } finally {
      loading.value = false
    }
  }

  async function putData(body?: unknown) {
    loading.value = true
    error.value = null
    try {
      data.value = await put<T>(url, body)
    } catch (e: any) {
      error.value = e.message || 'Error al actualizar datos'
    } finally {
      loading.value = false
    }
  }

  async function deleteData() {
    loading.value = true
    error.value = null
    try {
      await del(url)
    } catch (e: any) {
      error.value = e.message || 'Error al eliminar'
    } finally {
      loading.value = false
    }
  }

  return { data, loading, error, fetchData, postData, putData, deleteData }
}
