'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react'
import { login } from '@/lib/api/auth'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      router.push('/')
      router.refresh()
    } catch {
      setError('Email o contraseña incorrectos')
    } finally {
      setLoading(false)
    }
  }

  const inputBaseStyle = {
    background: 'rgba(18,33,58,0.9)',
    border: '1px solid rgba(255,255,255,0.07)',
    color: '#EEF2FF',
  }

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    const el = e.currentTarget
    el.style.borderColor = '#4A90D9'
    el.style.boxShadow = '0 0 0 3px rgba(74,144,217,0.12)'
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const el = e.currentTarget
    el.style.borderColor = 'rgba(255,255,255,0.07)'
    el.style.boxShadow = 'none'
  }

  return (
    <div
      className="grid min-h-[660px] w-full overflow-hidden rounded-3xl lg:grid-cols-[1.08fr_0.92fr]"
      style={{
        background: 'rgba(12,22,40,0.78)',
        border: '1px solid rgba(255,255,255,0.09)',
        boxShadow: '0 36px 110px rgba(0,0,0,0.42)',
        backdropFilter: 'blur(18px)',
      }}
    >
      <div
        className="relative hidden min-h-[660px] overflow-hidden lg:block"
        aria-label="Oficina moderna con equipo de trabajo"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1400&q=85")',
          backgroundPosition: 'center',
          backgroundSize: 'cover',
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(90deg, rgba(5,11,20,0.08) 0%, rgba(5,11,20,0.28) 48%, rgba(5,11,20,0.76) 100%)',
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 p-10">
          <div className="max-w-md">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-white/70">
              Gestión comercial
            </p>
            <h2 className="mt-4 text-4xl font-semibold leading-tight text-white">
              Tu cartera, tus ventas y tu equipo en un solo lugar.
            </h2>
            <p className="mt-4 text-sm leading-6 text-white/75">
              Accedé al panel para continuar con el seguimiento de clientes, oportunidades y operaciones.
            </p>
          </div>
        </div>
      </div>

      <div className="flex min-h-[660px] items-center justify-center px-5 py-8 sm:px-10">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <div
              className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl"
              style={{
                background: 'linear-gradient(135deg, #4A90D9 0%, #1D6FB8 100%)',
                boxShadow: '0 14px 36px rgba(74,144,217,0.28)',
              }}
            >
              <ShieldCheck className="h-6 w-6 text-white" strokeWidth={2.3} />
            </div>
            <p className="text-sm font-medium uppercase tracking-[0.16em]" style={{ color: '#94A3B8' }}>
              Acceso privado
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight" style={{ color: '#EEF2FF' }}>
              Ingresá a tu cuenta
            </h1>
            <p className="mt-2 text-sm leading-6" style={{ color: '#94A3B8' }}>
              Usá tus credenciales para entrar al CRM.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label
                className="block text-xs font-medium uppercase tracking-widest"
                style={{ color: '#94A3B8', letterSpacing: '0.08em' }}
              >
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                autoComplete="email"
                required
                className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all duration-150"
                style={inputBaseStyle}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </div>

            <div className="space-y-1.5">
              <label
                className="block text-xs font-medium uppercase tracking-widest"
                style={{ color: '#94A3B8', letterSpacing: '0.08em' }}
              >
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                  className="w-full rounded-xl px-4 py-3 pr-11 text-sm outline-none transition-all duration-150"
                  style={inputBaseStyle}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md transition-colors"
                  style={{ color: '#94A3B8' }}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div
                className="flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm"
                style={{
                  background: 'rgba(239,68,68,0.08)',
                  border: '1px solid rgba(239,68,68,0.18)',
                  color: '#FCA5A5',
                }}
              >
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white transition-all duration-200 disabled:opacity-50"
              style={{
                background: 'linear-gradient(135deg, #4A90D9 0%, #3a7bbf 100%)',
                boxShadow: loading ? 'none' : '0 4px 24px rgba(74,144,217,0.3)',
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(74,144,217,0.4)'
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.currentTarget.style.boxShadow = '0 4px 24px rgba(74,144,217,0.3)'
                }
              }}
            >
              {loading ? (
                <>
                  <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Ingresando...
                </>
              ) : (
                <>
                  Entrar al CRM
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
