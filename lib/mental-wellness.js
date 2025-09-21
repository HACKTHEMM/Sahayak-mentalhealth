import { generateText } from "ai"

/**
 * Mental Wellness Prompt Templates for Indian Youth
 * JavaScript/AI SDK implementation for AI-powered mental health support
 */
class MentalWellnessPrompt {
  /**
   * Main conversation prompt for the mental wellness AI assistant
   * @returns {string} The main conversation prompt template
   */
  static getMainPromptTemplate() {
    return `
You are Sahayak (Sanskrit for 'Helper'), a compassionate AI mental wellness companion designed specifically for Indian youth aged 16-25. Your mission is to provide confidential, empathetic, and culturally sensitive mental health support while helping to destigmatize mental wellness conversations.

CORE PRINCIPLES:
1. CONFIDENTIALITY: All conversations are private and judgment-free
2. EMPATHY: Respond with genuine warmth and understanding
3. CULTURAL SENSITIVITY: Respect Indian values, family dynamics, and cultural contexts
4. EMPOWERMENT: Help users build resilience and coping strategies
5. SAFETY: Always prioritize user safety and know when to recommend professional help

CULTURAL CONSIDERATIONS:
- Understand the pressure of academic expectations and career competition
- Respect family hierarchies while encouraging healthy boundaries
- Be sensitive to arranged marriage pressures, career vs. passion dilemmas
- Acknowledge societal stigma around mental health in Indian context
- Use culturally relevant examples and analogies when appropriate
- Be aware of festivals, exam seasons, and cultural events that may impact mood

CONVERSATION STYLE:
- Warm, non-judgmental, and approachable tone
- Use simple, clear language (avoid clinical jargon)
- Ask open-ended questions to encourage self-reflection
- Validate emotions without minimizing concerns
- Offer practical, actionable suggestions
- Share hope and remind users of their strength

RESPONSE FRAMEWORK:
1. ACKNOWLEDGE: Recognize and validate the user's feelings
2. UNDERSTAND: Show empathy and cultural awareness
3. EXPLORE: Ask gentle questions to better understand the situation
4. SUPPORT: Provide coping strategies, resources, or perspective
5. EMPOWER: End with affirmation and next steps

SAFETY PROTOCOLS:
- If user mentions self-harm, suicide, or violence: Immediately express concern, provide crisis helplines, and strongly encourage immediate professional help
- For severe symptoms: Gently suggest speaking with a counselor, trusted adult, or mental health professional
- Always remind users that seeking help is a sign of strength, not weakness

CRISIS RESOURCES (India):
- National Suicide Prevention: 9152987821
- AASRA: 9820466726
- Vandrevala Foundation: 9999666555
- Sneha: 044-24640050

Current conversation context:
User's apparent age/stage: {userAgeContext}
Conversation history: {conversationHistory}
Current emotional state indicators: {moodIndicators}

User's message: {userInput}

Respond as Sahayak with empathy, cultural sensitivity, and appropriate support. If this is a crisis situation, prioritize safety resources.

Response:`
  }

  /**
   * Specialized prompt for detecting crisis situations requiring immediate intervention
   * @returns {string} Crisis detection prompt template
   */
  static getCrisisDetectionPrompt() {
    return `
Analyze the following message from a young person for crisis indicators. Look for signs of:
- Suicidal ideation or self-harm mentions
- Severe depression or hopelessness
- Abuse or violence
- Substance abuse
- Eating disorders
- Psychotic symptoms

Message: {userInput}
Previous context: {context}

Classify the urgency level:
- CRISIS: Immediate intervention needed (suicide/self-harm/violence)
- HIGH: Professional help strongly recommended
- MODERATE: Elevated concern, continued monitoring
- LOW: General support sufficient

Urgency Level: 
Reasoning:
Recommended Actions:`
  }

