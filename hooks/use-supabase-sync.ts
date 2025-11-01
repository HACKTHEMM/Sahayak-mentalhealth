import { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { getUserProfile, createOrUpdateUserProfile } from '@/lib/db-helpers'
import { UserProfile } from '@/lib/supabase'

export function useSupabaseSync() {
  const { user, isLoaded } = useUser()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function syncUserProfile() {
      if (!isLoaded || !user) {
        setLoading(false)
        return
      }

      try {
        // Try to get existing profile
        let userProfile = await getUserProfile(user.id)

        // If profile doesn't exist, create it
        if (!userProfile) {
          userProfile = await createOrUpdateUserProfile({
            clerk_user_id: user.id,
            email: user.emailAddresses[0]?.emailAddress,
            full_name: user.fullName || undefined,
            avatar_url: user.imageUrl,
            theme: 'light',
            notifications_enabled: true,
          })
        }

        setProfile(userProfile)
      } catch (error) {
        console.error('Error syncing user profile:', error)
      } finally {
        setLoading(false)
      }
    }

    syncUserProfile()
  }, [user, isLoaded])

  return { profile, loading, refetch: async () => {
    if (user) {
      const userProfile = await getUserProfile(user.id)
      setProfile(userProfile)
    }
  }}
}
