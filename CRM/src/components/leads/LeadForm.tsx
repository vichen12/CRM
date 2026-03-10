'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import type { Zona } from '@/lib/types'

export interface LeadFormData {
  nombre: string
  apellido: string
  email: string
  telefono: string
  zona_id: string
  notas: string
}

interface LeadFormProps {
  zonas: Zona[]
  onSubmit: (data: LeadFormData) => Promise<void>
  onCancel: () => void
}

const initialState: LeadFormData = {
  nombre: '',
  apellido: '',
  email: '',
  telefono: '',
  zona_id: '',
  notas: '',
}

export function LeadForm({ zonas, onSubmit, onCancel }: LeadFormProps) {
  const [data, setData] = useState<LeadFormData>(initialState)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Partial<Record<keyof LeadFormData, string>>>({})

  const validate = (): Partial<Record<keyof LeadFormData, string>> => {
    const e: Partial<Record<keyof LeadFormData, string>> = {}
    if (!data.nombre.trim()) e.nombre = 'Requerido'
    if (!data.apellido.trim()) e.apellido = 'Requerido'
    if (!data.telefono.trim()) e.telefono = 'Requerido'
    if (!data.zona_id) e.zona_id = 'Seleccioná una zona'
    return e
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    setLoading(true)
    try {
      await onSubmit(data)
      setData(initialState)
    } finally {
      setLoading(false)
    }
  }

  const set =
    (field: keyof LeadFormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      setData((prev) => ({ ...prev, [field]: e.target.value }))
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Nombre"
          value={data.nombre}
          onChange={set('nombre')}
          error={errors.nombre}
          placeholder="Juan"
        />
        <Input
          label="Apellido"
          value={data.apellido}
          onChange={set('apellido')}
          error={errors.apellido}
          placeholder="Pérez"
        />
      </div>

      <Input
        label="Teléfono"
        value={data.telefono}
        onChange={set('telefono')}
        error={errors.telefono}
        placeholder="+54 299 123 4567"
      />

      <Input
        label="Email (opcional)"
        type="email"
        value={data.email}
        onChange={set('email')}
        placeholder="juan@email.com"
      />

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-gray-700">Zona</label>
        <select
          value={data.zona_id}
          onChange={set('zona_id')}
          className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Seleccionar zona...</option>
          {zonas.map((z) => (
            <option key={z.id} value={z.id}>
              {z.nombre} — {z.provincia}
            </option>
          ))}
        </select>
        {errors.zona_id && <p className="text-xs text-red-600">{errors.zona_id}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-gray-700">Notas (opcional)</label>
        <textarea
          value={data.notas}
          onChange={set('notas')}
          rows={3}
          placeholder="Información adicional sobre el cliente..."
          className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancelar
        </Button>
        <Button type="submit" loading={loading} className="flex-1">
          Crear lead
        </Button>
      </div>
    </form>
  )
}
