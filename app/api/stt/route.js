import { GoogleGenerativeAI } from "@google/generative-ai"

export const maxDuration = 30

/**
 * Speech-to-Text API Route
 * Uses Google Gemini's multimodal capabilities to transcribe audio
 */
export async function POST(req) {
  try {
    const formData = await req.formData()
    const audioFile = formData.get('audio')

    if (!audioFile) {
      return Response.json({ error: "Audio file is required" }, { status: 400 })
    }

    // Convert audio to base64
    const arrayBuffer = await audioFile.arrayBuffer()
    const base64Audio = Buffer.from(arrayBuffer).toString('base64')

    // Use Gemini for audio transcription
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY)
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" })

    const result = await model.generateContent([
      {
        inlineData: {
          data: base64Audio,
          mimeType: audioFile.type || 'audio/webm'
        }
      },
      "Transcribe this audio exactly as spoken. Return only the transcription text, nothing else. If no speech is detected, return empty string."
    ])

    const transcript = result.response.text().trim()

    return Response.json({ 
      transcript,
      success: true 
    })

  } catch (error) {
    console.error("STT Error:", error)
    return Response.json(
      { 
        error: "Failed to transcribe audio",
        details: error.message 
      }, 
      { status: 500 }
    )
  }
}
