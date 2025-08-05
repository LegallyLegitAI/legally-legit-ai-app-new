-- Add role column to profiles table

-- Add role column with a default value of 'user'
ALTER TABLE public.profiles
ADD COLUMN role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin'));

-- Set existing users to 'user' role (in case there are any existing records)
UPDATE public.profiles SET role = 'user' WHERE role IS NULL;

-- Make the role column NOT NULL after setting defaults
ALTER TABLE public.profiles ALTER COLUMN role SET NOT NULL;
