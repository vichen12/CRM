// Cliente HTTP central — maneja tokens JWT automaticamente

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api'

function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('access_token')
}

function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('refresh_token')
}

export function saveTokens(accessToken: string, refreshToken: string) {
  localStorage.setItem('access_token', accessToken)
  localStorage.setItem('refresh_token', refreshToken)
  // Guardar en cookie para que el middleware de Next.js lo pueda leer
  document.cookie = `access_token=${accessToken}; path=/; max-age=900; SameSite=Strict`
}

export function clearTokens() {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
  document.cookie = 'access_token=; path=/; max-age=0'
}

async function refreshTokens(): Promise<boolean> {
  const refreshToken = getRefreshToken()
  if (!refreshToken) return false

  try {
    const res = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    })
    if (!res.ok) return false
    const data = await res.json()
    saveTokens(data.access_token, data.refresh_token)
    return true
  } catch {
    return false
  }
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getAccessToken()

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string> ?? {}),
  }

  let res = await fetch(`${API_URL}${path}`, { ...options, headers })

  // Token expirado — intentar refrescar una vez
  if (res.status === 401) {
    const refreshed = await refreshTokens()
    if (refreshed) {
      const newToken = getAccessToken()
      headers['Authorization'] = `Bearer ${newToken}`
      res = await fetch(`${API_URL}${path}`, { ...options, headers })
    } else {
      clearTokens()
      window.location.href = '/login'
      throw new Error('Sesion expirada')
    }
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Error del servidor' }))
    throw new Error(error.message ?? 'Error del servidor')
  }

  // 204 No Content
  if (res.status === 204) return null as T

  return res.json()
}
