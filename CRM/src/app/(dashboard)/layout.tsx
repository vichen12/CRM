export default function DashboardRootLayout({ children }: { children: React.ReactNode }) {
  // La autenticación la maneja el middleware via cookie JWT
  return <>{children}</>
}
