"use client"

import { ExternalLink, Phone, Star, Clock, MapPin, Users } from "lucide-react"
import { cls } from "./utils"

export default function ResourceCard({ resource, category = "general", onResourceClick, compact = false }) {
  const handleClick = () => {
    onResourceClick?.(resource, category)
  }

  const getCategoryColor = (cat) => {
    const colors = {
      crisis: "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20",
      professional: "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/20",
      apps: "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20",
      community: "border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-950/20",
      educational: "border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950/20",
      general: "border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900",
    }
    return colors[cat] || colors.general
  }

  if (compact) {
    return (
      <div className={cls("rounded-lg border p-3 transition-all hover:shadow-sm", getCategoryColor(category))}>
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-sm truncate">{resource.name}</h4>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 truncate">{resource.description}</p>
          </div>
          <div className="flex items-center gap-1 ml-2">
            {resource.contact && (
              <a
                href={`tel:${resource.contact}`}
                onClick={handleClick}
                className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/80 hover:bg-white dark:bg-black/40 dark:hover:bg-black/60 transition-colors"
                title={`Call ${resource.name}`}
              >
                <Phone className="h-3 w-3" />
              </a>
            )}
            {resource.url && (
              <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleClick}
                className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/80 hover:bg-white dark:bg-black/40 dark:hover:bg-black/60 transition-colors"
                title={`Visit ${resource.name}`}
              >
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={cls("rounded-xl border p-6 transition-all hover:shadow-sm", getCategoryColor(category))}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-lg">{resource.name}</h3>
            {resource.rating && (
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm text-zinc-600 dark:text-zinc-400">{resource.rating}</span>
              </div>
            )}
          </div>
          <p className="text-zinc-700 dark:text-zinc-300 mb-3">{resource.description}</p>
        </div>
      </div>

      {/* Resource Details */}
      <div className="space-y-3 mb-4">
        {resource.availability && (
          <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
            <Clock className="h-4 w-4" />
            <span>{resource.availability}</span>
          </div>
        )}

        {resource.location && (
          <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
            <MapPin className="h-4 w-4" />
            <span>{resource.location}</span>
          </div>
        )}

        {resource.languages && (
          <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
            <Users className="h-4 w-4" />
            <span>Languages: {resource.languages.join(", ")}</span>
          </div>
        )}

        {resource.features && (
          <div className="flex flex-wrap gap-2">
            {resource.features.map((feature, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-white/60 dark:bg-black/30 text-zinc-700 dark:text-zinc-300"
              >
                {feature}
              </span>
            ))}
          </div>
        )}

        {resource.platforms && (
          <div className="flex flex-wrap gap-2">
            {resource.platforms.map((platform, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
              >
                {platform}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        {resource.contact && (
          <a
            href={`tel:${resource.contact}`}
            onClick={handleClick}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <Phone className="h-4 w-4" />
            Call {resource.contact}
          </a>
        )}

        {resource.url && (
          <a
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleClick}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-zinc-300 bg-white text-zinc-700 text-sm font-medium hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
            Visit Website
          </a>
        )}
      </div>

      {/* Additional Info */}
      {resource.notes && (
        <div className="mt-4 p-3 rounded-lg bg-zinc-100 dark:bg-zinc-800">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">{resource.notes}</p>
        </div>
      )}
    </div>
  )
}