  /**
   * Prompt for recommending appropriate resources based on user needs
   * @returns {string} Resource recommendation prompt template
   */
  static getResourceRecommendationPrompt() {
    return `
Based on the user's concerns and situation, recommend appropriate resources and coping strategies.

User's primary concerns: {concerns}
User's age/context: {userContext}
Available support systems: {supportSystems}
Location context: {location}

Consider:
1. Immediate coping strategies
2. Self-help resources (apps, books, online content)
3. Community resources (support groups, workshops)
4. Professional help options (counselors, therapists)
5. Educational resources for family/friends
6. Crisis resources if needed

Provide culturally appropriate recommendations that are:
- Accessible and affordable
- Suitable for Indian context
- Age-appropriate
- Actionable

Resource Recommendations:`
  }

  /**
   * Prompt for mood assessment and tracking
   * @returns {string} Mood tracking prompt template
   */
  static getMoodTrackingPrompt() {
    return `
Gently assess the user's current emotional state and provide appropriate check-in questions.

Previous mood data: {moodHistory}
Current conversation: {currentConversation}
Time since last check-in: {timeElapsed}

Create a compassionate mood check-in that:
1. Uses culturally sensitive language
2. Asks about specific stressors relevant to Indian youth (academic pressure, family expectations, career concerns, relationships)
3. Includes physical wellness (sleep, eating, exercise)
4. Assesses coping mechanisms being used
5. Identifies support system utilization

Generate 3-5 thoughtful questions that feel like a caring friend checking in, not a clinical assessment.

Mood Check-in Questions:`
  }

  /**
   * Prompt for adapting responses to specific cultural contexts
   * @returns {string} Cultural adaptation prompt template
   */
  static getCulturalAdaptationPrompt() {
    return `
Adapt the mental wellness advice for the specific cultural context provided.

Base advice: {baseAdvice}
Cultural context: {culturalContext}
Family dynamics: {familySituation}
Religious/spiritual beliefs: {beliefs}
Regional considerations: {region}

Adapt the advice to:
1. Respect cultural values while promoting mental wellness
2. Navigate family expectations sensitively
3. Include culturally relevant coping mechanisms
4. Address specific cultural stressors
5. Use appropriate cultural references and examples

Culturally Adapted Response:`
  }
}

/**
 * Mental Wellness Chain for processing user interactions using AI SDK
 */
class MentalWellnessChain {
  constructor(model) {
    this.model = model
    this.prompts = MentalWellnessPrompt
  }

  /**
   * Main processing pipeline for user messages
   * @param {string} userInput - The user's message
   * @param {Object} context - Conversation context and metadata
   * @returns {Object} Processing results including response and crisis assessment
   */
  async processUserMessage(userInput, context = {}) {
    try {
      // Step 1: Crisis detection
      const crisisPrompt = this.prompts
        .getCrisisDetectionPrompt()
        .replace("{userInput}", userInput)
        .replace("{context}", context.conversationHistory || "")

      const crisisAssessment = await generateText({
        model: this.model,
        prompt: crisisPrompt,
        temperature: 0.3, // Lower temperature for more consistent crisis detection
        maxOutputTokens: 500,
      })

      // Step 2: Main response based on crisis level
      const mainPrompt = this.prompts
        .getMainPromptTemplate()
        .replace("{userAgeContext}", context.ageContext || "college student")
        .replace("{conversationHistory}", context.conversationHistory || "")
        .replace("{moodIndicators}", context.moodIndicators || "")
        .replace("{userInput}", userInput)

      const response = await generateText({
        model: this.model,
        prompt: mainPrompt,
        temperature: 0.7, // Higher temperature for more empathetic responses
        maxOutputTokens: 1000,
      })

      return {
        crisisLevel: crisisAssessment.text,
        response: response.text,
        timestamp: context.timestamp || new Date().toISOString(),
        followUpNeeded: this._determineFollowUp(crisisAssessment.text),
        sessionId: context.sessionId,
      }
    } catch (error) {
      console.error("Error processing user message:", error)
      return {
        error: "Processing failed",
        fallbackResponse: this._getFallbackResponse(),
        timestamp: new Date().toISOString(),
      }
    }
  }

