'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { LeadList } from '@/components/leads/LeadList'
import { PageSpinner } from '@/components/ui/Spinner'
import { useLeads } from '@/hooks/useLeads'
import { useAuth } from '@/hooks/useAuth'
import { Target, CheckCircle2, Clock, Zap } from 'lucide-react'

const TABS = [
  { label: 'Disponibles en mi zona', value: 'zona' },
  { label: 'Mis leads', value: 'mios' },
]

export default function VendedorLeadsPage() {
  const { profile, loading: authLoading } = useAuth()
  const [tab, setTab] = useState<'zona' | 'mios'>('zona')
  const [tomarLoadingId, setTomarLoadingId] = useState<string | null>(null)

  const leadsZona = useLeads({ zonaId: profile?.zona_id, estado: 'nuevo' })
  const leadsMios  = useLeads({ vendedorId: profile?.id })

  if (authLoading || !profile) return <PageSpinner />

  const handleTomar = async (leadId: string) => {
    setTomarLoadingId(leadId)
    const ok = await leadsZona.tomarLead(leadId)
    setTomarLoadingId(null)
    if (!ok) alert('Este lead ya fue tomado por otro vendedor.')
  }

  const activeList = tab === 'zona' ? leadsZona : leadsMios

  const miosEnProceso = leadsMios.leads.filter((l) => l.estado === 'en_proceso').length
  const miosCerrados  = leadsMios.leads.filter((l) => l.estado === 'cerrado').length

  return (
    <DashboardLayout profile={profile} title="Leads">
      <div className="space-y-5">

        {/* Stats header */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Disponibles en zona', value: leadsZona.leads.length, icon: Target,       color: '#8B5CF6' },
            { label: 'Mis leads',           value: leadsMios.leads.length, icon: Zap,          color: '#4A90D9' },
            { label: 'En proceso',          value: miosEnProceso,          icon: Clock,        color: '#F59E0B' },
            { label: 'Cerrados',            value: miosCerrados,           icon: CheckCircle2, color: '#7FC136' },
          ].map((s) => (
            <div key={s.label} className="rounded-xl p-4" style={{ background: '#0C1628', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${s.color}18` }}>
                  <s.icon className="h-3.5 w-3.5" style={{ color: s.color }} />
                </div>
              </div>
              <p className="text-2xl font-bold" style={{ color: '#EEF2FF' }}>{s.value}</p>
              <p className="text-xs mt-0.5" style={{ color: '#475569' }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 rounded-xl p-1 w-fit" style={{ background: '#12213A', border: '1px solid rgba(255,255,255,0.07)' }}>
          {TABS.map((t) => (
            <button
              key={t.value}
              onClick={() => setTab(t.value as 'zona' | 'mios')}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              style={
                tab === t.value
                  ? { background: '#0C1628', color: '#EEF2FF', boxShadow: '0 1px 4px rgba(0,0,0,0.3)' }
                  : { color: '#475569' }
              }
            >
              {t.label}
              <span
                className="ml-2 text-xs px-1.5 py-0.5 rounded-full"
                style={{
                  background: tab === t.value ? 'rgba(139,92,246,0.2)' : 'rgba(255,255,255,0.05)',
                  color: tab === t.value ? '#8B5CF6' : '#475569',
                }}
              >
                {t.value === 'zona' ? leadsZona.leads.length : leadsMios.leads.length}
              </span>
            </button>
          ))}
        </div>

        {tab === 'zona' ? (
          <LeadList
            leads={leadsZona.leads}
            loading={leadsZona.loading}
            showTomar
            onTomar={handleTomar}
            tomarLoadingId={tomarLoadingId}
            emptyMessage="No hay leads nuevos en tu zona"
          />
        ) : (
          <LeadList
            leads={leadsMios.leads}
            loading={leadsMios.loading}
            emptyMessage="Todavía no tomaste ningún lead"
          />
        )}
      </div>
    </DashboardLayout>
  )
}
