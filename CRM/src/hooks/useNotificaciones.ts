'use client'

import { useState, useEffect, useCallback } from 'react'
import { apiFetch } from '@/lib/api/client'
import type { Notificacion } from '@/lib/types'

export function useNotificaciones(vendedorId?: string) {
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([])

  const fetchNotificaciones = useCallback(async () => {
    if (!vendedorId) return
    try {
      const data = await apiFetch<Notificacion[]>('/notificaciones')
      setNotificaciones(data)
    } catch {
      setNotificaciones([])
    }
  }, [vendedorId])

  useEffect(() => {
    fetchNotificaciones()
    // Polling cada 30s (reemplaza el realtime de Supabase)
    const interval = setInterval(fetchNotificaciones, 30000)
    return () => clearInterval(interval)
  }, [fetchNotificaciones])

  const marcarLeida = async (id: string) => {
    await apiFetch(`/notificaciones/${id}/leer`, { method: 'PATCH' }).catch(() => {})
    setNotificaciones((prev) => prev.map((n) => (n.id === id ? { ...n, leida: true } : n)))
  }

  const marcarTodasLeidas = async () => {
    await apiFetch('/notificaciones/leer-todas', { method: 'PATCH' }).catch(() => {})
    setNotificaciones((prev) => prev.map((n) => ({ ...n, leida: true })))
  }

  return { notificaciones, marcarLeida, marcarTodasLeidas }
}