  /**
   * Generate mood tracking check-in
   * @param {Object} moodContext - Previous mood data and context
   * @returns {Object} Mood check-in questions and assessment
   */
  async generateMoodCheckIn(moodContext = {}) {
    try {
      const moodPrompt = this.prompts
        .getMoodTrackingPrompt()
        .replace("{moodHistory}", JSON.stringify(moodContext.history) || "No previous data")
        .replace("{currentConversation}", moodContext.currentConversation || "")
        .replace("{timeElapsed}", moodContext.timeElapsed || "24 hours")

      const checkIn = await generateText({
        model: this.model,
        prompt: moodPrompt,
        temperature: 0.6,
        maxOutputTokens: 800,
      })

      return {
        questions: checkIn.text,
        type: "mood_check_in",
        timestamp: new Date().toISOString(),
      }
    } catch (error) {
      console.error("Error generating mood check-in:", error)
      return this._getFallbackMoodCheckIn()
    }
  }

  /**
   * Get resource recommendations
   * @param {Object} userProfile - User's concerns and context
   * @returns {Object} Personalized resource recommendations
   */
  async getResourceRecommendations(userProfile = {}) {
    try {
      const resourcePrompt = this.prompts
        .getResourceRecommendationPrompt()
        .replace("{concerns}", userProfile.concerns || "general wellness")
        .replace("{userContext}", userProfile.context || "college student")
        .replace("{supportSystems}", userProfile.supportSystems || "limited")
        .replace("{location}", userProfile.location || "urban India")

      const recommendations = await generateText({
        model: this.model,
        prompt: resourcePrompt,
        temperature: 0.5,
        maxOutputTokens: 1200,
      })

      return {
        resources: recommendations.text,
        type: "resource_recommendations",
        personalized: true,
        timestamp: new Date().toISOString(),
      }
    } catch (error) {
      console.error("Error getting resource recommendations:", error)
      return this._getFallbackResources()
    }
  }

  /**
   * Determine if follow-up is needed based on crisis assessment
   * @param {string} crisisAssessment - The crisis assessment text
   * @returns {boolean} Whether follow-up is needed
   */
  _determineFollowUp(crisisAssessment) {
    const urgentKeywords = ["CRISIS", "HIGH", "immediate", "urgent"]
    return urgentKeywords.some((keyword) => crisisAssessment.toUpperCase().includes(keyword))
  }

  /**
   * Get fallback response for error situations
   * @returns {string} Safe fallback response
   */
  _getFallbackResponse() {
    return `I'm here to listen and support you. While I'm having some technical difficulties right now, please know that your feelings are valid and you're not alone. 

If you're in immediate distress, please reach out to:
- National Suicide Prevention: 9152987821
- AASRA: 9820466726
- Vandrevala Foundation: 9999666555

Is there something specific you'd like to talk about right now?`
  }

  /**
   * Get fallback mood check-in for error situations
   * @returns {Object} Safe fallback mood check-in
   */
  _getFallbackMoodCheckIn() {
    return {
      questions: `How are you feeling today? I'd love to check in with you about:

1. How has your energy been lately?
2. Are you getting enough rest and sleep?
3. What's been on your mind the most recently?
4. Have you been able to connect with friends or family?
5. What's one small thing that brought you joy this week?

Take your time - I'm here to listen.`,
      type: "fallback_mood_check_in",
      timestamp: new Date().toISOString(),
    }
  }

  /**
   * Get fallback resources for error situations
   * @returns {Object} Safe fallback resources
   */
  _getFallbackResources() {
    return {
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
    }
  }
}

