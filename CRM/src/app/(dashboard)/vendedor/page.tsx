'use client'

import { useEffect, useState } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { KPIGrid } from '@/components/kpis/KPIGrid'
import { VentasChart, ComisionesChart } from '@/components/kpis/VentasChart'
import { Modal } from '@/components/ui/Modal'
import { PageSpinner } from '@/components/ui/Spinner'
import { useAuth } from '@/hooks/useAuth'
import { apiFetch } from '@/lib/api/client'
import { getMesNombre, formatCurrency, formatRelativeTime } from '@/lib/utils/format'
import { Target, TrendingUp, Award, ArrowRight, CheckCircle2, DollarSign, Clock, MapPin } from 'lucide-react'
import Link from 'next/link'
import type { KPIVendedor, VentasChartData, Venta, Lead } from '@/lib/types'

const quickActions = [
  { href: '/vendedor/leads',   label: 'Leads disponibles', icon: Target,    color: '#4A90D9', desc: 'Tomá nuevos leads' },
  { href: '/vendedor/ventas',  label: 'Mis Ventas',        icon: TrendingUp, color: '#7FC136', desc: 'Revisá tu historial' },
  { href: '/vendedor/ranking', label: 'Ranking mensual',   icon: Award,      color: '#F59E0B', desc: 'Ver posición actual' },
]

type ModalType = 'ventas' | 'comisiones' | 'leads' | 'conversion' | null

