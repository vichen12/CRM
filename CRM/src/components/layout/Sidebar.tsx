'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  MapPin,
  FileText,
  Bell,
  Trophy,
  LogOut,
  UserCircle,
  MessageSquare,
  TrendingUp,
  Target,
  Settings,
  Zap,
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { getIniciales, getRolLabel } from '@/lib/utils/format'
import type { Profile } from '@/lib/types'

interface NavItem {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>
  roles: string[]
}

const navItems: NavItem[] = [
  { href: '/admin',                label: 'Dashboard',      icon: LayoutDashboard, roles: ['admin'] },
  { href: '/admin/vendedores',     label: 'Vendedores',     icon: Users,           roles: ['admin'] },
  { href: '/admin/zonas',          label: 'Zonas',          icon: MapPin,          roles: ['admin'] },
  { href: '/admin/leads',          label: 'Leads',          icon: Target,          roles: ['admin'] },
  { href: '/admin/documentos',     label: 'Documentos',     icon: FileText,        roles: ['admin'] },
  { href: '/admin/noticias',       label: 'Noticias',       icon: Bell,            roles: ['admin'] },
  { href: '/admin/configuracion',  label: 'Configuración',  icon: Settings,        roles: ['admin'] },
  { href: '/vendedor',          label: 'Mi Dashboard',   icon: LayoutDashboard, roles: ['vendedor_matriculado', 'vendedor_sin_matricula'] },
  { href: '/vendedor/leads',    label: 'Leads',          icon: Target,          roles: ['vendedor_matriculado', 'vendedor_sin_matricula'] },
  { href: '/vendedor/clientes', label: 'Mis Clientes',   icon: UserCircle,      roles: ['vendedor_matriculado', 'vendedor_sin_matricula'] },
  { href: '/vendedor/ventas',   label: 'Mis Ventas',     icon: TrendingUp,      roles: ['vendedor_matriculado', 'vendedor_sin_matricula'] },
  { href: '/vendedor/consultas',label: 'Consultas',      icon: MessageSquare,   roles: ['vendedor_matriculado', 'vendedor_sin_matricula'] },
  { href: '/vendedor/ranking',  label: 'Ranking',        icon: Trophy,          roles: ['vendedor_matriculado', 'vendedor_sin_matricula'] },
  { href: '/vendedor/noticias', label: 'Noticias',       icon: Bell,            roles: ['vendedor_matriculado', 'vendedor_sin_matricula'] },
  { href: '/vendedor/documentos',label: 'Documentos',    icon: FileText,        roles: ['vendedor_matriculado', 'vendedor_sin_matricula'] },
]

interface SidebarProps {
  profile: Profile
  onSignOut: () => void
}

export function Sidebar({ profile, onSignOut }: SidebarProps) {
  const pathname = usePathname()
  const filteredItems = navItems.filter((item) => item.roles.includes(profile.rol))

  return (
    <aside
      className="flex flex-col w-60 min-h-screen flex-shrink-0"
      style={{
        background: '#0A1220',
        borderRight: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* ── Logo ─────────────────────────────── */}
      <div className="flex items-center gap-3 px-5 h-16" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #4A90D9 0%, #7FC136 100%)' }}
        >
          <Zap className="h-4 w-4 text-white" strokeWidth={2.5} />
        </div>
        <div>
          <p className="text-sm font-bold leading-none tracking-tight">
            <span style={{ color: '#4A90D9' }}>human</span>
            <span style={{ color: '#7FC136' }}>sap</span>
          </p>
          <p className="text-[10px] mt-0.5" style={{ color: '#2C3E55', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            CRM Platform
          </p>
        </div>
      </div>

      {/* ── Nav ──────────────────────────────── */}
      <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto">
        {filteredItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-150 group relative"
              style={{
                color: isActive ? '#EEF2FF' : '#475569',
                background: isActive ? 'rgba(74,144,217,0.1)' : 'transparent',
                borderLeft: isActive ? '2px solid #4A90D9' : '2px solid transparent',
                fontWeight: isActive ? 500 : 400,
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  const el = e.currentTarget as HTMLElement
                  el.style.color = '#94A3B8'
                  el.style.background = 'rgba(255,255,255,0.04)'
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  const el = e.currentTarget as HTMLElement
                  el.style.color = '#475569'
                  el.style.background = 'transparent'
                }
              }}
            >
              <item.icon
                className="h-4 w-4 flex-shrink-0 transition-colors"
                style={{ color: isActive ? '#4A90D9' : undefined }}
              />
              <span className="flex-1 leading-none">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* ── Divider ──────────────────────────── */}
      <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)', margin: '0 16px' }} />

      {/* ── User footer ──────────────────────── */}
      <div className="px-2 py-3 space-y-0.5">
        <Link
          href="/perfil"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150"
          style={{
            color: pathname === '/perfil' ? '#EEF2FF' : '#475569',
            background: pathname === '/perfil' ? 'rgba(74,144,217,0.1)' : 'transparent',
            borderLeft: pathname === '/perfil' ? '2px solid #4A90D9' : '2px solid transparent',
          }}
          onMouseEnter={(e) => {
            if (pathname !== '/perfil') {
              const el = e.currentTarget as HTMLElement
              el.style.color = '#94A3B8'
              el.style.background = 'rgba(255,255,255,0.04)'
            }
          }}
          onMouseLeave={(e) => {
            if (pathname !== '/perfil') {
              const el = e.currentTarget as HTMLElement
              el.style.color = '#475569'
              el.style.background = 'transparent'
            }
          }}
        >
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #4A90D9, #7FC136)', color: '#fff' }}
          >
            {getIniciales(profile)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold leading-tight truncate" style={{ color: '#CBD5E1' }}>
              {profile.nombre} {profile.apellido}
            </p>
            <p className="text-[10px] mt-0.5 truncate" style={{ color: '#475569' }}>
              {getRolLabel(profile.rol)}
            </p>
          </div>
          <Settings className="h-3.5 w-3.5 flex-shrink-0" style={{ color: '#2C3E55' }} />
        </Link>

        <button
          onClick={onSignOut}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm transition-all duration-150"
          style={{ color: '#475569', borderLeft: '2px solid transparent' }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLElement
            el.style.color = '#FCA5A5'
            el.style.background = 'rgba(239,68,68,0.07)'
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLElement
            el.style.color = '#475569'
            el.style.background = 'transparent'
          }}
        >
          <LogOut className="h-4 w-4 flex-shrink-0" />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </aside>
  )
}
