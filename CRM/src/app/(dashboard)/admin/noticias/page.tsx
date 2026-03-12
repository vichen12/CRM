'use client'

import { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { NoticiaCard } from '@/components/noticias/NoticiaCard'
import { NoticiaForm } from '@/components/noticias/NoticiaForm'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { PageSpinner } from '@/components/ui/Spinner'
import { useAuth } from '@/hooks/useAuth'
import { apiFetch } from '@/lib/api/client'
import type { Noticia } from '@/lib/types'
import type { NoticiaFormData } from '@/components/noticias/NoticiaForm'

export default function AdminNoticiasPage() {
  const { profile, loading: authLoading } = useAuth()
  const [noticias, setNoticias] = useState<Noticia[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)

  const fetchNoticias = async () => {
    setLoading(true)
    apiFetch<Noticia[]>('/noticias')
      .then(setNoticias)
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchNoticias() }, [])

  if (authLoading || !profile) return <PageSpinner />

  const handlePublicar = async (data: NoticiaFormData) => {
    await apiFetch('/noticias', { method: 'POST', body: JSON.stringify(data) })
    await fetchNoticias()
    setModalOpen(false)
  }

  const handleEliminar = async (id: string) => {
    await apiFetch(`/noticias/${id}`, { method: 'DELETE' })
    setNoticias((prev) => prev.filter((n) => n.id !== id))
  }

  return (
    <DashboardLayout profile={profile} title="Noticias y novedades">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm" style={{ color: '#475569' }}>
            {noticias.length} publicación{noticias.length !== 1 ? 'es' : ''}
          </p>
          <Button onClick={() => setModalOpen(true)}>
            <Plus className="h-4 w-4" />
            Publicar novedad
          </Button>
        </div>

        {loading ? (
          <PageSpinner />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {noticias.map((n) => (
              <NoticiaCard key={n.id} noticia={n} onDelete={handleEliminar} />
            ))}
          </div>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Nueva noticia" size="lg">
        <NoticiaForm onSubmit={handlePublicar} onCancel={() => setModalOpen(false)} />
      </Modal>
    </DashboardLayout>
  )
}
