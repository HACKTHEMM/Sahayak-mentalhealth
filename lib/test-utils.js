/**
 * LocalStorage Test Utilities for Sahayak AI
 * 
 * Use these functions in the browser console to test localStorage functionality:
 * 
 * 1. clearAllData() - Clear all localStorage data and reload page
 * 2. testSaveLoad() - Test saving and loading conversations
 * 3. mockConversation() - Create a mock conversation for testing
 * 4. viewStoredData() - View all stored data in localStorage
 */

// Clear all data and reload
function clearAllData() {
  localStorage.clear()
  console.log('All localStorage data cleared')
  window.location.reload()
}

// Test saving and loading conversations
function testSaveLoad() {
  const testConversations = [
    {
      id: 'test-1',
      title: 'Test Chat 1',
      updatedAt: new Date().toISOString(),
      messageCount: 3,
      preview: 'This is a test conversation',
      pinned: false,
      folder: 'Personal',
      messages: [
        { id: 'msg-1', role: 'user', content: 'Hello', createdAt: new Date().toISOString() },
        { id: 'msg-2', role: 'assistant', content: 'Hi there! How can I help you today?', createdAt: new Date().toISOString() }
      ]
    }
  ]
  
  localStorage.setItem('conversations', JSON.stringify(testConversations))
  localStorage.setItem('selectedConversationId', 'test-1')
  
  const loaded = JSON.parse(localStorage.getItem('conversations'))
  const selectedId = localStorage.getItem('selectedConversationId')
  
  console.log('Saved conversations:', testConversations)
  console.log('Loaded conversations:', loaded)
  console.log('Selected ID:', selectedId)
  console.log('Test successful:', JSON.stringify(loaded) === JSON.stringify(testConversations))
  
  return { saved: testConversations, loaded, selectedId }
}

// Create a mock conversation
function mockConversation() {
  const mockConv = {
    id: `mock-${Date.now()}`,
    title: 'Mock Conversation',
    updatedAt: new Date().toISOString(),
    messageCount: 2,
    preview: 'This is a mock conversation for testing',
    pinned: false,
    folder: 'Personal',
    messages: [
      { 
        id: 'mock-msg-1', 
        role: 'user', 
        content: 'I need help with stress management', 
        createdAt: new Date().toISOString() 
      },
      { 
        id: 'mock-msg-2', 
        role: 'assistant', 
        content: 'I understand you\'re dealing with stress. That\'s completely normal, especially with everything you might be juggling. Can you tell me more about what\'s been stressing you out lately?', 
        createdAt: new Date().toISOString(),
        mentalWellnessData: {
          crisisLevel: 'LOW',
          followUpNeeded: false,
          culturallyAdapted: true
        }
      }
    ],
    mentalWellnessData: {
      crisisLevel: 'LOW',
      moodEntries: [],
      culturalContext: {},
      sessionId: `session_mock_${Date.now()}`
    }
  }
  
  const existing = JSON.parse(localStorage.getItem('conversations') || '[]')
  existing.push(mockConv)
  localStorage.setItem('conversations', JSON.stringify(existing))
  localStorage.setItem('selectedConversationId', mockConv.id)
  
  console.log('Mock conversation created:', mockConv)
  window.location.reload()
  
  return mockConv
}

// View all stored data
function viewStoredData() {
  console.log('=== SAHAYAK AI LOCALSTORAGE DATA ===')
  
  const conversations = localStorage.getItem('conversations')
  const selectedId = localStorage.getItem('selectedConversationId')
  const userProfile = localStorage.getItem('user-cultural-profile')
  const folders = localStorage.getItem('folders')
  const templates = localStorage.getItem('templates')
  const theme = localStorage.getItem('theme')
  
  console.log('Conversations:', conversations ? JSON.parse(conversations) : 'None')
  console.log('Selected ID:', selectedId)
  console.log('User Profile:', userProfile ? JSON.parse(userProfile) : 'None')
  console.log('Folders:', folders ? JSON.parse(folders) : 'None')
  console.log('Templates:', templates ? JSON.parse(templates) : 'None')
  console.log('Theme:', theme)
  
  console.log('=== RAW STORAGE KEYS ===')
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    console.log(`${key}: ${localStorage.getItem(key)?.substring(0, 100)}...`)
  }
}

// Test cultural profile storage
function testCulturalProfile() {
  const testProfile = {
    region: 'North India',
    lifeStage: 'college-student',
    familyDynamics: 'traditional',
    languages: ['english', 'hindi'],
    primaryStressors: ['academic-pressure', 'family-expectations']
  }
  
  localStorage.setItem('user-cultural-profile', JSON.stringify(testProfile))
  
  const loaded = JSON.parse(localStorage.getItem('user-cultural-profile'))
  
  console.log('Test profile saved:', testProfile)
  console.log('Test profile loaded:', loaded)
  console.log('Profile test successful:', JSON.stringify(loaded) === JSON.stringify(testProfile))
  
  return { saved: testProfile, loaded }
}

// Export functions to window (browser console)
if (typeof window !== 'undefined') {
  window.clearAllData = clearAllData
  window.testSaveLoad = testSaveLoad
  window.mockConversation = mockConversation
  window.viewStoredData = viewStoredData
  window.testCulturalProfile = testCulturalProfile
  
  console.log('Sahayak AI localStorage test utilities loaded!')
  console.log('Available functions: clearAllData(), testSaveLoad(), mockConversation(), viewStoredData(), testCulturalProfile()')
}

export {
  clearAllData,
  testSaveLoad,
  mockConversation,
  viewStoredData,
  testCulturalProfile
}