'use client'

import { useState } from 'react'
import { Bell, CheckCheck, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { formatRelativeTime } from '@/lib/utils/format'
import type { Notificacion } from '@/lib/types'

interface HeaderProps {
  title: string
  notificaciones?: Notificacion[]
  onMarcarLeida?: (id: string) => void
}

export function Header({ title, notificaciones = [], onMarcarLeida }: HeaderProps) {
  const [panelOpen, setPanelOpen] = useState(false)
  const noLeidas = notificaciones.filter((n) => !n.leida).length

  return (
    <header
      className="h-16 flex items-center justify-between px-6 flex-shrink-0"
      style={{
        background: 'rgba(255,255,255,0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(0,0,0,0.06)',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}
    >
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4" style={{ color: '#2A79C2' }} />
          <h1 className="text-lg font-semibold text-zinc-800 tracking-tight">{title}</h1>
        </div>
      </div>

      <div className="relative">
        <button
          onClick={() => setPanelOpen((p) => !p)}
          className="relative p-2 rounded-xl transition-all duration-200 hover:bg-zinc-100"
          aria-label="Notificaciones"
        >
          <Bell className="h-5 w-5 text-zinc-500" />
          {noLeidas > 0 && (
            <span
              className="absolute top-1.5 right-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full text-[9px] font-bold text-white"
              style={{ background: '#2A79C2' }}
            >
              {noLeidas > 9 ? '9+' : noLeidas}
            </span>
          )}
        </button>

        {panelOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setPanelOpen(false)} />
            <div
              className="absolute right-0 top-12 z-20 w-80 rounded-2xl overflow-hidden"
              style={{
                background: 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(0,0,0,0.08)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
              }}
            >
              <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                <p className="text-sm font-semibold text-zinc-800">Notificaciones</p>
                {noLeidas > 0 && (
                  <span
                    className="text-xs font-medium px-2 py-0.5 rounded-full text-white"
                    style={{ background: '#2A79C2' }}
                  >
                    {noLeidas} nuevas
                  </span>
                )}
              </div>
              <div className="max-h-96 overflow-y-auto divide-y divide-zinc-50">
                {notificaciones.length === 0 ? (
                  <div className="px-4 py-12 text-center">
                    <CheckCheck className="h-8 w-8 text-zinc-300 mx-auto mb-2" />
                    <p className="text-sm text-zinc-400">Todo al día</p>
                  </div>
                ) : (
                  notificaciones.slice(0, 15).map((n) => (
                    <button
                      key={n.id}
                      onClick={() => {
                        if (!n.leida) onMarcarLeida?.(n.id)
                      }}
                      className={cn(
                        'w-full text-left px-4 py-3.5 transition-colors hover:bg-zinc-50/80',
                        !n.leida && 'bg-blue-50/60'
                      )}
                    >
                      <div className="flex items-start gap-3">
                        {!n.leida && (
                          <div
                            className="w-2 h-2 mt-1.5 rounded-full flex-shrink-0"
                            style={{ background: '#2A79C2' }}
                          />
                        )}
                        <div className={cn('flex-1 min-w-0', n.leida && 'ml-5')}>
                          <p className="text-sm font-medium text-zinc-800 truncate">{n.titulo}</p>
                          <p className="text-xs text-zinc-500 mt-0.5 line-clamp-2">{n.mensaje}</p>
                          <p className="text-xs text-zinc-400 mt-1">{formatRelativeTime(n.created_at)}</p>
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  )
}
