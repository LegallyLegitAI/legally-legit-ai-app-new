-- Schema Dump for Legally Legit AI - Australian Legal Tech SaaS
-- Generated based on TypeScript definitions in src/lib/supabase.ts
-- Date: January 2025

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    username TEXT,
    full_name TEXT,
    avatar_url TEXT,
    business_name TEXT,
    business_type TEXT,
    business_size TEXT,
    industry TEXT,
    abn TEXT, -- Australian Business Number
    subscription_status TEXT DEFAULT 'trial',
    subscription_plan TEXT DEFAULT 'free',
    risk_score NUMERIC,
    onboarding_completed BOOLEAN DEFAULT false,
    
    CONSTRAINT valid_subscription_status 
        CHECK (subscription_status IN ('trial', 'active', 'cancelled', 'past_due')),
    CONSTRAINT valid_subscription_plan 
        CHECK (subscription_plan IN ('free', 'starter', 'professional', 'enterprise')),
    CONSTRAINT valid_business_size 
        CHECK (business_size IN ('sole_trader', 'small', 'medium', 'large')),
    CONSTRAINT valid_risk_score 
        CHECK (risk_score >= 0 AND risk_score <= 100)
);

-- Create documents table
CREATE TABLE IF NOT EXISTS documents (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    document_type TEXT NOT NULL,
    status TEXT DEFAULT 'draft',
    metadata JSONB,
    
    CONSTRAINT valid_document_type 
        CHECK (document_type IN ('privacy_policy', 'terms_of_service', 'contract', 'compliance_document', 'risk_assessment', 'other')),
    CONSTRAINT valid_status 
        CHECK (status IN ('draft', 'review', 'approved', 'published', 'archived'))
);

-- Create risk_assessments table
CREATE TABLE IF NOT EXISTS risk_assessments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    assessment_type TEXT NOT NULL,
    score NUMERIC NOT NULL,
    answers JSONB, -- Store survey answers
    recommendations JSONB,
    status TEXT DEFAULT 'pending',
    
    CONSTRAINT valid_assessment_type 
        CHECK (assessment_type IN ('privacy_compliance', 'data_security', 'contract_review', 'regulatory_compliance', 'general_risk', 'compliance_health_check')),
    CONSTRAINT valid_assessment_status 
        CHECK (status IN ('pending', 'in_progress', 'completed', 'requires_action')),
    CONSTRAINT valid_score 
        CHECK (score >= 0 AND score <= 100)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_business_type ON profiles(business_type);
CREATE INDEX IF NOT EXISTS idx_profiles_subscription_status ON profiles(subscription_status);
CREATE INDEX IF NOT EXISTS idx_documents_user_id ON documents(user_id);
CREATE INDEX IF NOT EXISTS idx_documents_type ON documents(document_type);
CREATE INDEX IF NOT EXISTS idx_documents_status ON documents(status);
CREATE INDEX IF NOT EXISTS idx_documents_created_at ON documents(created_at);
CREATE INDEX IF NOT EXISTS idx_risk_assessments_user_id ON risk_assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_risk_assessments_type ON risk_assessments(assessment_type);
CREATE INDEX IF NOT EXISTS idx_risk_assessments_status ON risk_assessments(status);
CREATE INDEX IF NOT EXISTS idx_risk_assessments_created_at ON risk_assessments(created_at);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER update_profiles_updated_at 
    BEFORE UPDATE ON profiles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_documents_updated_at 
    BEFORE UPDATE ON documents 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
