"use client"

import { useState, useCallback } from "react"

export function useResources() {
  const [resourceHistory, setResourceHistory] = useState([])
  const [favoriteResources, setFavoriteResources] = useState([])
  const [resourceStats, setResourceStats] = useState({
    totalAccessed: 0,
    crisisResourcesUsed: 0,
    lastAccessed: null,
  })

  const trackResourceAccess = useCallback((resource, category) => {
    const accessEvent = {
      id: Math.random().toString(36).slice(2),
      resource: {
        name: resource.name,
        type: resource.type,
        category,
      },
      timestamp: new Date().toISOString(),
      accessType: resource.contact ? "phone" : resource.url ? "website" : "view",
    }

    setResourceHistory((prev) => [accessEvent, ...prev.slice(0, 49)]) // Keep last 50

    setResourceStats((prev) => ({
      totalAccessed: prev.totalAccessed + 1,
      crisisResourcesUsed: prev.crisisResourcesUsed + (category === "crisis" ? 1 : 0),
      lastAccessed: accessEvent.timestamp,
    }))

    // Log for analytics (in production, this would go to analytics service)
    console.log("[Resource Access]", {
      resource: resource.name,
      category,
      type: accessEvent.accessType,
      timestamp: accessEvent.timestamp,
    })

    return accessEvent
  }, [])

  const addToFavorites = useCallback((resource, category) => {
    const favorite = {
      id: Math.random().toString(36).slice(2),
      resource,
      category,
      addedAt: new Date().toISOString(),
    }

    setFavoriteResources((prev) => {
      // Check if already favorited
      const exists = prev.some((fav) => fav.resource.name === resource.name && fav.category === category)

      if (exists) return prev

      return [favorite, ...prev]
    })

    return favorite
  }, [])

  const removeFromFavorites = useCallback((resourceName, category) => {
    setFavoriteResources((prev) =>
      prev.filter((fav) => !(fav.resource.name === resourceName && fav.category === category)),
    )
  }, [])

  const isFavorite = useCallback(
    (resourceName, category) => {
      return favoriteResources.some((fav) => fav.resource.name === resourceName && fav.category === category)
    },
    [favoriteResources],
  )

  const getResourceRecommendations = useCallback(async (userProfile) => {
    try {
      const response = await fetch("/api/resources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userProfile }),
      })

      const data = await response.json()
      return data
    } catch (error) {
      console.error("Failed to get resource recommendations:", error)
      return null
    }
  }, [])

  const getUsageInsights = useCallback(() => {
    if (resourceHistory.length === 0) return null

    const insights = []
    const now = new Date()
    const last7Days = resourceHistory.filter((event) => now - new Date(event.timestamp) <= 7 * 24 * 60 * 60 * 1000)

    // Usage frequency
    if (last7Days.length >= 3) {
      insights.push({
        type: "positive",
        message: `You've been actively exploring resources - ${last7Days.length} resources accessed this week.`,
      })
    }

    // Crisis resource usage
    const crisisAccess = resourceHistory.filter((event) => event.resource.category === "crisis")

    if (crisisAccess.length > 0) {
      insights.push({
        type: "important",
        message: "You've accessed crisis resources. Remember, reaching out for help is a sign of strength.",
      })
    }

    // Most used category
    const categoryCount = {}
    resourceHistory.forEach((event) => {
      categoryCount[event.resource.category] = (categoryCount[event.resource.category] || 0) + 1
    })

    const mostUsedCategory = Object.keys(categoryCount).reduce((a, b) => (categoryCount[a] > categoryCount[b] ? a : b))

    if (categoryCount[mostUsedCategory] >= 3) {
      insights.push({
        type: "info",
        message: `You seem most interested in ${mostUsedCategory} resources. Consider exploring other categories too.`,
      })
    }

    return insights
  }, [resourceHistory])

  return {
    resourceHistory,
    favoriteResources,
    resourceStats,
    trackResourceAccess,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    getResourceRecommendations,
    getUsageInsights,
  }
}
