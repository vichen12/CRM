'use client'

import { useState, useRef } from 'react'
import { Camera, User, Mail, Phone, Lock, MapPin, Key } from 'lucide-react'
import type { Zona } from '@/lib/types'

export interface VendedorFormData {
  nombre: string
  apellido: string
  email: string
  telefono: string
  rol: 'vendedor_matriculado' | 'vendedor_sin_matricula'
  zona_id: string
  matricula: string
  password: string
  avatar_url?: string
}

interface VendedorFormProps {
  zonas: Zona[]
  onSubmit: (data: VendedorFormData) => Promise<void>
  onCancel: () => void
}

const initialState: VendedorFormData = {
  nombre: '',
  apellido: '',
  email: '',
  telefono: '',
  rol: 'vendedor_sin_matricula',
  zona_id: '',
  matricula: '',
  password: '',
  avatar_url: '',
}

function FormField({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">{label}</label>
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}

const inputStyle = {
  base: 'w-full pl-9 pr-3.5 py-2.5 rounded-xl text-sm text-zinc-800 bg-zinc-50 outline-none transition-all duration-200',
  border: '1px solid rgba(0,0,0,0.08)',
}

export function VendedorForm({ zonas, onSubmit, onCancel }: VendedorFormProps) {
  const [data, setData] = useState(initialState)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Partial<Record<keyof VendedorFormData, string>>>({})
  const [avatarPreview, setAvatarPreview] = useState<string>('')
  const fileRef = useRef<HTMLInputElement>(null)

  const validate = () => {
    const e: Partial<Record<keyof VendedorFormData, string>> = {}
    if (!data.nombre.trim()) e.nombre = 'Requerido'
    if (!data.apellido.trim()) e.apellido = 'Requerido'
    if (!data.email.trim()) e.email = 'Requerido'
    if (!data.telefono.trim()) e.telefono = 'Requerido'
    if (!data.zona_id) e.zona_id = 'Seleccioná una zona'
    if (!data.password || data.password.length < 6) e.password = 'Mínimo 6 caracteres'
    if (data.rol === 'vendedor_matriculado' && !data.matricula.trim())
      e.matricula = 'Requerido para vendedor matriculado'
    return e
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setLoading(true)
    try {
      await onSubmit({ ...data, avatar_url: avatarPreview || data.avatar_url })
      setData(initialState)
      setAvatarPreview('')
    } finally {
      setLoading(false)
    }
  }

  const set = (field: keyof VendedorFormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setData((p) => ({ ...p, [field]: e.target.value }))
    setErrors((p) => ({ ...p, [field]: undefined }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) {
      setErrors((p) => ({ ...p, avatar_url: 'La imagen no puede superar 2MB' }))
      return
    }
    const reader = new FileReader()
    reader.onload = (ev) => {
      const result = ev.target?.result as string
      setAvatarPreview(result)
    }
    reader.readAsDataURL(file)
  }

  const focusStyle = (hasError?: string) => ({
    border: hasError ? '1px solid #ef4444' : '1px solid rgba(0,0,0,0.08)',
  })

  const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    ;(e.currentTarget as HTMLElement).style.borderColor = '#2A79C2'
    ;(e.currentTarget as HTMLElement).style.boxShadow = '0 0 0 3px rgba(42,121,194,0.1)'
  }
  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,0,0,0.08)'
    ;(e.currentTarget as HTMLElement).style.boxShadow = ''
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Avatar upload */}
      <div className="flex flex-col items-center gap-3">
        <div
          className="w-20 h-20 rounded-2xl flex items-center justify-center cursor-pointer overflow-hidden relative group"
          style={{
            background: avatarPreview ? 'transparent' : 'linear-gradient(135deg, #2A79C2, #8BC440)',
            border: '2px dashed rgba(42,121,194,0.3)',
          }}
          onClick={() => fileRef.current?.click()}
        >
          {avatarPreview ? (
            <>
              <img src={avatarPreview} alt="preview" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="h-5 w-5 text-white" />
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-1">
              <Camera className="h-6 w-6 text-white" />
              <span className="text-[10px] text-white/80 font-medium">Foto</span>
            </div>
          )}
        </div>
        <p className="text-xs text-zinc-400">Hacé click para subir foto (máx. 2MB)</p>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
        {errors.avatar_url && <p className="text-xs text-red-500">{errors.avatar_url}</p>}
      </div>

      {/* Nombre + Apellido */}
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Nombre" error={errors.nombre}>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
            <input
              className={inputStyle.base}
              style={focusStyle(errors.nombre)}
              value={data.nombre}
              onChange={set('nombre')}
              onFocus={handleFocus}
              onBlur={handleBlur}
              placeholder="Juan"
            />
          </div>
        </FormField>
        <FormField label="Apellido" error={errors.apellido}>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
            <input
              className={inputStyle.base}
              style={focusStyle(errors.apellido)}
              value={data.apellido}
              onChange={set('apellido')}
              onFocus={handleFocus}
              onBlur={handleBlur}
              placeholder="Pérez"
            />
          </div>
        </FormField>
      </div>

      {/* Email */}
      <FormField label="Email" error={errors.email}>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
          <input
            type="email"
            className={inputStyle.base}
            style={focusStyle(errors.email)}
            value={data.email}
            onChange={set('email')}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder="vendedor@email.com"
          />
        </div>
      </FormField>

      {/* Teléfono */}
      <FormField label="Teléfono" error={errors.telefono}>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
          <input
            className={inputStyle.base}
            style={focusStyle(errors.telefono)}
            value={data.telefono}
            onChange={set('telefono')}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder="+54 299 123 4567"
          />
        </div>
      </FormField>

      {/* Contraseña */}
      <FormField label="Contraseña temporal" error={errors.password}>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
          <input
            type="password"
            className={inputStyle.base}
            style={focusStyle(errors.password)}
            value={data.password}
            onChange={set('password')}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder="Mínimo 6 caracteres"
          />
        </div>
        <p className="text-[11px] text-zinc-400">El vendedor puede cambiarla desde su perfil</p>
      </FormField>

      {/* Tipo de vendedor */}
      <FormField label="Tipo de vendedor">
        <select
          value={data.rol}
          onChange={set('rol')}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className="w-full px-3.5 py-2.5 rounded-xl text-sm text-zinc-800 bg-zinc-50 outline-none transition-all duration-200"
          style={{ border: '1px solid rgba(0,0,0,0.08)' }}
        >
          <option value="vendedor_sin_matricula">Sin matrícula — trabaja bajo matrícula del broker</option>
          <option value="vendedor_matriculado">Con matrícula propia</option>
        </select>
      </FormField>

      {/* Matrícula (condicional) */}
      {data.rol === 'vendedor_matriculado' && (
        <FormField label="Número de matrícula" error={errors.matricula}>
          <div className="relative">
            <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
            <input
              className={inputStyle.base}
              style={focusStyle(errors.matricula)}
              value={data.matricula}
              onChange={set('matricula')}
              onFocus={handleFocus}
              onBlur={handleBlur}
              placeholder="MAT-12345"
            />
          </div>
        </FormField>
      )}

      {/* Zona */}
      <FormField label="Zona asignada" error={errors.zona_id}>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400 pointer-events-none" />
          <select
            value={data.zona_id}
            onChange={set('zona_id')}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className="w-full pl-9 pr-3.5 py-2.5 rounded-xl text-sm text-zinc-800 bg-zinc-50 outline-none transition-all duration-200"
            style={{ border: errors.zona_id ? '1px solid #ef4444' : '1px solid rgba(0,0,0,0.08)' }}
          >
            <option value="">Seleccionar zona...</option>
            {zonas.map((z) => (
              <option key={z.id} value={z.id}>
                {z.nombre} — {z.provincia}
              </option>
            ))}
          </select>
        </div>
      </FormField>

      {/* Botones */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-zinc-600 transition-colors"
          style={{ background: 'rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.08)' }}
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-60 flex items-center justify-center gap-2"
          style={{ background: '#2A79C2', boxShadow: '0 4px 12px rgba(42,121,194,0.3)' }}
        >
          {loading && (
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          )}
          Crear vendedor
        </button>
      </div>
    </form>
  )
}
