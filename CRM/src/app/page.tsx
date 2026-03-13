'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { PageSpinner } from '@/components/ui/Spinner'
import Link from 'next/link'
import { Zap, ArrowRight, BarChart2, Users, Target, Award } from 'lucide-react'

const features = [
  { icon: BarChart2, label: 'Métricas y KPIs en tiempo real' },
  { icon: Users,     label: 'Gestión de vendedores y zonas'  },
  { icon: Target,    label: 'Seguimiento de leads'           },
  { icon: Award,     label: 'Ranking y comisiones'           },
]

export default function RootPage() {
  const { profile, loading } = useAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (loading || !mounted) return
    if (profile) router.replace(profile.rol === 'admin' ? '/admin' : '/vendedor')
  }, [profile, loading, mounted])

  if (!mounted || loading) return <PageSpinner />
  if (profile) return <PageSpinner />

  return (
    <div
      className="min-h-screen w-full flex"
      style={{ background: '#060C17', fontFamily: 'Inter, sans-serif' }}
    >
      {/* grid */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage:
          'linear-gradient(rgba(74,144,217,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(74,144,217,0.03) 1px, transparent 1px)',
        backgroundSize: '48px 48px',
      }} />

      {/* ── LEFT ── */}
      <div className="hidden lg:flex flex-1 flex-col justify-center px-20 relative">
        {/* glow */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse 60% 60% at 30% 50%, rgba(74,144,217,0.08) 0%, transparent 70%)',
        }} />

        <div className="relative z-10 max-w-md">
          {/* logo */}
          <div className="flex items-center gap-3 mb-10">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{
              background: 'linear-gradient(135deg, #4A90D9 0%, #7FC136 100%)',
              boxShadow: '0 0 32px rgba(74,144,217,0.25)',
            }}>
              <Zap className="h-5 w-5 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-2xl font-bold" style={{ color: '#EEF2FF' }}>
              <span style={{ color: '#4A90D9' }}>human</span>
              <span style={{ color: '#7FC136' }}>sap</span>
            </span>
          </div>

          <h2 className="text-4xl font-bold leading-tight mb-4" style={{ color: '#EEF2FF' }}>
            Tu equipo de ventas,<br />
            <span style={{
              background: 'linear-gradient(90deg, #4A90D9, #7FC136)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              en un solo lugar.
            </span>
          </h2>

          <p className="text-base mb-10" style={{ color: '#475569', lineHeight: 1.7 }}>
            CRM diseñado para brokers de seguros. Gestioná vendedores, leads, comisiones y rankings desde un panel centralizado.
          </p>

          <div className="space-y-4">
            {features.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{
                  background: 'rgba(74,144,217,0.1)',
                  border: '1px solid rgba(74,144,217,0.2)',
                }}>
                  <Icon className="h-4 w-4" style={{ color: '#4A90D9' }} />
                </div>
                <span className="text-sm" style={{ color: '#64748B' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* divider */}
      <div className="hidden lg:block w-px self-stretch my-16" style={{
        background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.07) 30%, rgba(255,255,255,0.07) 70%, transparent)',
      }} />

      {/* ── RIGHT ── */}
      <div className="w-full lg:w-[420px] flex flex-col items-center justify-center px-8 py-16 relative">
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse 80% 50% at 70% 50%, rgba(127,193,54,0.05) 0%, transparent 70%)',
        }} />

        <div className="relative z-10 w-full max-w-sm">
          {/* mobile logo */}
          <div className="flex flex-col items-center mb-10 lg:hidden">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4" style={{
              background: 'linear-gradient(135deg, #4A90D9 0%, #7FC136 100%)',
              boxShadow: '0 0 36px rgba(74,144,217,0.25)',
            }}>
              <Zap className="h-6 w-6 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-2xl font-bold">
              <span style={{ color: '#4A90D9' }}>human</span>
              <span style={{ color: '#7FC136' }}>sap</span>
            </span>
            <p className="text-sm mt-1.5" style={{ color: '#475569' }}>CRM para brokers de seguros</p>
          </div>

          {/* heading */}
          <div className="mb-8 hidden lg:block">
            <h3 className="text-xl font-semibold mb-1" style={{ color: '#EEF2FF' }}>Bienvenido</h3>
            <p className="text-sm" style={{ color: '#475569' }}>Ingresá a tu cuenta para continuar</p>
          </div>

          {/* card */}
          <div className="w-full rounded-2xl p-7" style={{
            background: '#0C1628',
            border: '1px solid rgba(255,255,255,0.07)',
            boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
          }}>
            <Link
              href="/login"
              className="w-full py-3.5 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all duration-200"
              style={{
                background: 'linear-gradient(135deg, #4A90D9 0%, #3a7bbf 100%)',
                boxShadow: '0 4px 20px rgba(74,144,217,0.3)',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement
                el.style.boxShadow = '0 8px 32px rgba(74,144,217,0.5)'
                el.style.transform = 'translateY(-1px)'
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement
                el.style.boxShadow = '0 4px 20px rgba(74,144,217,0.3)'
                el.style.transform = 'translateY(0)'
              }}
            >
              Iniciar sesión
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <p className="text-center text-xs mt-8" style={{ color: '#1A2E4A' }}>
            © 2026 humansap · Plataforma CRM
          </p>
        </div>
      </div>
    </div>
  )
}
