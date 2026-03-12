'use client'

import { useState, useEffect } from 'react'
import { Plus, MessageSquare } from 'lucide-react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { PageSpinner } from '@/components/ui/Spinner'
import { useAuth } from '@/hooks/useAuth'
import { consultasApi } from '@/lib/api/consultas'
import { clientesApi } from '@/lib/api/clientes'
import type { Consulta, Cliente, ConsultaTipo, ConsultaEstado } from '@/lib/types'

const TIPO_LABELS: Record<ConsultaTipo, string> = {
  nueva_poliza: 'Nueva póliza',
  renovacion: 'Renovación',
  reclamo: 'Reclamo',
  informacion: 'Información',
  otro: 'Otro',
}

const ESTADO_COLORS: Record<ConsultaEstado, string> = {
  pendiente: 'bg-yellow-900/30 text-yellow-400',
  en_proceso: 'bg-blue-900/30 text-blue-400',
  resuelta: 'bg-green-900/30 text-green-400',
  cancelada: 'bg-zinc-800 text-zinc-400',
}

const ESTADO_LABELS: Record<ConsultaEstado, string> = {
  pendiente: 'Pendiente',
  en_proceso: 'En proceso',
  resuelta: 'Resuelta',
  cancelada: 'Cancelada',
}

const FILTROS: { label: string; value: ConsultaEstado | '' }[] = [
  { label: 'Todas', value: '' },
  { label: 'Pendientes', value: 'pendiente' },
  { label: 'En proceso', value: 'en_proceso' },
  { label: 'Resueltas', value: 'resuelta' },
]

