'use client'

import { useState, useEffect, useCallback } from 'react'
import { getMe, logout as apiLogout } from '@/lib/api/auth'
import { clearTokens } from '@/lib/api/client'
import type { Profile } from '@/lib/types'

export function useAuth() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = useCallback(async () => {
    try {
      const data = await getMe()
      setProfile(data)
    } catch (err: any) {
      setProfile(null)
      // Solo redirigir al login si la sesión expiró (token inválido)
      // No redirigir si simplemente no hay sesión (landing page)
      if (err?.message === 'UNAUTHORIZED' && typeof window !== 'undefined' && window.location.pathname !== '/' && window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  const logout = async () => {
    const refreshToken = localStorage.getItem('refresh_token')
    await apiLogout(refreshToken)
    setProfile(null)
    window.location.href = '/login'
  }

  return { profile, loading, logout, refetch: fetchProfile }
}
