/**
 * Integration utility for enhanced cultural intelligence
 * Connects language detection, regional resources, and cultural adaptation
 */

import languageDetector from './language-detection'
import regionalResourceProvider from './regional-resources'
import culturalAdaptationEngine from './cultural-adaptation'

/**
 * Process user message with full cultural intelligence
 * @param {string} userId - User ID
 * @param {string} userMessage - User's message
 * @param {Object} userProfile - User's cultural profile
 * @param {string} baseAIResponse - Original AI response
 * @param {Object} context - Additional context
 * @returns {Object} Enhanced response with all cultural adaptations
 */
export function processCulturallyAwareResponse(
  userId,
  userMessage,
  userProfile,
  baseAIResponse,
  context = {}
) {
  // Detect languages in user message
  const languageDetection = languageDetector.detectLanguages(userMessage)
  
  // Get emotional context from language
  const emotionalContext = languageDetector.getEmotionalContext(languageDetection)
  
  // Get response guidelines based on language detection
  const responseGuidelines = languageDetector.getResponseGuidelines(languageDetection)
  
  // Update user profile in cultural adaptation engine
  culturalAdaptationEngine.updateUserProfile(userId, userProfile)
  
  // Get culturally adapted response
  const culturalAdaptation = culturalAdaptationEngine.adaptResponse(userId, baseAIResponse, {
    userMessage,
    needsSupport: emotionalContext.seeking_support,
    crisisLevel: emotionalContext.distressLevel.toUpperCase(),
    requestingHelp: context.requestingHelp || emotionalContext.seeking_support,
    ...context
  })
  
  // Get regional resources if needed
  let regionalResources = null
  if (userProfile.state && (emotionalContext.distressLevel !== 'low' || context.needsResources)) {
    regionalResources = regionalResourceProvider.getLocalResources(
      userProfile.state,
      userProfile.city
    )
  }
  
  // Get emergency contacts for crisis situations
  let emergencyContacts = null
  if (emotionalContext.distressLevel === 'high' || context.crisisLevel === 'HIGH') {
    emergencyContacts = regionalResourceProvider.getEmergencyContacts(
      userProfile.state || 'Maharashtra',
      context.crisisLevel || 'HIGH'
    )
  }
  
  // Get wellness suggestions based on cultural preferences
  let wellnessSuggestions = null
  if (userProfile.culturalPreferences && (context.requestingWellness || emotionalContext.seeking_support)) {
    wellnessSuggestions = regionalResourceProvider.getWellnessSuggestions(
      userProfile.state,
      userProfile.culturalPreferences
    )
  }
  
  return {
    finalResponse: culturalAdaptation.adaptedResponse,
    languageDetection,
    emotionalContext,
    responseGuidelines,
    culturalAdaptation,
    regionalResources,
    emergencyContacts,
    wellnessSuggestions,
    metadata: {
      languagesDetected: languageDetection.detectedLanguages,
      hasMultilingualContent: languageDetection.hasMultipleLanguages,
      hinglishUsed: languageDetection.hinglishDetected,
      distressLevel: emotionalContext.distressLevel,
      culturallyAdapted: true,
      localResourcesProvided: !!regionalResources,
    }
  }
}

/**
 * Build AI prompt context with cultural awareness
 * @param {Object} userProfile - User's profile
 * @param {Object} languageDetection - Language detection results
 * @param {Object} regionalResources - Regional resources
 * @returns {Object} Prompt context variables
 */
export function buildCulturalPromptContext(userProfile, languageDetection, regionalResources) {
  const context = {
    userState: userProfile.state || "Not specified",
    userCity: userProfile.city || "Not specified",
    languagePreferences: userProfile.languages?.join(", ") || "English, Hindi",
    detectedLanguages: languageDetection?.languageNames?.join(", ") || "None detected",
    culturalContext: buildCulturalContextString(userProfile),
    culturalPreferences: buildCulturalPreferencesString(userProfile.culturalPreferences),
    emotionalContext: languageDetection ? 
      buildEmotionalContextString(languageDetector.getEmotionalContext(languageDetection)) : 
      "Normal",
  }
  
  // Add local resources
  if (regionalResources?.hasLocalResources) {
    context.localResources = formatLocalResourcesForPrompt(regionalResources)
    context.crisisHelplines = formatHelplinesForPrompt([
      ...regionalResources.nationalHelplines,
      ...regionalResources.localHelplines
    ])
  } else {
    context.localResources = "No specific local resources available"
    context.crisisHelplines = `
- National Suicide Prevention: 9152987821
- AASRA: 9820466726
- Vandrevala Foundation: 9999666555
- Sneha: 044-24640050`
  }
  
  // Add cultural wellness
  if (regionalResources?.regionalWellness) {
    context.culturalWellness = formatWellnessForPrompt(regionalResources.regionalWellness)
  } else {
    context.culturalWellness = "General mindfulness and meditation practices"
  }
  
  return context
}

