import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface UserProfile {
  id: string
  clerk_user_id: string
  email?: string
  full_name?: string
  avatar_url?: string
  culture?: string
  language?: string
  life_stage?: string
  communication_style?: string
  religious_background?: string
  family_structure?: string
  preferences?: Record<string, any>
  theme?: string
  notifications_enabled?: boolean
  created_at?: string
  updated_at?: string
  last_login?: string
}

export interface Conversation {
  id: string
  user_id: string
  folder_id?: string
  title: string
  preview?: string
  pinned: boolean
  message_count: number
  crisis_level?: string
  session_id?: string
  last_mood?: string
  created_at: string
  updated_at: string
}

export interface Message {
  id: string
  conversation_id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  crisis_level?: string
  follow_up_needed?: boolean
  culturally_adapted?: boolean
  fallback_response?: boolean
  created_at: string
  edited_at?: string
}

export interface MoodEntry {
  id: string
  user_id: string
  conversation_id?: string
  mood: string
  intensity: number
  triggers?: string[]
  notes?: string
  activities?: string[]
  created_at: string
}

export interface CrisisLog {
  id: string
  user_id: string
  conversation_id?: string
  crisis_level: string
  session_id?: string
  message_content?: string
  ai_response?: string
  follow_up_needed: boolean
  follow_up_completed: boolean
  escalated: boolean
  escalation_details?: Record<string, any>
  created_at: string
  resolved_at?: string
}

export interface Folder {
  id: string
  user_id: string
  name: string
  created_at: string
  updated_at: string
}

export interface Template {
  id: string
  user_id: string
  name: string
  content: string
  category?: string
  created_at: string
  updated_at: string
}

export interface CheckIn {
  id: string
  user_id: string
  mood: string
  sleep_quality: number
  stress_level: number
  activities?: string[]
  notes?: string
  created_at: string
}
