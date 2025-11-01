import { generateText } from 'ai';
import { z } from 'zod';

/**
 * Mental Wellness Prompt Templates for Indian Youth
 * Vercel AI SDK implementation for AI-powered mental health support
 */
class MentalWellnessPrompt {
  static getMainPromptTemplate() {
    return `
YOU ARE SAHAYAK, A MENTAL HEALTH AI ASSISTANT designed for Indian youth aged 16-25.

Your personality: You're like that one best friend everyone needs - warm, direct, real, and caring without the BS. You talk like you genuinely care (because you do), you listen without judgment, and you keep it real. You're not here to sugarcoat life or give empty motivational speeches. You're here to actually help.

CULTURAL CONTEXT:
{culturalContext}

LOCATION & RESOURCES:
State: {userState}
City: {userCity}
{localResources}

LANGUAGE AWARENESS:
Primary languages: {languagePreferences}
Detected languages in message: {detectedLanguages}

IMPORTANT - MULTILINGUAL UNDERSTANDING:
- The user may mix English with Hindi, Tamil, Bengali, Marathi, Telugu, or other Indian languages
- If you see words like "pareshaan" (troubled), "udaas" (sad), "tension" (worry), "akela" (lonely) - acknowledge you understand
- Respond primarily in English/Hinglish but show you recognize their language
- When they use emotional words in their native language, it often means they're expressing something deeply felt
- Example phrases to recognize:
  Hindi: "bahut pareshaan hoon" (very troubled), "samajh nahi aa raha" (not understanding)
  Bengali: "bhalo nei" (not good), "chinta hoche" (worrying)
  Tamil: "kashdam" (difficulty), "bayam" (fear)
  Marathi: "dukh" (sadness), "chinta" (worry)
  Telugu: "badha" (suffering), "tension"

Your communication style:
- Be DIRECT but caring - no long paragraphs unless absolutely necessary
- Talk like you're texting a close friend who's going through something
- Use "you" and "I" - make it personal
- Ask questions that actually matter
- Give practical advice, not just "you got this" platitudes
- Use simple language - drop the therapy speak
- Be genuine - if something sucks, acknowledge it sucks
- Sprinkle in Hinglish naturally if it fits
- If they use regional language phrases, acknowledge it warmly

What you do:
1. LISTEN without the fake positivity
2. VALIDATE - their feelings make sense given their situation
3. GET REAL - connect to their actual life context
4. ASK what they need - don't assume
5. SUPPORT with actual next steps

Academic/Career stuff:
You know the pressure is REAL. JEE, NEET, Boards, family expectations, the whole "log kya kahenge" thing. Don't minimize it.

Family drama:
You get joint families, arranged marriage talks, respecting elders while trying to live your own life. It's complicated.

When someone needs professional help:
Be straight up about it. Mental health stigma is real but so is getting better.

CRISIS RESOURCES (always have these ready):
{crisisHelplines}

CULTURAL WELLNESS SUGGESTIONS (use when appropriate):
{culturalWellness}

CONTEXT FOR THIS CONVERSATION:
Life stage: {userAgeContext}
Cultural preferences: {culturalPreferences}
Recent conversation: {conversationHistory}
Current mood indicators: {moodIndicators}
Emotional context from language: {emotionalContext}

User just said: {userInput}

---
Respond as SAHAYAK. Keep it short (2-3 sentences max unless they really need more). Be the friend they need right now, not a textbook. If they used words in their regional language, acknowledge that you understand.
`;
  }

  static getCrisisDetectionPrompt() {
    return `
Analyze the following message from a young person for crisis indicators. Look for signs of:
- Suicidal ideation or self-harm mentions
- Severe depression or hopelessness
- Abuse or violence
- Substance abuse
- Eating disorders
- Psychotic symptoms

Message: "{userInput}"
Previous context: "{context}"

Classify the urgency level based on the provided schema.
`;
  }
}

/**
 * Mental Wellness Chain for processing user interactions
 */
class MentalWellnessChain {
  constructor(llm) {
    this.llm = llm;
    this.prompts = MentalWellnessPrompt;
  }

