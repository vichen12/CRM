'use client'

import { useState } from 'react'
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps'

// GeoJSON servido localmente por Next.js desde /public
const GEO_URL = '/argentina-provinces.geojson'

// ── Normalización de nombres ─────────────────────────────────────────────
function normalizarNombre(nombre: string): string {
  return nombre
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
}

// ── Props ────────────────────────────────────────────────────────────────
interface ArgentinaMapProps {
  provinciaColorMap: Record<string, string>
  provinciaZonaMap: Record<string, string>
  hoveredZona: string | null
  onHoverZona: (zona: string | null) => void
}

// ── Componente ────────────────────────────────────────────────────────────
export default function ArgentinaMap({
  provinciaColorMap,
  provinciaZonaMap,
  hoveredZona,
  onHoverZona,
}: ArgentinaMapProps) {
  const [tooltip, setTooltip] = useState<{ x: number; y: number; text: string } | null>(null)

  const getColor = (provinciaGeo: string): string | undefined => {
    const norm = normalizarNombre(provinciaGeo)
    for (const [key, color] of Object.entries(provinciaColorMap)) {
      if (normalizarNombre(key) === norm) return color
    }
    return undefined
  }

  const getZona = (provinciaGeo: string): string | undefined => {
    const norm = normalizarNombre(provinciaGeo)
    for (const [key, zona] of Object.entries(provinciaZonaMap)) {
      if (normalizarNombre(key) === norm) return zona
    }
    return undefined
  }

  return (
    <div
      className="rounded-xl overflow-hidden relative"
      style={{ background: '#060C17', border: '1px solid rgba(255,255,255,0.07)' }}
    >
      {/* Header */}
      <div
        className="px-5 py-3 flex items-center justify-between"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
      >
        <div>
          <p className="text-sm font-semibold" style={{ color: '#EEF2FF' }}>Mapa de Argentina</p>
          <p className="text-xs" style={{ color: '#2C3E55' }}>
            Hover para ver el nombre · Provincias coloreadas tienen zona asignada
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ background: '#4A90D9' }} />
            <span className="text-xs" style={{ color: '#475569' }}>Con zona</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ background: '#1E3250' }} />
            <span className="text-xs" style={{ color: '#475569' }}>Sin zona</span>
          </div>
        </div>
      </div>

      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ scale: 390, center: [-64, -38] }}
        style={{ width: '100%', height: 420 }}
      >
        <ZoomableGroup zoom={1} minZoom={0.8} maxZoom={5}>
          <Geographies geography={GEO_URL}>
            {({ geographies }: { geographies: any[] }) =>
              geographies.map((geo: any) => {
                const nombre = geo.properties?.nombre ?? ''
                const color = getColor(nombre)
                const zona = getZona(nombre)
                const isHovered = hoveredZona != null && zona === hoveredZona

                return (
                  <Geography
                    key={geo.rsmKey ?? nombre}
                    geography={geo}
                    onMouseEnter={(evt: React.MouseEvent) => {
                      if (zona) onHoverZona(zona)
                      setTooltip({
                        x: evt.clientX,
                        y: evt.clientY,
                        text: zona ? `${nombre} → ${zona}` : `${nombre} (sin zona)`,
                      })
                    }}
                    onMouseMove={(evt: React.MouseEvent) => {
                      setTooltip((prev) =>
                        prev ? { ...prev, x: evt.clientX, y: evt.clientY } : null
                      )
                    }}
                    onMouseLeave={() => {
                      onHoverZona(null)
                      setTooltip(null)
                    }}
                    style={{
                      default: {
                        fill:        color ? (isHovered ? color : `${color}CC`) : '#1E3250',
                        stroke:      color ? `${color}40` : 'rgba(255,255,255,0.08)',
                        strokeWidth: 0.5,
                        outline:     'none',
                        transition:  'fill 0.15s ease',
                      },
                      hover: {
                        fill:        color ? color : '#2A4270',
                        stroke:      color ? `${color}80` : 'rgba(255,255,255,0.15)',
                        strokeWidth: 0.8,
                        outline:     'none',
                        cursor:      'pointer',
                      },
                      pressed: {
                        fill:    color ?? '#2A4270',
                        outline: 'none',
                      },
                    }}
                  />
                )
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="fixed z-50 px-3 py-2 rounded-xl text-xs pointer-events-none whitespace-nowrap"
          style={{
            left:      tooltip.x + 12,
            top:       tooltip.y - 10,
            background:'#12213A',
            border:    '1px solid rgba(255,255,255,0.12)',
            color:     '#EEF2FF',
            boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
          }}
        >
          {tooltip.text}
        </div>
      )}
    </div>
  )
}
