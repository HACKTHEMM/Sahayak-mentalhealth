"use client"

import React, { useEffect, useMemo, useRef, useState } from "react"
import { Calendar, LayoutGrid, MoreHorizontal } from "lucide-react"
import Sidebar from "./Sidebar"
import Header from "./Header"
import ChatPane from "./ChatPane"
import LandingPage from "./LandingPage"
import GhostIconButton from "./GhostIconButton"
import ThemeToggle from "./ThemeToggle"
import { useCrisisDetection } from "../hooks/use-crisis-detection"
import { useMoodTracking } from "../hooks/use-mood-tracking"
import { useResources } from "../hooks/use-resources"
import culturalAdaptationEngine from "../lib/cultural-adaptation"
import crisisEscalationManager from "../lib/crisis-escalation"

export default function AIAssistantUI() {
  const [theme, setTheme] = useState("light")

  useEffect(() => {
    const saved = typeof window !== "undefined" && localStorage.getItem("theme")
    if (saved) {
      setTheme(saved)
    } else if (typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark")
    }
  }, [])

  useEffect(() => {
    try {
      if (theme === "dark") document.documentElement.classList.add("dark")
      else document.documentElement.classList.remove("dark")
      document.documentElement.setAttribute("data-theme", theme)
      document.documentElement.style.colorScheme = theme
      localStorage.setItem("theme", theme)
    } catch {}
  }, [theme])

  useEffect(() => {
    try {
      const media = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)")
      if (!media) return
      const listener = (e) => {
        const saved = localStorage.getItem("theme")
        if (!saved) setTheme(e.matches ? "dark" : "light")
      }
      media.addEventListener("change", listener)
      return () => media.removeEventListener("change", listener)
    } catch {}
  }, [])

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [collapsed, setCollapsed] = useState({ pinned: true, recent: false, folders: true, templates: true })
  
  useEffect(() => {
    try {
      const raw = localStorage.getItem("sidebar-collapsed")
      if (raw) {
        setCollapsed(JSON.parse(raw))
      }
    } catch {
      // Keep default values
    }
  }, [])
  useEffect(() => {
    try {
      localStorage.setItem("sidebar-collapsed", JSON.stringify(collapsed))
    } catch {}
  }, [collapsed])

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  useEffect(() => {
    try {
      const saved = localStorage.getItem("sidebar-collapsed-state")
      if (saved) {
        setSidebarCollapsed(JSON.parse(saved))
      }
    } catch {
      // Keep default value
    }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem("sidebar-collapsed-state", JSON.stringify(sidebarCollapsed))
    } catch {}
  }, [sidebarCollapsed])

  const [conversations, setConversations] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [templates, setTemplates] = useState([])
  const [folders, setFolders] = useState([])

  // Load conversations from localStorage on mount
  useEffect(() => {
    try {
      const savedConversations = localStorage.getItem("conversations")
      if (savedConversations) {
        const parsed = JSON.parse(savedConversations)
        setConversations(parsed)
        
        // If there are conversations, select the most recent one
        if (parsed.length > 0) {
          const mostRecent = parsed.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))[0]
          setSelectedId(mostRecent.id)
        }
      }
    } catch (error) {
      console.error("Failed to load conversations from localStorage:", error)
    }
  }, [])

  // Save conversations to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem("conversations", JSON.stringify(conversations))
    } catch (error) {
      console.error("Failed to save conversations to localStorage:", error)
    }
  }, [conversations])

  // Load and save selectedId
  useEffect(() => {
    try {
      const savedSelectedId = localStorage.getItem("selectedConversationId")
      if (savedSelectedId && conversations.length > 0) {
        // Only set if the conversation still exists
        const exists = conversations.find(c => c.id === savedSelectedId)
        if (exists) {
          setSelectedId(savedSelectedId)
        }
      }
    } catch (error) {
      console.error("Failed to load selected conversation ID:", error)
    }
  }, [conversations])

  useEffect(() => {
    try {
      if (selectedId) {
        localStorage.setItem("selectedConversationId", selectedId)
      } else {
        localStorage.removeItem("selectedConversationId")
      }
    } catch (error) {
      console.error("Failed to save selected conversation ID:", error)
    }
  }, [selectedId])

  // Load folders and templates from localStorage
  useEffect(() => {
    try {
      const savedFolders = localStorage.getItem("folders")
      if (savedFolders) {
        setFolders(JSON.parse(savedFolders))
      } else {
        // Set default folders if none exist
        const defaultFolders = [
          { id: "work", name: "Work Projects", createdAt: new Date().toISOString() },
          { id: "personal", name: "Personal", createdAt: new Date().toISOString() }
        ]
        setFolders(defaultFolders)
      }

      const savedTemplates = localStorage.getItem("templates")
      if (savedTemplates) {
        setTemplates(JSON.parse(savedTemplates))
      }
    } catch (error) {
      console.error("Failed to load folders/templates from localStorage:", error)
    }
  }, [])

  // Save folders and templates to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("folders", JSON.stringify(folders))
    } catch (error) {
      console.error("Failed to save folders to localStorage:", error)
    }
  }, [folders])

  useEffect(() => {
    try {
      localStorage.setItem("templates", JSON.stringify(templates))
    } catch (error) {
      console.error("Failed to save templates to localStorage:", error)
    }
  }, [templates])

  const [query, setQuery] = useState("")
  const searchRef = useRef(null)

  const [isThinking, setIsThinking] = useState(false)
  const [thinkingConvId, setThinkingConvId] = useState(null)

  const [userProfile, setUserProfile] = useState({})

  useEffect(() => {
    try {
      const saved = localStorage.getItem("user-cultural-profile")
      if (saved) {
        setUserProfile(JSON.parse(saved))
      }
    } catch {
      // Keep default value
    }
  }, [])

  const [showProfileSetup, setShowProfileSetup] = useState(false)

  useEffect(() => {
    setShowProfileSetup(Object.keys(userProfile).length === 0)
  }, [userProfile])

  // Mental wellness hooks
  const crisisDetection = useCrisisDetection()
  const moodTracking = useMoodTracking()
  const resources = useResources()

  // Save user profile to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("user-cultural-profile", JSON.stringify(userProfile))
    } catch (error) {
      console.error("Failed to save user profile:", error)
    }
  }, [userProfile])

  const filtered = useMemo(() => {
    if (!query.trim()) return conversations
    const q = query.toLowerCase()
    return conversations.filter((c) => c.title.toLowerCase().includes(q) || c.preview.toLowerCase().includes(q))
  }, [conversations, query])

  const pinned = filtered.filter((c) => c.pinned).sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1))

  const recent = filtered
    .filter((c) => !c.pinned)
    .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1))
    .slice(0, 10)

  const folderCounts = React.useMemo(() => {
    const map = Object.fromEntries(folders.map((f) => [f.name, 0]))
    for (const c of conversations) if (map[c.folder] != null) map[c.folder] += 1
    return map
  }, [conversations, folders])

  function togglePin(id) {
    setConversations((prev) => prev.map((c) => (c.id === id ? { ...c, pinned: !c.pinned } : c)))
  }

  function createFolder(name) {
    const newFolder = {
      id: Math.random().toString(36).slice(2),
      name,
      createdAt: new Date().toISOString(),
    }
    setFolders((prev) => [...prev, newFolder])
  }

  function clearAllConversations() {
    try {
      setConversations([])
      setSelectedId(null)
      localStorage.removeItem("conversations")
      localStorage.removeItem("selectedConversationId")
    } catch (error) {
      console.error("Failed to clear conversations:", error)
    }
  }

  function deleteConversation(id) {
    try {
      setConversations((prev) => prev.filter(c => c.id !== id))
      if (selectedId === id) {
        const remaining = conversations.filter(c => c.id !== id)
        setSelectedId(remaining.length > 0 ? remaining[0].id : null)
      }
    } catch (error) {
      console.error("Failed to delete conversation:", error)
    }
  }

  function createNewChat() {
    const id = Math.random().toString(36).slice(2)
    const item = {
      id,
      title: "New Chat",
      updatedAt: new Date().toISOString(),
      messageCount: 0,
      preview: "Say hello to start...",
      pinned: false,
      folder: "Work Projects",
      messages: [], // Ensure messages array is empty for new chats
      mentalWellnessData: {
        crisisLevel: "LOW",
        moodEntries: [],
        culturalContext: userProfile,
        sessionId: `session_${id}_${Date.now()}`,
      },
    }
    setConversations((prev) => [item, ...prev])
    setSelectedId(id)
    setSidebarOpen(false)
  }

  async function sendMessage(convId, content) {
    if (!content.trim()) return
    const now = new Date().toISOString()
    const userMsg = { id: Math.random().toString(36).slice(2), role: "user", content, createdAt: now }

    // Generate a short title from the first message if it's a new chat
    const conversation = conversations.find((c) => c.id === convId)
    let newTitle = conversation?.title
    if (conversation?.title === "New Chat" && content.trim()) {
      // Create a concise title from the first few words, max 10 characters
      const words = content.trim().split(/\s+/).slice(0, 3)
      let titleWords = []
      let charCount = 0
      
      for (const word of words) {
        if (charCount + word.length <= 10) {
          titleWords.push(word)
          charCount += word.length
        } else {
          break
        }
      }
      
      newTitle = titleWords.length > 0 ? titleWords.join(" ") : content.slice(0, 10)
      if (newTitle.length >= 10 && content.length > 10) {
        newTitle = newTitle.slice(0, 7) + "..."
      }
    }

    // Update conversation with user message
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id !== convId) return c
        const msgs = [...(c.messages || []), userMsg]
        return {
          ...c,
          title: newTitle || c.title,
          messages: msgs,
          updatedAt: now,
          messageCount: msgs.length,
          preview: content.slice(0, 80),
        }
      }),
    )

    setIsThinking(true)
    setThinkingConvId(convId)

    try {
      // Get conversation context
      const conversation = conversations.find((c) => c.id === convId)
      const conversationHistory = (conversation?.messages || [])
        .slice(-5) // Last 5 messages for context
        .map((m) => `${m.role}: ${m.content}`)
        .join("\n")

      // Call mental wellness API
      const response = await fetch("/api/mental-wellness", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: content,
          context: {
            sessionId: conversation?.mentalWellnessData?.sessionId || `session_${convId}_${Date.now()}`,
            ageContext: userProfile.lifeStage || "college student",
            conversationHistory,
            moodIndicators: moodTracking.moodHistory
              .slice(0, 3)
              .map((m) => m.mood)
              .join(", "),
          },
          userProfile: userProfile,
        }),
      })

      const data = await response.json()

      // Process crisis detection
      if (data.crisisLevel) {
        const crisisLevel = crisisDetection.analyzeCrisisLevel(data.crisisLevel)

        // Log crisis event for escalation management
        if (crisisLevel && crisisLevel !== "LOW") {
          await crisisEscalationManager.processCrisisEvent(
            { crisisLevel: data.crisisLevel, followUpNeeded: data.followUpNeeded },
            { sessionId: data.sessionId, userId: convId },
          )
        }
      }

      // Apply cultural adaptation if user has profile
      let finalResponse = data.response
      if (Object.keys(userProfile).length > 0) {
        const adaptedResult = culturalAdaptationEngine.adaptResponse(convId, data.response, {
          userMessage: content,
          conversationHistory,
        })
        finalResponse = adaptedResult.adaptedResponse
      }

      // Update conversation with AI response
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id !== convId) return c
          const asstMsg = {
            id: Math.random().toString(36).slice(2),
            role: "assistant",
            content: finalResponse,
            createdAt: new Date().toISOString(),
            mentalWellnessData: {
              crisisLevel: data.crisisLevel,
              followUpNeeded: data.followUpNeeded,
              culturallyAdapted: Object.keys(userProfile).length > 0,
            },
          }
          const msgs = [...(c.messages || []), asstMsg]
          return {
            ...c,
            messages: msgs,
            updatedAt: new Date().toISOString(),
            messageCount: msgs.length,
            preview: finalResponse.slice(0, 80),
            mentalWellnessData: {
              ...c.mentalWellnessData,
              crisisLevel: data.crisisLevel,
              lastResponse: new Date().toISOString(),
            },
          }
        }),
      )
    } catch (error) {
      console.error("Mental wellness API error:", error)

      // Fallback to safe response
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id !== convId) return c
          const fallbackMsg = {
            id: Math.random().toString(36).slice(2),
            role: "assistant",
            content: `I'm here to listen and support you. While I'm having some technical difficulties right now, please know that your feelings are valid and you're not alone. 

If you're in immediate distress, please reach out to:
- National Suicide Prevention: 9152987821
- AASRA: 9820466726
- Vandrevala Foundation: 9999666555

Is there something specific you'd like to talk about right now?`,
            createdAt: new Date().toISOString(),
            mentalWellnessData: {
              crisisLevel: "LOW",
              fallbackResponse: true,
            },
          }
          const msgs = [...(c.messages || []), fallbackMsg]
          return {
            ...c,
            messages: msgs,
            updatedAt: new Date().toISOString(),
            messageCount: msgs.length,
            preview: fallbackMsg.content.slice(0, 80),
          }
        }),
      )
    } finally {
      setIsThinking(false)
      setThinkingConvId(null)
    }
  }

  function editMessage(convId, messageId, newContent) {
    const now = new Date().toISOString()
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id !== convId) return c
        const msgs = (c.messages || []).map((m) =>
          m.id === messageId ? { ...m, content: newContent, editedAt: now } : m,
        )
        return {
          ...c,
          messages: msgs,
          preview: msgs[msgs.length - 1]?.content?.slice(0, 80) || c.preview,
        }
      }),
    )
  }

  function resendMessage(convId, messageId) {
    const conv = conversations.find((c) => c.id === convId)
    const msg = conv?.messages?.find((m) => m.id === messageId)
    if (!msg) return
    sendMessage(convId, msg.content)
  }

  function pauseThinking() {
    setIsThinking(false)
    setThinkingConvId(null)
  }

  function handleUseTemplate(template) {
    // This will be passed down to the Composer component
    // The Composer will handle inserting the template content
    if (composerRef.current) {
      composerRef.current.insertTemplate(template.content)
    }
  }

  const composerRef = useRef(null)

  const handleProfileComplete = (profile) => {
    setUserProfile(profile)
    setShowProfileSetup(false)

    // Update cultural adaptation engine
    culturalAdaptationEngine.updateUserProfile(selectedId || "default", profile)
  }

  const handleProfileSkip = () => {
    setShowProfileSetup(false)
  }

  const handleMoodSubmit = async (moodEntry) => {
    moodTracking.addMoodEntry(moodEntry)

    // Update current conversation with mood context
    if (selectedId) {
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id !== selectedId) return c
          return {
            ...c,
            mentalWellnessData: {
              ...c.mentalWellnessData,
              moodEntries: [...(c.mentalWellnessData?.moodEntries || []), moodEntry],
            },
          }
        }),
      )
    }
  }

  const handleCheckInComplete = (checkInData) => {
    moodTracking.addCheckInEntry(checkInData)
  }

  const handleResourceClick = (resource, category) => {
    resources.trackResourceAccess(resource, category)
  }

  // Development utility - expose clearAllConversations to window for testing
  useEffect(() => {
    if (typeof window !== "undefined" && process.env.NODE_ENV === 'development') {
      window.clearAllConversations = clearAllConversations
      window.clearAllData = () => {
        localStorage.clear()
        window.location.reload()
      }
    }
  }, [])

  const selected = conversations.find((c) => c.id === selectedId) || null

  // Show landing page if there are no conversations
  const showLandingPage = conversations.length === 0

  return (
    <div className="h-screen w-full glass-bg text-foreground overflow-hidden">
      {showLandingPage ? (
        <LandingPage 
          onGetStarted={createNewChat}
          userProfile={userProfile}
          onShowProfileSetup={() => setShowProfileSetup(true)}
          theme={theme}
          setTheme={setTheme}
        />
      ) : (
        <>
          <div className="md:hidden fixed top-0 left-0 right-0 z-40 flex items-center gap-2 glass border-b border-white/20 dark:border-white/10 px-3 py-2">
            <div className="ml-1 flex items-center gap-2 text-sm font-semibold tracking-tight text-glass">
              <span className="inline-flex h-4 w-4 items-center justify-center">✱</span> Sahayak
            </div>
            <div className="ml-auto flex items-center gap-2">
              <div className="glass-subtle rounded-xl p-1">
                <GhostIconButton label="Schedule">
                  <Calendar className="h-4 w-4 text-glass" />
                </GhostIconButton>
              </div>
              <div className="glass-subtle rounded-xl p-1">
                <GhostIconButton label="Apps">
                  <LayoutGrid className="h-4 w-4 text-glass" />
                </GhostIconButton>
              </div>
              <div className="glass-subtle rounded-xl p-1">
                <GhostIconButton label="More">
                  <MoreHorizontal className="h-4 w-4 text-glass" />
                </GhostIconButton>
              </div>
              <div className="glass-subtle rounded-xl p-1">
                <ThemeToggle theme={theme} setTheme={setTheme} />
              </div>
            </div>
          </div>

          <div className="flex h-screen md:h-[calc(100vh-0px)] overflow-hidden pt-14 md:pt-0">
            <Sidebar
              open={sidebarOpen}
              onClose={() => setSidebarOpen(false)}
              theme={theme}
              setTheme={setTheme}
              collapsed={collapsed}
              setCollapsed={setCollapsed}
              sidebarCollapsed={sidebarCollapsed}
              setSidebarCollapsed={setSidebarCollapsed}
              conversations={conversations}
              pinned={pinned}
              recent={recent}
              folders={folders}
              folderCounts={folderCounts}
              selectedId={selectedId}
              onSelect={(id) => setSelectedId(id)}
              togglePin={togglePin}
              query={query}
              setQuery={setQuery}
              searchRef={searchRef}
              createFolder={createFolder}
              createNewChat={createNewChat}
              templates={templates}
              setTemplates={setTemplates}
              onUseTemplate={handleUseTemplate}
              userProfile={userProfile}
              onShowProfileSetup={() => setShowProfileSetup(true)}
              moodTracking={moodTracking}
              crisisDetection={crisisDetection}
            />

            <main className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
              <Header createNewChat={createNewChat} sidebarCollapsed={sidebarCollapsed} setSidebarOpen={setSidebarOpen} />
              <ChatPane
                ref={composerRef}
                conversation={selected}
                onSend={(content) => selected && sendMessage(selected.id, content)}
                onEditMessage={(messageId, newContent) => selected && editMessage(selected.id, messageId, newContent)}
                onResendMessage={(messageId) => selected && resendMessage(selected.id, messageId)}
                isThinking={isThinking && thinkingConvId === selected?.id}
                onPauseThinking={pauseThinking}
                userProfile={userProfile}
                showProfileSetup={showProfileSetup}
                onProfileComplete={handleProfileComplete}
                onProfileSkip={handleProfileSkip}
                moodTracking={moodTracking}
                onMoodSubmit={handleMoodSubmit}
                onCheckInComplete={handleCheckInComplete}
                crisisDetection={crisisDetection}
                onResourceClick={handleResourceClick}
              />
            </main>
          </div>
        </>
      )}
    </div>
  )
}
