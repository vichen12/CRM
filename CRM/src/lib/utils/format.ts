import type { Profile } from '@/lib/types'

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date))
}

export function formatRelativeTime(date: string): string {
  const now = new Date()
  const then = new Date(date)
  const diff = now.getTime() - then.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'Ahora mismo'
  if (minutes < 60) return `Hace ${minutes} min`
  if (hours < 24) return `Hace ${hours} h`
  if (days === 1) return 'Ayer'
  return `Hace ${days} días`
}

export function getNombreCompleto(profile: Pick<Profile, 'nombre' | 'apellido'>): string {
  return `${profile.nombre} ${profile.apellido}`
}

export function getIniciales(profile: Pick<Profile, 'nombre' | 'apellido'>): string {
  return `${profile.nombre[0] ?? ''}${profile.apellido[0] ?? ''}`.toUpperCase()
}

export function getMesNombre(mes: number): string {
  const meses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
  ]
  return meses[mes - 1] ?? ''
}

export function getRolLabel(rol: string): string {
  const labels: Record<string, string> = {
    admin: 'Administrador',
    vendedor_matriculado: 'Vendedor matriculado',
    vendedor_sin_matricula: 'Vendedor',
  }
  return labels[rol] ?? rol
}
