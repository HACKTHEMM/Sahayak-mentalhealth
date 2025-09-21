import { google } from "@ai-sdk/google"
import { createMentalWellnessChain } from "../../../lib/mental-wellness.js"

export const maxDuration = 30

export async function POST(req) {
  try {
    const { message, context = {} } = await req.json()

    if (!message || !message.trim()) {
      return Response.json({ error: "Message is required" }, { status: 400 })
    }

    const model = google("gemini-1.5-pro")
    const { chain } = createMentalWellnessChain(model, "webApp", {
      crisisEscalation: true,
      anonymousMode: true,
    })

    // Process the user message through the mental wellness system
    const result = await chain.processUserMessage(message, {
      sessionId: context.sessionId || `session_${Date.now()}`,
      ageContext: context.ageContext || "college student",
      conversationHistory: context.conversationHistory || "",
      moodIndicators: context.moodIndicators || "",
      timestamp: new Date().toISOString(),
    })

    return Response.json({
      response: result.response,
      crisisLevel: result.crisisLevel,
      followUpNeeded: result.followUpNeeded,
      timestamp: result.timestamp,
      sessionId: result.sessionId,
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
