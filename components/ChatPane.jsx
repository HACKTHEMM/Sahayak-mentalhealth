"use client"

import { useState, forwardRef, useImperativeHandle, useRef } from "react"
import { Pencil, RefreshCw, Check, X, Square } from "lucide-react"
import Message from "./Message"
import Composer from "./Composer"
import { cls, timeAgo } from "./utils"
import CrisisAlert from "./CrisisAlert"
import MoodCheckIn from "./MoodCheckIn"
import MoodTracker from "./MoodTracker"
import ResourceRecommendations from "./ResourceRecommendations"
import CulturalProfileSetup from "./CulturalProfileSetup"
import CulturalInsights from "./CulturalInsights"

function ThinkingMessage({ onPause }) {
  return (
    <Message role="assistant">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          <div className="h-2 w-2 animate-bounce rounded-full bg-zinc-400 [animation-delay:-0.3s]"></div>
          <div className="h-2 w-2 animate-bounce rounded-full bg-zinc-400 [animation-delay:-0.15s]"></div>
          <div className="h-2 w-2 animate-bounce rounded-full bg-zinc-400"></div>
        </div>
        <span className="text-sm text-zinc-500">Sahayak is thinking...</span>
        <button
          onClick={onPause}
          className="ml-auto inline-flex items-center gap-1 rounded-full border border-zinc-300 px-2 py-1 text-xs text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
        >
          <Square className="h-3 w-3" /> Pause
        </button>
      </div>
    </Message>
  )
}

