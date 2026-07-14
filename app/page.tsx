import Link from 'next/link'
import Image from 'next/image'
import {
  FileText,
  Zap,
  TrendingUp,
  Shield,
  CheckCircle,
  Star,
  ArrowRight,
  Brain,
  Target,
  BarChart3,
} from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen gradient-bg" style={{ background: '#050812' }}>
      {/* ── NAV ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5" style={{ background: 'rgba(5,8,18,0.85)', backdropFilter: 'blur(20px)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image src="/brand/resumeailogo.webp" alt="ResumeAI Logo" width={32} height={32} className="rounded-lg" />
            <span className="text-xl font-bold text-white">Resume<span className="gradient-text">AI</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-gray-400 hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm text-gray-400 hover:text-white transition-colors">How it works</a>
            <a href="#pricing" className="text-sm text-gray-400 hover:text-white transition-colors">Pricing</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/sign-in" className="text-sm text-gray-400 hover:text-white transition-colors px-4 py-2">
              Sign in
            </Link>
            <Link
              href="/sign-up"
              className="text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-indigo-600/25"
            >
              Get started free
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-40 right-1/4 w-64 h-64 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-sm font-medium mb-8 animate-fade-in-up">
            <Zap className="w-3.5 h-3.5" />
            AI-powered. ATS-optimized. Instant results.
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-tight tracking-tight mb-6 animate-fade-in-up animate-fade-in-up-delay-1">
            Get your resume{' '}
            <span className="gradient-text">scored by AI</span>{' '}
            in 30 seconds
          </h1>

          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up animate-fade-in-up-delay-2">
            Upload your resume, paste a job description, and get instant AI feedback on relevance,
            keywords, formatting, and experience match — before you hit send.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animate-fade-in-up-delay-3">
            <Link
              href="/sign-up"
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-lg transition-all duration-200 hover:shadow-2xl hover:shadow-indigo-600/30 hover:-translate-y-0.5"
            >
              Analyze my resume free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/10 hover:border-white/20 text-white font-semibold rounded-xl text-lg transition-all duration-200 hover:bg-white/5"
            >
              See how it works
            </a>
          </div>

          {/* Social proof */}
          <div className="mt-12 flex items-center justify-center gap-6 animate-fade-in-up animate-fade-in-up-delay-4">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-gray-800" style={{ background: `hsl(${i * 60}, 60%, 50%)` }} />
              ))}
            </div>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <span className="text-gray-400 text-sm">Loved by <span className="text-white font-semibold">2,000+</span> job seekers</span>
          </div>
        </div>

        {/* Hero preview card */}
        <div className="max-w-2xl mx-auto mt-20 glass rounded-2xl p-6 glow">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <div className="font-semibold text-white">Resume Analysis Complete</div>
              <div className="text-sm text-gray-400">Software Engineer at Stripe</div>
            </div>
            <div className="ml-auto text-right">
              <div className="text-3xl font-black text-emerald-400">82</div>
              <div className="text-xs text-gray-400">Overall Score</div>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: 'Relevance', score: 88, color: 'bg-emerald-500' },
              { label: 'Keywords', score: 75, color: 'bg-yellow-500' },
              { label: 'Formatting', score: 90, color: 'bg-emerald-500' },
              { label: 'Experience', score: 82, color: 'bg-emerald-500' },
            ].map((item) => (
              <div key={item.label} className="bg-white/5 rounded-xl p-3 text-center">
                <div className="text-xl font-bold text-white mb-1">{item.score}</div>
                <div className="w-full bg-white/10 rounded-full h-1.5 mb-2">
                  <div className={`h-1.5 rounded-full ${item.color}`} style={{ width: `${item.score}%` }} />
                </div>
                <div className="text-xs text-gray-400">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-white mb-4">
              Everything you need to <span className="gradient-text">land the job</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Our AI analyzes your resume against real job descriptions using the same logic as ATS systems.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: <Brain className="w-6 h-6 text-indigo-400" />,
                title: 'AI-Powered Scoring',
                desc: 'Gemini AI scores your resume 0–100 across 4 dimensions: relevance, keywords, formatting, and experience match.',
              },
              {
                icon: <Target className="w-6 h-6 text-violet-400" />,
                title: 'Job-Specific Analysis',
                desc: 'Paste any job description and get targeted feedback — missing keywords, gaps, and exactly what to add.',
              },
              {
                icon: <BarChart3 className="w-6 h-6 text-sky-400" />,
                title: 'Review History',
                desc: 'All your past reviews saved. Track your improvement over time as you refine your resume.',
              },
              {
                icon: <Zap className="w-6 h-6 text-yellow-400" />,
                title: 'Instant Results',
                desc: 'No waiting. Get your full analysis in under 30 seconds, ready to act on immediately.',
              },
              {
                icon: <TrendingUp className="w-6 h-6 text-emerald-400" />,
                title: 'Actionable Improvements',
                desc: 'Specific, ranked suggestions — not generic advice. Know exactly what to fix and why.',
              },
              {
                icon: <Shield className="w-6 h-6 text-red-400" />,
                title: 'ATS-Compatible',
                desc: 'We analyze the same keyword signals ATS systems check, so you rank higher in applicant pools.',
              },
            ].map((f) => (
              <div key={f.title} className="glass rounded-2xl p-6 hover:border-white/10 transition-all duration-300 hover:-translate-y-1">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-4">
                  {f.icon}
                </div>
                <h3 className="font-bold text-white text-lg mb-2">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8" style={{ background: 'rgba(99,102,241,0.03)' }}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-black text-white mb-4">
            Three steps to a <span className="gradient-text">stronger resume</span>
          </h2>
          <p className="text-gray-400 text-lg mb-16">No fluff, no complex setup. Just results.</p>

          <div className="space-y-8">
            {[
              {
                step: '01',
                title: 'Paste your resume',
                desc: 'Upload a PDF or paste your resume text directly. We extract the content automatically.',
              },
              {
                step: '02',
                title: 'Add the job description',
                desc: 'Paste the job description from any listing — LinkedIn, Indeed, company site, anywhere.',
              },
              {
                step: '03',
                title: 'Get your AI report',
                desc: 'Receive a detailed score breakdown with specific improvements ranked by impact.',
              },
            ].map((step, i) => (
              <div key={step.step} className="flex items-start gap-6 glass rounded-2xl p-6 text-left">
                <div className="text-6xl font-black text-white/5 flex-shrink-0 leading-none">{step.step}</div>
                <div>
                  <h3 className="font-bold text-white text-xl mb-2">{step.title}</h3>
                  <p className="text-gray-400">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-white mb-4">
              Simple, <span className="gradient-text">transparent</span> pricing
            </h2>
            <p className="text-gray-400 text-lg">Start free. Upgrade when you need more.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Free */}
            <div className="glass rounded-2xl p-8 relative">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-1">Starter</h3>
                <div className="text-4xl font-black text-white mb-1">Free</div>
                <div className="text-gray-400 text-sm">3 reviews per day, forever</div>
              </div>
              <ul className="space-y-3 mb-8">
                {[
                  '3 resume reviews per day',
                  'Full AI score breakdown',
                  'Keyword gap analysis',
                  'Actionable suggestions',
                  'Review history (30 days)',
                ].map((f) => (
                  <li key={f} className="flex items-center gap-3 text-gray-300 text-sm">
                    <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/sign-up"
                className="block w-full text-center py-3 rounded-xl border border-white/10 hover:border-white/20 text-white font-semibold transition-all hover:bg-white/5"
              >
                Get started free
              </Link>
            </div>

            {/* Pro */}
            <div className="relative rounded-2xl p-8 pulse-glow" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(167,139,250,0.1))', border: '1px solid rgba(99,102,241,0.4)' }}>
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-indigo-600 rounded-full text-white text-xs font-bold tracking-wide">
                MOST POPULAR
              </div>
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-1">Pro</h3>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-4xl font-black text-white">$19</span>
                  <span className="text-gray-400">/month</span>
                </div>
                <div className="text-gray-400 text-sm">Unlimited reviews, all features</div>
              </div>
              <ul className="space-y-3 mb-8">
                {[
                  'Unlimited resume reviews',
                  'Everything in Starter',
                  'PDF export of reports',
                  'Priority AI processing',
                  'Unlimited review history',
                  'Cancel anytime',
                ].map((f) => (
                  <li key={f} className="flex items-center gap-3 text-gray-300 text-sm">
                    <CheckCircle className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/sign-up"
                className="block w-full text-center py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all duration-200 hover:shadow-lg hover:shadow-indigo-600/30"
              >
                Start with Pro
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center glass rounded-3xl p-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 to-violet-600/10 pointer-events-none" />
          <h2 className="text-4xl font-black text-white mb-4 relative">
            Ready to land your <span className="gradient-text">dream job?</span>
          </h2>
          <p className="text-gray-400 text-lg mb-8 relative">
            Join thousands of job seekers who use ResumeAI to stand out.
          </p>
          <Link
            href="/sign-up"
            className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-lg transition-all duration-200 hover:shadow-2xl hover:shadow-indigo-600/30 hover:-translate-y-0.5 relative"
          >
            Analyze my resume — it&apos;s free
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/5 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Image src="/brand/resumeailogo.webp" alt="ResumeAI Logo" width={24} height={24} className="rounded-md" />
            <span className="font-bold text-white">Resume<span className="gradient-text">AI</span></span>
          </div>
          <div className="text-gray-500 text-sm">
            © {new Date().getFullYear()} ResumeAI. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="text-gray-500 hover:text-white text-sm transition-colors">Privacy</a>
            <a href="#" className="text-gray-500 hover:text-white text-sm transition-colors">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
