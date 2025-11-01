-- Sahayak Mental Health App - Supabase Database Schema
-- Run this SQL in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USER PROFILES TABLE
-- ============================================
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clerk_user_id TEXT UNIQUE NOT NULL,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,

  -- Cultural profile data
  culture TEXT,
  language TEXT,
  life_stage TEXT,
  communication_style TEXT,
  religious_background TEXT,
  family_structure TEXT,
  preferences JSONB DEFAULT '{}'::jsonb,

  -- Settings
  theme TEXT DEFAULT 'light',
  notifications_enabled BOOLEAN DEFAULT true,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE
);

-- Create index on clerk_user_id for faster lookups
CREATE INDEX idx_user_profiles_clerk_id ON user_profiles(clerk_user_id);

-- ============================================
-- FOLDERS TABLE
-- ============================================
CREATE TABLE folders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_folders_user_id ON folders(user_id);

-- ============================================
-- CONVERSATIONS TABLE
-- ============================================
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  folder_id UUID REFERENCES folders(id) ON DELETE SET NULL,

  title TEXT NOT NULL DEFAULT 'New Chat',
  preview TEXT,
  pinned BOOLEAN DEFAULT false,
  message_count INTEGER DEFAULT 0,

  -- Mental wellness metadata
  crisis_level TEXT DEFAULT 'LOW',
  session_id TEXT,
  last_mood TEXT,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_conversations_user_id ON conversations(user_id);
CREATE INDEX idx_conversations_folder_id ON conversations(folder_id);
CREATE INDEX idx_conversations_updated_at ON conversations(updated_at DESC);

-- ============================================
-- MESSAGES TABLE
-- ============================================
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,

  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,

  -- Mental wellness data for AI responses
  crisis_level TEXT,
  follow_up_needed BOOLEAN,
  culturally_adapted BOOLEAN DEFAULT false,
  fallback_response BOOLEAN DEFAULT false,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  edited_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);

-- ============================================
-- MOOD ENTRIES TABLE
-- ============================================
CREATE TABLE mood_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  conversation_id UUID REFERENCES conversations(id) ON DELETE SET NULL,

  mood TEXT NOT NULL,
  intensity INTEGER CHECK (intensity >= 1 AND intensity <= 10),
  triggers JSONB DEFAULT '[]'::jsonb,
  notes TEXT,
  activities JSONB DEFAULT '[]'::jsonb,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_mood_entries_user_id ON mood_entries(user_id);
CREATE INDEX idx_mood_entries_created_at ON mood_entries(created_at DESC);
CREATE INDEX idx_mood_entries_conversation_id ON mood_entries(conversation_id);

-- ============================================
-- CRISIS LOGS TABLE
-- ============================================
CREATE TABLE crisis_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  conversation_id UUID REFERENCES conversations(id) ON DELETE SET NULL,

  crisis_level TEXT NOT NULL,
  session_id TEXT,
  message_content TEXT,
  ai_response TEXT,

  follow_up_needed BOOLEAN DEFAULT false,
  follow_up_completed BOOLEAN DEFAULT false,
  escalated BOOLEAN DEFAULT false,
  escalation_details JSONB,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_crisis_logs_user_id ON crisis_logs(user_id);
CREATE INDEX idx_crisis_logs_created_at ON crisis_logs(created_at DESC);
CREATE INDEX idx_crisis_logs_crisis_level ON crisis_logs(crisis_level);

-- ============================================
-- TEMPLATES TABLE
-- ============================================
CREATE TABLE templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,

  name TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_templates_user_id ON templates(user_id);

-- ============================================
-- RESOURCE ACCESS LOGS TABLE
-- ============================================
CREATE TABLE resource_access_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,

  resource_name TEXT NOT NULL,
  resource_category TEXT,
  resource_url TEXT,

  accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_resource_logs_user_id ON resource_access_logs(user_id);
CREATE INDEX idx_resource_logs_accessed_at ON resource_access_logs(accessed_at DESC);

-- ============================================
-- CHECK-IN DATA TABLE
-- ============================================
CREATE TABLE check_ins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,

  mood TEXT NOT NULL,
  sleep_quality INTEGER CHECK (sleep_quality >= 1 AND sleep_quality <= 5),
  stress_level INTEGER CHECK (stress_level >= 1 AND stress_level <= 5),
  activities JSONB DEFAULT '[]'::jsonb,
  notes TEXT,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_check_ins_user_id ON check_ins(user_id);
CREATE INDEX idx_check_ins_created_at ON check_ins(created_at DESC);

-- ============================================
-- ROW LEVEL SECURITY (RLS) - DISABLED FOR HACKATHON
-- ============================================

-- Note: RLS is disabled for simplicity during hackathon development
-- Security is handled at the application layer through Clerk authentication
-- For production, you should enable RLS policies

-- To enable RLS in production, uncomment the following:
-- ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE folders ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE mood_entries ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE crisis_logs ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE resource_access_logs ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE check_ins ENABLE ROW LEVEL SECURITY;

-- ============================================
-- FUNCTIONS AND TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_folders_updated_at
  BEFORE UPDATE ON folders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_conversations_updated_at
  BEFORE UPDATE ON conversations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_templates_updated_at
  BEFORE UPDATE ON templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update conversation message count
CREATE OR REPLACE FUNCTION update_conversation_message_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE conversations
    SET message_count = message_count + 1,
        updated_at = NOW()
    WHERE id = NEW.conversation_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE conversations
    SET message_count = GREATEST(message_count - 1, 0),
        updated_at = NOW()
    WHERE id = OLD.conversation_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update conversation message count
CREATE TRIGGER update_conversation_count_on_message
  AFTER INSERT OR DELETE ON messages
  FOR EACH ROW EXECUTE FUNCTION update_conversation_message_count();

-- ============================================
-- INITIAL DATA (OPTIONAL)
-- ============================================

-- You can add default folders or templates here if needed
-- Example:
-- INSERT INTO folders (user_id, name)
-- SELECT id, 'Work Projects' FROM user_profiles WHERE clerk_user_id = 'your-clerk-id';
