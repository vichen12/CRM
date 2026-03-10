import { FileText, Download, Trash2, FileSpreadsheet, FileImage, File } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { formatDate } from '@/lib/utils/format'
import type { Documento, TipoDocumento } from '@/lib/types'

interface DocumentoCardProps {
  documento: Documento
  canDelete?: boolean
  onDelete?: (id: string) => void
}

const tipoConfig: Record<TipoDocumento, { label: string; color: string; bg: string; border: string }> = {
  producto:   { label: 'Producto',   color: '#2A79C2', bg: 'rgba(42,121,194,0.08)',  border: 'rgba(42,121,194,0.2)' },
  cobertura:  { label: 'Cobertura',  color: '#8BC440', bg: 'rgba(139,196,64,0.08)',  border: 'rgba(139,196,64,0.2)' },
  proceso:    { label: 'Proceso',    color: '#f59e0b', bg: 'rgba(245,158,11,0.08)',  border: 'rgba(245,158,11,0.2)' },
  formulario: { label: 'Formulario', color: '#a855f7', bg: 'rgba(168,85,247,0.08)',  border: 'rgba(168,85,247,0.2)' },
  otro:       { label: 'Otro',       color: '#64748b', bg: 'rgba(100,116,139,0.08)', border: 'rgba(100,116,139,0.2)' },
}

export function DocumentoCard({ documento, canDelete, onDelete }: DocumentoCardProps) {
  const cfg = tipoConfig[documento.tipo]

  return (
    <div
      className="bg-white rounded-2xl p-5 flex flex-col gap-4 transition-all duration-200 hover:-translate-y-0.5"
      style={{
        border: '1px solid rgba(0,0,0,0.06)',
        boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 30px rgba(0,0,0,0.1)'
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 12px rgba(0,0,0,0.04)'
      }}
    >
      <div className="flex items-start gap-4">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}
        >
          <FileText className="h-5 w-5" style={{ color: cfg.color }} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-semibold text-zinc-800 text-sm leading-snug line-clamp-2">
              {documento.nombre}
            </h3>
          </div>
          {documento.descripcion && (
            <p className="text-xs text-zinc-400 line-clamp-2 mb-2">{documento.descripcion}</p>
          )}
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="text-[11px] font-semibold px-2 py-0.5 rounded-lg"
              style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}
            >
              {cfg.label}
            </span>
            <span className="text-[11px] text-zinc-400">{formatDate(documento.created_at)}</span>
          </div>
        </div>
      </div>

      <div className="flex gap-2 pt-1" style={{ borderTop: '1px solid rgba(0,0,0,0.05)' }}>
        <a
          href={documento.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1"
        >
          <button
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200"
            style={{
              background: 'rgba(42,121,194,0.08)',
              color: '#2A79C2',
              border: '1px solid rgba(42,121,194,0.2)',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = 'rgba(42,121,194,0.15)'
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = 'rgba(42,121,194,0.08)'
            }}
          >
            <Download className="h-3.5 w-3.5" />
            Descargar
          </button>
        </a>
        {canDelete && (
          <button
            onClick={() => onDelete?.(documento.id)}
            className="px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200"
            style={{
              background: 'rgba(239,68,68,0.08)',
              color: '#ef4444',
              border: '1px solid rgba(239,68,68,0.2)',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.15)'
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.08)'
            }}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  )
}
