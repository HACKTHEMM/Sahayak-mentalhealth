/**
 * USAGE EXAMPLES - Cultural Intelligence System
 * Copy these patterns into your actual implementation
 */

// ============================================
// EXAMPLE 1: Complete Chat Message Processing
// ============================================

import culturalIntelligence from '@/lib/cultural-intelligence'
import languageDetector from '@/lib/language-detection'

async function handleChatMessage(userId, userMessage, userProfile) {
  // Step 1: Detect language and emotion
  const languageDetection = languageDetector.detectLanguages(userMessage)
  const emotionalContext = languageDetector.getEmotionalContext(languageDetection)
  
  console.log('Language detected:', languageDetection.languageNames)
  console.log('Distress level:', emotionalContext.distressLevel)
  
  // Step 2: Get your AI response (using your LLM)
  const baseAIResponse = await getAIResponse(userMessage, userProfile)
  
  // Step 3: Process with cultural intelligence
  const result = culturalIntelligence.processCulturallyAwareResponse(
    userId,
    userMessage,
    userProfile,
    baseAIResponse,
    {
      needsResources: emotionalContext.distressLevel !== 'low',
      requestingWellness: userMessage.toLowerCase().includes('help') || 
                          userMessage.toLowerCase().includes('stress')
    }
  )
  
  // Step 4: Return enhanced response
  return {
    message: result.finalResponse,
    helplines: result.regionalResources?.localHelplines || null,
    emergencyContacts: result.emergencyContacts || null,
    wellnessSuggestions: result.wellnessSuggestions || null,
    metadata: {
      languageDetected: languageDetection.hasMultipleLanguages,
      detectedLanguages: languageDetection.languageNames,
      distressLevel: emotionalContext.distressLevel,
      culturallyAdapted: true
    }
  }
}

// ============================================
// EXAMPLE 2: User Profile Setup & Save
// ============================================

import { useState } from 'react'
import CulturalProfileSetup from '@/components/CulturalProfileSetup'

function OnboardingPage() {
  const [showSetup, setShowSetup] = useState(true)
  
  const handleProfileComplete = async (profile) => {
    console.log('User profile:', profile)
    
    // Save to Supabase
    const { data, error } = await supabase
      .from('user_profiles')
      .update({
        state: profile.state,
        city: profile.city,
        region: profile.region,
        life_stage: profile.lifeStage,
        comfortable_languages: profile.languages,
        cultural_preferences: profile.culturalPreferences,
        family_structure: profile.familyDynamics,
        preferences: {
          primaryStressors: profile.primaryStressors,
          religiousBackground: profile.religiousBackground
        }
      })
      .eq('clerk_user_id', userId)
    
    if (!error) {
      setShowSetup(false)
      // Redirect to dashboard
    }
  }
  
  return (
    <div>
      {showSetup && (
        <CulturalProfileSetup
          onProfileComplete={handleProfileComplete}
          onSkip={() => setShowSetup(false)}
        />
      )}
    </div>
  )
}

// ============================================
// EXAMPLE 3: Display Regional Resources
// ============================================

import RegionalResourcesCard from '@/components/RegionalResourcesCard'
import regionalResourceProvider from '@/lib/regional-resources'

function SupportPage({ userProfile }) {
  // Get resources for user's location
  const resources = regionalResourceProvider.getLocalResources(
    userProfile.state,
    userProfile.city
  )
  
  return (
    <div className="space-y-4">
      <h2>Support Resources Near You</h2>
      
      {/* Show local helplines */}
      {resources.localHelplines.length > 0 && (
        <RegionalResourcesCard
          resources={resources.localHelplines}
          type="helplines"
        />
      )}
      
      {/* Show mental health organizations */}
      {resources.localOrganizations.length > 0 && (
        <RegionalResourcesCard
          resources={resources.localOrganizations}
          type="organizations"
        />
      )}
      
      {/* Show cultural wellness practices */}
      {resources.regionalWellness.length > 0 && (
        <RegionalResourcesCard
          resources={resources.regionalWellness}
          type="wellness"
        />
      )}
    </div>
  )
}

// ============================================
// EXAMPLE 4: Crisis Detection & Response
// ============================================

