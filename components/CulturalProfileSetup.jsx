"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { Label } from "./ui/label"
import { RadioGroup, RadioGroupItem } from "./ui/radio-group"
import { Checkbox } from "./ui/checkbox"
import { ArrowRight, ArrowLeft } from "lucide-react"
import { cls } from "./utils"
import { REGIONAL_ADAPTATIONS, LIFE_STAGE_ADAPTATIONS, CULTURAL_CONTEXTS } from "../lib/cultural-adaptation"

const STEPS = [
  { id: "location", title: "Your Location", description: "Help us connect you with local support" },
  { id: "region", title: "Your Region", description: "Help us understand your cultural context" },
  { id: "lifeStage", title: "Life Stage", description: "Where are you in your journey?" },
  { id: "concerns", title: "Main Concerns", description: "What areas would you like support with?" },
  { id: "family", title: "Family Dynamics", description: "Your family environment" },
  { id: "languages", title: "Languages", description: "Languages you're comfortable with" },
  { id: "cultural", title: "Cultural Preferences", description: "What resonates with you?" },
]

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat",
  "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh",
  "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
  "Uttarakhand", "West Bengal", "Delhi", "Chandigarh", "Puducherry"
]

export default function CulturalProfileSetup({ onProfileComplete, onSkip, initialProfile = {} }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [profile, setProfile] = useState({
    state: initialProfile.state || "",
    city: initialProfile.city || "",
    region: initialProfile.region || "",
    lifeStage: initialProfile.lifeStage || "",
    primaryStressors: initialProfile.primaryStressors || [],
    familyDynamics: initialProfile.familyDynamics || "",
    languages: initialProfile.languages || [],
    religiousBackground: initialProfile.religiousBackground || "",
    culturalPreferences: initialProfile.culturalPreferences || {
      music: false,
      yoga: false,
      meditation: false,
      spirituality: false,
      festivals: false,
      traditionalHealing: false,
    },
    ...initialProfile,
  })

  const updateProfile = (key, value) => {
    setProfile((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
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

  const canProceed = () => {
    const step = STEPS[currentStep]
    if (step.id === "location") return profile.state
    if (step.id === "region") return profile.region
    if (step.id === "lifeStage") return profile.lifeStage
    if (step.id === "concerns") return profile.primaryStressors.length > 0
    if (step.id === "family") return profile.familyDynamics
    if (step.id === "languages") return profile.languages.length > 0
    if (step.id === "cultural") return true // Optional step
    return false
  }

  const currentStepData = STEPS[currentStep]

  const renderStepContent = () => {
    switch (currentStepData.id) {
      case "location":
        return (
          <div className="space-y-4">
            <div>
              <Label className="mb-2 block">State *</Label>
              <select
                value={profile.state}
                onChange={(e) => updateProfile("state", e.target.value)}
                className="w-full border rounded-md p-2 bg-background"
              >
                <option value="">Select your state</option>
                {INDIAN_STATES.map((state) => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>
            <div>
              <Label className="mb-2 block">City (Optional)</Label>
              <input
                type="text"
                value={profile.city}
                onChange={(e) => updateProfile("city", e.target.value)}
                placeholder="e.g., Mumbai, Bangalore, Delhi"
                className="w-full border rounded-md p-2 bg-background"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Helps us suggest local support resources and helplines
              </p>
            </div>
          </div>
        )

      case "region":
        return (
          <RadioGroup value={profile.region} onValueChange={(val) => updateProfile("region", val)}>
            <div className="space-y-2">
              {Object.entries(REGIONAL_ADAPTATIONS).map(([key, data]) => (
                <Label
                  key={key}
                  className={cls(
                    "flex items-start gap-3 border rounded-md p-4 cursor-pointer transition-colors hover:border-primary",
                    profile.region === key && "border-primary bg-accent/50"
                  )}
                >
                  <RadioGroupItem value={key} className="mt-0.5" />
                  <div className="flex-1">
                    <div className="font-medium capitalize mb-1">{key} India</div>
                    <div className="text-sm text-muted-foreground">{data.characteristics[0]}</div>
                  </div>
                </Label>
              ))}
            </div>
          </RadioGroup>
        )

      case "lifeStage":
        return (
          <RadioGroup value={profile.lifeStage} onValueChange={(val) => updateProfile("lifeStage", val)}>
            <div className="space-y-2">
              {Object.entries(LIFE_STAGE_ADAPTATIONS).map(([key, data]) => (
                <Label
                  key={key}
                  className={cls(
                    "flex items-start gap-3 border rounded-md p-4 cursor-pointer transition-colors hover:border-primary",
                    profile.lifeStage === key && "border-primary bg-accent/50"
                  )}
                >
                  <RadioGroupItem value={key} className="mt-0.5" />
                  <div className="flex-1">
                    <div className="font-medium capitalize mb-1">{key.replace("-", " ")}</div>
                    <div className="text-sm text-muted-foreground">Age {data.ageRange}</div>
                  </div>
                </Label>
              ))}
            </div>
          </RadioGroup>
        )

      case "concerns":
        return (
          <div className="space-y-2">
            {Object.entries(CULTURAL_CONTEXTS).map(([key, data]) => (
              <Label
                key={key}
                className={cls(
                  "flex items-start gap-3 border rounded-md p-4 cursor-pointer transition-colors hover:border-primary",
                  profile.primaryStressors.includes(key) && "border-primary bg-accent/50"
                )}
              >
                <Checkbox
                  checked={profile.primaryStressors.includes(key)}
                  onCheckedChange={(checked) => {
                    const newStressors = checked
                      ? [...profile.primaryStressors, key]
                      : profile.primaryStressors.filter((s) => s !== key)
                    updateProfile("primaryStressors", newStressors)
                  }}
                  className="mt-0.5"
                />
                <div className="flex-1">
                  <div className="font-medium mb-1">{data.name}</div>
                  <div className="text-sm text-muted-foreground">{data.stressors.slice(0, 2).join(", ")}</div>
                </div>
              </Label>
            ))}
          </div>
        )

      case "family":
        return (
          <RadioGroup value={profile.familyDynamics} onValueChange={(val) => updateProfile("familyDynamics", val)}>
            <div className="space-y-2">
              {[
                { key: "traditional", label: "Traditional", desc: "Strong family hierarchy, collective decisions" },
                { key: "modern", label: "Modern", desc: "Individual freedom, open communication" },
                { key: "mixed", label: "Mixed", desc: "Blend of traditional and modern values" },
                { key: "independent", label: "Independent", desc: "Living separately, making own decisions" },
              ].map((option) => (
                <Label
                  key={option.key}
                  className={cls(
                    "flex items-start gap-3 border rounded-md p-4 cursor-pointer transition-colors hover:border-primary",
                    profile.familyDynamics === option.key && "border-primary bg-accent/50"
                  )}
                >
                  <RadioGroupItem value={option.key} className="mt-0.5" />
                  <div className="flex-1">
                    <div className="font-medium mb-1">{option.label}</div>
                    <div className="text-sm text-muted-foreground">{option.desc}</div>
                  </div>
                </Label>
              ))}
            </div>
          </RadioGroup>
        )

      case "languages":
        return (
          <div className="space-y-2">
            {["English", "Hindi", "Tamil", "Telugu", "Marathi", "Bengali", "Gujarati", "Kannada", "Malayalam", "Punjabi", "Other"].map((language) => (
              <Label
                key={language}
                className={cls(
                  "flex items-center gap-3 border rounded-md p-3 cursor-pointer transition-colors hover:border-primary",
                  profile.languages.includes(language.toLowerCase()) && "border-primary bg-accent/50"
                )}
              >
                <Checkbox
                  checked={profile.languages.includes(language.toLowerCase())}
                  onCheckedChange={(checked) => {
                    const langKey = language.toLowerCase()
                    const newLanguages = checked
                      ? [...profile.languages, langKey]
                      : profile.languages.filter((l) => l !== langKey)
                    updateProfile("languages", newLanguages)
                  }}
                />
                <span className="font-medium">{language}</span>
              </Label>
            ))}
          </div>
        )

      case "cultural":
        return (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground mb-4">
              Select cultural practices and traditions that resonate with you. This helps us personalize wellness recommendations.
            </p>
            <div className="space-y-2">
              {[
                { key: "music", label: "Indian Classical Music", desc: "Ragas, Carnatic, Hindustani" },
                { key: "yoga", label: "Yoga & Asanas", desc: "Physical and mental wellness through yoga" },
                { key: "meditation", label: "Meditation & Mindfulness", desc: "Dhyana, Vipassana, guided meditation" },
                { key: "spirituality", label: "Spiritual Practices", desc: "Prayer, temple visits, religious rituals" },
                { key: "festivals", label: "Festival Celebrations", desc: "Cultural and religious festivals" },
                { key: "traditionalHealing", label: "Traditional Healing", desc: "Ayurveda, naturopathy, traditional medicine" },
              ].map((option) => (
                <Label
                  key={option.key}
                  className={cls(
                    "flex items-start gap-3 border rounded-md p-4 cursor-pointer transition-colors hover:border-primary",
                    profile.culturalPreferences[option.key] && "border-primary bg-accent/50"
                  )}
                >
                  <Checkbox
                    checked={profile.culturalPreferences[option.key]}
                    onCheckedChange={(checked) => {
                      updateProfile("culturalPreferences", {
                        ...profile.culturalPreferences,
                        [option.key]: checked,
                      })
                    }}
                    className="mt-0.5"
                  />
                  <div className="flex-1">
                    <div className="font-medium mb-1">{option.label}</div>
                    <div className="text-sm text-muted-foreground">{option.desc}</div>
                  </div>
                </Label>
              ))}
            </div>
          </div>
        )
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="w-full">
        {/* Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm text-muted-foreground">
              Step {currentStep + 1} of {STEPS.length}
            </div>
            <Button variant="ghost" size="sm" onClick={onSkip}>
              Skip
            </Button>
          </div>
          <div className="h-1 bg-muted rounded-md overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="border rounded-md p-4 mb-4">
          <div className="mb-4">
            <h2 className="text-2xl font-semibold mb-2">{currentStepData.title}</h2>
            <p className="text-sm text-muted-foreground">{currentStepData.description}</p>
          </div>

          {renderStepContent()}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={handleBack}
            disabled={currentStep === 0}
            className="rounded-md"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>

          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            size="sm"
            className="rounded-md"
          >
            {currentStep === STEPS.length - 1 ? "Complete" : "Next"}
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  )
}
