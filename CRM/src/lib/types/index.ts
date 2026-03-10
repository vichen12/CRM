// ============================================================
// TIPOS CENTRALES DEL SISTEMA
// ============================================================

export type Rol = 'admin' | 'vendedor_matriculado' | 'vendedor_sin_matricula'
export type EstadoLead = 'nuevo' | 'tomado' | 'en_proceso' | 'cerrado' | 'perdido'
export type TipoDocumento = 'producto' | 'cobertura' | 'proceso' | 'formulario' | 'otro'
export type TipoNotificacion = 'lead_nuevo' | 'noticia' | 'sistema'
export type EstadoVenta = 'vigente' | 'cancelada' | 'vencida'

export interface Zona {
  id: string
  nombre: string
  provincia: string
  descripcion?: string
  created_at: string
}

export interface Profile {
  id: string
  nombre: string
  apellido: string
  telefono?: string
  rol: Rol
  zona_id?: string
  zona?: Zona
  matricula?: string
  activo: boolean
  avatar_url?: string
  created_at: string
}

export interface Lead {
  id: string
  nombre: string
  apellido: string
  email?: string
  telefono: string
  zona_id: string
  zona?: Zona
  estado: EstadoLead
  vendedor_id?: string
  vendedor?: Profile
  notas?: string
  created_at: string
  tomado_at?: string
}

export interface Venta {
  id: string
  vendedor_id: string
  vendedor?: Profile
  lead_id?: string
  lead?: { id: string; nombre: string; apellido: string }
  cliente_id?: string
  cliente?: { id: string; nombre: string; apellido: string }
  producto: string
  compania?: string
  monto_prima?: number
  monto_comision?: number
  estado: EstadoVenta
  fecha_venta: string
  created_at: string
}

export interface Documento {
  id: string
  nombre: string
  descripcion?: string
  tipo: TipoDocumento
  url: string
  storage_path: string
  subido_por: string
  subidor?: Profile
  created_at: string
}

export interface Noticia {
  id: string
  titulo: string
  contenido: string
  imagen_url?: string
  publicado_por: string
  publicador?: Profile
  activa: boolean
  created_at: string
}

export interface Notificacion {
  id: string
  titulo: string
  mensaje: string
  tipo: TipoNotificacion
  vendedor_id: string
  lead_id?: string
  lead?: Lead
  noticia_id?: string
  noticia?: Noticia
  leida: boolean
  created_at: string
}

export interface RankingMensual {
  id: string
  vendedor_id: string
  vendedor?: Profile
  mes: number
  anio: number
  ventas_count: number
  leads_cerrados: number
  monto_total: number
  puntos: number
  posicion?: number
}

export type ConsultaTipo = 'nueva_poliza' | 'renovacion' | 'reclamo' | 'informacion' | 'otro'
export type ConsultaEstado = 'pendiente' | 'en_proceso' | 'resuelta' | 'cancelada'

export interface Cliente {
  id: string
  vendedorId: string
  vendedor?: Profile
  nombre: string
  apellido: string
  email?: string
  telefono: string
  direccion?: string
  localidad?: string
  provincia?: string
  fechaNacimiento?: string
  notas?: string
  activo: boolean
  createdAt: string
  updatedAt: string
  _count?: { ventas: number; consultas: number }
}

export interface Consulta {
  id: string
  vendedorId: string
  vendedor?: Profile
  clienteId?: string
  cliente?: { id: string; nombre: string; apellido: string }
  leadId?: string
  lead?: { id: string; nombre: string; apellido: string }
  tipo: ConsultaTipo
  estado: ConsultaEstado
  descripcion: string
  resolucion?: string
  createdAt: string
  updatedAt: string
}

export interface KPIVendedor {
  ventas_mes: number
  leads_tomados: number
  leads_cerrados: number
  comisiones_mes: number
  tasa_conversion: number
}

export interface VentasChartData {
  mes: string
  ventas: number
  comisiones: number
}
