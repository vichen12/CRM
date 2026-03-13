'use client'

import { Phone, Mail, MapPin, Clock, ArrowRight, User } from 'lucide-react'
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
  const initials = `${lead.nombre[0] ?? ''}${lead.apellido[0] ?? ''}`.toUpperCase()

  return (
    <div
      className="rounded-xl overflow-hidden transition-all duration-150 flex flex-col"
      style={{ background: '#0C1628', border: '1px solid rgba(255,255,255,0.07)' }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement
        el.style.border = '1px solid rgba(255,255,255,0.12)'
        el.style.transform = 'translateY(-1px)'
        el.style.boxShadow = '0 8px 24px rgba(0,0,0,0.3)'
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement
        el.style.border = '1px solid rgba(255,255,255,0.07)'
        el.style.transform = 'translateY(0)'
        el.style.boxShadow = 'none'
      }}
    >
      {/* Header with avatar */}
      <div className="p-4 flex items-start gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #8B5CF6, #6D28D9)' }}
        >
          {initials || <User className="h-4 w-4" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-sm leading-tight" style={{ color: '#EEF2FF' }}>
              {lead.nombre} {lead.apellido}
            </h3>
            <LeadEstadoBadge estado={lead.estado} />
          </div>
          <div className="flex items-center gap-1 mt-1 text-xs" style={{ color: '#2C3E55' }}>
            <Clock className="h-3 w-3" />
            {formatRelativeTime(lead.created_at)}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: 'rgba(255,255,255,0.04)' }} />

      {/* Contact info */}
      <div className="px-4 py-3 space-y-2 flex-1">
        <div className="flex items-center gap-2.5 text-sm" style={{ color: '#475569' }}>
          <div className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(74,144,217,0.1)' }}>
            <Phone className="h-3 w-3" style={{ color: '#4A90D9' }} />
          </div>
          <span>{lead.telefono}</span>
        </div>

        {lead.email && (
          <div className="flex items-center gap-2.5 text-sm" style={{ color: '#475569' }}>
            <div className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(74,144,217,0.1)' }}>
              <Mail className="h-3 w-3" style={{ color: '#4A90D9' }} />
            </div>
            <span className="truncate">{lead.email}</span>
          </div>
        )}

        <div className="flex items-center gap-2.5 text-sm" style={{ color: '#475569' }}>
          <div className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(127,193,54,0.1)' }}>
            <MapPin className="h-3 w-3" style={{ color: '#7FC136' }} />
          </div>
          <span>{lead.zona?.nombre ?? '—'}</span>
        </div>
      </div>

      {lead.notas && (
        <div className="px-4 pb-3">
          <p className="text-xs rounded-lg px-3 py-2 line-clamp-2" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', color: '#475569' }}>
            {lead.notas}
          </p>
        </div>
      )}

      {/* Tomar button */}
      {showTomar && lead.estado === 'nuevo' && (
        <div className="px-4 pb-4">
          <button
            onClick={() => onTomar?.(lead.id)}
            disabled={tomarLoading}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold text-white transition-all duration-150 disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)', boxShadow: '0 4px 16px rgba(139,92,246,0.25)' }}
            onMouseEnter={(e) => { if (!tomarLoading) (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 20px rgba(139,92,246,0.4)' }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 16px rgba(139,92,246,0.25)' }}
          >
            {tomarLoading ? (
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <><span>Tomar este lead</span><ArrowRight className="h-4 w-4" /></>
            )}
          </button>
        </div>
      )}
    </div>
  )
}
