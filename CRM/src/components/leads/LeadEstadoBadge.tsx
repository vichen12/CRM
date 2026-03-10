import { Badge } from '@/components/ui/Badge'
import type { EstadoLead } from '@/lib/types'

interface LeadEstadoBadgeProps {
  estado: EstadoLead
}

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple'

const estadoConfig: Record<EstadoLead, { label: string; variant: BadgeVariant }> = {
  nuevo: { label: 'Nuevo', variant: 'info' },
  tomado: { label: 'Tomado', variant: 'warning' },
  en_proceso: { label: 'En proceso', variant: 'purple' },
  cerrado: { label: 'Cerrado', variant: 'success' },
  perdido: { label: 'Perdido', variant: 'danger' },
}

export function LeadEstadoBadge({ estado }: LeadEstadoBadgeProps) {
  const config = estadoConfig[estado]
  return <Badge variant={config.variant}>{config.label}</Badge>
}
