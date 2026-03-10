'use client'

import { useEffect, useState } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { KPIGrid } from '@/components/kpis/KPIGrid'
import { VentasChart, ComisionesChart } from '@/components/kpis/VentasChart'
import { PageSpinner } from '@/components/ui/Spinner'
import { useAuth } from '@/hooks/useAuth'
import { apiFetch } from '@/lib/api/client'
import { getMesNombre, formatCurrency } from '@/lib/utils/format'
import { TrendingUp, Target, Award, Activity, ArrowRight, CheckCircle2, Clock } from 'lucide-react'
import Link from 'next/link'
import type { KPIVendedor, VentasChartData } from '@/lib/types'

export default function VendedorDashboardPage() {
  const { profile, loading: authLoading } = useAuth()
  const [kpis, setKpis] = useState<KPIVendedor | null>(null)
  const [chartData, setChartData] = useState<VentasChartData[]>([])
  const [rankingPos, setRankingPos] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!profile) return

    const fetchData = async () => {
      try {
        const now = new Date()

        const dashboard = await apiFetch<{ kpis: any; stats: any }>('/kpis/dashboard')

        if (dashboard.kpis) {
          setKpis({
            ventas_mes: dashboard.kpis.ventasCerradas ?? 0,
            leads_tomados: dashboard.kpis.leadsTomados ?? 0,
            leads_cerrados: dashboard.kpis.ventasCerradas ?? 0,
            comisiones_mes: Number(dashboard.kpis.comisionGenerada ?? 0),
            tasa_conversion: Number(dashboard.kpis.tasaConversion ?? 0),
          })
        }

        // Ranking
        apiFetch<any[]>('/ranking/activo')
          .then((ranking) => {
            const me = ranking.find((r: any) => r.vendedor_id === profile.id)
            if (me?.posicion) setRankingPos(me.posicion)
          })
          .catch(() => {})

        // Chart: últimos 6 meses
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

        {/* Welcome banner */}
        <div
          className="rounded-2xl p-6 flex items-center justify-between overflow-hidden relative"
          style={{
            background: 'linear-gradient(135deg, #131314 0%, #1e2a3a 100%)',
            border: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <div className="relative z-10">
            <p className="text-zinc-400 text-sm font-medium">Bienvenido de vuelta</p>
            <h2 className="text-2xl font-bold text-white mt-0.5">
              {profile.nombre} {profile.apellido}
            </h2>
            <p className="text-zinc-500 text-sm mt-1">
              {mesActual} — seguí así
              {rankingPos && (
                <span className="ml-2 text-[#8BC440] font-semibold">
                  · #{rankingPos} en el ranking
                </span>
              )}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {kpis && (
              <div className="text-right">
                <p className="text-xs text-zinc-500 uppercase tracking-wider">Comisiones mes</p>
                <p className="text-2xl font-bold" style={{ color: '#8BC440' }}>
                  {formatCurrency(kpis.comisiones_mes)}
                </p>
              </div>
            )}
          </div>
          {/* Decorative circles */}
          <div
            className="absolute -right-8 -top-8 w-40 h-40 rounded-full opacity-10"
            style={{ background: '#2A79C2' }}
          />
          <div
            className="absolute right-20 -bottom-10 w-32 h-32 rounded-full opacity-5"
            style={{ background: '#8BC440' }}
          />
        </div>

        {/* KPI Grid */}
        {loading ? <PageSpinner /> : kpis && <KPIGrid kpis={kpis} />}

        {/* Charts row */}
        {!loading && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <VentasChart data={chartData} />
            <ComisionesChart data={chartData} />
          </div>
        )}

        {/* Quick actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { href: '/vendedor/leads', label: 'Ver Leads disponibles', icon: Target, color: '#2A79C2', desc: 'Tomá nuevos leads' },
            { href: '/vendedor/ventas', label: 'Mis Ventas', icon: TrendingUp, color: '#8BC440', desc: 'Revisá tu historial' },
            { href: '/vendedor/ranking', label: 'Ranking mensual', icon: Award, color: '#f59e0b', desc: 'Ver posición actual' },
          ].map((item) => (
            <Link key={item.href} href={item.href}>
              <div
                className="bg-white rounded-2xl p-5 flex items-center gap-4 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 group"
                style={{ border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 30px rgba(0,0,0,0.1)'
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 12px rgba(0,0,0,0.04)'
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${item.color}18` }}
                >
                  <item.icon className="h-5 w-5" style={{ color: item.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-zinc-800">{item.label}</p>
                  <p className="text-xs text-zinc-400">{item.desc}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-zinc-300 group-hover:text-zinc-500 transition-colors flex-shrink-0" />
              </div>
            </Link>
          ))}
        </div>

      </div>
    </DashboardLayout>
  )
}
