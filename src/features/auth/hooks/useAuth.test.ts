import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { supabase } from '@/shared/lib/supabase';
import { useSession, useUser, useSignUp, useSignIn, useSignOut } from './useAuth';

// Mock dependencies
vi.mock('@/shared/lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
    },
  },
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

describe('Authentication Hooks', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = createWrapper();
    vi.clearAllMocks();
  });

  // Test useSession
  describe('useSession', () => {
    it('should return session data on success', async () => {
      const mockSession = { user: { id: '123', email: 'test@example.com' }, access_token: 'token' };
      supabase.auth.getSession.mockResolvedValueOnce({ data: { session: mockSession }, error: null });

      const { result } = renderHook(() => useSession(), { wrapper });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data).toEqual(mockSession);
    });
  });

  // Test useUser
  describe('useUser', () => {
    it('should return user from session', async () => {
      const mockSession = { user: { id: '123', email: 'test@example.com' } };
      supabase.auth.getSession.mockResolvedValue({ data: { session: mockSession }, error: null });
      
      const { result } = renderHook(() => useUser(), { wrapper });

      await waitFor(() => {
        expect(result.current.user).toEqual(mockSession.user);
        expect(result.current.isAuthenticated).toBe(true);
      });
    });
  });

  // Test useSignUp
  describe('useSignUp', () => {
    it('should sign up a user and return data', async () => {
      const newUser = { email: 'new@example.com', password: 'password' };
      const signUpResponse = { user: { id: '456', email: newUser.email }, session: null };
      supabase.auth.signUp.mockResolvedValue({ data: signUpResponse, error: null });

      const { result } = renderHook(() => useSignUp(), { wrapper });

      await act(async () => {
        await result.current.mutateAsync(newUser);
      });

      expect(supabase.auth.signUp).toHaveBeenCalledWith(expect.objectContaining({ email: newUser.email }));
    });
  });

  // Test useSignIn
  describe('useSignIn', () => {
    it('should sign in a user', async () => {
      const credentials = { email: 'test@example.com', password: 'password' };
      supabase.auth.signInWithPassword.mockResolvedValue({ data: {}, error: null });

      const { result } = renderHook(() => useSignIn(), { wrapper });

      await act(async () => {
        await result.current.mutateAsync(credentials);
      });

      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith(credentials);
    });
  });

  // Test useSignOut
  describe('useSignOut', () => {
    it('should sign out a user', async () => {
      supabase.auth.signOut.mockResolvedValue({ error: null });

      const { result } = renderHook(() => useSignOut(), { wrapper });

      await act(async () => {
        await result.current.mutateAsync();
      });

      expect(supabase.auth.signOut).toHaveBeenCalled();
    });
  });
});
