import Link from 'next/link'
import { Brain } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#050812' }}>
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 flex items-center justify-center mx-auto mb-6">
          <Brain className="w-8 h-8 text-indigo-400" />
        </div>
        <h1 className="text-6xl font-black text-white mb-4">404</h1>
        <p className="text-gray-400 text-lg mb-8">This page doesn&apos;t exist.</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-all"
        >
          Go home
        </Link>
      </div>
    </div>
  )
}