function buildCulturalContextString(profile) {
  const parts = []
  
  if (profile.region) {
    parts.push(`Region: ${profile.region} India`)
  }
  if (profile.lifeStage) {
    parts.push(`Life Stage: ${profile.lifeStage}`)
  }
  if (profile.familyDynamics) {
    parts.push(`Family: ${profile.familyDynamics}`)
  }
  if (profile.primaryStressors?.length) {
    parts.push(`Main concerns: ${profile.primaryStressors.join(", ")}`)
  }
  
  return parts.join(" | ") || "General Indian youth context"
}

function buildCulturalPreferencesString(preferences) {
  if (!preferences) return "Not specified"
  
  const selected = Object.entries(preferences)
    .filter(([key, value]) => value)
    .map(([key]) => key)
  
  return selected.length > 0 ? selected.join(", ") : "Not specified"
}

function buildEmotionalContextString(emotionalContext) {
  const signals = []
  
  if (emotionalContext.distressLevel !== 'low') {
    signals.push(`Distress: ${emotionalContext.distressLevel}`)
  }
  if (emotionalContext.seeking_support) {
    signals.push("Seeking support")
  }
  if (emotionalContext.confusion) {
    signals.push("Confused/uncertain")
  }
  if (emotionalContext.positive) {
    signals.push("Positive mood")
  }
  
  return signals.length > 0 ? signals.join(", ") : "Neutral"
}

function formatLocalResourcesForPrompt(resources) {
  let text = `Available in ${resources.state}${resources.city ? `, ${resources.city}` : ''}:\n`
  
  if (resources.localHelplines.length > 0) {
    text += `Local helplines: ${resources.localHelplines.length} available\n`
  }
  if (resources.localOrganizations.length > 0) {
    text += `Mental health centers: ${resources.localOrganizations.length} in area\n`
  }
  if (resources.traditionalPractices.length > 0) {
    text += `Cultural wellness: ${resources.traditionalPractices.join(", ")}`
  }
  
  return text
}

function formatHelplinesForPrompt(helplines) {
  return helplines
    .slice(0, 5)
    .map(h => `- ${h.name}: ${h.number} (${h.hours}) - ${h.languages.join("/")}`)
    .join('\n')
}

function formatWellnessForPrompt(practices) {
  return practices
    .slice(0, 3)
    .map(p => `- ${p.name}: ${p.description}`)
    .join('\n')
}

/**
 * Check if message needs regional resource suggestions
 * @param {string} message - User message
 * @param {Object} emotionalContext - Emotional context
 * @returns {boolean}
 */
export function shouldSuggestRegionalResources(message, emotionalContext) {
  const resourceKeywords = [
    'help', 'helpline', 'counselor', 'therapist', 'doctor', 
    'support', 'talk to someone', 'professional',
    'madad', 'sahayata', 'help chahiye'
  ]
  
  const messageLower = message.toLowerCase()
  const hasKeyword = resourceKeywords.some(kw => messageLower.includes(kw))
  const highDistress = emotionalContext.distressLevel === 'high'
  
  return hasKeyword || highDistress
}

/**
 * Check if message needs wellness suggestions
 * @param {string} message - User message
 * @returns {boolean}
 */
export function shouldSuggestWellness(message) {
  const wellnessKeywords = [
    'stress', 'relax', 'calm', 'peace', 'meditation', 'yoga',
    'better', 'cope', 'manage', 'deal with',
    'tension', 'shanti', 'sukoon'
  ]
  
  const messageLower = message.toLowerCase()
  return wellnessKeywords.some(kw => messageLower.includes(kw))
}

export default {
  processCulturallyAwareResponse,
  buildCulturalPromptContext,
  shouldSuggestRegionalResources,
  shouldSuggestWellness
}
