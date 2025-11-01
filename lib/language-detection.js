/**
 * Language Detection and Multilingual Response System
 * Detects phrases in Indian languages and provides contextual responses
 */

// Common phrases and keywords in Indian languages
const LANGUAGE_PATTERNS = {
  hindi: {
    name: "Hindi",
    script: "Devanagari",
    patterns: [
      // Greetings
      { text: /namaste|namaskar|pranam/i, meaning: "hello/greetings", context: "greeting" },
      { text: /kaise ho|kaisi ho|kya haal hai/i, meaning: "how are you", context: "greeting" },
      
      // Mental health expressions
      { text: /pareshaan|pareshan/i, meaning: "troubled/worried", context: "distress" },
      { text: /udaas|udas|dukhi/i, meaning: "sad/unhappy", context: "mood" },
      { text: /tension|chinta|fikar/i, meaning: "worry/anxiety", context: "anxiety" },
      { text: /dar|darr|ghabra/i, meaning: "fear/scared", context: "fear" },
      { text: /akela|akeli|tanha|tanhayi/i, meaning: "lonely/loneliness", context: "loneliness" },
      { text: /thak gaya|thak gayi|thaka hua/i, meaning: "tired/exhausted", context: "fatigue" },
      { text: /gussa|krodh|ghussa/i, meaning: "anger/rage", context: "anger" },
      { text: /khush|khushi|khushal/i, meaning: "happy/happiness", context: "positive" },
      
      // Family & relationships
      { text: /maa|mummy|amma/i, meaning: "mother", context: "family" },
      { text: /papa|baap|pita/i, meaning: "father", context: "family" },
      { text: /parivaar|ghar wale/i, meaning: "family", context: "family" },
      { text: /shaadi|vivah/i, meaning: "marriage", context: "relationships" },
      
      // Common expressions
      { text: /help|madad|sahayata/i, meaning: "help", context: "support" },
      { text: /samajh nahi aa raha|confuse/i, meaning: "confused/don't understand", context: "confusion" },
      { text: /kya karu|kya karun/i, meaning: "what should I do", context: "seeking_advice" },
      { text: /himmat|hausla|shakti/i, meaning: "courage/strength", context: "encouragement" },
      { text: /shanti|sukoon/i, meaning: "peace/calm", context: "peace" },
      { text: /bharosa|vishwas/i, meaning: "trust/faith", context: "trust" },
    ],
    responses: {
      greeting: "मैं समझता/समझती हूं। (I understand)",
      distress: "मैं यहां आपकी मदद के लिए हूं। (I'm here to help you)",
      support: "आप अकेले नहीं हैं। (You're not alone)",
      encouragement: "आपमें हिम्मत है। (You have courage)",
    }
  },
  
  bengali: {
    name: "Bengali",
    script: "Bengali",
    patterns: [
      // Greetings
      { text: /nomoshkar|nomaskar|namaskar/i, meaning: "hello/greetings", context: "greeting" },
      { text: /kemon acho|kemon achen/i, meaning: "how are you", context: "greeting" },
      
      // Mental health expressions
      { text: /dukkhito|dukkho|koshto/i, meaning: "sad/pain", context: "distress" },
      { text: /chinta|chintito|tension/i, meaning: "worry/anxiety", context: "anxiety" },
      { text: /bhoy|bhoi|voy/i, meaning: "fear", context: "fear" },
      { text: /ekla|ekaki/i, meaning: "lonely/alone", context: "loneliness" },
      { text: /khushi|anondo|ananda/i, meaning: "happy/joy", context: "positive" },
      { text: /rege gechi|raag/i, meaning: "angry/rage", context: "anger" },
      { text: /klanto|thaka/i, meaning: "tired/exhausted", context: "fatigue" },
      
      // Support expressions
      { text: /shahajyo|sahajyo|help/i, meaning: "help", context: "support" },
      { text: /bujhte parchi na/i, meaning: "don't understand", context: "confusion" },
      { text: /ki korbo|ki kori/i, meaning: "what should I do", context: "seeking_advice" },
    ],
    responses: {
      greeting: "আমি বুঝতে পারছি। (I understand)",
      distress: "আমি এখানে আপনাকে সাহায্য করতে আছি। (I'm here to help)",
      support: "আপনি একা নন। (You're not alone)",
    }
  },
  
  tamil: {
    name: "Tamil",
    script: "Tamil",
    patterns: [
      // Greetings
      { text: /vanakkam|vanakam/i, meaning: "hello/greetings", context: "greeting" },
      { text: /eppadi irukeenga|eppadi irukkinga/i, meaning: "how are you", context: "greeting" },
      
      // Mental health expressions
      { text: /kashdam|kashtam|vali/i, meaning: "pain/difficulty", context: "distress" },
      { text: /kavala|kavalaiyaana/i, meaning: "worry/anxiety", context: "anxiety" },
      { text: /bayam|payam/i, meaning: "fear", context: "fear" },
      { text: /thanimai|thaniya/i, meaning: "lonely/alone", context: "loneliness" },
      { text: /sandosham|santhosham|happy/i, meaning: "happy/joy", context: "positive" },
      { text: /kovam|koopam/i, meaning: "anger", context: "anger" },
      { text: /kashtam/i, meaning: "difficulty/problem", context: "problem" },
      
      // Support expressions
      { text: /uthavi|help/i, meaning: "help", context: "support" },
      { text: /puriyala|puriyavillai/i, meaning: "don't understand", context: "confusion" },
      { text: /enna seyya|enna seiyyalaam/i, meaning: "what to do", context: "seeking_advice" },
    ],
    responses: {
      greeting: "எனக்கு புரிகிறது। (I understand)",
      distress: "நான் உங்களுக்கு உதவ இங்கே இருக்கிறேன். (I'm here to help)",
      support: "நீங்கள் தனியாக இல்லை। (You're not alone)",
    }
  },
  
  marathi: {
    name: "Marathi",
    script: "Devanagari",
    patterns: [
      // Greetings
      { text: /namaskar|namaste/i, meaning: "hello/greetings", context: "greeting" },
      { text: /kasa aahes|kashi aahes/i, meaning: "how are you", context: "greeting" },
      
      // Mental health expressions
      { text: /dukh|dukhi|kashta/i, meaning: "sad/pain", context: "distress" },
      { text: /chinta|kaalataa/i, meaning: "worry/anxiety", context: "anxiety" },
      { text: /bhaiti|bhay/i, meaning: "fear", context: "fear" },
      { text: /ekta|ekoti/i, meaning: "lonely/alone", context: "loneliness" },
      { text: /khush|anand|aanandit/i, meaning: "happy/joy", context: "positive" },
      { text: /raag|raagatla/i, meaning: "angry", context: "anger" },
      
      // Support expressions
      { text: /madad|sahaayya/i, meaning: "help", context: "support" },
      { text: /samjat naahi/i, meaning: "don't understand", context: "confusion" },
      { text: /kaay karaaycha|kay karu/i, meaning: "what to do", context: "seeking_advice" },
    ],
    responses: {
      greeting: "मला समजले। (I understand)",
      distress: "मी तुमची मदत करण्यासाठी येथे आहे। (I'm here to help)",
      support: "तुम्ही एकटे नाही आहात। (You're not alone)",
    }
  },
  
  telugu: {
    name: "Telugu",
    script: "Telugu",
    patterns: [
      // Greetings
      { text: /namaskaram|namaskaaram/i, meaning: "hello/greetings", context: "greeting" },
      { text: /ela unnaru|ela unnav/i, meaning: "how are you", context: "greeting" },
      
      // Mental health expressions
      { text: /badha|badhapadutunna/i, meaning: "sad/suffering", context: "distress" },
      { text: /aagochana|chinta|tension/i, meaning: "worry/anxiety", context: "anxiety" },
      { text: /bhayam|bayam/i, meaning: "fear", context: "fear" },
      { text: /ooopiri aadatledu|oopiribatti/i, meaning: "can't breathe/anxious", context: "panic" },
      { text: /santosham|khushi/i, meaning: "happy/joy", context: "positive" },
      { text: /kopam|regi/i, meaning: "angry/rage", context: "anger" },
      
      // Support expressions
      { text: /sahayam|help/i, meaning: "help", context: "support" },
      { text: /ardham kavatledu/i, meaning: "don't understand", context: "confusion" },
      { text: /emi cheyyali/i, meaning: "what to do", context: "seeking_advice" },
    ],
    responses: {
      greeting: "నాకు అర్థమైంది। (I understand)",
      distress: "నేను మీకు సహాయం చేయడానికి ఇక్కడ ఉన్నాను। (I'm here to help)",
      support: "మీరు ఒంటరిగా లేరు। (You're not alone)",
    }
  }
}

