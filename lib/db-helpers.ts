import { supabase, UserProfile, Conversation, Message, MoodEntry, Folder, Template, CheckIn, CrisisLog } from './supabase'

// ============================================
// USER PROFILE HELPERS
// ============================================

export async function getUserProfile(clerkUserId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('clerk_user_id', clerkUserId)
    .single()

  if (error) {
    console.error('Error fetching user profile:', error)
    return null
  }

  return data
}

export async function createOrUpdateUserProfile(profileData: Partial<UserProfile>): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('user_profiles')
    .upsert(profileData, {
      onConflict: 'clerk_user_id',
      ignoreDuplicates: false,
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating/updating user profile:', error)
    return null
  }

  return data
}

export async function updateUserLastLogin(clerkUserId: string): Promise<void> {
  await supabase
    .from('user_profiles')
    .update({ last_login: new Date().toISOString() })
    .eq('clerk_user_id', clerkUserId)
}

// ============================================
// CONVERSATION HELPERS
// ============================================

export async function getUserConversations(clerkUserId: string): Promise<Conversation[]> {
  // First get the user profile to get the internal UUID
  const profile = await getUserProfile(clerkUserId)
  if (!profile) {
    console.error('No user profile found for clerk user:', clerkUserId)
    return []
  }

  const { data, error } = await supabase
    .from('conversations')
    .select('*')
    .eq('user_id', profile.id)
    .order('updated_at', { ascending: false })

  if (error) {
    console.error('Error fetching conversations:', error)
    return []
  }

  return data || []
}

export async function createConversation(conversationData: Partial<Conversation>, clerkUserId?: string): Promise<Conversation | null> {
  let finalData = { ...conversationData }

  // If clerkUserId is provided, convert it to internal user ID
  if (clerkUserId && !conversationData.user_id) {
    const profile = await getUserProfile(clerkUserId)
    if (profile) {
      finalData.user_id = profile.id
    } else {
      console.error('No user profile found for clerk user:', clerkUserId)
      return null
    }
  }

  const { data, error } = await supabase
    .from('conversations')
    .insert(finalData)
    .select()
    .single()

  if (error) {
    console.error('Error creating conversation:', error)
    return null
  }

  return data
}

export async function updateConversation(conversationId: string, updates: Partial<Conversation>): Promise<Conversation | null> {
  const { data, error } = await supabase
    .from('conversations')
    .update(updates)
    .eq('id', conversationId)
    .select()
    .single()

  if (error) {
    console.error('Error updating conversation:', error)
    return null
  }

  return data
}

export async function deleteConversation(conversationId: string): Promise<boolean> {
  try {
    console.log('🗑️ [DB-HELPERS] deleteConversation called with:', {
      conversationId,
      conversationIdType: typeof conversationId,
      conversationIdLength: conversationId?.length
    })

    if (!conversationId) {
      console.error('❌ [DB-HELPERS] No conversation ID provided')
      return false
    }

    // First, check if conversation exists
    console.log('📋 [DB-HELPERS] Fetching conversation before delete...')
    const { data: existingConvo, error: fetchError } = await supabase
      .from('conversations')
      .select('id, title, user_id')
      .eq('id', conversationId)
      .single()

    if (fetchError) {
      console.error('❌ [DB-HELPERS] Error fetching conversation before delete:', {
        conversationId,
        errorMessage: fetchError.message,
        errorCode: fetchError.code,
        errorDetails: fetchError.details,
        errorHint: fetchError.hint
      })
      return false
    }

    if (!existingConvo) {
      console.error('❌ [DB-HELPERS] Conversation not found in database:', conversationId)
      return false
    }

    console.log('✅ [DB-HELPERS] Found conversation to delete:', existingConvo)

    // Now delete it
    console.log('🗑️ [DB-HELPERS] Executing delete operation...')
    const { error } = await supabase
      .from('conversations')
      .delete()
      .eq('id', conversationId)

    if (error) {
      console.error('❌ [DB-HELPERS] Error deleting conversation:', {
        conversationId,
        errorMessage: error.message,
        errorDetails: error.details,
        errorHint: error.hint,
        errorCode: error.code,
        fullError: error
      })
      return false
    }

    console.log('✅ [DB-HELPERS] Successfully deleted conversation:', conversationId)
    return true
  } catch (err) {
    console.error('💥 [DB-HELPERS] Exception in deleteConversation:', err)
    return false
  }
}

// ============================================
// MESSAGE HELPERS
// ============================================

export async function getConversationMessages(conversationId: string): Promise<Message[]> {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching messages:', error)
    return []
  }

  return data || []
}

