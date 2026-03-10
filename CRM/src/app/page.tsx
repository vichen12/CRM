'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { PageSpinner } from '@/components/ui/Spinner'

export default function RootPage() {
  const { profile, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (loading) return
    if (!profile) { router.replace('/login'); return }
    router.replace(profile.rol === 'admin' ? '/admin' : '/vendedor')
  }, [profile, loading])

  return <PageSpinner />
}
