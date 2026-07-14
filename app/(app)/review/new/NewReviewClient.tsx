'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Upload, FileText, Loader2, AlertCircle, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function NewReviewClient() {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)

  const [resumeText, setResumeText] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [jobTitle, setJobTitle] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [fileName, setFileName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [inputMode, setInputMode] = useState<'paste' | 'upload'>('paste')
  const [dragging, setDragging] = useState(false)

  const handleFile = async (file: File) => {
    if (!file) return
    if (file.type !== 'application/pdf' && !file.type.includes('text')) {
      setError('Please upload a PDF or text file.')
      return
    }

    setFileName(file.name)
    setError('')

    if (file.type.includes('text') || file.name.endsWith('.txt')) {
      const text = await file.text()
      setResumeText(text)
      return
    }

    // For PDF: send to server to parse
    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/parse-pdf', { method: 'POST', body: formData })
      const data = await res.json()
      if (data.text) {
        setResumeText(data.text)
      } else {
        setError(data.error || 'Failed to extract text from PDF. Please paste it manually.')
      }
    } catch {
      setError('Failed to parse PDF. Please paste your resume text instead.')
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!resumeText.trim() || resumeText.trim().length < 100) {
      setError('Please provide a resume with at least 100 characters.')
      return
    }
    if (!jobDescription.trim() || jobDescription.trim().length < 50) {
      setError('Please provide a job description with at least 50 characters.')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText: resumeText.trim(),
          jobDescription: jobDescription.trim(),
          jobTitle: jobTitle.trim() || null,
          companyName: companyName.trim() || null,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        if (res.status === 429) {
          setError(data.error + ' Upgrade to Pro for unlimited reviews.')
        } else {
          setError(data.error || 'Something went wrong. Please try again.')
        }
        return
      }

      router.push(`/review/${data.id}`)
    } catch {
      setError('Network error. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white mb-2">New Review</h1>
        <p className="text-gray-400">Paste your resume and a job description to get an instant AI analysis.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Optional metadata */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Job Title <span className="text-gray-500">(optional)</span></label>
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="e.g. Senior Software Engineer"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Company <span className="text-gray-500">(optional)</span></label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g. Stripe"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
        </div>

        {/* Resume Input */}
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <label className="text-sm font-semibold text-white">Your Resume *</label>
            <div className="flex gap-1 p-0.5 bg-white/5 rounded-lg">
              {(['paste', 'upload'] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setInputMode(mode)}
                  className={cn(
                    'px-3 py-1 rounded-md text-xs font-medium transition-all capitalize',
                    inputMode === mode
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-400 hover:text-white'
                  )}
                >
                  {mode === 'paste' ? 'Paste text' : 'Upload PDF'}
                </button>
              ))}
            </div>
          </div>

          {inputMode === 'paste' ? (
            <textarea
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste your full resume text here..."
              rows={12}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 text-sm resize-none focus:outline-none focus:border-indigo-500 transition-colors font-mono"
            />
          ) : (
            <div>
              <div
                onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileRef.current?.click()}
                className={cn(
                  'border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-200',
                  dragging
                    ? 'border-indigo-500 bg-indigo-500/10'
                    : 'border-white/10 hover:border-indigo-500/50 hover:bg-white/5'
                )}
              >
                <input
                  ref={fileRef}
                  type="file"
                  accept=".pdf,.txt"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                />
                {fileName ? (
                  <div className="flex flex-col items-center gap-2">
                    <FileText className="w-10 h-10 text-emerald-400" />
                    <span className="text-emerald-400 font-semibold">{fileName}</span>
                    <span className="text-gray-500 text-sm">File loaded. Click to change.</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <Upload className="w-10 h-10 text-gray-500" />
                    <div>
                      <span className="text-white font-medium">Drop your PDF here</span>
                      <span className="text-gray-400"> or click to browse</span>
                    </div>
                    <span className="text-gray-500 text-sm">PDF or TXT, up to 5MB</span>
                  </div>
                )}
              </div>
              {resumeText && (
                <div className="mt-2 flex items-center gap-2 text-xs text-emerald-400">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  {resumeText.length.toLocaleString()} characters extracted
                </div>
              )}
            </div>
          )}
        </div>

        {/* Job Description */}
        <div className="glass rounded-2xl p-6">
          <label className="block text-sm font-semibold text-white mb-4">Job Description *</label>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the full job description here. Include requirements, responsibilities, and preferred qualifications for best results..."
            rows={10}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 text-sm resize-none focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold rounded-xl text-base transition-all duration-200 hover:shadow-xl hover:shadow-indigo-600/25"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Analyzing your resume...
            </>
          ) : (
            <>
              <Zap className="w-5 h-5" />
              Analyze Resume
            </>
          )}
        </button>
      </form>
    </div>
  )
}
