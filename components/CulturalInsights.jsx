"use client"

import { useState } from "react"
import { Lightbulb, Calendar, MapPin, Users, ChevronDown, ChevronUp } from "lucide-react"
import { cls } from "./utils"

export default function CulturalInsights({ insights = [], userProfile = {}, onInsightClick }) {
  const [expandedInsight, setExpandedInsight] = useState(null)
  const [showAllInsights, setShowAllInsights] = useState(false)

  if (!insights || insights.length === 0) return null

  const visibleInsights = showAllInsights ? insights : insights.slice(0, 2)

  const getInsightIcon = (type) => {
    switch (type) {
      case "cultural":
        return MapPin
      case "seasonal":
        return Calendar
      case "social":
        return Users
      case "life-stage":
        return Users
      default:
        return Lightbulb
    }
  }

  const getInsightColor = (type) => {
    switch (type) {
      case "cultural":
        return "text-purple-600 dark:text-purple-400"
      case "seasonal":
        return "text-green-600 dark:text-green-400"
      case "social":
        return "text-blue-600 dark:text-blue-400"
      case "life-stage":
        return "text-orange-600 dark:text-orange-400"
      default:
        return "text-yellow-600 dark:text-yellow-400"
    }
  }

  const getInsightBg = (type) => {
    switch (type) {
      case "cultural":
        return "bg-purple-50 border-purple-200 dark:bg-purple-950/20 dark:border-purple-800"
      case "seasonal":
        return "bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800"
      case "social":
        return "bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-800"
      case "life-stage":
        return "bg-orange-50 border-orange-200 dark:bg-orange-950/20 dark:border-orange-800"
      default:
        return "bg-yellow-50 border-yellow-200 dark:bg-yellow-950/20 dark:border-yellow-800"
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Lightbulb className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
        <h3 className="font-semibold text-lg">Cultural Insights</h3>
      </div>

      <div className="space-y-3">
        {visibleInsights.map((insight, index) => {
          const Icon = getInsightIcon(insight.type)
          const isExpanded = expandedInsight === index

          return (
            <div key={index} className={cls("rounded-lg border p-4 transition-all", getInsightBg(insight.type))}>
              <div className="flex items-start gap-3">
                <Icon className={cls("h-5 w-5 mt-0.5 flex-shrink-0", getInsightColor(insight.type))} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-zinc-700 dark:text-zinc-300">{insight.message}</p>

                  {insight.details && (
                    <div className="mt-2">
                      <button
                        onClick={() => setExpandedInsight(isExpanded ? null : index)}
                        className="flex items-center gap-1 text-xs text-zinc-600 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
                      >
                        {isExpanded ? (
                          <>
                            <ChevronUp className="h-3 w-3" />
                            Show less
                          </>
                        ) : (
                          <>
                            <ChevronDown className="h-3 w-3" />
                            Learn more
                          </>
                        )}
                      </button>

                      {isExpanded && (
                        <div className="mt-2 p-3 rounded-md bg-white/50 dark:bg-black/20">
                          <p className="text-xs text-zinc-600 dark:text-zinc-400">{insight.details}</p>
                          {insight.suggestions && (
                            <div className="mt-2">
                              <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">Suggestions:</p>
                              <ul className="text-xs text-zinc-600 dark:text-zinc-400 space-y-1">
                                {insight.suggestions.map((suggestion, idx) => (
                                  <li key={idx} className="flex items-start gap-1">
                                    <span className="text-zinc-400">•</span>
                                    <span>{suggestion}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {insight.actionable && (
                    <button
                      onClick={() => onInsightClick?.(insight)}
                      className="mt-2 text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium"
                    >
                      {insight.actionText || "Learn more"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {insights.length > 2 && (
        <button
          onClick={() => setShowAllInsights(!showAllInsights)}
          className="w-full text-center text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 py-2"
        >
          {showAllInsights ? "Show fewer insights" : `Show ${insights.length - 2} more insights`}
        </button>
      )}

      {/* Cultural Profile Summary */}
      {userProfile && Object.keys(userProfile).length > 0 && (
        <div className="mt-6 p-4 rounded-lg bg-zinc-50 border border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700">
          <h4 className="font-medium text-sm mb-2 text-zinc-700 dark:text-zinc-300">Your Cultural Context</h4>
          <div className="flex flex-wrap gap-2 text-xs">
            {userProfile.region && (
              <span className="px-2 py-1 rounded-full bg-white dark:bg-zinc-700 text-zinc-600 dark:text-zinc-400">
                {userProfile.region} India
              </span>
            )}
            {userProfile.lifeStage && (
              <span className="px-2 py-1 rounded-full bg-white dark:bg-zinc-700 text-zinc-600 dark:text-zinc-400">
                {userProfile.lifeStage.replace("-", " ")}
              </span>
            )}
            {userProfile.primaryStressors && userProfile.primaryStressors.length > 0 && (
              <span className="px-2 py-1 rounded-full bg-white dark:bg-zinc-700 text-zinc-600 dark:text-zinc-400">
                {userProfile.primaryStressors.length} focus areas
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
