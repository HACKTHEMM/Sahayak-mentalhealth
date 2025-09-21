import { google } from "@ai-sdk/google"
import { createMentalWellnessChain } from "../../../lib/mental-wellness.js"

export const maxDuration = 30

export async function POST(req) {
  try {
    const { userProfile = {} } = await req.json()

    const model = google("gemini-1.5-pro")
    const { chain } = createMentalWellnessChain(model, "webApp")

    // Get resource recommendations
    const result = await chain.getResourceRecommendations({
      concerns: userProfile.concerns || "general wellness",
      context: userProfile.context || "college student",
      supportSystems: userProfile.supportSystems || "limited",
      location: userProfile.location || "urban India",
    })

    return Response.json({
      resources: result.resources,
      type: result.type,
      personalized: result.personalized,
      timestamp: result.timestamp,
    })
  } catch (error) {
    console.error("Resources API error:", error)

    // Return safe fallback resources
    return Response.json(
      {
        resources: `Here are some reliable mental wellness resources for Indian youth:

**Immediate Support:**
- AASRA: 9820466726 (24/7 emotional support)
- Vandrevala Foundation: 9999666555 (24/7 crisis helpline)
- Sneha: 044-24640050 (emotional support)

**Apps & Online Resources:**
- Wysa (AI mental health chatbot)
- Sanvello (mood and anxiety tracker)
- Headspace (meditation and mindfulness)

**Professional Help:**
- Practo (find nearby therapists)
- BetterHelp India (online counseling)
- Local college counseling centers

Remember: Seeking help is a sign of strength, not weakness.`,
        type: "fallback_resources",
        personalized: false,
        timestamp: new Date().toISOString(),
        error: "Processing failed, using fallback resources",
      },
      { status: 200 },
    )
  }
}
