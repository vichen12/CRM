import { apiFetch } from './client'
import type { Lead } from '@/lib/types'

export const leadsApi = {
  getAll: () => apiFetch<Lead[]>('/leads'),

  getOne: (id: string) => apiFetch<Lead>(`/leads/${id}`),

  create: (data: Partial<Lead>) =>
    apiFetch<Lead>('/leads', { method: 'POST', body: JSON.stringify(data) }),

  tomar: (id: string) =>
    apiFetch<Lead>(`/leads/${id}/tomar`, { method: 'PATCH' }),

  actualizarEstado: (id: string, estado: string, notas?: string) =>
    apiFetch<Lead>(`/leads/${id}/estado`, {
      method: 'PATCH',
      body: JSON.stringify({ estado, notas }),
    }),
}
