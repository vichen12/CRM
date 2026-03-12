'use client'

import { UserCheck, UserX, MapPin, Phone, Key, Shield } from 'lucide-react'
import { getIniciales, getRolLabel } from '@/lib/utils/format'
import type { Profile } from '@/lib/types'

interface VendedorTableProps {
  vendedores: Profile[]
  onToggleActivo: (id: string, nuevoEstado: boolean) => void
}

function VendedorCard({ vendedor, onToggleActivo }: { vendedor: Profile; onToggleActivo: (id: string, v: boolean) => void }) {
  const initials = getIniciales(vendedor)
  const isMatriculado = vendedor.rol === 'vendedor_matriculado'
  const avatarUrl = vendedor.avatar_url

  return (
    <div
      className="rounded-xl p-5 flex flex-col gap-4 transition-all duration-150"
      style={{
        background: '#0C1628',
        border: '1px solid rgba(255,255,255,0.07)',
        opacity: vendedor.activo ? 1 : 0.65,
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.border = '1px solid rgba(255,255,255,0.12)'
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.border = '1px solid rgba(255,255,255,0.07)'
      }}
    >
      {/* Header */}
      <div className="flex items-start gap-4">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={`${vendedor.nombre} ${vendedor.apellido}`}
            className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
            style={{ border: '1px solid rgba(255,255,255,0.1)' }}
          />
        ) : (
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-base font-bold text-white flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #4A90D9, #7FC136)' }}
          >
            {initials}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p className="font-semibold text-sm leading-tight" style={{ color: '#EEF2FF' }}>
              {vendedor.nombre} {vendedor.apellido}
            </p>
            <span
              className="flex-shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-md uppercase tracking-wider"
              style={
                vendedor.activo
                  ? { background: 'rgba(127,193,54,0.12)', color: '#7FC136', border: '1px solid rgba(127,193,54,0.2)' }
                  : { background: 'rgba(239,68,68,0.1)', color: '#F87171', border: '1px solid rgba(239,68,68,0.18)' }
              }
            >
              {vendedor.activo ? 'Activo' : 'Inactivo'}
            </span>
          </div>
          <span
            className="mt-1.5 inline-flex text-[11px] font-semibold px-2 py-0.5 rounded-md"
            style={
              isMatriculado
                ? { background: 'rgba(139,92,246,0.12)', color: '#A78BFA', border: '1px solid rgba(139,92,246,0.2)' }
                : { background: 'rgba(74,144,217,0.1)', color: '#4A90D9', border: '1px solid rgba(74,144,217,0.18)' }
            }
          >
            {isMatriculado ? 'Con matrícula' : 'Sin matrícula'}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="space-y-1.5">
        {vendedor.zona && (
          <div className="flex items-center gap-2 text-xs" style={{ color: '#475569' }}>
            <MapPin className="h-3.5 w-3.5 flex-shrink-0" style={{ color: '#2C3E55' }} />
            <span>{vendedor.zona.nombre}, {vendedor.zona.provincia}</span>
          </div>
        )}
        {vendedor.telefono && (
          <div className="flex items-center gap-2 text-xs" style={{ color: '#475569' }}>
            <Phone className="h-3.5 w-3.5 flex-shrink-0" style={{ color: '#2C3E55' }} />
            <span>{vendedor.telefono}</span>
          </div>
        )}
        {vendedor.matricula && (
          <div className="flex items-center gap-2 text-xs" style={{ color: '#475569' }}>
            <Key className="h-3.5 w-3.5 flex-shrink-0" style={{ color: '#2C3E55' }} />
            <span>Mat. {vendedor.matricula}</span>
          </div>
        )}
      </div>

      {/* Action */}
      <button
        onClick={() => onToggleActivo(vendedor.id, !vendedor.activo)}
        className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all duration-150"
        style={
          vendedor.activo
            ? { background: 'rgba(239,68,68,0.08)', color: '#F87171', border: '1px solid rgba(239,68,68,0.15)' }
            : { background: 'rgba(127,193,54,0.08)', color: '#7FC136', border: '1px solid rgba(127,193,54,0.18)' }
        }
        onMouseEnter={(e) => {
          if (vendedor.activo) {
            (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.14)'
          } else {
            (e.currentTarget as HTMLElement).style.background = 'rgba(127,193,54,0.14)'
          }
        }}
        onMouseLeave={(e) => {
          if (vendedor.activo) {
            (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.08)'
          } else {
            (e.currentTarget as HTMLElement).style.background = 'rgba(127,193,54,0.08)'
          }
        }}
      >
        {vendedor.activo ? (
          <><UserX className="h-3.5 w-3.5" />Desactivar cuenta</>
        ) : (
          <><UserCheck className="h-3.5 w-3.5" />Activar cuenta</>
        )}
      </button>
    </div>
  )
}

export function VendedorTable({ vendedores, onToggleActivo }: VendedorTableProps) {
  if (vendedores.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center py-20 rounded-xl"
        style={{ background: '#0C1628', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
          style={{ background: 'rgba(74,144,217,0.1)' }}
        >
          <Shield className="h-6 w-6" style={{ color: '#4A90D9' }} />
        </div>
        <p className="text-sm font-medium" style={{ color: '#475569' }}>No hay vendedores registrados</p>
        <p className="text-xs mt-1" style={{ color: '#2C3E55' }}>Creá el primero con el botón de arriba</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {vendedores.map((v) => (
        <VendedorCard key={v.id} vendedor={v} onToggleActivo={onToggleActivo} />
      ))}
    </div>
  )
}
