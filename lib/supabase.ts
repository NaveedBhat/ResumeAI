import { createClient, SupabaseClient } from '@supabase/supabase-js'

// ============================================================
// TYPE DEFINITIONS
// ============================================================

export type Profile = {
  id: string
  clerk_user_id: string
  email: string
  full_name: string | null
  tier: 'free' | 'pro'
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  usage_today: number
  last_reset_date: string
  created_at: string
  updated_at: string
}

export type Review = {
  id: string
  user_id: string
  resume_text: string
  job_description: string
  job_title: string | null
  company_name: string | null
  overall_score: number
  relevance_score: number
  keywords_score: number
  formatting_score: number
  experience_score: number
  strengths: string[]
  improvements: string[]
  missing_keywords: string[]
  created_at: string
}

// ============================================================
// LAZY CLIENTS — avoid build-time env var errors
// ============================================================

let _supabase: SupabaseClient | null = null
let _supabaseAdmin: SupabaseClient | null = null

function getSupabase(): SupabaseClient {
  if (!_supabase) {
    _supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  }
  return _supabase
}

function getSupabaseAdmin(): SupabaseClient {
  if (!_supabaseAdmin) {
    _supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    )
  }
  return _supabaseAdmin
}

// Proxy objects for ergonomic use: supabase.from('...') etc.
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const client = getSupabase()
    const value = client[prop as keyof SupabaseClient]
    if (typeof value === 'function') {
      return value.bind(client)
    }
    return value
  },
})

export const supabaseAdmin = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const client = getSupabaseAdmin()
    const value = client[prop as keyof SupabaseClient]
    if (typeof value === 'function') {
      return value.bind(client)
    }
    return value
  },
})
