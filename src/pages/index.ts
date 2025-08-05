export { default as HomePage } from './HomePage';
export { default as DashboardPage } from './DashboardPage';
export { default as AboutPage } from './AboutPage';

// Re-export auth pages
export * from '@/features/auth/pages/SignInPage';
export * from '@/features/auth/pages/SignUpPage';
export * from '@/features/auth/pages/AuthCallbackPage';
export * from '@/features/auth/pages/VerifyEmailPage';
export * from '@/features/auth/pages/ResetPasswordPage';
export * from '@/features/auth/pages/UpdatePasswordPage';
