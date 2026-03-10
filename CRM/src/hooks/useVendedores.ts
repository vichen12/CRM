'use client'

import { useState, useEffect } from 'react'
import { apiFetch } from '@/lib/api/client'
import type { Profile } from '@/lib/types'

export function useVendedores() {
  const [vendedores, setVendedores] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)

  const fetchVendedores = async () => {
    setLoading(true)
    try {
      const data = await apiFetch<Profile[]>('/users/vendedores')
      setVendedores(data)
    } catch {
      setVendedores([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVendedores()
  }, [])

  const toggleActivo = async (id: string, activo: boolean): Promise<boolean> => {
    try {
      await apiFetch(`/users/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ activo }),
      })
      await fetchVendedores()
      return true
    } catch {
      return false
    }
  }

  const crearVendedor = async (data: {
    nombre: string
    apellido: string
    email: string
    telefono: string
    rol: string
    zona_id: string
    matricula?: string
    password: string
  }) => {
    const result = await apiFetch<Profile>('/users', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    await fetchVendedores()
    return result
  }

  return { vendedores, loading, refetch: fetchVendedores, toggleActivo, crearVendedor }
}
