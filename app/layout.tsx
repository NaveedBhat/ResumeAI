import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'

export const metadata: Metadata = {
  title: 'ResumeAI — AI-Powered Resume Reviewer',
  description:
    'Get your resume scored by AI in 30 seconds. Instant feedback on relevance, keywords, formatting, and experience match. Land your dream job faster.',
  keywords: ['resume review', 'AI resume', 'ATS optimization', 'job application', 'career'],
  openGraph: {
    title: 'ResumeAI — AI-Powered Resume Reviewer',
    description: 'Get your resume scored by AI in 30 seconds.',
    type: 'website',
  },
  manifest: '/site.webmanifest',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en" className="dark">
        <body className="min-h-screen antialiased">
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
