import { useState } from 'react';
import { useRoleGuard } from '@/features/auth/hooks/useRoleGuard';
import { Navigate } from 'react-router-dom';
import { Button, Card, CardHeader, CardTitle, CardContent, CardFooter, Alert } from '@/shared/components';
import { useAdminStats } from '../hooks/useAdminData';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import UserManagement from './UserManagement'; 
import ContentManagement from './ContentManagement'; 

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

type AdminView = 'dashboard' | 'users' | 'content';

const AdminPage = () => {
  const { isAdmin, currentRole } = useRoleGuard();
  const { stats, loading: statsLoading, refetch: refetchStats } = useAdminStats();
  const [currentView, setCurrentView] = useState<AdminView>('dashboard');

  if (!isAdmin()) {
    return <Navigate to="/dashboard" replace />;
  }

  const renderContent = () => {
    switch (currentView) {
      case 'users':
        return <UserManagement />;
      case 'content':
        return <ContentManagement />;
      case 'dashboard':
      default:
        return <AdminDashboard onNavigate={setCurrentView} stats={stats} loading={statsLoading} />;
    }
  };

  return (
    <div className="container mx-auto p-4">
      <header className="mb-8 flex items-center justify-between">
        <h1 className="text-4xl font-bold text-legally-black">Admin Portal</h1>
        <div className="flex items-center space-x-4">
          <span className="text-lg text-legally-neutral-600">Role: <span className="font-semibold text-legally-primary">{currentRole}</span></span>
          <Button 
            variant="outline"
            onClick={() => setCurrentView('dashboard')}
            disabled={currentView === 'dashboard'}
          >
            Dashboard
          </Button>
        </div>
      </header>

      {renderContent()}
    </div>
  );
};

interface AdminDashboardProps {
  onNavigate: (view: AdminView) => void;
  stats: any;
  loading: boolean;
}

const AdminDashboard = ({ onNavigate, stats, loading }: AdminDashboardProps) => {
  const userStatsChartData = {
    labels: ['Total', 'Active', 'Premium', 'Recent Signups'],
    datasets: [{
      label: 'User Statistics',
      data: [stats.totalUsers, stats.activeUsers, stats.premiumUsers, stats.recentSignups],
      backgroundColor: 'rgba(54, 162, 235, 0.5)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1,
    }],
  };

  const contentStatsChartData = {
    labels: ['Documents'],
    datasets: [{
      label: 'Content Statistics',
      data: [stats.totalDocuments],
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
      borderColor: 'rgba(255, 99, 132, 1)',
      borderWidth: 1,
    }],
  };

  if (loading) return <p>Loading stats...</p>;

  return (
    <section className="grid grid-cols-1 gap-8 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-legally-neutral-600">Manage user roles, permissions, and access.</p>
        </CardContent>
        <CardFooter>
          <Button onClick={() => onNavigate('users')}>Manage Users</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Content Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-legally-neutral-600">Manage Launchpad Guides and Compliance Q&A.</p>
        </CardContent>
        <CardFooter>
          <Button onClick={() => onNavigate('content')}>Manage Content</Button>
        </CardFooter>
      </Card>

      <Card className="col-span-1 md:col-span-2">
        <CardHeader>
          <CardTitle>Platform Statistics</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div>
            <h3 className="mb-4 text-lg font-semibold">User Overview</h3>
            <Bar data={userStatsChartData} />
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold">Content Overview</h3>
            <Line data={contentStatsChartData} />
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default AdminPage;
