# Supabase Authentication Setup Guide

This guide will help you set up authentication for Legally Legit AI using Supabase with Google OAuth and email/password providers.

## 1. Enable Authentication Providers in Supabase Dashboard

### Email/Password Authentication
1. Go to your Supabase Dashboard → Authentication → Settings
2. Under "Auth Providers", ensure Email is enabled
3. Configure email templates if needed (optional but recommended)

### Google OAuth Setup
1. Go to your Supabase Dashboard → Authentication → Settings
2. Under "Auth Providers", find Google and click "Configure"
3. Enable Google OAuth
4. You'll need to create a Google OAuth application:

#### Create Google OAuth Credentials
1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Set the application type to "Web application"
6. Add authorized redirect URIs:
   - For development: `https://your-project-ref.supabase.co/auth/v1/callback`
   - For production: `https://your-production-domain.supabase.co/auth/v1/callback`
7. Copy the Client ID and Client Secret

#### Configure Supabase with Google Credentials
1. Back in Supabase Dashboard → Authentication → Settings → Google
2. Paste your Google Client ID and Client Secret
3. Save the configuration

## 2. Database Setup

Run the SQL migration provided in `supabase-profile-trigger.sql` to:
- Create the profile auto-creation trigger
- Set up Row Level Security (RLS) policies
- Grant necessary permissions

```sql
-- Run this in your Supabase SQL Editor
-- Copy contents from supabase-profile-trigger.sql
```

## 3. Environment Variables

Update your `.env.local` file with your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## 4. Testing Authentication

### Test Email/Password Flow
1. Go to `/auth/signup`
2. Create an account with email/password
3. Check your email for verification
4. Sign in at `/auth/signin`

### Test Google OAuth Flow
1. Go to `/auth/signin`
2. Click "Continue with Google"
3. Complete Google OAuth flow
4. You should be redirected to `/dashboard` or `/onboarding`

## 5. Production Considerations

### Security
- Enable email confirmation for new users
- Set up proper RLS policies on all tables
- Configure secure password requirements
- Use HTTPS in production

### Email Configuration
- Set up custom SMTP for production emails
- Customize email templates for branding
- Configure proper from/reply-to addresses

### Monitoring
- Enable auth event logs in Supabase
- Set up monitoring for auth failures
- Track user registration and login metrics

## 6. Troubleshooting

### Common Issues

#### Google OAuth Not Working
- Check redirect URIs match exactly
- Ensure Google+ API is enabled
- Verify client ID/secret are correct
- Check browser console for errors

#### Profile Not Created Automatically
- Verify the trigger function is installed
- Check if RLS policies are blocking inserts
- Look at Supabase logs for errors

#### Redirect Issues After Auth
- Check AuthCallbackPage is properly configured
- Ensure redirect URLs in Google Console are correct
- Verify session handling in AuthContext

### Debug Commands

```bash
# Check if user exists in auth.users
SELECT * FROM auth.users WHERE email = 'user@example.com';

# Check if profile was created
SELECT * FROM public.profiles WHERE id = 'user-uuid';

# Check auth event logs
SELECT * FROM auth.audit_log_entries ORDER BY created_at DESC LIMIT 10;
```

## 7. Next Steps

After authentication is working:

1. **Onboarding Flow**: Customize the onboarding experience in `/onboarding`
2. **Profile Management**: Add profile editing functionality
3. **Role-Based Access**: Implement user roles and permissions
4. **Session Management**: Configure session timeout and refresh
5. **Multi-Factor Authentication**: Consider adding MFA for enhanced security

For more advanced configuration, refer to the [Supabase Auth documentation](https://supabase.com/docs/guides/auth).
