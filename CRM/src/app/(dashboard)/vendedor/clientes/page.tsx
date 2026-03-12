'use client'

import { useState, useEffect } from 'react'
import { Plus, Search, Phone, Mail, MapPin, Users } from 'lucide-react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { PageSpinner } from '@/components/ui/Spinner'
import { useAuth } from '@/hooks/useAuth'
import { clientesApi } from '@/lib/api/clientes'
import type { Cliente } from '@/lib/types'

function ClienteCard({ cliente, onSelect }: { cliente: Cliente; onSelect: (c: Cliente) => void }) {
  return (
    <div
      className="rounded-xl p-4 cursor-pointer transition-all duration-200"
      style={{ background: '#0C1628', border: '1px solid rgba(255,255,255,0.07)' }}
      onClick={() => onSelect(cliente)}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)' }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = '#0C1628' }}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold" style={{ color: '#EEF2FF' }}>
            {cliente.nombre} {cliente.apellido}
          </h3>
          {cliente.localidad && (
            <p className="text-sm flex items-center gap-1 mt-0.5" style={{ color: '#475569' }}>
              <MapPin className="h-3 w-3" />
              {cliente.localidad}{cliente.provincia ? `, ${cliente.provincia}` : ''}
            </p>
          )}
        </div>
        {cliente._count && (
          <div className="flex gap-2 text-xs">
            <span
              className="px-2 py-0.5 rounded-full"
              style={{ background: 'rgba(74,144,217,0.15)', color: '#4A90D9' }}
            >
              {cliente._count.ventas} venta{cliente._count.ventas !== 1 ? 's' : ''}
            </span>
            <span
              className="px-2 py-0.5 rounded-full"
              style={{ background: 'rgba(168,85,247,0.15)', color: '#a855f7' }}
            >
              {cliente._count.consultas} consulta{cliente._count.consultas !== 1 ? 's' : ''}
            </span>
          </div>
        )}
      </div>
      <div className="space-y-1">
        <p className="text-sm flex items-center gap-2" style={{ color: '#475569' }}>
          <Phone className="h-3.5 w-3.5" style={{ color: '#2C3E55' }} />
          {cliente.telefono}
        </p>
        {cliente.email && (
          <p className="text-sm flex items-center gap-2" style={{ color: '#475569' }}>
            <Mail className="h-3.5 w-3.5" style={{ color: '#2C3E55' }} />
            {cliente.email}
          </p>
        )}
      </div>
      {cliente.notas && (
        <p className="mt-2 text-xs line-clamp-2" style={{ color: '#2C3E55' }}>{cliente.notas}</p>
      )}
    </div>
  )
}

const EMPTY_FORM = {
  nombre: '',
  apellido: '',
  email: '',
  telefono: '',
  direccion: '',
  localidad: '',
  provincia: '',
  fechaNacimiento: '',
  notas: '',
}

export default function VendedorClientesPage() {
  const { profile, loading: authLoading } = useAuth()
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const fetchClientes = () => {
    setLoading(true)
    clientesApi.getAll().then(setClientes).catch(() => {}).finally(() => setLoading(false))
  }

  useEffect(() => { fetchClientes() }, [])

  if (authLoading || !profile) return <PageSpinner />

  const filtered = clientes.filter((c) => {
    const q = search.toLowerCase()
    return (
      c.nombre.toLowerCase().includes(q) ||
      c.apellido.toLowerCase().includes(q) ||
      c.telefono.includes(q) ||
      (c.email ?? '').toLowerCase().includes(q)
    )
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.nombre || !form.apellido || !form.telefono) {
      setError('Nombre, apellido y teléfono son requeridos')
      return
    }
    setSaving(true)
    setError('')
    try {
      await clientesApi.create({
        ...form,
        fechaNacimiento: form.fechaNacimiento || undefined,
      } as any)
      fetchClientes()
      setModalOpen(false)
      setForm(EMPTY_FORM)
    } catch (e: any) {
      setError(e.message ?? 'Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  const set = (k: keyof typeof EMPTY_FORM) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((p) => ({ ...p, [k]: e.target.value }))

  return (
    <DashboardLayout profile={profile} title="Mis Clientes">
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: '#475569' }} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nombre, teléfono..."
              className="pl-9 pr-3 py-2 w-full rounded-lg text-sm focus:outline-none focus:ring-2"
              style={{
                background: '#12213A',
                border: '1px solid rgba(255,255,255,0.07)',
                color: '#EEF2FF',
              }}
            />
          </div>
          <Button onClick={() => { setError(''); setModalOpen(true) }}>
            <Plus className="h-4 w-4" />
            Nuevo cliente
          </Button>
        </div>

        {loading ? (
          <PageSpinner />
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3" style={{ color: '#475569' }}>
            <Users className="h-10 w-10 opacity-30" />
            <p>{search ? 'Sin resultados' : 'No tenés clientes cargados aún'}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((c) => (
              <ClienteCard key={c.id} cliente={c} onSelect={() => {}} />
            ))}
          </div>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Nuevo cliente" size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input label="Nombre" value={form.nombre} onChange={set('nombre')} required />
            <Input label="Apellido" value={form.apellido} onChange={set('apellido')} required />
          </div>
          <Input label="Teléfono" value={form.telefono} onChange={set('telefono')} required />
          <Input label="Email (opcional)" type="email" value={form.email} onChange={set('email')} />
          <Input label="Dirección (opcional)" value={form.direccion} onChange={set('direccion')} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Localidad" value={form.localidad} onChange={set('localidad')} />
            <Input label="Provincia" value={form.provincia} onChange={set('provincia')} />
          </div>
          <Input label="Fecha de nacimiento (opcional)" type="date" value={form.fechaNacimiento} onChange={set('fechaNacimiento')} />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium" style={{ color: '#EEF2FF' }}>Notas (opcional)</label>
            <textarea
              value={form.notas}
              onChange={set('notas')}
              rows={3}
              placeholder="Información adicional del cliente..."
              className="block w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 resize-none"
              style={{
                background: '#12213A',
                border: '1px solid rgba(255,255,255,0.07)',
                color: '#EEF2FF',
              }}
            />
          </div>
          {error && <p className="text-sm text-red-400 bg-red-900/20 px-3 py-2 rounded-lg">{error}</p>}
          <div className="flex gap-3 pt-1">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" loading={saving} className="flex-1">
              Guardar
            </Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  )
}
