import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'File must be a PDF' }, { status: 400 })
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large (max 5MB)' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Require pdf-parse (CommonJS module — must use require)
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const pdfParseModule = require('pdf-parse')
    const pdfParse = pdfParseModule.default || pdfParseModule
    const data = await pdfParse(buffer)

    const text = data.text?.trim()
    if (!text || text.length < 50) {
      return NextResponse.json(
        { error: 'Could not extract text from PDF. Please paste your resume instead.' },
        { status: 422 }
      )
    }

    return NextResponse.json({ text })
  } catch (err) {
    console.error('PDF parse error:', err)
    return NextResponse.json(
      { error: 'Failed to parse PDF. Please paste your resume text.' },
      { status: 500 }
    )
  }
}