// Romanized/Hinglish common patterns
const HINGLISH_PATTERNS = [
  { text: /bahut|boht|bhot/i, meaning: "very/a lot", intensity: "high" },
  { text: /thoda|thodi|zara/i, meaning: "a little", intensity: "low" },
  { text: /bilkul|ekdum/i, meaning: "absolutely/completely", intensity: "extreme" },
  { text: /kya baat|kya hua|kya problem/i, meaning: "what's the matter", context: "inquiry" },
  { text: /sach mein|sacchi|seriously/i, meaning: "really/truly", emphasis: true },
  { text: /bas yaar|yaar|bhai|behen/i, meaning: "friend/sibling", context: "informal_address" },
  { text: /ho jayega|ho jaega|manage hoga/i, meaning: "it will happen/work out", context: "reassurance" },
  { text: /nahi samajh aa raha|samajh nahi/i, meaning: "not understanding", context: "confusion" },
]

class LanguageDetector {
  /**
   * Detect languages present in user message
   * @param {string} message - User's message
   * @returns {Object} Detection results
   */
  detectLanguages(message) {
    const detections = []
    const matchedPhrases = []
    const contexts = new Set()

    // Check each language pattern
    Object.entries(LANGUAGE_PATTERNS).forEach(([langCode, langData]) => {
      langData.patterns.forEach((pattern) => {
        const match = message.match(pattern.text)
        if (match) {
          detections.push({
            language: langCode,
            languageName: langData.name,
            phrase: match[0],
            meaning: pattern.meaning,
            context: pattern.context,
          })
          matchedPhrases.push({
            original: match[0],
            meaning: pattern.meaning,
            language: langData.name,
          })
          contexts.add(pattern.context)
        }
      })
    })

    // Check Hinglish patterns
    const hinglishMatches = []
    HINGLISH_PATTERNS.forEach((pattern) => {
      const match = message.match(pattern.text)
      if (match) {
        hinglishMatches.push({
          phrase: match[0],
          meaning: pattern.meaning,
          context: pattern.context,
          intensity: pattern.intensity,
          emphasis: pattern.emphasis,
        })
      }
    })

    return {
      hasMultipleLanguages: detections.length > 0,
      detectedLanguages: [...new Set(detections.map(d => d.language))],
      languageNames: [...new Set(detections.map(d => d.languageName))],
      matchedPhrases,
      contexts: Array.from(contexts),
      hinglishDetected: hinglishMatches.length > 0,
      hinglishMatches,
      primaryLanguage: this.determinePrimaryLanguage(message, detections),
    }
  }

