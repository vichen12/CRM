'use client'

import { useState, useEffect } from 'react'
import { Plus, Target } from 'lucide-react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { LeadList } from '@/components/leads/LeadList'
import { LeadForm } from '@/components/leads/LeadForm'
import { Modal } from '@/components/ui/Modal'
import { PageSpinner } from '@/components/ui/Spinner'
import { useLeads } from '@/hooks/useLeads'
import { useAuth } from '@/hooks/useAuth'
import { apiFetch } from '@/lib/api/client'
import { leadsApi } from '@/lib/api/leads'
import type { Zona } from '@/lib/types'

const FILTROS = [
  { label: 'Todos', value: '', color: '#64748b' },
  { label: 'Nuevos', value: 'nuevo', color: '#2A79C2' },
  { label: 'Tomados', value: 'tomado', color: '#f59e0b' },
  { label: 'En proceso', value: 'en_proceso', color: '#a855f7' },
  { label: 'Cerrados', value: 'cerrado', color: '#8BC440' },
]

export default function AdminLeadsPage() {
  const { profile, loading: authLoading } = useAuth()
  const [filtroEstado, setFiltroEstado] = useState('')
  const { leads, loading, refetch } = useLeads({ estado: filtroEstado || undefined })
  const [modalOpen, setModalOpen] = useState(false)
  const [zonas, setZonas] = useState<Zona[]>([])

  useEffect(() => {
    apiFetch<Zona[]>('/zonas').then(setZonas).catch(() => {})
  }, [])

  if (authLoading || !profile) return <PageSpinner />

  const handleCrearLead = async (data: any) => {
    await leadsApi.create(data)
    await refetch()
    setModalOpen(false)
  }

  const filtroActivo = FILTROS.find((f) => f.value === filtroEstado)

  return (
    <DashboardLayout profile={profile} title="Leads">
      <div className="space-y-6">

        {/* Header */}
        <div
          className="rounded-2xl p-6 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #131314 0%, #1e2a3a 100%)',
            border: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(42,121,194,0.2)', border: '1px solid rgba(42,121,194,0.3)' }}
            >
              <Target className="h-6 w-6" style={{ color: '#2A79C2' }} />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-white">Gestión de leads</h2>
              <p className="text-zinc-400 text-sm mt-0.5">
                {loading ? '...' : leads.length} leads
                {filtroActivo?.value ? ` · ${filtroActivo.label}` : ' en total'}
              </p>
            </div>
            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 flex-shrink-0"
              style={{ background: '#2A79C2', boxShadow: '0 4px 16px rgba(42,121,194,0.4)' }}
            >
              <Plus className="h-4 w-4" />
              Nuevo lead
            </button>
          </div>
          <div className="absolute -right-8 -top-8 w-36 h-36 rounded-full opacity-10" style={{ background: '#8BC440' }} />
        </div>

        {/* Filtros */}
        <div className="flex gap-2 flex-wrap">
          {FILTROS.map((f) => {
            const isActive = filtroEstado === f.value
            return (
              <button
                key={f.value}
                onClick={() => setFiltroEstado(f.value)}
                className="px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200"
                style={
                  isActive
                    ? { background: f.color, color: 'white', border: `1px solid ${f.color}`, boxShadow: `0 4px 12px ${f.color}40` }
                    : { background: 'white', color: '#64748b', border: '1px solid rgba(0,0,0,0.08)' }
                }
              >
                {f.label}
              </button>
            )
          })}
        </div>

        <LeadList leads={leads} loading={loading} />
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Nuevo lead" size="lg">
        <LeadForm zonas={zonas} onSubmit={handleCrearLead} onCancel={() => setModalOpen(false)} />
      </Modal>
    </DashboardLayout>
  )
}