const ChatPane = forwardRef(function ChatPane(
  {
    conversation,
    onSend,
    onEditMessage,
    onResendMessage,
    isThinking,
    onPauseThinking,
    userProfile = {},
    showProfileSetup = false,
    onProfileComplete,
    onProfileSkip,
    moodTracking,
    onMoodSubmit,
    onCheckInComplete,
    crisisDetection,
    onResourceClick,
  },
  ref,
) {
  const [editingId, setEditingId] = useState(null)
  const [draft, setDraft] = useState("")
  const [busy, setBusy] = useState(false)
  const [showMoodTracker, setShowMoodTracker] = useState(false)
  const [showResources, setShowResources] = useState(false)
  const composerRef = useRef(null)

  useImperativeHandle(
    ref,
    () => ({
      insertTemplate: (templateContent) => {
        composerRef.current?.insertTemplate(templateContent)
      },
    }),
    [],
  )

  if (!conversation) return null

  const tags = ["Culturally Sensitive", "Confidential", "Empathetic", "Supportive"]
  const messages = Array.isArray(conversation.messages) ? conversation.messages : []
  const count = messages.length || conversation.messageCount || 0

  const currentCrisisLevel = conversation.mentalWellnessData?.crisisLevel || crisisDetection.crisisLevel

  function startEdit(m) {
    setEditingId(m.id)
    setDraft(m.content)
  }
  function cancelEdit() {
    setEditingId(null)
    setDraft("")
  }
  function saveEdit() {
    if (!editingId) return
    onEditMessage?.(editingId, draft)
    cancelEdit()
  }
  function saveAndResend() {
    if (!editingId) return
    onEditMessage?.(editingId, draft)
    onResendMessage?.(editingId)
    cancelEdit()
  }

  if (showProfileSetup) {
    return (
      <div className="flex h-full min-h-0 flex-1 flex-col items-center justify-center p-8">
        <div className="w-full max-w-4xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Welcome to Sahayak</h1>
            <p className="text-lg text-zinc-600 dark:text-zinc-400">
              Your compassionate AI mental wellness companion for Indian youth
            </p>
            <p className="text-sm text-zinc-500 mt-2">
              Let's set up your cultural profile to provide you with the most relevant support
            </p>
          </div>
          <CulturalProfileSetup
            onProfileComplete={onProfileComplete}
            onSkip={onProfileSkip}
            initialProfile={userProfile}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col">
      <div className="flex-1 space-y-5 overflow-y-auto px-4 py-6 sm:px-8">
        <div className="mb-2 text-3xl font-serif tracking-tight sm:text-4xl md:text-5xl">
          <span className="block leading-[1.05] font-sans text-2xl">
            {conversation.title === "New Chat" ? "Chat with Sahayak" : conversation.title}
          </span>
        </div>
        <div className="mb-4 text-sm text-zinc-500 dark:text-zinc-400">
          Updated {timeAgo(conversation.updatedAt)} · {count} messages
        </div>

        <div className="mb-6 flex flex-wrap gap-2 border-b border-zinc-200 pb-5 dark:border-zinc-800">
          {tags.map((t) => (
            <span
              key={t}
              className="inline-flex items-center rounded-full border border-zinc-200 px-3 py-1 text-xs text-zinc-700 dark:border-zinc-800 dark:text-zinc-200"
            >
              {t}
            </span>
          ))}
        </div>

        {/* Crisis Alert */}
        <CrisisAlert crisisLevel={currentCrisisLevel} onDismiss={crisisDetection.dismissCrisisAlert} />

        {/* Mood Check-in */}
        <MoodCheckIn
          onStartCheckIn={onCheckInComplete}
          lastCheckIn={moodTracking.lastCheckIn}
          isVisible={moodTracking.shouldShowCheckIn()}
        />

        {/* Cultural Insights */}
        {Object.keys(userProfile).length > 0 && (
          <CulturalInsights
            insights={[
              {
                type: "cultural",
                message: `As someone from ${userProfile.region} India in the ${userProfile.lifeStage?.replace("-", " ")} stage, I understand the unique challenges you face.`,
              },
            ]}
            userProfile={userProfile}
          />
        )}

        {messages.length === 0 ? (
          <div className="space-y-4">
            <div className="rounded-xl border border-dashed border-zinc-300 p-6 text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
              <div className="text-center">
                <h3 className="font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  Namaste! I'm Sahayak, your mental wellness companion.
                </h3>
                <p className="mb-4">
                  I'm here to provide culturally sensitive support for Indian youth. You can talk to me about:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-left">
                  <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20">
                    <strong>Academic Stress:</strong> Board exams, competitive entrance tests, career pressure
                  </div>
                  <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/20">
                    <strong>Family Dynamics:</strong> Expectations, relationships, cultural conflicts
                  </div>
                  <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-950/20">
                    <strong>Social Challenges:</strong> Peer pressure, identity, relationships
                  </div>
                  <div className="p-3 rounded-lg bg-orange-50 dark:bg-orange-950/20">
                    <strong>Life Transitions:</strong> College, career, independence, marriage
                  </div>
                </div>
                <p className="mt-4 text-xs">All conversations are confidential. I'm here to listen without judgment.</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-2 justify-center">
              <button
                onClick={() => setShowMoodTracker(!showMoodTracker)}
                className="px-4 py-2 rounded-lg bg-blue-100 text-blue-700 text-sm hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300"
              >
                Track My Mood
              </button>
              <button
                onClick={() => setShowResources(!showResources)}
                className="px-4 py-2 rounded-lg bg-green-100 text-green-700 text-sm hover:bg-green-200 dark:bg-green-900/30 dark:text-green-300"
              >
                Find Resources
              </button>
            </div>

            {/* Mood Tracker */}
            {showMoodTracker && <MoodTracker onMoodSubmit={onMoodSubmit} recentMoods={moodTracking.moodHistory} />}

            {/* Resources */}
            {showResources && (
              <ResourceRecommendations
                userProfile={userProfile}
                onResourceClick={onResourceClick}
                showPersonalized={Object.keys(userProfile).length > 0}
              />
            )}
          </div>
        ) : (
          <>
            {messages.map((m) => (
              <div key={m.id} className="space-y-2">
                {editingId === m.id ? (
                  <div className={cls("rounded-2xl border p-2", "border-zinc-200 dark:border-zinc-800")}>
                    <textarea
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      className="w-full resize-y rounded-xl bg-transparent p-2 text-sm outline-none"
                      rows={3}
                    />
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        onClick={saveEdit}
                        className="inline-flex items-center gap-1 rounded-full bg-zinc-900 px-3 py-1.5 text-xs text-white dark:bg-white dark:text-zinc-900"
                      >
                        <Check className="h-3.5 w-3.5" /> Save
                      </button>
                      <button
                        onClick={saveAndResend}
                        className="inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs"
                      >
                        <RefreshCw className="h-3.5 w-3.5" /> Save & Resend
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs"
                      >
                        <X className="h-3.5 w-3.5" /> Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <Message role={m.role}>
                    <div className="whitespace-pre-wrap">{m.content}</div>
                    {m.role === "user" && (
                      <div className="mt-1 flex gap-2 text-[11px] text-zinc-500">
                        <button className="inline-flex items-center gap-1 hover:underline" onClick={() => startEdit(m)}>
                          <Pencil className="h-3.5 w-3.5" /> Edit
                        </button>
                        <button
                          className="inline-flex items-center gap-1 hover:underline"
                          onClick={() => onResendMessage?.(m.id)}
                        >
                          <RefreshCw className="h-3.5 w-3.5" /> Resend
                        </button>
                      </div>
                    )}
                    {m.role === "assistant" &&
                      m.mentalWellnessData?.crisisLevel &&
                      m.mentalWellnessData.crisisLevel !== "LOW" && (
                        <div className="mt-2 text-xs text-zinc-500">
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300">
                            Crisis Level: {m.mentalWellnessData.crisisLevel}
                          </span>
                        </div>
                      )}
                  </Message>
                )}
              </div>
            ))}
            {isThinking && <ThinkingMessage onPause={onPauseThinking} />}
          </>
        )}
      </div>

      <Composer
        ref={composerRef}
        onSend={async (text) => {
          if (!text.trim()) return
          setBusy(true)
          await onSend?.(text)
          setBusy(false)
        }}
        busy={busy}
      />
    </div>
  )
})

export default ChatPane
