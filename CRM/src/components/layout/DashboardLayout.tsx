'use client'

import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { useAuth } from '@/hooks/useAuth'
import { useNotificaciones } from '@/hooks/useNotificaciones'
import type { Profile } from '@/lib/types'

interface DashboardLayoutProps {
  profile: Profile
  title: string
  children: React.ReactNode
}

export function DashboardLayout({ profile, title, children }: DashboardLayoutProps) {
  const { logout } = useAuth()
  const { notificaciones, marcarLeida } = useNotificaciones(profile.id)

  return (
    <div className="flex min-h-screen" style={{ background: '#060C17' }}>
      <Sidebar profile={profile} onSignOut={logout} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header title={title} notificaciones={notificaciones} onMarcarLeida={marcarLeida} />
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
