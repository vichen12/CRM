'use client'

import { useState, useRef } from 'react'
import { Upload, File } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import type { TipoDocumento } from '@/lib/types'

export interface DocumentoUploadData {
  nombre: string
  descripcion: string
  tipo: TipoDocumento
  file: File
}

interface DocumentoUploadProps {
  onSubmit: (data: DocumentoUploadData) => Promise<void>
  onCancel: () => void
}

const tipoOptions: { value: TipoDocumento; label: string }[] = [
  { value: 'producto', label: 'Producto' },
  { value: 'cobertura', label: 'Cobertura' },
  { value: 'proceso', label: 'Proceso' },
  { value: 'formulario', label: 'Formulario' },
  { value: 'otro', label: 'Otro' },
]

export function DocumentoUpload({ onSubmit, onCancel }: DocumentoUploadProps) {
  const [nombre, setNombre] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [tipo, setTipo] = useState<TipoDocumento>('producto')
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (!selected) return
    setFile(selected)
    if (!nombre) setNombre(selected.name.replace(/\.[^/.]+$/, ''))
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) { setError('Seleccioná un archivo'); return }
    if (!nombre.trim()) { setError('El nombre es requerido'); return }
    setLoading(true)
    try {
      await onSubmit({ nombre, descripcion, tipo, file })
    } catch {
      setError('Error al subir el archivo')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Zona de drop */}
      <div
        onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
          onChange={handleFileChange}
          className="hidden"
        />
        {file ? (
          <div className="flex flex-col items-center gap-2">
            <File className="h-10 w-10 text-blue-600" />
            <p className="text-sm font-medium text-gray-900">{file.name}</p>
            <p className="text-xs text-gray-400">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-gray-400">
            <Upload className="h-10 w-10" />
            <p className="text-sm font-medium">Arrastrá o hacé clic para subir</p>
            <p className="text-xs">PDF, DOC, XLS, PPT — máx 20MB</p>
          </div>
        )}
      </div>

      <Input
        label="Nombre del documento"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        placeholder="Manual de productos 2024"
      />

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-gray-700">Categoría</label>
        <select
          value={tipo}
          onChange={(e) => setTipo(e.target.value as TipoDocumento)}
          className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {tipoOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-gray-700">Descripción (opcional)</label>
        <textarea
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          rows={2}
          placeholder="Descripción breve del documento..."
          className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-3">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancelar
        </Button>
        <Button type="submit" loading={loading} className="flex-1">
          Subir documento
        </Button>
      </div>
    </form>
  )
}
