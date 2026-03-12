import { FileText, Download, Trash2, ExternalLink } from 'lucide-react'
import { formatDate } from '@/lib/utils/format'
import type { Documento, TipoDocumento } from '@/lib/types'

interface DocumentoCardProps {
  documento: Documento
  canDelete?: boolean
  onDelete?: (id: string) => void
}

const tipoConfig: Record<TipoDocumento, { label: string; color: string; bg: string }> = {
  producto:   { label: 'Producto',   color: '#4A90D9', bg: 'rgba(74,144,217,0.12)'  },
  cobertura:  { label: 'Cobertura',  color: '#7FC136', bg: 'rgba(127,193,54,0.12)'  },
  proceso:    { label: 'Proceso',    color: '#F59E0B', bg: 'rgba(245,158,11,0.12)'  },
  formulario: { label: 'Formulario', color: '#8B5CF6', bg: 'rgba(139,92,246,0.12)'  },
  otro:       { label: 'Otro',       color: '#64748B', bg: 'rgba(100,116,139,0.12)' },
}

export function DocumentoCard({ documento, canDelete, onDelete }: DocumentoCardProps) {
  const cfg = tipoConfig[documento.tipo]

  return (
    <div
      className="flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-150 group"
      style={{
        background: '#0C1628',
        border: '1px solid rgba(255,255,255,0.07)',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.border = '1px solid rgba(255,255,255,0.12)'
        ;(e.currentTarget as HTMLElement).style.background = '#12213A'
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.border = '1px solid rgba(255,255,255,0.07)'
        ;(e.currentTarget as HTMLElement).style.background = '#0C1628'
      }}
    >
      {/* Icon */}
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ background: cfg.bg }}
      >
        <FileText className="h-4.5 w-4.5" style={{ color: cfg.color, width: 18, height: 18 }} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <p className="text-sm font-semibold truncate" style={{ color: '#EEF2FF' }}>
            {documento.nombre}
          </p>
          <span
            className="text-[10px] font-semibold px-2 py-0.5 rounded-md flex-shrink-0"
            style={{ background: cfg.bg, color: cfg.color }}
          >
            {cfg.label}
          </span>
        </div>
        {documento.descripcion && (
          <p className="text-xs truncate" style={{ color: '#475569' }}>{documento.descripcion}</p>
        )}
        <p className="text-[11px] mt-0.5" style={{ color: '#2C3E55' }}>
          {formatDate(documento.created_at)}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <a href={documento.url} target="_blank" rel="noopener noreferrer">
          <button
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
            style={{ background: 'rgba(74,144,217,0.1)', color: '#4A90D9', border: '1px solid rgba(74,144,217,0.2)' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(74,144,217,0.18)' }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(74,144,217,0.1)' }}
          >
            <Download style={{ width: 13, height: 13 }} />
            Abrir
          </button>
        </a>
        {canDelete && (
          <button
            onClick={() => onDelete?.(documento.id)}
            className="p-1.5 rounded-lg transition-colors"
            style={{ color: '#475569' }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.color = '#EF4444'
              ;(e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.08)'
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.color = '#475569'
              ;(e.currentTarget as HTMLElement).style.background = 'transparent'
            }}
          >
            <Trash2 style={{ width: 14, height: 14 }} />
          </button>
        )}
      </div>
    </div>
  )
}
