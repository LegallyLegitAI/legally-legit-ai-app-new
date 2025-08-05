import type { User, Session, AuthError } from '@supabase/supabase-js';

export interface Profile {
  id: string;
  full_name: string | null;
  business_name: string | null;
  business_type: string | null;
  business_size: string | null;
  industry: string | null;
  abn: string | null;
  subscription_status: string | null;
  subscription_plan: string | null;
  risk_score: number | null;
  onboarding_completed: boolean | null;
}

export interface AuthState {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  isLoading: boolean;
  isOnboarded: boolean;

  // Actions
  signUp: (email: string, password: string, userData?: Record<string, unknown>) => Promise<{ error?: AuthError | null }>
  signIn: (email: string, password: string) => Promise<{ error?: AuthError | null }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error?: AuthError | null }>
  updateProfile: (updates: Partial<Profile>) => Promise<{ error?: unknown }>
  checkSession: () => void
  setUser: (user: User | null) => void
  setProfile: (profile: Profile | null) => void
  setLoading: (loading: boolean) => void
}

export type { User, Session, AuthError };
