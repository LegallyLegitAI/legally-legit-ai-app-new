import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/shared/lib/supabase';
import { toast } from 'react-hot-toast';
import { useUser } from './useAuth';
import type { Database } from '@/shared/lib/supabase';

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

// Profile query keys
export const PROFILE_KEYS = {
  profile: (userId: string) => ['profile', userId],
  profiles: ['profiles'],
} as const;

// Get user profile
export const useProfile = () => {
  const { user } = useUser();

  return useQuery({
    queryKey: PROFILE_KEYS.profile(user?.id || ''),
    queryFn: async (): Promise<Profile | null> => {
      if (!user?.id) return null;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // Profile doesn't exist, return null
          return null;
        }
        throw error;
      }

      return data;
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
  });
};

// Create profile (used after sign up)
export const useCreateProfile = () => {
  const queryClient = useQueryClient();
  const { user } = useUser();

  return useMutation({
    mutationFn: async (profileData: Omit<ProfileInsert, 'id'>) => {
      if (!user?.id) throw new Error('No authenticated user');

      const { data, error } = await supabase
        .from('profiles')
        .insert([
          {
            id: user.id,
            ...profileData,
            updated_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(PROFILE_KEYS.profile(user?.id || ''), data);
      queryClient.invalidateQueries({ queryKey: PROFILE_KEYS.profiles });
      toast.success('Profile created successfully');
    },
    onError: (error: any) => {
      console.error('Profile creation error:', error);
      toast.error('Failed to create profile');
    },
  });
};

// Update profile
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const { user } = useUser();

  return useMutation({
    mutationFn: async (updates: ProfileUpdate) => {
      if (!user?.id) throw new Error('No authenticated user');

      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(PROFILE_KEYS.profile(user?.id || ''), data);
      queryClient.invalidateQueries({ queryKey: PROFILE_KEYS.profiles });
      toast.success('Profile updated successfully');
    },
    onError: (error: any) => {
      console.error('Profile update error:', error);
      toast.error('Failed to update profile');
    },
  });
};

// Complete onboarding
export const useCompleteOnboarding = () => {
  const updateProfile = useUpdateProfile();

  return useMutation({
    mutationFn: async (profileData: Partial<ProfileUpdate>) => {
      return updateProfile.mutateAsync({
        ...profileData,
        onboarding_completed: true,
      });
    },
    onSuccess: () => {
      toast.success('Onboarding completed! Welcome to Legally Legit AI!');
    },
  });
};

// Check if user needs onboarding
export const useOnboardingStatus = () => {
  const { data: profile, isLoading } = useProfile();
  const { user } = useUser();

  return {
    needsOnboarding: !!user && (!profile || !profile.onboarding_completed),
    isOnboarded: profile?.onboarding_completed || false,
    isLoading,
  };
};

// Auto-create profile on first sign-in (helper hook)
export const useAutoCreateProfile = () => {
  const { user } = useUser();
  const { data: profile, isLoading: profileLoading } = useProfile();
  const createProfile = useCreateProfile();

  // Auto-create profile if user exists but profile doesn't
  const shouldCreateProfile = user && !profile && !profileLoading && !createProfile.isPending;

  if (shouldCreateProfile) {
    // Extract data from user metadata or use defaults
    const userData = user.user_metadata || {};
    
    createProfile.mutateAsync({
      full_name: userData.full_name || userData.name || null,
      business_name: userData.business_name || null,
      username: userData.username || user.email?.split('@')[0] || null,
      onboarding_completed: false,
    }).catch((error) => {
      console.error('Auto profile creation failed:', error);
    });
  }

  return {
    isCreating: createProfile.isPending,
    hasProfile: !!profile,
  };
};
