import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Sprout, 
  Trophy, 
  Users, 
  Target, 
  Camera, 
  MapPin, 
  Award,
  TrendingUp,
  Leaf,
  Sun,
  Droplets,
  Settings
} from 'lucide-react';
import heroImage from '@/assets/hero-farming.jpg';

// Mock data - will be replaced with Supabase data
const mockUser = {
  name: "राज पटेल",
  role: "Farmer",
  sustainabilityScore: 785,
  level: "Eco Warrior",
  badges: 12,
  activeQuests: 3,
  completedQuests: 28,
  rank: 5,
  location: "Kerala, India"
};

const mockQuests = [
  {
    id: 1,
    title: "Apply Organic Compost",
    titleHindi: "जैविक खाद का प्रयोग करें",
    titleMalayalam: "ജൈവവളം പ്രയോഗിക്കുക",
    description: "Apply homemade compost to your vegetable plot",
    points: 150,
    difficulty: "Easy",
    deadline: "3 days left",
    progress: 60,
    category: "Soil Health"
  },
  {
    id: 2,
    title: "Water Conservation Practice",
    titleHindi: "जल संरक्षण अभ्यास",
    titleMalayalam: "ജലസംരക്ഷണ പരിശീലനം",
    description: "Implement drip irrigation system",
    points: 300,
    difficulty: "Medium",
    deadline: "1 week left",
    progress: 20,
    category: "Water Management"
  },
  {
    id: 3,
    title: "Crop Rotation Setup",
    titleHindi: "फसल चक्रीकरण",
    titleMalayalam: "വിള ഭ്രമണം",
    description: "Plan next season's crop rotation",
    points: 200,
    difficulty: "Medium",
    deadline: "2 weeks left",
    progress: 80,
    category: "Sustainable Practices"
  }
];

const mockLeaderboard = [
  { name: "अनिल शर्मा", score: 1250, badge: "🏆", rank: 1, location: "Punjab" },
  { name: "प्रिया देवी", score: 1180, badge: "🥈", rank: 2, location: "Haryana" },
  { name: "कमल सिंह", score: 980, badge: "🥉", rank: 3, location: "Rajasthan" },
  { name: "सुनीता पटेल", score: 850, badge: "🌱", rank: 4, location: "Gujarat" },
  { name: "राज पटेल", score: 785, badge: "🌿", rank: 5, location: "Kerala" }
];

