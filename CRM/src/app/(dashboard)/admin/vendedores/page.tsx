'use client'

import { useState, useEffect } from 'react'
import { Plus, Users, Search } from 'lucide-react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { VendedorTable } from '@/components/vendedores/VendedorTable'
import { VendedorForm } from '@/components/vendedores/VendedorForm'
import { Modal } from '@/components/ui/Modal'
import { PageSpinner } from '@/components/ui/Spinner'
import { useVendedores } from '@/hooks/useVendedores'
import { useAuth } from '@/hooks/useAuth'
import { apiFetch } from '@/lib/api/client'
import type { Zona } from '@/lib/types'

export default function AdminVendedoresPage() {
  const { profile, loading: authLoading } = useAuth()
  const { vendedores, loading, toggleActivo, crearVendedor } = useVendedores()
  const [modalOpen, setModalOpen] = useState(false)
  const [zonas, setZonas] = useState<Zona[]>([])
  const [error, setError] = useState('')
  const [busqueda, setBusqueda] = useState('')
  const [filtroEstado, setFiltroEstado] = useState<'todos' | 'activos' | 'inactivos'>('todos')

  useEffect(() => {
    apiFetch<Zona[]>('/zonas').then(setZonas).catch(() => {})
  }, [])

  if (authLoading || !profile) return <PageSpinner />

  const handleCrear = async (data: Parameters<typeof crearVendedor>[0]) => {
    setError('')
    try {
      await crearVendedor(data)
      setModalOpen(false)
    } catch (e: any) {
      setError(e.message ?? 'Error al crear el vendedor')
    }
  }

  const filtrados = vendedores
    .filter((v) => {
      if (filtroEstado === 'activos') return v.activo
      if (filtroEstado === 'inactivos') return !v.activo
      return true
    })
    .filter((v) => {
      if (!busqueda) return true
      const q = busqueda.toLowerCase()
      return (
        v.nombre.toLowerCase().includes(q) ||
        v.apellido.toLowerCase().includes(q) ||
        v.zona?.nombre.toLowerCase().includes(q)
      )
    })

  const activos = vendedores.filter((v) => v.activo).length

  return (
    <DashboardLayout profile={profile} title="Gestión de vendedores">
      <div className="space-y-6">

        {/* Header */}
        <div
          className="rounded-2xl p-6 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #0C1628 0%, #12213A 100%)',
            border: '1px solid rgba(255,255,255,0.07)',
          }}
        >
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(74,144,217,0.12)', border: '1px solid rgba(74,144,217,0.2)' }}
            >
              <Users className="h-6 w-6" style={{ color: '#4A90D9' }} />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold" style={{ color: '#EEF2FF' }}>Equipo de vendedores</h2>
              <p className="text-sm mt-0.5" style={{ color: '#475569' }}>
                {vendedores.length} registrado{vendedores.length !== 1 ? 's' : ''} · {activos} activo{activos !== 1 ? 's' : ''}
              </p>
            </div>
            <button
              onClick={() => { setError(''); setModalOpen(true) }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 flex-shrink-0"
              style={{ background: '#4A90D9', boxShadow: '0 4px 16px rgba(74,144,217,0.35)' }}
            >
              <Plus className="h-4 w-4" />
              Nuevo vendedor
            </button>
          </div>
          <div className="absolute -right-8 -top-8 w-36 h-36 rounded-full opacity-10 pointer-events-none" style={{ background: 'radial-gradient(circle, #4A90D9, transparent)' }} />
        </div>

        {/* Filtros y búsqueda */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex gap-2">
            {(['todos', 'activos', 'inactivos'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFiltroEstado(f)}
                className="px-4 py-2 rounded-xl text-sm font-semibold capitalize transition-all duration-200"
                style={
                  filtroEstado === f
                    ? { background: '#4A90D9', color: '#fff' }
                    : { background: '#0C1628', color: '#475569', border: '1px solid rgba(255,255,255,0.07)' }
                }
              >
                {f}
              </button>
            ))}
          </div>

          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Buscar vendedor..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl text-sm outline-none transition-all duration-150"
              style={{ background: '#0C1628', border: '1px solid rgba(255,255,255,0.07)', color: '#EEF2FF' }}
              onFocus={(e) => {
                const el = e.currentTarget as HTMLElement
                el.style.borderColor = '#4A90D9'
                el.style.boxShadow = '0 0 0 3px rgba(74,144,217,0.1)'
              }}
              onBlur={(e) => {
                const el = e.currentTarget as HTMLElement
                el.style.borderColor = 'rgba(255,255,255,0.07)'
                el.style.boxShadow = ''
              }}
            />
          </div>
        </div>

        {loading ? <PageSpinner /> : <VendedorTable vendedores={filtrados} onToggleActivo={toggleActivo} />}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Crear vendedor" size="lg">
        {error && (
          <div
            className="mb-4 flex items-center gap-2 px-4 py-3 rounded-xl text-sm"
            style={{ background: 'rgba(239,68,68,0.1)', color: '#F87171', border: '1px solid rgba(239,68,68,0.2)' }}
          >
            {error}
          </div>
        )}
        <VendedorForm zonas={zonas} onSubmit={handleCrear} onCancel={() => setModalOpen(false)} />
      </Modal>
    </DashboardLayout>
  )
}
