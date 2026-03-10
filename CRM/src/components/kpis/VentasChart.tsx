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

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="rounded-xl px-4 py-3 text-sm"
        style={{
          background: 'rgba(19,19,20,0.95)',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          backdropFilter: 'blur(8px)',
        }}
      >
        <p className="font-semibold text-white mb-1.5">{label}</p>
        {payload.map((p: any) => (
          <p key={p.dataKey} className="text-zinc-300 text-xs">
            <span style={{ color: p.color }}>●</span> {p.name}:{' '}
            <span className="font-semibold text-white">{p.value}</span>
          </p>
        ))}
      </div>
    )
  }
  return null
}

export function VentasChart({ data }: VentasChartProps) {
  return (
    <div
      className="bg-white rounded-2xl overflow-hidden"
      style={{ border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 4px 24px rgba(0,0,0,0.04)' }}
    >
      <div className="px-6 py-5 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
        <div>
          <h3 className="text-sm font-semibold text-zinc-800">Evolución de ventas</h3>
          <p className="text-xs text-zinc-400 mt-0.5">Últimos 6 meses</p>
        </div>
        <div className="flex items-center gap-4 text-xs text-zinc-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full inline-block" style={{ background: '#2A79C2' }} />
            Ventas
          </span>
        </div>
      </div>

      <div className="p-6">
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="ventasGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2A79C2" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#2A79C2" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
            <XAxis
              dataKey="mes"
              tick={{ fontSize: 11, fill: '#94a3b8', fontFamily: 'Inter' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#94a3b8', fontFamily: 'Inter' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="ventas"
              stroke="#2A79C2"
              strokeWidth={2.5}
              fill="url(#ventasGrad)"
              name="Ventas"
              dot={{ r: 4, fill: '#2A79C2', strokeWidth: 0 }}
              activeDot={{ r: 6, fill: '#2A79C2', strokeWidth: 0 }}
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
      className="bg-white rounded-2xl overflow-hidden"
      style={{ border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 4px 24px rgba(0,0,0,0.04)' }}
    >
      <div className="px-6 py-5" style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
        <h3 className="text-sm font-semibold text-zinc-800">Comisiones generadas</h3>
        <p className="text-xs text-zinc-400 mt-0.5">Últimos 6 meses</p>
      </div>
      <div className="p-6">
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
            <XAxis
              dataKey="mes"
              tick={{ fontSize: 11, fill: '#94a3b8', fontFamily: 'Inter' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#94a3b8', fontFamily: 'Inter' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="comisiones" fill="#8BC440" radius={[6, 6, 0, 0]} name="Comisiones ($)" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
