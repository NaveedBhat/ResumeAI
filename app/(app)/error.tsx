'use client'

import { useEffect } from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import Link from 'next/link'

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('App error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center p-8" style={{ background: '#050812' }}>
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-8 h-8 text-red-400" />
        </div>
        <h1 className="text-2xl font-black text-white mb-2">Something went wrong</h1>
        <p className="text-gray-400 text-sm mb-8 leading-relaxed">
          An unexpected error occurred. Your data is safe — please try again.
        </p>
        <div className="flex items-center gap-3 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-all text-sm"
          >
            <RefreshCw className="w-4 h-4" />
            Try again
          </button>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-5 py-2.5 border border-white/10 hover:border-white/20 text-gray-300 hover:text-white font-semibold rounded-xl transition-all text-sm hover:bg-white/5"
          >
            <Home className="w-4 h-4" />
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
