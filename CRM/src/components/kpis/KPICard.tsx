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

const colorMap: Record<Color, { accent: string; dim: string; glow: string }> = {
  blue:   { accent: '#4A90D9', dim: 'rgba(74,144,217,0.12)',   glow: 'rgba(74,144,217,0.08)' },
  green:  { accent: '#7FC136', dim: 'rgba(127,193,54,0.12)',   glow: 'rgba(127,193,54,0.08)' },
  yellow: { accent: '#F59E0B', dim: 'rgba(245,158,11,0.12)',   glow: 'rgba(245,158,11,0.08)' },
  purple: { accent: '#8B5CF6', dim: 'rgba(139,92,246,0.12)',   glow: 'rgba(139,92,246,0.08)' },
  red:    { accent: '#EF4444', dim: 'rgba(239,68,68,0.12)',    glow: 'rgba(239,68,68,0.08)' },
  cyan:   { accent: '#06B6D4', dim: 'rgba(6,182,212,0.12)',    glow: 'rgba(6,182,212,0.08)' },
}

export function KPICard({ title, value, subtitle, icon: Icon, trend, color = 'blue' }: KPICardProps) {
  const c = colorMap[color]

  return (
    <div
      className="relative rounded-xl p-5 overflow-hidden transition-all duration-200"
      style={{
        background: '#0C1628',
        border: '1px solid rgba(255,255,255,0.07)',
        boxShadow: `0 0 0 0 transparent`,
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement
        el.style.border = `1px solid rgba(255,255,255,0.12)`
        el.style.boxShadow = `0 8px 32px rgba(0,0,0,0.3)`
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement
        el.style.border = `1px solid rgba(255,255,255,0.07)`
        el.style.boxShadow = `0 0 0 0 transparent`
      }}
    >
      {/* Top row: label + icon */}
      <div className="flex items-center justify-between mb-4">
        <p
          className="text-xs font-medium uppercase tracking-widest"
          style={{ color: '#475569', letterSpacing: '0.08em' }}
        >
          {title}
        </p>
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: c.dim }}
        >
          <Icon className="h-4 w-4" style={{ color: c.accent }} />
        </div>
      </div>

      {/* Value */}
      <p
        className="text-3xl font-bold leading-none tracking-tight"
        style={{ color: '#EEF2FF' }}
      >
        {value}
      </p>

      {/* Subtitle + trend */}
      <div className="flex items-center justify-between mt-3">
        {subtitle && (
          <p className="text-xs" style={{ color: '#2C3E55' }}>{subtitle}</p>
        )}
        {trend !== undefined && (
          <div className="flex items-center gap-1 ml-auto">
            {trend > 0 ? (
              <>
                <TrendingUp className="h-3 w-3" style={{ color: '#7FC136' }} />
                <span className="text-[11px] font-semibold" style={{ color: '#7FC136' }}>+{trend}%</span>
              </>
            ) : trend < 0 ? (
              <>
                <TrendingDown className="h-3 w-3" style={{ color: '#EF4444' }} />
                <span className="text-[11px] font-semibold" style={{ color: '#EF4444' }}>{trend}%</span>
              </>
            ) : (
              <>
                <Minus className="h-3 w-3" style={{ color: '#475569' }} />
                <span className="text-[11px] font-semibold" style={{ color: '#475569' }}>0%</span>
              </>
            )}
          </div>
        )}
      </div>

      {/* Bottom accent line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[2px]"
        style={{ background: `linear-gradient(90deg, ${c.accent}60 0%, transparent 100%)` }}
      />
    </div>
  )
}
