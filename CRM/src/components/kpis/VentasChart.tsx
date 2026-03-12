'use client'

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts'
import type { VentasChartData } from '@/lib/types'

interface VentasChartProps {
  data: VentasChartData[]
}

const ChartTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="rounded-lg px-3.5 py-3 text-sm"
        style={{
          background: '#0C1628',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 16px 48px rgba(0,0,0,0.5)',
        }}
      >
        <p className="text-xs font-semibold mb-2" style={{ color: '#94A3B8' }}>{label}</p>
        {payload.map((p: any) => (
          <p key={p.dataKey} className="text-xs flex items-center gap-2">
            <span style={{ color: p.color }}>●</span>
            <span style={{ color: '#475569' }}>{p.name}:</span>
            <span className="font-bold" style={{ color: '#EEF2FF' }}>{p.value}</span>
          </p>
        ))}
      </div>
    )
  }
  return null
}

const axisTick = { fontSize: 10, fill: '#2C3E55', fontFamily: 'Inter' }
const gridColor = 'rgba(255,255,255,0.04)'

export function VentasChart({ data }: VentasChartProps) {
  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        background: '#0C1628',
        border: '1px solid rgba(255,255,255,0.07)',
      }}
    >
      {/* Header */}
      <div
        className="px-5 py-4 flex items-center justify-between"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
      >
        <div>
          <h3 className="text-sm font-semibold" style={{ color: '#EEF2FF' }}>Evolución de ventas</h3>
          <p className="text-xs mt-0.5" style={{ color: '#2C3E55' }}>Últimos 6 meses</p>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full inline-block" style={{ background: '#4A90D9' }} />
          <span className="text-xs" style={{ color: '#475569' }}>Ventas</span>
        </div>
      </div>

      {/* Chart */}
      <div className="p-5">
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={data} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
            <defs>
              <linearGradient id="ventasGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"  stopColor="#4A90D9" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#4A90D9" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
            <XAxis dataKey="mes"   tick={axisTick} axisLine={false} tickLine={false} />
            <YAxis                  tick={axisTick} axisLine={false} tickLine={false} />
            <Tooltip content={<ChartTooltip />} />
            <Area
              type="monotone"
              dataKey="ventas"
              stroke="#4A90D9"
              strokeWidth={2}
              fill="url(#ventasGrad)"
              name="Ventas"
              dot={{ r: 3, fill: '#4A90D9', strokeWidth: 0 }}
              activeDot={{ r: 5, fill: '#4A90D9', strokeWidth: 2, stroke: 'rgba(74,144,217,0.3)' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export function ComisionesChart({ data }: VentasChartProps) {
  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        background: '#0C1628',
        border: '1px solid rgba(255,255,255,0.07)',
      }}
    >
      {/* Header */}
      <div
        className="px-5 py-4 flex items-center justify-between"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
      >
        <div>
          <h3 className="text-sm font-semibold" style={{ color: '#EEF2FF' }}>Comisiones generadas</h3>
          <p className="text-xs mt-0.5" style={{ color: '#2C3E55' }}>Últimos 6 meses</p>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full inline-block" style={{ background: '#7FC136' }} />
          <span className="text-xs" style={{ color: '#475569' }}>Comisiones</span>
        </div>
      </div>

      {/* Chart */}
      <div className="p-5">
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
            <XAxis dataKey="mes"   tick={axisTick} axisLine={false} tickLine={false} />
            <YAxis                  tick={axisTick} axisLine={false} tickLine={false} />
            <Tooltip content={<ChartTooltip />} />
            <Bar
              dataKey="comisiones"
              fill="#7FC136"
              radius={[4, 4, 0, 0]}
              name="Comisiones ($)"
              opacity={0.85}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
