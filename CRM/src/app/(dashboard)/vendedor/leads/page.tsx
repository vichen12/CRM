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
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit">
          {TABS.map((t) => (
            <button
              key={t.value}
              onClick={() => setTab(t.value as 'zona' | 'mios')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                tab === t.value
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
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
