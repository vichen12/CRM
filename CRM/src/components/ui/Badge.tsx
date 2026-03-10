import { cn } from '@/lib/utils/cn'

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple'

interface BadgeProps {
  children: React.ReactNode
  variant?: BadgeVariant
  className?: string
}

const variantStyles: Record<BadgeVariant, React.CSSProperties> = {
  default: { background: 'rgba(100,116,139,0.1)', color: '#475569', border: '1px solid rgba(100,116,139,0.2)' },
  success: { background: 'rgba(139,196,64,0.1)',  color: '#4a7c1f', border: '1px solid rgba(139,196,64,0.25)' },
  warning: { background: 'rgba(245,158,11,0.1)',  color: '#92400e', border: '1px solid rgba(245,158,11,0.25)' },
  danger:  { background: 'rgba(239,68,68,0.1)',   color: '#dc2626', border: '1px solid rgba(239,68,68,0.2)'  },
  info:    { background: 'rgba(42,121,194,0.1)',  color: '#2A79C2', border: '1px solid rgba(42,121,194,0.2)' },
  purple:  { background: 'rgba(168,85,247,0.1)',  color: '#7c3aed', border: '1px solid rgba(168,85,247,0.2)' },
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn('inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-semibold', className)}
      style={variantStyles[variant]}
    >
      {children}
    </span>
  )
}
