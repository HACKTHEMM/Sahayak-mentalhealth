import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { getUserProfile, createOrUpdateUserProfile } from '@/lib/db-helpers'

export async function GET() {
  const { userId } = await auth()

  if (!userId) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const profile = await getUserProfile(userId)

  if (!profile) {
    return new NextResponse('Profile not found', { status: 404 })
  }

  return NextResponse.json(profile)
}

export async function POST(req: Request) {
  const { userId } = await auth()

  if (!userId) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const body = await req.json()

  const profile = await createOrUpdateUserProfile({
    clerk_user_id: userId,
    ...body,
  })

  if (!profile) {
    return new NextResponse('Failed to create/update profile', { status: 500 })
  }

  return NextResponse.json(profile)
}
