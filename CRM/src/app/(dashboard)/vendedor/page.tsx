'use client'

import { useEffect, useState } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { KPIGrid } from '@/components/kpis/KPIGrid'
import { VentasChart, ComisionesChart } from '@/components/kpis/VentasChart'
import { PageSpinner } from '@/components/ui/Spinner'
import { useAuth } from '@/hooks/useAuth'
import { apiFetch } from '@/lib/api/client'
import { getMesNombre, formatCurrency } from '@/lib/utils/format'
import { Target, TrendingUp, Award, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import type { KPIVendedor, VentasChartData } from '@/lib/types'

const quickActions = [
  { href: '/vendedor/leads',   label: 'Leads disponibles', icon: Target,    color: '#4A90D9', desc: 'Tomá nuevos leads' },
  { href: '/vendedor/ventas',  label: 'Mis Ventas',        icon: TrendingUp, color: '#7FC136', desc: 'Revisá tu historial' },
  { href: '/vendedor/ranking', label: 'Ranking mensual',   icon: Award,      color: '#F59E0B', desc: 'Ver posición actual' },
]

export default function VendedorDashboardPage() {
  const { profile, loading: authLoading } = useAuth()
  const [kpis, setKpis]           = useState<KPIVendedor | null>(null)
  const [chartData, setChartData] = useState<VentasChartData[]>([])
  const [rankingPos, setRankingPos] = useState<number | null>(null)
  const [loading, setLoading]     = useState(true)

  useEffect(() => {
    if (!profile) return

    const fetchData = async () => {
      try {
        const now = new Date()
        const dashboard = await apiFetch<{ kpis: any; stats: any }>('/kpis/dashboard')

        if (dashboard.kpis) {
          setKpis({
            ventas_mes:       dashboard.kpis.ventasCerradas ?? 0,
            leads_tomados:    dashboard.kpis.leadsTomados ?? 0,
            leads_cerrados:   dashboard.kpis.ventasCerradas ?? 0,
            comisiones_mes:   Number(dashboard.kpis.comisionGenerada ?? 0),
            tasa_conversion:  Number(dashboard.kpis.tasaConversion ?? 0),
          })
        }

        apiFetch<any[]>('/ranking/activo')
          .then((ranking) => {
            const me = ranking.find((r: any) => r.vendedor_id === profile.id)
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

  return (
    <DashboardLayout profile={profile} title="Mi Dashboard">
      <div className="space-y-6">

        {/* ── Welcome banner ─────────────────── */}
        <div
          className="rounded-xl px-6 py-5 relative overflow-hidden flex items-center justify-between"
          style={{
            background: 'linear-gradient(135deg, #0C1628 0%, #12213A 100%)',
            border: '1px solid rgba(255,255,255,0.07)',
          }}
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
              <p className="text-xs uppercase tracking-widest mb-1" style={{ color: '#2C3E55' }}>
                Comisiones mes
              </p>
              <p className="text-2xl font-bold" style={{ color: '#7FC136' }}>
                {formatCurrency(kpis.comisiones_mes)}
              </p>
            </div>
          )}

          {/* Glow */}
          <div
            className="absolute -right-24 -top-24 w-80 h-80 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(127,193,54,0.07) 0%, transparent 70%)' }}
          />
        </div>

        {/* ── KPI Grid ───────────────────────── */}
        {loading ? <PageSpinner /> : kpis && <KPIGrid kpis={kpis} />}

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
                style={{
                  background: '#0C1628',
                  border: '1px solid rgba(255,255,255,0.07)',
                }}
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
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: `${item.color}18` }}
                >
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
    </DashboardLayout>
  )
}
