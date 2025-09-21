/**
 * Cultural Adaptation System for Indian Youth Mental Wellness
 * Provides culturally sensitive content and context-aware responses
 */

const CULTURAL_CONTEXTS = {
  academic: {
    name: "Academic Pressure",
    stressors: [
      "Board exam preparation",
      "Competitive entrance exams (JEE, NEET, CAT)",
      "Parental expectations for marks",
      "Peer competition",
      "Career uncertainty",
      "Coaching class pressure",
    ],
    culturalFactors: [
      "Family honor tied to academic success",
      "Limited career path acceptance",
      "Comparison with relatives/neighbors",
      "Financial investment in education",
    ],
    supportStrategies: [
      "Acknowledge the real pressure while promoting balance",
      "Validate feelings without dismissing family expectations",
      "Suggest gradual conversations with family",
      "Provide study-life balance techniques",
    ],
  },
  family: {
    name: "Family Dynamics",
    stressors: [
      "Arranged marriage pressure",
      "Career vs family expectations",
      "Living with extended family",
      "Financial responsibilities",
      "Gender role expectations",
      "Religious/cultural obligations",
    ],
    culturalFactors: [
      "Respect for elders and hierarchy",
      "Collective decision making",
      "Family reputation concerns",
      "Traditional gender roles",
      "Joint family dynamics",
    ],
    supportStrategies: [
      "Respect family values while promoting individual wellbeing",
      "Suggest diplomatic communication approaches",
      "Acknowledge cultural obligations while setting boundaries",
      "Provide culturally appropriate coping mechanisms",
    ],
  },
  social: {
    name: "Social Expectations",
    stressors: [
      "Marriage and relationship pressure",
      "Social media comparison",
      "Economic status anxiety",
      "Caste/community expectations",
      "Language and cultural identity",
      "Urban vs rural adaptation",
    ],
    culturalFactors: [
      "Community judgment and gossip",
      "Traditional vs modern value conflicts",
      "Regional and linguistic diversity",
      "Economic disparity awareness",
    ],
    supportStrategies: [
      "Validate identity struggles",
      "Promote authentic self-expression within cultural bounds",
      "Address internalized social pressures",
      "Encourage healthy social connections",
    ],
  },
  spiritual: {
    name: "Spiritual and Religious",
    stressors: [
      "Religious doubt or questioning",
      "Ritual and festival obligations",
      "Spiritual vs scientific worldview",
      "Community religious expectations",
      "Guilt around religious practices",
    ],
    culturalFactors: [
      "Deep spiritual traditions",
      "Religious diversity and tolerance",
      "Karma and dharma concepts",
      "Meditation and yoga heritage",
    ],
    supportStrategies: [
      "Respect spiritual beliefs while promoting mental health",
      "Integrate traditional practices with modern wellness",
      "Address spiritual conflicts with sensitivity",
      "Use familiar spiritual concepts for healing",
    ],
  },
}

const REGIONAL_ADAPTATIONS = {
  north: {
    regions: ["Delhi", "Punjab", "Haryana", "Uttar Pradesh", "Rajasthan"],
    characteristics: [
      "Strong family hierarchies",
      "Academic competition culture",
      "Traditional gender roles",
      "Business and government career focus",
    ],
    language: "Hindi/Punjabi/Urdu",
    festivals: ["Diwali", "Holi", "Karva Chauth", "Dussehra"],
    stressors: ["Dowry pressure", "Property disputes", "Political tensions"],
  },
  south: {
    regions: ["Tamil Nadu", "Karnataka", "Andhra Pradesh", "Kerala"],
    characteristics: [
      "Education-focused culture",
      "Technology industry influence",
      "Strong regional identity",
      "Progressive social movements",
    ],
    language: "Tamil/Telugu/Kannada/Malayalam",
    festivals: ["Pongal", "Onam", "Ugadi", "Dussehra"],
    stressors: ["Language preservation", "Migration for jobs", "Caste dynamics"],
  },
  west: {
    regions: ["Maharashtra", "Gujarat", "Goa", "Mumbai"],
    characteristics: [
      "Business and entrepreneurship culture",
      "Cosmopolitan outlook",
      "Film industry influence",
      "Economic opportunities",
    ],
    language: "Marathi/Gujarati/Hindi",
    festivals: ["Ganesh Chaturthi", "Navratri", "Gudi Padwa"],
    stressors: ["High cost of living", "Work-life balance", "Urban isolation"],
  },
  east: {
    regions: ["West Bengal", "Odisha", "Jharkhand", "Bihar"],
    characteristics: [
      "Intellectual and artistic traditions",
      "Political awareness",
      "Strong cultural identity",
      "Economic challenges",
    ],
    language: "Bengali/Hindi/Odia",
    festivals: ["Durga Puja", "Kali Puja", "Poila Boishakh"],
    stressors: ["Economic migration", "Political instability", "Cultural preservation"],
  },
  northeast: {
    regions: ["Assam", "Manipur", "Nagaland", "Mizoram"],
    characteristics: ["Tribal diversity", "Christian influence", "Unique cultural practices", "Geographic isolation"],
    language: "Assamese/Manipuri/English",
    festivals: ["Bihu", "Hornbill Festival", "Christmas"],
    stressors: ["Identity conflicts", "Limited opportunities", "Cultural preservation"],
  },
}

