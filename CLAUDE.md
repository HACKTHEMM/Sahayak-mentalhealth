# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Sahayak** is a culturally-sensitive AI mental wellness companion for Indian youth (ages 16-25). The application combines Next.js, Clerk authentication, Supabase database, and Google Gemini AI to provide empathetic mental health support with crisis detection, mood tracking, and multimodal input support.

## Development Commands

```bash
# Install dependencies (pnpm recommended)
pnpm install

# Development server (runs on http://localhost:3000)
pnpm dev

# Production build
pnpm build

# Start production server
pnpm start

# Run linter
pnpm lint
```

## Environment Variables

Required environment variables (see `.env` file):

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
CLERK_WEBHOOK_SECRET=

# Supabase Database
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# Google Gemini AI
GOOGLE_GENERATIVE_AI_API_KEY=

# Email Notifications (Nodemailer)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
NOTIFICATION_FROM=sahayak@mentalhealth.app
```

## Architecture Overview

### Authentication & User Flow

- **Landing Page** (`app/page.tsx`) → Anonymous landing with sign-up CTA
- **Sign-up/Sign-in** (`app/sign-in`, `app/sign-up`) → Clerk authentication pages
- **Dashboard** (`app/dashboard/page.tsx`) → Protected route, main application entry
- **Middleware** (`middleware.ts`) → Route protection using Clerk middleware
- **Webhook** (`app/api/webhooks/clerk/route.ts`) → Syncs Clerk user data to Supabase

### Database Layer (Supabase)

The app uses Supabase as the primary database with **RLS disabled** (for hackathon simplicity). Database schema is in `supabase-schema.sql`.

**Key Tables:**
- `user_profiles` - User data including cultural profiles, synced from Clerk
- `conversations` - Chat sessions with crisis level tracking
- `messages` - Individual messages with role (user/assistant/system)
- `mood_entries` - Daily mood tracking data
- `crisis_logs` - Crisis event logging for escalation
- `folders`, `templates`, `check_ins`, `resource_access_logs`

**Database Helpers** (`lib/db-helpers.ts`):
- Use helper functions for all database operations
- Functions are prefixed by entity (e.g., `getUserProfile`, `createConversation`, `addMessage`)
- All operations are type-safe using TypeScript interfaces from `lib/supabase.ts`

### AI & Mental Wellness System

**Mental Wellness Chain** (`lib/mental-wellness.js`):
- Core AI prompt system using Vercel AI SDK
- `MentalWellnessPrompt.getMainPromptTemplate()` - Main conversational prompt with cultural context
- `MentalWellnessChain.processUserMessage()` - Processes messages with crisis detection
- Crisis levels: LOW, MODERATE, HIGH, CRISIS

**Crisis Escalation** (`lib/crisis-escalation.js`):
- `CrisisEscalationManager` tracks crisis events and escalates when thresholds are met
- Monitors event frequency within time windows
- Provides recommendations based on crisis level
- Can trigger notifications via `lib/crisis-notification.js`

**Cultural Adaptation** (`lib/cultural-adaptation.js`):
- Tailors responses to Indian cultural context
- Adapts language based on user profile (Hinglish support)
- Considers family dynamics, academic pressure, and regional contexts

### API Routes

**`/api/mental-wellness` (POST)** - Main AI conversation endpoint
- Accepts FormData with message, context, userProfile, and optional files
- If files present: Uses Google Generative AI SDK directly for multimodal (images, voice, video, PDF)
- If no files: Uses `createMentalWellnessChain` for text-based conversation
- Returns: response text, crisisLevel, followUpNeeded, timestamp, sessionId
- Always returns a safe fallback response on error with crisis resources

**`/api/mood-check` (POST)** - Mood tracking endpoint

**`/api/resources` (GET)** - Mental health resources endpoint

**`/api/user/profile` (GET/POST)** - User profile management

**`/api/webhooks/clerk` (POST)** - Clerk webhook for user sync

### Frontend Architecture

**Main UI Component** (`components/AIAssistantUI.jsx`):
- Root client component that orchestrates the entire app
- Manages theme (light/dark), sidebar state, conversations, templates
- Uses custom hooks: `useCrisisDetection`, `useMoodTracking`, `useResources`
- Integrates crisis detection and cultural adaptation engines
- All data stored in localStorage for persistence

**Key Components:**
- `Sidebar.jsx` - Navigation with conversations, folders, templates
- `ChatPane.jsx` - Main chat interface
- `Composer.jsx` - Message input with multimodal support (files, voice recording)
- `Message.jsx` - Individual message rendering
- `CulturalProfileSetup.jsx` - Onboarding flow for cultural profile
- `LandingPage.jsx` - Anonymous landing page

**Multimodal Input** (`Composer.jsx`):
- Image upload (click image icon)
- Voice recording (click mic, animates red when recording)
- Video and PDF upload support
- File preview with remove option before sending
- FormData submission to `/api/mental-wellness`

### Styling & Design System

- **Framework**: Tailwind CSS with custom theming
- **Components**: Radix UI primitives with shadcn/ui styling
- **Design**: "Pebble style" with minimal rounded corners (`rounded-sm` = 0.25rem)
- **Glassmorphic**: Transparent backgrounds with backdrop blur
- **Theme**: Light mode default, supports dark mode toggle
- **Path Alias**: `@/*` maps to project root (configured in `tsconfig.json`)

### File Extensions & Conventions

- `.tsx` - TypeScript React components (newer files, type-safe)
- `.jsx` - JavaScript React components (legacy, being migrated)
- `.ts` - TypeScript utilities and types
- `.js` - JavaScript utilities (mental wellness chain, crisis system)
- API routes can be `.js` or `.ts`

## Important Patterns

### Crisis Detection Flow
1. User message → `/api/mental-wellness`
2. AI generates crisis assessment (LOW/MODERATE/HIGH/CRISIS)
3. `CrisisEscalationManager.processCrisisEvent()` checks escalation thresholds
4. If HIGH/CRISIS: Returns crisis resources in response
5. Crisis event logged to `crisis_logs` table
6. Can trigger email notifications via Nodemailer

### Cultural Adaptation Flow
1. User completes `CulturalProfileSetup` onboarding
2. Profile saved to Supabase `user_profiles` table
3. Profile passed in context to `/api/mental-wellness`
4. `culturalAdaptationEngine` adjusts AI prompt template
5. AI response tailored to cultural background, language preferences

### Authentication Flow
1. User signs up via Clerk → `/sign-up`
2. Clerk webhook triggers → `/api/webhooks/clerk`
3. Webhook creates/updates user in Supabase `user_profiles`
4. Dashboard uses `useSupabaseSync()` hook to fetch profile
5. Protected routes check auth via middleware

### Data Persistence Strategy
- **Client-side**: localStorage for conversations, preferences, theme (legacy approach)
- **Database**: Supabase for user profiles, persistent conversations, mood entries
- **Sync**: `useSupabaseSync()` hook syncs Clerk user to Supabase profile

## Testing & Development

### Local Development with Clerk Webhook
For Clerk webhooks to work locally:
```bash
# Install ngrok
ngrok http 3000

# Add webhook endpoint in Clerk dashboard:
# https://xxxxx.ngrok.io/api/webhooks/clerk
# Subscribe to: user.created, user.updated, user.deleted
# Copy signing secret to CLERK_WEBHOOK_SECRET
```

### Database Setup
```bash
# Run in Supabase SQL Editor
# Copy contents of supabase-schema.sql
# Execute to create all tables and indexes
```

## Critical Crisis Resources

Always included in crisis responses:
- National Suicide Prevention: 9152987821
- AASRA: 9820466726
- Vandrevala Foundation: 9999666555
- Sneha: 044-24640050

## Important Notes

- **RLS Disabled**: Supabase Row Level Security is OFF for hackathon simplicity
- **Security**: Application-layer security via Clerk middleware
- **AI Model**: Using `gemini-2.5-flash` for text, `gemini-2.0-flash-exp` for multimodal
- **Fallback Responses**: API always returns safe mental health resources on error
- **Theme Default**: Light mode is default (not system preference)
- **Package Manager**: pnpm recommended but npm/yarn work
- **TypeScript**: Strict mode enabled, paths use `@/*` alias
