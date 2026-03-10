import { LeadCard } from './LeadCard'
import { PageSpinner } from '@/components/ui/Spinner'
import { Target } from 'lucide-react'
import type { Lead } from '@/lib/types'

interface LeadListProps {
  leads: Lead[]
  loading?: boolean
  showTomar?: boolean
  onTomar?: (leadId: string) => void
  tomarLoadingId?: string | null
  emptyMessage?: string
}

export function LeadList({
  leads,
  loading,
  showTomar,
  onTomar,
  tomarLoadingId,
  emptyMessage = 'No hay leads disponibles',
}: LeadListProps) {
  if (loading) return <PageSpinner />

  if (leads.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center py-20 rounded-2xl bg-white"
        style={{ border: '1px solid rgba(0,0,0,0.06)' }}
      >
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
          style={{ background: 'rgba(42,121,194,0.08)' }}
        >
          <Target className="h-7 w-7" style={{ color: '#2A79C2' }} />
        </div>
        <p className="text-zinc-500 font-medium text-sm">{emptyMessage}</p>
        <p className="text-zinc-400 text-xs mt-1">Intentá cambiando el filtro</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {leads.map((lead) => (
        <LeadCard
          key={lead.id}
          lead={lead}
          showTomar={showTomar}
          onTomar={onTomar}
          tomarLoading={tomarLoadingId === lead.id}
        />
      ))}
    </div>
  )
}
