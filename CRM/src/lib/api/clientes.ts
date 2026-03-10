import { apiFetch } from './client'
import type { Cliente } from '@/lib/types'

export const clientesApi = {
  getAll: () => apiFetch<Cliente[]>('/clientes'),
  getOne: (id: string) => apiFetch<Cliente>(`/clientes/${id}`),
  create: (data: Partial<Cliente>) =>
    apiFetch<Cliente>('/clientes', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<Cliente>) =>
    apiFetch<Cliente>(`/clientes/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  remove: (id: string) => apiFetch<void>(`/clientes/${id}`, { method: 'DELETE' }),
}
