import { Calendar, Megaphone, Trash2 } from 'lucide-react'
import { formatDate } from '@/lib/utils/format'
import type { Noticia } from '@/lib/types'

interface NoticiaCardProps {
  noticia: Noticia
  onDelete?: (id: string) => void
}

export function NoticiaCard({ noticia, onDelete }: NoticiaCardProps) {
  return (
    <div
      className="rounded-xl p-5 flex flex-col gap-4 transition-all duration-150"
      style={{
        background: '#0C1628',
        border: '1px solid rgba(255,255,255,0.07)',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.border = '1px solid rgba(255,255,255,0.12)'
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.border = '1px solid rgba(255,255,255,0.07)'
      }}
    >
      {noticia.imagen_url && (
        <img
          src={noticia.imagen_url}
          alt={noticia.titulo}
          className="w-full h-40 object-cover rounded-lg"
          style={{ border: '1px solid rgba(255,255,255,0.06)' }}
        />
      )}

      <div className="flex items-start gap-3">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
          style={{ background: 'rgba(74,144,217,0.1)' }}
        >
          <Megaphone className="h-4 w-4" style={{ color: '#4A90D9' }} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm leading-snug mb-1.5" style={{ color: '#EEF2FF' }}>
            {noticia.titulo}
          </h3>
          <p className="text-sm line-clamp-4 leading-relaxed" style={{ color: '#475569' }}>
            {noticia.contenido}
          </p>
        </div>
      </div>

      <div
        className="flex items-center justify-between pt-3"
        style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
      >
        <div className="flex items-center gap-1.5 text-xs" style={{ color: '#2C3E55' }}>
          <Calendar className="h-3 w-3" />
          <span>{formatDate(noticia.created_at)}</span>
        </div>
        {onDelete && (
          <button
            onClick={() => onDelete(noticia.id)}
            className="flex items-center gap-1 text-xs font-semibold transition-colors"
            style={{ color: '#2C3E55' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#F87171' }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = '#2C3E55' }}
          >
            <Trash2 className="h-3.5 w-3.5" />
            Eliminar
          </button>
        )}
      </div>
    </div>
  )
}
