'use client'

import { useState } from 'react'
import { Profile } from '@/lib/supabase'
import { Crown, CheckCircle, Loader2, ExternalLink, CreditCard, Zap } from 'lucide-react'

export default function BillingClient({ profile }: { profile: Profile }) {
  const [loadingCheckout, setLoadingCheckout] = useState(false)
  const [loadingPortal, setLoadingPortal] = useState(false)
  const [error, setError] = useState('')

  const isPro = profile.tier === 'pro'

  const handleUpgrade = async () => {
    setError('')
    setLoadingCheckout(true)
    try {
      const res = await fetch('/api/stripe/checkout', { method: 'POST' })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setError(data.error || 'Failed to start checkout.')
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoadingCheckout(false)
    }
  }

  const handleManage = async () => {
    setError('')
    setLoadingPortal(true)
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setError(data.error || 'Failed to open billing portal.')
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoadingPortal(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Current Plan */}
      <div className="glass rounded-2xl p-6">
        <h2 className="text-lg font-bold text-white mb-5">Current Plan</h2>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isPro ? 'bg-indigo-600/20 border border-indigo-500/30' : 'bg-white/5 border border-white/10'}`}>
              {isPro ? <Crown className="w-6 h-6 text-yellow-400" /> : <Zap className="w-6 h-6 text-gray-400" />}
            </div>
            <div>
              <div className="font-bold text-white text-lg">{isPro ? 'Pro' : 'Starter'}</div>
              <div className="text-gray-400 text-sm">
                {isPro ? '$19 / month · Unlimited reviews' : 'Free · 3 reviews per day'}
              </div>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-bold ${isPro ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/10 text-gray-300'}`}>
            {isPro ? 'ACTIVE' : 'FREE'}
          </div>
        </div>
      </div>

      {/* Plan Comparison */}
      {!isPro && (
        <div className="grid md:grid-cols-2 gap-4">
          {/* Free */}
          <div className="glass rounded-2xl p-6">
            <div className="font-bold text-white mb-4">Starter (Current)</div>
            <ul className="space-y-2">
              {['3 reviews per day', 'Full AI analysis', 'Keyword gap report', '30-day history'].map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-gray-400">
                  <CheckCircle className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* Pro */}
          <div className="rounded-2xl p-6 relative" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(167,139,250,0.1))', border: '1px solid rgba(99,102,241,0.35)' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="font-bold text-white">Pro</div>
              <div className="text-sm text-gray-400"><span className="text-2xl font-black text-white">$19</span>/mo</div>
            </div>
            <ul className="space-y-2 mb-6">
              {['Unlimited reviews', 'Everything in Starter', 'PDF export', 'Priority processing', 'Unlimited history'].map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-gray-300">
                  <CheckCircle className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <button
              onClick={handleUpgrade}
              disabled={loadingCheckout}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2"
            >
              {loadingCheckout ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Starting checkout...</>
              ) : (
                <><Crown className="w-4 h-4" /> Upgrade to Pro</>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Manage subscription (Pro users) */}
      {isPro && (
        <div className="glass rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-2">Manage Subscription</h2>
          <p className="text-gray-400 text-sm mb-5">
            Update your payment method, view invoices, or cancel your subscription via the billing portal.
          </p>
          <button
            onClick={handleManage}
            disabled={loadingPortal}
            className="inline-flex items-center gap-2 px-5 py-2.5 border border-white/10 hover:border-white/20 text-white font-semibold rounded-xl transition-all text-sm hover:bg-white/5 disabled:opacity-60"
          >
            {loadingPortal ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Opening portal...</>
            ) : (
              <><CreditCard className="w-4 h-4" /> Open Billing Portal <ExternalLink className="w-3 h-3" /></>
            )}
          </button>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm">
          {error}
        </div>
      )}

      {/* Test mode notice — only visible in development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
          <div className="flex items-center gap-2 text-yellow-300 text-sm font-medium mb-1">
            <span>🧪</span> Test Mode Active
          </div>
          <p className="text-yellow-200/70 text-xs">
            Use card <code className="bg-yellow-500/20 px-1 rounded">4242 4242 4242 4242</code>, any future expiry, and any CVC to test payments. No real charges will be made.
          </p>
        </div>
      )}
    </div>
  )
}
