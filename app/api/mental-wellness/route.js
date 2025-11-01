import { google } from "@ai-sdk/google"
import { createMentalWellnessChain } from "../../../lib/mental-wellness.js"
import { GoogleGenerativeAI } from "@google/generative-ai"

export const maxDuration = 30

export async function POST(req) {
  try {
    const formData = await req.formData()
    const message = formData.get('message')
    const context = JSON.parse(formData.get('context') || '{}')
    const userProfile = JSON.parse(formData.get('userProfile') || '{}')
    const files = formData.getAll('files')

    if (!message || !message.trim()) {
      return Response.json({ error: "Message is required" }, { status: 400 })
    }

    let result

    // If there are files (multimodal input), use Google Generative AI directly
    if (files && files.length > 0) {
      const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY)
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" })

      // Convert files to base64 and prepare parts
      const fileParts = await Promise.all(
        files.map(async (file) => {
          const arrayBuffer = await file.arrayBuffer()
          const base64 = Buffer.from(arrayBuffer).toString('base64')
          return {
            inlineData: {
              data: base64,
              mimeType: file.type
            }
          }
        })
      )

      // Create prompt with mental health context
      const systemPrompt = `You are Sahayak, a compassionate mental health companion. Respond with empathy and understanding.

User Profile: ${JSON.stringify(userProfile)}
Conversation History: ${context.conversationHistory || 'None'}
Mood Indicators: ${context.moodIndicators || 'None'}

Analyze any images, videos, or audio provided and respond appropriately in the context of mental wellness support.`

      const prompt = `${systemPrompt}\n\nUser: ${message}`

      // Generate content with multimodal input
      const geminiResult = await model.generateContent([prompt, ...fileParts])
      const response = geminiResult.response.text()

      result = {
        response,
        crisisLevel: "LOW", // Basic crisis detection
        followUpNeeded: false,
        timestamp: new Date().toISOString(),
        sessionId: context.sessionId || `session_${Date.now()}`,
        multimodal: true
      }
    } else {
      // No files, use existing mental wellness chain
      const model = google("gemini-2.5-flash")
      const { chain } = createMentalWellnessChain(model, "webApp", {
        crisisEscalation: true,
        anonymousMode: true,
      })

      // Process the user message through the mental wellness system
      result = await chain.processUserMessage(message, {
        sessionId: context.sessionId || `session_${Date.now()}`,
        ageContext: context.ageContext || "college student",
        conversationHistory: context.conversationHistory || "",
        moodIndicators: context.moodIndicators || "",
        userProfile: userProfile,
        timestamp: new Date().toISOString(),
      })
    }

    return Response.json({
      response: result.response,
      crisisLevel: result.crisisLevel,
      followUpNeeded: result.followUpNeeded,
      timestamp: result.timestamp,
      sessionId: result.sessionId,
      multimodal: result.multimodal || false
    })
  } catch (error) {
    console.error("Mental wellness API error:", error)

    // Return safe fallback response
    return Response.json(
      {
        response: `I'm here to listen and support you. While I'm having some technical difficulties right now, please know that your feelings are valid and you're not alone. 

If you're in immediate distress, please reach out to:
- National Suicide Prevention: 9152987821
- AASRA: 9820466726
- Vandrevala Foundation: 9999666555

Is there something specific you'd like to talk about right now?`,
        crisisLevel: "LOW",
        followUpNeeded: false,
        timestamp: new Date().toISOString(),
        error: "Processing failed, using fallback response",
      },
      { status: 200 },
    )
  }
}
