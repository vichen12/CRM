declare module 'react-simple-maps' {
  import * as React from 'react'

  export interface ComposableMapProps {
    projection?: string
    projectionConfig?: Record<string, any>
    style?: React.CSSProperties
    width?: number
    height?: number
    children?: React.ReactNode
  }

  export interface ZoomableGroupProps {
    zoom?: number
    minZoom?: number
    maxZoom?: number
    center?: [number, number]
    children?: React.ReactNode
  }

  export interface GeographiesProps {
    geography: string | object
    children: (args: { geographies: any[] }) => React.ReactNode
  }

  export interface GeographyProps {
    geography: any
    style?: {
      default?: React.CSSProperties
      hover?: React.CSSProperties
      pressed?: React.CSSProperties
    }
    onMouseEnter?: (evt: React.MouseEvent) => void
    onMouseLeave?: (evt: React.MouseEvent) => void
    onMouseMove?: (evt: React.MouseEvent) => void
    onClick?: (evt: React.MouseEvent) => void
    className?: string
  }

  export const ComposableMap: React.FC<ComposableMapProps>
  export const ZoomableGroup: React.FC<ZoomableGroupProps>
  export const Geographies: React.FC<GeographiesProps>
  export const Geography: React.FC<GeographyProps>
}
