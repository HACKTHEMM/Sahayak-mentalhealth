/**
 * Voice Features Test Utility
 * Quick CLI-style tests for STT/TTS APIs
 * Run in browser console or import in test files
 */

// Test STT API
export async function testSTT(audioBlob) {
  console.log('🎤 Testing STT API...')
  
  const formData = new FormData()
  formData.append('audio', audioBlob, 'test.webm')
  
  try {
    const response = await fetch('/api/stt', {
      method: 'POST',
      body: formData
    })
    
    const data = await response.json()
    
    if (data.success) {
      console.log('✅ STT Success:', data.transcript)
      return data.transcript
    } else {
      console.error('❌ STT Error:', data.error)
      return null
    }
  } catch (error) {
    console.error('❌ STT Failed:', error)
    return null
  }
}

// Test TTS API
export async function testTTS(text = 'Hello, this is a test message.') {
  console.log('🔊 Testing TTS API...')
  
  try {
    const response = await fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    })
    
    const data = await response.json()
    
    if (data.success) {
      console.log('✅ TTS Success:', data)
      
      // If using browser TTS, test it
      if (data.useBrowserTTS && window.speechSynthesis) {
        const utterance = new SpeechSynthesisUtterance(text)
        utterance.lang = 'en-IN'
        utterance.rate = 0.95
        
        utterance.onend = () => console.log('✅ TTS Playback Complete')
        utterance.onerror = (e) => console.error('❌ TTS Playback Error:', e)
        
        window.speechSynthesis.speak(utterance)
        console.log('🔊 Playing audio...')
      }
      
      return data
    } else {
      console.error('❌ TTS Error:', data.error)
      return null
    }
  } catch (error) {
    console.error('❌ TTS Failed:', error)
    return null
  }
}

// Record audio for testing
export async function recordTestAudio(duration = 3000) {
  console.log('🎙️ Recording test audio for', duration / 1000, 'seconds...')
  
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    const mediaRecorder = new MediaRecorder(stream)
    const chunks = []
    
    mediaRecorder.ondataavailable = (e) => chunks.push(e.data)
    
    return new Promise((resolve, reject) => {
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' })
        stream.getTracks().forEach(track => track.stop())
        console.log('✅ Recording complete:', blob.size, 'bytes')
        resolve(blob)
      }
      
      mediaRecorder.onerror = (e) => {
        console.error('❌ Recording failed:', e)
        reject(e)
      }
      
      mediaRecorder.start()
      
      setTimeout(() => {
        mediaRecorder.stop()
      }, duration)
    })
  } catch (error) {
    console.error('❌ Failed to access microphone:', error)
    throw error
  }
}

// Complete STT test flow
export async function runSTTTest(duration = 3000) {
  console.log('\n🧪 === STT Test Started ===')
  console.log('📝 Speak now for', duration / 1000, 'seconds...\n')
  
  try {
    const audioBlob = await recordTestAudio(duration)
    const transcript = await testSTT(audioBlob)
    
    console.log('\n✅ === STT Test Complete ===')
    console.log('Transcript:', transcript)
    
    return transcript
  } catch (error) {
    console.error('\n❌ === STT Test Failed ===')
    console.error(error)
    return null
  }
}

// Complete TTS test flow
export async function runTTSTest(text) {
  console.log('\n🧪 === TTS Test Started ===')
  
  const testText = text || 'Hello! I am Sahayak, your mental wellness companion. How are you feeling today?'
  
  console.log('📝 Text to speak:', testText, '\n')
  
  try {
    await testTTS(testText)
    
    console.log('\n✅ === TTS Test Complete ===')
  } catch (error) {
    console.error('\n❌ === TTS Test Failed ===')
    console.error(error)
  }
}

// Run all tests
export async function runAllTests() {
  console.log('🚀 === Running All Voice Feature Tests ===\n')
  
  // Test TTS first (no permissions needed)
  await runTTSTest()
  
  // Wait a bit
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  // Test STT (needs microphone)
  await runSTTTest(3000)
  
  console.log('\n✅ === All Tests Complete ===')
}

// Browser console helpers
if (typeof window !== 'undefined') {
  window.voiceTests = {
    testSTT,
    testTTS,
    recordTestAudio,
    runSTTTest,
    runTTSTest,
    runAllTests
  }
  
  console.log(`
%c🎤 Voice Tests Available! 

Quick Start:
  voiceTests.runAllTests()          - Run all tests
  voiceTests.runSTTTest()            - Test speech-to-text
  voiceTests.runTTSTest()            - Test text-to-speech
  voiceTests.recordTestAudio(3000)   - Record 3 seconds of audio

Example:
  voiceTests.runSTTTest(5000)        - Record 5 seconds and transcribe
  voiceTests.runTTSTest('Hello!')    - Speak custom text

`, 'color: #10b981; font-weight: bold; font-size: 14px')
}

// Export for use in components/tests
export default {
  testSTT,
  testTTS,
  recordTestAudio,
  runSTTTest,
  runTTSTest,
  runAllTests
}
