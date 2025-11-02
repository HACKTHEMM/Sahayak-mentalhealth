"use client"
import { motion, AnimatePresence } from "framer-motion"
import {
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  Clock,
  Moon,
  Sun,
} from "lucide-react"
import { UserButton } from "@clerk/nextjs"
import SidebarSection from "./SidebarSection"
import ConversationRow from "./ConversationRow"
import SearchModal from "./SearchModal"
import { cls } from "./utils"
import { useState, useEffect } from "react"

export default function Sidebar({
  open,
  onClose,
  theme,
  setTheme,
  collapsed,
  setCollapsed,
  conversations,
  recent,
  selectedId,
  onSelect,
  togglePin,
  query,
  setQuery,
  searchRef,
  createNewChat,
  sidebarCollapsed = false,
  setSidebarCollapsed = () => {},
  onShowProfileSetup,
  userProfile,
}) {
  const [showSearchModal, setShowSearchModal] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkIfMobile()
    window.addEventListener('resize', checkIfMobile)
    
    return () => window.removeEventListener('resize', checkIfMobile)
  }, [])

  if (sidebarCollapsed) {
    return (
      <motion.aside
        initial={{ width: 280 }}
        animate={{ width: 60 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="hidden md:flex z-50 h-full shrink-0 flex-col border-r glass-strong border-white/10 overflow-hidden backdrop-blur-xl"
      >
        <div className="flex items-center justify-center p-3">
          <button
            onClick={() => setSidebarCollapsed(false)}
            className="rounded-md p-2 hover:bg-white/10 transition-colors"
            aria-label="Open sidebar"
            title="Open sidebar"
          >
            <PanelLeftOpen className="h-4 w-4" />
          </button>
        </div>

        <div className="flex flex-col items-center justify-center gap-2 px-3">
          <button
            onClick={createNewChat}
            className="rounded-md p-2 hover:bg-white/10 transition-colors"
            title="New Chat"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-auto p-3 flex flex-col items-center justify-center gap-2">
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="rounded-md p-2 hover:bg-white/10 transition-colors"
            title="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <UserButton afterSignOutUrl="/" />
        </div>
      </motion.aside>
    )
  }

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed inset-0 z-40 bg-black/60 md:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {(open || !isMobile) && (
          <motion.aside
            key="sidebar"
            initial={{ x: -280 }}
            animate={{ x: (open || !isMobile) ? 0 : -280 }}
            exit={{ x: -280 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={cls(
              "z-50 flex h-full w-[280px] shrink-0 flex-col border-r glass-strong border-white/10 overflow-hidden backdrop-blur-xl",
              "fixed inset-y-0 left-0 md:static md:translate-x-0",
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <h1 className="text-2xl font-display font-semibold tracking-tight">Sahayak</h1>
              <button
                onClick={() => {
                  if (isMobile) {
                    onClose()
                  } else {
                    setSidebarCollapsed(true)
                  }
                }}
                className="rounded-md p-1.5 hover:bg-sidebar-accent transition-colors"
                aria-label="Close sidebar"
              >
                <PanelLeftClose className="h-4 w-4" />
              </button>
            </div>

            {/* New Chat Button */}
            <div className="p-3">
              <button
                onClick={createNewChat}
                className="flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 transition-all duration-300 hover:scale-[1.02]"
              >
                <Plus className="h-4 w-4" />
                New Chat
              </button>
            </div>

            {/* Conversations List */}
            <nav className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto px-2 pb-2">
              <SidebarSection
                icon={<Clock className="h-4 w-4" />}
                title="Recent"
                collapsed={collapsed.recent}
                onToggle={() => setCollapsed((s) => ({ ...s, recent: !s.recent }))}
              >
                {recent.length === 0 ? (
                  <div className="select-none rounded-md border border-dashed px-3 py-4 text-center text-xs text-muted-foreground">
                    No conversations yet
                  </div>
                ) : (
                  recent.map((c) => (
                    <ConversationRow
                      key={c.id}
                      data={c}
                      active={c.id === selectedId}
                      onSelect={() => onSelect(c.id)}
                      onTogglePin={() => togglePin(c.id)}
                      showMeta
                    />
                  ))
                )}
              </SidebarSection>
            </nav>

            {/* Footer with User Profile and Theme */}
            <div className="mt-auto border-t border-white/10 p-3 space-y-2">
              {/* Cultural Profile Button */}
              <button
                onClick={onShowProfileSetup}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/10 transition-all duration-200 text-left text-sm"
                title="Edit cultural profile"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="flex-1 truncate">
                  {userProfile && Object.keys(userProfile).length > 0 ? 'Edit Cultural Profile' : 'Setup Cultural Profile'}
                </span>
              </button>

              {/* User Account and Theme */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <UserButton
                    afterSignOutUrl="/"
                    appearance={{
                      elements: {
                        avatarBox: "h-8 w-8"
                      }
                    }}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">Account</div>
                  </div>
                </div>
                <button
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="rounded-xl p-2 hover:bg-white/10 transition-all duration-200"
                  title="Toggle theme"
                >
                  {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      <SearchModal
        isOpen={showSearchModal}
        onClose={() => setShowSearchModal(false)}
        conversations={conversations}
        selectedId={selectedId}
        onSelect={onSelect}
        togglePin={togglePin}
        createNewChat={createNewChat}
      />
    </>
  )
}
