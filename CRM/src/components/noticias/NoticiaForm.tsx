'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

export interface NoticiaFormData {
  titulo: string
  contenido: string
}

interface NoticiaFormProps {
  onSubmit: (data: NoticiaFormData) => Promise<void>
  onCancel: () => void
}

export function NoticiaForm({ onSubmit, onCancel }: NoticiaFormProps) {
  const [data, setData] = useState<NoticiaFormData>({ titulo: '', contenido: '' })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Partial<NoticiaFormData>>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: Partial<NoticiaFormData> = {}
    if (!data.titulo.trim()) newErrors.titulo = 'El título es requerido'
    if (!data.contenido.trim()) newErrors.contenido = 'El contenido es requerido'
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    setLoading(true)
    try {
      await onSubmit(data)
      setData({ titulo: '', contenido: '' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Título"
        value={data.titulo}
        onChange={(e) => setData((p) => ({ ...p, titulo: e.target.value }))}
        error={errors.titulo}
        placeholder="Novedad importante del rubro"
      />

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-gray-700">Contenido</label>
        <textarea
          value={data.contenido}
          onChange={(e) => {
            setData((p) => ({ ...p, contenido: e.target.value }))
            setErrors((p) => ({ ...p, contenido: undefined }))
          }}
          rows={6}
          placeholder="Escribí el contenido de la noticia..."
          className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
        {errors.contenido && <p className="text-xs text-red-600">{errors.contenido}</p>}
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancelar
        </Button>
        <Button type="submit" loading={loading} className="flex-1">
          Publicar noticia
        </Button>
      </div>
    </form>
  )
}
