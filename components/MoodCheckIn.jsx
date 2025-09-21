"use client"

import { useState } from "react"
import { MessageCircle, Clock, Sparkles } from "lucide-react"
import { cls } from "./utils"

export default function MoodCheckIn({ onStartCheckIn, lastCheckIn, isVisible = true }) {
  const [checkInQuestions, setCheckInQuestions] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [responses, setResponses] = useState({})
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)

  const shouldShowCheckIn = () => {
    if (!lastCheckIn) return true

    const lastCheckInTime = new Date(lastCheckIn.timestamp)
    const now = new Date()
    const hoursSinceLastCheckIn = (now - lastCheckInTime) / (1000 * 60 * 60)

    // Show check-in if it's been more than 24 hours
    return hoursSinceLastCheckIn >= 24
  }

  const generateCheckInQuestions = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/mood-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          moodContext: {
            history: lastCheckIn ? [lastCheckIn] : [],
            currentConversation: "",
            timeElapsed: lastCheckIn
              ? `${Math.floor((new Date() - new Date(lastCheckIn.timestamp)) / (1000 * 60 * 60))} hours`
              : "first time",
          },
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.questions) {
        // Parse questions from the response
        const questionLines = data.questions
          .split("\n")
          .filter((line) => line.match(/^\d+\./))
          .map((line) => line.replace(/^\d+\.\s*/, "").trim())

        setCheckInQuestions(questionLines)
        setCurrentQuestionIndex(0)
        setResponses({})
        setIsCompleted(false)
      }
    } catch (error) {
      console.error("Failed to generate check-in questions:", error)
      // Fallback questions
      setCheckInQuestions([
        "How has your energy been lately?",
        "Are you getting enough rest and sleep?",
        "What's been on your mind the most recently?",
        "Have you been able to connect with friends or family?",
        "What's one small thing that brought you joy this week?",
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleResponse = (response) => {
    const newResponses = {
      ...responses,
      [currentQuestionIndex]: response,
    }
    setResponses(newResponses)

    if (currentQuestionIndex < checkInQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      // Complete the check-in
      completeCheckIn(newResponses)
    }
  }

  const completeCheckIn = (allResponses) => {
    setIsCompleted(true)

    const checkInData = {
      questions: checkInQuestions,
      responses: allResponses,
      timestamp: new Date().toISOString(),
      type: "mood_check_in",
    }

    onStartCheckIn?.(checkInData)

    // Auto-hide after completion
    setTimeout(() => {
      setCheckInQuestions(null)
      setIsCompleted(false)
    }, 3000)
  }

  const startCheckIn = () => {
    generateCheckInQuestions()
  }

  if (!isVisible || !shouldShowCheckIn()) return null

  return (
    <div className="mb-4 rounded-xl border border-blue-200 bg-blue-50 p-4 shadow-sm dark:border-blue-800 dark:bg-blue-950/20">
      {!checkInQuestions ? (
        // Check-in prompt
        <div className="flex items-start gap-3">
          <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900/50">
            <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100">Daily Wellness Check-in</h3>
            <p className="mt-1 text-sm text-blue-700 dark:text-blue-200">
              Take a moment to reflect on how you're feeling. I'd love to check in with you.
            </p>
            <div className="mt-3 flex items-center gap-3">
              <button
                onClick={startCheckIn}
                disabled={isLoading}
                className={cls(
                  "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                  isLoading
                    ? "bg-blue-200 text-blue-500 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700",
                )}
              >
                {isLoading ? "Preparing..." : "Start Check-in"}
              </button>
              {lastCheckIn && (
                <div className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400">
                  <Clock className="h-3 w-3" />
                  Last check-in: {new Date(lastCheckIn.timestamp).toLocaleDateString()}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : isCompleted ? (
        // Completion message
        <div className="text-center">
          <div className="mx-auto mb-2 w-12 h-12 rounded-full bg-green-100 flex items-center justify-center dark:bg-green-900/50">
            <Sparkles className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="font-semibold text-green-900 dark:text-green-100">Check-in Complete</h3>
          <p className="text-sm text-green-700 dark:text-green-200">
            Thank you for taking time to reflect. Your responses help me understand how to better support you.
          </p>
        </div>
      ) : (
        // Active check-in
        <div>
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                Question {currentQuestionIndex + 1} of {checkInQuestions.length}
              </span>
            </div>
            <div className="h-2 w-24 rounded-full bg-blue-200 dark:bg-blue-800">
              <div
                className="h-full rounded-full bg-blue-600 transition-all duration-300"
                style={{ width: `${((currentQuestionIndex + 1) / checkInQuestions.length) * 100}%` }}
              />
            </div>
          </div>

          <div className="mb-4">
            <p className="text-blue-900 dark:text-blue-100">{checkInQuestions[currentQuestionIndex]}</p>
          </div>

          <div className="space-y-2">
            {[
              "I'm doing really well with this",
              "Things are going okay",
              "I'm having some challenges",
              "This is quite difficult for me",
              "I'd prefer not to answer",
            ].map((option, index) => (
              <button
                key={index}
                onClick={() => handleResponse(option)}
                className="w-full rounded-lg border border-blue-200 bg-white p-3 text-left text-sm transition-colors hover:bg-blue-50 dark:border-blue-700 dark:bg-blue-900/20 dark:hover:bg-blue-900/40"
              >
                {option}
              </button>
            ))}
          </div>

          <div className="mt-4 flex justify-between">
            <button
              onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
              disabled={currentQuestionIndex === 0}
              className="text-sm text-blue-600 hover:text-blue-700 disabled:text-blue-400 dark:text-blue-400"
            >
              Previous
            </button>
            <button
              onClick={() => completeCheckIn(responses)}
              className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
            >
              Skip remaining
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
