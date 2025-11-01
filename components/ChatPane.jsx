"use client"

import { useState, forwardRef, useImperativeHandle, useRef, useEffect } from "react"
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
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <div className="h-2.5 w-2.5 animate-bounce rounded-full bg-current opacity-70 [animation-delay:-0.3s]"></div>
          <div className="h-2.5 w-2.5 animate-bounce rounded-full bg-current opacity-70 [animation-delay:-0.15s]"></div>
          <div className="h-2.5 w-2.5 animate-bounce rounded-full bg-current opacity-70"></div>
        </div>
        <span className="text-[15px] opacity-70">Sahayak is thinking...</span>
        <button
          onClick={onPause}
          className="ml-auto hover:bg-black/5 dark:hover:bg-white/5 rounded-full px-3 py-1.5 text-xs transition-colors flex items-center gap-1.5"
        >
          <Square className="h-3.5 w-3.5" />
          Pause
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
  const messagesEndRef = useRef(null)
  const chatContainerRef = useRef(null)

  // Auto-scroll to bottom when messages change or when thinking
  useEffect(() => {
    const scrollToBottom = () => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
      }
    }

    // Scroll when messages change or thinking status changes
    const timer = setTimeout(scrollToBottom, 100)
    return () => clearTimeout(timer)
  }, [conversation?.messages, isThinking])

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
      <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-8">
          <div className="flex items-center justify-center min-h-full">
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
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col glass-bg">

      <div className="flex-1 space-y-5 overflow-y-auto px-4 py-6 sm:px-8" style={{
        maxWidth: '800px',
        marginLeft: 'auto',
        marginRight: 'auto'
      }}>
        <div className="mb-2 text-3xl font-serif tracking-tight sm:text-4xl md:text-5xl">
          <span className="block leading-[1.05] font-sans text-2xl text-glass">
            {conversation.title === "New Chat" ? "Chat with Sahayak" : conversation.title}
          </span>
        </div>
        <div className="mb-4 text-sm text-glass/70">
          Updated {timeAgo(conversation.updatedAt)} · {count} messages
        </div>

        <div className="mb-6 flex flex-wrap gap-2 border-b border-black/5 dark:border-white/5 pb-5">
          {tags.map((t) => (
            <span
              key={t}
              className="inline-flex items-center rounded-full bg-black/5 dark:bg-white/5 px-4 py-1.5 text-xs font-medium border border-black/10 dark:border-white/10"
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
            <div className="glass-gradient rounded-xl p-6 text-sm text-glass">
              <div className="text-center">
                <h3 className="font-medium text-glass mb-2">
                  Namaste! I'm Sahayak, your mental wellness companion.
                </h3>
                <p className="mb-4">
                  I'm here to provide culturally sensitive support for Indian youth. You can talk to me about:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-left">
                  <div className="p-3 rounded-lg glass-strong">
                    <strong>Academic Stress:</strong> Board exams, competitive entrance tests, career pressure
                  </div>
                  <div className="p-3 rounded-lg glass-strong">
                    <strong>Family Dynamics:</strong> Expectations, relationships, cultural conflicts
                  </div>
                  <div className="p-3 rounded-lg glass-strong">
                    <strong>Social Challenges:</strong> Peer pressure, identity, relationships
                  </div>
                  <div className="p-3 rounded-lg glass-strong">
                    <strong>Life Transitions:</strong> College, career, independence, marriage
                  </div>
                </div>
                <p className="mt-4 text-xs text-glass/70">All conversations are confidential. I'm here to listen without judgment.</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-2 justify-center">
              <button
                onClick={() => setShowMoodTracker(!showMoodTracker)}
                className="px-4 py-2 rounded-lg glass-subtle text-glass text-sm glass-hover"
              >
                Track My Mood
              </button>
              <button
                onClick={() => setShowResources(!showResources)}
                className="px-4 py-2 rounded-lg glass-subtle text-glass text-sm glass-hover"
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
                  <div className="rounded-[24px] p-4 bg-card/80 backdrop-blur-sm border border-border/50">
                    <textarea
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      className="w-full resize-y rounded-2xl bg-transparent p-3 text-[15px] outline-none placeholder:opacity-50"
                      rows={3}
                    />
                    <div className="mt-3 flex items-center gap-2">
                      <button
                        onClick={saveEdit}
                        className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-4 py-2 text-xs font-medium hover:opacity-90 transition-opacity"
                      >
                        <Check className="h-3.5 w-3.5" /> Save
                      </button>
                      <button
                        onClick={saveAndResend}
                        className="inline-flex items-center gap-2 rounded-full bg-black/5 dark:bg-white/5 px-4 py-2 text-xs font-medium hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                      >
                        <RefreshCw className="h-3.5 w-3.5" /> Save & Resend
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="inline-flex items-center gap-2 rounded-full bg-black/5 dark:bg-white/5 px-4 py-2 text-xs font-medium hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                      >
                        <X className="h-3.5 w-3.5" /> Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <Message role={m.role} attachments={m.attachments} content={m.content}>
                    {m.role === "user" && (
                      <div className="mt-2 flex gap-2 text-xs opacity-60">
                        <button className="inline-flex items-center gap-1.5 hover:opacity-100 transition-opacity rounded-full px-2 py-1 hover:bg-black/5 dark:hover:bg-white/5" onClick={() => startEdit(m)}>
                          <Pencil className="h-3.5 w-3.5" /> Edit
                        </button>
                        <button
                          className="inline-flex items-center gap-1.5 hover:opacity-100 transition-opacity rounded-full px-2 py-1 hover:bg-black/5 dark:hover:bg-white/5"
                          onClick={() => onResendMessage?.(m.id)}
                        >
                          <RefreshCw className="h-3.5 w-3.5" /> Resend
                        </button>
                      </div>
                    )}
                    {m.role === "assistant" &&
                      m.mentalWellnessData?.crisisLevel &&
                      m.mentalWellnessData.crisisLevel !== "LOW" && (
                        <div className="mt-2 text-xs text-glass/70">
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full glass-subtle text-glass">
                            Crisis Level: {m.mentalWellnessData.crisisLevel}
                          </span>
                        </div>
                      )}
                  </Message>
                )}
              </div>
            ))}
            {isThinking && <ThinkingMessage onPause={onPauseThinking} />}
            {/* Scroll anchor */}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <Composer
        ref={composerRef}
        onSend={async (text, files) => {
          if (!text.trim() && (!files || files.length === 0)) return
          setBusy(true)
          await onSend?.(text, files)
          setBusy(false)
        }}
        busy={busy}
      />
    </div>
  )
})

export default ChatPane
