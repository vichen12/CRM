'use client'

import { useState, useEffect } from 'react'
import {
  Settings, Calendar, Trophy, Plus, Trash2, Save, Gift,
  RefreshCw, ChevronDown, CheckCircle2
} from 'lucide-react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { PageSpinner } from '@/components/ui/Spinner'
import { useAuth } from '@/hooks/useAuth'
import { apiFetch } from '@/lib/api/client'

// ── Types ──────────────────────────────────────────────────────────

type CicloTipo = 'mensual' | 'quincenal' | 'semanal' | 'personalizado'
type CriterioDesempate = 'ventas_cerradas' | 'prima_total' | 'leads_contactados' | 'tasa_conversion' | 'reuniones'

interface ConfigCiclo {
  id: string
  tipo: CicloTipo
  diaInicio?: number
  diaFin?: number
  duracionDias?: number
  fechaInicioCustom?: string
  fechaFinCustom?: string
}

interface Sorteo {
  id: string
  titulo: string
  descripcion?: string
  premio: string
  fecha: string
  imagenUrl?: string
}

interface RankingConfig {
  id: string
  pesoVentas: number
  pesoLeadsContactados: number
  pesoConversion: number
  pesoTicketPromedio: number
  pesoReuniones: number
  criterioDesempate: CriterioDesempate
}

// ── Helpers ────────────────────────────────────────────────────────

const card = {
  background: '#0C1628',
  border: '1px solid rgba(255,255,255,0.07)',
}

const sectionHeader = (icon: React.ReactNode, title: string, subtitle: string, color: string) => (
  <div className="flex items-center gap-3 mb-5">
    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
      style={{ background: `${color}18` }}>
      {icon}
    </div>
    <div>
      <h2 className="text-sm font-semibold" style={{ color: '#EEF2FF' }}>{title}</h2>
      <p className="text-xs" style={{ color: '#475569' }}>{subtitle}</p>
    </div>
  </div>
)

const selectStyle = {
  background: '#12213A',
  border: '1px solid rgba(255,255,255,0.07)',
  color: '#EEF2FF',
}

const CRITERIO_LABELS: Record<CriterioDesempate, string> = {
  ventas_cerradas: 'Ventas cerradas',
  prima_total: 'Prima total vendida',
  leads_contactados: 'Leads contactados',
  tasa_conversion: 'Tasa de conversión',
  reuniones: 'Reuniones realizadas',
}

const CICLO_LABELS: Record<CicloTipo, string> = {
  mensual: 'Mensual (del 1 al último día)',
  quincenal: 'Quincenal (cada 15 días)',
  semanal: 'Semanal (7 días)',
  personalizado: 'Personalizado (fechas libres)',
}

// ── Page ───────────────────────────────────────────────────────────

