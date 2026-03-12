import { Crown, Medal, Award } from 'lucide-react'
import { getIniciales } from '@/lib/utils/format'
import type { RankingMensual } from '@/lib/types'

interface PodiumCardProps {
  ranking: RankingMensual
  position: 1 | 2 | 3
}

const positionConfig = {
  1: {
    icon: Crown,
    color: '#F59E0B',
    dim: 'rgba(245,158,11,0.12)',
    border: 'rgba(245,158,11,0.2)',
    glow: '0 0 40px rgba(245,158,11,0.12)',
    label: '1° Puesto',
    gradient: 'linear-gradient(135deg, #F59E0B, #D97706)',
  },
  2: {
    icon: Medal,
    color: '#94A3B8',
    dim: 'rgba(148,163,184,0.1)',
    border: 'rgba(148,163,184,0.2)',
    glow: '0 0 40px rgba(148,163,184,0.08)',
    label: '2° Puesto',
    gradient: 'linear-gradient(135deg, #94A3B8, #64748B)',
  },
  3: {
    icon: Award,
    color: '#CD7C2F',
    dim: 'rgba(205,124,47,0.1)',
    border: 'rgba(205,124,47,0.2)',
    glow: '0 0 40px rgba(205,124,47,0.08)',
    label: '3° Puesto',
    gradient: 'linear-gradient(135deg, #CD7C2F, #B45309)',
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
      className="flex flex-col items-center p-6 rounded-xl transition-all duration-150"
      style={{
        background: '#0C1628',
        border: `1px solid ${cfg.border}`,
        boxShadow: cfg.glow,
      }}
    >
      {/* Position badge */}
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
        style={{ background: cfg.gradient }}
      >
        <Icon className="h-5 w-5 text-white" />
      </div>

      {/* Avatar */}
      <div className="relative mb-3">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={nombre}
            className="w-16 h-16 rounded-xl object-cover"
            style={{ border: `2px solid ${cfg.border}` }}
          />
        ) : (
          <div
            className="w-16 h-16 rounded-xl flex items-center justify-center text-lg font-bold text-white"
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

      <p className="text-[10px] font-semibold uppercase tracking-widest mb-1" style={{ color: cfg.color }}>
        {cfg.label}
      </p>
      <p className="font-bold text-sm text-center leading-snug" style={{ color: '#CBD5E1' }}>{nombre}</p>
      {ranking.vendedor?.zona && (
        <p className="text-xs mt-0.5" style={{ color: '#475569' }}>{ranking.vendedor.zona.nombre}</p>
      )}

      {/* Points */}
      <div
        className="mt-4 w-full py-3 rounded-lg text-center"
        style={{ background: cfg.dim, border: `1px solid ${cfg.border}` }}
      >
        <p className="text-3xl font-black" style={{ color: cfg.color }}>{ranking.puntos}</p>
        <p className="text-[10px] font-semibold uppercase tracking-widest mt-0.5" style={{ color: '#2C3E55' }}>
          puntos
        </p>
      </div>

      {/* Stats */}
      <div className="flex gap-4 mt-3 text-xs" style={{ color: '#475569' }}>
        <div className="text-center">
          <p className="font-bold text-sm" style={{ color: '#94A3B8' }}>{ranking.ventas_count}</p>
          <p>ventas</p>
        </div>
        <div className="w-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
        <div className="text-center">
          <p className="font-bold text-sm" style={{ color: '#94A3B8' }}>{ranking.leads_cerrados}</p>
          <p>leads</p>
        </div>
      </div>
    </div>
  )
}
