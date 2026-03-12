'use client'

import { useState } from 'react'
import { Bell, CheckCheck, X } from 'lucide-react'
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
        background: '#060C17',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}
    >
      {/* Title */}
      <div className="flex items-center gap-2">
        <h1
          className="text-base font-semibold tracking-tight"
          style={{ color: '#EEF2FF' }}
        >
          {title}
        </h1>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2">
        {/* Notification bell */}
        <div className="relative">
          <button
            onClick={() => setPanelOpen((p) => !p)}
            className="relative flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-150"
            style={{ color: '#475569' }}
            aria-label="Notificaciones"
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement
              el.style.background = 'rgba(255,255,255,0.06)'
              el.style.color = '#94A3B8'
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement
              el.style.background = 'transparent'
              el.style.color = '#475569'
            }}
          >
            <Bell className="h-4.5 w-4.5" style={{ width: 18, height: 18 }} />
            {noLeidas > 0 && (
              <span
                className="absolute top-1.5 right-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full text-[8px] font-bold text-white"
                style={{ background: '#4A90D9' }}
              >
                {noLeidas > 9 ? '9+' : noLeidas}
              </span>
            )}
          </button>

          {panelOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setPanelOpen(false)} />
              <div
                className="absolute right-0 top-12 z-20 w-80 rounded-xl overflow-hidden"
                style={{
                  background: '#0C1628',
                  border: '1px solid rgba(255,255,255,0.09)',
                  boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
                }}
              >
                {/* Panel header */}
                <div
                  className="px-4 py-3 flex items-center justify-between"
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold" style={{ color: '#EEF2FF' }}>
                      Notificaciones
                    </p>
                    {noLeidas > 0 && (
                      <span
                        className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
                        style={{ background: 'rgba(74,144,217,0.15)', color: '#4A90D9' }}
                      >
                        {noLeidas}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => setPanelOpen(false)}
                    className="w-6 h-6 flex items-center justify-center rounded-md transition-colors"
                    style={{ color: '#475569' }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#94A3B8' }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = '#475569' }}
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Panel body */}
                <div className="max-h-96 overflow-y-auto">
                  {notificaciones.length === 0 ? (
                    <div className="px-4 py-12 text-center">
                      <CheckCheck className="h-8 w-8 mx-auto mb-3" style={{ color: '#1A2E4A' }} />
                      <p className="text-sm" style={{ color: '#475569' }}>Todo al día</p>
                    </div>
                  ) : (
                    notificaciones.slice(0, 15).map((n) => (
                      <button
                        key={n.id}
                        onClick={() => { if (!n.leida) onMarcarLeida?.(n.id) }}
                        className={cn('w-full text-left px-4 py-3.5 transition-colors')}
                        style={{
                          borderBottom: '1px solid rgba(255,255,255,0.04)',
                          background: !n.leida ? 'rgba(74,144,217,0.04)' : 'transparent',
                        }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)' }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLElement).style.background = !n.leida
                            ? 'rgba(74,144,217,0.04)'
                            : 'transparent'
                        }}
                      >
                        <div className="flex items-start gap-3">
                          {!n.leida && (
                            <div
                              className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                              style={{ background: '#4A90D9' }}
                            />
                          )}
                          <div className={cn('flex-1 min-w-0', n.leida && 'ml-[18px]')}>
                            <p className="text-sm font-medium truncate" style={{ color: '#CBD5E1' }}>{n.titulo}</p>
                            <p className="text-xs mt-0.5 line-clamp-2" style={{ color: '#475569' }}>{n.mensaje}</p>
                            <p className="text-[11px] mt-1" style={{ color: '#2C3E55' }}>{formatRelativeTime(n.created_at)}</p>
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
      </div>
    </header>
  )
}
