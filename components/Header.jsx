"use client"
import { Asterisk, MoreHorizontal, Menu, ChevronDown } from "lucide-react"
import { useState } from "react"
import GhostIconButton from "./GhostIconButton"

export default function Header({ createNewChat, sidebarCollapsed, setSidebarOpen }) {
  const [selectedBot, setSelectedBot] = useState("Gemini")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const chatbots = [
    { name: "Gemini", icon: "💎" },
    { name: "Gemini Pro", icon: "🔮" },
    { name: "Assistant", icon: <Asterisk className="h-4 w-4" /> },
  ]

  return (
    <>
      {/* Mobile header */}
      <div className="md:hidden sticky top-0 z-30 flex items-center gap-2 glass border-b border-white/20 dark:border-white/10 px-4 py-3">
        <button
          onClick={() => setSidebarOpen(true)}
          className="inline-flex items-center justify-center rounded-lg p-2 glass-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5 text-glass" />
        </button>

        <div className="flex-1 flex items-center justify-center text-sm font-semibold tracking-tight text-glass">
          <span className="inline-flex h-4 w-4 items-center justify-center mr-2">✱</span> Sahayak AI
        </div>
      </div>

      {/* Desktop header */}
      <div className="hidden md:flex sticky top-0 z-30 items-center gap-2 glass border-b border-white/20 dark:border-white/10 px-4 py-3">
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="inline-flex items-center gap-2 rounded-full glass-strong px-3 py-2 text-sm font-semibold tracking-tight text-glass glass-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
          >
            {typeof chatbots.find((bot) => bot.name === selectedBot)?.icon === "string" ? (
              <span className="text-sm">{chatbots.find((bot) => bot.name === selectedBot)?.icon}</span>
            ) : (
              chatbots.find((bot) => bot.name === selectedBot)?.icon
            )}
            {selectedBot}
            <ChevronDown className="h-4 w-4" />
          </button>

          {isDropdownOpen && (
            <div className="absolute top-full left-0 mt-1 w-48 rounded-lg glass-strong shadow-glass z-50">
              {chatbots.map((bot) => (
                <button
                  key={bot.name}
                  onClick={() => {
                    setSelectedBot(bot.name)
                    setIsDropdownOpen(false)
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-left text-glass glass-hover first:rounded-t-lg last:rounded-b-lg"
                >
                  {typeof bot.icon === "string" ? <span className="text-sm">{bot.icon}</span> : bot.icon}
                  {bot.name}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="ml-auto flex items-center gap-2">
          <div className="glass-subtle rounded-xl p-1">
            <GhostIconButton label="More">
              <MoreHorizontal className="h-4 w-4 text-glass" />
            </GhostIconButton>
          </div>
        </div>
      </div>
    </>
  )
}
