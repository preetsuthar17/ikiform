# Forms0 Database Setup

This directory contains the database setup scripts for Forms0.

## Setup Instructions

1. **Create the database tables by running the SQL script in your Supabase dashboard:**

   - Go to your Supabase project dashboard
   - Navigate to the SQL Editor
   - Copy and paste the contents of `setup.sql`
   - Run the script

2. **The script will create:**
   - `forms` table to store form schemas and metadata
   - `form_submissions` table to store form responses
   - Indexes for optimal performance
   - Row Level Security (RLS) policies for data protection
   - Triggers for automatic timestamp updates

## Table Structure

### Forms Table

- `id`: UUID primary key
- `user_id`: Reference to auth.users
- `title`: Form title
- `description`: Optional form description
- `schema`: JSONB containing form structure
- `is_published`: Boolean for form visibility
- `created_at`, `updated_at`: Timestamps

### Form Submissions Table

- `id`: UUID primary key
- `form_id`: Reference to forms table
- `submission_data`: JSONB containing form responses
- `submitted_at`: Submission timestamp
- `ip_address`: Optional IP tracking

## Security

- RLS policies ensure users can only access their own forms
- Published forms are readable by the public for submissions
- Form submissions are only viewable by form owners
- Anonymous users can submit to published forms only
