'use client'

import { useEffect, useState } from 'react'
import {
  Users, Target, TrendingUp, DollarSign, ArrowRight, Crown, Medal,
  Award, Activity, ArrowUpRight, BarChart2, UserCheck, Percent
} from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { LeadEstadoBadge } from '@/components/leads/LeadEstadoBadge'
import { PageSpinner } from '@/components/ui/Spinner'
import { formatRelativeTime, formatCurrency } from '@/lib/utils/format'
import { useAuth } from '@/hooks/useAuth'
import { apiFetch } from '@/lib/api/client'
import Link from 'next/link'
import type { Lead } from '@/lib/types'

interface VendedorTop {
  id: string
  puntos: number
  ventasCerradas: number
  perfil: { id: string; nombre: string; apellido: string; avatarUrl?: string }
}

interface AdminStats {
  mes: { inicio: string }
  ventas: { cantidad: number; prima_total: number; comision_total: number }
  leads_activos: number
  leads_totales: number
  vendedores_activos: number
  tasa_conversion_global: number
  top_vendedores: VendedorTop[]
  ventas_por_mes: { mes: string; ventas: number; prima: number }[]
  leads_por_estado: { estado: string; _count: number }[]
}

const positionConfig = [
  { icon: Crown,  color: '#F59E0B', dim: 'rgba(245,158,11,0.12)',  label: '1°' },
  { icon: Medal,  color: '#94A3B8', dim: 'rgba(148,163,184,0.12)', label: '2°' },
  { icon: Award,  color: '#CD7C2F', dim: 'rgba(205,124,47,0.12)',  label: '3°' },
]

const LEAD_ESTADO_COLOR: Record<string, string> = {
  nuevo:       '#4A90D9',
  contactado:  '#7FC136',
  en_proceso:  '#F59E0B',
  cerrado:     '#10B981',
  perdido:     '#EF4444',
}

const card = {
  background: '#0C1628',
  border: '1px solid rgba(255,255,255,0.07)',
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl px-3 py-2.5 text-xs" style={{ background: '#12213A', border: '1px solid rgba(255,255,255,0.1)' }}>
      <p className="font-semibold mb-1" style={{ color: '#CBD5E1' }}>{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} style={{ color: p.color }}>
          {p.name}: {p.dataKey === 'prima' ? formatCurrency(p.value) : p.value}
        </p>
      ))}
    </div>
  )
}

function Avatar({ perfil }: { perfil: { nombre: string; apellido: string; avatarUrl?: string } }) {
  const initials = `${perfil.nombre[0]}${perfil.apellido[0]}`
  if (perfil.avatarUrl) {
    return (
      <img
        src={perfil.avatarUrl}
        alt={initials}
        className="w-8 h-8 rounded-lg object-cover flex-shrink-0"
      />
    )
  }
  return (
    <div
      className="w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-bold flex-shrink-0"
      style={{ background: 'linear-gradient(135deg, #4A90D9, #7FC136)', color: '#fff' }}
    >
      {initials}
    </div>
  )
}

