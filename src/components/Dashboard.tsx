import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { User, Quest, Language } from '@/types';
import { questStorage, submissionStorage, userStorage, languageStorage } from '@/lib/storage';
import { 
  Trophy, 
  Target, 
  Award, 
  TrendingUp, 
  Users, 
  CheckCircle,
  Clock,
  Leaf,
  Droplets,
  Sun
} from 'lucide-react';

interface DashboardProps {
  user: User;
  onUserUpdate: (user: User) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onUserUpdate }) => {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [language, setLanguage] = useState<Language>('en');
  const [stats, setStats] = useState({
    totalFarmers: 0,
    totalSubmissions: 0,
    completedQuests: 0,
    avgSustainabilityScore: 0
  });

  useEffect(() => {
    const allQuests = questStorage.getAllQuests();
    const userQuests = allQuests.filter(quest => 
      user.role === 'farmer' ? quest.status === 'active' : true
    );
    setQuests(userQuests.slice(0, 3)); // Show top 3 quests

    const savedLanguage = languageStorage.getLanguage();
    setLanguage(savedLanguage);

    // Calculate stats for non-farmer roles
    if (user.role !== 'farmer') {
      const allUsers = userStorage.getAllUsers();
      const farmers = allUsers.filter(u => u.role === 'farmer');
      const submissions = submissionStorage.getAllSubmissions();
      
      setStats({
        totalFarmers: farmers.length,
        totalSubmissions: submissions.length,
        completedQuests: farmers.reduce((sum, f) => sum + f.completedQuests, 0),
        avgSustainabilityScore: farmers.length > 0 
          ? Math.round(farmers.reduce((sum, f) => sum + f.sustainabilityScore, 0) / farmers.length)
          : 0
      });
    }
  }, [user.role]);

  const getQuestTitle = (quest: Quest) => {
    return quest.title[language] || quest.title.en;
  };

  const getQuestDescription = (quest: Quest) => {
    return quest.description[language] || quest.description.en;
  };

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
    languageStorage.setLanguage(newLanguage);
  };

  const renderFarmerDashboard = () => (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Welcome Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          स्वागत है, {user.name}! 🌱
        </h1>
        <p className="text-muted-foreground">Ready to make your farm more sustainable today?</p>
        
        {/* Language Selector */}
        <div className="flex justify-center gap-2 mt-4">
          <Button 
            variant={language === 'en' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => handleLanguageChange('en')}
          >
            English
          </Button>
          <Button 
            variant={language === 'hi' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => handleLanguageChange('hi')}
          >
            हिंदी
          </Button>
          <Button 
            variant={language === 'ml' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => handleLanguageChange('ml')}
          >
            മലയാളം
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="shadow-soft">
          <CardContent className="p-4 text-center">
            <Trophy className="h-8 w-8 text-warning mx-auto mb-2" />
            <div className="text-2xl font-bold text-success">{user.sustainabilityScore}</div>
            <div className="text-sm text-muted-foreground">Sustainability Score</div>
          </CardContent>
        </Card>
        
        <Card className="shadow-soft">
          <CardContent className="p-4 text-center">
            <Award className="h-8 w-8 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold text-primary">{user.badges.length}</div>
            <div className="text-sm text-muted-foreground">Badges Earned</div>
          </CardContent>
        </Card>
        
        <Card className="shadow-soft">
          <CardContent className="p-4 text-center">
            <Target className="h-8 w-8 text-accent-foreground mx-auto mb-2" />
            <div className="text-2xl font-bold text-accent-foreground">{user.activeQuests}</div>
            <div className="text-sm text-muted-foreground">Active Quests</div>
          </CardContent>
        </Card>
        
        <Card className="shadow-soft">
          <CardContent className="p-4 text-center">
            <CheckCircle className="h-8 w-8 text-success mx-auto mb-2" />
            <div className="text-2xl font-bold text-success">{user.completedQuests}</div>
            <div className="text-sm text-muted-foreground">Completed</div>
          </CardContent>
        </Card>
      </div>

      {/* Active Quests */}
      <Card className="shadow-quest">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Active Quests
          </CardTitle>
          <CardDescription>Complete these challenges to earn points and badges</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {quests.map((quest) => (
            <div key={quest.id} className="p-4 border border-border rounded-lg hover:shadow-soft transition-all">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">{getQuestTitle(quest)}</h3>
                <Badge variant="secondary" className="bg-gradient-quest">
                  {quest.points} pts
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                {getQuestDescription(quest)}
              </p>
              <div className="flex items-center justify-between">
                <Badge variant="outline">{quest.category}</Badge>
                <Button size="sm" className="bg-gradient-primary">
                  Start Quest
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-warning" />
            Recent Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <Leaf className="h-8 w-8 text-success" />
              <div>
                <p className="font-medium">Organic Starter</p>
                <p className="text-sm text-muted-foreground">First organic quest completed</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg opacity-60">
              <Droplets className="h-8 w-8 text-muted-foreground" />
              <div>
                <p className="font-medium">Water Saver</p>
                <p className="text-sm text-muted-foreground">Reduce water usage by 30%</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg opacity-60">
              <Sun className="h-8 w-8 text-muted-foreground" />
              <div>
                <p className="font-medium">Solar Pioneer</p>
                <p className="text-sm text-muted-foreground">Install renewable energy</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderOtherRoleDashboard = () => (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          Welcome, {user.name}
        </h1>
        <p className="text-muted-foreground capitalize">
          {user.role.toUpperCase()} Dashboard
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="shadow-soft">
          <CardContent className="p-4 text-center">
            <Users className="h-8 w-8 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold text-primary">{stats.totalFarmers}</div>
            <div className="text-sm text-muted-foreground">Total Farmers</div>
          </CardContent>
        </Card>
        
        <Card className="shadow-soft">
          <CardContent className="p-4 text-center">
            <Target className="h-8 w-8 text-accent-foreground mx-auto mb-2" />
            <div className="text-2xl font-bold text-accent-foreground">{stats.totalSubmissions}</div>
            <div className="text-sm text-muted-foreground">Submissions</div>
          </CardContent>
        </Card>
        
        <Card className="shadow-soft">
          <CardContent className="p-4 text-center">
            <CheckCircle className="h-8 w-8 text-success mx-auto mb-2" />
            <div className="text-2xl font-bold text-success">{stats.completedQuests}</div>
            <div className="text-sm text-muted-foreground">Completed Quests</div>
          </CardContent>
        </Card>
        
        <Card className="shadow-soft">
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-8 w-8 text-warning mx-auto mb-2" />
            <div className="text-2xl font-bold text-warning">{stats.avgSustainabilityScore}</div>
            <div className="text-sm text-muted-foreground">Avg Score</div>
          </CardContent>
        </Card>
      </div>

      {/* Role-specific content */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>
            {user.role === 'aeo' && 'Extension Officer Tools'}
            {user.role === 'admin' && 'Administrative Overview'}
            {user.role === 'ngo' && 'Community Impact'}
            {user.role === 'student' && 'Learning Resources'}
          </CardTitle>
          <CardDescription>
            {user.role === 'aeo' && 'Review farmer submissions and approve sustainable practices'}
            {user.role === 'admin' && 'Manage platform content and monitor user activity'}
            {user.role === 'ngo' && 'Track community progress and support initiatives'}
            {user.role === 'student' && 'Explore sustainable agriculture practices and research'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <div className="text-muted-foreground">
              {user.role === 'aeo' && 'Use the navigation to review pending submissions from farmers in your region.'}
              {user.role === 'admin' && 'Access quest management, user analytics, and system settings from the sidebar.'}
              {user.role === 'ngo' && 'Monitor farmer progress and community sustainability metrics.'}
              {user.role === 'student' && 'Learn about sustainable farming practices and view community achievements.'}
            </div>
            
            <div className="flex justify-center gap-4">
              {user.role === 'aeo' && (
                <Button className="bg-gradient-primary">
                  <Clock className="h-4 w-4 mr-2" />
                  Pending Reviews: {stats.totalSubmissions}
                </Button>
              )}
              {user.role === 'admin' && (
                <Button className="bg-gradient-primary">
                  <Target className="h-4 w-4 mr-2" />
                  Manage Quests
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return user.role === 'farmer' ? renderFarmerDashboard() : renderOtherRoleDashboard();
};

export default Dashboard;