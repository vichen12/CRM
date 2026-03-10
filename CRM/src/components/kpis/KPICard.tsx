import { cn } from '@/lib/utils/cn'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

type Color = 'blue' | 'green' | 'yellow' | 'purple' | 'red' | 'cyan'

interface KPICardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  trend?: number
  color?: Color
}

const colorMap: Record<Color, { gradient: string; glow: string; iconBg: string; iconColor: string; bar: string }> = {
  blue:   { gradient: 'from-[#2A79C2] to-[#1a5fa0]', glow: 'rgba(42,121,194,0.15)', iconBg: 'rgba(42,121,194,0.1)', iconColor: '#2A79C2', bar: '#2A79C2' },
  green:  { gradient: 'from-[#8BC440] to-[#6fa832]',  glow: 'rgba(139,196,64,0.15)', iconBg: 'rgba(139,196,64,0.1)', iconColor: '#8BC440',  bar: '#8BC440' },
  yellow: { gradient: 'from-amber-400 to-amber-500',   glow: 'rgba(251,191,36,0.15)', iconBg: 'rgba(251,191,36,0.1)', iconColor: '#f59e0b',  bar: '#f59e0b' },
  purple: { gradient: 'from-purple-500 to-purple-700', glow: 'rgba(168,85,247,0.15)', iconBg: 'rgba(168,85,247,0.1)', iconColor: '#a855f7',  bar: '#a855f7' },
  red:    { gradient: 'from-red-400 to-red-600',       glow: 'rgba(239,68,68,0.15)',  iconBg: 'rgba(239,68,68,0.1)',  iconColor: '#ef4444',  bar: '#ef4444' },
  cyan:   { gradient: 'from-cyan-400 to-cyan-600',     glow: 'rgba(6,182,212,0.15)',  iconBg: 'rgba(6,182,212,0.1)',  iconColor: '#06b6d4',  bar: '#06b6d4' },
}

export function KPICard({ title, value, subtitle, icon: Icon, trend, color = 'blue' }: KPICardProps) {
  const c = colorMap[color]

  return (
    <div
      className="relative bg-white rounded-2xl overflow-hidden"
      style={{
        border: '1px solid rgba(0,0,0,0.06)',
        boxShadow: `0 4px 24px ${c.glow}, 0 1px 4px rgba(0,0,0,0.04)`,
      }}
    >
      {/* Color bar top */}
      <div className={`h-[3px] bg-gradient-to-r ${c.gradient}`} />

      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">{title}</p>
            <p className="mt-2 text-3xl font-bold text-zinc-900 leading-none tracking-tight">{value}</p>
            {subtitle && (
              <p className="mt-1.5 text-xs text-zinc-400">{subtitle}</p>
            )}
            {trend !== undefined && (
              <div className={cn('mt-2 flex items-center gap-1 text-xs font-semibold')}>
                {trend > 0 ? (
                  <TrendingUp className="h-3.5 w-3.5 text-[#8BC440]" />
                ) : trend < 0 ? (
                  <TrendingDown className="h-3.5 w-3.5 text-red-500" />
                ) : (
                  <Minus className="h-3.5 w-3.5 text-zinc-400" />
                )}
                <span className={trend > 0 ? 'text-[#8BC440]' : trend < 0 ? 'text-red-500' : 'text-zinc-400'}>
                  {trend > 0 ? '+' : ''}{trend}% vs mes anterior
                </span>
              </div>
            )}
          </div>

          <div
            className="flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{ background: c.iconBg }}
          >
            <Icon className="h-6 w-6" style={{ color: c.iconColor }} />
          </div>
        </div>
      </div>
    </div>
  )
}
