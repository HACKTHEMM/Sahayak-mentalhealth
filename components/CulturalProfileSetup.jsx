"use client"

import { useState } from "react"
import { MapPin, GraduationCap, Home, Languages, Heart } from "lucide-react"
import { cls } from "./utils"
import { REGIONAL_ADAPTATIONS, LIFE_STAGE_ADAPTATIONS, CULTURAL_CONTEXTS } from "../lib/cultural-adaptation"

const PROFILE_STEPS = [
  {
    id: "region",
    title: "Your Region",
    description: "This helps me understand your cultural context better",
    icon: MapPin,
  },
  {
    id: "lifeStage",
    title: "Life Stage",
    description: "Where are you in your journey?",
    icon: GraduationCap,
  },
  {
    id: "stressors",
    title: "Main Concerns",
    description: "What areas would you like support with?",
    icon: Heart,
  },
  {
    id: "family",
    title: "Family Dynamics",
    description: "Understanding your family context helps me provide better support",
    icon: Home,
  },
  {
    id: "languages",
    title: "Languages",
    description: "Which languages are you comfortable with?",
    icon: Languages,
  },
]

export default function CulturalProfileSetup({ onProfileComplete, onSkip, initialProfile = {} }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [profile, setProfile] = useState({
    region: initialProfile.region || "",
    lifeStage: initialProfile.lifeStage || "",
    primaryStressors: initialProfile.primaryStressors || [],
    familyDynamics: initialProfile.familyDynamics || "",
    languages: initialProfile.languages || [],
    religiousBackground: initialProfile.religiousBackground || "",
    ...initialProfile,
  })

  const currentStepData = PROFILE_STEPS[currentStep]

  const updateProfile = (key, value) => {
    setProfile((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleNext = () => {
    if (currentStep < PROFILE_STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onProfileComplete(profile)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const renderStepContent = () => {
    switch (currentStepData.id) {
      case "region":
        return (
          <div className="space-y-3">
            {Object.entries(REGIONAL_ADAPTATIONS).map(([key, data]) => (
              <button
                key={key}
                onClick={() => updateProfile("region", key)}
                className={cls(
                  "w-full p-4 rounded-lg border-2 text-left transition-all",
                  profile.region === key
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20"
                    : "border-zinc-200 hover:border-zinc-300 dark:border-zinc-700 dark:hover:border-zinc-600",
                )}
              >
                <div className="font-medium mb-1 capitalize">{key} India</div>
                <div className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">
                  {data.regions.slice(0, 3).join(", ")}
                  {data.regions.length > 3 && ` +${data.regions.length - 3} more`}
                </div>
                <div className="text-xs text-zinc-500">{data.characteristics[0]}</div>
              </button>
            ))}
            <button
              onClick={() => updateProfile("region", "other")}
              className={cls(
                "w-full p-4 rounded-lg border-2 text-left transition-all",
                profile.region === "other"
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20"
                  : "border-zinc-200 hover:border-zinc-300 dark:border-zinc-700 dark:hover:border-zinc-600",
              )}
            >
              <div className="font-medium">Other / Prefer not to specify</div>
            </button>
          </div>
        )

      case "lifeStage":
        return (
          <div className="space-y-3">
            {Object.entries(LIFE_STAGE_ADAPTATIONS).map(([key, data]) => (
              <button
                key={key}
                onClick={() => updateProfile("lifeStage", key)}
                className={cls(
                  "w-full p-4 rounded-lg border-2 text-left transition-all",
                  profile.lifeStage === key
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20"
                    : "border-zinc-200 hover:border-zinc-300 dark:border-zinc-700 dark:hover:border-zinc-600",
                )}
              >
                <div className="font-medium mb-1 capitalize">{key.replace("-", " ")}</div>
                <div className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">Age {data.ageRange}</div>
                <div className="text-xs text-zinc-500">{data.primaryStressors.slice(0, 2).join(", ")}</div>
              </button>
            ))}
          </div>
        )

      case "stressors":
        return (
          <div className="space-y-3">
            {Object.entries(CULTURAL_CONTEXTS).map(([key, data]) => (
              <button
                key={key}
                onClick={() => {
                  const newStressors = profile.primaryStressors.includes(key)
                    ? profile.primaryStressors.filter((s) => s !== key)
                    : [...profile.primaryStressors, key]
                  updateProfile("primaryStressors", newStressors)
                }}
                className={cls(
                  "w-full p-4 rounded-lg border-2 text-left transition-all",
                  profile.primaryStressors.includes(key)
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20"
                    : "border-zinc-200 hover:border-zinc-300 dark:border-zinc-700 dark:hover:border-zinc-600",
                )}
              >
                <div className="font-medium mb-1">{data.name}</div>
                <div className="text-sm text-zinc-600 dark:text-zinc-400">
                  {data.stressors.slice(0, 2).join(", ")}
                  {data.stressors.length > 2 && "..."}
                </div>
              </button>
            ))}
            <div className="text-xs text-zinc-500 mt-2">Select all that apply to you</div>
          </div>
        )

      case "family":
        return (
          <div className="space-y-3">
            {[
              { key: "traditional", label: "Traditional", desc: "Strong family hierarchy, collective decisions" },
              { key: "modern", label: "Modern", desc: "More individual freedom, open communication" },
              { key: "mixed", label: "Mixed", desc: "Blend of traditional and modern values" },
              { key: "independent", label: "Independent", desc: "Living separately, making own decisions" },
            ].map((option) => (
              <button
                key={option.key}
                onClick={() => updateProfile("familyDynamics", option.key)}
                className={cls(
                  "w-full p-4 rounded-lg border-2 text-left transition-all",
                  profile.familyDynamics === option.key
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20"
                    : "border-zinc-200 hover:border-zinc-300 dark:border-zinc-700 dark:hover:border-zinc-600",
                )}
              >
                <div className="font-medium mb-1">{option.label}</div>
                <div className="text-sm text-zinc-600 dark:text-zinc-400">{option.desc}</div>
              </button>
            ))}
          </div>
        )

      case "languages":
        return (
          <div className="space-y-3">
            {[
              "English",
              "Hindi",
              "Tamil",
              "Telugu",
              "Marathi",
              "Bengali",
              "Gujarati",
              "Kannada",
              "Malayalam",
              "Punjabi",
              "Urdu",
              "Assamese",
              "Other",
            ].map((language) => (
              <button
                key={language}
                onClick={() => {
                  const langKey = language.toLowerCase()
                  const newLanguages = profile.languages.includes(langKey)
                    ? profile.languages.filter((l) => l !== langKey)
                    : [...profile.languages, langKey]
                  updateProfile("languages", newLanguages)
                }}
                className={cls(
                  "inline-flex items-center px-4 py-2 rounded-lg border-2 text-sm transition-all mr-2 mb-2",
                  profile.languages.includes(language.toLowerCase())
                    ? "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-300"
                    : "border-zinc-200 hover:border-zinc-300 dark:border-zinc-700 dark:hover:border-zinc-600",
                )}
              >
                {language}
              </button>
            ))}
            <div className="text-xs text-zinc-500 mt-2">Select all languages you're comfortable with</div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Step {currentStep + 1} of {PROFILE_STEPS.length}
          </span>
          <button onClick={onSkip} className="text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400">
            Skip setup
          </button>
        </div>
        <div className="w-full bg-zinc-200 rounded-full h-2 dark:bg-zinc-700">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / PROFILE_STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-xl border border-zinc-200 p-8 shadow-sm dark:bg-zinc-900 dark:border-zinc-800">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30">
            <currentStepData.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">{currentStepData.title}</h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">{currentStepData.description}</p>
          </div>
        </div>

        <div className="mb-8">{renderStepContent()}</div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={handleBack}
            disabled={currentStep === 0}
            className={cls(
              "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
              currentStep === 0
                ? "text-zinc-400 cursor-not-allowed"
                : "text-zinc-600 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200",
            )}
          >
            Back
          </button>

          <button
            onClick={handleNext}
            className="px-6 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            {currentStep === PROFILE_STEPS.length - 1 ? "Complete Setup" : "Next"}
          </button>
        </div>
      </div>
    </div>
  )
}
