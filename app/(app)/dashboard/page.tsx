import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getOrCreateProfile, getProfile, FREE_TIER_DAILY_LIMIT } from '@/lib/usage'
import { supabaseAdmin } from '@/lib/supabase'
import { Review } from '@/lib/supabase'
import {
  Plus,
  FileText,
  TrendingUp,
  Zap,
  Clock,
  ChevronRight,
} from 'lucide-react'
import { getScoreColor, getScoreBg, formatDate } from '@/lib/utils'

export default async function DashboardPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const clerkUser = await currentUser()
  if (!clerkUser) redirect('/sign-in')

  // Ensure profile exists
  const profile = await getOrCreateProfile(
    userId,
    clerkUser.emailAddresses[0]?.emailAddress ?? '',
    clerkUser.fullName
  )

  // Fetch reviews
  const { data: reviews } = await supabaseAdmin
    .from('reviews')
    .select('*')
    .eq('user_id', profile.id)
    .order('created_at', { ascending: false })
    .limit(20)

  const reviewList = (reviews ?? []) as Review[]
  const avgScore = reviewList.length
    ? Math.round(reviewList.reduce((sum, r) => sum + r.overall_score, 0) / reviewList.length)
    : 0

  const usagePercent = profile.tier === 'free'
    ? Math.min((profile.usage_today / FREE_TIER_DAILY_LIMIT) * 100, 100)
    : 0

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-white mb-1">
            Welcome back, {clerkUser.firstName ?? 'there'} 👋
          </h1>
          <p className="text-gray-400">Here&apos;s your resume review overview</p>
        </div>
        <Link
          href="/review/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-indigo-600/25 text-sm"
        >
          <Plus className="w-4 h-4" />
          New Review
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="glass rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/20 flex items-center justify-center">
              <FileText className="w-4 h-4 text-indigo-400" />
            </div>
            <span className="text-sm text-gray-400 font-medium">Total Reviews</span>
          </div>
          <div className="text-3xl font-black text-white">{reviewList.length}</div>
        </div>

        <div className="glass rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600/20 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="text-sm text-gray-400 font-medium">Avg. Score</span>
          </div>
          <div className={`text-3xl font-black ${avgScore ? getScoreColor(avgScore) : 'text-white'}`}>
            {avgScore || '—'}
          </div>
        </div>

        <div className="glass rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-violet-600/20 flex items-center justify-center">
              <Zap className="w-4 h-4 text-violet-400" />
            </div>
            <span className="text-sm text-gray-400 font-medium">Plan</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`text-xl font-black ${profile.tier === 'pro' ? 'gradient-text' : 'text-white'}`}>
              {profile.tier === 'pro' ? 'Pro' : 'Starter'}
            </div>
            {profile.tier === 'free' && (
              <Link href="/billing" className="text-xs text-indigo-400 hover:text-indigo-300 font-medium">
                Upgrade →
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Usage bar (free tier only) */}
      {profile.tier === 'free' && (
        <div className="glass rounded-2xl p-5 mb-8 flex items-center gap-4">
          <Clock className="w-5 h-5 text-gray-400 flex-shrink-0" />
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm text-gray-300 font-medium">Daily usage</span>
              <span className="text-sm text-gray-400">
                {profile.usage_today} / {FREE_TIER_DAILY_LIMIT} reviews used
              </span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <div
                className="h-2 rounded-full bg-indigo-500 transition-all duration-500"
                style={{ width: `${usagePercent}%` }}
              />
            </div>
          </div>
          {profile.usage_today >= FREE_TIER_DAILY_LIMIT && (
            <Link
              href="/billing"
              className="text-xs font-semibold px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors whitespace-nowrap"
            >
              Upgrade for unlimited
            </Link>
          )}
        </div>
      )}

      {/* Reviews list */}
      <div>
        <h2 className="text-lg font-bold text-white mb-4">Recent Reviews</h2>

        {reviewList.length === 0 ? (
          <div className="glass rounded-2xl p-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-indigo-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No reviews yet</h3>
            <p className="text-gray-400 mb-6">Start by analyzing your resume against a job description.</p>
            <Link
              href="/review/new"
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-all"
            >
              <Plus className="w-4 h-4" />
              Create your first review
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {reviewList.map((review) => (
              <Link
                key={review.id}
                href={`/review/${review.id}`}
                className="glass rounded-2xl p-5 flex items-center gap-4 hover:border-white/10 transition-all duration-200 hover:-translate-y-0.5 group block"
              >
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
                  <div className={`text-xl font-black ${getScoreColor(review.overall_score)}`}>
                    {review.overall_score}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-white truncate">
                    {review.job_title || 'Resume Review'}{review.company_name ? ` at ${review.company_name}` : ''}
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <div className="w-24 bg-white/10 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full ${getScoreBg(review.overall_score)}`}
                        style={{ width: `${review.overall_score}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500">{formatDate(review.created_at)}</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-gray-400 transition-colors flex-shrink-0" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
