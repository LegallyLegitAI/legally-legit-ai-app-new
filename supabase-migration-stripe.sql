-- Migration: Add Stripe Integration Fields to Profiles Table
-- Date: January 2025
-- Description: Adds stripe_customer_id field for billing integration

-- Add stripe_customer_id to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT UNIQUE;

-- Create index for stripe_customer_id for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_stripe_customer_id ON profiles(stripe_customer_id);

-- Update TypeScript type definitions comment
COMMENT ON COLUMN profiles.stripe_customer_id IS 'Stripe customer ID for billing integration';
