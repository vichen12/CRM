import { Crown, Medal, Award } from 'lucide-react'
import { getIniciales, formatCurrency } from '@/lib/utils/format'
import type { RankingMensual } from '@/lib/types'

interface PodiumCardProps {
  ranking: RankingMensual
  position: 1 | 2 | 3
}

const positionConfig = {
  1: {
    icon: Crown,
    gradient: 'linear-gradient(135deg, #f59e0b, #d97706)',
    glow: 'rgba(245,158,11,0.3)',
    border: 'rgba(245,158,11,0.3)',
    bg: 'rgba(245,158,11,0.06)',
    label: '1° Puesto',
    scale: 'scale-105',
    textColor: '#d97706',
  },
  2: {
    icon: Medal,
    gradient: 'linear-gradient(135deg, #94a3b8, #64748b)',
    glow: 'rgba(148,163,184,0.2)',
    border: 'rgba(148,163,184,0.3)',
    bg: 'rgba(148,163,184,0.06)',
    label: '2° Puesto',
    scale: '',
    textColor: '#64748b',
  },
  3: {
    icon: Award,
    gradient: 'linear-gradient(135deg, #cd7c2f, #b45309)',
    glow: 'rgba(180,83,9,0.2)',
    border: 'rgba(180,83,9,0.25)',
    bg: 'rgba(180,83,9,0.05)',
    label: '3° Puesto',
    scale: '',
    textColor: '#b45309',
  },
}

export function PodiumCard({ ranking, position }: PodiumCardProps) {
  const cfg = positionConfig[position]
  const Icon = cfg.icon
  const nombre = ranking.vendedor
    ? `${ranking.vendedor.nombre} ${ranking.vendedor.apellido}`
    : 'Vendedor'
  const initials = ranking.vendedor ? getIniciales(ranking.vendedor) : '??'
  const avatarUrl = ranking.vendedor?.avatar_url

  return (
    <div
      className={`flex flex-col items-center p-6 rounded-2xl transition-transform ${cfg.scale}`}
      style={{
        background: cfg.bg,
        border: `1px solid ${cfg.border}`,
        boxShadow: `0 8px 32px ${cfg.glow}`,
      }}
    >
      {/* Icono de posición */}
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
        style={{ background: cfg.gradient, boxShadow: `0 4px 12px ${cfg.glow}` }}
      >
        <Icon className="h-5 w-5 text-white" />
      </div>

      {/* Avatar1 */}
      <div className="relative mb-3">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={nombre}
            className="w-16 h-16 rounded-2xl object-cover"
            style={{ border: `2px solid ${cfg.border}` }}
          />
        ) : (
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-lg font-bold text-white"
            style={{ background: cfg.gradient }}
          >
            {initials}
          </div>
        )}
        <div
          className="absolute -bottom-1.5 -right-1.5 text-[10px] font-bold text-white px-1.5 py-0.5 rounded-md"
          style={{ background: cfg.gradient }}
        >
          {position}°
        </div>
      </div>

      <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: cfg.textColor }}>
        {cfg.label}
      </p>
      <p className="font-bold text-zinc-800 text-center text-sm leading-snug">{nombre}</p>
      {ranking.vendedor?.zona && (
        <p className="text-xs text-zinc-400 mt-0.5">{ranking.vendedor.zona.nombre}</p>
      )}

      <div
        className="mt-4 w-full py-3 rounded-xl text-center"
        style={{ background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.05)' }}
      >
        <p className="text-3xl font-black" style={{ color: cfg.textColor }}>{ranking.puntos}</p>
        <p className="text-[11px] text-zinc-400 font-medium uppercase tracking-wider">puntos</p>
      </div>

      <div className="flex gap-4 mt-3 text-xs text-zinc-500">
        <div className="text-center">
          <p className="font-bold text-zinc-700">{ranking.ventas_count}</p>
          <p>ventas</p>
        </div>
        <div className="w-px bg-zinc-200" />
        <div className="text-center">
          <p className="font-bold text-zinc-700">{ranking.leads_cerrados}</p>
          <p>leads</p>
        </div>
      </div>
    </div>
  )
}