  async processUserMessage(userInput, context = {}) {
    try {
      // Step 1: Crisis detection - simplified approach
      const crisisDetectionPrompt = this.prompts.getCrisisDetectionPrompt()
        .replace('{userInput}', userInput)
        .replace('{context}', context.conversationHistory || '') + 
        '\n\nPlease respond with just one word: CRISIS, HIGH, MODERATE, or LOW based on the urgency level.';

      const crisisResult = await generateText({
        model: this.llm,
        prompt: crisisDetectionPrompt,
      });
      
      const crisisLevel = this._parseCrisisLevel(crisisResult.text);

      // Step 2: Prepare cultural context from user profile
      const culturalContext = this._buildCulturalContext(context.userProfile);
      const languagePreferences = this._buildLanguagePreferences(context.userProfile);

      // Step 3: Main response
      let mainPrompt = this.prompts.getMainPromptTemplate()
        .replace('{culturalContext}', culturalContext)
        .replace('{languagePreferences}', languagePreferences)
        .replace('{userAgeContext}', context.ageContext || 'college student')
        .replace('{conversationHistory}', context.conversationHistory || '')
        .replace('{moodIndicators}', context.moodIndicators || '')
        .replace('{userInput}', userInput);

      if (crisisLevel === 'CRISIS' || crisisLevel === 'HIGH') {
          mainPrompt += "\nIMPORTANT: This user is in a high-risk state. Prioritize safety and providing crisis resources in your response.";
      }

      const { text: response } = await generateText({
        model: this.llm,
        prompt: mainPrompt,
      });

      return {
        crisisLevel: crisisLevel,
        response: response,
        timestamp: context.timestamp || new Date().toISOString(),
        followUpNeeded: this._determineFollowUp(crisisLevel),
        sessionId: context.sessionId
      };

    } catch (error) {
      console.error('Error processing user message:', error);
      return {
        error: 'Processing failed',
        response: this._getFallbackResponse(),
        crisisLevel: 'UNKNOWN',
        timestamp: new Date().toISOString()
      };
    }
  }

  _parseCrisisLevel(text) {
    const upperText = text.toUpperCase().trim();
    if (upperText.includes('CRISIS')) return 'CRISIS';
    if (upperText.includes('HIGH')) return 'HIGH';
    if (upperText.includes('MODERATE')) return 'MODERATE';
    if (upperText.includes('LOW')) return 'LOW';
    
    // Default to LOW if no clear classification
    return 'LOW';
  }

  _determineFollowUp(crisisLevel) {
    return ['CRISIS', 'HIGH'].includes(crisisLevel);
  }

  _getFallbackResponse() {
    return `I'm here to listen and support you. While I'm having some technical difficulties right now, please know that your feelings are valid and you're not alone. 

If you're in immediate distress, please reach out to:
- National Suicide Prevention: 9152987821
- AASRA: 9820466726
- Vandrevala Foundation: 9999666555

Is there something specific you'd like to talk about right now?`;
  }

  _buildCulturalContext(userProfile) {
    if (!userProfile || Object.keys(userProfile).length === 0) {
      return "User has not provided cultural context yet.";
    }

    const contextParts = [];
    
    if (userProfile.region) {
      contextParts.push(`User is from ${userProfile.region} India`);
    }
    
    if (userProfile.lifeStage) {
      contextParts.push(`Currently in ${userProfile.lifeStage.replace('-', ' ')} stage of life`);
    }
    
    if (userProfile.familyDynamics) {
      const familyDesc = {
        traditional: "traditional family with strong hierarchy",
        modern: "modern family with open communication", 
        mixed: "family blending traditional and modern values",
        independent: "living independently from family"
      };
      contextParts.push(`Living with ${familyDesc[userProfile.familyDynamics] || userProfile.familyDynamics}`);
    }
    
    if (userProfile.primaryStressors && userProfile.primaryStressors.length > 0) {
      const stressors = userProfile.primaryStressors.join(', ');
      contextParts.push(`Main concern areas: ${stressors}`);
    }
    
    return contextParts.length > 0 ? contextParts.join('. ') + '.' : "Basic cultural context available.";
  }

  _buildLanguagePreferences(userProfile) {
    if (!userProfile || !userProfile.languages || userProfile.languages.length === 0) {
      return "User is comfortable with English.";
    }
    
    const langs = userProfile.languages.map(lang => {
      return lang.charAt(0).toUpperCase() + lang.slice(1);
    }).join(', ');
    
    const hinglishNote = userProfile.languages.includes('hindi') ? 
      " Feel free to use Hinglish phrases naturally." : "";
    
    return `User is comfortable with: ${langs}.${hinglishNote}`;
  }
}

/**
 * Factory function to create a properly configured mental wellness chain
 */
function createMentalWellnessChain(llm, deploymentType = 'webApp', customConfig = {}) {
  const chain = new MentalWellnessChain(llm);
  const config = { ...customConfig };
  return { chain, config };
}

// Export the main classes and functions
export {
  MentalWellnessPrompt,
  MentalWellnessChain,
  createMentalWellnessChain,
};