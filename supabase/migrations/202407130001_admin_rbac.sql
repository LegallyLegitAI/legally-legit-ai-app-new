-- Supabase RLS policies for Admin RBAC

-- 1. Enable RLS on the profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 2. Create a policy that allows users to read their own profile
CREATE POLICY "Users can view their own profile" ON public.profiles
FOR SELECT USING (auth.uid() = id);

-- 3. Create a policy that allows users to update their own profile
CREATE POLICY "Users can update their own profile" ON public.profiles
FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- 4. Create a policy that allows admins to read all profiles
CREATE POLICY "Admins can view all profiles" ON public.profiles
FOR SELECT USING (get_my_claim('user_role') = '"admin"'::jsonb);

-- 5. Create a policy that allows admins to update any profile
CREATE POLICY "Admins can update any profile" ON public.profiles
FOR UPDATE USING (get_my_claim('user_role') = '"admin"'::jsonb) WITH CHECK (get_my_claim('user_role') = '"admin"'::jsonb);

-- Helper function to get user claims
CREATE OR REPLACE FUNCTION get_my_claim(claim TEXT) RETURNS JSONB
AS $$
  SELECT coalesce(current_setting('request.jwt.claims', true)::jsonb ->> claim, null)::jsonb
$$ LANGUAGE SQL STABLE;

-- Function to get user role from claims
CREATE OR REPLACE FUNCTION get_my_role() RETURNS TEXT
AS $$
  SELECT get_my_claim('user_role')::text
$$ LANGUAGE SQL STABLE;


