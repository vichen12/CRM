'use client'

import { useEffect, useState } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { NoticiaCard } from '@/components/noticias/NoticiaCard'
import { PageSpinner } from '@/components/ui/Spinner'
import { useAuth } from '@/hooks/useAuth'
import { apiFetch } from '@/lib/api/client'
import type { Noticia } from '@/lib/types'

export default function VendedorNoticiasPage() {
  const { profile, loading: authLoading } = useAuth()
  const [noticias, setNoticias] = useState<Noticia[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiFetch<Noticia[]>('/noticias?activas=true')
      .then(setNoticias)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (authLoading || !profile) return <PageSpinner />

  return (
    <DashboardLayout profile={profile} title="Noticias y novedades">
      {loading ? (
        <PageSpinner />
      ) : noticias.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20" style={{ color: '#475569' }}>
          <p>No hay noticias publicadas aún</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {noticias.map((n) => (
            <NoticiaCard key={n.id} noticia={n} />
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}