export default function ConfiguracionPage() {
  const { profile, loading: authLoading } = useAuth()

  // Ciclo
  const [ciclo, setCiclo] = useState<ConfigCiclo | null>(null)
  const [cicloForm, setCicloForm] = useState<Partial<ConfigCiclo>>({ tipo: 'mensual' })
  const [cicloSaving, setCicloSaving] = useState(false)
  const [cicloOk, setCicloOk] = useState(false)

  // Sorteos
  const [sorteos, setSorteos] = useState<Sorteo[]>([])
  const [sorteoModal, setSorteoModal] = useState(false)
  const [sorteoForm, setSorteoForm] = useState({ titulo: '', descripcion: '', premio: '', fecha: '', imagenUrl: '' })
  const [sorteoSaving, setSorteoSaving] = useState(false)
  const [sorteoError, setSorteoError] = useState('')

  // Ranking formula
  const [rankingConfig, setRankingConfig] = useState<RankingConfig | null>(null)
  const [rankingForm, setRankingForm] = useState({
    pesoVentas: 10,
    pesoLeadsContactados: 1,
    pesoConversion: 5,
    pesoTicketPromedio: 0.001,
    pesoReuniones: 2,
    criterioDesempate: 'ventas_cerradas' as CriterioDesempate,
  })
  const [rankingSaving, setRankingSaving] = useState(false)
  const [rankingOk, setRankingOk] = useState(false)

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      apiFetch<ConfigCiclo | null>('/configuracion/ciclo').catch(() => null),
      apiFetch<Sorteo[]>('/configuracion/sorteos').catch(() => []),
      apiFetch<RankingConfig | null>('/configuracion/ranking-formula').catch(() => null),
    ]).then(([c, s, r]) => {
      if (c) { setCiclo(c); setCicloForm(c) }
      setSorteos(s ?? [])
      if (r) { setRankingConfig(r); setRankingForm({ ...r }) }
    }).finally(() => setLoading(false))
  }, [])

  if (authLoading || !profile) return <PageSpinner />

  // ── Ciclo handlers ─────────────────────────────────────────────

  const saveCiclo = async () => {
    setCicloSaving(true)
    try {
      const res = await apiFetch<ConfigCiclo>('/configuracion/ciclo', {
        method: 'POST',
        body: JSON.stringify(cicloForm),
      })
      setCiclo(res)
      setCicloOk(true)
      setTimeout(() => setCicloOk(false), 2500)
    } finally {
      setCicloSaving(false)
    }
  }

  // ── Sorteo handlers ────────────────────────────────────────────

  const createSorteo = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!sorteoForm.titulo || !sorteoForm.premio || !sorteoForm.fecha) {
      setSorteoError('Título, premio y fecha son requeridos')
      return
    }
    setSorteoSaving(true)
    setSorteoError('')
    try {
      const res = await apiFetch<Sorteo>('/configuracion/sorteos', {
        method: 'POST',
        body: JSON.stringify(sorteoForm),
      })
      setSorteos((prev) => [...prev, res])
      setSorteoModal(false)
      setSorteoForm({ titulo: '', descripcion: '', premio: '', fecha: '', imagenUrl: '' })
    } catch (e: any) {
      setSorteoError(e.message ?? 'Error al crear sorteo')
    } finally {
      setSorteoSaving(false)
    }
  }

  const deleteSorteo = async (id: string) => {
    await apiFetch(`/configuracion/sorteos/${id}`, { method: 'DELETE' })
    setSorteos((prev) => prev.filter((s) => s.id !== id))
  }

  // ── Ranking handlers ───────────────────────────────────────────

  const saveRanking = async () => {
    setRankingSaving(true)
    try {
      const res = await apiFetch<RankingConfig>('/configuracion/ranking-formula', {
        method: 'POST',
        body: JSON.stringify(rankingForm),
      })
      setRankingConfig(res)
      setRankingOk(true)
      setTimeout(() => setRankingOk(false), 2500)
    } finally {
      setRankingSaving(false)
    }
  }

  // ── Render ─────────────────────────────────────────────────────

  return (
    <DashboardLayout profile={profile} title="Configuración">
      <div className="space-y-6 max-w-4xl">

        {loading ? (
          <PageSpinner />
        ) : (
          <>
            {/* ── Ciclo de ventas ──────────────────────── */}
            <div className="rounded-xl p-6" style={card}>
              {sectionHeader(
                <Calendar className="h-4 w-4" style={{ color: '#4A90D9' }} />,
                'Ciclo de ventas',
                'Define cuándo empieza y termina cada período de ventas',
                '#4A90D9',
              )}

              <div className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium" style={{ color: '#CBD5E1' }}>Tipo de ciclo</label>
                  <select
                    value={cicloForm.tipo ?? 'mensual'}
                    onChange={(e) => setCicloForm((p) => ({ ...p, tipo: e.target.value as CicloTipo }))}
                    className="rounded-lg px-3 py-2.5 text-sm focus:outline-none"
                    style={selectStyle}
                  >
                    {(Object.keys(CICLO_LABELS) as CicloTipo[]).map((k) => (
                      <option key={k} value={k}>{CICLO_LABELS[k]}</option>
                    ))}
                  </select>
                </div>

                {cicloForm.tipo === 'mensual' && (
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Día de inicio"
                      type="number"
                      min={1} max={28}
                      value={cicloForm.diaInicio ?? 1}
                      onChange={(e) => setCicloForm((p) => ({ ...p, diaInicio: Number(e.target.value) }))}
                      hint="Del 1 al 28"
                    />
                    <Input
                      label="Día de cierre"
                      type="number"
                      min={1} max={31}
                      value={cicloForm.diaFin ?? 31}
                      onChange={(e) => setCicloForm((p) => ({ ...p, diaFin: Number(e.target.value) }))}
                      hint="Del 1 al 31 (31 = último día)"
                    />
                  </div>
                )}

                {cicloForm.tipo === 'quincenal' && (
                  <Input
                    label="Día de corte"
                    type="number"
                    min={1} max={15}
                    value={cicloForm.diaInicio ?? 1}
                    onChange={(e) => setCicloForm((p) => ({ ...p, diaInicio: Number(e.target.value) }))}
                    hint="El ciclo se corta cada 15 días desde este día"
                  />
                )}

                {cicloForm.tipo === 'semanal' && (
                  <div
                    className="rounded-lg px-4 py-3 text-sm"
                    style={{ background: 'rgba(74,144,217,0.06)', border: '1px solid rgba(74,144,217,0.12)', color: '#94A3B8' }}
                  >
                    El ciclo semanal empieza el lunes y cierra el domingo de cada semana.
                  </div>
                )}

                {cicloForm.tipo === 'personalizado' && (
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Fecha de inicio"
                      type="date"
                      value={cicloForm.fechaInicioCustom?.slice(0, 10) ?? ''}
                      onChange={(e) => setCicloForm((p) => ({ ...p, fechaInicioCustom: e.target.value }))}
                    />
                    <Input
                      label="Fecha de cierre"
                      type="date"
                      value={cicloForm.fechaFinCustom?.slice(0, 10) ?? ''}
                      onChange={(e) => setCicloForm((p) => ({ ...p, fechaFinCustom: e.target.value }))}
                    />
                  </div>
                )}

                <div className="flex items-center gap-3 pt-1">
                  <Button onClick={saveCiclo} loading={cicloSaving}>
                    <Save className="h-4 w-4" />
                    Guardar ciclo
                  </Button>
                  {cicloOk && (
                    <span className="flex items-center gap-1.5 text-sm" style={{ color: '#7FC136' }}>
                      <CheckCircle2 className="h-4 w-4" /> Guardado
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* ── Sorteos ──────────────────────────────── */}
            <div className="rounded-xl p-6" style={card}>
              {sectionHeader(
                <Gift className="h-4 w-4" style={{ color: '#F59E0B' }} />,
                'Sorteos',
                'Premios y sorteos para motivar al equipo',
                '#F59E0B',
              )}

              <div className="space-y-3 mb-4">
                {sorteos.length === 0 ? (
                  <div className="rounded-lg px-4 py-8 text-center"
                    style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.07)' }}>
                    <Gift className="h-8 w-8 mx-auto mb-2 opacity-20" style={{ color: '#F59E0B' }} />
                    <p className="text-sm" style={{ color: '#475569' }}>Sin sorteos programados</p>
                  </div>
                ) : (
                  sorteos.map((s) => (
                    <div
                      key={s.id}
                      className="flex items-center gap-4 rounded-lg px-4 py-3"
                      style={{ background: '#12213A', border: '1px solid rgba(255,255,255,0.06)' }}
                    >
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: 'rgba(245,158,11,0.12)' }}
                      >
                        <Gift className="h-4 w-4" style={{ color: '#F59E0B' }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate" style={{ color: '#EEF2FF' }}>{s.titulo}</p>
                        <p className="text-xs truncate" style={{ color: '#475569' }}>
                          Premio: {s.premio} · {new Date(s.fecha).toLocaleDateString('es-AR')}
                        </p>
                      </div>
                      <button
                        onClick={() => deleteSorteo(s.id)}
                        className="p-1.5 rounded-lg transition-colors flex-shrink-0"
                        style={{ color: '#475569' }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLElement).style.color = '#EF4444'
                          ;(e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.08)'
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLElement).style.color = '#475569'
                          ;(e.currentTarget as HTMLElement).style.background = 'transparent'
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              <Button variant="outline" onClick={() => { setSorteoError(''); setSorteoModal(true) }}>
                <Plus className="h-4 w-4" />
                Nuevo sorteo
              </Button>
            </div>

            {/* ── Fórmula de ranking ───────────────────── */}
            <div className="rounded-xl p-6" style={card}>
              {sectionHeader(
                <Trophy className="h-4 w-4" style={{ color: '#8B5CF6' }} />,
                'Fórmula de ranking',
                'Define el peso de cada métrica para calcular el puntaje de los vendedores',
                '#8B5CF6',
              )}

              <div
                className="rounded-lg px-4 py-3 mb-5 text-xs"
                style={{ background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.12)', color: '#94A3B8' }}
              >
                <strong style={{ color: '#CBD5E1' }}>Fórmula: </strong>
                Puntaje = (ventas × {rankingForm.pesoVentas}) + (leads contactados × {rankingForm.pesoLeadsContactados}) + (tasa conversión × {rankingForm.pesoConversion}) + (ticket promedio × {rankingForm.pesoTicketPromedio}) + (reuniones × {rankingForm.pesoReuniones})
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                {[
                  { key: 'pesoVentas',           label: 'Peso ventas cerradas',      step: 1 },
                  { key: 'pesoLeadsContactados',  label: 'Peso leads contactados',    step: 0.1 },
                  { key: 'pesoConversion',        label: 'Peso tasa de conversión',   step: 0.1 },
                  { key: 'pesoTicketPromedio',    label: 'Peso ticket promedio',      step: 0.001 },
                  { key: 'pesoReuniones',         label: 'Peso reuniones',            step: 0.1 },
                ].map(({ key, label, step }) => (
                  <div key={key} className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium" style={{ color: '#94A3B8' }}>{label}</label>
                    <input
                      type="number"
                      step={step}
                      min={0}
                      value={(rankingForm as any)[key]}
                      onChange={(e) => setRankingForm((p) => ({ ...p, [key]: parseFloat(e.target.value) || 0 }))}
                      className="rounded-lg px-3 py-2 text-sm focus:outline-none"
                      style={selectStyle}
                    />
                  </div>
                ))}

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium" style={{ color: '#94A3B8' }}>Criterio de desempate</label>
                  <select
                    value={rankingForm.criterioDesempate}
                    onChange={(e) => setRankingForm((p) => ({ ...p, criterioDesempate: e.target.value as CriterioDesempate }))}
                    className="rounded-lg px-3 py-2.5 text-sm focus:outline-none"
                    style={selectStyle}
                  >
                    {(Object.keys(CRITERIO_LABELS) as CriterioDesempate[]).map((k) => (
                      <option key={k} value={k}>{CRITERIO_LABELS[k]}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button onClick={saveRanking} loading={rankingSaving}>
                  <Save className="h-4 w-4" />
                  Guardar fórmula
                </Button>
                {rankingOk && (
                  <span className="flex items-center gap-1.5 text-sm" style={{ color: '#7FC136' }}>
                    <CheckCircle2 className="h-4 w-4" /> Guardado
                  </span>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Modal nuevo sorteo */}
      <Modal open={sorteoModal} onClose={() => setSorteoModal(false)} title="Nuevo sorteo">
        <form onSubmit={createSorteo} className="space-y-4">
          <Input
            label="Título del sorteo"
            value={sorteoForm.titulo}
            onChange={(e) => setSorteoForm((p) => ({ ...p, titulo: e.target.value }))}
            placeholder="Sorteo mensual – Marzo"
            required
          />
          <Input
            label="Premio"
            value={sorteoForm.premio}
            onChange={(e) => setSorteoForm((p) => ({ ...p, premio: e.target.value }))}
            placeholder="Viaje a Bariloche para dos personas"
            required
          />
          <Input
            label="Fecha del sorteo"
            type="date"
            value={sorteoForm.fecha}
            onChange={(e) => setSorteoForm((p) => ({ ...p, fecha: e.target.value }))}
            required
          />
          <Input
            label="Descripción (opcional)"
            value={sorteoForm.descripcion}
            onChange={(e) => setSorteoForm((p) => ({ ...p, descripcion: e.target.value }))}
            placeholder="Descripción del sorteo..."
          />
          <Input
            label="URL de imagen (opcional)"
            value={sorteoForm.imagenUrl}
            onChange={(e) => setSorteoForm((p) => ({ ...p, imagenUrl: e.target.value }))}
            placeholder="https://..."
          />
          {sorteoError && (
            <p className="text-sm text-red-400 bg-red-900/20 px-3 py-2 rounded-lg">{sorteoError}</p>
          )}
          <div className="flex gap-3 pt-1">
            <Button type="button" variant="outline" onClick={() => setSorteoModal(false)} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" loading={sorteoSaving} className="flex-1">
              Crear sorteo
            </Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  )
}