  /**
   * Determine primary language of message
   * @param {string} message - User's message
   * @param {Array} detections - Detected language patterns
   * @returns {string} Primary language code
   */
  determinePrimaryLanguage(message, detections) {
    // Count detections per language
    const langCounts = {}
    detections.forEach((d) => {
      langCounts[d.language] = (langCounts[d.language] || 0) + 1
    })

    // Return language with most detections, or 'english' as default
    const entries = Object.entries(langCounts)
    if (entries.length === 0) return 'english'
    
    entries.sort((a, b) => b[1] - a[1])
    return entries[0][0]
  }

  /**
   * Generate culturally appropriate response based on detected language
   * @param {Object} detection - Language detection results
   * @param {string} baseResponse - Original response
   * @returns {string} Enhanced response
   */
  enhanceWithLanguageContext(detection, baseResponse) {
    if (!detection.hasMultipleLanguages && !detection.hinglishDetected) {
      return baseResponse
    }

    let enhanced = baseResponse
    const acknowledgments = []

    // Add acknowledgment of detected languages
    if (detection.matchedPhrases.length > 0) {
      const phrase = detection.matchedPhrases[0]
      const langData = LANGUAGE_PATTERNS[detection.primaryLanguage]
      
      if (langData && langData.responses) {
        // Get appropriate response based on context
        const contextResponse = langData.responses[detection.contexts[0]] || langData.responses.support
        if (contextResponse) {
          acknowledgments.push(contextResponse)
        }
      }
    }

    // Add culturally appropriate acknowledgment
    if (acknowledgments.length > 0) {
      enhanced = `${acknowledgments[0]}\n\n${baseResponse}`
    }

    // Add note about understanding their language mix
    if (detection.hinglishDetected && detection.hasMultipleLanguages) {
      const languages = detection.languageNames.join(", ")
      enhanced += `\n\n*I notice you're mixing ${languages} with English - that's totally natural! Feel free to express yourself however feels most comfortable.*`
    }

    return enhanced
  }