async function handlePotentialCrisis(userId, userMessage, userProfile) {
  // Detect language and emotion
  const detection = languageDetector.detectLanguages(userMessage)
  const emotional = languageDetector.getEmotionalContext(detection)
  
  // Check for crisis level
  if (emotional.distressLevel === 'high') {
    console.log('⚠️ High distress detected')
    
    // Get emergency contacts
    const emergency = regionalResourceProvider.getEmergencyContacts(
      userProfile.state || 'Maharashtra',
      'HIGH'
    )
    
    // Format for immediate display
    const helplines = emergency.slice(0, 3).map(h => ({
      name: h.name,
      number: h.number,
      hours: h.hours,
      languages: h.languages.join(', ')
    }))
    
    return {
      isCrisis: true,
      message: "I'm really concerned about you. Please reach out to someone who can help right away:",
      emergencyContacts: helplines,
      showCrisisAlert: true
    }
  }
  
  return { isCrisis: false }
}

// ============================================
// EXAMPLE 5: AI Prompt Building
// ============================================

import { buildCulturalPromptContext } from '@/lib/cultural-intelligence'

async function generateAIResponse(userMessage, userProfile, conversationHistory) {
  // Detect language
  const detection = languageDetector.detectLanguages(userMessage)
  
  // Get regional resources
  const resources = regionalResourceProvider.getLocalResources(
    userProfile.state,
    userProfile.city
  )
  
  // Build cultural context for AI prompt
  const context = buildCulturalPromptContext(
    userProfile,
    detection,
    resources
  )
  
  // Build full prompt
  const prompt = `
You are Sahayak, a culturally-aware mental health assistant.

USER PROFILE:
- Location: ${context.userState}, ${context.userCity}
- Languages: ${context.languagePreferences}
- Cultural preferences: ${context.culturalPreferences}
- Life stage: ${userProfile.lifeStage}

DETECTED IN MESSAGE:
- Languages: ${context.detectedLanguages}
- Emotional state: ${context.emotionalContext}

LOCAL SUPPORT AVAILABLE:
${context.localResources}

CRISIS HELPLINES:
${context.crisisHelplines}

WELLNESS OPTIONS:
${context.culturalWellness}

CONVERSATION HISTORY:
${conversationHistory.slice(-5).map(m => `${m.role}: ${m.content}`).join('\n')}

USER: ${userMessage}

Respond with empathy and cultural awareness. If user used regional language, acknowledge it.
`
  
  // Call your LLM (OpenAI, Anthropic, etc.)
  const response = await yourLLM.generate(prompt)
  
  return response
}

// ============================================
// EXAMPLE 6: Smart Resource Suggestions
// ============================================

function ChatMessage({ message, userProfile, showResources }) {
  const [resources, setResources] = useState(null)
  
  useEffect(() => {
    // Check if message warrants resource suggestions
    const detection = languageDetector.detectLanguages(message.content)
    const emotional = languageDetector.getEmotionalContext(detection)
    
    const needsHelp = culturalIntelligence.shouldSuggestRegionalResources(
      message.content,
      emotional
    )
    
    if (needsHelp && userProfile.state) {
      const localResources = regionalResourceProvider.getLocalResources(
        userProfile.state,
        userProfile.city
      )
      setResources(localResources)
    }
  }, [message])
  
  return (
    <div>
      <div className="message">{message.content}</div>
      
      {resources && (
        <div className="mt-4">
          <RegionalResourcesCard
            resources={resources.localHelplines}
            type="helplines"
          />
        </div>
      )}
    </div>
  )
}

// ============================================
// EXAMPLE 7: Testing Implementation
// ============================================

import testUtils from '@/lib/cultural-test-utils'

// Run in development/testing
function runTests() {
  console.log('🧪 Testing Cultural Intelligence...\n')
  
  // Test individual features
  testUtils.testLanguageDetection()
  testUtils.testRegionalResources()
  testUtils.testCulturalAdaptation()
  
  // Or run all tests
  testUtils.runAllTests()
}

// ============================================
// EXAMPLE 8: Wellness Recommendations
// ============================================

