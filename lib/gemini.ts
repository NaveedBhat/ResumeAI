import { GoogleGenerativeAI } from '@google/generative-ai'
import Groq from 'groq-sdk'

export type ReviewResult = {
  overall_score: number
  relevance_score: number
  keywords_score: number
  formatting_score: number
  experience_score: number
  strengths: string[]
  improvements: string[]
  missing_keywords: string[]
}

export async function analyzeResume(
  resumeText: string,
  jobDescription: string
): Promise<ReviewResult> {
  // Lazy init to avoid build-time errors
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not set')
  }

  const genAI = new GoogleGenerativeAI(apiKey)
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

  const prompt = `You are an expert ATS (Applicant Tracking System) and career coach. Analyze the following resume against the job description and provide a detailed, honest assessment.

RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}

Respond with ONLY a valid JSON object (no markdown, no code blocks, just raw JSON) in this exact format:
{
  "overall_score": <integer 0-100>,
  "relevance_score": <integer 0-100, how relevant the resume is to this specific job>,
  "keywords_score": <integer 0-100, how many important keywords from the JD appear in the resume>,
  "formatting_score": <integer 0-100, how well-structured and readable the resume is>,
  "experience_score": <integer 0-100, how well the experience matches the requirements>,
  "strengths": [<array of 3-5 specific strength strings>],
  "improvements": [<array of 3-5 specific actionable improvement strings>],
  "missing_keywords": [<array of 5-10 important keywords from the JD missing from resume>]
}

Be specific and constructive. Scores should reflect honest assessment, not flattery.`

  let text = ''

  try {
    const result = await model.generateContent(prompt)
    text = result.response.text().trim()
  } catch (error) {
    console.error('Gemini failed, falling back to Groq:', error)
    const groqApiKey = process.env.GROQ_API_KEY
    if (!groqApiKey) {
      throw new Error(
        'AI analysis unavailable. Gemini failed and no Groq fallback key is configured.'
      )
    }

    const groq = new Groq({ apiKey: groqApiKey })
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.2,
    })

    text = chatCompletion.choices[0]?.message?.content?.trim() || ''
  }

  if (!text) {
    throw new Error('AI returned an empty response. Please try again.')
  }

  // Strip markdown code blocks if present
  const jsonText = text
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim()

  let parsed: ReviewResult
  try {
    parsed = JSON.parse(jsonText) as ReviewResult
  } catch {
    console.error('Failed to parse AI response as JSON:', jsonText.slice(0, 200))
    throw new Error('AI returned an unexpected format. Please try again.')
  }

  // Clamp all scores to 0-100 range
  const clamp = (n: number) => Math.min(100, Math.max(0, Math.round(n)))

  return {
    overall_score: clamp(parsed.overall_score),
    relevance_score: clamp(parsed.relevance_score),
    keywords_score: clamp(parsed.keywords_score),
    formatting_score: clamp(parsed.formatting_score),
    experience_score: clamp(parsed.experience_score),
    strengths: Array.isArray(parsed.strengths) ? parsed.strengths.slice(0, 5) : [],
    improvements: Array.isArray(parsed.improvements) ? parsed.improvements.slice(0, 5) : [],
    missing_keywords: Array.isArray(parsed.missing_keywords) ? parsed.missing_keywords.slice(0, 10) : [],
  }
}
