"use client"

import { useRef, useState, forwardRef, useImperativeHandle, useEffect } from "react"
import { Send, Loader2, Plus, Mic, Image, FileText, X, Video, Volume2, MicOff } from "lucide-react"
import ComposerActionsPopover from "./ComposerActionsPopover"
import { useSpeechToText } from "../hooks/use-speech-to-text"
import { cls } from "./utils"

const Composer = forwardRef(function Composer({ onSend, busy }, ref) {
  const [value, setValue] = useState("")
  const [sending, setSending] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [lineCount, setLineCount] = useState(1)
  const [attachedFiles, setAttachedFiles] = useState([])
  const inputRef = useRef(null)
  const fileInputRef = useRef(null)
  
  // Speech-to-Text integration
  const {
    isRecording: isSttRecording,
    isProcessing: isSttProcessing,
    error: sttError,
    startRecording: startStt,
    stopRecording: stopStt
  } = useSpeechToText({
    onTranscript: (transcript) => {
      // Auto-write recognized text into input
      setValue(transcript)
      inputRef.current?.focus()
    },
    onAutoSend: async (transcript) => {
      // Auto-send after silence detected
      if (transcript.trim()) {
        await handleSend()
      }
    },
    silenceThreshold: 1500 // 1.5 seconds of silence
  })

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

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || [])
    const validFiles = files.filter(file => {
      // Gemini supports images, videos, audio, and PDFs
      const validTypes = ['image/', 'video/', 'audio/', 'application/pdf']
      return validTypes.some(type => file.type.startsWith(type))
    })

    const newFiles = validFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      type: file.type.split('/')[0]
    }))

    setAttachedFiles(prev => [...prev, ...newFiles])
  }

  const removeFile = (index) => {
    setAttachedFiles(prev => {
      const newFiles = [...prev]
      URL.revokeObjectURL(newFiles[index].preview)
      newFiles.splice(index, 1)
      return newFiles
    })
  }

  // Handle voice input toggle
  const handleVoiceInput = () => {
    if (isSttRecording) {
      stopStt() // Manual stop without auto-send
    } else {
      startStt()
    }
  }

  // Legacy recording for file attachment (kept for compatibility)
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      const chunks = []

      mediaRecorder.ondataavailable = (e) => chunks.push(e.data)
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' })
        const file = new File([blob], 'voice-message.webm', { type: 'audio/webm' })
        const preview = URL.createObjectURL(blob)
        setAttachedFiles(prev => [...prev, { file, preview, type: 'audio' }])
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorder.start()
    } catch (error) {
      console.error('Failed to start recording:', error)
    }
  }

  async function handleSend() {
    if ((!value.trim() && attachedFiles.length === 0) || sending || isSttProcessing) return

    const messageToSend = value.trim()
    const filesToSend = [...attachedFiles]

    // Clear input immediately for better UX
    setValue("")
    setAttachedFiles([])

    setSending(true)
    try {
      await onSend?.(messageToSend, filesToSend)
      // Input is already cleared above
      inputRef.current?.focus()
    } catch (error) {
      // If sending fails, restore the message
      setValue(messageToSend)
      setAttachedFiles(filesToSend)
      console.error('Failed to send message:', error)
    } finally {
      setSending(false)
    }
  }

  const hasContent = value.length > 0
  const isVoiceActive = isSttRecording || isSttProcessing

  return (
    <div className="relative">
      {/* Recording indicator */}
      {isVoiceActive && (
        <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-center p-2 bg-gradient-to-b from-red-500/10 to-transparent">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/20 backdrop-blur-sm border border-red-500/30">
            <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-sm font-medium text-red-600 dark:text-red-400">
              {isSttRecording ? "Listening..." : "Processing..."}
            </span>
          </div>
        </div>
      )}
      
      {/* STT Error Display */}
      {sttError && (
        <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-center p-2">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/20 backdrop-blur-sm border border-red-500/30">
            <span className="text-sm text-red-600 dark:text-red-400">{sttError}</span>
          </div>
        </div>
      )}
      
      {/* Seamless gradient overlay that blends with glass-bg */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          height: '280px',
          bottom: 0,
          background: `
            linear-gradient(to top,
              hsl(var(--background)) 0%,
              hsl(var(--background)) 5%,
              hsl(var(--background) / 0.98) 15%,
              hsl(var(--background) / 0.95) 25%,
              hsl(var(--background) / 0.88) 35%,
              hsl(var(--background) / 0.75) 45%,
              hsl(var(--background) / 0.6) 55%,
              hsl(var(--background) / 0.45) 65%,
              hsl(var(--background) / 0.3) 75%,
              hsl(var(--background) / 0.15) 85%,
              transparent 100%)
          `
        }}
      />

      <div className="relative p-4">
        <div
          className={cls(
            "mx-auto flex flex-col rounded-[24px] border bg-card/80 backdrop-blur-sm transition-all duration-200",
            "max-w-3xl p-3",
            "shadow-[0_4px_20px_rgb(0,0,0,0.08)] dark:shadow-[0_4px_20px_rgb(0,0,0,0.3)]",
            "hover:shadow-[0_6px_25px_rgb(0,0,0,0.1)] dark:hover:shadow-[0_6px_25px_rgb(0,0,0,0.4)]",
          )}
        >
        {/* File Attachments Preview */}
        {attachedFiles.length > 0 && (
          <div className="flex flex-wrap gap-2 p-3 border-b border-border/30 bg-black/[0.02] dark:bg-white/[0.02]">
            {attachedFiles.map((item, index) => (
              <div key={index} className="relative group">
                {item.type === 'image' && (
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-border/30">
                    <img src={item.preview} alt="attachment" className="w-full h-full object-cover" />
                    <button
                      onClick={() => removeFile(index)}
                      className="absolute top-1 right-1 p-0.5 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
                {item.type === 'video' && (
                  <div className="relative flex items-center gap-2 px-3 py-2 rounded-xl border border-border/30 bg-black/5 dark:bg-white/5">
                    <Video className="h-4 w-4 text-blue-500" />
                    <span className="text-xs max-w-[100px] truncate">{item.file.name}</span>
                    <button
                      onClick={() => removeFile(index)}
                      className="ml-2 p-0.5 rounded-full hover:bg-white/10 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
                {item.type === 'audio' && (
                  <div className="relative flex items-center gap-2 px-3 py-2 rounded-xl border border-border/30 bg-black/5 dark:bg-white/5">
                    <Volume2 className="h-4 w-4 text-green-500" />
                    <span className="text-xs max-w-[100px] truncate">{item.file.name}</span>
                    <button
                      onClick={() => removeFile(index)}
                      className="ml-2 p-0.5 rounded-full hover:bg-white/10 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
                {item.type === 'application' && (
                  <div className="relative flex items-center gap-2 px-3 py-2 rounded-xl border border-border/30 bg-black/5 dark:bg-white/5">
                    <FileText className="h-4 w-4 text-red-500" />
                    <span className="text-xs max-w-[100px] truncate">{item.file.name}</span>
                    <button
                      onClick={() => removeFile(index)}
                      className="ml-2 p-0.5 rounded-full hover:bg-white/10 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

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
              "w-full resize-none bg-transparent text-[15px] outline-none placeholder:opacity-50 transition-all duration-200",
              "px-2 py-2 min-h-[40px]",
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

        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center gap-1">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,video/*,audio/*,application/pdf"
              onChange={handleFileSelect}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex shrink-0 items-center justify-center rounded-full p-2 opacity-60 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5 transition-all relative"
              title="Attach files (images, videos, audio, PDF)"
            >
              <Image className="h-4 w-4" />
              {attachedFiles.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                  {attachedFiles.length}
                </span>
              )}
            </button>
            <button
              onClick={handleVoiceInput}
              disabled={isSttProcessing}
              className={cls(
                "inline-flex items-center justify-center rounded-full p-2 transition-all",
                isVoiceActive
                  ? "text-red-500 bg-red-500/10 opacity-100 scale-110"
                  : "opacity-60 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5",
                isSttProcessing && "cursor-not-allowed opacity-40"
              )}
              title={isSttRecording ? "Stop recording (or wait for auto-send)" : "Start voice input"}
            >
              {isSttRecording ? (
                <MicOff className="h-4 w-4 animate-pulse" />
              ) : (
                <Mic className="h-4 w-4" />
              )}
            </button>
          </div>

          <button
            onClick={handleSend}
            disabled={sending || busy || isSttProcessing || (!value.trim() && attachedFiles.length === 0)}
            className={cls(
              "inline-flex shrink-0 items-center gap-2 rounded-full bg-primary text-primary-foreground px-4 py-2 text-sm font-medium shadow-sm transition-all hover:opacity-90",
              (sending || busy || isSttProcessing || (!value.trim() && attachedFiles.length === 0)) && "opacity-50 cursor-not-allowed",
            )}
          >
            {sending || busy || isSttProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </button>
          </div>
        </div>
      </div>
    </div>
  )
})

export default Composer
