# Supabase Setup Guide for Ikiform

This guide will help you set up Supabase for the Ikiform application. You can choose between automated setup using SQL scripts or manual setup through the Supabase dashboard.

## Prerequisites

1. A Supabase account and project ([Sign up here](https://supabase.com))
2. Your Supabase project URL and keys (found in Project Settings > API)

## Quick Start (Automated Setup)

### 1. Configure Environment Variables

Copy `.env.example` to `.env.local` and fill in your Supabase credentials:

```bash
cp .env.example .env.local
```

Update these required variables in `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 2. Run Database Setup

Execute the setup scripts in your Supabase SQL Editor in this order:

1. **Database Schema Setup** (`supabase/migrations/001_database_schema.sql`)
   - Creates all required tables (users, forms, form_submissions, etc.)
   - Sets up indexes for performance
   - Configures Row Level Security (RLS) policies
   - Creates automatic triggers for user creation and timestamps

2. **Storage Setup** (`supabase/migrations/002_storage_setup.sql`)
   - Creates the `form-files` storage bucket
   - Configures file upload policies
   - Sets up file size limits (50MB) and allowed MIME types

### 3. Enable Authentication Providers (Manual Step)

In your Supabase dashboard:
1. Go to **Authentication > Providers**
2. Enable the providers you want to support:
   - Email/Password (recommended)
   - Google OAuth
   - GitHub OAuth
   - Others as needed

### 4. Configure Email Templates (Optional)

To customize email templates:
1. Go to **Authentication > Email Templates**
2. Customize the templates for:
   - Confirm signup
   - Reset password
   - Magic link

## Manual Setup Guide

If you prefer to set up through the Supabase dashboard:

### Step 1: Create Tables

Navigate to **Database > Tables** and create the following tables:

#### Users Table
```sql
CREATE TABLE public.users (
  uid UUID REFERENCES auth.users ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  has_premium BOOLEAN DEFAULT FALSE,
  polar_customer_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (uid)
);
```

#### Forms Table
```sql
CREATE TABLE public.forms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.users(uid) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  slug TEXT,
  schema JSONB NOT NULL,
  is_published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### Form Submissions Table
```sql
CREATE TABLE public.form_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  form_id UUID NOT NULL REFERENCES public.forms(id) ON DELETE CASCADE,
  submission_data JSONB NOT NULL,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  ip_address TEXT
);
```

#### AI Chat Tables
```sql
-- AI Builder Chat
CREATE TABLE public.ai_builder_chat (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.users(uid) ON DELETE CASCADE,
  session_id TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI Analytics Chat
CREATE TABLE public.ai_analytics_chat (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.users(uid) ON DELETE CASCADE,
  form_id UUID NOT NULL REFERENCES public.forms(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### Redemption Codes Table
```sql
CREATE TABLE public.redemption_codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  redeemer_email TEXT,
  redeemer_user_id UUID REFERENCES public.users(uid) ON DELETE SET NULL,
  redeemed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE,
  max_uses INTEGER DEFAULT 1,
  current_uses INTEGER DEFAULT 0,
  expires_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}'
);
```

### Step 2: Enable Row Level Security (RLS)

For each table, enable RLS in the dashboard:
1. Go to **Database > Tables**
2. Click on each table
3. Click **RLS enabled** toggle
4. Add the appropriate policies (see the SQL scripts for policy definitions)

### Step 3: Create Storage Bucket

1. Go to **Storage > Buckets**
2. Create a new bucket called `form-files`
3. Set it as **Private**
4. Configure file size limit: 50MB
5. Add allowed MIME types:
   - Images: `image/*`
   - Videos: `video/*`
   - Documents: PDF, Word, Excel, PowerPoint
   - Archives: ZIP, RAR, 7Z

### Step 4: Set Up Database Functions

Create the necessary database functions in **Database > Functions**:

1. **Auto-create user profile on signup**
2. **Auto-update timestamps**
3. **File statistics helper**
4. **Cleanup orphaned files**

(See the SQL scripts for complete function definitions)

## Testing Your Setup

After setup, verify everything works:

### 1. Test Authentication
```bash
npm run dev
# Navigate to http://localhost:3000
# Try signing up with email
```

### 2. Test Database Connection
Check the Supabase logs in **Database > Logs** for any errors.

### 3. Test Storage
Try uploading a file through a form to ensure storage policies work correctly.

## Troubleshooting

### Common Issues

#### RLS Policy Errors
- **Problem**: "Row level security policy violation"
- **Solution**: Check that all RLS policies are properly created and auth is configured

#### Storage Upload Failures
- **Problem**: Files won't upload
- **Solution**: Verify storage bucket exists and policies are set correctly

#### User Profile Not Created
- **Problem**: User signs up but profile isn't created
- **Solution**: Check the `handle_new_user` trigger is active

#### Connection Issues
- **Problem**: "Failed to connect to Supabase"
- **Solution**: Verify your environment variables are correct

### Getting Help

1. Check Supabase logs: **Database > Logs**
2. Review RLS policies: **Database > Tables > [table] > Policies**
3. Test SQL queries: **SQL Editor**
4. Check the [Supabase Discord](https://discord.supabase.com) for community help

## Security Best Practices

1. **Never commit `.env.local`** - It contains sensitive keys
2. **Use RLS policies** - Always enable and configure Row Level Security
3. **Rotate keys regularly** - Update your API keys periodically
4. **Monitor usage** - Check Supabase dashboard for unusual activity
5. **Backup data** - Enable point-in-time recovery in production

## Production Deployment

When deploying to production:

1. Use environment variables from your hosting provider (Vercel, Netlify, etc.)
2. Enable email rate limiting in Supabase Auth settings
3. Configure custom SMTP for production emails
4. Set up database backups
5. Monitor database performance and add indexes as needed

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Ikiform Documentation](../README.md)
- [Next.js + Supabase Guide](https://supabase.com/docs/guides/with-nextjs)