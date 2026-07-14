import { supabaseAdmin, Profile } from './supabase'

const FREE_TIER_DAILY_LIMIT = 3

export async function getOrCreateProfile(
  clerkUserId: string,
  email: string,
  fullName?: string | null
): Promise<Profile> {
  // Try to get existing profile
  const { data: existing, error: fetchError } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .eq('clerk_user_id', clerkUserId)
    .single()

  if (existing && !fetchError) {
    return existing as Profile
  }

  // Create new profile
  const { data: created, error: createError } = await supabaseAdmin
    .from('profiles')
    .insert({
      clerk_user_id: clerkUserId,
      email,
      full_name: fullName ?? null,
      tier: 'free',
      usage_today: 0,
      last_reset_date: new Date().toISOString().split('T')[0],
    })
    .select()
    .single()

  if (createError || !created) {
    throw new Error(`Failed to create profile: ${createError?.message}`)
  }

  return created as Profile
}

export async function checkAndIncrementUsage(
  clerkUserId: string
): Promise<{ allowed: boolean; usageToday: number; limit: number; isPro: boolean }> {
  const { data: profile, error } = await supabaseAdmin
    .from('profiles')
    .select('tier, usage_today, last_reset_date')
    .eq('clerk_user_id', clerkUserId)
    .single()

  if (error || !profile) {
    throw new Error('Profile not found')
  }

  const today = new Date().toISOString().split('T')[0]
  const isPro = profile.tier === 'pro'

  // Reset counter if it's a new day
  if (profile.last_reset_date !== today) {
    await supabaseAdmin
      .from('profiles')
      .update({ usage_today: 0, last_reset_date: today })
      .eq('clerk_user_id', clerkUserId)
    profile.usage_today = 0
  }

  // Pro users have no limit
  if (isPro) {
    await supabaseAdmin
      .from('profiles')
      .update({ usage_today: profile.usage_today + 1 })
      .eq('clerk_user_id', clerkUserId)
    return { allowed: true, usageToday: profile.usage_today + 1, limit: Infinity, isPro: true }
  }

  // Free tier check
  if (profile.usage_today >= FREE_TIER_DAILY_LIMIT) {
    return {
      allowed: false,
      usageToday: profile.usage_today,
      limit: FREE_TIER_DAILY_LIMIT,
      isPro: false,
    }
  }

  // Increment usage
  await supabaseAdmin
    .from('profiles')
    .update({ usage_today: profile.usage_today + 1 })
    .eq('clerk_user_id', clerkUserId)

  return {
    allowed: true,
    usageToday: profile.usage_today + 1,
    limit: FREE_TIER_DAILY_LIMIT,
    isPro: false,
  }
}

export async function getProfile(clerkUserId: string): Promise<Profile | null> {
  const { data, error } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .eq('clerk_user_id', clerkUserId)
    .single()

  if (error) return null
  return data as Profile
}

export { FREE_TIER_DAILY_LIMIT }
