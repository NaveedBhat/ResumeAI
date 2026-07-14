import { NextRequest, NextResponse } from 'next/server'
import { Webhook } from 'svix'
import { WebhookEvent } from '@clerk/nextjs/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const svixId = req.headers.get('svix-id')
  const svixTimestamp = req.headers.get('svix-timestamp')
  const svixSignature = req.headers.get('svix-signature')

  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json({ error: 'Missing svix headers' }, { status: 400 })
  }

  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!)

  let event: WebhookEvent

  try {
    event = wh.verify(body, {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Clerk webhook verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'user.created': {
        const { id, email_addresses, first_name, last_name } = event.data
        const email = email_addresses[0]?.email_address ?? ''
        const fullName = [first_name, last_name].filter(Boolean).join(' ') || null

        const { error } = await supabaseAdmin.from('profiles').upsert(
          {
            clerk_user_id: id,
            email,
            full_name: fullName,
            tier: 'free',
            usage_today: 0,
            last_reset_date: new Date().toISOString().split('T')[0],
          },
          { onConflict: 'clerk_user_id' }
        )

        if (error) {
          console.error('Failed to create profile:', error)
        } else {
          console.log(`✅ Created profile for user ${id}`)
        }
        break
      }

      case 'user.updated': {
        const { id, email_addresses, first_name, last_name } = event.data
        const email = email_addresses[0]?.email_address ?? ''
        const fullName = [first_name, last_name].filter(Boolean).join(' ') || null

        await supabaseAdmin
          .from('profiles')
          .update({ email, full_name: fullName })
          .eq('clerk_user_id', id)
        break
      }

      case 'user.deleted': {
        const { id } = event.data
        if (id) {
          await supabaseAdmin.from('profiles').delete().eq('clerk_user_id', id)
          console.log(`🗑️ Deleted profile for user ${id}`)
        }
        break
      }

      default:
        break
    }
  } catch (err) {
    console.error('Clerk webhook handler error:', err)
    return NextResponse.json({ error: 'Handler error' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
