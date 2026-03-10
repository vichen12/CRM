import { apiFetch, saveTokens, clearTokens } from './client'
import type { Profile } from '@/lib/types'

export async function login(email: string, password: string): Promise<void> {
  const data = await apiFetch<{ access_token: string; refresh_token: string }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
  saveTokens(data.access_token, data.refresh_token)
}

export async function logout(refreshToken: string | null): Promise<void> {
  if (refreshToken) {
    await apiFetch('/auth/logout', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    }).catch(() => {})
  }
  clearTokens()
}

export async function getMe(): Promise<Profile> {
  return apiFetch<Profile>('/users/me')
}
