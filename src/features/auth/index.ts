// Auth hooks
export * from './hooks/useAuth';
export * from './hooks/useProfile';

// Auth context
export * from './context/AuthContext';

// Auth components
export * from './components/ProtectedRoute';

// Auth pages
export * from './pages/SignInPage';
export * from './pages/SignUpPage';
export * from './pages/AuthCallbackPage';
export * from './pages/VerifyEmailPage';
export * from './pages/ResetPasswordPage';
export * from './pages/UpdatePasswordPage';

// Auth store (legacy - for backwards compatibility)
export * from './store/authStore';

// Auth types
export * from './types';

// Auth feature exports
export { useAuthStore } from './store/authStore';

// Types
export type * from './types';
