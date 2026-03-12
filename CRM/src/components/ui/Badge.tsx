import { cn } from '@/lib/utils/cn'

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple'

interface BadgeProps {
  children: React.ReactNode
  variant?: BadgeVariant
  className?: string
}

const variantStyles: Record<BadgeVariant, React.CSSProperties> = {
  default: { background: 'rgba(71,85,105,0.15)',   color: '#94A3B8', border: '1px solid rgba(71,85,105,0.2)' },
  success: { background: 'rgba(127,193,54,0.12)',  color: '#7FC136', border: '1px solid rgba(127,193,54,0.25)' },
  warning: { background: 'rgba(245,158,11,0.12)',  color: '#F59E0B', border: '1px solid rgba(245,158,11,0.25)' },
  danger:  { background: 'rgba(239,68,68,0.12)',   color: '#F87171', border: '1px solid rgba(239,68,68,0.2)'  },
  info:    { background: 'rgba(74,144,217,0.12)',  color: '#4A90D9', border: '1px solid rgba(74,144,217,0.25)' },
  purple:  { background: 'rgba(139,92,246,0.12)',  color: '#A78BFA', border: '1px solid rgba(139,92,246,0.25)' },
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn('inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold', className)}
      style={variantStyles[variant]}
    >
      {children}
    </span>
  )
}
