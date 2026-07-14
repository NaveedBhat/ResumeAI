import { auth } from '@clerk/nextjs/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { supabaseAdmin, Review } from '@/lib/supabase'
import { getProfile } from '@/lib/usage'
import { getScoreColor, getScoreBg, getScoreLabel, formatDate } from '@/lib/utils'
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Plus,
  Crown,
} from 'lucide-react'

function ScoreCircle({ score, size = 120 }: { score: number; size?: number }) {
  const radius = 45
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference
  const strokeColor = score >= 80 ? '#10b981' : score >= 60 ? '#eab308' : '#ef4444'

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 100 100" className="-rotate-90">
        <circle cx="50" cy="50" r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1.2s ease-out' }}
        />
      </svg>
      <div className="absolute text-center">
        <div className={`font-black ${getScoreColor(score)}`} style={{ fontSize: size * 0.24 }}>{score}</div>
        <div className="text-gray-500" style={{ fontSize: size * 0.1 }}>/ 100</div>
      </div>
    </div>
  )
}

function ScoreBar({ label, score }: { label: string; score: number }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-300 font-medium">{label}</span>
        <div className="flex items-center gap-2">
          <span className={`text-sm font-bold ${getScoreColor(score)}`}>{score}</span>
          <span className="text-xs text-gray-500">{getScoreLabel(score)}</span>
        </div>
      </div>
      <div className="w-full bg-white/10 rounded-full h-2">
        <div
          className={`h-2 rounded-full ${getScoreBg(score)} transition-all duration-1000`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  )
}

export default async function ReviewDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const { id } = await params

  const profile = await getProfile(userId)
  if (!profile) notFound()

  const { data: review, error } = await supabaseAdmin
    .from('reviews')
    .select('*')
    .eq('id', id)
    .eq('user_id', profile.id)
    .single()

  if (error || !review) notFound()

  const r = review as Review

  return (
    <div className="p-8 max-w-5xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
        <div className="w-px h-4 bg-white/10" />
        <span className="text-gray-500 text-sm">{formatDate(r.created_at)}</span>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-black text-white mb-1">
          {r.job_title || 'Resume Review'}
          {r.company_name && <span className="text-gray-400 font-normal"> at {r.company_name}</span>}
        </h1>
      </div>

      {/* Main score + breakdown */}
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Overall score */}
        <div className="glass rounded-2xl p-8 flex flex-col items-center justify-center text-center">
          <ScoreCircle score={r.overall_score} size={140} />
          <div className="mt-4">
            <div className={`text-lg font-bold ${getScoreColor(r.overall_score)}`}>
              {getScoreLabel(r.overall_score)}
            </div>
            <div className="text-gray-400 text-sm mt-1">Overall Score</div>
          </div>
        </div>

        {/* Score breakdown */}
        <div className="lg:col-span-2 glass rounded-2xl p-6 space-y-5">
          <h2 className="font-bold text-white text-lg mb-5">Score Breakdown</h2>
          <ScoreBar label="Job Relevance" score={r.relevance_score} />
          <ScoreBar label="Keyword Match" score={r.keywords_score} />
          <ScoreBar label="Formatting & Structure" score={r.formatting_score} />
          <ScoreBar label="Experience Match" score={r.experience_score} />
        </div>
      </div>

      {/* Insights grid */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {/* Strengths */}
        <div className="glass rounded-2xl p-6">
          <h3 className="font-bold text-white mb-4 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            Strengths
          </h3>
          <ul className="space-y-3">
            {(r.strengths as string[]).map((s, i) => (
              <li key={i} className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0 mt-1.5" />
                <span className="text-sm text-gray-300 leading-relaxed">{s}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Improvements */}
        <div className="glass rounded-2xl p-6">
          <h3 className="font-bold text-white mb-4 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-yellow-400" />
            Improvements
          </h3>
          <ul className="space-y-3">
            {(r.improvements as string[]).map((s, i) => (
              <li key={i} className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 flex-shrink-0 mt-1.5" />
                <span className="text-sm text-gray-300 leading-relaxed">{s}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Missing keywords */}
        <div className="glass rounded-2xl p-6">
          <h3 className="font-bold text-white mb-4 flex items-center gap-2">
            <XCircle className="w-4 h-4 text-red-400" />
            Missing Keywords
          </h3>
          <div className="flex flex-wrap gap-2">
            {(r.missing_keywords as string[]).map((kw, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-300 text-xs font-medium"
              >
                {kw}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <Link
          href="/review/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-all text-sm hover:shadow-lg hover:shadow-indigo-600/25"
        >
          <Plus className="w-4 h-4" />
          New Review
        </Link>
        <Link
          href="/billing"
          className="inline-flex items-center gap-2 px-5 py-2.5 border border-white/10 hover:border-white/20 text-gray-300 hover:text-white font-semibold rounded-xl transition-all text-sm hover:bg-white/5"
        >
          <Crown className="w-4 h-4 text-yellow-400" />
          Upgrade to Pro
        </Link>
      </div>
    </div>
  )
}