  /**
   * Get empathy boost based on detected emotional context
   * @param {Object} detection - Language detection results
   * @returns {Object} Empathy indicators
   */
  getEmotionalContext(detection) {
    const emotionalSignals = {
      distress: 0,
      seeking_support: false,
      confusion: false,
      positive: false,
      urgent: false,
    }

    detection.contexts.forEach((context) => {
      switch (context) {
        case 'distress':
        case 'anxiety':
        case 'fear':
        case 'loneliness':
        case 'anger':
        case 'panic':
          emotionalSignals.distress += 1
          break
        case 'support':
        case 'seeking_advice':
          emotionalSignals.seeking_support = true
          break
        case 'confusion':
          emotionalSignals.confusion = true
          break
        case 'positive':
          emotionalSignals.positive = true
          break
      }
    })

    // Check Hinglish for intensity markers
    if (detection.hinglishMatches) {
      detection.hinglishMatches.forEach((match) => {
        if (match.intensity === 'high' || match.intensity === 'extreme') {
          emotionalSignals.distress += 0.5
        }
        if (match.emphasis) {
          emotionalSignals.urgent = true
        }
      })
    }

    return {
      ...emotionalSignals,
      distressLevel: emotionalSignals.distress > 2 ? 'high' : emotionalSignals.distress > 0 ? 'moderate' : 'low',
    }
  }

  /**
   * Get suggested response tone based on language detection
   * @param {Object} detection - Language detection results
   * @returns {Object} Response guidelines
   */
  getResponseGuidelines(detection) {
    const emotional = this.getEmotionalContext(detection)
    
    return {
      tone: emotional.distress > 1 ? 'empathetic-urgent' : emotional.positive ? 'warm-encouraging' : 'supportive-calm',
      includeNativePhrase: detection.hasMultipleLanguages,
      formalityLevel: detection.hinglishDetected ? 'informal' : 'moderate',
      emphasisNeeded: emotional.urgent,
      suggestProfessionalHelp: emotional.distressLevel === 'high',
      responseLength: emotional.seeking_support ? 'detailed' : 'concise',
    }
  }
}

// Singleton instance
const languageDetector = new LanguageDetector()

export default languageDetector
export { LanguageDetector, LANGUAGE_PATTERNS, HINGLISH_PATTERNS }
