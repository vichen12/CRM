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

export function LeadList({ leads, loading, showTomar, onTomar, tomarLoadingId, emptyMessage = 'No hay leads disponibles' }: LeadListProps) {
  if (loading) return <PageSpinner />

  if (leads.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center py-20 rounded-2xl"
        style={{ background: '#0C1628', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ background: 'rgba(139,92,246,0.1)' }}>
          <Target className="h-7 w-7" style={{ color: '#8B5CF6' }} />
        </div>
        <p className="font-medium text-sm" style={{ color: '#475569' }}>{emptyMessage}</p>
        <p className="text-xs mt-1" style={{ color: '#2C3E55' }}>Intentá cambiando el filtro</p>
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
