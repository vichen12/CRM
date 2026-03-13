'use client'

import { useState, useEffect } from 'react'
import { Plus, Search, Phone, Mail, MapPin, Users, TrendingUp, MessageSquare, Calendar, X } from 'lucide-react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { PageSpinner } from '@/components/ui/Spinner'
import { useAuth } from '@/hooks/useAuth'
import { clientesApi } from '@/lib/api/clientes'
import type { Cliente } from '@/lib/types'

function getInitials(c: Cliente) {
  return `${c.nombre[0] ?? ''}${c.apellido[0] ?? ''}`.toUpperCase()
}

const AVATAR_COLORS = ['#4A90D9', '#7FC136', '#8B5CF6', '#F59E0B', '#06B6D4', '#EF4444']
function getAvatarColor(id: string) {
  let hash = 0
  for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash)
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

function ClienteCard({ cliente, onSelect }: { cliente: Cliente; onSelect: (c: Cliente) => void }) {
  const color = getAvatarColor(cliente.id)

  return (
    <div
      className="rounded-xl overflow-hidden cursor-pointer transition-all duration-150"
      style={{ background: '#0C1628', border: '1px solid rgba(255,255,255,0.07)' }}
      onClick={() => onSelect(cliente)}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement
        el.style.border = `1px solid ${color}30`
        el.style.transform = 'translateY(-1px)'
        el.style.boxShadow = '0 8px 24px rgba(0,0,0,0.3)'
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement
        el.style.border = '1px solid rgba(255,255,255,0.07)'
        el.style.transform = 'translateY(0)'
        el.style.boxShadow = 'none'
      }}
    >
      {/* Color top bar */}
      <div className="h-[3px]" style={{ background: `linear-gradient(90deg, ${color} 0%, transparent 100%)` }} />

      <div className="p-4">
        {/* Avatar + nombre */}
        <div className="flex items-center gap-3 mb-3">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
            style={{ background: `linear-gradient(135deg, ${color}, ${color}99)` }}
          >
            {getInitials(cliente)}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm" style={{ color: '#EEF2FF' }}>
              {cliente.nombre} {cliente.apellido}
            </h3>
            {(cliente.localidad || cliente.provincia) && (
              <p className="text-xs flex items-center gap-1 mt-0.5" style={{ color: '#475569' }}>
                <MapPin className="h-3 w-3" />
                {[cliente.localidad, cliente.provincia].filter(Boolean).join(', ')}
              </p>
            )}
          </div>
        </div>

        {/* Contact */}
        <div className="space-y-1.5 mb-3">
          <p className="text-xs flex items-center gap-2" style={{ color: '#475569' }}>
            <Phone className="h-3 w-3 flex-shrink-0" style={{ color: '#2C3E55' }} />
            {cliente.telefono}
          </p>
          {cliente.email && (
            <p className="text-xs flex items-center gap-2" style={{ color: '#475569' }}>
              <Mail className="h-3 w-3 flex-shrink-0" style={{ color: '#2C3E55' }} />
              <span className="truncate">{cliente.email}</span>
            </p>
          )}
          {cliente.fechaNacimiento && (
            <p className="text-xs flex items-center gap-2" style={{ color: '#475569' }}>
              <Calendar className="h-3 w-3 flex-shrink-0" style={{ color: '#2C3E55' }} />
              {new Date(cliente.fechaNacimiento).toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' })}
            </p>
          )}
        </div>

        {/* Counts */}
        {cliente._count && (
          <div className="flex gap-2">
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg flex-1 justify-center" style={{ background: 'rgba(74,144,217,0.1)', border: '1px solid rgba(74,144,217,0.15)' }}>
              <TrendingUp className="h-3 w-3" style={{ color: '#4A90D9' }} />
              <span className="text-xs font-semibold" style={{ color: '#4A90D9' }}>{cliente._count.ventas}</span>
              <span className="text-xs" style={{ color: '#475569' }}>venta{cliente._count.ventas !== 1 ? 's' : ''}</span>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg flex-1 justify-center" style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.15)' }}>
              <MessageSquare className="h-3 w-3" style={{ color: '#8B5CF6' }} />
              <span className="text-xs font-semibold" style={{ color: '#8B5CF6' }}>{cliente._count.consultas}</span>
              <span className="text-xs" style={{ color: '#475569' }}>consulta{cliente._count.consultas !== 1 ? 's' : ''}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const EMPTY_FORM = { nombre: '', apellido: '', email: '', telefono: '', direccion: '', localidad: '', provincia: '', fechaNacimiento: '', notas: '' }

export default function VendedorClientesPage() {
  const { profile, loading: authLoading } = useAuth()
  const [clientes, setClientes]   = useState<Cliente[]>([])
  const [loading, setLoading]     = useState(true)
  const [search, setSearch]       = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [detailCliente, setDetailCliente] = useState<Cliente | null>(null)
  const [form, setForm]           = useState(EMPTY_FORM)
  const [saving, setSaving]       = useState(false)
  const [error, setError]         = useState('')

  const fetchClientes = () => {
    setLoading(true)
    clientesApi.getAll().then(setClientes).catch(() => {}).finally(() => setLoading(false))
  }

  useEffect(() => { fetchClientes() }, [])

  if (authLoading || !profile) return <PageSpinner />

  const filtered = clientes.filter((c) => {
    const q = search.toLowerCase()
    return c.nombre.toLowerCase().includes(q) || c.apellido.toLowerCase().includes(q) || c.telefono.includes(q) || (c.email ?? '').toLowerCase().includes(q)
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.nombre || !form.apellido || !form.telefono) { setError('Nombre, apellido y teléfono son requeridos'); return }
    setSaving(true); setError('')
    try {
      await clientesApi.create({ ...form, fechaNacimiento: form.fechaNacimiento || undefined } as any)
      fetchClientes(); setModalOpen(false); setForm(EMPTY_FORM)
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
              className="pl-9 pr-3 py-2 w-full rounded-lg text-sm focus:outline-none transition-all"
              style={{ background: '#12213A', border: '1px solid rgba(255,255,255,0.07)', color: '#EEF2FF' }}
              onFocus={(e) => { (e.currentTarget as HTMLElement).style.borderColor = '#4A90D9' }}
              onBlur={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)' }}
            />
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm" style={{ color: '#475569' }}>{clientes.length} cliente{clientes.length !== 1 ? 's' : ''}</span>
            <Button onClick={() => { setError(''); setModalOpen(true) }}>
              <Plus className="h-4 w-4" />Nuevo cliente
            </Button>
          </div>
        </div>

        {loading ? <PageSpinner /> : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 rounded-2xl" style={{ background: '#0C1628', border: '1px solid rgba(255,255,255,0.07)' }}>
            <Users className="h-10 w-10 opacity-20" style={{ color: '#4A90D9' }} />
            <p style={{ color: '#475569' }}>{search ? 'Sin resultados' : 'No tenés clientes cargados aún'}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((c) => <ClienteCard key={c.id} cliente={c} onSelect={setDetailCliente} />)}
          </div>
        )}
      </div>

      {/* Detail modal */}
      {detailCliente && (
        <Modal open={!!detailCliente} onClose={() => setDetailCliente(null)} title="Detalle del cliente">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold text-white flex-shrink-0"
                style={{ background: `linear-gradient(135deg, ${getAvatarColor(detailCliente.id)}, ${getAvatarColor(detailCliente.id)}99)` }}
              >
                {getInitials(detailCliente)}
              </div>
              <div>
                <h3 className="text-lg font-bold" style={{ color: '#EEF2FF' }}>{detailCliente.nombre} {detailCliente.apellido}</h3>
                {detailCliente._count && (
                  <p className="text-sm" style={{ color: '#475569' }}>
                    {detailCliente._count.ventas} venta{detailCliente._count.ventas !== 1 ? 's' : ''} · {detailCliente._count.consultas} consulta{detailCliente._count.consultas !== 1 ? 's' : ''}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2 p-4 rounded-xl" style={{ background: '#12213A', border: '1px solid rgba(255,255,255,0.06)' }}>
              {[
                { icon: Phone,    label: 'Teléfono',   value: detailCliente.telefono },
                { icon: Mail,     label: 'Email',       value: detailCliente.email },
                { icon: MapPin,   label: 'Dirección',   value: detailCliente.direccion },
                { icon: MapPin,   label: 'Localidad',   value: [detailCliente.localidad, detailCliente.provincia].filter(Boolean).join(', ') },
                { icon: Calendar, label: 'Nacimiento',  value: detailCliente.fechaNacimiento ? new Date(detailCliente.fechaNacimiento).toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' }) : undefined },
              ].filter((r) => r.value).map((row) => (
                <div key={row.label} className="flex items-start gap-3">
                  <row.icon className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: '#2C3E55' }} />
                  <div>
                    <p className="text-xs" style={{ color: '#2C3E55' }}>{row.label}</p>
                    <p className="text-sm" style={{ color: '#CBD5E1' }}>{row.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {detailCliente.notas && (
              <div className="p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <p className="text-xs mb-1" style={{ color: '#2C3E55' }}>Notas</p>
                <p className="text-sm" style={{ color: '#475569' }}>{detailCliente.notas}</p>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* New client modal */}
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
            <textarea value={form.notas} onChange={set('notas')} rows={3} placeholder="Información adicional..." className="block w-full rounded-lg px-3 py-2 text-sm focus:outline-none resize-none" style={{ background: '#12213A', border: '1px solid rgba(255,255,255,0.07)', color: '#EEF2FF' }} />
          </div>
          {error && <p className="text-sm text-red-400 bg-red-900/20 px-3 py-2 rounded-lg">{error}</p>}
          <div className="flex gap-3 pt-1">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)} className="flex-1">Cancelar</Button>
            <Button type="submit" loading={saving} className="flex-1">Guardar</Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  )
}
