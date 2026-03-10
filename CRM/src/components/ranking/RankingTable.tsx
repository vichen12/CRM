import { Trophy, Medal, Award, Minus } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { getIniciales } from '@/lib/utils/format'
import type { RankingMensual } from '@/lib/types'

interface RankingTableProps {
  rankings: RankingMensual[]
  currentVendedorId?: string
}

function PositionBadge({ pos }: { pos: number }) {
  if (pos === 1) return (
    <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(245,158,11,0.15)' }}>
      <Trophy className="h-3.5 w-3.5 text-amber-500" />
    </div>
  )
  if (pos === 2) return (
    <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(148,163,184,0.15)' }}>
      <Medal className="h-3.5 w-3.5 text-slate-400" />
    </div>
  )
  if (pos === 3) return (
    <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(180,83,9,0.12)' }}>
      <Award className="h-3.5 w-3.5 text-amber-700" />
    </div>
  )
  return (
    <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-zinc-100">
      <span className="text-xs font-bold text-zinc-500">{pos}</span>
    </div>
  )
}

export function RankingTable({ rankings, currentVendedorId }: RankingTableProps) {
  return (
    <div
      className="bg-white rounded-2xl overflow-hidden"
      style={{ border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 4px 24px rgba(0,0,0,0.04)' }}
    >
      <div className="px-6 py-4" style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
        <h3 className="text-sm font-semibold text-zinc-800">Clasificación completa</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
              <th className="px-6 py-3 text-left text-[11px] font-semibold text-zinc-400 uppercase tracking-wider w-16">Pos.</th>
              <th className="px-6 py-3 text-left text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Vendedor</th>
              <th className="px-6 py-3 text-center text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Ventas</th>
              <th className="px-6 py-3 text-center text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Leads</th>
              <th className="px-6 py-3 text-right text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Puntos</th>
            </tr>
          </thead>
          <tbody>
            {rankings.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-16 text-center text-zinc-400 text-sm">
                  Sin datos para este mes
                </td>
              </tr>
            ) : (
              rankings.map((r, i) => {
                const pos = r.posicion ?? i + 1
                const isMe = r.vendedor_id === currentVendedorId
                const avatarUrl = r.vendedor?.avatar_url

                return (
                  <tr
                    key={r.id}
                    style={{
                      borderBottom: '1px solid rgba(0,0,0,0.03)',
                      background: isMe ? 'rgba(42,121,194,0.05)' : '',
                    }}
                    onMouseEnter={(e) => {
                      if (!isMe) (e.currentTarget as HTMLElement).style.background = '#f8fafc'
                    }}
                    onMouseLeave={(e) => {
                      if (!isMe) (e.currentTarget as HTMLElement).style.background = ''
                    }}
                  >
                    <td className="px-6 py-4">
                      <PositionBadge pos={pos} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {avatarUrl ? (
                          <img
                            src={avatarUrl}
                            alt={r.vendedor ? `${r.vendedor.nombre}` : ''}
                            className="w-9 h-9 rounded-xl object-cover flex-shrink-0"
                            style={{ border: '1px solid rgba(0,0,0,0.08)' }}
                          />
                        ) : (
                          <div
                            className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                            style={{ background: 'linear-gradient(135deg, #2A79C2, #8BC440)' }}
                          >
                            {r.vendedor ? getIniciales(r.vendedor) : '??'}
                          </div>
                        )}
                        <div>
                          <p className={cn('text-sm font-semibold', isMe ? 'text-[#2A79C2]' : 'text-zinc-800')}>
                            {r.vendedor ? `${r.vendedor.nombre} ${r.vendedor.apellido}` : '-'}
                            {isMe && <span className="ml-1.5 text-xs font-normal text-zinc-400">(vos)</span>}
                          </p>
                          {r.vendedor?.zona && (
                            <p className="text-xs text-zinc-400">{r.vendedor.zona.nombre}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center text-sm font-semibold text-zinc-700">{r.ventas_count}</td>
                    <td className="px-6 py-4 text-center text-sm font-semibold text-zinc-700">{r.leads_cerrados}</td>
                    <td className="px-6 py-4 text-right">
                      <span
                        className="text-xl font-black"
                        style={{ color: pos <= 3 ? '#f59e0b' : '#131314' }}
                      >
                        {r.puntos}
                      </span>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