function ConsultaCard({
  consulta,
  onUpdateEstado,
}: {
  consulta: Consulta
  onUpdateEstado: (id: string, estado: ConsultaEstado, resolucion?: string) => void
}) {
  const [resolving, setResolving] = useState(false)
  const [resolucion, setResolucion] = useState('')

  return (
    <div
      className="rounded-xl p-4"
      style={{ background: '#0C1628', border: '1px solid rgba(255,255,255,0.07)' }}
    >
      <div className="flex items-start justify-between mb-2">
        <div>
          <span className="text-xs font-medium uppercase tracking-wide" style={{ color: '#475569' }}>
            {TIPO_LABELS[consulta.tipo]}
          </span>
          {consulta.cliente && (
            <p className="text-sm font-semibold mt-0.5" style={{ color: '#EEF2FF' }}>
              {consulta.cliente.nombre} {consulta.cliente.apellido}
            </p>
          )}
          {consulta.lead && !consulta.cliente && (
            <p className="text-sm font-semibold mt-0.5" style={{ color: '#EEF2FF' }}>
              Lead: {consulta.lead.nombre} {consulta.lead.apellido}
            </p>
          )}
        </div>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ESTADO_COLORS[consulta.estado]}`}>
          {ESTADO_LABELS[consulta.estado]}
        </span>
      </div>

      <p className="text-sm mb-3" style={{ color: '#CBD5E1' }}>{consulta.descripcion}</p>

      {consulta.resolucion && (
        <p className="text-sm rounded-lg px-3 py-2 mb-3" style={{ color: '#7FC136', background: 'rgba(127,193,54,0.08)', border: '1px solid rgba(127,193,54,0.15)' }}>
          ✓ {consulta.resolucion}
        </p>
      )}

      <p className="text-xs mb-3" style={{ color: '#2C3E55' }}>
        {new Date(consulta.createdAt).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' })}
      </p>

      {consulta.estado !== 'resuelta' && consulta.estado !== 'cancelada' && (
        <>
          {resolving ? (
            <div className="space-y-2">
              <textarea
                value={resolucion}
                onChange={(e) => setResolucion(e.target.value)}
                placeholder="Describí la resolución..."
                rows={2}
                className="w-full text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 resize-none"
                style={{
                  background: '#12213A',
                  border: '1px solid rgba(255,255,255,0.07)',
                  color: '#EEF2FF',
                }}
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => {
                    onUpdateEstado(consulta.id, 'resuelta', resolucion)
                    setResolving(false)
                  }}
                  className="flex-1"
                >
                  Marcar resuelta
                </Button>
                <Button size="sm" variant="outline" onClick={() => setResolving(false)}>
                  Cancelar
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex gap-2">
              {consulta.estado === 'pendiente' && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onUpdateEstado(consulta.id, 'en_proceso')}
                  className="flex-1"
                >
                  Iniciar
                </Button>
              )}
              <Button size="sm" onClick={() => setResolving(true)} className="flex-1">
                Resolver
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default function VendedorConsultasPage() {
  const { profile, loading: authLoading } = useAuth()
  const [consultas, setConsultas] = useState<Consulta[]>([])
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [loading, setLoading] = useState(true)
  const [filtro, setFiltro] = useState<ConsultaEstado | ''>('')
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState({ clienteId: '', tipo: 'informacion' as ConsultaTipo, descripcion: '' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const fetchConsultas = () => {
    setLoading(true)
    consultasApi.getAll().then(setConsultas).catch(() => {}).finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchConsultas()
    clientesApi.getAll().then(setClientes).catch(() => {})
  }, [])

  if (authLoading || !profile) return <PageSpinner />

  const filtered = filtro ? consultas.filter((c) => c.estado === filtro) : consultas

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.descripcion) { setError('La descripción es requerida'); return }
    setSaving(true)
    setError('')
    try {
      await consultasApi.create({
        clienteId: form.clienteId || undefined,
        tipo: form.tipo,
        descripcion: form.descripcion,
      })
      fetchConsultas()
      setModalOpen(false)
      setForm({ clienteId: '', tipo: 'informacion', descripcion: '' })
    } catch (e: any) {
      setError(e.message ?? 'Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  const handleUpdateEstado = async (id: string, estado: ConsultaEstado, resolucion?: string) => {
    await consultasApi.update(id, { estado, resolucion })
    fetchConsultas()
  }

  return (
    <DashboardLayout profile={profile} title="Consultas">
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex gap-2 flex-wrap">
            {FILTROS.map((f) => (
              <button
                key={f.value}
                onClick={() => setFiltro(f.value)}
                className="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                style={
                  filtro === f.value
                    ? { background: '#4A90D9', color: 'white', border: '1px solid #4A90D9' }
                    : { background: '#12213A', color: '#475569', border: '1px solid rgba(255,255,255,0.07)' }
                }
              >
                {f.label}
              </button>
            ))}
          </div>
          <Button onClick={() => { setError(''); setModalOpen(true) }}>
            <Plus className="h-4 w-4" />
            Nueva consulta
          </Button>
        </div>

        {loading ? (
          <PageSpinner />
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3" style={{ color: '#475569' }}>
            <MessageSquare className="h-10 w-10 opacity-30" />
            <p>No hay consultas {filtro ? `en estado "${ESTADO_LABELS[filtro]}"` : 'registradas'}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((c) => (
              <ConsultaCard key={c.id} consulta={c} onUpdateEstado={handleUpdateEstado} />
            ))}
          </div>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Nueva consulta" size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium" style={{ color: '#EEF2FF' }}>Cliente (opcional)</label>
            <select
              value={form.clienteId}
              onChange={(e) => setForm((p) => ({ ...p, clienteId: e.target.value }))}
              className="block w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2"
              style={{
                background: '#12213A',
                border: '1px solid rgba(255,255,255,0.07)',
                color: '#EEF2FF',
              }}
            >
              <option value="">Sin cliente asignado</option>
              {clientes.map((c) => (
                <option key={c.id} value={c.id}>{c.nombre} {c.apellido}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium" style={{ color: '#EEF2FF' }}>Tipo</label>
            <select
              value={form.tipo}
              onChange={(e) => setForm((p) => ({ ...p, tipo: e.target.value as ConsultaTipo }))}
              className="block w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2"
              style={{
                background: '#12213A',
                border: '1px solid rgba(255,255,255,0.07)',
                color: '#EEF2FF',
              }}
            >
              {Object.entries(TIPO_LABELS).map(([v, l]) => (
                <option key={v} value={v}>{l}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium" style={{ color: '#EEF2FF' }}>Descripción</label>
            <textarea
              value={form.descripcion}
              onChange={(e) => setForm((p) => ({ ...p, descripcion: e.target.value }))}
              rows={4}
              placeholder="Describí el motivo de la consulta..."
              required
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
              Registrar consulta
            </Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  )
}
