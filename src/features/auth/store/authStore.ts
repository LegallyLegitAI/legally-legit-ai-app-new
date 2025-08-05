import { create } from 'zustand';
import { supabase } from '@/shared/lib/supabase';
import toast from 'react-hot-toast';
import type { AuthState, Profile, User, AuthError, UserRole } from '../types';

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  session: null,
  isLoading: true,
  isOnboarded: false,

  signUp: async (email: string, password: string, userData = {}) => {
    set({ isLoading: true });

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
        },
      });

      if (error) {
        toast.error(error.message);
        return { error };
      }

      if (data.user) {
        // Create profile record
        const { error: profileError } = await supabase.from('profiles').insert([
          {
            id: data.user.id,
            full_name: (userData.full_name as string) || null,
            business_name: (userData.business_name as string) || null,
            role: 'user',
            updated_at: new Date().toISOString(),
          },
        ]);

        if (profileError) {
          console.error('Profile creation error:', profileError);
        }

        toast.success('Account created! Please check your email to verify your account.');
      }

      return { error: null };
    } catch (error) {
      const authError = error as AuthError;
      toast.error(authError.message);
      return { error: authError };
    } finally {
      set({ isLoading: false });
    }
  },

  signIn: async (email: string, password: string) => {
    set({ isLoading: true });

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error(error.message);
        return { error };
      }

      if (data.user) {
        toast.success('Welcome back!');
      }

      return { error: null };
    } catch (error) {
      const authError = error as AuthError;
      toast.error(authError.message);
      return { error: authError };
    } finally {
      set({ isLoading: false });
    }
  },

  signOut: async () => {
    set({ isLoading: true });

    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        toast.error(error.message);
      } else {
        set({ user: null, profile: null, session: null, isOnboarded: false });
        toast.success('Signed out successfully');
      }
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Error signing out');
    } finally {
      set({ isLoading: false });
    }
  },

  resetPassword: async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        toast.error(error.message);
        return { error };
      }

      toast.success('Password reset email sent!');
      return { error: null };
    } catch (error) {
      const authError = error as AuthError;
      toast.error(authError.message);
      return { error: authError };
    }
  },

  updateProfile: async (updates: Partial<Profile>) => {
    const { user } = get();
    if (!user) return { error: new Error('No user logged in') };

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', user.id);

      if (error) {
        toast.error('Failed to update profile');
        return { error };
      }

      // Update local state
      const { profile } = get();
      if (profile) {
        set({ profile: { ...profile, ...updates } });
      }

      toast.success('Profile updated successfully');
      return { error: null };
    } catch (error) {
      toast.error('Failed to update profile');
      return { error };
    }
  },

  checkSession: async () => {
    set({ isLoading: true });

    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        console.error('Session check error:', error);
        set({ user: null, profile: null, session: null, isOnboarded: false });
        return;
      }

      if (session?.user) {
        // Fetch user profile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profileError) {
          console.error('Profile fetch error:', profileError);
        }

        set({
          user: session.user,
          session,
          profile: profile || null,
          isOnboarded: profile?.onboarding_completed || false,
        });
      } else {
        set({ user: null, profile: null, session: null, isOnboarded: false });
      }
    } catch (error) {
      console.error('Session check error:', error);
      set({ user: null, profile: null, session: null, isOnboarded: false });
    } finally {
      set({ isLoading: false });
    }
  },

  setUser: (user: User | null) => set({ user }),
  setProfile: (profile: Profile | null) => set({ profile }),
  setLoading: (isLoading: boolean) => set({ isLoading }),
  hasRole: (role: UserRole) => {
    const { profile } = get();
    return profile?.role === role;
  },
}));

// Listen to auth changes
supabase.auth.onAuthStateChange(async (event, session) => {
  const { setUser, setProfile, setLoading, checkSession } = useAuthStore.getState();

  if (event === 'SIGNED_IN' && session) {
    checkSession();
  } else if (event === 'SIGNED_OUT') {
    setUser(null);
    setProfile(null);
    setLoading(false);
  } else if (event === 'TOKEN_REFRESHED' && session) {
    setUser(session.user);
  }
});
