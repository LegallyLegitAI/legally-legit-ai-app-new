import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { supabase } from '@/shared/lib/supabase';
import { useProfile, useCreateProfile, useUpdateProfile, useOnboardingStatus } from './useProfile';
import { useUser } from './useAuth';

// Mock dependencies
vi.mock('@/shared/lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn(),
    })),
  },
}));

vi.mock('./useAuth', () => ({
  useUser: vi.fn(),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });
  return ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('Profile Hooks', () => {
  let wrapper;
  const mockUser = { id: '123', email: 'test@example.com' };

  beforeEach(() => {
    wrapper = createWrapper();
    vi.clearAllMocks();
    useUser.mockReturnValue({
      user: mockUser,
      isLoading: false,
      isAuthenticated: true,
    });
  });

  // Test useProfile
  describe('useProfile', () => {
    it('should return profile data for authenticated user', async () => {
      const mockProfile = {
        id: '123',
        full_name: 'Test User',
        business_name: 'Test Business',
        onboarding_completed: false,
      };

      supabase.from().single.mockResolvedValue({ data: mockProfile, error: null });

      const { result } = renderHook(() => useProfile(), { wrapper });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data).toEqual(mockProfile);
    });

    it('should return null if no user is authenticated', async () => {
      useUser.mockReturnValue({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });

      const { result } = renderHook(() => useProfile(), { wrapper });

      await waitFor(() => expect(result.current.data).toBeNull());
    });
  });

  // Test useCreateProfile
  describe('useCreateProfile', () => {
    it('should create a new profile', async () => {
      const newProfile = {
        full_name: 'New User',
        business_name: 'New Business',
        onboarding_completed: false,
      };

      const createdProfile = { id: '123', ...newProfile };
      supabase.from().single.mockResolvedValue({ data: createdProfile, error: null });

      const { result } = renderHook(() => useCreateProfile(), { wrapper });

      await act(async () => {
        await result.current.mutateAsync(newProfile);
      });

      expect(supabase.from).toHaveBeenCalledWith('profiles');
    });
  });

  // Test useUpdateProfile
  describe('useUpdateProfile', () => {
    it('should update an existing profile', async () => {
      const updateData = { full_name: 'Updated Name' };
      const updatedProfile = { id: '123', ...updateData };
      
      supabase.from().single.mockResolvedValue({ data: updatedProfile, error: null });

      const { result } = renderHook(() => useUpdateProfile(), { wrapper });

      await act(async () => {
        await result.current.mutateAsync(updateData);
      });

      expect(supabase.from).toHaveBeenCalledWith('profiles');
    });
  });

  // Test useOnboardingStatus
  describe('useOnboardingStatus', () => {
    it('should return needsOnboarding true when profile has onboarding_completed false', async () => {
      const mockProfile = {
        id: '123',
        onboarding_completed: false,
      };

      supabase.from().single.mockResolvedValue({ data: mockProfile, error: null });

      const { result } = renderHook(() => useOnboardingStatus(), { wrapper });

      await waitFor(() => {
        expect(result.current.needsOnboarding).toBe(true);
        expect(result.current.isOnboarded).toBe(false);
      });
    });

    it('should return needsOnboarding false when profile has onboarding_completed true', async () => {
      const mockProfile = {
        id: '123',
        onboarding_completed: true,
      };

      supabase.from().single.mockResolvedValue({ data: mockProfile, error: null });

      const { result } = renderHook(() => useOnboardingStatus(), { wrapper });

      await waitFor(() => {
        expect(result.current.needsOnboarding).toBe(false);
        expect(result.current.isOnboarded).toBe(true);
      });
    });
  });
});
