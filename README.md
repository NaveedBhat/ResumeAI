<div align="center">

<h1>ResumeAI</h1>

**AI Resume & Job Description Analyzer**

*Get your resume scored by AI in 30 seconds. Instant feedback on relevance, keywords, formatting, and experience match. Land your dream job faster.*

<br/>

[**🌐 ResumeAI Live!**](https://resumeai.vercel.app)

<br/>

![Status](https://img.shields.io/badge/Status-Active-brightgreen?style=flat-square)
![Platform](https://img.shields.io/badge/Platform-Vercel-black?style=flat-square)
![Frontend](https://img.shields.io/badge/Frontend-Next.js%20%7C%20TS%20%7C%20Tailwind-blue?style=flat-square)
![AI](https://img.shields.io/badge/AI-Gemini%202.0%20Flash-007EC6?style=flat-square)
![Fallback](https://img.shields.io/badge/Fallback-Groq%20Llama%203-8A2BE2?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-lightgrey?style=flat-square)
![Author](https://img.shields.io/badge/Author-Naveed%20Bhat-9932CC?style=flat-square)
![Last Updated](https://img.shields.io/badge/Last%20Updated-July%202026-007EC6?style=flat-square)

<br/>

![topic](https://img.shields.io/badge/topic-AI%2FML-8A2BE2?style=flat-square)
![topic](https://img.shields.io/badge/topic-Resume%20Optimizer-FF8C00?style=flat-square)
![topic](https://img.shields.io/badge/topic-LLM-007EC6?style=flat-square)
![topic](https://img.shields.io/badge/topic-SaaS-FF4500?style=flat-square)
![topic](https://img.shields.io/badge/topic-Career%20Tool-008080?style=flat-square)

</div>

---

## Overview

ResumeAI is a full-stack SaaS platform that empowers job seekers by providing instant, AI-driven feedback on their resumes against specific job descriptions.

## Features

- **AI Resume Analysis** — Upload or paste your resume + a job description and get a full AI-powered score breakdown in seconds
- **5 Score Categories** — Overall, Relevance, Keywords, Formatting, and Experience match (each 0–100)
- **Keyword Gap Report** — See exactly which keywords from the job description are missing from your resume
- **Strengths & Improvements** — Specific actionable suggestions, not generic feedback
- **PDF Upload** — Upload a PDF resume and text is extracted automatically
- **Free & Pro Tiers** — 3 reviews/day free, unlimited for Pro subscribers at $19/month
- **Review History** — All past reviews saved and accessible from the dashboard
- **Secure Auth** — Sign in with email, Google, or GitHub via Clerk
- **Dual AI Engine** — Powered by Google Gemini 2.0 Flash with automatic Groq fallback

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript |
| Auth | Clerk |
| Database | Supabase (PostgreSQL) |
| AI | Google Gemini 2.0 Flash + Groq fallback |
| Payments | Stripe (Checkout + Customer Portal) |
| Hosting | Vercel |
| PDF Parsing | pdf-parse |

---

## Getting Started

### Prerequisites

- Node.js 18+
- A Clerk account (clerk.com)
- A Supabase account (supabase.com)
- A Stripe account (stripe.com)
- A Google AI Studio API key (aistudio.google.com)

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/resumeai.git
cd resumeai
npm install
```

### 2. Set Up Supabase Database

In your Supabase project → SQL Editor → run the contents of `supabase/schema.sql`

### 3. Configure Environment Variables

```bash
cp .env.example .env
```

| Variable | Where to get it |
|----------|----------------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk Dashboard → API Keys |
| `CLERK_SECRET_KEY` | Clerk Dashboard → API Keys |
| `CLERK_WEBHOOK_SECRET` | Clerk Dashboard → Webhooks → Signing Secret |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Dashboard → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Dashboard → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Dashboard → Settings → API |
| `STRIPE_SECRET_KEY` | Stripe Dashboard → API Keys |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe Dashboard → API Keys |
| `STRIPE_WEBHOOK_SECRET` | `stripe listen` output or Stripe Webhooks Dashboard |
| `STRIPE_PRO_PRICE_ID` | Stripe Dashboard → Products → your Pro plan price ID |
| `GEMINI_API_KEY` | aistudio.google.com/app/apikey |
| `GROQ_API_KEY` | console.groq.com/keys |
| `NEXT_PUBLIC_APP_URL` | Your production URL e.g. https://resumeai.vercel.app |

### 4. Set Up Clerk Webhooks

Clerk Dashboard → Configure → Webhooks → Add Endpoint:
- **URL:** `https://your-domain.com/api/webhooks/clerk`
- **Events:** `user.created`, `user.updated`, `user.deleted`

### 5. Set Up Stripe

1. Create a Product with a $19/month recurring price → copy the Price ID into `STRIPE_PRO_PRICE_ID`
2. For local webhook testing:

```bash
brew install stripe/stripe-cli/stripe
stripe login
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Copy the `whsec_...` secret into `STRIPE_WEBHOOK_SECRET`.

### 6. Run Locally

```bash
npm run dev
```

Visit http://localhost:3000

---

## Project Structure

```
resumeai/
├── app/
│   ├── (app)/                  # Protected routes (requires auth)
│   │   ├── dashboard/          # Review history dashboard
│   │   ├── review/
│   │   │   ├── new/            # Submit new review form
│   │   │   └── [id]/           # View a specific review result
│   │   ├── billing/            # Subscription management
│   │   ├── error.tsx           # App-wide error boundary
│   │   └── loading.tsx         # Loading skeleton UI
│   ├── api/
│   │   ├── review/             # POST: analyze resume + save to DB
│   │   ├── parse-pdf/          # POST: extract text from PDF upload
│   │   ├── stripe/
│   │   │   ├── checkout/       # POST: create Stripe checkout session
│   │   │   └── portal/         # POST: open Stripe billing portal
│   │   └── webhooks/
│   │       ├── clerk/          # Sync Clerk users to Supabase profiles
│   │       └── stripe/         # Handle Stripe subscription events
│   ├── sign-in/                # Clerk sign in page
│   ├── sign-up/                # Clerk sign up page
│   └── page.tsx                # Public landing page
├── lib/
│   ├── gemini.ts               # AI analysis engine (Gemini + Groq fallback)
│   ├── supabase.ts             # Supabase client + TypeScript types
│   ├── stripe.ts               # Stripe client (lazy init)
│   ├── usage.ts                # Daily usage tracking + profile management
│   └── utils.ts                # Shared helper functions
├── supabase/
│   └── schema.sql              # Full database schema
└── proxy.ts                    # Clerk auth middleware
```

---

## How It Works

### Resume Analysis Flow
1. User submits resume text + job description
2. API validates input (minimum lengths enforced)
3. Profile is fetched or auto-created in Supabase
4. Daily usage limit is checked (3/day free, unlimited Pro)
5. Google Gemini 2.0 Flash analyzes the resume
6. If Gemini fails, Groq llama-3.3-70b-versatile is used as fallback
7. JSON response is parsed, scores clamped to 0–100
8. Result saved to Supabase → user redirected to /review/{id}

### Subscription Flow
1. User clicks "Upgrade to Pro" on the billing page
2. Stripe Checkout session created server-side
3. User completes payment on Stripe's hosted page
4. Stripe sends `checkout.session.completed` webhook
5. Webhook handler updates `profiles.tier = 'pro'` in Supabase
6. User now has unlimited reviews

---

## Deployment

1. Push to GitHub
2. Import the project in Vercel
3. Add all environment variables in Vercel project settings
4. Set up a production Stripe webhook: `https://your-domain.com/api/webhooks/stripe`
5. Deploy!

---

## License

MIT
