"use client"

import { useState, useEffect } from "react"
import {
  ExternalLink,
  Phone,
  Download,
  Clock,
  Star,
  Heart,
  Brain,
  Users,
  BookOpen,
  Smartphone,
  Building,
} from "lucide-react"
import { cls } from "./utils"

const RESOURCE_CATEGORIES = {
  crisis: {
    title: "Crisis Support",
    icon: Phone,
    color: "text-red-600 dark:text-red-400",
    bgColor: "bg-red-50 dark:bg-red-950/20",
    borderColor: "border-red-200 dark:border-red-800",
  },
  professional: {
    title: "Professional Help",
    icon: Building,
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-950/20",
    borderColor: "border-blue-200 dark:border-blue-800",
  },
  apps: {
    title: "Mental Health Apps",
    icon: Smartphone,
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-50 dark:bg-green-950/20",
    borderColor: "border-green-200 dark:border-green-800",
  },
  community: {
    title: "Community Support",
    icon: Users,
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-50 dark:bg-purple-950/20",
    borderColor: "border-purple-200 dark:border-purple-800",
  },
  educational: {
    title: "Educational Resources",
    icon: BookOpen,
    color: "text-orange-600 dark:text-orange-400",
    bgColor: "bg-orange-50 dark:bg-orange-950/20",
    borderColor: "border-orange-200 dark:border-orange-800",
  },
}

const STATIC_RESOURCES = {
  crisis: [
    {
      name: "AASRA",
      description: "24/7 emotional support and suicide prevention",
      contact: "9820466726",
      availability: "24/7",
      languages: ["English", "Hindi"],
      type: "phone",
    },
    {
      name: "Vandrevala Foundation",
      description: "Free 24/7 crisis helpline and counseling",
      contact: "9999666555",
      availability: "24/7",
      languages: ["English", "Hindi", "Regional"],
      type: "phone",
    },
    {
      name: "Sneha",
      description: "Emotional support and suicide prevention",
      contact: "044-24640050",
      availability: "Daily 8AM-10PM",
      languages: ["English", "Tamil"],
      type: "phone",
    },
    {
      name: "National Suicide Prevention",
      description: "Government suicide prevention helpline",
      contact: "9152987821",
      availability: "24/7",
      languages: ["English", "Hindi"],
      type: "phone",
    },
  ],
  professional: [
    {
      name: "Practo",
      description: "Find verified therapists and psychiatrists near you",
      url: "https://www.practo.com/",
      features: ["Online booking", "Verified doctors", "Insurance support"],
      type: "platform",
    },
    {
      name: "BetterHelp India",
      description: "Online counseling with licensed therapists",
      url: "https://www.betterhelp.com/",
      features: ["Video sessions", "Chat support", "Flexible scheduling"],
      type: "platform",
    },
    {
      name: "Manastha",
      description: "Mental health platform for Indians",
      url: "https://manastha.com/",
      features: ["Cultural sensitivity", "Multiple languages", "Affordable rates"],
      type: "platform",
    },
    {
      name: "College Counseling Centers",
      description: "Free counseling services at educational institutions",
      features: ["Free for students", "Campus-based", "Academic support"],
      type: "local",
    },
  ],
  apps: [
    {
      name: "Wysa",
      description: "AI-powered mental health chatbot",
      rating: 4.5,
      features: ["24/7 availability", "Evidence-based techniques", "Privacy focused"],
      platforms: ["iOS", "Android"],
      type: "app",
    },
    {
      name: "Sanvello",
      description: "Mood and anxiety tracker with coping tools",
      rating: 4.3,
      features: ["Mood tracking", "Guided meditations", "CBT techniques"],
      platforms: ["iOS", "Android"],
      type: "app",
    },
    {
      name: "Headspace",
      description: "Meditation and mindfulness app",
      rating: 4.4,
      features: ["Guided meditations", "Sleep stories", "Focus music"],
      platforms: ["iOS", "Android", "Web"],
      type: "app",
    },
    {
      name: "Calm",
      description: "Sleep, meditation and relaxation app",
      rating: 4.5,
      features: ["Sleep stories", "Daily calm sessions", "Anxiety programs"],
      platforms: ["iOS", "Android"],
      type: "app",
    },
  ],
  community: [
    {
      name: "Mental Health Support Groups",
      description: "Local peer support groups in major cities",
      features: ["Peer support", "Regular meetings", "Safe space"],
      availability: "Weekly meetings",
      type: "group",
    },
    {
      name: "Youth Mental Health Forums",
      description: "Online communities for young people",
      features: ["Anonymous support", "Peer connections", "Resource sharing"],
      type: "online",
    },
    {
      name: "College Mental Health Clubs",
      description: "Student-led mental health awareness groups",
      features: ["Campus events", "Peer support", "Awareness campaigns"],
      type: "student",
    },
  ],
  educational: [
    {
      name: "Mental Health First Aid India",
      description: "Learn to recognize and respond to mental health crises",
      type: "course",
      features: ["Certification", "Online/offline", "Evidence-based"],
    },
    {
      name: "NIMHANS Resources",
      description: "Educational materials from National Institute of Mental Health",
      url: "https://nimhans.ac.in/",
      type: "website",
      features: ["Research-based", "Free resources", "Multiple languages"],
    },
    {
      name: "Mental Health Awareness Videos",
      description: "Educational content on YouTube and other platforms",
      type: "media",
      features: ["Free access", "Multiple languages", "Expert-created"],
    },
  ],
}

