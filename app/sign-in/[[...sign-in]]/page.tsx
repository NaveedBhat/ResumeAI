import { SignIn } from '@clerk/nextjs'
import { Brain } from 'lucide-react'
import Link from 'next/link'

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#050812' }}>
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-1/4 w-64 h-64 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-black text-white">Resume<span className="gradient-text">AI</span></span>
          </Link>
          <h1 className="text-3xl font-black text-white mb-2">Welcome back</h1>
          <p className="text-gray-400">Sign in to continue reviewing your resume</p>
        </div>

        <SignIn
          path="/sign-in"
          fallbackRedirectUrl="/dashboard"
          appearance={{
            elements: {
              rootBox: 'w-full',
              card: 'bg-transparent shadow-none border-0 p-0',
              headerTitle: 'hidden',
              headerSubtitle: 'hidden',
              socialButtonsBlockButton: 'bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors',
              socialButtonsBlockButtonText: 'text-white',
              dividerLine: 'bg-white/10',
              dividerText: 'text-gray-500',
              formFieldLabel: 'text-gray-300 text-sm font-medium',
              formFieldInput: 'bg-white/5 border-white/10 text-white placeholder-gray-500 rounded-xl focus:border-indigo-500 focus:ring-indigo-500/20',
              formButtonPrimary: 'bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl py-3 transition-all hover:shadow-lg hover:shadow-indigo-600/30',
              footerActionLink: 'text-indigo-400 hover:text-indigo-300',
              formFieldInputShowPasswordButton: 'text-gray-400',
              identityPreviewText: 'text-gray-300',
              identityPreviewEditButtonIcon: 'text-gray-400',
            },
          }}
        />
      </div>
    </div>
  )
}
