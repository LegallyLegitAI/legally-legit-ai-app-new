# Stripe Billing Integration Setup Guide

This guide covers the complete setup process for Stripe subscription billing in Legally Legit AI.

## 🎯 Overview

The integration includes:
- **Starter Plan**: Free trial (5 documents/month)
- **Professional Plan**: $99 AUD/month (unlimited documents)
- Stripe Checkout for subscriptions
- Customer Portal for subscription management
- Webhook handling for subscription updates

## 🏗️ Architecture

### Frontend Components
- `BillingPage`: Main billing interface with plan comparison
- `SubscribeButton`: Initiates Stripe Checkout
- `ManageSubscriptionButton`: Opens Stripe Customer Portal
- `useSubscription`: Hook to fetch user subscription status

### Backend API Routes
- `/api/stripe/create-checkout-session`: Creates Stripe checkout session
- `/api/stripe/create-portal-session`: Creates customer portal session  
- `/api/stripe/webhook`: Handles Stripe webhook events

### Database Schema
- Added `stripe_customer_id` field to `profiles` table
- Existing `subscription_status` and `subscription_plan` fields track user state

## 🔧 Setup Instructions

### 1. Create Stripe Products and Prices

In the Stripe Dashboard:

1. **Create Starter Product**:
   - Name: "Starter Plan"
   - Description: "Free trial with 5 documents per month"
   - Price: $0 AUD/month
   - Copy the Price ID → Use as `VITE_STRIPE_PRICE_STARTER`

2. **Create Professional Product**:
   - Name: "Professional Plan"  
   - Description: "Unlimited documents with premium features"
   - Price: $99 AUD/month (recurring)
   - Copy the Price ID → Use as `VITE_STRIPE_PRICE_PRO`

### 2. Configure Stripe Webhook

1. In Stripe Dashboard → Webhooks → Add endpoint
2. URL: `https://your-app.vercel.app/api/stripe/webhook`
3. Select events:
   - `checkout.session.completed`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
4. Copy webhook secret → Use as `STRIPE_WEBHOOK_SECRET`

### 3. Database Migration

Run the Supabase migration:

```sql
-- Add stripe_customer_id to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT UNIQUE;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_stripe_customer_id ON profiles(stripe_customer_id);
```

### 4. Environment Variables

#### Local Development (.env.local)
```bash
# Stripe Client-Side
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
VITE_STRIPE_PRICE_STARTER=price_...
VITE_STRIPE_PRICE_PRO=price_...

# Stripe Server-Side (Secure)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

#### Vercel Deployment
Set these as **encrypted** environment variables in Vercel:
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET` 
- `SUPABASE_SERVICE_ROLE_KEY`
- `VITE_STRIPE_PUBLISHABLE_KEY`
- `VITE_STRIPE_PRICE_STARTER`
- `VITE_STRIPE_PRICE_PRO`

## 🧪 Testing Guide

### Test Mode Setup
1. Use Stripe test keys (pk_test_, sk_test_)
2. Create test products with test price IDs
3. Use test webhook endpoint during development

### Test Scenarios

#### 1. Free Trial Subscription
- User visits `/billing`
- Clicks "Subscribe to Starter" (free plan)
- Should update profile with trial status

#### 2. Paid Subscription
- User visits `/billing` 
- Clicks "Subscribe to Professional"
- Completes Stripe Checkout with test card: `4242 4242 4242 4242`
- Webhook should update subscription status to "active"

#### 3. Subscription Management
- User with active subscription visits `/billing`
- Clicks "Manage Subscription"
- Should open Stripe Customer Portal
- Can update payment method, cancel subscription

#### 4. Webhook Testing
Use Stripe CLI to forward webhooks locally:
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

### Test Cards
- **Success**: 4242 4242 4242 4242
- **Decline**: 4000 0000 0000 0002
- **3D Secure**: 4000 0025 0000 3155

## 🚀 Deployment Checklist

### Pre-deployment
- [ ] Database migration applied
- [ ] Stripe products created in **live mode**
- [ ] Webhook endpoint configured in **live mode**
- [ ] Environment variables set in Vercel
- [ ] Test all flows in staging environment

### Post-deployment
- [ ] Verify webhook delivery in Stripe Dashboard
- [ ] Test complete subscription flow
- [ ] Monitor for errors in Vercel Function logs
- [ ] Confirm database updates from webhooks

## 🛡️ Security Considerations

1. **Environment Variables**: Never expose secret keys client-side
2. **Webhook Verification**: Always verify webhook signatures
3. **User Authentication**: Validate Supabase JWT tokens in API routes
4. **Error Handling**: Don't expose internal errors to clients
5. **Database Access**: Use service role key only in server functions

## 🔍 Monitoring & Debugging

### Key Metrics
- Subscription conversion rates
- Failed payment rates  
- Webhook delivery success
- API endpoint response times

### Debugging Tools
- Stripe Dashboard → Events (webhook delivery)
- Vercel Functions → Logs
- Supabase Dashboard → Database queries
- Browser Dev Tools → Network tab

### Common Issues
1. **Webhook 400 errors**: Check endpoint signature verification
2. **Checkout fails**: Verify price IDs and customer creation
3. **Portal errors**: Ensure customer exists in Stripe
4. **Auth errors**: Check JWT token validation

## 📝 Usage Examples

### Subscribe to a Plan
```typescript
import { SubscribeButton } from '@/features/billing';

<SubscribeButton 
  priceId="price_1234567890"
  planName="Professional"
/>
```

### Check Subscription Status
```typescript
import { useSubscription } from '@/features/billing';

function MyComponent() {
  const { data: subscription, isLoading } = useSubscription();
  
  if (subscription?.status === 'active') {
    return <div>You have an active subscription!</div>;
  }
}
```

### Manage Subscription
```typescript
import { ManageSubscriptionButton } from '@/features/billing';

<ManageSubscriptionButton />
```

This integration provides a complete, production-ready billing system tailored for Australian businesses with proper error handling, security, and user experience.
