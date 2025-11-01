"use client"

import { useState, useRef, useCallback, useEffect } from "react"

/**
 * Speech-to-Text Hook
 * Records audio, sends to STT API, returns transcript
 * Features:
 * - Silence detection with auto-send after 1.5s
 * - Real-time recording state
 * - Auto-cleanup on unmount
 */
export function useSpeechToText({ 
  onTranscript, 
  onAutoSend, 
  silenceThreshold = 1500 
}) {
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState(null)
  
  const mediaRecorderRef = useRef(null)
  const audioChunksRef = useRef([])
  const streamRef = useRef(null)
  const silenceTimerRef = useRef(null)
  const audioContextRef = useRef(null)
  const analyserRef = useRef(null)
  const silenceDetectionRef = useRef(null)
  const autoSendFlagRef = useRef(false)

  // Cleanup function
  const cleanup = useCallback(() => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current)
      silenceTimerRef.current = null
    }
    if (silenceDetectionRef.current) {
      cancelAnimationFrame(silenceDetectionRef.current)
      silenceDetectionRef.current = null
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    if (audioContextRef.current?.state !== 'closed') {
      audioContextRef.current?.close()
      audioContextRef.current = null
    }
    audioChunksRef.current = []
  }, [])

  // Detect silence and auto-pause/send
  const detectSilence = useCallback(() => {
    if (!analyserRef.current) return
    if (!mediaRecorderRef.current || mediaRecorderRef.current.state !== 'recording') return

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount)
    analyserRef.current.getByteFrequencyData(dataArray)

    // Calculate average volume
    const average = dataArray.reduce((a, b) => a + b) / dataArray.length
    
    // Silence threshold (adjust as needed)
    const SILENCE_LEVEL = 10

    if (average < SILENCE_LEVEL) {
      // Start silence timer if not already started
      if (!silenceTimerRef.current) {
        console.log('Silence detected, starting timer...')
        silenceTimerRef.current = setTimeout(() => {
          console.log('Silence threshold reached, auto-pausing and sending...')
          if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            autoSendFlagRef.current = true
            mediaRecorderRef.current.stop()
            setIsRecording(false)
          }
        }, silenceThreshold)
      }
    } else {
      // Reset silence timer if sound detected
      if (silenceTimerRef.current) {
        console.log('Sound detected, resetting silence timer')
        clearTimeout(silenceTimerRef.current)
        silenceTimerRef.current = null
      }
    }

    // Continue detection loop
    silenceDetectionRef.current = requestAnimationFrame(detectSilence)
  }, [silenceThreshold])

  // Start recording
  const startRecording = useCallback(async () => {
    try {
      setError(null)
      cleanup()
      autoSendFlagRef.current = false

      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 16000
        } 
      })
      
      streamRef.current = stream

      // Setup audio context for silence detection
      const audioContext = new (window.AudioContext || window.webkitAudioContext)()
      const analyser = audioContext.createAnalyser()
      const source = audioContext.createMediaStreamSource(stream)
      
      analyser.fftSize = 2048
      source.connect(analyser)
      
      audioContextRef.current = audioContext
      analyserRef.current = analyser

      // Setup MediaRecorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm') 
          ? 'audio/webm' 
          : 'audio/mp4'
      })

      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = async () => {
        // Stop silence detection
        if (silenceDetectionRef.current) {
          cancelAnimationFrame(silenceDetectionRef.current)
          silenceDetectionRef.current = null
        }
        
        const audioBlob = new Blob(audioChunksRef.current, { 
          type: mediaRecorder.mimeType 
        })
        
        if (audioBlob.size > 0) {
          await processAudio(audioBlob)
        }
        
        cleanup()
      }

      mediaRecorder.start(100) // Collect data every 100ms
      setIsRecording(true)

      // Start silence detection
      detectSilence()
    } catch (err) {
      console.error('Failed to start recording:', err)
      setError(err.message || 'Failed to access microphone')
      cleanup()
    }
  }, [cleanup, detectSilence])

  // Stop recording (manual stop, not auto-send)
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      autoSendFlagRef.current = false // Manual stop, don't auto-send
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }, [])

  // Process recorded audio
  const processAudio = useCallback(async (audioBlob) => {
    setIsProcessing(true)
    try {
      const formData = new FormData()
      formData.append('audio', audioBlob, 'recording.webm')

      const response = await fetch('/api/stt', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error('Failed to transcribe audio')
      }

      const data = await response.json()
      const transcript = data.transcript || ''

      if (transcript.trim()) {
        // Always call onTranscript to write text to input
        onTranscript?.(transcript)
        
        // Auto-send if triggered by silence detection
        if (autoSendFlagRef.current) {
          console.log('Auto-sending message after silence detection')
          setTimeout(() => {
            onAutoSend?.(transcript)
          }, 100)
        }
      }
    } catch (err) {
      console.error('Failed to process audio:', err)
      setError(err.message || 'Failed to transcribe audio')
    } finally {
      setIsProcessing(false)
      autoSendFlagRef.current = false
    }
  }, [onTranscript, onAutoSend])

  // Cleanup on unmount
  useEffect(() => {
    return cleanup
  }, [cleanup])

  return {
    isRecording,
    isProcessing,
    error,
    startRecording,
    stopRecording
  }
}
