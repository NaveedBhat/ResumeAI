import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { getProfile } from '@/lib/usage'

export async function POST() {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const profile = await getProfile(userId)
    if (!profile?.stripe_customer_id) {
      return NextResponse.json({ error: 'No billing account found. Please subscribe first.' }, { status: 400 })
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL
    if (!appUrl) throw new Error('NEXT_PUBLIC_APP_URL environment variable is not set')

    const session = await stripe.billingPortal.sessions.create({
      customer: profile.stripe_customer_id,
      return_url: `${appUrl}/billing`,
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('Portal error:', err)
    return NextResponse.json({ error: 'Failed to open billing portal.' }, { status: 500 })
  }
}
