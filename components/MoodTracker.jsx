"use client"

import { useState } from "react"
import { Calendar, TrendingUp, Heart, Brain, Zap, Moon } from "lucide-react"
import { cls } from "./utils"

const MOOD_OPTIONS = [
  { value: "excellent", label: "Excellent", color: "bg-green-500", icon: "😊" },
  { value: "good", label: "Good", color: "bg-blue-500", icon: "🙂" },
  { value: "okay", label: "Okay", color: "bg-yellow-500", icon: "😐" },
  { value: "difficult", label: "Difficult", color: "bg-orange-500", icon: "😔" },
  { value: "struggling", label: "Struggling", color: "bg-red-500", icon: "😢" },
]

const WELLNESS_FACTORS = [
  { key: "sleep", label: "Sleep Quality", icon: Moon, scale: ["Poor", "Fair", "Good", "Great", "Excellent"] },
  { key: "energy", label: "Energy Level", icon: Zap, scale: ["Very Low", "Low", "Moderate", "High", "Very High"] },
  { key: "stress", label: "Stress Level", icon: Brain, scale: ["Very High", "High", "Moderate", "Low", "Very Low"] },
  { key: "social", label: "Social Connection", icon: Heart, scale: ["Isolated", "Limited", "Some", "Good", "Strong"] },
]

export default function MoodTracker({ onMoodSubmit, recentMoods = [] }) {
  const [selectedMood, setSelectedMood] = useState("")
  const [wellnessRatings, setWellnessRatings] = useState({})
  const [notes, setNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showDetailed, setShowDetailed] = useState(false)

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood)
    if (!showDetailed) {
      // Quick mood submission
      submitMood(mood, {}, "")
    }
  }

  const handleWellnessRating = (factor, rating) => {
    setWellnessRatings((prev) => ({
      ...prev,
      [factor]: rating,
    }))
  }

  const submitMood = async (mood, wellness, moodNotes) => {
    setIsSubmitting(true)
    try {
      const moodEntry = {
        mood,
        wellness,
        notes: moodNotes,
        timestamp: new Date().toISOString(),
        date: new Date().toDateString(),
      }

      await onMoodSubmit?.(moodEntry)

      // Reset form
      setSelectedMood("")
      setWellnessRatings({})
      setNotes("")
      setShowDetailed(false)
    } catch (error) {
      console.error("Failed to submit mood:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDetailedSubmit = () => {
    if (!selectedMood) {
      alert("Please select how you're feeling today before saving your check-in.")
      return
    }
    submitMood(selectedMood, wellnessRatings, notes)
  }

  const getMoodTrend = () => {
    if (recentMoods.length < 2) return null

    const moodValues = {
      struggling: 1,
      difficult: 2,
      okay: 3,
      good: 4,
      excellent: 5,
    }

    const recent = recentMoods.slice(0, 3).map((m) => moodValues[m.mood] || 3)
    const average = recent.reduce((a, b) => a + b, 0) / recent.length

    if (average > 3.5) return { trend: "improving", color: "text-green-600" }
    if (average < 2.5) return { trend: "concerning", color: "text-red-600" }
    return { trend: "stable", color: "text-blue-600" }
  }

  const trend = getMoodTrend()

  return (
    <div className="space-y-6">
      {/* Quick Mood Check */}
      <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">How are you feeling today?</h3>
          {trend && (
            <div className={cls("flex items-center gap-1 text-sm", trend.color)}>
              <TrendingUp className="h-4 w-4" />
              <span className="capitalize">{trend.trend}</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-5 gap-3">
          {MOOD_OPTIONS.map((mood) => (
            <button
              key={mood.value}
              onClick={() => handleMoodSelect(mood.value)}
              disabled={isSubmitting}
              className={cls(
                "flex flex-col items-center gap-2 rounded-lg border-2 p-3 text-center transition-all",
                selectedMood === mood.value
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20"
                  : "border-zinc-200 hover:border-zinc-300 dark:border-zinc-700 dark:hover:border-zinc-600",
                isSubmitting && "opacity-50 cursor-not-allowed",
              )}
            >
              <span className="text-2xl">{mood.icon}</span>
              <span className="text-xs font-medium">{mood.label}</span>
            </button>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <button
            onClick={() => setShowDetailed(!showDetailed)}
            className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            {showDetailed ? "Quick check-in" : "Detailed check-in"}
          </button>
          {recentMoods.length > 0 && (
            <span className="text-xs text-zinc-500">
              Last check-in: {new Date(recentMoods[0]?.timestamp).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>

      {/* Detailed Mood Tracking */}
      {showDetailed && (
        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <h4 className="mb-4 font-semibold">Wellness Factors</h4>

          <div className="space-y-4">
            {WELLNESS_FACTORS.map((factor) => (
              <div key={factor.key}>
                <div className="mb-2 flex items-center gap-2">
                  <factor.icon className="h-4 w-4 text-zinc-500" />
                  <span className="text-sm font-medium">{factor.label}</span>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {factor.scale.map((label, index) => (
                    <button
                      key={index}
                      onClick={() => handleWellnessRating(factor.key, index + 1)}
                      className={cls(
                        "rounded-md border px-2 py-1 text-xs transition-colors",
                        wellnessRatings[factor.key] === index + 1
                          ? "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-300"
                          : "border-zinc-200 hover:border-zinc-300 dark:border-zinc-700 dark:hover:border-zinc-600",
                      )}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4">
            <label className="mb-2 block text-sm font-medium">Notes (optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="What's on your mind? Any specific challenges or wins today?"
              className="w-full rounded-lg border border-zinc-200 p-3 text-sm outline-none focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:focus:border-blue-400"
              rows={3}
            />
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={handleDetailedSubmit}
              disabled={isSubmitting}
              className={cls(
                "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                !isSubmitting
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-zinc-200 text-zinc-500 cursor-not-allowed dark:bg-zinc-700",
              )}
            >
              {isSubmitting ? "Saving..." : "Save Check-in"}
            </button>
          </div>

          {!selectedMood && (
            <p className="mt-2 text-xs text-zinc-500 text-right">
              Please select how you're feeling today before saving your check-in.
            </p>
          )}
        </div>
      )}

      {/* Recent Mood History */}
      {recentMoods.length > 0 && (
        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="mb-4 flex items-center gap-2">
            <Calendar className="h-4 w-4 text-zinc-500" />
            <h4 className="font-semibold">Recent Check-ins</h4>
          </div>

          <div className="space-y-3">
            {recentMoods.slice(0, 5).map((entry, index) => {
              const moodOption = MOOD_OPTIONS.find((m) => m.value === entry.mood)
              return (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{moodOption?.icon}</span>
                    <div>
                      <span className="text-sm font-medium">{moodOption?.label}</span>
                      <div className="text-xs text-zinc-500">
                        {new Date(entry.timestamp).toLocaleDateString()} at{" "}
                        {new Date(entry.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>
                  </div>
                  {entry.notes && (
                    <div className="max-w-xs truncate text-xs text-zinc-600 dark:text-zinc-400">{entry.notes}</div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
