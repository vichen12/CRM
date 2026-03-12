import { Trophy, Medal, Award } from 'lucide-react'
import { getIniciales } from '@/lib/utils/format'
import type { RankingMensual } from '@/lib/types'

interface RankingTableProps {
  rankings: RankingMensual[]
  currentVendedorId?: string
}

function PositionBadge({ pos }: { pos: number }) {
  if (pos === 1) return (
    <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(245,158,11,0.12)' }}>
      <Trophy className="h-3.5 w-3.5" style={{ color: '#F59E0B' }} />
    </div>
  )
  if (pos === 2) return (
    <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(148,163,184,0.1)' }}>
      <Medal className="h-3.5 w-3.5" style={{ color: '#94A3B8' }} />
    </div>
  )
  if (pos === 3) return (
    <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(205,124,47,0.1)' }}>
      <Award className="h-3.5 w-3.5" style={{ color: '#CD7C2F' }} />
    </div>
  )
  return (
    <div
      className="w-7 h-7 rounded-lg flex items-center justify-center"
      style={{ background: 'rgba(255,255,255,0.05)' }}
    >
      <span className="text-xs font-bold" style={{ color: '#475569' }}>{pos}</span>
    </div>
  )
}

export function RankingTable({ rankings, currentVendedorId }: RankingTableProps) {
  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ background: '#0C1628', border: '1px solid rgba(255,255,255,0.07)' }}
    >
      <div className="px-5 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <h3 className="text-sm font-semibold" style={{ color: '#EEF2FF' }}>Clasificación completa</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              {['Pos.', 'Vendedor', 'Ventas', 'Leads', 'Puntos'].map((h, i) => (
                <th
                  key={h}
                  className={`px-5 py-3 text-[11px] font-semibold uppercase tracking-wider ${i === 0 ? 'text-left w-16' : i >= 2 ? 'text-center' : 'text-left'} ${i === 4 ? 'text-right' : ''}`}
                  style={{ color: '#2C3E55' }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rankings.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-16 text-center text-sm" style={{ color: '#475569' }}>
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
                      borderBottom: '1px solid rgba(255,255,255,0.03)',
                      background: isMe ? 'rgba(74,144,217,0.06)' : 'transparent',
                    }}
                    onMouseEnter={(e) => {
                      if (!isMe) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)'
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.background = isMe
                        ? 'rgba(74,144,217,0.06)'
                        : 'transparent'
                    }}
                  >
                    <td className="px-5 py-4">
                      <PositionBadge pos={pos} />
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {avatarUrl ? (
                          <img
                            src={avatarUrl}
                            alt=""
                            className="w-9 h-9 rounded-xl object-cover flex-shrink-0"
                            style={{ border: '1px solid rgba(255,255,255,0.08)' }}
                          />
                        ) : (
                          <div
                            className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                            style={{ background: 'linear-gradient(135deg, #4A90D9, #7FC136)' }}
                          >
                            {r.vendedor ? getIniciales(r.vendedor) : '??'}
                          </div>
                        )}
                        <div>
                          <p
                            className="text-sm font-semibold"
                            style={{ color: isMe ? '#4A90D9' : '#CBD5E1' }}
                          >
                            {r.vendedor ? `${r.vendedor.nombre} ${r.vendedor.apellido}` : '—'}
                            {isMe && (
                              <span className="ml-1.5 text-xs font-normal" style={{ color: '#475569' }}>(vos)</span>
                            )}
                          </p>
                          {r.vendedor?.zona && (
                            <p className="text-xs mt-0.5" style={{ color: '#2C3E55' }}>
                              {r.vendedor.zona.nombre}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-center text-sm font-semibold" style={{ color: '#94A3B8' }}>
                      {r.ventas_count}
                    </td>
                    <td className="px-5 py-4 text-center text-sm font-semibold" style={{ color: '#94A3B8' }}>
                      {r.leads_cerrados}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <span
                        className="text-xl font-black"
                        style={{ color: pos <= 3 ? '#F59E0B' : '#475569' }}
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
