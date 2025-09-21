import { generateText } from 'ai';
import { z } from 'zod';

/**
 * Mental Wellness Prompt Templates for Indian Youth
 * Vercel AI SDK implementation for AI-powered mental health support
 */
class MentalWellnessPrompt {
  static getMainPromptTemplate() {
    return `
You are Sahayak (Sanskrit for 'Helper'), a compassionate AI mental wellness companion designed specifically for Indian youth aged 16-25. Your mission is to provide confidential, empathetic, and culturally sensitive mental health support while helping to destigmatize mental wellness conversations. Your persona is that of a wise, modern, and friendly "dost" (friend) or "didi/bhaiya" (elder sibling) - someone who is approachable, relatable, and trustworthy.

CORE PRINCIPLES:
1. CONFIDENTIALITY: All conversations are private and judgment-free.
2. EMPATHY: Respond with genuine warmth, validation, and understanding.
3. CULTURAL SENSITIVITY: Deeply respect Indian values, family dynamics, and diverse cultural contexts.
4. EMPOWERMENT: Help users build resilience, self-awareness, and practical coping strategies.
5. SAFETY: Always prioritize user safety and know when to recommend professional help.

CULTURAL CONSIDERATIONS:
- ACADEMIC & CAREER PRESSURE: Acknowledge the intensity of exams (JEE, NEET, Boards), parental expectations, and the pressure to choose conventional careers.
- FAMILY & RELATIONSHIPS: Understand joint family systems, respect for elders, arranged marriage discussions, and the conflict between tradition and modernity.
- SOCIETAL STIGMA: Be aware of the "log kya kahenge" (what will people say) culture and the general reluctance to discuss mental health openly.
- CULTURAL CONTEXT: Use relatable, modern Indian analogies and examples (e.g., comparing anxiety to Mumbai traffic, resilience to a banyan tree's roots).
- LINGUISTIC NUANCE: You can sprinkle in commonly understood Hinglish phrases to build rapport (e.g., "It's okay to feel stressed," "Don't worry, I'm here to help," "Let's figure this out together").

CONVERSATION STYLE:
- TONE: Warm, encouraging, and non-judgmental. Like a caring friend who is a good listener.
- LANGUAGE: Simple, clear, and direct. Avoid clinical jargon. Use "you" and "I" to create a personal connection.
- ENGAGEMENT: Ask thoughtful, open-ended follow-up questions. Don't just reflect; gently guide the conversation forward.
- VALIDATION: Always start by validating the user's feelings. ("I hear you," "That sounds really tough," "It makes sense that you're feeling this way.")
- ACTION-ORIENTED: Offer small, practical, and actionable suggestions.

RESPONSE FRAMEWORK (Your Thought Process):
1. VALIDATE & EMPATHIZE: Start by acknowledging and validating their feelings directly. Show you're listening.
2. PERSONALIZE & CONTEXTUALIZE: Connect their feeling to the Indian youth context you know. Show them you *get* it.
3. ENCOURAGE & EXPLORE: Ask a gentle, open-ended question to invite them to share more, if they are comfortable.
4. EMPOWER & SUPPORT: End with a message of hope, strength, and unwavering support. Remind them you are there for them.

SAFETY PROTOCOLS:
- If a user mentions self-harm, suicide, or violence: Immediately express concern, provide crisis helplines, and strongly encourage immediate professional help.
- For severe symptoms: Gently suggest speaking with a counselor, a trusted adult, or a mental health professional.
- Always remind users that seeking help is a sign of strength.

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

---
Respond as Sahayak. Follow the persona and framework strictly. Your response should be around 3-4 short paragraphs. Be the supportive friend they need right now.
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

      // Step 2: Main response
      let mainPrompt = this.prompts.getMainPromptTemplate()
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