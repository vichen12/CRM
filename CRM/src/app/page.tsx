'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { PageSpinner } from '@/components/ui/Spinner'
import Link from 'next/link'
import {
  Zap, TrendingUp, Users, FileText, Bell, BarChart2,
  ArrowRight, Shield, Award, Target,
} from 'lucide-react'

/* ─── tiny mock cards to show inside the preview pane ─── */
const kpis = [
  { label: 'Ventas este mes', value: '$284.500', change: '+12%', color: '#4A90D9' },
  { label: 'Leads activos',   value: '47',       change: '+8%',  color: '#7FC136' },
  { label: 'Comisiones',      value: '$18.320',  change: '+5%',  color: '#8B5CF6' },
]

const features = [
  { icon: BarChart2, label: 'Dashboard en tiempo real', color: '#4A90D9' },
  { icon: Users,     label: 'Gestión de vendedores',    color: '#7FC136' },
  { icon: Target,    label: 'Seguimiento de leads',     color: '#8B5CF6' },
  { icon: Award,     label: 'Ranking y comisiones',     color: '#F59E0B' },
  { icon: FileText,  label: 'Biblioteca de documentos', color: '#06B6D4' },
  { icon: Bell,      label: 'Noticias y comunicados',   color: '#EF4444' },
]