const LIFE_STAGE_ADAPTATIONS = {
  "high-school": {
    ageRange: "15-17",
    primaryStressors: ["Board exams", "Career choice pressure", "Peer relationships", "Body image"],
    culturalConcerns: [
      "Parental control over decisions",
      "Limited independence",
      "Academic performance pressure",
      "Future uncertainty",
    ],
    communicationStyle: "Supportive and encouraging, acknowledge lack of control over many decisions",
    resources: ["Study techniques", "Parent communication tips", "Peer pressure management"],
  },
  college: {
    ageRange: "18-22",
    primaryStressors: ["Career uncertainty", "Relationship issues", "Financial stress", "Independence struggles"],
    culturalConcerns: [
      "Balancing freedom with family expectations",
      "Dating and relationship secrecy",
      "Career vs passion conflicts",
      "Financial dependence on family",
    ],
    communicationStyle: "Respect growing independence while acknowledging family ties",
    resources: ["Career guidance", "Relationship advice", "Financial planning", "Independence skills"],
  },
  "young-professional": {
    ageRange: "22-25",
    primaryStressors: ["Work pressure", "Marriage expectations", "Financial responsibilities", "Life transitions"],
    culturalConcerns: [
      "Arranged marriage pressure",
      "Supporting family financially",
      "Work-life balance expectations",
      "Social status anxiety",
    ],
    communicationStyle: "Acknowledge adult responsibilities while promoting self-care",
    resources: ["Work stress management", "Marriage counseling", "Financial advice", "Life skills"],
  },
}

class CulturalAdaptationEngine {
  constructor() {
    this.userProfiles = new Map()
  }

  /**
   * Create or update user cultural profile
   * @param {string} userId - User identifier
   * @param {Object} profileData - Cultural profile information
   */
  updateUserProfile(userId, profileData) {
    const profile = {
      region: profileData.region || "general",
      lifeStage: profileData.lifeStage || "college",
      primaryStressors: profileData.primaryStressors || [],
      familyDynamics: profileData.familyDynamics || "traditional",
      religiousBackground: profileData.religiousBackground || "hindu",
      languages: profileData.languages || ["english", "hindi"],
      economicBackground: profileData.economicBackground || "middle-class",
      educationLevel: profileData.educationLevel || "undergraduate",
      livingArrangement: profileData.livingArrangement || "with-family",
      updatedAt: new Date().toISOString(),
    }

    this.userProfiles.set(userId, profile)
    return profile
  }

  /**
   * Get culturally adapted response for user message
   * @param {string} userId - User identifier
   * @param {string} baseResponse - Original AI response
   * @param {Object} context - Conversation context
   * @returns {Object} Culturally adapted response
   */
  adaptResponse(userId, baseResponse, context = {}) {
    const userProfile = this.userProfiles.get(userId)
    if (!userProfile) {
      return { adaptedResponse: baseResponse, adaptations: [] }
    }

    const adaptations = []
    let adaptedResponse = baseResponse

    // Apply regional adaptations
    const regionalContext = this.getRegionalContext(userProfile.region)
    if (regionalContext) {
      adaptedResponse = this.applyRegionalAdaptations(adaptedResponse, regionalContext, adaptations)
    }

    // Apply life stage adaptations
    const lifeStageContext = LIFE_STAGE_ADAPTATIONS[userProfile.lifeStage]
    if (lifeStageContext) {
      adaptedResponse = this.applyLifeStageAdaptations(adaptedResponse, lifeStageContext, adaptations)
    }

    // Apply cultural context adaptations
    const culturalContexts = this.identifyRelevantContexts(context.userMessage || "", userProfile)
    culturalContexts.forEach((contextKey) => {
      const culturalContext = CULTURAL_CONTEXTS[contextKey]
      if (culturalContext) {
        adaptedResponse = this.applyCulturalContextAdaptations(adaptedResponse, culturalContext, adaptations)
      }
    })

    // Apply language and communication style adaptations
    adaptedResponse = this.applyLanguageAdaptations(adaptedResponse, userProfile, adaptations)

    return {
      adaptedResponse,
      adaptations,
      culturalInsights: this.generateCulturalInsights(userProfile, context),
    }
  }

