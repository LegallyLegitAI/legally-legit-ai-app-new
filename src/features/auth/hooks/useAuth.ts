import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/shared/lib/supabase';
import { toast } from 'react-hot-toast';
import type { AuthError, User, Session } from '@supabase/supabase-js';

export interface SignUpData {
  email: string;
  password: string;
  full_name?: string;
  business_name?: string;
}

export interface SignInData {
  email: string;
  password: string;
}

// Auth queries and mutations
export const AUTH_KEYS = {
  session: ['auth', 'session'],
  user: ['auth', 'user'],
} as const;

// Get current session
export const useSession = () => {
  return useQuery({
    queryKey: AUTH_KEYS.session,
    queryFn: async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      return session;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
};

// Get current user
export const useUser = () => {
  const { data: session } = useSession();
  return {
    user: session?.user || null,
    isLoading: !session,
    isAuthenticated: !!session?.user,
  };
};

// Sign up with email/password
export const useSignUp = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async ({ email, password, full_name, business_name }: SignUpData) => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name,
            business_name,
          },
        },
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: AUTH_KEYS.session });
      toast.success('Account created! Please check your email to verify your account.');
      
      if (data.user && !data.user.email_confirmed_at) {
        navigate('/auth/verify-email');
      }
    },
    onError: (error: AuthError) => {
      toast.error(error.message);
    },
  });
};

// Sign in with email/password
export const useSignIn = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async ({ email, password }: SignInData) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AUTH_KEYS.session });
      toast.success('Welcome back!');
      navigate('/dashboard');
    },
    onError: (error: AuthError) => {
      toast.error(error.message);
    },
  });
};

// Sign in with Google
export const useSignInWithGoogle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AUTH_KEYS.session });
      // Note: Success toast will be shown after redirect
    },
    onError: (error: AuthError) => {
      toast.error(error.message);
    },
  });
};

// Sign out
export const useSignOut = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async () => {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.clear();
      toast.success('Signed out successfully');
      navigate('/');
    },
    onError: (error: AuthError) => {
      toast.error(error.message);
    },
  });
};

// Reset password
export const useResetPassword = () => {
  return useMutation({
    mutationFn: async (email: string) => {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Password reset email sent! Check your inbox.');
    },
    onError: (error: AuthError) => {
      toast.error(error.message);
    },
  });
};

// Update password
export const useUpdatePassword = () => {
  return useMutation({
    mutationFn: async (password: string) => {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Password updated successfully');
    },
    onError: (error: AuthError) => {
      toast.error(error.message);
    },
  });
};