export default function RootPage() {
  const { profile, loading } = useAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (loading || !mounted) return
    if (profile) {
      router.replace(profile.rol === 'admin' ? '/admin' : '/vendedor')
    }
  }, [profile, loading, mounted])

  /* still resolving auth → spinner */
  if (!mounted || loading) return <PageSpinner />

  /* logged in → spinner while redirecting */
  if (profile) return <PageSpinner />

  /* not logged in → landing page */
  return (
    <div
      className="min-h-screen w-full flex overflow-hidden"
      style={{ background: '#060C17', fontFamily: 'Inter, sans-serif' }}
    >
      {/* ── grid bg overlay ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(74,144,217,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(74,144,217,0.04) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
      {/* radial glow top-left */}
      <div
        className="absolute top-0 left-0 w-[600px] h-[600px] pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 0% 0%, rgba(74,144,217,0.10) 0%, transparent 70%)',
        }}
      />
      {/* radial glow bottom-right */}
      <div
        className="absolute bottom-0 right-0 w-[500px] h-[500px] pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 100% 100%, rgba(127,193,54,0.08) 0%, transparent 70%)',
        }}
      />

      {/* ════════════════════════════════
          LEFT — preview pane (hidden on mobile)
          ════════════════════════════════ */}
      <div className="hidden lg:flex flex-1 flex-col justify-center px-16 relative z-10">
        {/* mock browser chrome */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: '#0A1220',
            border: '1px solid rgba(255,255,255,0.07)',
            boxShadow: '0 40px 120px rgba(0,0,0,0.6)',
            maxWidth: 560,
          }}
        >
          {/* title bar */}
          <div
            className="flex items-center gap-2 px-4 py-3"
            style={{ background: '#0C1628', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
          >
            <span className="w-3 h-3 rounded-full" style={{ background: '#EF4444' }} />
            <span className="w-3 h-3 rounded-full" style={{ background: '#F59E0B' }} />
            <span className="w-3 h-3 rounded-full" style={{ background: '#7FC136' }} />
            <div
              className="ml-4 flex-1 rounded-md px-3 py-1 text-xs"
              style={{ background: '#12213A', color: '#2C3E55' }}
            >
              humansapseguros.vercel.app
            </div>
          </div>

          {/* mock content */}
          <div className="p-6 space-y-5">
            {/* KPI row */}
            <div className="grid grid-cols-3 gap-3">
              {kpis.map((k) => (
                <div
                  key={k.label}
                  className="rounded-xl p-4"
                  style={{
                    background: '#0C1628',
                    border: '1px solid rgba(255,255,255,0.07)',
                    borderBottom: `2px solid ${k.color}`,
                  }}
                >
                  <p className="text-xs mb-1" style={{ color: '#475569' }}>{k.label}</p>
                  <p className="text-lg font-bold" style={{ color: '#EEF2FF' }}>{k.value}</p>
                  <p className="text-xs font-semibold mt-0.5" style={{ color: k.color }}>{k.change}</p>
                </div>
              ))}
            </div>

            {/* fake chart bar */}
            <div
              className="rounded-xl p-4"
              style={{ background: '#0C1628', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <p className="text-xs font-medium mb-3" style={{ color: '#475569' }}>Ventas últimos 6 meses</p>
              <div className="flex items-end gap-2 h-16">
                {[35, 55, 40, 70, 60, 85].map((h, i) => (
                  <div key={i} className="flex-1 rounded-t-md transition-all" style={{
                    height: `${h}%`,
                    background: i === 5
                      ? 'linear-gradient(180deg, #4A90D9 0%, #3a7bbf 100%)'
                      : 'rgba(74,144,217,0.25)',
                  }} />
                ))}
              </div>
              <div className="flex justify-between mt-2">
                {['Sep','Oct','Nov','Dic','Ene','Feb'].map((m) => (
                  <span key={m} className="flex-1 text-center text-xs" style={{ color: '#2C3E55' }}>{m}</span>
                ))}
              </div>
            </div>

            {/* feature pills */}
            <div className="flex flex-wrap gap-2">
              {features.map(({ icon: Icon, label, color }) => (
                <div
                  key={label}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs"
                  style={{
                    background: `${color}14`,
                    border: `1px solid ${color}30`,
                    color,
                  }}
                >
                  <Icon className="h-3 w-3" />
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* floating badge */}
        <div
          className="absolute bottom-12 left-24 flex items-center gap-3 px-4 py-3 rounded-2xl"
          style={{
            background: '#0C1628',
            border: '1px solid rgba(127,193,54,0.2)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          }}
        >
          <div className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(127,193,54,0.15)' }}>
            <TrendingUp className="h-4 w-4" style={{ color: '#7FC136' }} />
          </div>
          <div>
            <p className="text-xs font-semibold" style={{ color: '#EEF2FF' }}>Ranking actualizado</p>
            <p className="text-xs" style={{ color: '#475569' }}>Resultados de febrero</p>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════
          RIGHT — auth pane
          ════════════════════════════════ */}
      <div className="w-full lg:w-[440px] flex flex-col items-center justify-center px-8 py-12 relative z-10">
        {/* logo */}
        <div className="flex flex-col items-center mb-10">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
            style={{
              background: 'linear-gradient(135deg, #4A90D9 0%, #7FC136 100%)',
              boxShadow: '0 0 48px rgba(74,144,217,0.3)',
            }}
          >
            <Zap className="h-7 w-7 text-white" strokeWidth={2.5} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight" style={{ color: '#EEF2FF' }}>
            <span style={{ color: '#4A90D9' }}>human</span>
            <span style={{ color: '#7FC136' }}>sap</span>
          </h1>
          <p className="text-sm mt-2 text-center max-w-[220px]" style={{ color: '#475569' }}>
            La plataforma CRM para tu equipo de ventas
          </p>
        </div>

        {/* card */}
        <div
          className="w-full rounded-2xl p-8 space-y-4"
          style={{
            background: '#0C1628',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 32px 80px rgba(0,0,0,0.5)',
          }}
        >
          <Link
            href="/login"
            className="w-full py-3.5 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all duration-200"
            style={{
              background: 'linear-gradient(135deg, #4A90D9 0%, #3a7bbf 100%)',
              boxShadow: '0 4px 24px rgba(74,144,217,0.35)',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 36px rgba(74,144,217,0.5)'
              ;(e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 24px rgba(74,144,217,0.35)'
              ;(e.currentTarget as HTMLElement).style.transform = 'translateY(0)'
            }}
          >
            Iniciar sesión
            <ArrowRight className="h-4 w-4" />
          </Link>

          <div className="flex items-center gap-3 py-1">
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
            <span className="text-xs" style={{ color: '#2C3E55' }}>acceso exclusivo</span>
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
          </div>

          {/* feature list */}
          <div className="space-y-3 pt-1">
            {[
              { icon: Shield,    text: 'Acceso seguro por rol',         color: '#4A90D9' },
              { icon: BarChart2, text: 'Métricas y KPIs en vivo',       color: '#7FC136' },
              { icon: Award,     text: 'Ranking de vendedores',         color: '#8B5CF6' },
            ].map(({ icon: Icon, text, color }) => (
              <div key={text} className="flex items-center gap-3">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: `${color}18` }}
                >
                  <Icon className="h-3.5 w-3.5" style={{ color }} />
                </div>
                <span className="text-sm" style={{ color: '#475569' }}>{text}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-center text-xs mt-8" style={{ color: '#1A2E4A' }}>
          © 2026 humansap · CRM Platform
        </p>
      </div>
    </div>
  )
}
