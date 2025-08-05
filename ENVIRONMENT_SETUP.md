# Environment Variables Setup Guide - Legally Legit AI

## Overview
This guide covers the environment variable configuration for the Legally Legit AI SaaS platform, built for Australian small business owners.

## Environment Files Structure

```
.env.example            # Template with placeholder values (committed to repo)
.env.local             # Local development values (never committed)
.env.production.example # Production template (committed to repo)
```

## Required Environment Variables

### Client-Side Variables (Vite Accessible)
These variables are prefixed with `VITE_` and are accessible in the frontend code:

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_SUPABASE_URL` | Supabase project URL | `https://your-project.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key | `eyJhbGci...` |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | `pk_test_...` or `pk_live_...` |
| `VITE_APP_URL` | Application base URL | `http://localhost:5173` or `https://legally-legit-ai.vercel.app` |
| `VITE_APP_NAME` | Application display name | `"Legally Legit AI"` |
| `VITE_GOOGLE_ANALYTICS_ID` | Google Analytics tracking ID (optional) | `G-XXXXXXXXXX` |

### Server-Side Variables (Secure)
These variables are NOT prefixed with `VITE_` and are only accessible on the server:

| Variable | Description | Security Level |
|----------|-------------|----------------|
| `OPENAI_API_KEY` | OpenAI API key for document generation | **ENCRYPTED** |
| `STRIPE_SECRET_KEY` | Stripe secret key for payment processing | **ENCRYPTED** |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook endpoint secret | **ENCRYPTED** |

## Local Development Setup

1. **Copy the example file:**
   ```bash
   cp .env.example .env.local
   ```

2. **Update values in `.env.local`:**
   - Replace all placeholder values with your actual development credentials
   - Use test/development keys (not production)

3. **Verify configuration:**
   ```bash
   npm run type-check
   ```

## Production Deployment (Vercel)

### Setting Environment Variables in Vercel

1. **Navigate to your Vercel project dashboard**
2. **Go to Settings → Environment Variables**
3. **Add each variable with appropriate settings:**

#### Client-Side Variables (Plain Text):
```
VITE_SUPABASE_URL → your-production-supabase-url
VITE_SUPABASE_ANON_KEY → your-production-anon-key
VITE_STRIPE_PUBLISHABLE_KEY → pk_live_your_stripe_publishable_key
VITE_APP_URL → https://legally-legit-ai.vercel.app
VITE_APP_NAME → "Legally Legit AI"
VITE_GOOGLE_ANALYTICS_ID → G-XXXXXXXXXX
```

#### Server-Side Variables (ENCRYPTED):
```
OPENAI_API_KEY → sk-your_production_openai_key [✓ Sensitive]
STRIPE_SECRET_KEY → sk_live_your_stripe_secret_key [✓ Sensitive]  
STRIPE_WEBHOOK_SECRET → whsec_your_webhook_secret [✓ Sensitive]
```

**Important:** Mark all server-side variables as "Sensitive" in Vercel to encrypt them.

## Security Best Practices

### ✅ DO:
- Use different credentials for development and production
- Mark sensitive variables as "Encrypted" in Vercel
- Regularly rotate API keys
- Use least-privilege principles for API keys
- Test with test/sandbox credentials during development

### ❌ DON'T:
- Commit `.env.local` or any file with real credentials
- Use production keys in development
- Share credentials in chat, email, or documentation
- Prefix server-side secrets with `VITE_`

## Environment Variable Validation

The application includes runtime validation for required environment variables:

```typescript
// In src/lib/supabase.ts
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}
```

## Troubleshooting

### Common Issues:

1. **"Missing environment variables" error:**
   - Check that all required variables are set in `.env.local`
   - Verify variable names match exactly (case-sensitive)
   - Restart the development server after changes

2. **Variables not accessible in frontend:**
   - Ensure client-side variables are prefixed with `VITE_`
   - Check that variables are defined in `src/vite-env.d.ts`

3. **Production deployment issues:**
   - Verify all variables are set in Vercel dashboard
   - Check that sensitive variables are marked as "Encrypted"
   - Ensure production URLs and keys are correct

### Getting Help:

- Check the [Vite Environment Variables Guide](https://vite.dev/guide/env-and-mode.html)
- Review [Vercel Environment Variables Docs](https://vercel.com/docs/projects/environment-variables)
- Contact the development team for credential access

---

**Last Updated:** January 2025  
**Project:** Legally Legit AI - Australian Legal Tech SaaS
