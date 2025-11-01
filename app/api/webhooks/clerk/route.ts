import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { Webhook } from 'svix'
import { WebhookEvent } from '@clerk/nextjs/server'
import { createOrUpdateUserProfile } from '@/lib/db-helpers'
import { supabase } from '@/lib/supabase'

export async function POST(req: Request) {
  // Get the webhook secret from environment variables
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env')
  }

  // Get the headers
  const headerPayload = await headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new NextResponse('Error occurred -- no svix headers', {
      status: 400,
    })
  }

  // Get the body
  const payload = await req.json()
  const body = JSON.stringify(payload)

  // Create a new Svix instance with your secret
  const wh = new Webhook(WEBHOOK_SECRET)

  let evt: WebhookEvent

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new NextResponse('Error occurred', {
      status: 400,
    })
  }

  // Handle the webhook event
  const eventType = evt.type

  if (eventType === 'user.created') {
    const { id, email_addresses, first_name, last_name, image_url } = evt.data

    // Create user profile in Supabase
    await createOrUpdateUserProfile({
      clerk_user_id: id,
      email: email_addresses[0]?.email_address,
      full_name: `${first_name || ''} ${last_name || ''}`.trim(),
      avatar_url: image_url,
      theme: 'light',
      notifications_enabled: true,
    })

    console.log('User profile created for:', id)
  }

  if (eventType === 'user.updated') {
    const { id, email_addresses, first_name, last_name, image_url } = evt.data

    // Update user profile in Supabase
    await createOrUpdateUserProfile({
      clerk_user_id: id,
      email: email_addresses[0]?.email_address,
      full_name: `${first_name || ''} ${last_name || ''}`.trim(),
      avatar_url: image_url,
    })

    console.log('User profile updated for:', id)
  }

  if (eventType === 'user.deleted') {
    const { id } = evt.data

    if (id) {
      // Delete user profile from Supabase (cascade will delete related data)
      const { error } = await supabase
        .from('user_profiles')
        .delete()
        .eq('clerk_user_id', id)

      if (error) {
        console.error('Error deleting user profile:', error)
      } else {
        console.log('User profile deleted for:', id)
      }
    }
  }

  return new NextResponse('', { status: 200 })
}
