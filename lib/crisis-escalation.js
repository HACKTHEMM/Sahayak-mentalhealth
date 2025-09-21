/**
 * Crisis Escalation System
 * Handles automatic escalation and logging of crisis situations
 */

class CrisisEscalationManager {
  constructor(config = {}) {
    this.config = {
      escalationThreshold: 2, // Number of high-risk events to trigger escalation
      timeWindow: 60 * 60 * 1000, // 1 hour in milliseconds
      enableLogging: true,
      enableNotifications: false,
      ...config,
    }
    this.events = []
  }

  /**
   * Process a crisis assessment and determine if escalation is needed
   * @param {Object} assessment - Crisis assessment result
   * @param {Object} context - User context and session info
   * @returns {Object} Escalation decision and actions
   */
  async processCrisisEvent(assessment, context = {}) {
    const event = {
      id: Math.random().toString(36).slice(2),
      timestamp: new Date().toISOString(),
      level: this._extractCrisisLevel(assessment.crisisLevel),
      sessionId: context.sessionId,
      userId: context.userId,
      assessment: assessment.crisisLevel,
      followUpNeeded: assessment.followUpNeeded,
    }

    // Add to event history
    this.events.unshift(event)
    this.events = this.events.slice(0, 100) // Keep last 100 events

    // Log the event
    if (this.config.enableLogging) {
      this._logCrisisEvent(event)
    }

    // Check if escalation is needed
    const escalationDecision = this._shouldEscalate(event)

    if (escalationDecision.shouldEscalate) {
      await this._executeEscalation(event, escalationDecision, context)
    }

    return {
      event,
      escalationDecision,
      recommendations: this._getRecommendations(event),
    }
  }

  /**
   * Extract crisis level from assessment text
   * @param {string} assessment - Crisis assessment text
   * @returns {string} Normalized crisis level
   */
  _extractCrisisLevel(assessment) {
    if (!assessment) return "LOW"

    const text = assessment.toUpperCase()
    if (text.includes("CRISIS")) return "CRISIS"
    if (text.includes("HIGH")) return "HIGH"
    if (text.includes("MODERATE")) return "MODERATE"
    return "LOW"
  }

  /**
   * Determine if escalation is needed based on event history
   * @param {Object} currentEvent - Current crisis event
   * @returns {Object} Escalation decision
   */
  _shouldEscalate(currentEvent) {
    const decision = {
      shouldEscalate: false,
      reason: "",
      urgency: "low",
      actions: [],
    }

    // Immediate escalation for CRISIS level
    if (currentEvent.level === "CRISIS") {
      decision.shouldEscalate = true
      decision.reason = "Immediate crisis detected"
      decision.urgency = "immediate"
      decision.actions = ["immediate_intervention", "crisis_resources", "professional_referral"]
      return decision
    }

    // Check for pattern of high-risk events
    const recentEvents = this.events.filter(
      (event) =>
        new Date() - new Date(event.timestamp) < this.config.timeWindow &&
        (event.level === "HIGH" || event.level === "CRISIS") &&
        event.sessionId === currentEvent.sessionId,
    )

    if (recentEvents.length >= this.config.escalationThreshold) {
      decision.shouldEscalate = true
      decision.reason = `${recentEvents.length} high-risk events in ${this.config.timeWindow / (60 * 1000)} minutes`
      decision.urgency = "high"
      decision.actions = ["professional_referral", "follow_up_scheduling", "resource_provision"]
    }

    return decision
  }

  /**
   * Execute escalation procedures
   * @param {Object} event - Crisis event
   * @param {Object} decision - Escalation decision
   * @param {Object} context - User context
   */
  async _executeEscalation(event, decision, context) {
    console.log("[Crisis Escalation] Executing escalation:", {
      eventId: event.id,
      level: event.level,
      reason: decision.reason,
      urgency: decision.urgency,
      actions: decision.actions,
    })

    // Execute each escalation action
    for (const action of decision.actions) {
      try {
        await this._executeAction(action, event, context)
      } catch (error) {
        console.error(`[Crisis Escalation] Failed to execute action ${action}:`, error)
      }
    }
  }

