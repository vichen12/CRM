import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' })

export const metadata: Metadata = {
  title: 'Broker Seguros — Panel de gestión',
  description: 'Plataforma de gestión para broker de seguros en Argentina',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${geist.variable} font-sans antialiased`} suppressHydrationWarning>{children}</body>
    </html>
  )
}
