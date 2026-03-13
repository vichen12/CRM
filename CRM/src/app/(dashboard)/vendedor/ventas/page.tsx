'use client'

import { useState, useEffect } from 'react'
import { Plus, TrendingUp, DollarSign, CheckCircle2, XCircle, Clock } from 'lucide-react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { PageSpinner } from '@/components/ui/Spinner'
import { useAuth } from '@/hooks/useAuth'
import { apiFetch } from '@/lib/api/client'
import { clientesApi } from '@/lib/api/clientes'
import type { Venta, Cliente } from '@/lib/types'

const ESTADO_CONFIG = {
  vigente:   { label: 'Vigente',   color: '#7FC136', bg: 'rgba(127,193,54,0.15)',  icon: CheckCircle2 },
  cancelada: { label: 'Cancelada', color: '#EF4444', bg: 'rgba(239,68,68,0.15)',   icon: XCircle      },
  vencida:   { label: 'Vencida',   color: '#94A3B8', bg: 'rgba(148,163,184,0.15)', icon: Clock        },
}

function VentaCard({ venta }: { venta: Venta }) {
  const cfg = ESTADO_CONFIG[venta.estado]
  const StatusIcon = cfg.icon

  return (
    <div
      className="rounded-xl overflow-hidden transition-all duration-150"
      style={{ background: '#0C1628', border: '1px solid rgba(255,255,255,0.07)' }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement
        el.style.border = '1px solid rgba(255,255,255,0.12)'
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
      {/* Color accent top */}
      <div className="h-[3px]" style={{ background: `linear-gradient(90deg, ${cfg.color} 0%, transparent 100%)` }} />

      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <p className="font-semibold" style={{ color: '#EEF2FF' }}>{venta.producto}</p>
            {venta.compania && <p className="text-xs mt-0.5" style={{ color: '#475569' }}>{venta.compania}</p>}
          </div>
          <span className="flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium flex-shrink-0 ml-2" style={{ background: cfg.bg, color: cfg.color }}>
            <StatusIcon className="h-3 w-3" />
            {cfg.label}
          </span>
        </div>

        {(venta.cliente || venta.lead) && (
          <p className="text-sm mb-3 px-3 py-2 rounded-lg" style={{ color: '#475569', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.04)' }}>
            {venta.cliente
              ? `${venta.cliente.nombre} ${venta.cliente.apellido}`
              : `${venta.lead!.nombre} ${venta.lead!.apellido}`}
          </p>
        )}

        <div className="flex gap-3">
          {venta.monto_prima != null && (
            <div className="flex-1 p-2.5 rounded-lg text-center" style={{ background: 'rgba(74,144,217,0.08)', border: '1px solid rgba(74,144,217,0.15)' }}>
              <p className="text-[10px] uppercase tracking-wide mb-0.5" style={{ color: '#4A90D9' }}>Prima</p>
              <p className="text-sm font-bold" style={{ color: '#EEF2FF' }}>${Number(venta.monto_prima).toLocaleString('es-AR')}</p>
            </div>
          )}
          {venta.monto_comision != null && (
            <div className="flex-1 p-2.5 rounded-lg text-center" style={{ background: 'rgba(127,193,54,0.08)', border: '1px solid rgba(127,193,54,0.15)' }}>
              <p className="text-[10px] uppercase tracking-wide mb-0.5" style={{ color: '#7FC136' }}>Comisión</p>
              <p className="text-sm font-bold" style={{ color: '#7FC136' }}>${Number(venta.monto_comision).toLocaleString('es-AR')}</p>
            </div>
          )}
        </div>

        <p className="text-xs mt-3" style={{ color: '#2C3E55' }}>
          {new Date(venta.fecha_venta).toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' })}
        </p>
      </div>
    </div>
  )
}

const EMPTY_FORM = {
  clienteId: '', producto: '', compania: '', montoPrima: '', montoComision: '',
  porcentajeComision: '', fechaVenta: new Date().toISOString().split('T')[0], fechaVencimiento: '', notas: '',
}

export default function VendedorVentasPage() {
  const { profile, loading: authLoading } = useAuth()
  const [ventas, setVentas]   = useState<Venta[]>([])
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm]       = useState(EMPTY_FORM)
  const [saving, setSaving]   = useState(false)
  const [error, setError]     = useState('')
  const [filtro, setFiltro]   = useState<'todas' | 'vigente' | 'cancelada' | 'vencida'>('todas')

  const fetchVentas = () => {
    setLoading(true)
    apiFetch<Venta[]>('/ventas').then(setVentas).catch(() => {}).finally(() => setLoading(false))
  }

  useEffect(() => { fetchVentas(); clientesApi.getAll().then(setClientes).catch(() => {}) }, [])

  if (authLoading || !profile) return <PageSpinner />

  const filtered = filtro === 'todas' ? ventas : ventas.filter((v) => v.estado === filtro)
  const totalPrima    = ventas.filter(v => v.estado === 'vigente').reduce((s, v) => s + Number(v.monto_prima ?? 0), 0)
  const totalComision = ventas.filter(v => v.estado === 'vigente').reduce((s, v) => s + Number(v.monto_comision ?? 0), 0)
  const vigentes      = ventas.filter(v => v.estado === 'vigente').length

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.producto || !form.fechaVenta) { setError('Producto y fecha son requeridos'); return }
    setSaving(true); setError('')
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
      fetchVentas(); setModalOpen(false); setForm(EMPTY_FORM)
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
      <div className="space-y-5">

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Pólizas vigentes', value: vigentes,                                                icon: CheckCircle2, color: '#7FC136' },
            { label: 'Prima total',      value: `$${totalPrima.toLocaleString('es-AR')}`,               icon: TrendingUp,  color: '#4A90D9' },
            { label: 'Comisiones',       value: `$${totalComision.toLocaleString('es-AR')}`,            icon: DollarSign,  color: '#06B6D4' },
          ].map((s) => (
            <div key={s.label} className="rounded-xl p-4" style={{ background: '#0C1628', border: '1px solid rgba(255,255,255,0.07)', borderBottom: `2px solid ${s.color}` }}>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${s.color}18` }}>
                  <s.icon className="h-3.5 w-3.5" style={{ color: s.color }} />
                </div>
              </div>
              <p className="text-xl font-bold truncate" style={{ color: '#EEF2FF' }}>{s.value}</p>
              <p className="text-xs mt-0.5" style={{ color: '#475569' }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filters + action */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex gap-2 flex-wrap">
            {(['todas', 'vigente', 'cancelada', 'vencida'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFiltro(f)}
                className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
                style={
                  filtro === f
                    ? { background: '#4A90D9', color: 'white', border: '1px solid #4A90D9' }
                    : { background: '#12213A', color: '#475569', border: '1px solid rgba(255,255,255,0.07)' }
                }
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
          <Button onClick={() => { setError(''); setModalOpen(true) }}>
            <Plus className="h-4 w-4" />
            Registrar venta
          </Button>
        </div>

        {loading ? <PageSpinner /> : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 rounded-2xl" style={{ background: '#0C1628', border: '1px solid rgba(255,255,255,0.07)' }}>
            <TrendingUp className="h-10 w-10 opacity-20 mb-3" style={{ color: '#4A90D9' }} />
            <p style={{ color: '#475569' }}>No hay ventas {filtro !== 'todas' ? `con estado "${filtro}"` : 'registradas'}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((v) => <VentaCard key={v.id} venta={v} />)}
          </div>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Registrar venta" size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium" style={{ color: '#EEF2FF' }}>Cliente (opcional)</label>
            <select value={form.clienteId} onChange={set('clienteId')} className="block w-full rounded-lg px-3 py-2 text-sm focus:outline-none" style={{ background: '#12213A', border: '1px solid rgba(255,255,255,0.07)', color: '#EEF2FF' }}>
              <option value="">Sin cliente asignado</option>
              {clientes.map((c) => <option key={c.id} value={c.id}>{c.nombre} {c.apellido}</option>)}
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
            <label className="text-sm font-medium" style={{ color: '#EEF2FF' }}>Notas (opcional)</label>
            <textarea value={form.notas} onChange={set('notas')} rows={2} className="block w-full rounded-lg px-3 py-2 text-sm focus:outline-none resize-none" style={{ background: '#12213A', border: '1px solid rgba(255,255,255,0.07)', color: '#EEF2FF' }} />
          </div>
          {error && <p className="text-sm text-red-400 bg-red-900/20 px-3 py-2 rounded-lg">{error}</p>}
          <div className="flex gap-3 pt-1">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)} className="flex-1">Cancelar</Button>
            <Button type="submit" loading={saving} className="flex-1"><DollarSign className="h-4 w-4" />Guardar venta</Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  )
}
