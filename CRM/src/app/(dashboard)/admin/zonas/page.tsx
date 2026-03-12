'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Plus, MapPin, Users } from 'lucide-react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { PageSpinner } from '@/components/ui/Spinner'
import { useAuth } from '@/hooks/useAuth'
import { apiFetch } from '@/lib/api/client'
import type { Zona } from '@/lib/types'

// Dynamic import del mapa para evitar SSR (react-simple-maps usa browser APIs)
const ArgentinaMap = dynamic(() => import('@/components/zonas/ArgentinaMap'), {
  ssr: false,
  loading: () => (
    <div
      className="rounded-xl flex items-center justify-center"
      style={{ height: 420, background: '#0C1628', border: '1px solid rgba(255,255,255,0.07)' }}
    >
      <p className="text-sm" style={{ color: '#475569' }}>Cargando mapa...</p>
    </div>
  ),
})

// Paleta de colores para zonas
const ZONA_COLORS = [
  '#4A90D9', '#7FC136', '#F59E0B', '#8B5CF6',
  '#06B6D4', '#EC4899', '#10B981', '#EF4444',
  '#F97316', '#A78BFA',
]

export default function AdminZonasPage() {
  const { profile, loading: authLoading } = useAuth()
  const [zonas, setZonas]     = useState<Zona[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [error, setError]     = useState('')
  const [form, setForm]       = useState({ nombre: '', provincia: '', pais: 'Argentina', descripcion: '' })
  const [saving, setSaving]   = useState(false)
  const [hoveredZona, setHoveredZona] = useState<string | null>(null)

  const fetchZonas = async () => {
    setLoading(true)
    try {
      const data = await apiFetch<Zona[]>('/zonas')
      setZonas(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchZonas() }, [])

  if (authLoading || !profile) return <PageSpinner />

  // Mapa provincia → color de zona
  const provinciaColorMap: Record<string, string> = {}
  const provinciaZonaMap: Record<string, string> = {}
  zonas.forEach((z, i) => {
    if (z.provincia) {
      provinciaColorMap[z.provincia] = ZONA_COLORS[i % ZONA_COLORS.length]
      provinciaZonaMap[z.provincia] = z.nombre
    }
  })

  const handleCrear = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.nombre.trim() || !form.provincia.trim()) {
      setError('Nombre y provincia son requeridos')
      return
    }
    setSaving(true)
    setError('')
    try {
      await apiFetch('/zonas', { method: 'POST', body: JSON.stringify(form) })
      await fetchZonas()
      setModalOpen(false)
      setForm({ nombre: '', provincia: '', pais: 'Argentina', descripcion: '' })
    } catch (e: any) {
      setError(e.message ?? 'Error al crear la zona')
    } finally {
      setSaving(false)
    }
  }

  return (
    <DashboardLayout profile={profile} title="Zonas geográficas">
      <div className="space-y-5">

        <div className="flex items-center justify-between">
          <p className="text-sm" style={{ color: '#475569' }}>
            {zonas.length} zona{zonas.length !== 1 ? 's' : ''} configurada{zonas.length !== 1 ? 's' : ''}
          </p>
          <Button onClick={() => { setError(''); setModalOpen(true) }}>
            <Plus className="h-4 w-4" />
            Nueva zona
          </Button>
        </div>

        {/* ── Layout: mapa + lista ──────────────── */}
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">

          {/* Mapa */}
          <div className="xl:col-span-3">
            <ArgentinaMap
              provinciaColorMap={provinciaColorMap}
              provinciaZonaMap={provinciaZonaMap}
              hoveredZona={hoveredZona}
              onHoverZona={setHoveredZona}
            />
          </div>

          {/* Lista de zonas */}
          <div className="xl:col-span-2 space-y-2">
            {loading ? (
              <PageSpinner />
            ) : zonas.length === 0 ? (
              <div
                className="rounded-xl flex flex-col items-center justify-center py-12 text-center"
                style={{ background: '#0C1628', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <MapPin className="h-10 w-10 mb-3 opacity-20" style={{ color: '#4A90D9' }} />
                <p className="text-sm" style={{ color: '#475569' }}>No hay zonas creadas todavía</p>
                <p className="text-xs mt-1" style={{ color: '#2C3E55' }}>Las zonas asignan leads a vendedores</p>
              </div>
            ) : (
              zonas.map((z, i) => {
                const color = ZONA_COLORS[i % ZONA_COLORS.length]
                const isHovered = hoveredZona === z.nombre
                return (
                  <div
                    key={z.id}
                    className="rounded-xl p-4 transition-all duration-150 cursor-default"
                    style={{
                      background: isHovered ? '#12213A' : '#0C1628',
                      border: isHovered
                        ? `1px solid ${color}40`
                        : '1px solid rgba(255,255,255,0.07)',
                    }}
                    onMouseEnter={() => setHoveredZona(z.nombre)}
                    onMouseLeave={() => setHoveredZona(null)}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0 mt-1"
                        style={{ background: color }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="text-sm font-semibold" style={{ color: '#EEF2FF' }}>{z.nombre}</p>
                        </div>
                        <p className="text-xs" style={{ color: '#475569' }}>
                          <MapPin className="inline h-3 w-3 mr-1" />
                          {z.provincia}
                        </p>
                        {z.descripcion && (
                          <p className="text-xs mt-1" style={{ color: '#2C3E55' }}>{z.descripcion}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Leyenda */}
        {zonas.length > 0 && (
          <div
            className="rounded-xl px-4 py-3 flex flex-wrap gap-3"
            style={{ background: '#0C1628', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            <span className="text-xs font-semibold uppercase tracking-widest mr-2" style={{ color: '#2C3E55' }}>
              Provincias asignadas:
            </span>
            {zonas.map((z, i) => (
              <div key={z.id} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: ZONA_COLORS[i % ZONA_COLORS.length] }} />
                <span className="text-xs" style={{ color: '#475569' }}>{z.provincia} → {z.nombre}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Nueva zona">
        <form onSubmit={handleCrear} className="space-y-4">
          <Input
            label="Nombre de la zona"
            value={form.nombre}
            onChange={(e) => setForm((p) => ({ ...p, nombre: e.target.value }))}
            placeholder="Ej: Buenos Aires Norte"
            required
          />
          <Input
            label="Provincia"
            value={form.provincia}
            onChange={(e) => setForm((p) => ({ ...p, provincia: e.target.value }))}
            placeholder="Ej: Buenos Aires"
            required
          />
          <Input
            label="Descripción (opcional)"
            value={form.descripcion}
            onChange={(e) => setForm((p) => ({ ...p, descripcion: e.target.value }))}
            placeholder="Zona norte del conurbano..."
          />
          {error && <p className="text-sm text-red-400 bg-red-900/20 px-3 py-2 rounded-lg">{error}</p>}
          <div className="flex gap-3 pt-1">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" loading={saving} className="flex-1">
              Crear zona
            </Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  )
}
