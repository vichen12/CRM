'use client'

import { useState, useEffect, useCallback } from 'react'
import { leadsApi } from '@/lib/api/leads'
import type { Lead } from '@/lib/types'

interface UseLeadsOptions {
  zonaId?: string
  vendedorId?: string
  estado?: string
}

export function useLeads(options: UseLeadsOptions = {}) {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchLeads = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await leadsApi.getAll()
      // Filtros client-side (el backend ya filtra por rol/zona, estos son extras opcionales)
      let filtered = data
      if (options.zonaId) filtered = filtered.filter((l) => l.zona_id === options.zonaId)
      if (options.vendedorId) filtered = filtered.filter((l) => l.vendedor_id === options.vendedorId)
      if (options.estado) filtered = filtered.filter((l) => l.estado === options.estado)
      setLeads(filtered)
    } catch {
      setError('Error al cargar los leads')
    } finally {
      setLoading(false)
    }
  }, [options.zonaId, options.vendedorId, options.estado])

  useEffect(() => {
    fetchLeads()
  }, [fetchLeads])

  const tomarLead = async (leadId: string): Promise<boolean> => {
    try {
      await leadsApi.tomar(leadId)
      await fetchLeads()
      return true
    } catch {
      return false
    }
  }

  const actualizarEstado = async (leadId: string, estado: string): Promise<boolean> => {
    try {
      await leadsApi.actualizarEstado(leadId, estado)
      await fetchLeads()
      return true
    } catch {
      return false
    }
  }

  return { leads, loading, error, refetch: fetchLeads, tomarLead, actualizarEstado }
}
