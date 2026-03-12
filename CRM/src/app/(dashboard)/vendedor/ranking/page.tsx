'use client'

import { useEffect, useState } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { RankingTable } from '@/components/ranking/RankingTable'
import { PodiumCard } from '@/components/ranking/PodiumCard'
import { PageSpinner } from '@/components/ui/Spinner'
import { useAuth } from '@/hooks/useAuth'
import { apiFetch } from '@/lib/api/client'
import { getMesNombre } from '@/lib/utils/format'
import { Trophy, Calendar } from 'lucide-react'
import type { RankingMensual } from '@/lib/types'

export default function VendedorRankingPage() {
  const { profile, loading: authLoading } = useAuth()
  const [rankings, setRankings] = useState<RankingMensual[]>([])
  const [loading, setLoading] = useState(true)

  const now = new Date()
  const mes = now.getMonth() + 1
  const anio = now.getFullYear()

  useEffect(() => {
    apiFetch<{ resultados: any[] }>('/ranking/activo')
      .then((data) => {
        const resultados = data?.resultados ?? []
        setRankings(
          resultados.map((r: any, i: number) => ({
            id: r.id,
            vendedor_id: r.perfilId,
            vendedor: r.perfil
              ? { ...r.perfil, rol: 'vendedor_matriculado', activo: true, created_at: '' }
              : undefined,
            mes,
            anio,
            ventas_count: r.ventas ?? 0,
            leads_cerrados: r.ventas ?? 0,
            monto_total: Number(r.primaTotal ?? 0),
            puntos: Number(r.puntos ?? 0),
            posicion: r.posicion ?? i + 1,
          })),
        )
      })
      .catch(() => setRankings([]))
      .finally(() => setLoading(false))
  }, [])

  if (authLoading || !profile) return <PageSpinner />

  const top3 = rankings.slice(0, 3)
  const myRank = rankings.find((r) => r.vendedor_id === profile.id)

  return (
    <DashboardLayout profile={profile} title="Ranking mensual">
      <div className="space-y-6">

        {/* Header */}
        <div
          className="rounded-2xl p-6 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #0C1628 0%, #12213A 100%)',
            border: '1px solid rgba(255,255,255,0.07)',
          }}
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(245,158,11,0.2)', border: '1px solid rgba(245,158,11,0.3)' }}
              >
                <Trophy className="h-6 w-6 text-amber-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Ranking mensual</h2>
                <div className="flex items-center gap-1.5 mt-0.5 text-sm" style={{ color: '#475569' }}>
                  <Calendar className="h-3.5 w-3.5" />
                  {getMesNombre(mes)} {anio}
                </div>
              </div>
            </div>

            {myRank && (
              <div
                className="px-5 py-3 rounded-xl text-right flex-shrink-0"
                style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)' }}
              >
                <p className="text-xs text-amber-400 font-semibold uppercase tracking-wider">Tu posición</p>
                <p className="text-3xl font-black text-amber-400">#{myRank.posicion ?? '—'}</p>
                <p className="text-xs" style={{ color: '#475569' }}>{myRank.puntos} pts</p>
              </div>
            )}
          </div>
          <div className="absolute -right-8 -top-8 w-36 h-36 rounded-full opacity-10" style={{ background: '#f59e0b' }} />
        </div>

        {loading ? (
          <PageSpinner />
        ) : rankings.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-20 rounded-2xl"
            style={{ background: '#0C1628', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
              style={{ background: 'rgba(245,158,11,0.08)' }}
            >
              <Trophy className="h-8 w-8 text-amber-400" />
            </div>
            <p className="font-medium" style={{ color: '#475569' }}>No hay ranking activo para este mes</p>
            <p className="text-xs mt-1" style={{ color: '#2C3E55' }}>El admin debe crear un periodo de ranking</p>
          </div>
        ) : (
          <>
            {/* Podio */}
            {top3.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                {top3[1] && <PodiumCard ranking={top3[1]} position={2} />}
                {top3[0] && <PodiumCard ranking={top3[0]} position={1} />}
                {top3[2] && <PodiumCard ranking={top3[2]} position={3} />}
              </div>
            )}

            <RankingTable rankings={rankings} currentVendedorId={profile.id} />
          </>
        )}
      </div>
    </DashboardLayout>
  )
}