  /**
   * Get regional context based on user's region
   * @param {string} region - User's region
   * @returns {Object|null} Regional context
   */
  getRegionalContext(region) {
    for (const [key, regionalData] of Object.entries(REGIONAL_ADAPTATIONS)) {
      if (regionalData.regions.some((r) => region.toLowerCase().includes(r.toLowerCase()))) {
        return { key, ...regionalData }
      }
    }
    return null
  }

  /**
   * Apply regional cultural adaptations
   * @param {string} response - Response to adapt
   * @param {Object} regionalContext - Regional context
   * @param {Array} adaptations - Adaptations log
   * @returns {string} Adapted response
   */
  applyRegionalAdaptations(response, regionalContext, adaptations) {
    let adapted = response

    // Add regional festival references if appropriate
    const currentMonth = new Date().getMonth()
    const relevantFestivals = this.getSeasonalFestivals(regionalContext.festivals, currentMonth)

    if (relevantFestivals.length > 0 && Math.random() > 0.7) {
      // 30% chance to add festival context
      adapted += `\n\nWith ${relevantFestivals[0]} approaching, this can be both a joyful and stressful time. Remember to take care of yourself during the celebrations.`
      adaptations.push(`Added ${regionalContext.key} regional festival context`)
    }

    // Add regional language greeting occasionally
    if (Math.random() > 0.8) {
      // 20% chance
      const greetings = {
        north: "Namaste",
        south: "Vanakkam",
        west: "Namaskar",
        east: "Namaskar",
        northeast: "Hello",
      }
      const greeting = greetings[regionalContext.key]
      if (greeting && !adapted.includes(greeting)) {
        adapted = `${greeting}! ${adapted}`
        adaptations.push(`Added ${regionalContext.key} regional greeting`)
      }
    }

    return adapted
  }

  /**
   * Apply life stage specific adaptations
   * @param {string} response - Response to adapt
   * @param {Object} lifeStageContext - Life stage context
   * @param {Array} adaptations - Adaptations log
   * @returns {string} Adapted response
   */
  applyLifeStageAdaptations(response, lifeStageContext, adaptations) {
    let adapted = response

    // Adjust communication style based on life stage
    if (lifeStageContext.communicationStyle) {
      // This would involve more sophisticated NLP in a real implementation
      // For now, we add contextual acknowledgments
      if (lifeStageContext.ageRange === "15-17" && !adapted.includes("understand") && Math.random() > 0.6) {
        adapted = adapted.replace(
          /^/,
          "I understand that as a young person, you might feel like you don't have much control over many situations. ",
        )
        adaptations.push("Added high school life stage acknowledgment")
      }
    }

    return adapted
  }

  /**
   * Apply cultural context specific adaptations
   * @param {string} response - Response to adapt
   * @param {Object} culturalContext - Cultural context
   * @param {Array} adaptations - Adaptations log
   * @returns {string} Adapted response
   */
  applyCulturalContextAdaptations(response, culturalContext, adaptations) {
    let adapted = response

    // Add culturally relevant coping strategies
    if (culturalContext.supportStrategies && Math.random() > 0.5) {
      const strategy =
        culturalContext.supportStrategies[Math.floor(Math.random() * culturalContext.supportStrategies.length)]
      adapted += `\n\nA culturally mindful approach: ${strategy}`
      adaptations.push(`Added ${culturalContext.name} cultural strategy`)
    }

    return adapted
  }

  /**
   * Apply language and communication adaptations
   * @param {string} response - Response to adapt
   * @param {Object} userProfile - User profile
   * @param {Array} adaptations - Adaptations log
   * @returns {string} Adapted response
   */
  applyLanguageAdaptations(response, userProfile, adaptations) {
    let adapted = response

    // Add Hindi/regional language terms occasionally
    if (userProfile.languages.includes("hindi") && Math.random() > 0.7) {
      const hindiTerms = {
        family: "parivaar",
        respect: "sammaan",
        strength: "shakti",
        peace: "shanti",
        support: "sahayata",
        courage: "himmat",
      }

      Object.entries(hindiTerms).forEach(([english, hindi]) => {
        if (adapted.includes(english) && Math.random() > 0.8) {
          adapted = adapted.replace(new RegExp(`\\b${english}\\b`, "gi"), `${english} (${hindi})`)
          adaptations.push(`Added Hindi translation for ${english}`)
        }
      })
    }

    return adapted
  }

