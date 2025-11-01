"use client"

import { useUser } from '@clerk/nextjs'
import { useSupabaseSync } from '@/hooks/use-supabase-sync'
import AIAssistantUI from '@/components/AIAssistantUI'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const { isLoaded, isSignedIn, user } = useUser()
  const { profile, loading } = useSupabaseSync()
  const router = useRouter()

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/sign-in')
    }
  }, [isLoaded, isSignedIn, router])

  if (!isLoaded || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your mental wellness companion...</p>
        </div>
      </div>
    )
  }

  if (!isSignedIn) {
    return null
  }

  return <AIAssistantUI userProfile={profile} userId={user?.id} />
}