export default function ResourceRecommendations({ userProfile = {}, onResourceClick, showPersonalized = true }) {
  const [personalizedResources, setPersonalizedResources] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [expandedResource, setExpandedResource] = useState(null)

  useEffect(() => {
    if (showPersonalized && Object.keys(userProfile).length > 0) {
      fetchPersonalizedResources()
    }
  }, [userProfile, showPersonalized])

  const fetchPersonalizedResources = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/resources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userProfile }),
      })

      const data = await response.json()
      if (data.resources) {
        setPersonalizedResources(data.resources)
      }
    } catch (error) {
      console.error("Failed to fetch personalized resources:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleResourceClick = (resource, category) => {
    onResourceClick?.(resource, category)

    if (resource.type === "phone") {
      // Track crisis resource usage
      console.log("[Resource] Crisis resource accessed:", resource.name)
    }
  }

  const renderResource = (resource, category) => {
    const categoryConfig = RESOURCE_CATEGORIES[category]
    const isExpanded = expandedResource === `${category}-${resource.name}`

    return (
      <div
        key={resource.name}
        className={cls(
          "rounded-lg border p-4 transition-all",
          categoryConfig.bgColor,
          categoryConfig.borderColor,
          "hover:shadow-sm",
        )}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <categoryConfig.icon className={cls("h-4 w-4", categoryConfig.color)} />
              <h4 className="font-semibold text-sm">{resource.name}</h4>
              {resource.rating && (
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs text-zinc-600 dark:text-zinc-400">{resource.rating}</span>
                </div>
              )}
            </div>

            <p className="text-sm text-zinc-700 dark:text-zinc-300 mb-2">{resource.description}</p>

            {resource.features && (
              <div className="flex flex-wrap gap-1 mb-2">
                {resource.features.slice(0, isExpanded ? resource.features.length : 2).map((feature, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-white/50 dark:bg-black/20"
                  >
                    {feature}
                  </span>
                ))}
                {resource.features.length > 2 && !isExpanded && (
                  <button
                    onClick={() => setExpandedResource(`${category}-${resource.name}`)}
                    className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400"
                  >
                    +{resource.features.length - 2} more
                  </button>
                )}
              </div>
            )}

            {isExpanded && (
              <div className="mt-2 space-y-2 text-xs text-zinc-600 dark:text-zinc-400">
                {resource.availability && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{resource.availability}</span>
                  </div>
                )}
                {resource.languages && (
                  <div className="flex items-center gap-1">
                    <span>Languages: {resource.languages.join(", ")}</span>
                  </div>
                )}
                {resource.platforms && (
                  <div className="flex items-center gap-1">
                    <Download className="h-3 w-3" />
                    <span>{resource.platforms.join(", ")}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2 ml-4">
            {resource.contact && (
              <a
                href={`tel:${resource.contact}`}
                onClick={() => handleResourceClick(resource, category)}
                className={cls(
                  "inline-flex items-center gap-1 px-3 py-1 rounded-md text-xs font-medium transition-colors",
                  "bg-white/80 hover:bg-white dark:bg-black/40 dark:hover:bg-black/60",
                  categoryConfig.color,
                )}
              >
                <Phone className="h-3 w-3" />
                Call
              </a>
            )}

            {resource.url && (
              <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleResourceClick(resource, category)}
                className={cls(
                  "inline-flex items-center gap-1 px-3 py-1 rounded-md text-xs font-medium transition-colors",
                  "bg-white/80 hover:bg-white dark:bg-black/40 dark:hover:bg-black/60",
                  categoryConfig.color,
                )}
              >
                <ExternalLink className="h-3 w-3" />
                Visit
              </a>
            )}

            {isExpanded && (
              <button
                onClick={() => setExpandedResource(null)}
                className="text-xs text-zinc-500 hover:text-zinc-700 dark:text-zinc-400"
              >
                Show less
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  const filteredCategories = selectedCategory === "all" ? Object.keys(STATIC_RESOURCES) : [selectedCategory]

  return (
    <div className="space-y-6">
      {/* Personalized Recommendations */}
      {showPersonalized && (
        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center gap-2 mb-4">
            <Heart className="h-5 w-5 text-pink-600 dark:text-pink-400" />
            <h3 className="text-lg font-semibold">Personalized for You</h3>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-sm text-zinc-600 dark:text-zinc-400">
                Finding the best resources for your needs...
              </span>
            </div>
          ) : personalizedResources ? (
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <div className="whitespace-pre-wrap text-sm text-zinc-700 dark:text-zinc-300">
                {personalizedResources}
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <button
                onClick={fetchPersonalizedResources}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                <Brain className="h-4 w-4" />
                Get Personalized Recommendations
              </button>
            </div>
          )}
        </div>
      )}

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory("all")}
          className={cls(
            "px-3 py-1 rounded-full text-sm font-medium transition-colors",
            selectedCategory === "all"
              ? "bg-blue-600 text-white"
              : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700",
          )}
        >
          All Resources
        </button>
        {Object.entries(RESOURCE_CATEGORIES).map(([key, config]) => (
          <button
            key={key}
            onClick={() => setSelectedCategory(key)}
            className={cls(
              "px-3 py-1 rounded-full text-sm font-medium transition-colors flex items-center gap-1",
              selectedCategory === key
                ? "bg-blue-600 text-white"
                : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700",
            )}
          >
            <config.icon className="h-3 w-3" />
            {config.title}
          </button>
        ))}
      </div>

      {/* Resource Categories */}
      <div className="space-y-6">
        {filteredCategories.map((categoryKey) => {
          const category = RESOURCE_CATEGORIES[categoryKey]
          const resources = STATIC_RESOURCES[categoryKey]

          return (
            <div
              key={categoryKey}
              className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="flex items-center gap-2 mb-4">
                <category.icon className={cls("h-5 w-5", category.color)} />
                <h3 className="text-lg font-semibold">{category.title}</h3>
                <span className="text-sm text-zinc-500">({resources.length})</span>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {resources.map((resource) => renderResource(resource, categoryKey))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Emergency Notice */}
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950/20">
        <div className="flex items-start gap-3">
          <Phone className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
          <div>
            <h4 className="font-semibold text-red-900 dark:text-red-100 mb-1">In Case of Emergency</h4>
            <p className="text-sm text-red-700 dark:text-red-200 mb-2">
              If you're having thoughts of self-harm or suicide, please reach out immediately:
            </p>
            <div className="flex flex-wrap gap-2">
              <a
                href="tel:9152987821"
                className="inline-flex items-center gap-1 px-3 py-1 rounded-md bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors"
              >
                <Phone className="h-3 w-3" />
                National: 9152987821
              </a>
              <a
                href="tel:9820466726"
                className="inline-flex items-center gap-1 px-3 py-1 rounded-md bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors"
              >
                <Phone className="h-3 w-3" />
                AASRA: 9820466726
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
