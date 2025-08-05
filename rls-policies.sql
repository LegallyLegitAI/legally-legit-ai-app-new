-- Row-Level Security (RLS) Policies for Legally Legit AI
-- Ensures users can only access their own data
-- Tailored for Australian legal tech SaaS security requirements
-- Date: January 2025

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE risk_assessments ENABLE ROW LEVEL SECURITY;

-- ===========================================
-- PROFILES TABLE RLS POLICIES
-- ===========================================

-- Policy: Users can view their own profile
CREATE POLICY "Users can access own profile"
ON profiles FOR SELECT
USING ( auth.uid() = id );

-- Policy: Users can insert their own profile (during registration)
CREATE POLICY "Users can create own profile"
ON profiles FOR INSERT
WITH CHECK ( auth.uid() = id );

-- Policy: Users can update their own profile
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING ( auth.uid() = id )
WITH CHECK ( auth.uid() = id );

-- Policy: Users cannot delete their own profile (business requirement)
-- No DELETE policy means profiles cannot be deleted via RLS
-- (Admin-level deletion would require service role)

-- ===========================================
-- DOCUMENTS TABLE RLS POLICIES
-- ===========================================

-- Policy: Users can view their own documents
CREATE POLICY "Users can access own documents"
ON documents FOR SELECT
USING ( auth.uid() = user_id );

-- Policy: Users can create documents
CREATE POLICY "Users can create documents"
ON documents FOR INSERT
WITH CHECK ( auth.uid() = user_id );

-- Policy: Users can update their own documents
CREATE POLICY "Users can update own documents"
ON documents FOR UPDATE
USING ( auth.uid() = user_id )
WITH CHECK ( auth.uid() = user_id );

-- Policy: Users can delete their own documents
CREATE POLICY "Users can delete own documents"
ON documents FOR DELETE
USING ( auth.uid() = user_id );

-- ===========================================
-- RISK_ASSESSMENTS TABLE RLS POLICIES
-- ===========================================

-- Policy: Users can view their own risk assessments
CREATE POLICY "Users can access own risk assessments"
ON risk_assessments FOR SELECT
USING ( auth.uid() = user_id );

-- Policy: Users can create risk assessments
CREATE POLICY "Users can create risk assessments"
ON risk_assessments FOR INSERT
WITH CHECK ( auth.uid() = user_id );

-- Policy: Users can update their own risk assessments
CREATE POLICY "Users can update own risk assessments"
ON risk_assessments FOR UPDATE
USING ( auth.uid() = user_id )
WITH CHECK ( auth.uid() = user_id );

-- Policy: Users can delete their own risk assessments
CREATE POLICY "Users can delete own risk assessments"
ON risk_assessments FOR DELETE
USING ( auth.uid() = user_id );

-- ===========================================
-- ADDITIONAL SECURITY POLICIES
-- ===========================================

-- Service role policies (for backend operations with service key)
-- These policies allow full access when using the service role key

-- Service role can access all profiles (for admin operations)
CREATE POLICY "Service role can access all profiles"
ON profiles FOR ALL
USING ( auth.role() = 'service_role' )
WITH CHECK ( auth.role() = 'service_role' );

-- Service role can access all documents (for system operations)
CREATE POLICY "Service role can access all documents"
ON documents FOR ALL
USING ( auth.role() = 'service_role' )
WITH CHECK ( auth.role() = 'service_role' );

-- Service role can access all risk assessments (for analytics)
CREATE POLICY "Service role can access all risk assessments"
ON risk_assessments FOR ALL
USING ( auth.role() = 'service_role' )
WITH CHECK ( auth.role() = 'service_role' );

-- ===========================================
-- AUDIT POLICIES (OPTIONAL - FOR COMPLIANCE)
-- ===========================================

-- Create audit log table for compliance tracking
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id UUID REFERENCES auth.users(id),
    table_name TEXT NOT NULL,
    operation TEXT NOT NULL,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT
);

-- Enable RLS on audit logs
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Only service role can access audit logs
CREATE POLICY "Service role can access audit logs"
ON audit_logs FOR ALL
USING ( auth.role() = 'service_role' )
WITH CHECK ( auth.role() = 'service_role' );

-- ===========================================
-- HELPER FUNCTIONS FOR ADVANCED RLS
-- ===========================================

-- Function to check if user has premium subscription (for feature gating)
CREATE OR REPLACE FUNCTION has_premium_subscription()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() 
        AND subscription_plan IN ('professional', 'enterprise')
        AND subscription_status = 'active'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Example premium feature policy (commented out - implement as needed)
-- CREATE POLICY "Premium users can access advanced documents"
-- ON documents FOR SELECT
-- USING ( 
--     auth.uid() = user_id 
--     AND (document_type != 'advanced_contract' OR has_premium_subscription())
-- );

-- ===========================================
-- POLICY TESTING QUERIES
-- ===========================================

-- Test queries to verify RLS is working correctly
-- Run these with different user contexts

-- Test as authenticated user (should only see own data):
-- SELECT * FROM profiles WHERE id = auth.uid();
-- SELECT * FROM documents WHERE user_id = auth.uid();
-- SELECT * FROM risk_assessments WHERE user_id = auth.uid();

-- Test as anonymous user (should see nothing):
-- SELECT * FROM profiles;
-- SELECT * FROM documents;  
-- SELECT * FROM risk_assessments;
