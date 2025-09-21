"use client"

import { AlertTriangle, Phone } from "lucide-react"
import { cls } from "./utils"

export default function CrisisAlert({ crisisLevel, onDismiss }) {
  if (!crisisLevel || crisisLevel === "LOW") return null

  const getCrisisConfig = (level) => {
    switch (level.toUpperCase()) {
      case "CRISIS":
        return {
          bgColor: "bg-red-50 dark:bg-red-950/20",
          borderColor: "border-red-200 dark:border-red-800",
          textColor: "text-red-800 dark:text-red-200",
          iconColor: "text-red-600 dark:text-red-400",
          title: "Immediate Support Available",
          urgency: "high",
        }
      case "HIGH":
        return {
          bgColor: "bg-orange-50 dark:bg-orange-950/20",
          borderColor: "border-orange-200 dark:border-orange-800",
          textColor: "text-orange-800 dark:text-orange-200",
          iconColor: "text-orange-600 dark:text-orange-400",
          title: "Professional Help Recommended",
          urgency: "medium",
        }
      case "MODERATE":
        return {
          bgColor: "bg-yellow-50 dark:bg-yellow-950/20",
          borderColor: "border-yellow-200 dark:border-yellow-800",
          textColor: "text-yellow-800 dark:text-yellow-200",
          iconColor: "text-yellow-600 dark:text-yellow-400",
          title: "Additional Support Available",
          urgency: "low",
        }
      default:
        return null
    }
  }

  const config = getCrisisConfig(crisisLevel)
  if (!config) return null

  const crisisResources = [
    { name: "National Suicide Prevention", number: "9152987821", available: "24/7" },
    { name: "AASRA", number: "9820466726", available: "24/7" },
    { name: "Vandrevala Foundation", number: "9999666555", available: "24/7" },
    { name: "Sneha", number: "044-24640050", available: "Daily 8AM-10PM" },
  ]

  return (
    <div className={cls("mb-4 rounded-xl border p-4 shadow-sm", config.bgColor, config.borderColor)}>
      <div className="flex items-start gap-3">
        <AlertTriangle className={cls("h-5 w-5 mt-0.5 flex-shrink-0", config.iconColor)} />
        <div className="flex-1 min-w-0">
          <h3 className={cls("font-semibold text-sm mb-2", config.textColor)}>{config.title}</h3>

          {config.urgency === "high" && (
            <p className={cls("text-sm mb-3", config.textColor)}>
              If you're having thoughts of self-harm or suicide, please reach out for immediate help. You're not alone.
            </p>
          )}

          <div className="space-y-2">
            {crisisResources.map((resource, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className={cls("flex-1", config.textColor)}>
                  <span className="font-medium">{resource.name}</span>
                  <span className="text-xs opacity-75 ml-2">({resource.available})</span>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${resource.number}`}
                    className={cls(
                      "inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-colors",
                      "bg-white/50 hover:bg-white/80 dark:bg-black/20 dark:hover:bg-black/40",
                      config.textColor,
                    )}
                  >
                    <Phone className="h-3 w-3" />
                    {resource.number}
                  </a>
                </div>
              </div>
            ))}
          </div>

          {config.urgency !== "high" && (
            <div className="mt-3 pt-3 border-t border-current/20">
              <p className={cls("text-xs", config.textColor)}>
                Consider speaking with a counselor, trusted adult, or mental health professional. Seeking help is a sign
                of strength, not weakness.
              </p>
            </div>
          )}
        </div>

        {onDismiss && (
          <button
            onClick={onDismiss}
            className={cls(
              "text-xs px-2 py-1 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors",
              config.textColor,
            )}
          >
            ×
          </button>
        )}
      </div>
    </div>
  )
}
