'use client'

import { useState, useEffect } from 'react'
import { Plus, TrendingUp, DollarSign } from 'lucide-react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { PageSpinner } from '@/components/ui/Spinner'
import { useAuth } from '@/hooks/useAuth'
import { apiFetch } from '@/lib/api/client'
import { clientesApi } from '@/lib/api/clientes'
import type { Venta, Cliente } from '@/lib/types'

const ESTADO_COLORS = {
  vigente: 'bg-green-100 text-green-700',
  cancelada: 'bg-red-100 text-red-700',
  vencida: 'bg-gray-100 text-gray-500',
}

function VentaCard({ venta }: { venta: Venta }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className="font-semibold text-gray-900">{venta.producto}</p>
          {venta.compania && <p className="text-sm text-gray-500">{venta.compania}</p>}
        </div>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ESTADO_COLORS[venta.estado]}`}>
          {venta.estado.charAt(0).toUpperCase() + venta.estado.slice(1)}
        </span>
      </div>

      {venta.cliente && (
        <p className="text-sm text-gray-600 mb-1">
          Cliente: {venta.cliente.nombre} {venta.cliente.apellido}
        </p>
      )}
      {venta.lead && !venta.cliente && (
        <p className="text-sm text-gray-600 mb-1">
          Lead: {venta.lead.nombre} {venta.lead.apellido}
        </p>
      )}

      <div className="flex gap-4 mt-3">
        {venta.monto_prima != null && (
          <div>
            <p className="text-xs text-gray-400">Prima</p>
            <p className="text-sm font-semibold text-gray-900">
              ${Number(venta.monto_prima).toLocaleString('es-AR')}
            </p>
          </div>
        )}
        {venta.monto_comision != null && (
          <div>
            <p className="text-xs text-gray-400">Comisión</p>
            <p className="text-sm font-semibold text-green-600">
              ${Number(venta.monto_comision).toLocaleString('es-AR')}
            </p>
          </div>
        )}
      </div>

      <p className="text-xs text-gray-400 mt-2">
        {new Date(venta.fecha_venta).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' })}
      </p>
    </div>
  )
}

const EMPTY_FORM = {
  clienteId: '',
  producto: '',
  compania: '',
  montoPrima: '',
  montoComision: '',
  porcentajeComision: '',
  fechaVenta: new Date().toISOString().split('T')[0],
  fechaVencimiento: '',
  notas: '',
}

export default function VendedorVentasPage() {
  const { profile, loading: authLoading } = useAuth()
  const [ventas, setVentas] = useState<Venta[]>([])
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const fetchVentas = () => {
    setLoading(true)
    apiFetch<Venta[]>('/ventas').then(setVentas).catch(() => {}).finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchVentas()
    clientesApi.getAll().then(setClientes).catch(() => {})
  }, [])

  if (authLoading || !profile) return <PageSpinner />

  const totalPrima = ventas.reduce((s, v) => s + Number(v.monto_prima ?? 0), 0)
  const totalComision = ventas.reduce((s, v) => s + Number(v.monto_comision ?? 0), 0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.producto || !form.fechaVenta) { setError('Producto y fecha son requeridos'); return }
    setSaving(true)
    setError('')
    try {
      await apiFetch('/ventas', {
        method: 'POST',
        body: JSON.stringify({
          clienteId: form.clienteId || undefined,
          producto: form.producto,
          compania: form.compania || undefined,
          montoPrima: form.montoPrima ? parseFloat(form.montoPrima) : undefined,
          montoComision: form.montoComision ? parseFloat(form.montoComision) : undefined,
          porcentajeComision: form.porcentajeComision ? parseFloat(form.porcentajeComision) : undefined,
          fechaVenta: form.fechaVenta,
          fechaVencimiento: form.fechaVencimiento || undefined,
          notas: form.notas || undefined,
        }),
      })
      fetchVentas()
      setModalOpen(false)
      setForm(EMPTY_FORM)
    } catch (e: any) {
      setError(e.message ?? 'Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  const set = (k: keyof typeof EMPTY_FORM) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((p) => ({ ...p, [k]: e.target.value }))

  return (
    <DashboardLayout profile={profile} title="Mis Ventas">
      <div className="space-y-4">
        {/* Resumen */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs text-gray-500 mb-1">Total ventas</p>
            <p className="text-2xl font-bold text-gray-900">{ventas.filter(v => v.estado === 'vigente').length}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs text-gray-500 mb-1">Prima total</p>
            <p className="text-2xl font-bold text-blue-600">${totalPrima.toLocaleString('es-AR')}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs text-gray-500 mb-1">Comisiones</p>
            <p className="text-2xl font-bold text-green-600">${totalComision.toLocaleString('es-AR')}</p>
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={() => { setError(''); setModalOpen(true) }}>
            <Plus className="h-4 w-4" />
            Registrar venta
          </Button>
        </div>

        {loading ? (
          <PageSpinner />
        ) : ventas.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-3">
            <TrendingUp className="h-10 w-10 opacity-30" />
            <p>No tenés ventas registradas aún</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {ventas.map((v) => (
              <VentaCard key={v.id} venta={v} />
            ))}
          </div>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Registrar venta" size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Cliente (opcional)</label>
            <select
              value={form.clienteId}
              onChange={set('clienteId')}
              className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Sin cliente asignado</option>
              {clientes.map((c) => (
                <option key={c.id} value={c.id}>{c.nombre} {c.apellido}</option>
              ))}
            </select>
          </div>

          <Input label="Producto / Ramo" value={form.producto} onChange={set('producto')} placeholder="Vida, Auto, Hogar..." required />
          <Input label="Compañía (opcional)" value={form.compania} onChange={set('compania')} placeholder="Sancor, Zurich..." />

          <div className="grid grid-cols-2 gap-3">
            <Input label="Monto prima ($)" type="number" value={form.montoPrima} onChange={set('montoPrima')} placeholder="0" />
            <Input label="Comisión ($)" type="number" value={form.montoComision} onChange={set('montoComision')} placeholder="0" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input label="Fecha de venta" type="date" value={form.fechaVenta} onChange={set('fechaVenta')} required />
            <Input label="Vencimiento (opcional)" type="date" value={form.fechaVencimiento} onChange={set('fechaVencimiento')} />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Notas (opcional)</label>
            <textarea
              value={form.notas}
              onChange={set('notas')}
              rows={2}
              className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
          <div className="flex gap-3 pt-1">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" loading={saving} className="flex-1">
              <DollarSign className="h-4 w-4" />
              Guardar venta
            </Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  )
}