export async function addMessage(messageData: Partial<Message>): Promise<Message | null> {
  const { data, error } = await supabase
    .from('messages')
    .insert(messageData)
    .select()
    .single()

  if (error) {
    console.error('Error creating message:', error)
    return null
  }

  return data
}

// Alias for backwards compatibility
export const createMessage = addMessage

export async function updateMessage(messageId: string, content: string): Promise<Message | null> {
  const { data, error } = await supabase
    .from('messages')
    .update({
      content,
      edited_at: new Date().toISOString()
    })
    .eq('id', messageId)
    .select()
    .single()

  if (error) {
    console.error('Error updating message:', error)
    return null
  }

  return data
}

// ============================================
// MOOD ENTRY HELPERS
// ============================================

export async function getUserMoodEntries(userId: string, limit: number = 30): Promise<MoodEntry[]> {
  const { data, error } = await supabase
    .from('mood_entries')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching mood entries:', error)
    return []
  }

  return data || []
}

export async function createMoodEntry(moodData: Partial<MoodEntry>, clerkUserId?: string): Promise<MoodEntry | null> {
  let finalData = { ...moodData }

  // Convert Clerk ID to internal UUID if provided
  if (clerkUserId && !moodData.user_id) {
    const profile = await getUserProfile(clerkUserId)
    if (profile) {
      finalData.user_id = profile.id
    } else {
      console.error('No user profile found for clerk user:', clerkUserId)
      return null
    }
  }

  const { data, error } = await supabase
    .from('mood_entries')
    .insert(finalData)
    .select()
    .single()

  if (error) {
    console.error('Error creating mood entry:', error)
    return null
  }

  return data
}

// ============================================
// CRISIS LOG HELPERS
// ============================================

export async function createCrisisLog(crisisData: Partial<CrisisLog>, clerkUserId?: string): Promise<CrisisLog | null> {
  let finalData = { ...crisisData }

  // Convert Clerk ID to internal UUID if provided
  if (clerkUserId && !crisisData.user_id) {
    const profile = await getUserProfile(clerkUserId)
    if (profile) {
      finalData.user_id = profile.id
    } else {
      console.error('No user profile found for clerk user:', clerkUserId)
      return null
    }
  }

  const { data, error } = await supabase
    .from('crisis_logs')
    .insert(finalData)
    .select()
    .single()

  if (error) {
    console.error('Error creating crisis log:', error)
    return null
  }

  return data
}

export async function getUserCrisisLogs(userId: string): Promise<CrisisLog[]> {
  const { data, error } = await supabase
    .from('crisis_logs')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching crisis logs:', error)
    return []
  }

  return data || []
}

// ============================================
// FOLDER HELPERS
// ============================================

export async function getUserFolders(clerkUserId: string): Promise<Folder[]> {
  const profile = await getUserProfile(clerkUserId)
  if (!profile) {
    console.error('No user profile found for clerk user:', clerkUserId)
    return []
  }

  const { data, error } = await supabase
    .from('folders')
    .select('*')
    .eq('user_id', profile.id)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching folders:', error)
    return []
  }

  return data || []
}

export async function createFolder(folderData: Partial<Folder>): Promise<Folder | null> {
  const { data, error } = await supabase
    .from('folders')
    .insert(folderData)
    .select()
    .single()

  if (error) {
    console.error('Error creating folder:', error)
    return null
  }

  return data
}

// ============================================
// TEMPLATE HELPERS
// ============================================

export async function getUserTemplates(clerkUserId: string): Promise<Template[]> {
  const profile = await getUserProfile(clerkUserId)
  if (!profile) {
    console.error('No user profile found for clerk user:', clerkUserId)
    return []
  }

  const { data, error } = await supabase
    .from('templates')
    .select('*')
    .eq('user_id', profile.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching templates:', error)
    return []
  }

  return data || []
}

export async function createTemplate(templateData: Partial<Template>): Promise<Template | null> {
  const { data, error } = await supabase
    .from('templates')
    .insert(templateData)
    .select()
    .single()

  if (error) {
    console.error('Error creating template:', error)
    return null
  }

  return data
}

// ============================================
// CHECK-IN HELPERS
// ============================================

export async function createCheckIn(checkInData: Partial<CheckIn>): Promise<CheckIn | null> {
  const { data, error } = await supabase
    .from('check_ins')
    .insert(checkInData)
    .select()
    .single()

  if (error) {
    console.error('Error creating check-in:', error)
    return null
  }

  return data
}

export async function getUserCheckIns(userId: string, limit: number = 30): Promise<CheckIn[]> {
  const { data, error } = await supabase
    .from('check_ins')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching check-ins:', error)
    return []
  }

  return data || []
}