  /**
   * Execute a specific escalation action
   * @param {string} action - Action to execute
   * @param {Object} event - Crisis event
   * @param {Object} context - User context
   */
  async _executeAction(action, event, context) {
    switch (action) {
      case "immediate_intervention":
        // In a real implementation, this would alert crisis counselors
        console.log("[Crisis Escalation] IMMEDIATE INTERVENTION NEEDED:", {
          sessionId: event.sessionId,
          timestamp: event.timestamp,
        })
        break

      case "crisis_resources":
        // Ensure crisis resources are prominently displayed
        console.log("[Crisis Escalation] Displaying crisis resources")
        break

      case "professional_referral":
        // Generate professional referral recommendations
        console.log("[Crisis Escalation] Professional referral recommended")
        break

      case "follow_up_scheduling":
        // Schedule follow-up check-ins
        console.log("[Crisis Escalation] Scheduling follow-up check-ins")
        break

      case "resource_provision":
        // Provide additional mental health resources
        console.log("[Crisis Escalation] Providing additional resources")
        break

      default:
        console.warn(`[Crisis Escalation] Unknown action: ${action}`)
    }
  }

  /**
   * Get recommendations based on crisis event
   * @param {Object} event - Crisis event
   * @returns {Array} Array of recommendations
   */
  _getRecommendations(event) {
    const recommendations = []

    switch (event.level) {
      case "CRISIS":
        recommendations.push(
          "Immediate professional intervention required",
          "Display crisis hotlines prominently",
          "Consider emergency services if appropriate",
          "Provide immediate coping strategies",
        )
        break

      case "HIGH":
        recommendations.push(
          "Strongly recommend professional help",
          "Provide crisis resources",
          "Schedule follow-up within 24 hours",
          "Monitor conversation closely",
        )
        break

      case "MODERATE":
        recommendations.push(
          "Offer additional support resources",
          "Check in within 48-72 hours",
          "Provide coping strategies",
          "Monitor for escalation",
        )
        break

      default:
        recommendations.push("Continue supportive conversation", "Provide general wellness resources")
    }

    return recommendations
  }

  /**
   * Log crisis event for audit and analysis
   * @param {Object} event - Crisis event to log
   */
  _logCrisisEvent(event) {
    // In a real implementation, this would log to a secure, HIPAA-compliant system
    console.log("[Crisis Detection] Event logged:", {
      id: event.id,
      timestamp: event.timestamp,
      level: event.level,
      sessionId: event.sessionId,
      // Note: Actual assessment content should be logged securely
    })
  }

  /**
   * Get crisis statistics for monitoring
   * @returns {Object} Crisis statistics
   */
  getCrisisStats() {
    const now = new Date()
    const last24h = this.events.filter((e) => now - new Date(e.timestamp) < 24 * 60 * 60 * 1000)
    const lastWeek = this.events.filter((e) => now - new Date(e.timestamp) < 7 * 24 * 60 * 60 * 1000)

    return {
      total: this.events.length,
      last24h: last24h.length,
      lastWeek: lastWeek.length,
      byLevel: {
        crisis: this.events.filter((e) => e.level === "CRISIS").length,
        high: this.events.filter((e) => e.level === "HIGH").length,
        moderate: this.events.filter((e) => e.level === "MODERATE").length,
        low: this.events.filter((e) => e.level === "LOW").length,
      },
      escalations: this.events.filter((e) => e.escalated).length,
    }
  }
}

// Export singleton instance
const crisisEscalationManager = new CrisisEscalationManager({
  escalationThreshold: 2,
  timeWindow: 60 * 60 * 1000, // 1 hour
  enableLogging: true,
  enableNotifications: false,
})

export default crisisEscalationManager
export { CrisisEscalationManager }
