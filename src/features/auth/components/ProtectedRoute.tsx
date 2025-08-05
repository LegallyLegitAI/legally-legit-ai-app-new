import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from '../hooks/useAuth';
import { useOnboardingStatus, useAutoCreateProfile } from '../hooks/useProfile';
import { useAuthContext } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireOnboarding?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireOnboarding = false,
}) => {
  const location = useLocation();
  const { isInitializing } = useAuthContext();
  const { user, isAuthenticated } = useUser();
  const { needsOnboarding, isOnboarded, isLoading: onboardingLoading } = useOnboardingStatus();
  
  // Auto-create profile if needed
  const { isCreating: isCreatingProfile } = useAutoCreateProfile();

  // Show loading while initializing auth or checking onboarding status
  if (isInitializing || onboardingLoading || isCreatingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return (
      <Navigate
        to={`/auth/signin?redirect=${encodeURIComponent(location.pathname)}`}
        replace
      />
    );
  }

  // Handle onboarding logic
  if (needsOnboarding) {
    // If we're already on the onboarding page, allow access
    if (location.pathname === '/onboarding') {
      return <>{children}</>;
    }
    
    // If the route requires onboarding and user hasn't completed it, redirect
    if (requireOnboarding) {
      return <Navigate to="/onboarding" replace />;
    }
  }

  // If the route requires onboarding to be completed but user hasn't, redirect
  if (requireOnboarding && !isOnboarded) {
    return <Navigate to="/onboarding" replace />;
  }

  // User is authenticated and meets all requirements
  return <>{children}</>;
};

// Convenience wrapper for routes that require completed onboarding
export const OnboardedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ProtectedRoute requireOnboarding={true}>
      {children}
    </ProtectedRoute>
  );
};
