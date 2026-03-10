'use client'

import { useState, useEffect } from 'react'
import { Plus, MapPin } from 'lucide-react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardBody } from '@/components/ui/Card'
import { PageSpinner } from '@/components/ui/Spinner'
import { useAuth } from '@/hooks/useAuth'
import { apiFetch } from '@/lib/api/client'
import type { Zona } from '@/lib/types'

export default function AdminZonasPage() {
  const { profile, loading: authLoading } = useAuth()
  const [zonas, setZonas] = useState<Zona[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ nombre: '', provincia: '', pais: 'Argentina', descripcion: '' })
  const [saving, setSaving] = useState(false)

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
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            {zonas.length} zona{zonas.length !== 1 ? 's' : ''} configurada{zonas.length !== 1 ? 's' : ''}
          </p>
          <Button onClick={() => { setError(''); setModalOpen(true) }}>
            <Plus className="h-4 w-4" />
            Nueva zona
          </Button>
        </div>

        {loading ? (
          <PageSpinner />
        ) : zonas.length === 0 ? (
          <Card>
            <CardBody>
              <div className="text-center py-12 text-gray-400">
                <MapPin className="h-10 w-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No hay zonas creadas todavía</p>
                <p className="text-xs mt-1">Las zonas se usan para asignar leads a vendedores</p>
              </div>
            </CardBody>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {zonas.map((z) => (
              <div key={z.id} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg flex-shrink-0">
                    <MapPin className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900">{z.nombre}</p>
                    <p className="text-sm text-gray-500">{z.provincia}</p>
                    {z.descripcion && (
                      <p className="text-xs text-gray-400 mt-1">{z.descripcion}</p>
                    )}
                  </div>
                </div>
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
            label="País"
            value={form.pais}
            onChange={(e) => setForm((p) => ({ ...p, pais: e.target.value }))}
            placeholder="Argentina"
          />
          <Input
            label="Descripción (opcional)"
            value={form.descripcion}
            onChange={(e) => setForm((p) => ({ ...p, descripcion: e.target.value }))}
            placeholder="Zona norte del conurbano..."
          />
          {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
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
