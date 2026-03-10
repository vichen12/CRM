import { apiFetch } from './client'
import type { Venta } from '@/lib/types'

export const ventasApi = {
  getAll: () => apiFetch<Venta[]>('/ventas'),

  getOne: (id: string) => apiFetch<Venta>(`/ventas/${id}`),

  create: (data: Partial<Venta>) =>
    apiFetch<Venta>('/ventas', { method: 'POST', body: JSON.stringify(data) }),

  resumenMes: (mes?: number, anio?: number) => {
    const params = new URLSearchParams()
    if (mes) params.set('mes', String(mes))
    if (anio) params.set('anio', String(anio))
    return apiFetch<{
      cantidad: number
      prima_total: number
      comision_total: number
      ticket_promedio: number
    }>(`/ventas/resumen?${params}`)
  },
}
