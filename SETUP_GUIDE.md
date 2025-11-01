# Sahayak AI - Setup Guide

This guide will walk you through setting up Clerk authentication and Supabase database for the Sahayak mental health application.

## Prerequisites

- Node.js installed
- A Clerk account (https://clerk.com)
- A Supabase account (https://supabase.com)

## Step 1: Set Up Supabase Database

1. Go to your Supabase dashboard: https://app.supabase.com
2. Select your project (or create a new one)
3. Go to the **SQL Editor** in the left sidebar
4. Copy the entire contents of `supabase-schema.sql` file
5. Paste it into the SQL Editor
6. Click **Run** to execute the SQL script

This will create all the necessary tables:
- `user_profiles` - User profile data with cultural preferences
- `conversations` - Chat conversations
- `messages` - Individual chat messages
- `mood_entries` - Mood tracking data
- `crisis_logs` - Crisis detection logs
- `folders` - Conversation folders
- `templates` - Message templates
- `check_ins` - Daily check-in data
- `resource_access_logs` - Resource access tracking

The script also sets up:
- Row Level Security (RLS) policies for data protection
- Triggers for automatic timestamp updates
- Indexes for better query performance

## Step 2: Configure Clerk Authentication

### 2.1 Set Up Clerk Application

1. Go to https://clerk.com and sign in (or create an account)
2. Create a new application or use your existing one
3. In your Clerk dashboard, go to **API Keys**
4. Copy your keys - they're already in your `.env` file:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`

### 2.2 Configure Clerk Webhook (Important!)

Webhooks sync user data from Clerk to Supabase automatically.

1. In Clerk dashboard, go to **Webhooks**
2. Click **+ Add Endpoint**
3. Set the Endpoint URL to: `https://your-domain.com/api/webhooks/clerk`
   - For local development: Use ngrok or similar tool to expose your local server
   - For production: Use your actual domain
4. Subscribe to these events:
   - `user.created`
   - `user.updated`
   - `user.deleted`
5. Click **Create**
6. Copy the **Signing Secret**
7. Add it to your `.env` file:
   ```
   CLERK_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
   ```

### 2.3 Configure Clerk Sign-In/Sign-Up

1. In Clerk dashboard, go to **Paths**
2. Set the following paths:
   - Sign-in path: `/sign-in`
   - Sign-up path: `/sign-up`
   - After sign-in: `/dashboard`
   - After sign-up: `/dashboard`

## Step 3: Verify Environment Variables

Make sure your `.env` file has all these variables:

```env
# Clerk Configuration
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxx
CLERK_SECRET_KEY=sk_test_xxxxxxxxxxxxx
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
CLERK_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxxxxxxxxxxx
```

## Step 4: Install Dependencies

If you haven't already, install the new dependencies:

```bash
npm install
```

## Step 5: Test the Application

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open http://localhost:3000 in your browser

3. You should see the landing page

4. Click "Get Started" to create a new account

5. After signing up, you'll be redirected to `/dashboard`

## Step 6: Verify Database Integration

After signing up, check your Supabase dashboard:

1. Go to **Table Editor**
2. Select the `user_profiles` table
3. You should see your new user profile created automatically via the webhook

## Features Implemented

### Authentication
- ✅ Clerk authentication with sign-in/sign-up pages
- ✅ Protected routes with middleware
- ✅ Automatic user profile creation via webhooks
- ✅ Session management

### Database
- ✅ Complete Supabase schema with all tables
- ✅ Row Level Security (RLS) for data protection
- ✅ User profiles with cultural preferences
- ✅ Conversations and messages storage
- ✅ Mood tracking and crisis logs
- ✅ Folders and templates
- ✅ Resource access tracking

### API Routes
- ✅ `/api/webhooks/clerk` - Webhook handler for user sync
- ✅ `/api/user/profile` - User profile management

### Hooks
- ✅ `useSupabaseSync` - Auto-sync user profile with Supabase

## Next Steps

Now you need to update the existing components to use Supabase instead of localStorage:

1. **Update AIAssistantUI.jsx** to:
   - Load conversations from Supabase instead of localStorage
   - Save conversations to Supabase
   - Use the user's Supabase profile

2. **Update conversation management** to:
   - Create conversations in Supabase
   - Save messages to Supabase
   - Load messages from Supabase

3. **Update mood tracking** to:
   - Save mood entries to Supabase
   - Load mood history from Supabase

4. **Update crisis detection** to:
   - Log crisis events to Supabase

## Troubleshooting

### Webhook not working
- Make sure your webhook URL is accessible
- For local development, use ngrok: `ngrok http 3000`
- Verify the webhook secret is correct
- Check webhook logs in Clerk dashboard

### Database permissions error
- Make sure RLS policies are enabled
- Verify your Supabase anon key is correct
- Check that the user is authenticated before making database calls

### User profile not created
- Check the webhook is configured correctly
- Verify the webhook secret in `.env`
- Check Supabase logs for any errors

## Security Notes

- Never commit `.env` to version control
- Use Row Level Security (RLS) in production
- Keep your Clerk webhook secret secure
- Use HTTPS in production for webhooks

## Support

If you encounter any issues:
1. Check the browser console for errors
2. Check the server logs
3. Verify all environment variables are set correctly
4. Ensure the database schema was created successfully
