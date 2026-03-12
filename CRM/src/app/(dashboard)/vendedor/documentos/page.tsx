'use client'

import { useEffect, useState } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { DocumentoCard } from '@/components/documentos/DocumentoCard'
import { PageSpinner } from '@/components/ui/Spinner'
import { useAuth } from '@/hooks/useAuth'
import { apiFetch } from '@/lib/api/client'
import { FileText, Search } from 'lucide-react'
import type { Documento } from '@/lib/types'

const TIPOS = [
  { label: 'Todos', value: '', color: '#64748b' },
  { label: 'Productos', value: 'producto', color: '#4A90D9' },
  { label: 'Coberturas', value: 'cobertura', color: '#7FC136' },
  { label: 'Procesos', value: 'proceso', color: '#f59e0b' },
  { label: 'Formularios', value: 'formulario', color: '#a855f7' },
]

export default function VendedorDocumentosPage() {
  const { profile, loading: authLoading } = useAuth()
  const [documentos, setDocumentos] = useState<Documento[]>([])
  const [loading, setLoading] = useState(true)
  const [filtroTipo, setFiltroTipo] = useState('')
  const [busqueda, setBusqueda] = useState('')

  useEffect(() => {
    setLoading(true)
    const url = filtroTipo ? `/documentos?tipo=${filtroTipo}` : '/documentos'
    apiFetch<Documento[]>(url)
      .then(setDocumentos)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [filtroTipo])

  if (authLoading || !profile) return <PageSpinner />

  const docsFiltrados = busqueda
    ? documentos.filter(
        (d) =>
          d.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
          d.descripcion?.toLowerCase().includes(busqueda.toLowerCase())
      )
    : documentos

  const tipoActivo = TIPOS.find((t) => t.value === filtroTipo)

  return (
    <DashboardLayout profile={profile} title="Documentos">
      <div className="space-y-6">

        {/* Header */}
        <div
          className="rounded-2xl p-6 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #0C1628 0%, #12213A 100%)',
            border: '1px solid rgba(255,255,255,0.07)',
          }}
        >
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(74,144,217,0.2)', border: '1px solid rgba(74,144,217,0.3)' }}
            >
              <FileText className="h-6 w-6" style={{ color: '#4A90D9' }} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Biblioteca de documentos</h2>
              <p className="text-sm mt-0.5" style={{ color: '#475569' }}>
                {documentos.length} documento{documentos.length !== 1 ? 's' : ''} disponibles
              </p>
            </div>
          </div>
          <div
            className="absolute -right-8 -top-8 w-36 h-36 rounded-full opacity-10"
            style={{ background: '#4A90D9' }}
          />
        </div>

        {/* Filtros y búsqueda */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Filtros de tipo */}
          <div className="flex gap-2 flex-wrap flex-1">
            {TIPOS.map((t) => {
              const isActive = filtroTipo === t.value
              return (
                <button
                  key={t.value}
                  onClick={() => setFiltroTipo(t.value)}
                  className="px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200"
                  style={
                    isActive
                      ? {
                          background: t.color,
                          color: 'white',
                          border: `1px solid ${t.color}`,
                          boxShadow: `0 4px 12px ${t.color}40`,
                        }
                      : {
                          background: '#12213A',
                          color: '#475569',
                          border: '1px solid rgba(255,255,255,0.07)',
                        }
                  }
                >
                  {t.label}
                </button>
              )
            })}
          </div>

          {/* Búsqueda */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: '#475569' }} />
            <input
              type="text"
              placeholder="Buscar documento..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-xl text-sm outline-none transition-all duration-200 w-full sm:w-56"
              style={{
                background: '#12213A',
                border: '1px solid rgba(255,255,255,0.07)',
                color: '#EEF2FF',
              }}
              onFocus={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = '#4A90D9'
                ;(e.currentTarget as HTMLElement).style.boxShadow = '0 0 0 3px rgba(74,144,217,0.12)'
              }}
              onBlur={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)'
                ;(e.currentTarget as HTMLElement).style.boxShadow = ''
              }}
            />
          </div>
        </div>

        {/* Grid de documentos */}
        {loading ? (
          <PageSpinner />
        ) : docsFiltrados.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-20 rounded-2xl"
            style={{ background: '#0C1628', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
              style={{ background: 'rgba(74,144,217,0.08)' }}
            >
              <FileText className="h-8 w-8" style={{ color: '#4A90D9' }} />
            </div>
            <p className="font-medium" style={{ color: '#475569' }}>No hay documentos</p>
            <p className="text-sm mt-1" style={{ color: '#2C3E55' }}>
              {busqueda ? 'Intentá con otro término de búsqueda' : 'Aún no se cargaron documentos en esta categoría'}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {docsFiltrados.map((doc) => (
              <DocumentoCard key={doc.id} documento={doc} />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
