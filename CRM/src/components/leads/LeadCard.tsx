'use client'

import { Phone, Mail, MapPin, Clock, ArrowRight } from 'lucide-react'
import { LeadEstadoBadge } from './LeadEstadoBadge'
import { formatRelativeTime } from '@/lib/utils/format'
import type { Lead } from '@/lib/types'

interface LeadCardProps {
  lead: Lead
  showTomar?: boolean
  onTomar?: (leadId: string) => void
  tomarLoading?: boolean
}

export function LeadCard({ lead, showTomar, onTomar, tomarLoading }: LeadCardProps) {
  return (
    <div
      className="rounded-xl p-5 flex flex-col gap-4 transition-all duration-150"
      style={{
        background: '#0C1628',
        border: '1px solid rgba(255,255,255,0.07)',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement
        el.style.border = '1px solid rgba(255,255,255,0.12)'
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement
        el.style.border = '1px solid rgba(255,255,255,0.07)'
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold text-sm" style={{ color: '#EEF2FF' }}>
            {lead.nombre} {lead.apellido}
          </h3>
          <div className="flex items-center gap-1 mt-1 text-xs" style={{ color: '#2C3E55' }}>
            <Clock className="h-3 w-3" />
            {formatRelativeTime(lead.created_at)}
          </div>
        </div>
        <LeadEstadoBadge estado={lead.estado} />
      </div>

      {/* Datos */}
      <div className="space-y-2">
        <div className="flex items-center gap-2.5 text-sm" style={{ color: '#475569' }}>
          <div
            className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(74,144,217,0.1)' }}
          >
            <Phone className="h-3 w-3" style={{ color: '#4A90D9' }} />
          </div>
          <span>{lead.telefono}</span>
        </div>

        {lead.email && (
          <div className="flex items-center gap-2.5 text-sm" style={{ color: '#475569' }}>
            <div
              className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(74,144,217,0.1)' }}
            >
              <Mail className="h-3 w-3" style={{ color: '#4A90D9' }} />
            </div>
            <span className="truncate">{lead.email}</span>
          </div>
        )}

        <div className="flex items-center gap-2.5 text-sm" style={{ color: '#475569' }}>
          <div
            className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(127,193,54,0.1)' }}
          >
            <MapPin className="h-3 w-3" style={{ color: '#7FC136' }} />
          </div>
          <span>{lead.zona?.nombre ?? '—'}</span>
        </div>
      </div>

      {lead.notas && (
        <p
          className="text-xs rounded-lg px-3 py-2 line-clamp-2"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.05)',
            color: '#475569',
          }}
        >
          {lead.notas}
        </p>
      )}

      {showTomar && lead.estado === 'nuevo' && (
        <button
          onClick={() => onTomar?.(lead.id)}
          disabled={tomarLoading}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold text-white transition-all duration-150 disabled:opacity-50"
          style={{
            background: 'linear-gradient(135deg, #4A90D9 0%, #3a7bbf 100%)',
            boxShadow: '0 4px 16px rgba(74,144,217,0.25)',
          }}
          onMouseEnter={(e) => {
            if (!tomarLoading) (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 20px rgba(74,144,217,0.35)'
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 16px rgba(74,144,217,0.25)'
          }}
        >
          {tomarLoading ? (
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            <>
              Tomar este lead
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      )}
    </div>
  )
}
