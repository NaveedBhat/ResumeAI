import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import NewReviewClient from './NewReviewClient'

export default async function NewReviewPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  return <NewReviewClient />
}
