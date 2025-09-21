"use client"

import { useState, useEffect, useCallback } from "react"

export function useMoodTracking() {
  const [moodHistory, setMoodHistory] = useState([])
  const [lastCheckIn, setLastCheckIn] = useState(null)
  const [moodTrends, setMoodTrends] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  // Load mood data from localStorage on mount
  useEffect(() => {
    try {
      const savedMoods = localStorage.getItem("mood-history")
      const savedCheckIn = localStorage.getItem("last-check-in")

      if (savedMoods) {
        const moods = JSON.parse(savedMoods)
        setMoodHistory(moods)
        calculateTrends(moods)
      }

      if (savedCheckIn) {
        setLastCheckIn(JSON.parse(savedCheckIn))
      }
    } catch (error) {
      console.error("Failed to load mood data:", error)
    }
  }, [])

  // Save mood data to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem("mood-history", JSON.stringify(moodHistory))
    } catch (error) {
      console.error("Failed to save mood data:", error)
    }
  }, [moodHistory])

  useEffect(() => {
    try {
      if (lastCheckIn) {
        localStorage.setItem("last-check-in", JSON.stringify(lastCheckIn))
      }
    } catch (error) {
      console.error("Failed to save check-in data:", error)
    }
  }, [lastCheckIn])

  const addMoodEntry = useCallback((moodEntry) => {
    const entry = {
      ...moodEntry,
      id: Math.random().toString(36).slice(2),
      timestamp: moodEntry.timestamp || new Date().toISOString(),
    }

    setMoodHistory((prev) => {
      const updated = [entry, ...prev].slice(0, 100) // Keep last 100 entries
      calculateTrends(updated)
      return updated
    })

    return entry
  }, [])

  const addCheckInEntry = useCallback((checkInData) => {
    const entry = {
      ...checkInData,
      id: Math.random().toString(36).slice(2),
      timestamp: checkInData.timestamp || new Date().toISOString(),
    }

    setLastCheckIn(entry)
    return entry
  }, [])

  const calculateTrends = useCallback((moods) => {
    if (moods.length < 2) {
      setMoodTrends(null)
      return
    }

    const moodValues = {
      struggling: 1,
      difficult: 2,
      okay: 3,
      good: 4,
      excellent: 5,
    }

    // Calculate trends for different time periods
    const now = new Date()
    const last7Days = moods.filter((m) => now - new Date(m.timestamp) <= 7 * 24 * 60 * 60 * 1000)
    const last30Days = moods.filter((m) => now - new Date(m.timestamp) <= 30 * 24 * 60 * 60 * 1000)

    const calculateAverage = (entries) => {
      if (entries.length === 0) return null
      const sum = entries.reduce((acc, entry) => acc + (moodValues[entry.mood] || 3), 0)
      return sum / entries.length
    }

    const trends = {
      overall: calculateAverage(moods.slice(0, 30)),
      last7Days: calculateAverage(last7Days),
      last30Days: calculateAverage(last30Days),
      totalEntries: moods.length,
      streak: calculateStreak(moods),
      patterns: identifyPatterns(moods),
    }

    setMoodTrends(trends)
  }, [])

  const calculateStreak = (moods) => {
    let streak = 0
    const today = new Date().toDateString()
    const currentDate = new Date()

    for (let i = 0; i < moods.length; i++) {
      const moodDate = new Date(moods[i].timestamp).toDateString()
      const expectedDate = currentDate.toDateString()

      if (moodDate === expectedDate) {
        streak++
        currentDate.setDate(currentDate.getDate() - 1)
      } else {
        break
      }
    }

    return streak
  }

  const identifyPatterns = (moods) => {
    if (moods.length < 7) return null

    const patterns = {
      bestDayOfWeek: null,
      worstDayOfWeek: null,
      timeOfDayTrends: null,
    }

    // Analyze day of week patterns
    const dayAverages = {}
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

    days.forEach((day, index) => {
      const dayMoods = moods.filter((m) => new Date(m.timestamp).getDay() === index)
      if (dayMoods.length > 0) {
        const moodValues = { struggling: 1, difficult: 2, okay: 3, good: 4, excellent: 5 }
        const average = dayMoods.reduce((acc, m) => acc + (moodValues[m.mood] || 3), 0) / dayMoods.length
        dayAverages[day] = average
      }
    })

    if (Object.keys(dayAverages).length > 0) {
      patterns.bestDayOfWeek = Object.keys(dayAverages).reduce((a, b) => (dayAverages[a] > dayAverages[b] ? a : b))
      patterns.worstDayOfWeek = Object.keys(dayAverages).reduce((a, b) => (dayAverages[a] < dayAverages[b] ? a : b))
    }

    return patterns
  }

  const getMoodInsights = useCallback(() => {
    if (!moodTrends || moodHistory.length < 3) return null

    const insights = []

    // Streak insights
    if (moodTrends.streak >= 7) {
      insights.push({
        type: "positive",
        message: `Great job! You've been tracking your mood for ${moodTrends.streak} days in a row.`,
      })
    }

    // Trend insights
    if (moodTrends.last7Days && moodTrends.last30Days) {
      const improvement = moodTrends.last7Days - moodTrends.last30Days
      if (improvement > 0.5) {
        insights.push({
          type: "positive",
          message: "Your mood has been improving over the past week. Keep up the great work!",
        })
      } else if (improvement < -0.5) {
        insights.push({
          type: "concern",
          message: "I notice your mood has been lower recently. Would you like to talk about what's been challenging?",
        })
      }
    }

    // Pattern insights
    if (moodTrends.patterns?.bestDayOfWeek && moodTrends.patterns?.worstDayOfWeek) {
      insights.push({
        type: "info",
        message: `You tend to feel best on ${moodTrends.patterns.bestDayOfWeek}s and find ${moodTrends.patterns.worstDayOfWeek}s more challenging.`,
      })
    }

    return insights
  }, [moodTrends, moodHistory])

  const shouldShowCheckIn = useCallback(() => {
    if (!lastCheckIn) return true

    const lastCheckInTime = new Date(lastCheckIn.timestamp)
    const now = new Date()
    const hoursSinceLastCheckIn = (now - lastCheckInTime) / (1000 * 60 * 60)

    return hoursSinceLastCheckIn >= 24
  }, [lastCheckIn])

  return {
    moodHistory,
    lastCheckIn,
    moodTrends,
    isLoading,
    addMoodEntry,
    addCheckInEntry,
    getMoodInsights,
    shouldShowCheckIn,
  }
}