export default function AdminDashboardPage() {
  const { profile, loading: authLoading } = useAuth()
  const [stats, setStats]               = useState<AdminStats | null>(null)
  const [ultimosLeads, setUltimosLeads] = useState<Lead[]>([])
  const [loading, setLoading]           = useState(true)

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

  const kpiDefs = [
    {
      key: 'ventas', label: 'Ventas del mes', icon: TrendingUp,
      color: '#7FC136', dim: 'rgba(127,193,54,0.12)',
      value: loading ? '—' : (stats?.ventas.cantidad ?? 0),
      detail: 'pólizas cerradas',
    },
    {
      key: 'leads', label: 'Leads activos', icon: Target,
      color: '#4A90D9', dim: 'rgba(74,144,217,0.12)',
      value: loading ? '—' : (stats?.leads_activos ?? 0),
      detail: 'en proceso actualmente',
    },
    {
      key: 'vendedores', label: 'Vendedores activos', icon: UserCheck,
      color: '#8B5CF6', dim: 'rgba(139,92,246,0.12)',
      value: loading ? '—' : (stats?.vendedores_activos ?? 0),
      detail: 'en el equipo',
    },
    {
      key: 'prima', label: 'Prima total mes', icon: DollarSign,
      color: '#F59E0B', dim: 'rgba(245,158,11,0.12)',
      value: loading ? '—' : formatCurrency(Number(stats?.ventas.prima_total ?? 0)),
      detail: 'acumulado del mes',
    },
    {
      key: 'comision', label: 'Comisiones mes', icon: BarChart2,
      color: '#06B6D4', dim: 'rgba(6,182,212,0.12)',
      value: loading ? '—' : formatCurrency(Number(stats?.ventas.comision_total ?? 0)),
      detail: 'generadas este mes',
    },
    {
      key: 'conversion', label: 'Tasa de conversión', icon: Percent,
      color: '#EC4899', dim: 'rgba(236,72,153,0.12)',
      value: loading ? '—' : `${stats?.tasa_conversion_global ?? 0}%`,
      detail: 'contactados → ventas',
    },
  ]

  const leadsPieData = (stats?.leads_por_estado ?? []).map((l) => ({
    name: l.estado,
    value: l._count,
    color: LEAD_ESTADO_COLOR[l.estado] ?? '#475569',
  }))

  return (
    <DashboardLayout profile={profile} title="Panel de administración">
      <div className="space-y-6">

        {/* ── Welcome ─────────────────────────────── */}
        <div
          className="rounded-xl px-6 py-5 flex items-center justify-between relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #0C1628 0%, #12213A 100%)', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          <div className="relative z-10">
            <p className="text-xs font-medium uppercase tracking-widest mb-1" style={{ color: '#2C3E55' }}>
              Panel de control
            </p>
            <h2 className="text-xl font-bold tracking-tight" style={{ color: '#EEF2FF' }}>
              Administración CRM
            </h2>
            <p className="text-sm mt-0.5" style={{ color: '#475569' }}>
              Vista general del rendimiento del equipo
            </p>
          </div>
          <div
            className="absolute -right-20 -top-20 w-72 h-72 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(74,144,217,0.08) 0%, transparent 70%)' }}
          />
        </div>

        {/* ── KPI Grid 3×2 ─────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
          {kpiDefs.map((def) => (
            <div
              key={def.key}
              className="rounded-xl p-4 relative overflow-hidden transition-all duration-200"
              style={card}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.border = '1px solid rgba(255,255,255,0.12)' }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.border = '1px solid rgba(255,255,255,0.07)' }}
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] font-semibold uppercase tracking-wider leading-tight" style={{ color: '#475569' }}>
                  {def.label}
                </p>
                <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: def.dim }}>
                  <def.icon className="h-3.5 w-3.5" style={{ color: def.color }} />
                </div>
              </div>
              <p className="text-2xl font-bold tracking-tight leading-none" style={{ color: '#EEF2FF' }}>
                {def.value}
              </p>
              <p className="text-[10px] mt-2" style={{ color: '#2C3E55' }}>{def.detail}</p>
              <div
                className="absolute bottom-0 left-0 right-0 h-[2px]"
                style={{ background: `linear-gradient(90deg, ${def.color}50 0%, transparent 100%)` }}
              />
            </div>
          ))}
        </div>

        {/* ── Charts row ───────────────────────────── */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

          {/* Ventas por mes – area chart */}
          <div className="xl:col-span-2 rounded-xl p-5" style={card}>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-sm font-semibold" style={{ color: '#EEF2FF' }}>Ventas últimos 6 meses</h3>
                <p className="text-xs mt-0.5" style={{ color: '#2C3E55' }}>Pólizas cerradas por mes</p>
              </div>
              <TrendingUp className="h-4 w-4" style={{ color: '#7FC136' }} />
            </div>
            {loading ? (
              <div className="h-44 flex items-center justify-center" style={{ color: '#475569' }}>Cargando...</div>
            ) : (
              <ResponsiveContainer width="100%" height={176}>
                <AreaChart data={stats?.ventas_por_mes ?? []} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                  <defs>
                    <linearGradient id="gradVentas" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#7FC136" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#7FC136" stopOpacity={0}    />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="mes" tick={{ fill: '#2C3E55', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#2C3E55', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone" dataKey="ventas" name="Ventas"
                    stroke="#7FC136" strokeWidth={2}
                    fill="url(#gradVentas)" dot={{ fill: '#7FC136', r: 3 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Leads por estado – pie chart */}
          <div className="rounded-xl p-5" style={card}>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-sm font-semibold" style={{ color: '#EEF2FF' }}>Leads por estado</h3>
                <p className="text-xs mt-0.5" style={{ color: '#2C3E55' }}>Distribución actual</p>
              </div>
              <Target className="h-4 w-4" style={{ color: '#4A90D9' }} />
            </div>
            {loading || leadsPieData.length === 0 ? (
              <div className="h-44 flex items-center justify-center text-sm" style={{ color: '#475569' }}>
                {loading ? 'Cargando...' : 'Sin datos'}
              </div>
            ) : (
              <>
                <ResponsiveContainer width="100%" height={140}>
                  <PieChart>
                    <Pie
                      data={leadsPieData}
                      cx="50%" cy="50%"
                      innerRadius={42} outerRadius={62}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {leadsPieData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val, name) => [val, name]}
                      contentStyle={{ background: '#12213A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12 }}
                      labelStyle={{ color: '#CBD5E1' }}
                      itemStyle={{ color: '#94A3B8' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 gap-1.5 mt-2">
                  {leadsPieData.slice(0, 6).map((d) => (
                    <div key={d.name} className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: d.color }} />
                      <span className="text-[11px] capitalize truncate" style={{ color: '#475569' }}>
                        {d.name.replace('_', ' ')} ({d.value})
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* ── Leads + Top Vendedores ───────────────── */}
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">

          {/* Últimos leads */}
          <div className="xl:col-span-3 rounded-xl overflow-hidden" style={card}>
            <div
              className="px-5 py-4 flex items-center justify-between"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
            >
              <div>
                <h2 className="text-sm font-semibold" style={{ color: '#EEF2FF' }}>Últimos leads</h2>
                <p className="text-xs mt-0.5" style={{ color: '#2C3E55' }}>Actividad reciente</p>
              </div>
              <Link href="/admin/leads" className="flex items-center gap-1 text-xs font-semibold" style={{ color: '#4A90D9' }}>
                Ver todos <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    {['Cliente', 'Zona', 'Estado', 'Ingresó'].map((h) => (
                      <th
                        key={h}
                        className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider"
                        style={{ color: '#2C3E55' }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="px-5 py-10 text-center text-sm" style={{ color: '#475569' }}>Cargando...</td>
                    </tr>
                  ) : ultimosLeads.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-5 py-10 text-center text-sm" style={{ color: '#475569' }}>Sin leads aún</td>
                    </tr>
                  ) : (
                    ultimosLeads.map((lead) => (
                      <tr
                        key={lead.id}
                        className="transition-colors"
                        style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)' }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = '' }}
                      >
                        <td className="px-5 py-3 text-sm font-semibold" style={{ color: '#CBD5E1' }}>
                          {lead.nombre} {lead.apellido}
                        </td>
                        <td className="px-5 py-3 text-sm" style={{ color: '#475569' }}>
                          {lead.zona?.nombre ?? '—'}
                        </td>
                        <td className="px-5 py-3">
                          <LeadEstadoBadge estado={lead.estado} />
                        </td>
                        <td className="px-5 py-3 text-xs" style={{ color: '#2C3E55' }}>
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
          <div className="xl:col-span-2 rounded-xl overflow-hidden flex flex-col" style={card}>
            <div
              className="px-5 py-4 flex items-center justify-between"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
            >
              <div>
                <h2 className="text-sm font-semibold" style={{ color: '#EEF2FF' }}>Top Vendedores</h2>
                <p className="text-xs mt-0.5" style={{ color: '#2C3E55' }}>Mes actual · por puntos</p>
              </div>
              <ArrowUpRight className="h-4 w-4" style={{ color: '#2C3E55' }} />
            </div>

            <div className="p-4 space-y-1.5 flex-1 overflow-y-auto" style={{ maxHeight: 340 }}>
              {loading ? (
                <p className="text-center text-sm py-8" style={{ color: '#475569' }}>Cargando...</p>
              ) : !stats?.top_vendedores.length ? (
                <p className="text-center text-sm py-8" style={{ color: '#475569' }}>Sin datos aún</p>
              ) : (
                stats.top_vendedores.map((v, i) => {
                  const pos = positionConfig[i] || { icon: Activity, color: '#475569', dim: 'rgba(71,85,105,0.12)', label: `${i + 1}°` }
                  const maxPuntos = Number(stats.top_vendedores[0]?.puntos ?? 1) || 1
                  const pct = Math.round((Number(v.puntos) / maxPuntos) * 100)

                  return (
                    <div
                      key={v.perfil.id}
                      className="flex items-center gap-3 p-2.5 rounded-lg transition-colors"
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)' }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = '' }}
                    >
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-[11px] font-bold"
                        style={{ background: pos.dim, color: pos.color }}
                      >
                        {pos.label}
                      </div>
                      <Avatar perfil={v.perfil} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold truncate" style={{ color: '#CBD5E1' }}>
                          {v.perfil.nombre} {v.perfil.apellido}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <div
                            className="flex-1 h-1 rounded-full overflow-hidden"
                            style={{ background: 'rgba(255,255,255,0.05)' }}
                          >
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{ width: `${pct}%`, background: pos.color }}
                            />
                          </div>
                          <span className="text-[10px] font-semibold flex-shrink-0" style={{ color: '#475569' }}>
                            {Number(v.puntos).toFixed(0)} pts
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>

        {/* ── Quick links ──────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { href: '/admin/vendedores',    label: 'Vendedores',    color: '#4A90D9' },
            { href: '/admin/leads',         label: 'Leads',         color: '#7FC136' },
            { href: '/admin/documentos',    label: 'Documentos',    color: '#F59E0B' },
            { href: '/admin/noticias',      label: 'Noticias',      color: '#8B5CF6' },
            { href: '/admin/configuracion', label: 'Configuración', color: '#06B6D4' },
          ].map((item) => (
            <Link key={item.href} href={item.href}>
              <div
                className="rounded-xl p-4 flex items-center justify-between cursor-pointer transition-all duration-150"
                style={card}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement
                  el.style.background = `${item.color}0A`
                  el.style.borderColor = `${item.color}25`
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement
                  el.style.background = '#0C1628'
                  el.style.borderColor = 'rgba(255,255,255,0.07)'
                }}
              >
                <span className="text-sm font-medium" style={{ color: '#94A3B8' }}>{item.label}</span>
                <ArrowRight className="h-3.5 w-3.5 flex-shrink-0" style={{ color: '#2C3E55' }} />
              </div>
            </Link>
          ))}
        </div>

      </div>
    </DashboardLayout>
  )
}