const Index = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'hi' | 'ml'>('en');
  const [userRole, setUserRole] = useState<'farmer' | 'aeo' | 'ngo' | 'admin' | 'student'>('farmer');

  const getQuestTitle = (quest: any) => {
    switch(selectedLanguage) {
      case 'hi': return quest.titleHindi;
      case 'ml': return quest.titleMalayalam;
      default: return quest.title;
    }
  };

  // Role selection component - will be replaced with actual auth
  const RoleSelector = () => (
    <div className="fixed top-4 right-4 z-50">
      <select 
        value={userRole} 
        onChange={(e) => setUserRole(e.target.value as any)}
        className="bg-card border border-border rounded-lg px-3 py-2 text-sm"
      >
        <option value="farmer">Farmer</option>
        <option value="aeo">AEO</option>
        <option value="ngo">NGO</option>
        <option value="admin">Admin</option>
        <option value="student">Student</option>
      </select>
    </div>
  );

  // Language selector
  const LanguageSelector = () => (
    <div className="flex gap-2 mb-6">
      <Button 
        variant={selectedLanguage === 'en' ? 'default' : 'outline'} 
        size="sm"
        onClick={() => setSelectedLanguage('en')}
      >
        English
      </Button>
      <Button 
        variant={selectedLanguage === 'hi' ? 'default' : 'outline'} 
        size="sm"
        onClick={() => setSelectedLanguage('hi')}
      >
        हिंदी
      </Button>
      <Button 
        variant={selectedLanguage === 'ml' ? 'default' : 'outline'} 
        size="sm"
        onClick={() => setSelectedLanguage('ml')}
      >
        മലയാളം
      </Button>
    </div>
  );

  // Connect to Supabase prompt
  const ConnectPrompt = () => (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-40">
      <Card className="max-w-md mx-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Connect to Supabase
          </CardTitle>
          <CardDescription>
            To enable all features like authentication, data storage, and real-time sync, 
            connect your project to Supabase.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="w-full bg-gradient-primary text-primary-foreground">
            Connect Supabase
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  if (userRole === 'farmer') {
    return (
      <div className="min-h-screen bg-gradient-earth">
        <RoleSelector />
        
        {/* Hero Section */}
        <div className="relative h-64 bg-cover bg-center" style={{ backgroundImage: `url(${heroImage})` }}>
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/40" />
          <div className="relative h-full flex items-center justify-center text-center text-primary-foreground p-6">
            <div className="animate-fade-in">
              <h1 className="text-3xl font-bold mb-2">स्वस्थ खेती, स्वस्थ भविष्य</h1>
              <p className="text-lg opacity-90">Sustainable Agriculture Made Gameful</p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6 -mt-8">
          <LanguageSelector />
          
          {/* User Stats Card */}
          <Card className="mb-6 shadow-soft animate-scale-in">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-foreground">{mockUser.name}</h2>
                  <p className="text-muted-foreground">{mockUser.location}</p>
                </div>
                <Badge variant="secondary" className="bg-gradient-achievement text-warning-foreground">
                  {mockUser.level}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-success">{mockUser.sustainabilityScore}</div>
                  <div className="text-sm text-muted-foreground">Sustainability Score</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-warning">{mockUser.badges}</div>
                  <div className="text-sm text-muted-foreground">Badges Earned</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent-foreground">{mockUser.activeQuests}</div>
                  <div className="text-sm text-muted-foreground">Active Quests</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">#{mockUser.rank}</div>
                  <div className="text-sm text-muted-foreground">Local Rank</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="quests" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="quests" className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                Active Quests
              </TabsTrigger>
              <TabsTrigger value="leaderboard" className="flex items-center gap-2">
                <Trophy className="h-4 w-4" />
                Leaderboard
              </TabsTrigger>
              <TabsTrigger value="achievements" className="flex items-center gap-2">
                <Award className="h-4 w-4" />
                Achievements
              </TabsTrigger>
            </TabsList>

            <TabsContent value="quests" className="space-y-4">
              {mockQuests.map((quest) => (
                <Card key={quest.id} className="shadow-quest hover:shadow-achievement transition-all duration-300 animate-quest-pulse">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{getQuestTitle(quest)}</CardTitle>
                        <CardDescription>{quest.description}</CardDescription>
                      </div>
                      <Badge variant="outline" className="bg-gradient-quest border-accent text-accent-foreground">
                        {quest.points} pts
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{quest.category}</span>
                        <span className="text-warning font-medium">{quest.deadline}</span>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{quest.progress}%</span>
                        </div>
                        <Progress value={quest.progress} className="h-2" />
                      </div>
                      
                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1 bg-gradient-primary">
                          <Camera className="h-4 w-4 mr-2" />
                          Upload Photo
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <MapPin className="h-4 w-4 mr-2" />
                          Add Location
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="leaderboard" className="space-y-4">
              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-warning" />
                    Local Leaderboard - Kerala Region
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockLeaderboard.map((farmer, index) => (
                      <div 
                        key={index} 
                        className={`flex items-center justify-between p-3 rounded-lg transition-all ${
                          farmer.rank === mockUser.rank ? 'bg-gradient-achievement animate-achievement-glow' : 'bg-muted/50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{farmer.badge}</span>
                          <div>
                            <div className="font-medium">{farmer.name}</div>
                            <div className="text-sm text-muted-foreground">{farmer.location}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-success">{farmer.score}</div>
                          <div className="text-sm text-muted-foreground">points</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="achievements" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="shadow-soft">
                  <CardContent className="p-6 text-center">
                    <Leaf className="h-12 w-12 text-success mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Organic Champion</h3>
                    <p className="text-sm text-muted-foreground">Completed 10 organic farming quests</p>
                    <Badge className="mt-2 bg-gradient-achievement">Earned</Badge>
                  </CardContent>
                </Card>
                
                <Card className="shadow-soft">
                  <CardContent className="p-6 text-center">
                    <Droplets className="h-12 w-12 text-primary mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Water Saver</h3>
                    <p className="text-sm text-muted-foreground">Reduced water usage by 30%</p>
                    <Badge className="mt-2 bg-gradient-achievement">Earned</Badge>
                  </CardContent>
                </Card>
                
                <Card className="shadow-soft opacity-60">
                  <CardContent className="p-6 text-center">
                    <Sun className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Solar Pioneer</h3>
                    <p className="text-sm text-muted-foreground">Install renewable energy system</p>
                    <Badge variant="outline" className="mt-2">Locked</Badge>
                  </CardContent>
                </Card>
                
                <Card className="shadow-soft opacity-60">
                  <CardContent className="p-6 text-center">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Community Leader</h3>
                    <p className="text-sm text-muted-foreground">Help 5 other farmers complete quests</p>
                    <Badge variant="outline" className="mt-2">Locked</Badge>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <ConnectPrompt />
      </div>
    );
  }

  // Other role views would go here (AEO, NGO, Admin, Student)
  return (
    <div className="min-h-screen bg-gradient-earth flex items-center justify-center p-4">
      <RoleSelector />
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle>Role: {userRole.toUpperCase()}</CardTitle>
          <CardDescription>
            {userRole === 'aeo' && 'Agricultural Extension Officer Dashboard - Review submissions and approve farmer activities'}
            {userRole === 'ngo' && 'NGO Dashboard - View community progress and farmer statistics'}
            {userRole === 'admin' && 'Admin Dashboard - Manage quests, users, and system settings'}
            {userRole === 'student' && 'Student Dashboard - Learn about sustainable agriculture practices'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Connect to Supabase to enable {userRole} functionality including data management, 
            user authentication, and role-based access controls.
          </p>
          <Button className="w-full bg-gradient-primary">
            Connect Supabase to Continue
          </Button>
        </CardContent>
      </Card>
      <ConnectPrompt />
    </div>
  );
};

export default Index;
