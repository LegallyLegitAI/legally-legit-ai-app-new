import React, { createContext, useContext, useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/shared/lib/supabase';
import { AUTH_KEYS } from '../hooks/useAuth';
import { PROFILE_KEYS } from '../hooks/useProfile';
import type { User, Session, AuthChangeEvent } from '@supabase/supabase-js';

interface AuthContextType {
  isInitializing: boolean;
}

const AuthContext = createContext<AuthContextType>({
  isInitializing: true,
});

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const queryClient = useQueryClient();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        console.log('Auth state changed:', event, session?.user?.email);

        // Update session cache
        queryClient.setQueryData(AUTH_KEYS.session, session);

        // Handle different auth events
        switch (event) {
          case 'SIGNED_IN':
            if (session?.user) {
              // Invalidate profile to refetch for this user
              queryClient.invalidateQueries({
                queryKey: PROFILE_KEYS.profile(session.user.id),
              });
            }
            break;

          case 'SIGNED_OUT':
            // Clear all auth-related queries
            queryClient.removeQueries({ queryKey: AUTH_KEYS.session });
            queryClient.removeQueries({ queryKey: PROFILE_KEYS.profiles });
            break;

          case 'TOKEN_REFRESHED':
            // Session is already updated above
            break;

          case 'USER_UPDATED':
            if (session?.user) {
              // Invalidate profile to get updated user data
              queryClient.invalidateQueries({
                queryKey: PROFILE_KEYS.profile(session.user.id),
              });
            }
            break;

          case 'PASSWORD_RECOVERY':
            // Handle password recovery if needed
            break;
        }

        // Initialization is complete after the first auth state change
        if (isInitializing) {
          setIsInitializing(false);
        }
      }
    );

    // Initialize session on mount
    const initializeSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        queryClient.setQueryData(AUTH_KEYS.session, session);
      } catch (error) {
        console.error('Failed to initialize session:', error);
      } finally {
        setIsInitializing(false);
      }
    };

    initializeSession();

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [queryClient, isInitializing]);

  const value = {
    isInitializing,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
