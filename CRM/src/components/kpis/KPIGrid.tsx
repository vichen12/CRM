import { DollarSign, Target, TrendingUp, CheckCircle2, BarChart3 } from 'lucide-react'
import { KPICard } from './KPICard'
import { formatCurrency } from '@/lib/utils/format'
import type { KPIVendedor } from '@/lib/types'

interface KPIGridProps {
  kpis: KPIVendedor
}

export function KPIGrid({ kpis }: KPIGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <KPICard
        title="Ventas del mes"
        value={kpis.ventas_mes}
        subtitle="pólizas cerradas"
        icon={CheckCircle2}
        color="green"
      />
      <KPICard
        title="Comisiones del mes"
        value={formatCurrency(kpis.comisiones_mes)}
        subtitle="ingresos generados"
        icon={DollarSign}
        color="cyan"
      />
      <KPICard
        title="Leads tomados"
        value={kpis.leads_tomados}
        subtitle="este mes"
        icon={Target}
        color="purple"
      />
      <KPICard
        title="Tasa de conversión"
        value={`${kpis.tasa_conversion}%`}
        subtitle="leads → ventas"
        icon={TrendingUp}
        color="yellow"
      />
    </div>
  )
}
