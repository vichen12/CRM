'use client'

import { useEffect, useState } from 'react'
import { Users, Target, TrendingUp, DollarSign, ArrowRight, Crown, Medal, Award, Activity, ArrowUpRight } from 'lucide-react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { LeadEstadoBadge } from '@/components/leads/LeadEstadoBadge'
import { PageSpinner } from '@/components/ui/Spinner'
import { formatRelativeTime, formatCurrency } from '@/lib/utils/format'
import { useAuth } from '@/hooks/useAuth'
import { apiFetch } from '@/lib/api/client'
import Link from 'next/link'
import type { Lead } from '@/lib/types'

interface AdminStats {
  mes: { inicio: string }
  ventas: { cantidad: number; prima_total: number; comision_total: number }
  leads_totales: number
  top_vendedores: Array<{
    id: string
    nombre: string
    apellido: string
    ventas_count: number
    monto_total: number
    puntos: number
  }>
  peor_rendimiento: any[]
}

const positionConfig = [
  { icon: Crown, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', label: '1°' },
  { icon: Medal, color: '#94a3b8', bg: 'rgba(148,163,184,0.1)', label: '2°' },
  { icon: Award, color: '#b45309', bg: 'rgba(180,83,9,0.1)', label: '3°' },
]

export default function AdminDashboardPage() {
  const { profile, loading: authLoading } = useAuth()
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [ultimosLeads, setUltimosLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      apiFetch<AdminStats>('/kpis/admin'),
      apiFetch<Lead[]>('/leads'),
    ]).then(([s, leads]) => {
      setStats(s)
      setUltimosLeads(leads.slice(0, 8))
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  if (authLoading || !profile) return <PageSpinner />

  const kpiCards = [
    {
      label: 'Ventas este mes',
      value: loading ? '—' : (stats?.ventas.cantidad ?? 0),
      icon: TrendingUp,
      color: '#8BC440',
      glow: 'rgba(139,196,64,0.12)',
      detail: 'pólizas cerradas',
    },
    {
      label: 'Leads activos',
      value: loading ? '—' : (stats?.leads_totales ?? 0),
      icon: Target,
      color: '#2A79C2',
      glow: 'rgba(42,121,194,0.12)',
      detail: 'en el sistema',
    },
    {
      label: 'Top performers',
      value: loading ? '—' : (stats?.top_vendedores.length ?? 0),
      icon: Users,
      color: '#a855f7',
      glow: 'rgba(168,85,247,0.12)',
      detail: 'vendedores activos',
    },
    {
      label: 'Prima total mes',
      value: loading ? '—' : (stats?.ventas.prima_total ? `$${Number(stats.ventas.prima_total).toLocaleString('es-AR')}` : '$0'),
      icon: DollarSign,
      color: '#f59e0b',
      glow: 'rgba(245,158,11,0.12)',
      detail: 'acumulado del mes',
    },
  ]

  return (
    <DashboardLayout profile={profile} title="Panel de administración">
      <div className="space-y-6">

        {/* Header welcome */}
        <div
          className="rounded-2xl p-6 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #131314 0%, #1e2a3a 100%)',
            border: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <div className="relative z-10">
            <p className="text-zinc-400 text-sm">Panel de control</p>
            <h2 className="text-2xl font-bold text-white mt-0.5">Administración CRM</h2>
            <p className="text-zinc-500 text-sm mt-1">Vista general del rendimiento del equipo</p>
          </div>
          <div
            className="absolute -right-10 -top-10 w-48 h-48 rounded-full opacity-10"
            style={{ background: '#2A79C2' }}
          />
          <div
            className="absolute right-24 -bottom-12 w-36 h-36 rounded-full opacity-5"
            style={{ background: '#8BC440' }}
          />
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {kpiCards.map((card) => (
            <div
              key={card.label}
              className="bg-white rounded-2xl p-6 relative overflow-hidden"
              style={{
                border: '1px solid rgba(0,0,0,0.06)',
                boxShadow: `0 4px 24px ${card.glow}`,
              }}
            >
              <div className="h-[3px] rounded-full absolute top-0 left-0 right-0" style={{ background: card.color }} />
              <div className="flex items-start justify-between gap-3 mt-2">
                <div>
                  <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">{card.label}</p>
                  <p className="text-3xl font-bold text-zinc-900 mt-2 leading-none">{card.value}</p>
                  <p className="text-xs text-zinc-400 mt-1.5">{card.detail}</p>
                </div>
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${card.color}18` }}
                >
                  <card.icon className="h-6 w-6" style={{ color: card.color }} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
          {/* Últimos leads */}
          <div
            className="xl:col-span-3 bg-white rounded-2xl overflow-hidden"
            style={{ border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 4px 24px rgba(0,0,0,0.04)' }}
          >
            <div
              className="px-6 py-4 flex items-center justify-between"
              style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}
            >
              <div>
                <h2 className="text-sm font-semibold text-zinc-800">Últimos leads</h2>
                <p className="text-xs text-zinc-400 mt-0.5">Actividad reciente</p>
              </div>
              <Link
                href="/admin/leads"
                className="flex items-center gap-1 text-xs font-semibold transition-colors"
                style={{ color: '#2A79C2' }}
              >
                Ver todos <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                    <th className="px-6 py-3 text-left text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Cliente</th>
                    <th className="px-6 py-3 text-left text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Zona</th>
                    <th className="px-6 py-3 text-left text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Estado</th>
                    <th className="px-6 py-3 text-left text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Ingresó</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-10 text-center text-zinc-400 text-sm">Cargando...</td>
                    </tr>
                  ) : ultimosLeads.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-10 text-center text-zinc-400 text-sm">Sin leads aún</td>
                    </tr>
                  ) : (
                    ultimosLeads.map((lead) => (
                      <tr
                        key={lead.id}
                        className="transition-colors"
                        style={{ borderBottom: '1px solid rgba(0,0,0,0.03)' }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#f8fafc' }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = '' }}
                      >
                        <td className="px-6 py-3.5 text-sm font-semibold text-zinc-800">
                          {lead.nombre} {lead.apellido}
                        </td>
                        <td className="px-6 py-3.5 text-sm text-zinc-500">
                          {lead.zona?.nombre ?? '-'}
                        </td>
                        <td className="px-6 py-3.5">
                          <LeadEstadoBadge estado={lead.estado} />
                        </td>
                        <td className="px-6 py-3.5 text-xs text-zinc-400">
                          {formatRelativeTime(lead.created_at)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Top Vendedores */}
          <div
            className="xl:col-span-2 bg-white rounded-2xl overflow-hidden"
            style={{ border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 4px 24px rgba(0,0,0,0.04)' }}
          >
            <div
              className="px-6 py-4 flex items-center justify-between"
              style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}
            >
              <div>
                <h2 className="text-sm font-semibold text-zinc-800">Top Vendedores</h2>
                <p className="text-xs text-zinc-400 mt-0.5">Mes actual</p>
              </div>
              <ArrowUpRight className="h-4 w-4 text-zinc-400" />
            </div>
            <div className="p-4 space-y-2">
              {loading ? (
                <p className="text-center text-zinc-400 text-sm py-8">Cargando...</p>
              ) : !stats?.top_vendedores.length ? (
                <p className="text-center text-zinc-400 text-sm py-8">Sin datos aún</p>
              ) : (
                stats.top_vendedores.slice(0, 5).map((v, i) => {
                  const pos = positionConfig[i] || { icon: Activity, color: '#64748b', bg: 'rgba(100,116,139,0.1)', label: `${i+1}°` }
                  const maxVentas = stats.top_vendedores[0]?.ventas_count || 1
                  const pct = Math.round((v.ventas_count / maxVentas) * 100)

                  return (
                    <div
                      key={v.id}
                      className="flex items-center gap-3 p-3 rounded-xl transition-colors"
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#f8fafc' }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = '' }}
                    >
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold"
                        style={{ background: pos.bg, color: pos.color }}
                      >
                        {pos.label}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-zinc-800 truncate">
                          {v.nombre} {v.apellido}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex-1 h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{ width: `${pct}%`, background: pos.color }}
                            />
                          </div>
                          <span className="text-[11px] font-semibold text-zinc-500 flex-shrink-0">
                            {v.ventas_count} ventas
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>

            {/* Stats footer */}
            {!loading && stats && (
              <div
                className="px-4 py-3 mx-4 mb-4 rounded-xl"
                style={{ background: 'rgba(42,121,194,0.06)', border: '1px solid rgba(42,121,194,0.12)' }}
              >
                <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mb-1">Comisiones del mes</p>
                <p className="text-xl font-bold" style={{ color: '#2A79C2' }}>
                  {formatCurrency(Number(stats.ventas.comision_total ?? 0))}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { href: '/admin/vendedores', label: 'Gestionar vendedores', color: '#2A79C2' },
            { href: '/admin/leads', label: 'Ver todos los leads', color: '#8BC440' },
            { href: '/admin/documentos', label: 'Documentos', color: '#f59e0b' },
            { href: '/admin/noticias', label: 'Publicar noticia', color: '#a855f7' },
          ].map((item) => (
            <Link key={item.href} href={item.href}>
              <div
                className="bg-white rounded-2xl p-4 flex items-center justify-between cursor-pointer transition-all duration-200 group"
                style={{ border: '1px solid rgba(0,0,0,0.06)' }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = `${item.color}08`
                  ;(e.currentTarget as HTMLElement).style.borderColor = `${item.color}30`
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = 'white'
                  ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,0,0,0.06)'
                }}
              >
                <span className="text-sm font-semibold text-zinc-700">{item.label}</span>
                <ArrowRight className="h-4 w-4 text-zinc-300 group-hover:text-zinc-500 transition-colors flex-shrink-0" />
              </div>
            </Link>
          ))}
        </div>

      </div>
    </DashboardLayout>
  )
}
