"use client"

import { cls } from "./utils"
import { Paperclip, Image, FileText, Mic, Video, Volume2, VolumeX, Loader2 } from "lucide-react"
import { useTextToSpeech } from "../hooks/use-text-to-speech"
import { useEffect, useState } from "react"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default function Message({ role, children, attachments, content, enableTTS = true }) {
  const isUser = role === "user"
  const [hasPlayed, setHasPlayed] = useState(false)
  
  // TTS hook - only for assistant messages
  const { speak, stop, isPlaying, isLoading, toggle } = useTextToSpeech({ 
    autoPlay: false // We'll manually trigger based on message appearance
  })

  // Extract plain text from markdown content for TTS
  const getPlainText = (markdownText) => {
    if (!markdownText) return ''
    // Simple markdown stripper (you could use a library for better results)
    return markdownText
      .replace(/[#*`_~\[\]()]/g, '') // Remove markdown symbols
      .replace(/!\[.*?\]\(.*?\)/g, '') // Remove images
      .replace(/\[.*?\]\(.*?\)/g, '') // Remove links
      .trim()
  }

  // Auto-play TTS when assistant message appears
  useEffect(() => {
    if (!isUser && enableTTS && content && !hasPlayed) {
      const plainText = getPlainText(content)
      if (plainText.trim()) {
        // Small delay to make it feel natural
        const timer = setTimeout(() => {
          speak(plainText)
          setHasPlayed(true)
        }, 500)
        return () => clearTimeout(timer)
      }
    }
  }, [content, isUser, enableTTS, hasPlayed, speak])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (!isUser) {
        stop()
      }
    }
  }, [isUser, stop])

  const getAttachmentIcon = (type) => {
    if (type === 'image') return <Image className="h-3 w-3" />
    if (type === 'video') return <Video className="h-3 w-3" />
    if (type === 'audio') return <Mic className="h-3 w-3" />
    if (type === 'application') return <FileText className="h-3 w-3" />
    return <Paperclip className="h-3 w-3" />
  }

  return (
    <div className={cls("flex gap-3 mb-5", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 text-[11px] font-bold shrink-0 border border-white/10">
          AI
        </div>
      )}
      <div
        className={cls(
          "max-w-[70%] rounded-[20px] px-4 py-3 text-[15px] leading-relaxed relative group",
          isUser
            ? "!bg-[#333333] dark:!bg-[#262626] !text-white shadow-md"
            : "bg-card/80 backdrop-blur-sm text-foreground border border-border/50 shadow-sm",
        )}
      >
        {/* TTS Control Button - only for assistant messages */}
        {!isUser && enableTTS && content && (
          <button
            onClick={toggle}
            disabled={isLoading}
            className={cls(
              "absolute top-2 right-2 p-1.5 rounded-full transition-all",
              "opacity-0 group-hover:opacity-100",
              "hover:bg-black/5 dark:hover:bg-white/5",
              isPlaying && "opacity-100 bg-blue-500/10 text-blue-500",
              isLoading && "opacity-50 cursor-not-allowed"
            )}
            title={isPlaying ? "Stop speaking" : "Read aloud"}
          >
            {isLoading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : isPlaying ? (
              <VolumeX className="h-3.5 w-3.5" />
            ) : (
              <Volume2 className="h-3.5 w-3.5" />
            )}
          </button>
        )}
        
        {/* Attachment indicators */}
        {attachments && attachments.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-2 pb-2 border-b border-white/10">
            {attachments.map((att, idx) => (
              <div
                key={idx}
                className={cls(
                  "inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs",
                  isUser
                    ? "bg-white/10 text-white"
                    : "bg-black/5 dark:bg-white/5"
                )}
                title={att.name}
              >
                {getAttachmentIcon(att.type)}
                <span className="max-w-[100px] truncate">{att.name}</span>
              </div>
            ))}
          </div>
        )}
        {/* Render markdown if content prop is provided, otherwise render children */}
        {content ? (
          <div className={cls(
            "prose prose-sm max-w-none",
            isUser
              ? "prose-invert prose-headings:text-white prose-p:text-white prose-li:text-white prose-strong:text-white prose-code:text-white prose-pre:bg-white/10"
              : "prose-headings:text-foreground prose-p:text-foreground prose-li:text-foreground prose-a:text-blue-500 dark:prose-a:text-blue-400"
          )}>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                // Customize code blocks
                code: ({node, inline, className, children, ...props}) => {
                  return inline ? (
                    <code className={cls("px-1 py-0.5 rounded bg-black/10 dark:bg-white/10", isUser && "!text-white")} {...props}>
                      {children}
                    </code>
                  ) : (
                    <code className={cls("block p-2 rounded bg-black/10 dark:bg-white/10 overflow-x-auto", isUser && "!text-white")} {...props}>
                      {children}
                    </code>
                  )
                },
                // Customize links
                a: ({node, children, ...props}) => (
                  <a {...props} className="underline hover:no-underline" target="_blank" rel="noopener noreferrer">
                    {children}
                  </a>
                ),
                // Customize lists
                ul: ({node, children, ...props}) => (
                  <ul className="list-disc list-inside space-y-1" {...props}>{children}</ul>
                ),
                ol: ({node, children, ...props}) => (
                  <ol className="list-decimal list-inside space-y-1" {...props}>{children}</ol>
                ),
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        ) : (
          children
        )}
      </div>
      {isUser && (
        <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full !bg-[#333333] dark:!bg-[#262626] !text-white text-[11px] font-bold shrink-0 shadow-md">
          ME
        </div>
      )}
    </div>
  )
}
