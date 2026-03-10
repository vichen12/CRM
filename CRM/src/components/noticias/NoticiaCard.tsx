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
      className="bg-white rounded-2xl p-5 flex flex-col gap-4 transition-all duration-200 hover:-translate-y-0.5"
      style={{
        border: '1px solid rgba(0,0,0,0.06)',
        boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 30px rgba(0,0,0,0.08)' }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 12px rgba(0,0,0,0.04)' }}
    >
      {noticia.imagen_url && (
        <img
          src={noticia.imagen_url}
          alt={noticia.titulo}
          className="w-full h-40 object-cover rounded-xl"
        />
      )}

      <div className="flex items-start gap-3">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
          style={{ background: 'rgba(42,121,194,0.1)' }}
        >
          <Megaphone className="h-4 w-4" style={{ color: '#2A79C2' }} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-zinc-800 text-sm leading-snug mb-1.5">{noticia.titulo}</h3>
          <p className="text-sm text-zinc-500 line-clamp-4 leading-relaxed">{noticia.contenido}</p>
        </div>
      </div>

      <div
        className="flex items-center justify-between pt-3"
        style={{ borderTop: '1px solid rgba(0,0,0,0.05)' }}
      >
        <div className="flex items-center gap-1.5 text-xs text-zinc-400">
          <Calendar className="h-3 w-3" />
          <span>{formatDate(noticia.created_at)}</span>
        </div>
        {onDelete && (
          <button
            onClick={() => onDelete(noticia.id)}
            className="flex items-center gap-1 text-xs font-semibold transition-colors text-zinc-400 hover:text-red-500"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Eliminar
          </button>
        )}
      </div>
    </div>
  )
}
