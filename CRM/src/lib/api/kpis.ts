import { apiFetch } from './client'
import type { KPIVendedor } from '@/lib/types'

export const kpisApi = {
  getDashboard: (mes?: number, anio?: number) => {
    const params = new URLSearchParams()
    if (mes) params.set('mes', String(mes))
    if (anio) params.set('anio', String(anio))
    return apiFetch<{ kpis: KPIVendedor; stats: any; ranking: any }>(`/kpis/dashboard?${params}`)
  },

  getDashboardAdmin: () => apiFetch<any>('/kpis/admin'),

  recalcular: () => apiFetch<{ mensaje: string }>('/kpis/recalcular', { method: 'POST' }),
}