  /**
   * Identify relevant cultural contexts from user message
   * @param {string} message - User message
   * @param {Object} userProfile - User profile
   * @returns {Array} Relevant cultural context keys
   */
  identifyRelevantContexts(message, userProfile) {
    const contexts = []
    const lowerMessage = message.toLowerCase()

    // Academic context
    if (
      lowerMessage.includes("exam") ||
      lowerMessage.includes("study") ||
      lowerMessage.includes("marks") ||
      lowerMessage.includes("college") ||
      lowerMessage.includes("career")
    ) {
      contexts.push("academic")
    }

    // Family context
    if (
      lowerMessage.includes("family") ||
      lowerMessage.includes("parents") ||
      lowerMessage.includes("marriage") ||
      lowerMessage.includes("home")
    ) {
      contexts.push("family")
    }

    // Social context
    if (
      lowerMessage.includes("friends") ||
      lowerMessage.includes("social") ||
      lowerMessage.includes("society") ||
      lowerMessage.includes("community")
    ) {
      contexts.push("social")
    }

    // Spiritual context
    if (
      lowerMessage.includes("god") ||
      lowerMessage.includes("prayer") ||
      lowerMessage.includes("temple") ||
      lowerMessage.includes("spiritual")
    ) {
      contexts.push("spiritual")
    }

    return contexts
  }

  /**
   * Generate cultural insights for the user
   * @param {Object} userProfile - User profile
   * @param {Object} context - Conversation context
   * @returns {Array} Cultural insights
   */
  generateCulturalInsights(userProfile, context) {
    const insights = []

    // Life stage insights
    const lifeStage = LIFE_STAGE_ADAPTATIONS[userProfile.lifeStage]
    if (lifeStage) {
      insights.push({
        type: "life-stage",
        message: `As someone in the ${lifeStage.ageRange} age group, it's common to experience ${lifeStage.primaryStressors.slice(0, 2).join(" and ")}.`,
      })
    }

    // Regional insights
    const regionalContext = this.getRegionalContext(userProfile.region)
    if (regionalContext) {
      insights.push({
        type: "regional",
        message: `In ${regionalContext.key} India, ${regionalContext.characteristics[0].toLowerCase()} is often a significant cultural factor.`,
      })
    }

    return insights
  }

  /**
   * Get seasonal festivals for current time
   * @param {Array} festivals - Regional festivals
   * @param {number} month - Current month (0-11)
   * @returns {Array} Relevant festivals
   */
  getSeasonalFestivals(festivals, month) {
    const seasonalFestivals = {
      0: ["Makar Sankranti"], // January
      1: ["Vasant Panchami"], // February
      2: ["Holi"], // March
      3: ["Ram Navami"], // April
      4: ["Buddha Purnima"], // May
      5: ["Rath Yatra"], // June
      6: ["Guru Purnima"], // July
      7: ["Raksha Bandhan"], // August
      8: ["Ganesh Chaturthi"], // September
      9: ["Navratri", "Dussehra"], // October
      10: ["Diwali", "Karva Chauth"], // November
      11: ["Christmas"], // December
    }

    const currentSeasonFestivals = seasonalFestivals[month] || []
    return festivals.filter((festival) => currentSeasonFestivals.some((sf) => festival.includes(sf)))
  }

  /**
   * Get cultural profile suggestions based on user input
   * @param {string} userInput - User's cultural information
   * @returns {Object} Suggested profile
   */
  suggestCulturalProfile(userInput) {
    const input = userInput.toLowerCase()
    const suggestions = {
      region: "general",
      lifeStage: "college",
      primaryStressors: [],
      familyDynamics: "traditional",
    }

    // Detect region
    Object.entries(REGIONAL_ADAPTATIONS).forEach(([key, data]) => {
      if (data.regions.some((region) => input.includes(region.toLowerCase()))) {
        suggestions.region = key
      }
    })

    // Detect life stage
    if (input.includes("school") || input.includes("12th") || input.includes("board")) {
      suggestions.lifeStage = "high-school"
    } else if (input.includes("college") || input.includes("university") || input.includes("student")) {
      suggestions.lifeStage = "college"
    } else if (input.includes("job") || input.includes("work") || input.includes("professional")) {
      suggestions.lifeStage = "young-professional"
    }

    // Detect stressors
    Object.entries(CULTURAL_CONTEXTS).forEach(([key, context]) => {
      if (context.stressors.some((stressor) => input.includes(stressor.toLowerCase()))) {
        suggestions.primaryStressors.push(key)
      }
    })

    return suggestions
  }
}

// Export singleton instance
const culturalAdaptationEngine = new CulturalAdaptationEngine()

export default culturalAdaptationEngine
export { CulturalAdaptationEngine, CULTURAL_CONTEXTS, REGIONAL_ADAPTATIONS, LIFE_STAGE_ADAPTATIONS }
