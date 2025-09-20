import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  User, 
  Trophy, 
  Settings, 
  LogOut,
  Shield,
  Users,
  BookOpen,
  Plus
} from 'lucide-react';
import { UserRole } from '@/types';
import { userStorage } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
  userRole: UserRole;
}

const Layout: React.FC<LayoutProps> = ({ children, currentPage, onPageChange, userRole }) => {
  const { toast } = useToast();

  const handleLogout = () => {
    userStorage.logout();
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account."
    });
    // Force reload to show login screen
    window.location.reload();
  };

  const getNavigationItems = () => {
    const commonItems = [
      { id: 'dashboard', label: 'Dashboard', icon: Home }
    ];

    switch (userRole) {
      case 'farmer':
        return [
          ...commonItems,
          { id: 'profile', label: 'Farm Profile', icon: User },
          { id: 'quests', label: 'My Quests', icon: Trophy },
          { id: 'leaderboard', label: 'Leaderboard', icon: Trophy }
        ];
      
      case 'aeo':
        return [
          ...commonItems,
          { id: 'submissions', label: 'Review Submissions', icon: Shield },
          { id: 'farmers', label: 'Farmers', icon: Users }
        ];
      
      case 'admin':
        return [
          ...commonItems,
          { id: 'manage-quests', label: 'Manage Quests', icon: Plus },
          { id: 'users', label: 'All Users', icon: Users },
          { id: 'analytics', label: 'Analytics', icon: Settings }
        ];
      
      case 'ngo':
      case 'student':
        return [
          ...commonItems,
          { id: 'community', label: 'Community', icon: Users },
          { id: 'learn', label: 'Learn', icon: BookOpen }
        ];
      
      default:
        return commonItems;
    }
  };

  const navigationItems = getNavigationItems();

  return (
    <div className="min-h-screen bg-gradient-earth">
      {/* Mobile-first bottom navigation */}
      <div className="pb-16 md:pb-0">
        {children}
      </div>

      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border md:hidden z-50">
        <div className="flex items-center justify-around py-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <Button
                key={item.id}
                variant="ghost"
                size="sm"
                className={`flex flex-col items-center gap-1 p-2 h-auto ${
                  isActive ? 'text-primary' : 'text-muted-foreground'
                }`}
                onClick={() => onPageChange(item.id)}
              >
                <Icon className="h-4 w-4" />
                <span className="text-xs">{item.label}</span>
              </Button>
            );
          })}
          
          <Button
            variant="ghost"
            size="sm"
            className="flex flex-col items-center gap-1 p-2 h-auto text-muted-foreground"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            <span className="text-xs">Logout</span>
          </Button>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:fixed md:left-0 md:top-0 md:h-full md:w-64 md:bg-card md:border-r md:border-border md:flex md:flex-col md:z-40">
        <div className="p-6">
          <h1 className="text-xl font-bold text-primary">🌱 AgriQuest</h1>
          <p className="text-sm text-muted-foreground capitalize">{userRole} Dashboard</p>
        </div>
        
        <nav className="flex-1 px-4">
          <div className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              
              return (
                <Button
                  key={item.id}
                  variant={isActive ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => onPageChange(item.id)}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {item.label}
                </Button>
              );
            })}
          </div>
        </nav>
        
        <div className="p-4 border-t border-border">
          <Button
            variant="ghost"
            className="w-full justify-start text-muted-foreground"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Desktop main content area */}
      <div className="hidden md:block md:ml-64">
        {children}
      </div>
    </div>
  );
};

export default Layout;