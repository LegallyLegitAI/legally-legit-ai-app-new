import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { MarketingPage, AboutPage } from '@/features/marketing';
import { DashboardPage, HomePage } from '@/features/dashboard';
import { DocumentGeneratorPage } from '@/features/document';
import { OnboardingPage } from '@/features/onboarding';
import { SettingsPage } from '@/features/settings';
import { AdminPage } from '@/features/admin';
import { AppShell } from '@/shared/components';

export const App = () => {
  return (
    <Router>
      <Routes>
        {/* Marketing page without AppShell */}
        <Route path="/" element={<MarketingPage />} />
        
        {/* App pages with AppShell */}
        <Route path="/dashboard" element={<AppShell><DashboardPage /></AppShell>} />
        <Route path="/generator" element={<AppShell><DocumentGeneratorPage /></AppShell>} />
        <Route path="/onboarding" element={<AppShell><OnboardingPage /></AppShell>} />
        <Route path="/settings" element={<AppShell><SettingsPage /></AppShell>} />
        <Route path="/admin" element={<AppShell><AdminPage /></AppShell>} />
        <Route path="/about" element={<AppShell><AboutPage /></AppShell>} />
        <Route path="/home" element={<AppShell><HomePage /></AppShell>} />
      </Routes>
    </Router>
  );
};
