/**
 * Example API Route: Enhanced Cultural Intelligence Integration
 * Demonstrates how to use language detection, regional resources, and cultural adaptation
 */

import { NextResponse } from 'next/server'
import culturalIntelligence from '@/lib/cultural-intelligence'
import languageDetector from '@/lib/language-detection'
import regionalResourceProvider from '@/lib/regional-resources'

/**
 * POST /api/chat-culturally-aware
 * 
 * Enhanced chat endpoint with full cultural intelligence
 */
export async function POST(request) {
  try {
    const { 
      userId, 
      userMessage, 
      userProfile, 
      conversationHistory = [] 
    } = await request.json()

    if (!userId || !userMessage) {
      return NextResponse.json(
        { error: 'userId and userMessage are required' },
        { status: 400 }
      )
    }

    // Step 1: Detect languages in user message
    const languageDetection = languageDetector.detectLanguages(userMessage)
    
    // Step 2: Get emotional context from language
    const emotionalContext = languageDetector.getEmotionalContext(languageDetection)
    
    // Step 3: Check if we need to provide resources
    const needsResources = culturalIntelligence.shouldSuggestRegionalResources(
      userMessage, 
      emotionalContext
    )
    
    const needsWellness = culturalIntelligence.shouldSuggestWellness(userMessage)

    // Step 4: Build context for AI prompt
    let regionalResources = null
    if (userProfile?.state) {
      regionalResources = regionalResourceProvider.getLocalResources(
        userProfile.state,
        userProfile.city
      )
    }

    const promptContext = culturalIntelligence.buildCulturalPromptContext(
      userProfile || {},
      languageDetection,
      regionalResources
    )

    // Step 5: Call your AI model with enhanced context
    // This is where you'd integrate with your LLM (OpenAI, Anthropic, etc.)
    // For demonstration, we'll show the structure
    
    const aiPrompt = buildEnhancedPrompt(promptContext, userMessage, conversationHistory)
    
    // Simulated AI response - replace with actual LLM call
    const baseAIResponse = await callYourAIModel(aiPrompt)

    // Step 6: Process response with full cultural intelligence
    const culturalResponse = culturalIntelligence.processCulturallyAwareResponse(
      userId,
      userMessage,
      userProfile || {},
      baseAIResponse,
      {
        needsResources,
        requestingWellness: needsWellness,
        crisisLevel: emotionalContext.distressLevel.toUpperCase()
      }
    )

    // Step 7: Build response with resources
    const response = {
      message: culturalResponse.finalResponse,
      metadata: culturalResponse.metadata,
      
      // Include language insights
      languageInsights: languageDetection.hasMultipleLanguages ? {
        detectedLanguages: languageDetection.languageNames,
        matchedPhrases: languageDetection.matchedPhrases,
        emotionalTone: emotionalContext.distressLevel
      } : null,

      // Include regional resources if needed
      regionalResources: needsResources && regionalResources?.hasLocalResources ? {
        helplines: regionalResources.localHelplines.slice(0, 3),
        organizations: regionalResources.localOrganizations.slice(0, 2),
        nationalHelplines: regionalResources.nationalHelplines.slice(0, 2)
      } : null,

      // Include wellness suggestions if appropriate
      wellnessSuggestions: needsWellness && culturalResponse.wellnessSuggestions ? 
        culturalResponse.wellnessSuggestions.slice(0, 3) : null,

      // Include emergency contacts for high distress
      emergencyContacts: emotionalContext.distressLevel === 'high' ? 
        culturalResponse.emergencyContacts : null,

      // Cultural insights
      culturalInsights: culturalResponse.culturalAdaptation.culturalInsights || null
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('Cultural intelligence API error:', error)
    return NextResponse.json(
      { error: 'Failed to process culturally-aware response' },
      { status: 500 }
    )
  }
}

/**
 * Build enhanced prompt with cultural context
 */
function buildEnhancedPrompt(context, userMessage, history) {
  return `
You are Sahayak, a culturally-aware mental health assistant for Indian youth.

USER PROFILE:
- Location: ${context.userState}, ${context.userCity}
- Languages: ${context.languagePreferences}
- Cultural preferences: ${context.culturalPreferences}

DETECTED IN CURRENT MESSAGE:
- Languages: ${context.detectedLanguages}
- Emotional state: ${context.emotionalContext}

AVAILABLE SUPPORT:
${context.localResources}

CRISIS HELPLINES:
${context.crisisHelplines}

CULTURAL WELLNESS OPTIONS:
${context.culturalWellness}

CONVERSATION HISTORY:
${history.slice(-5).map(msg => `${msg.role}: ${msg.content}`).join('\n')}

USER MESSAGE: ${userMessage}

Respond with empathy, cultural awareness, and practical support. If the user used phrases in regional languages, acknowledge that you understand. Keep it conversational and supportive.
`
}

/**
 * Placeholder for actual AI model call
 * Replace this with your actual LLM integration
 */
async function callYourAIModel(prompt) {
  // This is where you'd call OpenAI, Anthropic, or your chosen LLM
  // Example with OpenAI:
  /*
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
  })
  return response.choices[0].message.content
  */
  
  // For demonstration:
  return "I understand you're going through a difficult time. I'm here to help. Can you tell me more about what's on your mind?"
}

/**
 * GET /api/chat-culturally-aware/resources
 * 
 * Get regional resources for a specific location
 */
export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const state = searchParams.get('state')
  const city = searchParams.get('city')

  if (!state) {
    return NextResponse.json(
      { error: 'State parameter is required' },
      { status: 400 }
    )
  }

  const resources = regionalResourceProvider.getLocalResources(state, city)

  return NextResponse.json({
    state,
    city,
    hasLocalResources: resources.hasLocalResources,
    helplines: resources.localHelplines,
    organizations: resources.localOrganizations,
    nationalHelplines: resources.nationalHelplines,
    traditionalPractices: resources.traditionalPractices,
    regionalWellness: resources.regionalWellness
  })
}
