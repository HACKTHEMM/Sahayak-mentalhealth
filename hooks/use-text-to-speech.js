"use client"

import { useState, useRef, useCallback, useEffect } from "react"

/**
 * Text-to-Speech Hook
 * Converts text to speech using browser's SpeechSynthesis API
 * Features:
 * - Auto-play assistant messages
 * - Voice selection (prefer Indian English)
 * - Playback controls (play, pause, stop)
 * - Clean, natural voice
 */
export function useTextToSpeech({ autoPlay = true, language = 'en-IN' } = {}) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [voices, setVoices] = useState([])
  
  const utteranceRef = useRef(null)
  const currentTextRef = useRef(null)

  // Load available voices
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices()
      setVoices(availableVoices)
    }

    loadVoices()
    
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices
    }
  }, [])

  // Get preferred voice
  const getPreferredVoice = useCallback(() => {
    if (voices.length === 0) return null

    // Try to find Indian English voice
    let voice = voices.find(v => v.lang === 'en-IN')
    
    // Fallback to any English voice
    if (!voice) {
      voice = voices.find(v => v.lang.startsWith('en-'))
    }
    
    // Fallback to first available voice
    return voice || voices[0]
  }, [voices])

  // Cleanup
  const cleanup = useCallback(() => {
    if (utteranceRef.current) {
      window.speechSynthesis.cancel()
      utteranceRef.current = null
    }
  }, [])

  // Speak text
  const speak = useCallback((text) => {
    if (!text?.trim()) return
    
    // Check if browser supports speech synthesis
    if (!window.speechSynthesis) {
      setError('Speech synthesis not supported in this browser')
      return
    }

    try {
      setError(null)
      cleanup()

      currentTextRef.current = text

      const utterance = new SpeechSynthesisUtterance(text)
      utteranceRef.current = utterance

      // Configure voice
      const preferredVoice = getPreferredVoice()
      if (preferredVoice) {
        utterance.voice = preferredVoice
      }
      
      utterance.lang = language
      utterance.rate = 0.95 // Slightly slower for clarity
      utterance.pitch = 1.0
      utterance.volume = 1.0

      utterance.onstart = () => {
        setIsPlaying(true)
        setIsLoading(false)
      }

      utterance.onend = () => {
        setIsPlaying(false)
        utteranceRef.current = null
      }

      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event)
        setError('Failed to play speech')
        setIsPlaying(false)
        utteranceRef.current = null
      }

      utterance.onpause = () => {
        setIsPlaying(false)
      }

      utterance.onresume = () => {
        setIsPlaying(true)
      }

      // Always speak when called, autoPlay parameter is now ignored here
      // The component calling this will control when to call speak()
      setIsLoading(true)
      window.speechSynthesis.speak(utterance)

    } catch (err) {
      console.error('Failed to speak:', err)
      setError(err.message || 'Failed to generate speech')
      setIsLoading(false)
    }
  }, [language, cleanup, getPreferredVoice])

  // Play/Resume
  const play = useCallback(() => {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume()
    } else if (utteranceRef.current && !isPlaying) {
      window.speechSynthesis.speak(utteranceRef.current)
    }
  }, [isPlaying])

  // Pause
  const pause = useCallback(() => {
    if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
      window.speechSynthesis.pause()
    }
  }, [])

  // Stop and cleanup
  const stop = useCallback(() => {
    cleanup()
    setIsPlaying(false)
  }, [cleanup])

  // Toggle play/pause
  const toggle = useCallback(() => {
    if (isPlaying) {
      stop()
    } else {
      // If we have current text and no active utterance, speak it
      if (currentTextRef.current && !utteranceRef.current) {
        speak(currentTextRef.current)
      } else {
        play()
      }
    }
  }, [isPlaying, play, stop, speak])

  // Cleanup on unmount
  useEffect(() => {
    return cleanup
  }, [cleanup])

  return {
    speak,
    play,
    pause,
    stop,
    toggle,
    isPlaying,
    isLoading,
    error,
    currentText: currentTextRef.current,
    voices,
    isSupported: typeof window !== 'undefined' && 'speechSynthesis' in window
  }
}
