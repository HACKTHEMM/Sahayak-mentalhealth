"use client"

import { useRef, useState, forwardRef, useImperativeHandle, useEffect } from "react"
import { Send, Loader2, Plus, Mic } from "lucide-react"
import ComposerActionsPopover from "./ComposerActionsPopover"
import { cls } from "./utils"

const Composer = forwardRef(function Composer({ onSend, busy }, ref) {
  const [value, setValue] = useState("")
  const [sending, setSending] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [lineCount, setLineCount] = useState(1)
  const inputRef = useRef(null)

  useEffect(() => {
    if (inputRef.current) {
      const textarea = inputRef.current
      const lineHeight = 20 // Approximate line height in pixels
      const minHeight = 40

      // Reset height to calculate scroll height
      textarea.style.height = "auto"
      const scrollHeight = textarea.scrollHeight
      const calculatedLines = Math.max(1, Math.floor((scrollHeight - 16) / lineHeight)) // 16px for padding

      setLineCount(calculatedLines)

      if (calculatedLines <= 12) {
        // Auto-expand for 1-12 lines
        textarea.style.height = `${Math.max(minHeight, scrollHeight)}px`
        textarea.style.overflowY = "hidden"
      } else {
        // Fixed height with scroll for 12+ lines
        textarea.style.height = `${minHeight + 11 * lineHeight}px` // 12 lines total
        textarea.style.overflowY = "auto"
      }
    }
  }, [value])

  useImperativeHandle(
    ref,
    () => ({
      insertTemplate: (templateContent) => {
        setValue((prev) => {
          const newValue = prev ? `${prev}\n\n${templateContent}` : templateContent
          setTimeout(() => {
            inputRef.current?.focus()
            const length = newValue.length
            inputRef.current?.setSelectionRange(length, length)
          }, 0)
          return newValue
        })
      },
      focus: () => {
        inputRef.current?.focus()
      },
    }),
    [],
  )

  async function handleSend() {
    if (!value.trim() || sending) return
    
    const messageToSend = value.trim()
    
    // Clear input immediately for better UX
    setValue("")
    
    setSending(true)
    try {
      await onSend?.(messageToSend)
      // Input is already cleared above
      inputRef.current?.focus()
    } catch (error) {
      // If sending fails, restore the message
      setValue(messageToSend)
      console.error('Failed to send message:', error)
    } finally {
      setSending(false)
    }
  }

  const hasContent = value.length > 0

  return (
    <div className="border-t border-white/20 dark:border-white/10 p-4">
      <div
        className={cls(
          "mx-auto flex flex-col rounded-2xl glass-strong shadow-glass transition-all duration-200",
          "max-w-3xl border-white/30 dark:border-white/20 p-3",
        )}
      >
        <div className="flex-1 relative">
          <textarea
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="How can I help you today?"
            rows={1}
            className={cls(
              "w-full resize-none bg-transparent text-sm outline-none placeholder:text-glass/50 text-glass transition-all duration-200",
              "px-0 py-2 min-h-[40px] text-left",
            )}
            style={{
              height: "auto",
              overflowY: lineCount > 12 ? "auto" : "hidden",
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
          />
        </div>

        <div className="flex items-center justify-between mt-2">
          <ComposerActionsPopover>
            <button
              className="inline-flex shrink-0 items-center justify-center rounded-full p-2 text-glass/70 glass-hover transition-colors"
              title="Add attachment"
            >
              <Plus className="h-4 w-4" />
            </button>
          </ComposerActionsPopover>

          <div className="flex items-center gap-1 shrink-0">
            <button
              className="inline-flex items-center justify-center rounded-full p-2 text-glass/70 glass-hover transition-colors"
              title="Voice input"
            >
              <Mic className="h-4 w-4" />
            </button>
            <button
              onClick={handleSend}
              disabled={sending || busy || !value.trim()}
              className={cls(
                "inline-flex shrink-0 items-center gap-2 rounded-full glass-strong px-3 py-2 text-sm font-medium text-glass shadow-glass transition hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50",
                (sending || busy || !value.trim()) && "opacity-50 cursor-not-allowed",
              )}
            >
              {sending || busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-2 max-w-3xl px-1 text-[11px] text-glass/60">
        Press{" "}
        <kbd className="rounded glass-subtle px-1">
          Enter
        </kbd>{" "}
        to send ·{" "}
        <kbd className="rounded glass-subtle px-1">
          Shift
        </kbd>
        +
        <kbd className="rounded glass-subtle px-1">
          Enter
        </kbd>{" "}
        for newline
      </div>
    </div>
  )
})

export default Composer
