"use client"

/**
 * STT/TTS Demo Component
 * Standalone test component to verify voice features work correctly
 * Usage: Import and render in any page to test
 */

import { useState } from "react"
import { useSpeechToText } from "../hooks/use-speech-to-text"
import { useTextToSpeech } from "../hooks/use-text-to-speech"
import { Mic, MicOff, Volume2, VolumeX, Loader2 } from "lucide-react"

export default function VoiceDemo() {
  const [transcript, setTranscript] = useState("")
  const [testMessage, setTestMessage] = useState("Hello! I'm Sahayak, your mental wellness companion. How are you feeling today?")

  // STT Hook
  const {
    isRecording,
    isProcessing: sttProcessing,
    error: sttError,
    startRecording,
    stopRecording
  } = useSpeechToText({
    onTranscript: (text) => {
      setTranscript(text)
      console.log("Transcript received:", text)
    },
    onAutoSend: (text) => {
      console.log("Auto-send triggered with:", text)
      alert(`Auto-send: "${text}"`)
    },
    silenceThreshold: 1500
  })

  // TTS Hook
  const {
    speak,
    stop,
    toggle,
    isPlaying,
    isLoading: ttsLoading,
    error: ttsError,
    isSupported
  } = useTextToSpeech({ autoPlay: false })

  const handleVoiceInput = () => {
    if (isRecording) {
      stopRecording(false)
    } else {
      startRecording()
    }
  }

  const handleSpeak = () => {
    speak(testMessage)
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Voice Features Demo</h1>
        <p className="text-muted-foreground">Test STT and TTS independently</p>
      </div>

      {/* STT Demo */}
      <div className="border rounded-lg p-6 space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Mic className="h-5 w-5" />
          Speech-to-Text (STT)
        </h2>
        
        <div className="space-y-3">
          <button
            onClick={handleVoiceInput}
            disabled={sttProcessing}
            className={`
              w-full py-4 px-6 rounded-lg font-medium transition-all flex items-center justify-center gap-3
              ${isRecording 
                ? 'bg-red-500 text-white hover:bg-red-600' 
                : 'bg-blue-500 text-white hover:bg-blue-600'}
              ${sttProcessing && 'opacity-50 cursor-not-allowed'}
            `}
          >
            {sttProcessing ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Processing...
              </>
            ) : isRecording ? (
              <>
                <MicOff className="h-5 w-5 animate-pulse" />
                Stop Recording (or wait for auto-send)
              </>
            ) : (
              <>
                <Mic className="h-5 w-5" />
                Start Voice Input
              </>
            )}
          </button>

          {isRecording && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
              <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-sm font-medium">Listening... (auto-sends after 1.5s silence)</span>
              </div>
            </div>
          )}

          {sttError && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
              <p className="text-sm text-red-600 dark:text-red-400">Error: {sttError}</p>
            </div>
          )}

          {transcript && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-1">Transcript:</p>
              <p className="text-base font-medium">{transcript}</p>
            </div>
          )}

          <div className="text-xs text-muted-foreground space-y-1">
            <p>✅ Click to start recording</p>
            <p>✅ Speak naturally</p>
            <p>✅ Wait 1.5 seconds of silence for auto-send</p>
            <p>✅ Or click again to stop manually</p>
          </div>
        </div>
      </div>

      {/* TTS Demo */}
      <div className="border rounded-lg p-6 space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Volume2 className="h-5 w-5" />
          Text-to-Speech (TTS)
        </h2>

        <div className="space-y-3">
          <textarea
            value={testMessage}
            onChange={(e) => setTestMessage(e.target.value)}
            className="w-full p-3 border rounded-lg min-h-[100px] bg-background"
            placeholder="Enter text to speak..."
          />

          <div className="flex gap-2">
            <button
              onClick={handleSpeak}
              disabled={ttsLoading || !testMessage.trim() || !isSupported}
              className={`
                flex-1 py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2
                ${isPlaying 
                  ? 'bg-blue-500 text-white hover:bg-blue-600' 
                  : 'bg-green-500 text-white hover:bg-green-600'}
                ${(ttsLoading || !testMessage.trim() || !isSupported) && 'opacity-50 cursor-not-allowed'}
              `}
            >
              {ttsLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Loading...
                </>
              ) : isPlaying ? (
                <>
                  <VolumeX className="h-5 w-5" />
                  Speaking...
                </>
              ) : (
                <>
                  <Volume2 className="h-5 w-5" />
                  Speak Text
                </>
              )}
            </button>

            {isPlaying && (
              <button
                onClick={stop}
                className="px-6 py-3 rounded-lg font-medium bg-red-500 text-white hover:bg-red-600 transition-all"
              >
                Stop
              </button>
            )}
          </div>

          {!isSupported && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
              <p className="text-sm text-yellow-600 dark:text-yellow-400">
                ⚠️ Speech synthesis not supported in this browser
              </p>
            </div>
          )}

          {ttsError && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
              <p className="text-sm text-red-600 dark:text-red-400">Error: {ttsError}</p>
            </div>
          )}

          <div className="text-xs text-muted-foreground space-y-1">
            <p>✅ Edit the text above</p>
            <p>✅ Click "Speak Text" to hear it</p>
            <p>✅ Click "Stop" to interrupt playback</p>
            <p>✅ Uses browser's native voice (Indian English preferred)</p>
          </div>
        </div>
      </div>

      {/* Integration Status */}
      <div className="border rounded-lg p-6 space-y-3">
        <h2 className="text-xl font-semibold">Integration Status</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">STT Status:</p>
            <p className="font-medium">{isRecording ? '🔴 Recording' : sttProcessing ? '⏳ Processing' : '✅ Ready'}</p>
          </div>
          <div>
            <p className="text-muted-foreground">TTS Status:</p>
            <p className="font-medium">{isPlaying ? '🔊 Playing' : ttsLoading ? '⏳ Loading' : '✅ Ready'}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Browser Support:</p>
            <p className="font-medium">{isSupported ? '✅ Supported' : '❌ Not Supported'}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Auto-send:</p>
            <p className="font-medium">✅ 1.5s silence</p>
          </div>
        </div>
      </div>

      <div className="text-center text-xs text-muted-foreground">
        <p>This demo uses the same hooks as your main chat UI.</p>
        <p>Test here, then use in production with confidence! 🚀</p>
      </div>
    </div>
  )
}
