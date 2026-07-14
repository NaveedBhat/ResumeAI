import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { analyzeResume } from '@/lib/gemini'
import { supabaseAdmin } from '@/lib/supabase'
import { checkAndIncrementUsage, getOrCreateProfile, getProfile } from '@/lib/usage'
import { currentUser } from '@clerk/nextjs/server'

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { resumeText, jobDescription, jobTitle, companyName } = body

    if (!resumeText || typeof resumeText !== 'string' || resumeText.trim().length < 100) {
      return NextResponse.json({ error: 'Resume text is too short.' }, { status: 400 })
    }
    if (!jobDescription || typeof jobDescription !== 'string' || jobDescription.trim().length < 50) {
      return NextResponse.json({ error: 'Job description is too short.' }, { status: 400 })
    }

    // Ensure profile exists
    const clerkUser = await currentUser()
    let profileId: string | null = null
    if (clerkUser) {
      const profile = await getOrCreateProfile(
        userId,
        clerkUser.emailAddresses[0]?.emailAddress ?? '',
        clerkUser.fullName
      )
      profileId = profile.id
    } else {
      const profile = await getProfile(userId)
      if (profile) profileId = profile.id
    }

    if (!profileId) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 400 })
    }

    // Check usage limit
    const usage = await checkAndIncrementUsage(userId)
    if (!usage.allowed) {
      return NextResponse.json(
        {
          error: `Daily limit reached. Free tier allows ${usage.limit} reviews per day.`,
          upgradeUrl: '/billing',
        },
        { status: 429 }
      )
    }

    // Call Gemini AI
    const result = await analyzeResume(resumeText.trim(), jobDescription.trim())

    // Save to Supabase
    const { data: review, error: dbError } = await supabaseAdmin
      .from('reviews')
      .insert({
        user_id: profileId,
        resume_text: resumeText.trim(),
        job_description: jobDescription.trim(),
        job_title: jobTitle ?? null,
        company_name: companyName ?? null,
        overall_score: result.overall_score,
        relevance_score: result.relevance_score,
        keywords_score: result.keywords_score,
        formatting_score: result.formatting_score,
        experience_score: result.experience_score,
        strengths: result.strengths,
        improvements: result.improvements,
        missing_keywords: result.missing_keywords,
      })
      .select('id')
      .single()

    if (dbError || !review) {
      console.error('DB error:', dbError)
      return NextResponse.json({ error: 'Failed to save review.' }, { status: 500 })
    }

    return NextResponse.json({ id: review.id, ...result })
  } catch (err) {
    console.error('Review API error:', err)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
