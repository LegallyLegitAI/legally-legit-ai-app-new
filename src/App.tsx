import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { MarketingPage, AboutPage } from '@/features/marketing';
import { DashboardPage, HomePage } from '@/features/dashboard';
import { DocumentGeneratorPage } from '@/features/document';
import { OnboardingPage } from '@/features/onboarding';
import { SettingsPage } from '@/features/settings';
import { AdminPage } from '@/features/admin';
import { AppShell } from '@/shared/components';

// New Auth Pages and Components
import { AuthProvider } from '@/features/auth/context/AuthContext';
import { ProtectedRoute, OnboardedRoute } from '@/features/auth/components/ProtectedRoute';
import { SignInPage } from '@/features/auth/pages/SignInPage';
import { SignUpPage } from '@/features/auth/pages/SignUpPage';
import { VerifyEmailPage } from '@/features/auth/pages/VerifyEmailPage';
import { ResetPasswordPage } from '@/features/auth/pages/ResetPasswordPage';
import { UpdatePasswordPage } from '@/features/auth/pages/UpdatePasswordPage';
import { AuthCallbackPage } from '@/features/auth/pages/AuthCallbackPage';

export const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<MarketingPage />} />
          <Route path="/about" element={<AboutPage />} />

          {/* Auth Routes */}
          <Route path="/auth/signin" element={<SignInPage />} />
          <Route path="/auth/signup" element={<SignUpPage />} />
          <Route path="/auth/verify-email" element={<VerifyEmailPage />} />
          <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
          <Route path="/auth/update-password" element={<UpdatePasswordPage />} />
          <Route path="/auth/callback" element={<AuthCallbackPage />} />
          
          {/* Protected Routes (Onboarding not required) */}
          <Route path="/onboarding" element={<ProtectedRoute><OnboardingPage /></ProtectedRoute>} />

          {/* Protected Routes (Onboarding required) */}
          <Route path="/dashboard" element={<OnboardedRoute><AppShell><DashboardPage /></AppShell></OnboardedRoute>} />
          <Route path="/generator" element={<OnboardedRoute><AppShell><DocumentGeneratorPage /></AppShell></OnboardedRoute>} />
          <Route path="/settings" element={<OnboardedRoute><AppShell><SettingsPage /></AppShell></OnboardedRoute>} />
          <Route path="/admin" element={<OnboardedRoute><AppShell><AdminPage /></AppShell></OnboardedRoute>} />
          <Route path="/home" element={<OnboardedRoute><AppShell><HomePage /></AppShell></OnboardedRoute>} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};
