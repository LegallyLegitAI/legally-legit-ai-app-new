import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ProtectedRoute, OnboardedRoute } from './ProtectedRoute';
import { useUser } from '../hooks/useAuth';
import { useOnboardingStatus, useAutoCreateProfile } from '../hooks/useProfile';
import { useAuthContext } from '../context/AuthContext';

// Mock hooks
vi.mock('../hooks/useAuth');
vi.mock('../hooks/useProfile');
vi.mock('../context/AuthContext');

// Mock React Router
vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual('react-router-dom')),
  Navigate: ({ to }) => <div data-testid="navigate">Redirecting to {to}</div>,
  useLocation: () => ({ pathname: '/dashboard' }),
}));

const TestChild = () => <div data-testid="protected-content">Protected Content</div>;

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });
  return ({ children }) => (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </BrowserRouter>
  );
};

describe('ProtectedRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Default mocks
    useAuthContext.mockReturnValue({ isInitializing: false });
    useAutoCreateProfile.mockReturnValue({ isCreating: false, hasProfile: true });
  });

  it('should show loading when initializing', () => {
    useAuthContext.mockReturnValue({ isInitializing: true });
    useUser.mockReturnValue({ user: null, isAuthenticated: false });
    useOnboardingStatus.mockReturnValue({ needsOnboarding: false, isOnboarded: false, isLoading: false });

    render(
      <ProtectedRoute>
        <TestChild />
      </ProtectedRoute>,
      { wrapper: createWrapper() }
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should redirect to signin when not authenticated', () => {
    useUser.mockReturnValue({ user: null, isAuthenticated: false });
    useOnboardingStatus.mockReturnValue({ needsOnboarding: false, isOnboarded: false, isLoading: false });

    render(
      <ProtectedRoute>
        <TestChild />
      </ProtectedRoute>,
      { wrapper: createWrapper() }
    );

    expect(screen.getByTestId('navigate')).toBeInTheDocument();
    expect(screen.getByText(/Redirecting to.*signin/)).toBeInTheDocument();
  });

  it('should show protected content when authenticated and onboarded', () => {
    useUser.mockReturnValue({ 
      user: { id: '123', email: 'test@example.com' }, 
      isAuthenticated: true 
    });
    useOnboardingStatus.mockReturnValue({ 
      needsOnboarding: false, 
      isOnboarded: true, 
      isLoading: false 
    });

    render(
      <ProtectedRoute>
        <TestChild />
      </ProtectedRoute>,
      { wrapper: createWrapper() }
    );

    expect(screen.getByTestId('protected-content')).toBeInTheDocument();
  });

  it('should redirect to onboarding when user needs onboarding and requireOnboarding is true', () => {
    useUser.mockReturnValue({ 
      user: { id: '123', email: 'test@example.com' }, 
      isAuthenticated: true 
    });
    useOnboardingStatus.mockReturnValue({ 
      needsOnboarding: true, 
      isOnboarded: false, 
      isLoading: false 
    });

    render(
      <ProtectedRoute requireOnboarding={true}>
        <TestChild />
      </ProtectedRoute>,
      { wrapper: createWrapper() }
    );

    expect(screen.getByTestId('navigate')).toBeInTheDocument();
    expect(screen.getByText('Redirecting to /onboarding')).toBeInTheDocument();
  });

  it('should show content when user needs onboarding but requireOnboarding is false', () => {
    useUser.mockReturnValue({ 
      user: { id: '123', email: 'test@example.com' }, 
      isAuthenticated: true 
    });
    useOnboardingStatus.mockReturnValue({ 
      needsOnboarding: true, 
      isOnboarded: false, 
      isLoading: false 
    });

    render(
      <ProtectedRoute requireOnboarding={false}>
        <TestChild />
      </ProtectedRoute>,
      { wrapper: createWrapper() }
    );

    expect(screen.getByTestId('protected-content')).toBeInTheDocument();
  });
});

describe('OnboardedRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuthContext.mockReturnValue({ isInitializing: false });
    useAutoCreateProfile.mockReturnValue({ isCreating: false, hasProfile: true });
  });

  it('should require onboarding by default', () => {
    useUser.mockReturnValue({ 
      user: { id: '123', email: 'test@example.com' }, 
      isAuthenticated: true 
    });
    useOnboardingStatus.mockReturnValue({ 
      needsOnboarding: true, 
      isOnboarded: false, 
      isLoading: false 
    });

    render(
      <OnboardedRoute>
        <TestChild />
      </OnboardedRoute>,
      { wrapper: createWrapper() }
    );

    expect(screen.getByTestId('navigate')).toBeInTheDocument();
    expect(screen.getByText('Redirecting to /onboarding')).toBeInTheDocument();
  });
});
