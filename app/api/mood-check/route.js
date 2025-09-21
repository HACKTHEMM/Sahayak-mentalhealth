import { google } from "@ai-sdk/google"
import { createMentalWellnessChain } from "../../../lib/mental-wellness.js"

export const maxDuration = 30

export async function POST(req) {
  try {
    const { moodContext = {} } = await req.json()

    const model = google("gemini-1.5-pro")
    const { chain } = createMentalWellnessChain(model, "webApp")

    // Generate mood check-in
    const result = await chain.generateMoodCheckIn({
      history: moodContext.history || [],
      currentConversation: moodContext.currentConversation || "",
      timeElapsed: moodContext.timeElapsed || "24 hours",
    })

    if (!result || !result.questions) {
      throw new Error("Invalid response from mood check-in generator")
    }

    return Response.json({
      questions: result.questions,
      type: result.type,
      timestamp: result.timestamp,
    })
  } catch (error) {
    console.error("Mood check API error:", error)

    return Response.json(
      {
        questions: `How are you feeling today? I'd love to check in with you about:

1. How has your energy been lately?
2. Are you getting enough rest and sleep?
3. What's been on your mind the most recently?
4. Have you been able to connect with friends or family?
5. What's one small thing that brought you joy this week?

Take your time - I'm here to listen.`,
        type: "fallback_mood_check_in",
        timestamp: new Date().toISOString(),
        error: "Processing failed, using fallback check-in",
      },
      { status: 200 },
    )
  }
}
