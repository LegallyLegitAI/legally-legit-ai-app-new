import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { Button } from '../ui/Button';

interface AppShellProps {
  children: React.ReactNode;
}

const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: '📊' },
    { name: 'Documents', href: '/documents', icon: '📄' },
    { name: 'Generator', href: '/generator', icon: '⚙️' },
    { name: 'Settings', href: '/settings', icon: '⚙️' },
    { name: 'About', href: '/about', icon: 'ℹ️' },
  ];

  const isCurrentPath = (href: string) => {
    return location.pathname === href;
  };

  return (
    <div className="flex h-screen bg-legally-neutral-50">
      {/* Sidebar */}
      <aside className={cn(
        'fixed inset-y-0 left-0 z-50 w-64 transform bg-white shadow-lg transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 shrink-0 items-center border-b border-legally-neutral-200 px-6">
            <h1 className="text-xl font-bold text-prevent-600">Legally Legit AI</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-4 py-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isCurrentPath(item.href)
                    ? 'bg-prevent-100 text-prevent-700'
                    : 'text-legally-neutral-700 hover:bg-legally-neutral-100 hover:text-legally-neutral-900'
                )}
                onClick={() => setSidebarOpen(false)}
              >
                <span className="mr-3 text-lg" role="img" aria-label={item.name}>
                  {item.icon}
                </span>
                {item.name}
              </Link>
            ))}
          </nav>

          {/* User Profile */}
          <div className="border-t border-legally-neutral-200 p-4">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-full bg-prevent-100 flex items-center justify-center">
                <span className="text-sm font-medium text-prevent-700">U</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-legally-neutral-900">User</p>
                <p className="text-xs text-legally-neutral-500">user@example.com</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-25 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex flex-1 flex-col lg:pl-0">
        {/* Top bar */}
        <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center border-b border-legally-neutral-200 bg-white px-4 shadow-sm lg:px-6">
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <span className="sr-only">Open sidebar</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </Button>

          <div className="flex flex-1 justify-between px-4 lg:px-0">
            <div className="flex flex-1">
              {/* Search could go here */}
            </div>
            <div className="ml-4 flex items-center md:ml-6 space-x-4">
              <Button variant="ghost" size="sm" aria-label="Notifications">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM15 17H9a6 6 0 01-6-6V7a6 6 0 016-6h6a6 6 0 016 6v4z" />
                </svg>
              </Button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <div className="px-4 py-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppShell;