function WellnessTab({ userProfile }) {
  const wellness = regionalResourceProvider.getWellnessSuggestions(
    userProfile.state,
    userProfile.culturalPreferences
  )
  
  return (
    <div>
      <h2>Personalized Wellness Practices</h2>
      <p className="text-muted-foreground">
        Based on your cultural preferences and location
      </p>
      
      <div className="grid gap-4 mt-4">
        {wellness.map((practice, idx) => (
          <div key={idx} className="border rounded-lg p-4">
            <h3 className="font-semibold">{practice.name}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {practice.description}
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              {practice.benefits.map((benefit, i) => (
                <span
                  key={i}
                  className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full"
                >
                  {benefit}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ============================================
// EXAMPLE 9: Real-time Language Detection in Chat
// ============================================

function ChatInput({ onSend, userProfile }) {
  const [message, setMessage] = useState('')
  const [detectedInfo, setDetectedInfo] = useState(null)
  
  const handleChange = (e) => {
    const text = e.target.value
    setMessage(text)
    
    // Real-time language detection (debounced in production)
    if (text.length > 5) {
      const detection = languageDetector.detectLanguages(text)
      if (detection.hasMultipleLanguages) {
        setDetectedInfo({
          languages: detection.languageNames,
          phrases: detection.matchedPhrases
        })
      } else {
        setDetectedInfo(null)
      }
    }
  }
  
  return (
    <div>
      {detectedInfo && (
        <div className="text-xs text-blue-600 mb-2">
          💬 I understand {detectedInfo.languages.join(', ')} too!
        </div>
      )}
      
      <input
        value={message}
        onChange={handleChange}
        placeholder="Type your message... (English/Hindi/Tamil/etc.)"
      />
      
      <button onClick={() => onSend(message)}>Send</button>
    </div>
  )
}

// ============================================
// EXAMPLE 10: Complete Integration in API Route
// ============================================

// app/api/chat/route.js
import { NextResponse } from 'next/server'
import culturalIntelligence from '@/lib/cultural-intelligence'
import languageDetector from '@/lib/language-detection'
import regionalResourceProvider from '@/lib/regional-resources'

export async function POST(request) {
  try {
    const { userId, userMessage, userProfile, conversationHistory } = await request.json()
    
    // 1. Language detection
    const detection = languageDetector.detectLanguages(userMessage)
    const emotional = languageDetector.getEmotionalContext(detection)
    
    // 2. Get resources if needed
    let resources = null
    if (userProfile.state && emotional.distressLevel !== 'low') {
      resources = regionalResourceProvider.getLocalResources(
        userProfile.state,
        userProfile.city
      )
    }
    
    // 3. Build AI context
    const context = culturalIntelligence.buildCulturalPromptContext(
      userProfile,
      detection,
      resources
    )
    
    // 4. Generate AI response (replace with your LLM)
    const aiResponse = await generateAIResponse(userMessage, context, conversationHistory)
    
    // 5. Process with cultural intelligence
    const result = culturalIntelligence.processCulturallyAwareResponse(
      userId,
      userMessage,
      userProfile,
      aiResponse,
      {
        crisisLevel: emotional.distressLevel.toUpperCase(),
        needsResources: emotional.distressLevel !== 'low'
      }
    )
    
    // 6. Return complete response
    return NextResponse.json({
      success: true,
      message: result.finalResponse,
      regionalResources: resources ? {
        helplines: resources.localHelplines.slice(0, 3),
        organizations: resources.localOrganizations.slice(0, 2)
      } : null,
      emergencyContacts: result.emergencyContacts,
      wellnessSuggestions: result.wellnessSuggestions,
      metadata: {
        languagesDetected: detection.languageNames,
        distressLevel: emotional.distressLevel,
        culturallyAdapted: true,
        hasLocalResources: !!resources
      }
    })
    
  } catch (error) {
    console.error('Chat error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to process message' },
      { status: 500 }
    )
  }
}

// Placeholder - replace with your actual LLM call
async function generateAIResponse(message, context, history) {
  // This is where you'd call OpenAI, Anthropic, etc.
  return "I understand. Let me help you with that."
}

export default {
  handleChatMessage,
  OnboardingPage,
  SupportPage,
  handlePotentialCrisis,
  generateAIResponse,
  ChatMessage,
  runTests,
  WellnessTab,
  ChatInput
}
