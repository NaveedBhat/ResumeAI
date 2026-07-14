import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { getProfile } from '@/lib/usage'
import BillingClient from './BillingClient'

export default async function BillingPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const profile = await getProfile(userId)
  if (!profile) redirect('/dashboard')

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white mb-2">Billing</h1>
        <p className="text-gray-400">Manage your subscription and payment details.</p>
      </div>

      <BillingClient profile={profile} />
    </div>
  )
}
