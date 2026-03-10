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
      className="bg-white rounded-2xl p-5 flex flex-col gap-4 transition-all duration-200"
      style={{
        border: '1px solid rgba(0,0,0,0.06)',
        boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
        opacity: vendedor.activo ? 1 : 0.7,
      }}
    >
      {/* Header — avatar + nombre + estado */}
      <div className="flex items-start gap-4">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={`${vendedor.nombre} ${vendedor.apellido}`}
            className="w-14 h-14 rounded-2xl object-cover flex-shrink-0"
            style={{ border: '2px solid rgba(42,121,194,0.15)' }}
          />
        ) : (
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-bold text-white flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #2A79C2, #8BC440)' }}
          >
            {initials}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p className="font-semibold text-zinc-800 text-sm leading-tight">
              {vendedor.nombre} {vendedor.apellido}
            </p>
            <span
              className="flex-shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-lg uppercase tracking-wider"
              style={
                vendedor.activo
                  ? { background: 'rgba(139,196,64,0.12)', color: '#4a7c1f', border: '1px solid rgba(139,196,64,0.25)' }
                  : { background: 'rgba(239,68,68,0.08)', color: '#dc2626', border: '1px solid rgba(239,68,68,0.2)' }
              }
            >
              {vendedor.activo ? 'Activo' : 'Inactivo'}
            </span>
          </div>
          <span
            className="mt-1 inline-flex text-[11px] font-semibold px-2 py-0.5 rounded-lg"
            style={
              isMatriculado
                ? { background: 'rgba(168,85,247,0.1)', color: '#7c3aed', border: '1px solid rgba(168,85,247,0.2)' }
                : { background: 'rgba(42,121,194,0.1)', color: '#2A79C2', border: '1px solid rgba(42,121,194,0.2)' }
            }
          >
            {isMatriculado ? 'Con matrícula' : 'Sin matrícula'}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="space-y-2">
        {vendedor.zona && (
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <MapPin className="h-3.5 w-3.5 text-zinc-400 flex-shrink-0" />
            <span>{vendedor.zona.nombre}, {vendedor.zona.provincia}</span>
          </div>
        )}
        {vendedor.telefono && (
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <Phone className="h-3.5 w-3.5 text-zinc-400 flex-shrink-0" />
            <span>{vendedor.telefono}</span>
          </div>
        )}
        {vendedor.matricula && (
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <Key className="h-3.5 w-3.5 text-zinc-400 flex-shrink-0" />
            <span>Mat. {vendedor.matricula}</span>
          </div>
        )}
      </div>

      {/* Acción */}
      <button
        onClick={() => onToggleActivo(vendedor.id, !vendedor.activo)}
        className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold transition-all duration-200"
        style={
          vendedor.activo
            ? { background: 'rgba(239,68,68,0.08)', color: '#dc2626', border: '1px solid rgba(239,68,68,0.15)' }
            : { background: 'rgba(139,196,64,0.1)', color: '#4a7c1f', border: '1px solid rgba(139,196,64,0.2)' }
        }
        onMouseEnter={(e) => {
          if (vendedor.activo) {
            (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.15)'
          } else {
            (e.currentTarget as HTMLElement).style.background = 'rgba(139,196,64,0.18)'
          }
        }}
        onMouseLeave={(e) => {
          if (vendedor.activo) {
            (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.08)'
          } else {
            (e.currentTarget as HTMLElement).style.background = 'rgba(139,196,64,0.1)'
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
        className="flex flex-col items-center justify-center py-20 rounded-2xl bg-white"
        style={{ border: '1px solid rgba(0,0,0,0.06)' }}
      >
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
          style={{ background: 'rgba(42,121,194,0.08)' }}
        >
          <Shield className="h-7 w-7" style={{ color: '#2A79C2' }} />
        </div>
        <p className="text-zinc-500 font-medium text-sm">No hay vendedores registrados</p>
        <p className="text-zinc-400 text-xs mt-1">Creá el primero con el botón de arriba</p>
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
