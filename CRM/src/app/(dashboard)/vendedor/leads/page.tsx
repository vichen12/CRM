'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { LeadList } from '@/components/leads/LeadList'
import { PageSpinner } from '@/components/ui/Spinner'
import { useLeads } from '@/hooks/useLeads'
import { useAuth } from '@/hooks/useAuth'

const TABS = [
  { label: 'Disponibles en mi zona', value: 'zona' },
  { label: 'Mis leads', value: 'mios' },
]

export default function VendedorLeadsPage() {
  const { profile, loading: authLoading } = useAuth()
  const [tab, setTab] = useState<'zona' | 'mios'>('zona')
  const [tomarLoadingId, setTomarLoadingId] = useState<string | null>(null)

  const leadsZona = useLeads({
    zonaId: profile?.zona_id,
    estado: 'nuevo',
  })

  const leadsMios = useLeads({
    vendedorId: profile?.id,
  })

  if (authLoading || !profile) return <PageSpinner />

  const handleTomar = async (leadId: string) => {
    setTomarLoadingId(leadId)
    const ok = await leadsZona.tomarLead(leadId)
    setTomarLoadingId(null)
    if (!ok) {
      alert('Este lead ya fue tomado por otro vendedor.')
    }
  }

  const activeList = tab === 'zona' ? leadsZona : leadsMios

  return (
    <DashboardLayout profile={profile} title="Leads">
      <div className="space-y-4">
        {/* Tabs */}
        <div
          className="flex gap-1 rounded-xl p-1 w-fit"
          style={{ background: '#12213A', border: '1px solid rgba(255,255,255,0.07)' }}
        >
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
