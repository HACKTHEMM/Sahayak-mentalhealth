"use client"

import { useState, useCallback } from "react"

export function useCrisisDetection() {
  const [crisisLevel, setCrisisLevel] = useState(null)
  const [crisisHistory, setCrisisHistory] = useState([])
  const [isMonitoring, setIsMonitoring] = useState(true)

  const analyzeCrisisLevel = useCallback(
    (crisisAssessment) => {
      if (!crisisAssessment || !isMonitoring) return null

      const assessment = crisisAssessment.toUpperCase()
      let level = "LOW"

      if (assessment.includes("CRISIS")) {
        level = "CRISIS"
      } else if (assessment.includes("HIGH")) {
        level = "HIGH"
      } else if (assessment.includes("MODERATE")) {
        level = "MODERATE"
      }

      // Log crisis event for tracking
      if (level !== "LOW") {
        const crisisEvent = {
          level,
          timestamp: new Date().toISOString(),
          assessment: crisisAssessment,
          id: Math.random().toString(36).slice(2),
        }

        setCrisisHistory((prev) => [crisisEvent, ...prev.slice(0, 9)]) // Keep last 10 events
        setCrisisLevel(level)

        // Auto-escalate if multiple high-risk events in short time
        if (level === "HIGH" || level === "CRISIS") {
          console.log("[Crisis Detection] High-risk event detected:", crisisEvent)
        }
      } else {
        setCrisisLevel(null)
      }

      return level
    },
    [isMonitoring],
  )

  const dismissCrisisAlert = useCallback(() => {
    setCrisisLevel(null)
  }, [])

  const toggleMonitoring = useCallback(() => {
    setIsMonitoring((prev) => !prev)
    if (!isMonitoring) {
      setCrisisLevel(null)
    }
  }, [isMonitoring])

  const getCrisisStats = useCallback(() => {
    const last24h = crisisHistory.filter((event) => new Date() - new Date(event.timestamp) < 24 * 60 * 60 * 1000)

    return {
      total: crisisHistory.length,
      last24h: last24h.length,
      highRisk: crisisHistory.filter((e) => e.level === "CRISIS" || e.level === "HIGH").length,
      lastEvent: crisisHistory[0] || null,
    }
  }, [crisisHistory])

  return {
    crisisLevel,
    crisisHistory,
    isMonitoring,
    analyzeCrisisLevel,
    dismissCrisisAlert,
    toggleMonitoring,
    getCrisisStats,
  }
}
