"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Phone, Mail, Globe, MapPin, Heart } from "lucide-react"

export default function RegionalResourcesCard({ resources, type = "helplines" }) {
  if (!resources || (type === "helplines" && !resources.length)) {
    return null
  }

  if (type === "helplines") {
    return (
      <Card className="border-blue-200 bg-blue-50/50 dark:bg-blue-950/20 dark:border-blue-900">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
            <Phone className="h-5 w-5" />
            Local Support Helplines
          </CardTitle>
          <CardDescription>
            Immediate support available in your area
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {resources.slice(0, 3).map((helpline, idx) => (
            <div
              key={idx}
              className="border-l-4 border-blue-500 pl-4 py-2 bg-white dark:bg-slate-900 rounded-r"
            >
              <div className="font-semibold text-sm">{helpline.name}</div>
              <div className="flex items-center gap-2 mt-1 text-blue-600 dark:text-blue-400 font-mono">
                <Phone className="h-3 w-3" />
                <a href={`tel:${helpline.number}`} className="hover:underline">
                  {helpline.number}
                </a>
              </div>
              {helpline.email && (
                <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                  <Mail className="h-3 w-3" />
                  <a href={`mailto:${helpline.email}`} className="hover:underline">
                    {helpline.email}
                  </a>
                </div>
              )}
              <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                <span>🕒 {helpline.hours}</span>
                <span>🗣️ {helpline.languages.join(", ")}</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  if (type === "organizations") {
    return (
      <Card className="border-green-200 bg-green-50/50 dark:bg-green-950/20 dark:border-green-900">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-300">
            <MapPin className="h-5 w-5" />
            Mental Health Organizations
          </CardTitle>
          <CardDescription>
            Professional support services near you
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {resources.slice(0, 2).map((org, idx) => (
            <div
              key={idx}
              className="border border-green-200 dark:border-green-800 p-3 rounded-md bg-white dark:bg-slate-900"
            >
              <div className="font-semibold">{org.name}</div>
              <div className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                <MapPin className="h-3 w-3" />
                {org.city}
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                {org.services.join(" • ")}
              </div>
              {org.website && (
                <a
                  href={org.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-green-600 dark:text-green-400 mt-2 hover:underline"
                >
                  <Globe className="h-3 w-3" />
                  Visit website
                </a>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  if (type === "wellness") {
    return (
      <Card className="border-purple-200 bg-purple-50/50 dark:bg-purple-950/20 dark:border-purple-900">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-700 dark:text-purple-300">
            <Heart className="h-5 w-5" />
            Cultural Wellness Practices
          </CardTitle>
          <CardDescription>
            Traditional practices that might resonate with you
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {resources.slice(0, 3).map((practice, idx) => (
            <div
              key={idx}
              className="border-l-4 border-purple-500 pl-3 py-2"
            >
              <div className="font-medium text-sm">{practice.name}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {practice.description}
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {practice.benefits.slice(0, 3).map((benefit, i) => (
                  <span
                    key={i}
                    className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded-full"
                  >
                    {benefit}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  return null
}
