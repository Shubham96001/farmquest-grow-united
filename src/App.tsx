import React, { useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import LoginForm from './components/LoginForm';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import FarmProfile from './components/FarmProfile';
import QuestsView from './components/QuestsView';
import SubmissionsView from './components/SubmissionsView';
import LeaderboardView from './components/LeaderboardView';
import AdminPanel from './components/AdminPanel';
import { User, UserRole } from './types';
import { userStorage, languageStorage } from './lib/storage';

const queryClient = new QueryClient();

const App = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing user session
    const user = userStorage.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setCurrentPage('dashboard');
  };

  const handleUserUpdate = (updatedUser: User) => {
    setCurrentUser(updatedUser);
  };

  const renderPage = () => {
    if (!currentUser) return null;

    switch (currentPage) {
      case 'dashboard':
        return <Dashboard user={currentUser} onUserUpdate={handleUserUpdate} />;
      
      case 'profile':
        return <FarmProfile user={currentUser} onUserUpdate={handleUserUpdate} />;
      
      case 'quests':
        return <QuestsView user={currentUser} onUserUpdate={handleUserUpdate} />;
      
      case 'leaderboard':
        return <LeaderboardView user={currentUser} />;
      
      case 'submissions':
        return <SubmissionsView user={currentUser} />;
      
      case 'manage-quests':
      case 'users':
      case 'analytics':
        return <AdminPanel user={currentUser} currentView={currentPage} />;
      
      case 'community':
      case 'farmers':
      case 'learn':
        return <Dashboard user={currentUser} onUserUpdate={handleUserUpdate} />;
      
      default:
        return <Dashboard user={currentUser} onUserUpdate={handleUserUpdate} />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-earth flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading AgriQuest...</p>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {!currentUser ? (
          <LoginForm onLogin={handleLogin} />
        ) : (
          <Layout 
            currentPage={currentPage} 
            onPageChange={setCurrentPage}
            userRole={currentUser.role}
          >
            {renderPage()}
          </Layout>
        )}
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
