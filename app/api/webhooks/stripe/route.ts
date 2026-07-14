import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { supabaseAdmin } from '@/lib/supabase'
import Stripe from 'stripe'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  if (!sig) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.error('Stripe webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const clerkUserId = session.metadata?.clerk_user_id

        if (!clerkUserId) {
          console.error('No clerk_user_id in checkout session metadata')
          break
        }

        // Get subscription to save subscription ID
        const subscriptionId = session.subscription as string | null

        await supabaseAdmin
          .from('profiles')
          .update({
            tier: 'pro',
            stripe_customer_id: session.customer as string,
            stripe_subscription_id: subscriptionId,
          })
          .eq('clerk_user_id', clerkUserId)

        console.log(`✅ Upgraded user ${clerkUserId} to Pro`)
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const clerkUserId = subscription.metadata?.clerk_user_id

        if (clerkUserId) {
          await supabaseAdmin
            .from('profiles')
            .update({
              tier: 'free',
              stripe_subscription_id: null,
            })
            .eq('clerk_user_id', clerkUserId)

          console.log(`⬇️ Downgraded user ${clerkUserId} to Free`)
        } else {
          // Fallback: look up by customer ID
          await supabaseAdmin
            .from('profiles')
            .update({
              tier: 'free',
              stripe_subscription_id: null,
            })
            .eq('stripe_customer_id', subscription.customer as string)
        }
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const clerkUserId = subscription.metadata?.clerk_user_id
        const isActive = subscription.status === 'active'

        if (clerkUserId) {
          await supabaseAdmin
            .from('profiles')
            .update({
              tier: isActive ? 'pro' : 'free',
              stripe_subscription_id: isActive ? subscription.id : null,
            })
            .eq('clerk_user_id', clerkUserId)
        }
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        console.warn('Payment failed for customer:', invoice.customer)
        // Could send email notification here
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }
  } catch (err) {
    console.error('Webhook handler error:', err)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
