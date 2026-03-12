'use client'

import { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { DocumentoCard } from '@/components/documentos/DocumentoCard'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { PageSpinner } from '@/components/ui/Spinner'
import { useAuth } from '@/hooks/useAuth'
import { apiFetch } from '@/lib/api/client'
import type { Documento, TipoDocumento } from '@/lib/types'

const TIPOS: { label: string; value: TipoDocumento | '' }[] = [
  { label: 'Todos', value: '' },
  { label: 'Productos', value: 'producto' },
  { label: 'Coberturas', value: 'cobertura' },
  { label: 'Procesos', value: 'proceso' },
  { label: 'Formularios', value: 'formulario' },
]

const TIPOS_FORM: { label: string; value: TipoDocumento }[] = [
  { label: 'Producto', value: 'producto' },
  { label: 'Cobertura', value: 'cobertura' },
  { label: 'Proceso', value: 'proceso' },
  { label: 'Formulario', value: 'formulario' },
  { label: 'Otro', value: 'otro' },
]

export default function AdminDocumentosPage() {
  const { profile, loading: authLoading } = useAuth()
  const [documentos, setDocumentos] = useState<Documento[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [filtroTipo, setFiltroTipo] = useState<TipoDocumento | ''>('')
  const [form, setForm] = useState({ nombre: '', descripcion: '', tipo: 'producto' as TipoDocumento, url: '' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const fetchDocumentos = async () => {
    setLoading(true)
    const url = filtroTipo ? `/documentos?tipo=${filtroTipo}` : '/documentos'
    apiFetch<Documento[]>(url).then(setDocumentos).catch(() => {}).finally(() => setLoading(false))
  }

  useEffect(() => { fetchDocumentos() }, [filtroTipo])

  if (authLoading || !profile) return <PageSpinner />

  const handleSubir = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.nombre || !form.url) { setError('Nombre y URL son requeridos'); return }
    setSaving(true)
    setError('')
    try {
      await apiFetch('/documentos', { method: 'POST', body: JSON.stringify(form) })
      await fetchDocumentos()
      setModalOpen(false)
      setForm({ nombre: '', descripcion: '', tipo: 'producto', url: '' })
    } catch (e: any) {
      setError(e.message ?? 'Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  const handleEliminar = async (id: string) => {
    await apiFetch(`/documentos/${id}`, { method: 'DELETE' })
    setDocumentos((prev) => prev.filter((d) => d.id !== id))
  }

  return (
    <DashboardLayout profile={profile} title="Documentos">
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex gap-2 flex-wrap">
            {TIPOS.map((t) => (
              <button
                key={t.value}
                onClick={() => setFiltroTipo(t.value)}
                className="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                style={
                  filtroTipo === t.value
                    ? { background: '#4A90D9', color: 'white', border: '1px solid #4A90D9' }
                    : { background: '#12213A', color: '#475569', border: '1px solid rgba(255,255,255,0.07)' }
                }
              >
                {t.label}
              </button>
            ))}
          </div>
          <Button onClick={() => { setError(''); setModalOpen(true) }}>
            <Plus className="h-4 w-4" />
            Agregar documento
          </Button>
        </div>

        {loading ? (
          <PageSpinner />
        ) : documentos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20" style={{ color: '#475569' }}>
            <p>No hay documentos aún</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {documentos.map((doc) => (
              <DocumentoCard key={doc.id} documento={doc} canDelete onDelete={handleEliminar} />
            ))}
          </div>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Agregar documento" size="lg">
        <form onSubmit={handleSubir} className="space-y-4">
          <Input
            label="Nombre del documento"
            value={form.nombre}
            onChange={(e) => setForm((p) => ({ ...p, nombre: e.target.value }))}
            placeholder="Manual de producto vida"
            required
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium" style={{ color: '#EEF2FF' }}>Tipo</label>
            <select
              value={form.tipo}
              onChange={(e) => setForm((p) => ({ ...p, tipo: e.target.value as TipoDocumento }))}
              className="block w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2"
              style={{
                background: '#12213A',
                border: '1px solid rgba(255,255,255,0.07)',
                color: '#EEF2FF',
              }}
            >
              {TIPOS_FORM.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
          <Input
            label="URL del documento"
            value={form.url}
            onChange={(e) => setForm((p) => ({ ...p, url: e.target.value }))}
            placeholder="https://drive.google.com/..."
            hint="Podés usar Google Drive, Dropbox, o cualquier URL pública"
            required
          />
          <Input
            label="Descripción (opcional)"
            value={form.descripcion}
            onChange={(e) => setForm((p) => ({ ...p, descripcion: e.target.value }))}
            placeholder="Breve descripción del contenido..."
          />
          {error && <p className="text-sm text-red-400 bg-red-900/20 px-3 py-2 rounded-lg">{error}</p>}
          <div className="flex gap-3 pt-1">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" loading={saving} className="flex-1">
              Guardar
            </Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  )
}
