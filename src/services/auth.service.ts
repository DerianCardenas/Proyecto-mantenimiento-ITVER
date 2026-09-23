import { ref } from 'vue'
import type { User, LoginPayload, LoginResponse, RegisterPayload } from '@/types'
import { post, get } from './api'

export const useAuthService = () => {
  const login = async (credentials: LoginPayload): Promise<LoginResponse> => {
    const data = await post<LoginResponse>('/auth/login', credentials)
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
    return data
  }

  const register = async (data: RegisterPayload) => {
    return post<User>('/auth/register', data)
  }

  const getCurrentUser = async (): Promise<User> => {
    const user = await get<User>('/auth/me')
    localStorage.setItem('user', JSON.stringify(user))
    return user
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  return { login, register, getCurrentUser, logout }
}