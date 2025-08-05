import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import DocumentGenerator from './pages/DocumentGenerator';
import About from './pages/About';
import AppShell from './components/layout/AppShell';
import Dashboard from './pages/DashboardFixed';
import Onboarding from './pages/Onboarding';
import Settings from './pages/Settings';
import Admin from './pages/AdminFixed';
import Marketing from './pages/Marketing';

function App() {
  return (
    <Router>
      <Routes>
        {/* Marketing page without AppShell */}
        <Route path="/" element={<Marketing />} />
        
        {/* App pages with AppShell */}
        <Route path="/dashboard" element={<AppShell><Dashboard /></AppShell>} />
        <Route path="/generator" element={<AppShell><DocumentGenerator /></AppShell>} />
        <Route path="/onboarding" element={<AppShell><Onboarding /></AppShell>} />
        <Route path="/settings" element={<AppShell><Settings /></AppShell>} />
        <Route path="/admin" element={<AppShell><Admin /></AppShell>} />
        <Route path="/about" element={<AppShell><About /></AppShell>} />
        <Route path="/home" element={<AppShell><Home /></AppShell>} />
      </Routes>
    </Router>
  );
}

export default App;
