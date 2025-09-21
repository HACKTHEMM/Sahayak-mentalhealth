"use client"
import { motion, AnimatePresence } from "framer-motion"
import {
  PanelLeftClose,
  PanelLeftOpen,
  SearchIcon,
  Plus,
  Clock,
  Asterisk,
} from "lucide-react"
import SidebarSection from "./SidebarSection"
import ConversationRow from "./ConversationRow"
import ThemeToggle from "./ThemeToggle"
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
        initial={{ width: 320 }}
        animate={{ width: 64 }}
        transition={{ type: "spring", stiffness: 260, damping: 28 }}
        className="hidden md:flex z-50 h-full shrink-0 flex-col border-r border-zinc-200/60 bg-white dark:border-zinc-800 dark:bg-zinc-900 overflow-hidden"
      >
        <div className="flex items-center justify-center border-b border-zinc-200/60 px-3 py-3 dark:border-zinc-800">
          <button
            onClick={() => setSidebarCollapsed(false)}
            className="rounded-xl p-2 hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:hover:bg-zinc-800"
            aria-label="Open sidebar"
            title="Open sidebar"
          >
            <PanelLeftOpen className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-col items-center gap-4 pt-4">
          <button
            onClick={createNewChat}
            className="rounded-xl p-2 hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:hover:bg-zinc-800"
            title="New Chat"
          >
            <Plus className="h-5 w-5" />
          </button>

          <button
            onClick={() => setShowSearchModal(true)}
            className="rounded-xl p-2 hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:hover:bg-zinc-800"
            title="Search"
          >
            <SearchIcon className="h-5 w-5" />
          </button>
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
            className="fixed inset-0 z-40 bg-black/60 md:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {(open || !isMobile) && (
          <motion.aside
            key="sidebar"
            initial={{ x: -340 }}
            animate={{ x: (open || !isMobile) ? 0 : -340 }}
            exit={{ x: -340 }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
            className={cls(
              "z-50 flex h-full w-80 shrink-0 flex-col border-r border-zinc-200/60 bg-white dark:border-zinc-800 dark:bg-zinc-900 overflow-hidden",
              "fixed inset-y-0 left-0 md:static md:translate-x-0",
            )}
          >
            <div className="flex items-center gap-2 border-b border-zinc-200/60 px-3 py-3 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <div className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-sm dark:from-zinc-200 dark:to-zinc-300 dark:text-zinc-900">
                  <Asterisk className="h-4 w-4" />
                </div>
                <div className="text-sm font-semibold tracking-tight">Sahayak AI</div>
              </div>
              <div className="ml-auto flex items-center gap-1">
                <button
                  onClick={() => {
                    if (isMobile) {
                      onClose()
                    } else {
                      setSidebarCollapsed(true)
                    }
                  }}
                  className="rounded-xl p-2 hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:hover:bg-zinc-800"
                  aria-label="Close sidebar"
                  title="Close sidebar"
                >
                  <PanelLeftClose className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="px-3 pt-3">
              <label htmlFor="search" className="sr-only">
                Search conversations
              </label>
              <div className="relative">
                <SearchIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                <input
                  id="search"
                  ref={searchRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search…"
                  onClick={() => setShowSearchModal(true)}
                  onFocus={() => setShowSearchModal(true)}
                  className="w-full rounded-full border border-zinc-200 bg-white py-2 pl-9 pr-3 text-sm outline-none ring-0 placeholder:text-zinc-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-zinc-800 dark:bg-zinc-950/50 max-w-full"
                />
              </div>
            </div>

            <div className="px-3 pt-3">
              <button
                onClick={createNewChat}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:bg-white dark:text-zinc-900 min-w-0 overflow-hidden"
                title="New Chat (⌘N)"
              >
                <Plus className="h-4 w-4" /> Start New Chat
              </button>
            </div>

            <nav className="mt-4 flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-zinc-300 dark:scrollbar-thumb-zinc-700 px-2 pb-4">
              <SidebarSection
                icon={<Clock className="h-4 w-4" />}
                title="RECENT"
                collapsed={collapsed.recent}
                onToggle={() => setCollapsed((s) => ({ ...s, recent: !s.recent }))}
              >
                {recent.length === 0 ? (
                  <div className="select-none rounded-lg border border-dashed border-zinc-200 px-3 py-3 text-center text-xs text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
                    No conversations yet. Start a new one!
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

            <div className="mt-auto border-t border-zinc-200/60 px-3 py-3 dark:border-zinc-800">
              <div className="flex items-center justify-end">
                <ThemeToggle theme={theme} setTheme={setTheme} />
              </div>
              <div className="mt-2 flex items-center gap-2 rounded-xl bg-zinc-50 p-2 dark:bg-zinc-800/60 min-w-0 overflow-hidden">
                <div className="grid h-8 w-8 place-items-center rounded-full bg-zinc-900 text-xs font-bold text-white dark:bg-white dark:text-zinc-900">
                  JD
                </div>
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium">Vansh</div>
                  <div className="truncate text-xs text-zinc-500 dark:text-zinc-400">Pro workspace</div>
                </div>
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
