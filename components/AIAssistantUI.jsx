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
import {
  getUserConversations,
  createConversation,
  updateConversation,
  deleteConversation,
  addMessage,
  updateMessage,
  getConversationMessages,
  createOrUpdateUserProfile,
  createFolder,
  getUserFolders,
  createTemplate,
  getUserTemplates,
  createMoodEntry,
  createCrisisLog
} from "../lib/db-helpers"

export default function AIAssistantUI({ userProfile: initialUserProfile, userId }) {
  const [theme, setTheme] = useState("light")

  useEffect(() => {
    const saved = typeof window !== "undefined" && localStorage.getItem("theme")
    if (saved) {
      setTheme(saved)
    }
    // Default to light mode, don't automatically switch to dark based on system preference
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

  // Theme effects removed - using light mode as default with manual switching only

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

  // Load conversations from Supabase on mount
  useEffect(() => {
    async function loadConversations() {
      if (!userId) return

      try {
        const supabaseConvos = await getUserConversations(userId)
        if (supabaseConvos && supabaseConvos.length > 0) {
          // Transform Supabase format to app format
          const transformed = supabaseConvos.map(c => ({
            id: c.id,
            title: c.title,
            preview: c.preview || '',
            pinned: c.pinned,
            messageCount: c.message_count,
            folder: 'General', // You can map this properly later
            updatedAt: c.updated_at,
            messages: [], // Messages loaded separately
            mentalWellnessData: {
              crisisLevel: c.crisis_level || 'LOW',
              sessionId: c.session_id,
              moodEntries: [],
              culturalContext: initialUserProfile || {}
            }
          }))
          setConversations(transformed)

          // Select most recent
          if (transformed.length > 0) {
            const mostRecent = transformed.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))[0]
            setSelectedId(mostRecent.id)
          }
        }
      } catch (error) {
        console.error("Failed to load conversations from Supabase:", error)
      }
    }

    loadConversations()
  }, [userId])

  // Load messages when conversation is selected
  useEffect(() => {
    async function loadMessages() {
      if (!selectedId) return

      try {
        const messages = await getConversationMessages(selectedId)

        // Transform Supabase format to app format
        const transformedMessages = messages.map(m => ({
          id: m.id,
          role: m.role,
          content: m.content,
          createdAt: m.created_at,
          mentalWellnessData: {
            crisisLevel: m.crisis_level,
            followUpNeeded: m.follow_up_needed,
            culturallyAdapted: m.culturally_adapted
          }
        }))

        // Update the selected conversation with messages
        setConversations(prev =>
          prev.map(c =>
            c.id === selectedId
              ? { ...c, messages: transformedMessages }
              : c
          )
        )
      } catch (error) {
        console.error('Failed to load messages:', error)
      }
    }

    loadMessages()
  }, [selectedId])

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

  const [userProfile, setUserProfile] = useState(initialUserProfile || {})

  useEffect(() => {
    // Load from Supabase profile if available
    if (initialUserProfile && Object.keys(initialUserProfile).length > 0) {
      setUserProfile({
        culture: initialUserProfile.culture,
        language: initialUserProfile.language,
        lifeStage: initialUserProfile.life_stage,
        communicationStyle: initialUserProfile.communication_style,
        religiousBackground: initialUserProfile.religious_background,
        familyStructure: initialUserProfile.family_structure,
        preferences: initialUserProfile.preferences || {}
      })
    }
  }, [initialUserProfile])

  const [showProfileSetup, setShowProfileSetup] = useState(false)
  const [profileCompleted, setProfileCompleted] = useState(false)

  useEffect(() => {
    // Only show profile setup if:
    // 1. Profile hasn't been completed in this session
    // 2. No initial profile exists OR it's missing culture field
    if (!profileCompleted) {
      setShowProfileSetup(!initialUserProfile || Object.keys(initialUserProfile).length === 0 || !initialUserProfile.culture)
    }
  }, [initialUserProfile, profileCompleted])

  // Mental wellness hooks
  const crisisDetection = useCrisisDetection()
  const moodTracking = useMoodTracking()
  const resources = useResources()

  // Save user profile to Supabase when updated
  useEffect(() => {
    async function saveProfile() {
      if (!userId || !userProfile || Object.keys(userProfile).length === 0) return

      try {
        await createOrUpdateUserProfile({
          clerk_user_id: userId,
          culture: userProfile.culture,
          language: userProfile.language,
          life_stage: userProfile.lifeStage,
          communication_style: userProfile.communicationStyle,
          religious_background: userProfile.religiousBackground,
          family_structure: userProfile.familyStructure,
          preferences: userProfile.preferences || {}
        })
      } catch (error) {
        console.error("Failed to save user profile to Supabase:", error)
      }
    }

    saveProfile()
  }, [userProfile, userId])

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

  async function togglePin(id) {
    const conversation = conversations.find(c => c.id === id)
    if (!conversation) {
      console.warn('⚠️ togglePin: Conversation not found:', id)
      return
    }

    console.log('🔄 togglePin called:', {
      id,
      currentlyPinned: conversation.pinned,
      action: conversation.pinned ? 'restore' : 'delete'
    })

    // If currently pinned (in trash), restore it
    // If not pinned, move to trash (delete from DB)
    if (!conversation.pinned) {
      // Moving to trash - delete from database
      console.log('📍 Calling deleteConversation for:', id)
      try {
        const success = await deleteConversation(id)
        console.log('📍 deleteConversation returned:', success)

        if (success) {
          console.log('✅ Delete successful, updating local state')
          // Remove from local state
          setConversations((prev) => prev.filter((c) => c.id !== id))
          // If this was the selected conversation, clear selection
          if (selectedId === id) {
            setSelectedId(null)
          }
        } else {
          console.error('❌ Failed to delete conversation from database (deleteConversation returned false)')
          // Check if there were any console errors from db-helpers
          console.log('💡 Check the console above for detailed error logs from db-helpers')
        }
      } catch (error) {
        console.error('💥 Exception while deleting conversation:', error)
      }
    } else {
      // Restoring from trash - just update local state (can add DB update if needed)
      console.log('♻️ Restoring conversation from trash')
      setConversations((prev) => prev.map((c) => (c.id === id ? { ...c, pinned: false } : c)))
    }
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

  // NOTE: deleteConversation is now imported from db-helpers, not defined locally

  async function createNewChat() {
    if (!userId) {
      console.error("Cannot create chat: no userId")
      return
    }

    const sessionId = `session_${Date.now()}`

    try {
      // Create conversation in Supabase (pass Clerk user ID)
      const newConvo = await createConversation({
        title: "New Chat",
        preview: "Say hello to start...",
        pinned: false,
        message_count: 0,
        crisis_level: "LOW",
        session_id: sessionId
      }, userId)

      if (newConvo) {
        // Add to local state
        const item = {
          id: newConvo.id,
          title: newConvo.title,
          updatedAt: newConvo.updated_at,
          messageCount: 0,
          preview: newConvo.preview || '',
          pinned: false,
          folder: "Work Projects",
          messages: [],
          mentalWellnessData: {
            crisisLevel: "LOW",
            moodEntries: [],
            culturalContext: userProfile,
            sessionId: sessionId,
          },
        }
        setConversations((prev) => [item, ...prev])
        setSelectedId(newConvo.id)
        setSidebarOpen(false)
      }
    } catch (error) {
      console.error("Failed to create new chat:", error)
    }
  }

  async function sendMessage(convId, content, files = []) {
    if (!content.trim() && files.length === 0) return
    const now = new Date().toISOString()
    const userMsg = {
      id: Math.random().toString(36).slice(2),
      role: "user",
      content,
      createdAt: now,
      attachments: files.length > 0 ? files.map(f => ({ name: f.file.name, type: f.type })) : undefined
    }

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

    // Save user message to Supabase (attachments are NOT saved - one-time use only)
    try {
      await addMessage({
        conversation_id: convId,
        role: 'user',
        content: content,
        crisis_level: null,
        follow_up_needed: false,
        culturally_adapted: false
      })
    } catch (error) {
      console.error('Failed to save user message to Supabase:', error)
    }

    // Update conversation with user message in local state
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

      // Call mental wellness API with multimodal support
      const formData = new FormData()
      formData.append('message', content)
      formData.append('context', JSON.stringify({
        sessionId: conversation?.mentalWellnessData?.sessionId || `session_${convId}_${Date.now()}`,
        ageContext: userProfile.lifeStage || "college student",
        conversationHistory,
        moodIndicators: moodTracking.moodHistory
          .slice(0, 3)
          .map((m) => m.mood)
          .join(", "),
      }))
      formData.append('userProfile', JSON.stringify(userProfile))

      // Append files if any
      files.forEach((fileData) => {
        formData.append('files', fileData.file)
      })

      const response = await fetch("/api/mental-wellness", {
        method: "POST",
        body: formData,
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

          // Save crisis log to Supabase
          if (userId) {
            try {
              await createCrisisLog({
                conversation_id: convId,
                crisis_level: data.crisisLevel,
                session_id: data.sessionId,
                message_content: content,
                ai_response: data.response,
                follow_up_needed: data.followUpNeeded || false,
                follow_up_completed: false,
                escalated: crisisLevel === 'CRISIS'
              }, userId)
            } catch (error) {
              console.error('Failed to save crisis log to Supabase:', error)
            }
          }
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

      // Save assistant message to Supabase
      try {
        await addMessage({
          conversation_id: convId,
          role: 'assistant',
          content: finalResponse,
          crisis_level: data.crisisLevel,
          follow_up_needed: data.followUpNeeded || false,
          culturally_adapted: Object.keys(userProfile).length > 0
        })

        // Update conversation metadata in Supabase
        const currentConvo = conversations.find(c => c.id === convId)
        const newMessageCount = (currentConvo?.messageCount || 0) + 2 // User + assistant
        await updateConversation(convId, {
          title: newTitle || currentConvo?.title || "New Chat",
          preview: finalResponse.slice(0, 80),
          message_count: newMessageCount,
          crisis_level: data.crisisLevel || 'LOW',
          updated_at: new Date().toISOString()
        })
      } catch (error) {
        console.error('Failed to save assistant message to Supabase:', error)
      }

      // Update conversation with AI response in local state
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

  async function editMessage(convId, messageId, newContent) {
    const now = new Date().toISOString()

    // Update message in Supabase
    try {
      await updateMessage(messageId, newContent)
    } catch (error) {
      console.error('Failed to update message in Supabase:', error)
    }

    // Update local state
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

  const handleProfileComplete = async (profile) => {
    setUserProfile(profile)
    setShowProfileSetup(false)
    setProfileCompleted(true) // Mark profile as completed in this session

    // Save profile to Supabase
    if (userId) {
      try {
        await createOrUpdateUserProfile({
          clerk_user_id: userId,
          culture: profile.culture || null,
          region: profile.region || null,
          language: profile.language || null,
          life_stage: profile.lifeStage || null,
          preferences: profile.preferences || {}
        })
      } catch (error) {
        console.error('Failed to save user profile to Supabase:', error)
      }
    }

    // Update cultural adaptation engine
    culturalAdaptationEngine.updateUserProfile(selectedId || "default", profile)
  }

  const handleProfileSkip = () => {
    setShowProfileSetup(false)
    setProfileCompleted(true) // Mark as completed even if skipped
  }

  const handleMoodSubmit = async (moodEntry) => {
    moodTracking.addMoodEntry(moodEntry)

    // Save mood entry to Supabase
    if (userId) {
      try {
        await createMoodEntry({
          conversation_id: selectedId || null,
          mood: moodEntry.mood,
          intensity: moodEntry.intensity || 5,
          triggers: moodEntry.triggers || [],
          notes: moodEntry.notes || '',
          activities: moodEntry.activities || []
        }, userId)
      } catch (error) {
        console.error('Failed to save mood entry to Supabase:', error)
      }
    }

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
          <div className="flex h-screen md:h-[calc(100vh-0px)] overflow-hidden">
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

            <main className="relative flex min-w-0 flex-1 flex-col overflow-hidden" style={{ transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)' }}>
              {/* Mobile menu button */}
              <div className="md:hidden sticky top-0 z-30 flex items-center gap-2 border-b bg-background/95 backdrop-blur px-4 py-3">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="inline-flex items-center justify-center rounded-sm p-2 hover:bg-accent transition-colors"
                  aria-label="Open sidebar"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                <div className="flex-1 text-center text-sm font-medium">Sahayak</div>
              </div>
              <ChatPane
                key={selectedId || 'no-chat'}
                ref={composerRef}
                conversation={selected}
                onSend={(content, files) => selected && sendMessage(selected.id, content, files)}
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
