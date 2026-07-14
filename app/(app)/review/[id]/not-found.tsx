import Link from 'next/link'
import { FileX, Plus } from 'lucide-react'

export default function ReviewNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8" style={{ background: '#050812' }}>
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center mx-auto mb-6">
          <FileX className="w-8 h-8 text-indigo-400" />
        </div>
        <h1 className="text-2xl font-black text-white mb-2">Review not found</h1>
        <p className="text-gray-400 text-sm mb-8 leading-relaxed">
          This review doesn&apos;t exist or you don&apos;t have access to it.
        </p>
        <div className="flex items-center gap-3 justify-center">
          <Link
            href="/review/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-all text-sm"
          >
            <Plus className="w-4 h-4" />
            New Review
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-5 py-2.5 border border-white/10 hover:border-white/20 text-gray-300 hover:text-white font-semibold rounded-xl transition-all text-sm hover:bg-white/5"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
