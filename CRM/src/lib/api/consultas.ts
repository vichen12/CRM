import { apiFetch } from './client'
import type { Consulta } from '@/lib/types'

export const consultasApi = {
  getAll: () => apiFetch<Consulta[]>('/consultas'),
  getOne: (id: string) => apiFetch<Consulta>(`/consultas/${id}`),
  create: (data: { clienteId?: string; leadId?: string; tipo?: string; descripcion: string }) =>
    apiFetch<Consulta>('/consultas', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: { estado?: string; resolucion?: string }) =>
    apiFetch<Consulta>(`/consultas/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  remove: (id: string) => apiFetch<void>(`/consultas/${id}`, { method: 'DELETE' }),
}
