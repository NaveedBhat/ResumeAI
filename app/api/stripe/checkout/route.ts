import { auth, currentUser } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { getOrCreateProfile } from '@/lib/usage'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST() {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const clerkUser = await currentUser()
    const email = clerkUser?.emailAddresses[0]?.emailAddress

    // Get or create profile
    const profile = await getOrCreateProfile(
      userId,
      email ?? '',
      clerkUser?.fullName
    )

    // Create or retrieve Stripe customer
    let customerId = profile.stripe_customer_id

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: email ?? undefined,
        metadata: { clerk_user_id: userId },
      })
      customerId = customer.id

      // Save customer ID
      await supabaseAdmin
        .from('profiles')
        .update({ stripe_customer_id: customerId })
        .eq('clerk_user_id', userId)
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL
    if (!appUrl) throw new Error('NEXT_PUBLIC_APP_URL environment variable is not set')

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: process.env.STRIPE_PRO_PRICE_ID!,
          quantity: 1,
        },
      ],
      success_url: `${appUrl}/billing?success=1`,
      cancel_url: `${appUrl}/billing?canceled=1`,
      metadata: { clerk_user_id: userId },
      subscription_data: {
        metadata: { clerk_user_id: userId },
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('Checkout error:', err)
    return NextResponse.json({ error: 'Failed to create checkout session.' }, { status: 500 })
  }
}
