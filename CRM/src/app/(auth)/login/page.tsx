'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, AlertCircle, Zap, ArrowRight } from 'lucide-react'
import { login } from '@/lib/api/auth'

export default function LoginPage() {
  const [email, setEmail]           = useState('')
  const [password, setPassword]     = useState('')
  const [showPassword, setShowPass] = useState(false)
  const [error, setError]           = useState('')
  const [loading, setLoading]       = useState(false)
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

  return (
    <div className="w-full">
      {/* Brand mark */}
      <div className="flex flex-col items-center mb-8">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
          style={{
            background: 'linear-gradient(135deg, #4A90D9 0%, #7FC136 100%)',
            boxShadow: '0 0 40px rgba(74,144,217,0.25)',
          }}
        >
          <Zap className="h-6 w-6 text-white" strokeWidth={2.5} />
        </div>
        <h1 className="text-2xl font-bold tracking-tight" style={{ color: '#EEF2FF' }}>
          <span style={{ color: '#4A90D9' }}>human</span>
          <span style={{ color: '#7FC136' }}>sap</span>
        </h1>
        <p className="text-sm mt-1.5" style={{ color: '#2C3E55' }}>
          Ingresá a tu cuenta
        </p>
      </div>

      {/* Card */}
      <div
        className="rounded-2xl p-7"
        style={{
          background: '#0C1628',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 32px 80px rgba(0,0,0,0.4)',
        }}
      >
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email */}
          <div className="space-y-1.5">
            <label
              className="block text-xs font-medium uppercase tracking-widest"
              style={{ color: '#2C3E55', letterSpacing: '0.08em' }}
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
              className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-150"
              style={{
                background: '#12213A',
                border: '1px solid rgba(255,255,255,0.07)',
                color: '#EEF2FF',
              }}
              onFocus={(e) => {
                const el = e.currentTarget
                el.style.borderColor = '#4A90D9'
                el.style.boxShadow = '0 0 0 3px rgba(74,144,217,0.12)'
              }}
              onBlur={(e) => {
                const el = e.currentTarget
                el.style.borderColor = 'rgba(255,255,255,0.07)'
                el.style.boxShadow = 'none'
              }}
            />
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label
              className="block text-xs font-medium uppercase tracking-widest"
              style={{ color: '#2C3E55', letterSpacing: '0.08em' }}
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
                className="w-full px-4 py-3 pr-11 rounded-xl text-sm outline-none transition-all duration-150"
                style={{
                  background: '#12213A',
                  border: '1px solid rgba(255,255,255,0.07)',
                  color: '#EEF2FF',
                }}
                onFocus={(e) => {
                  const el = e.currentTarget
                  el.style.borderColor = '#4A90D9'
                  el.style.boxShadow = '0 0 0 3px rgba(74,144,217,0.12)'
                }}
                onBlur={(e) => {
                  const el = e.currentTarget
                  el.style.borderColor = 'rgba(255,255,255,0.07)'
                  el.style.boxShadow = 'none'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPass((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-md transition-colors"
                style={{ color: '#2C3E55' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#94A3B8' }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = '#2C3E55' }}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div
              className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm"
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

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
            style={{
              background: 'linear-gradient(135deg, #4A90D9 0%, #3a7bbf 100%)',
              boxShadow: loading ? 'none' : '0 4px 24px rgba(74,144,217,0.3)',
            }}
            onMouseEnter={(e) => {
              if (!loading) (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 32px rgba(74,144,217,0.4)'
            }}
            onMouseLeave={(e) => {
              if (!loading) (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 24px rgba(74,144,217,0.3)'
            }}
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Ingresando...
              </>
            ) : (
              <>
                Ingresar al sistema
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>
      </div>

      <p className="text-center text-xs mt-6" style={{ color: '#1A2E4A' }}>
        © 2026 humansap · CRM Platform
      </p>
    </div>
  )
}
