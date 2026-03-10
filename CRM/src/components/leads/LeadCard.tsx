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
      className="bg-white rounded-2xl p-5 flex flex-col gap-4 transition-all duration-200 hover:-translate-y-0.5"
      style={{
        border: '1px solid rgba(0,0,0,0.06)',
        boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 30px rgba(0,0,0,0.1)' }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 12px rgba(0,0,0,0.04)' }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold text-zinc-800 text-sm">
            {lead.nombre} {lead.apellido}
          </h3>
          <div className="flex items-center gap-1 mt-0.5 text-xs text-zinc-400">
            <Clock className="h-3 w-3" />
            {formatRelativeTime(lead.created_at)}
          </div>
        </div>
        <LeadEstadoBadge estado={lead.estado} />
      </div>

      {/* Datos */}
      <div className="space-y-2">
        <div className="flex items-center gap-2.5 text-sm text-zinc-600">
          <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(42,121,194,0.1)' }}>
            <Phone className="h-3 w-3" style={{ color: '#2A79C2' }} />
          </div>
          <span>{lead.telefono}</span>
        </div>

        {lead.email && (
          <div className="flex items-center gap-2.5 text-sm text-zinc-600">
            <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(42,121,194,0.1)' }}>
              <Mail className="h-3 w-3" style={{ color: '#2A79C2' }} />
            </div>
            <span className="truncate">{lead.email}</span>
          </div>
        )}

        <div className="flex items-center gap-2.5 text-sm text-zinc-600">
          <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(139,196,64,0.1)' }}>
            <MapPin className="h-3 w-3" style={{ color: '#8BC440' }} />
          </div>
          <span>{lead.zona?.nombre ?? '-'}</span>
        </div>
      </div>

      {lead.notas && (
        <p
          className="text-xs text-zinc-500 rounded-xl px-3 py-2 line-clamp-2"
          style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.04)' }}
        >
          {lead.notas}
        </p>
      )}

      {showTomar && lead.estado === 'nuevo' && (
        <button
          onClick={() => onTomar?.(lead.id)}
          disabled={tomarLoading}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 disabled:opacity-60"
          style={{
            background: 'linear-gradient(135deg, #2A79C2, #1f6aad)',
            boxShadow: '0 4px 12px rgba(42,121,194,0.3)',
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