export default function VendedorDashboardPage() {
  const { profile, loading: authLoading } = useAuth()
  const [kpis, setKpis]               = useState<KPIVendedor | null>(null)
  const [chartData, setChartData]     = useState<VentasChartData[]>([])
  const [rankingPos, setRankingPos]   = useState<number | null>(null)
  const [ventasList, setVentasList]   = useState<Venta[]>([])
  const [leadsList, setLeadsList]     = useState<Lead[]>([])
  const [loading, setLoading]         = useState(true)
  const [modalOpen, setModalOpen]     = useState<ModalType>(null)

  useEffect(() => {
    if (!profile) return

    const fetchData = async () => {
      try {
        const now = new Date()
        const dashboard = await apiFetch<{ kpis: any; stats: any }>('/kpis/dashboard')

        if (dashboard.kpis) {
          setKpis({
            ventas_mes:      dashboard.kpis.ventasCerradas ?? 0,
            leads_tomados:   dashboard.kpis.leadsTomados ?? 0,
            leads_cerrados:  dashboard.kpis.ventasCerradas ?? 0,
            comisiones_mes:  Number(dashboard.kpis.comisionGenerada ?? 0),
            tasa_conversion: Number(dashboard.kpis.tasaConversion ?? 0),
          })
        }

        // Fetch ventas y leads para los modales
        apiFetch<Venta[]>('/ventas').then(setVentasList).catch(() => {})
        apiFetch<Lead[]>('/leads?vendedorId=' + profile.id).then(setLeadsList).catch(() => {})

        apiFetch<any[]>('/ranking/activo')
          .then((ranking) => {
            const resultados = (ranking as any)?.resultados ?? ranking
            const me = Array.isArray(resultados) ? resultados.find((r: any) => r.perfilId === profile.id || r.vendedor_id === profile.id) : null
            if (me?.posicion) setRankingPos(me.posicion)
          })
          .catch(() => {})

        const chartPoints: VentasChartData[] = []
        for (let i = 5; i >= 0; i--) {
          const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
          const res = await apiFetch<{ cantidad: number; prima_total: number; comision_total: number }>(
            `/ventas/resumen?mes=${d.getMonth() + 1}&anio=${d.getFullYear()}`,
          ).catch(() => ({ cantidad: 0, prima_total: 0, comision_total: 0 }))
          chartPoints.push({
            mes: getMesNombre(d.getMonth() + 1).slice(0, 3),
            ventas: res.cantidad,
            comisiones: res.comision_total,
          })
        }
        setChartData(chartPoints)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [profile?.id])

  if (authLoading || !profile) return <PageSpinner />

  const mesActual = getMesNombre(new Date().getMonth() + 1)
  const now = new Date()
  const ventasMes = ventasList.filter((v) => {
    const d = new Date(v.fecha_venta)
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  })
  const leadsMes = leadsList.filter((l) => {
    const d = new Date(l.tomado_at ?? l.created_at)
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  })

  return (
    <DashboardLayout profile={profile} title="Mi Dashboard">
      <div className="space-y-6">

        {/* ── Welcome banner ─────────────────── */}
        <div
          className="rounded-xl px-6 py-5 relative overflow-hidden flex items-center justify-between"
          style={{ background: 'linear-gradient(135deg, #0C1628 0%, #12213A 100%)', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          <div className="relative z-10">
            <p className="text-xs font-medium uppercase tracking-widest mb-1" style={{ color: '#2C3E55' }}>
              Bienvenido de vuelta
            </p>
            <h2 className="text-xl font-bold tracking-tight" style={{ color: '#EEF2FF' }}>
              {profile.nombre} {profile.apellido}
            </h2>
            <p className="text-sm mt-0.5" style={{ color: '#475569' }}>
              {mesActual}
              {rankingPos && (
                <span className="ml-2 font-semibold" style={{ color: '#7FC136' }}>
                  · #{rankingPos} en el ranking
                </span>
              )}
            </p>
          </div>
          {kpis && (
            <div className="relative z-10 text-right">
              <p className="text-xs uppercase tracking-widest mb-1" style={{ color: '#2C3E55' }}>Comisiones mes</p>
              <p className="text-2xl font-bold" style={{ color: '#7FC136' }}>{formatCurrency(kpis.comisiones_mes)}</p>
            </div>
          )}
          <div className="absolute -right-24 -top-24 w-80 h-80 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(127,193,54,0.07) 0%, transparent 70%)' }} />
        </div>

        {/* ── KPI Grid ───────────────────────── */}
        {loading ? <PageSpinner /> : kpis && (
          <KPIGrid
            kpis={kpis}
            onClickVentas={() => setModalOpen('ventas')}
            onClickComisiones={() => setModalOpen('comisiones')}
            onClickLeads={() => setModalOpen('leads')}
            onClickConversion={() => setModalOpen('conversion')}
          />
        )}

        {/* ── Charts ─────────────────────────── */}
        {!loading && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <VentasChart data={chartData} />
            <ComisionesChart data={chartData} />
          </div>
        )}

        {/* ── Quick actions ──────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {quickActions.map((item) => (
            <Link key={item.href} href={item.href}>
              <div
                className="rounded-xl p-5 flex items-center gap-4 cursor-pointer transition-all duration-150"
                style={{ background: '#0C1628', border: '1px solid rgba(255,255,255,0.07)' }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement
                  el.style.background = `${item.color}09`
                  el.style.borderColor = `${item.color}30`
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement
                  el.style.background = '#0C1628'
                  el.style.borderColor = 'rgba(255,255,255,0.07)'
                }}
              >
                <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${item.color}18` }}>
                  <item.icon className="h-5 w-5" style={{ color: item.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold" style={{ color: '#CBD5E1' }}>{item.label}</p>
                  <p className="text-xs mt-0.5" style={{ color: '#475569' }}>{item.desc}</p>
                </div>
                <ArrowRight className="h-4 w-4 flex-shrink-0" style={{ color: '#2C3E55' }} />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Modal Ventas del mes ─── */}
      <Modal open={modalOpen === 'ventas'} onClose={() => setModalOpen(null)} title={`Ventas de ${mesActual}`}>
        {ventasMes.length === 0 ? (
          <div className="flex flex-col items-center py-10 gap-2" style={{ color: '#475569' }}>
            <CheckCircle2 className="h-10 w-10 opacity-30" />
            <p>No hay ventas registradas este mes</p>
          </div>
        ) : (
          <div className="space-y-3">
            {ventasMes.map((v) => (
              <div key={v.id} className="flex items-center justify-between p-3 rounded-xl" style={{ background: '#12213A', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div>
                  <p className="text-sm font-semibold" style={{ color: '#EEF2FF' }}>{v.producto}</p>
                  <p className="text-xs mt-0.5" style={{ color: '#475569' }}>
                    {v.cliente ? `${v.cliente.nombre} ${v.cliente.apellido}` : v.lead ? `${v.lead.nombre} ${v.lead.apellido}` : 'Sin cliente'}
                    {v.compania && ` · ${v.compania}`}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: '#2C3E55' }}>
                    {new Date(v.fecha_venta).toLocaleDateString('es-AR', { day: '2-digit', month: 'short' })}
                  </p>
                </div>
                <div className="text-right">
                  {v.monto_prima != null && (
                    <p className="text-sm font-bold" style={{ color: '#4A90D9' }}>${Number(v.monto_prima).toLocaleString('es-AR')}</p>
                  )}
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(127,193,54,0.15)', color: '#7FC136' }}>
                    {v.estado}
                  </span>
                </div>
              </div>
            ))}
            <div className="pt-2 text-right text-xs font-semibold" style={{ color: '#475569' }}>
              Total: <span style={{ color: '#7FC136' }}>{ventasMes.length} venta{ventasMes.length !== 1 ? 's' : ''}</span>
            </div>
          </div>
        )}
      </Modal>

      {/* ── Modal Comisiones del mes ─── */}
      <Modal open={modalOpen === 'comisiones'} onClose={() => setModalOpen(null)} title={`Comisiones de ${mesActual}`}>
        {ventasMes.length === 0 ? (
          <div className="flex flex-col items-center py-10 gap-2" style={{ color: '#475569' }}>
            <DollarSign className="h-10 w-10 opacity-30" />
            <p>No hay comisiones este mes</p>
          </div>
        ) : (
          <div className="space-y-3">
            {ventasMes.filter(v => v.monto_comision != null).map((v) => (
              <div key={v.id} className="flex items-center justify-between p-3 rounded-xl" style={{ background: '#12213A', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div>
                  <p className="text-sm font-semibold" style={{ color: '#EEF2FF' }}>{v.producto}</p>
                  <p className="text-xs mt-0.5" style={{ color: '#475569' }}>
                    {v.cliente ? `${v.cliente.nombre} ${v.cliente.apellido}` : v.lead ? `${v.lead.nombre} ${v.lead.apellido}` : 'Sin cliente'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-base font-bold" style={{ color: '#06B6D4' }}>
                    {formatCurrency(Number(v.monto_comision))}
                  </p>
                  {v.monto_prima != null && (
                    <p className="text-xs" style={{ color: '#2C3E55' }}>Prima: ${Number(v.monto_prima).toLocaleString('es-AR')}</p>
                  )}
                </div>
              </div>
            ))}
            <div className="pt-3 flex items-center justify-between px-3 py-3 rounded-xl" style={{ background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.2)' }}>
              <span className="text-sm font-semibold" style={{ color: '#475569' }}>Total comisiones</span>
              <span className="text-xl font-black" style={{ color: '#06B6D4' }}>
                {formatCurrency(ventasMes.reduce((s, v) => s + Number(v.monto_comision ?? 0), 0))}
              </span>
            </div>
          </div>
        )}
      </Modal>

      {/* ── Modal Leads tomados ─── */}
      <Modal open={modalOpen === 'leads'} onClose={() => setModalOpen(null)} title={`Leads tomados en ${mesActual}`}>
        {leadsMes.length === 0 ? (
          <div className="flex flex-col items-center py-10 gap-2" style={{ color: '#475569' }}>
            <Target className="h-10 w-10 opacity-30" />
            <p>No tomaste leads este mes</p>
          </div>
        ) : (
          <div className="space-y-3">
            {leadsMes.map((l) => (
              <div key={l.id} className="flex items-center justify-between p-3 rounded-xl" style={{ background: '#12213A', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div>
                  <p className="text-sm font-semibold" style={{ color: '#EEF2FF' }}>{l.nombre} {l.apellido}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs" style={{ color: '#475569' }}>
                    {l.zona && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{l.zona.nombre}</span>}
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{formatRelativeTime(l.tomado_at ?? l.created_at)}</span>
                  </div>
                </div>
                <span className="text-xs px-2 py-1 rounded-full font-medium" style={{
                  background: l.estado === 'cerrado' ? 'rgba(127,193,54,0.15)' : l.estado === 'en_proceso' ? 'rgba(74,144,217,0.15)' : 'rgba(139,92,246,0.15)',
                  color: l.estado === 'cerrado' ? '#7FC136' : l.estado === 'en_proceso' ? '#4A90D9' : '#8B5CF6',
                }}>
                  {l.estado.replace('_', ' ')}
                </span>
              </div>
            ))}
          </div>
        )}
      </Modal>

      {/* ── Modal Tasa de conversión ─── */}
      <Modal open={modalOpen === 'conversion'} onClose={() => setModalOpen(null)} title="Tasa de conversión">
        {kpis && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Leads tomados', value: kpis.leads_tomados, color: '#8B5CF6' },
                { label: 'Ventas cerradas', value: kpis.ventas_mes, color: '#7FC136' },
                { label: 'Tasa', value: `${kpis.tasa_conversion}%`, color: '#F59E0B' },
              ].map((item) => (
                <div key={item.label} className="text-center p-4 rounded-xl" style={{ background: '#12213A', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <p className="text-2xl font-black" style={{ color: item.color }}>{item.value}</p>
                  <p className="text-xs mt-1" style={{ color: '#475569' }}>{item.label}</p>
                </div>
              ))}
            </div>

            {/* Visual bar */}
            <div className="p-4 rounded-xl space-y-3" style={{ background: '#12213A', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="flex justify-between text-xs" style={{ color: '#475569' }}>
                <span>Progreso de conversión</span>
                <span style={{ color: '#F59E0B' }}>{kpis.tasa_conversion}%</span>
              </div>
              <div className="h-3 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${Math.min(kpis.tasa_conversion, 100)}%`,
                    background: 'linear-gradient(90deg, #F59E0B, #7FC136)',
                  }}
                />
              </div>
              <p className="text-xs" style={{ color: '#2C3E55' }}>
                De cada {kpis.leads_tomados > 0 ? Math.round(kpis.leads_tomados / Math.max(kpis.ventas_mes, 1)) : '—'} leads, cerrás 1 venta
              </p>
            </div>
          </div>
        )}
      </Modal>

    </DashboardLayout>
  )
}
