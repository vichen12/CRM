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
  Settings,
  Target,
  ChevronRight,
  Zap,
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { getIniciales, getRolLabel } from '@/lib/utils/format'
import type { Profile } from '@/lib/types'

interface NavItem {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  roles: string[]
}

const navItems: NavItem[] = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin'] },
  { href: '/admin/vendedores', label: 'Vendedores', icon: Users, roles: ['admin'] },
  { href: '/admin/zonas', label: 'Zonas', icon: MapPin, roles: ['admin'] },
  { href: '/admin/leads', label: 'Leads', icon: Target, roles: ['admin'] },
  { href: '/admin/documentos', label: 'Documentos', icon: FileText, roles: ['admin'] },
  { href: '/admin/noticias', label: 'Noticias', icon: Bell, roles: ['admin'] },
  {
    href: '/vendedor',
    label: 'Mi Dashboard',
    icon: LayoutDashboard,
    roles: ['vendedor_matriculado', 'vendedor_sin_matricula'],
  },
  {
    href: '/vendedor/leads',
    label: 'Leads',
    icon: Target,
    roles: ['vendedor_matriculado', 'vendedor_sin_matricula'],
  },
  {
    href: '/vendedor/clientes',
    label: 'Mis Clientes',
    icon: UserCircle,
    roles: ['vendedor_matriculado', 'vendedor_sin_matricula'],
  },
  {
    href: '/vendedor/ventas',
    label: 'Mis Ventas',
    icon: TrendingUp,
    roles: ['vendedor_matriculado', 'vendedor_sin_matricula'],
  },
  {
    href: '/vendedor/consultas',
    label: 'Consultas',
    icon: MessageSquare,
    roles: ['vendedor_matriculado', 'vendedor_sin_matricula'],
  },
  {
    href: '/vendedor/ranking',
    label: 'Ranking',
    icon: Trophy,
    roles: ['vendedor_matriculado', 'vendedor_sin_matricula'],
  },
  {
    href: '/vendedor/noticias',
    label: 'Noticias',
    icon: Bell,
    roles: ['vendedor_matriculado', 'vendedor_sin_matricula'],
  },
  {
    href: '/vendedor/documentos',
    label: 'Documentos',
    icon: FileText,
    roles: ['vendedor_matriculado', 'vendedor_sin_matricula'],
  },
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
      className="flex flex-col w-64 min-h-screen flex-shrink-0"
      style={{ background: '#131314', borderRight: '1px solid rgba(255,255,255,0.06)' }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div
          className="flex items-center justify-center w-9 h-9 rounded-xl flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #2A79C2, #8BC440)' }}
        >
          <Zap className="h-4 w-4 text-white" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold text-white leading-tight">
            <span style={{ color: '#2A79C2' }}>human</span>
            <span style={{ color: '#8BC440' }}>sap</span>
          </p>
          <p className="text-[10px] text-zinc-500 uppercase tracking-widest">CRM Platform</p>
        </div>
      </div>

      {/* Navegación */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {filteredItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group',
                isActive
                  ? 'text-white'
                  : 'text-zinc-400 hover:text-white'
              )}
              style={
                isActive
                  ? { background: '#2A79C2', boxShadow: '0 0 20px rgba(42,121,194,0.3)' }
                  : {}
              }
              onMouseEnter={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)'
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLElement).style.background = ''
                }
              }}
            >
              <item.icon className="h-4 w-4 flex-shrink-0" />
              <span className="flex-1">{item.label}</span>
              {isActive && <ChevronRight className="h-3 w-3 opacity-60" />}
            </Link>
          )
        })}
      </nav>

      {/* Separador */}
      <div className="mx-3 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />

      {/* Usuario + acciones */}
      <div className="px-3 py-4 space-y-1">
        <Link
          href="/perfil"
          className={cn(
            'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
            pathname === '/perfil'
              ? 'text-white'
              : 'text-zinc-400 hover:text-white'
          )}
          style={pathname === '/perfil' ? { background: '#2A79C2' } : {}}
          onMouseEnter={(e) => {
            if (pathname !== '/perfil') {
              (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)'
            }
          }}
          onMouseLeave={(e) => {
            if (pathname !== '/perfil') {
              (e.currentTarget as HTMLElement).style.background = ''
            }
          }}
        >
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #2A79C2, #8BC440)', color: 'white' }}
          >
            {getIniciales(profile)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white truncate">
              {profile.nombre} {profile.apellido}
            </p>
            <p className="text-[10px] text-zinc-500 truncate">{getRolLabel(profile.rol)}</p>
          </div>
          <Settings className="h-3.5 w-3.5 flex-shrink-0 opacity-50" />
        </Link>

        <button
          onClick={onSignOut}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-zinc-400 transition-all duration-200 hover:text-red-400"
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.08)'
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = ''
          }}
        >
          <LogOut className="h-4 w-4 flex-shrink-0" />
          Cerrar sesión
        </button>
      </div>
    </aside>
  )
}