// Configuration for different deployment scenarios
const DEPLOYMENT_CONFIG = {
  webApp: {
    maxConversationLength: 50,
    sessionTimeoutMinutes: 30,
    followUpIntervals: [24, 72, 168], // hours
    crisisEscalation: true,
    enabledFeatures: ["mood_tracking", "resources", "crisis_detection"],
  },
  mobileApp: {
    pushNotifications: true,
    offlineResources: true,
    moodTrackingFrequency: "daily",
    anonymousMode: true,
    enabledFeatures: ["mood_tracking", "resources", "crisis_detection", "notifications"],
  },
  whatsappBot: {
    characterLimit: 4096,
    quickReplies: true,
    multimediaSupport: true,
    hindiSupport: true,
    enabledFeatures: ["basic_conversation", "crisis_detection"],
  },
  voiceAssistant: {
    speechToText: true,
    textToSpeech: true,
    voiceEmotionDetection: true,
    multilingualSupport: ["english", "hindi"],
    enabledFeatures: ["conversation", "mood_detection", "crisis_detection"],
  },
}

/**
 * Factory function to create a properly configured mental wellness chain
 * @param {Object} model - The AI model instance
 * @param {string} deploymentType - Type of deployment (webApp, mobileApp, etc.)
 * @param {Object} customConfig - Additional configuration options
 * @returns {Object} Configured mental wellness chain and config
 */
function createMentalWellnessChain(model, deploymentType = "webApp", customConfig = {}) {
  const config = { ...DEPLOYMENT_CONFIG[deploymentType], ...customConfig }
  let chain = new MentalWellnessChain(model)

  // Add safety wrappers based on configuration
  if (config.crisisEscalation) {
    chain = addCrisisMonitoring(chain, config)
  }

  if (config.anonymousMode) {
    chain = addPrivacyProtection(chain, config)
  }

  if (config.pushNotifications) {
    chain = addNotificationSystem(chain, config)
  }

  return { chain, config }
}

/**
 * Add crisis monitoring and escalation capabilities
 * @param {MentalWellnessChain} chain - The base chain
 * @param {Object} config - Configuration options
 * @returns {MentalWellnessChain} Enhanced chain with crisis monitoring
 */
function addCrisisMonitoring(chain, config) {
  const originalProcess = chain.processUserMessage.bind(chain)

  chain.processUserMessage = async (userInput, context) => {
    const result = await originalProcess(userInput, context)

    // Check for crisis indicators and trigger escalation if needed
    if (result.followUpNeeded && config.crisisEscalation) {
      await triggerCrisisEscalation(result, context)
    }

    return result
  }

  return chain
}

/**
 * Add privacy protection measures
 * @param {MentalWellnessChain} chain - The base chain
 * @param {Object} config - Configuration options
 * @returns {MentalWellnessChain} Enhanced chain with privacy protection
 */
function addPrivacyProtection(chain, config) {
  // Implementation would include data encryption,
  // anonymization, and secure storage
  chain.anonymousMode = true
  chain.dataRetention = config.dataRetentionDays || 30

  return chain
}

/**
 * Add notification system for follow-ups and mood tracking
 * @param {MentalWellnessChain} chain - The base chain
 * @param {Object} config - Configuration options
 * @returns {MentalWellnessChain} Enhanced chain with notifications
 */
function addNotificationSystem(chain, config) {
  chain.scheduleFollowUp = (userId, delay) => {
    // Implementation would schedule follow-up notifications
    console.log(`Scheduling follow-up for user ${userId} in ${delay} hours`)
  }

  return chain
}

/**
 * Trigger crisis escalation procedures
 * @param {Object} result - Processing result with crisis indicators
 * @param {Object} context - User context
 */
async function triggerCrisisEscalation(result, context) {
  // Implementation would:
  // 1. Alert human counselors
  // 2. Provide immediate crisis resources
  // 3. Schedule immediate follow-up
  // 4. Log incident for review

  console.log("Crisis escalation triggered:", {
    sessionId: context.sessionId,
    crisisLevel: result.crisisLevel,
    timestamp: result.timestamp,
  })
}

// Export the main classes and functions
export { MentalWellnessPrompt, MentalWellnessChain, createMentalWellnessChain, DEPLOYMENT_CONFIG }
