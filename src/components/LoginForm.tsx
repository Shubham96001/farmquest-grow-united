import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, UserRole } from '@/types';
import { userStorage, initializeDefaultData } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';
import { Sprout, Users, Shield, Settings, BookOpen } from 'lucide-react';
import heroImage from '@/assets/hero-farming.jpg';

interface LoginFormProps {
  onLogin: (user: User) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Initialize default data on component mount
  React.useEffect(() => {
    initializeDefaultData();
  }, []);

  const handleDemoLogin = (role: UserRole) => {
    setIsLoading(true);
    
    setTimeout(() => {
      const demoUser: User = {
        id: `demo-${role}-${Date.now()}`,
        name: getDemoUserName(role),
        email: `${role}@demo.com`,
        role,
        location: 'Kerala, India',
        sustainabilityScore: role === 'farmer' ? 785 : 0,
        level: getDemoUserLevel(role),
        badges: [],
        completedQuests: role === 'farmer' ? 28 : 0,
        activeQuests: role === 'farmer' ? 3 : 0,
        joinedDate: new Date().toISOString().split('T')[0]
      };

      userStorage.setCurrentUser(demoUser);
      toast({
        title: "Welcome!",
        description: `Logged in as ${role.toUpperCase()}`
      });
      onLogin(demoUser);
      setIsLoading(false);
    }, 1000);
  };

  const getDemoUserName = (role: UserRole): string => {
    const names = {
      farmer: 'राज पटेल',
      aeo: 'Dr. प्रिया शर्मा',
      ngo: 'Green Earth NGO',
      admin: 'System Admin',
      student: 'अनिल कुमार'
    };
    return names[role];
  };

  const getDemoUserLevel = (role: UserRole): string => {
    const levels = {
      farmer: 'Eco Warrior',
      aeo: 'Extension Officer',
      ngo: 'Community Partner',
      admin: 'System Administrator',
      student: 'Learning Enthusiast'
    };
    return levels[role];
  };

  const getRoleIcon = (role: UserRole) => {
    const icons = {
      farmer: Sprout,
      aeo: Shield,
      ngo: Users,
      admin: Settings,
      student: BookOpen
    };
    return icons[role];
  };

  const getRoleDescription = (role: UserRole): string => {
    const descriptions = {
      farmer: 'Complete quests, earn points, and adopt sustainable practices',
      aeo: 'Review farmer submissions and approve sustainable practices',
      ngo: 'Monitor community progress and support farmers',
      admin: 'Manage quests, users, and platform settings',
      student: 'Learn about sustainable agriculture and community progress'
    };
    return descriptions[role];
  };

  return (
    <div className="min-h-screen bg-gradient-earth flex items-center justify-center p-4">
      {/* Background Hero Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      
      <Card className="w-full max-w-4xl shadow-quest bg-card/95 backdrop-blur-sm relative z-10">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-primary flex items-center justify-center gap-2">
            🌱 AgriQuest
          </CardTitle>
          <CardDescription className="text-lg">
            Gamified Platform for Sustainable Agriculture
          </CardDescription>
          <p className="text-sm text-muted-foreground mt-2">
            स्वस्थ खेती, स्वस्थ भविष्य • Sustainable Farming Made Gameful
          </p>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="demo" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="demo">Demo Login</TabsTrigger>
              <TabsTrigger value="register">Quick Register</TabsTrigger>
            </TabsList>
            
            <TabsContent value="demo" className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold mb-2">Choose Your Role</h3>
                <p className="text-sm text-muted-foreground">
                  Select a role to explore the platform features
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {((['farmer', 'aeo', 'ngo', 'admin', 'student'] as UserRole[])).map((role) => {
                  const Icon = getRoleIcon(role);
                  
                  return (
                    <Card 
                      key={role} 
                      className="cursor-pointer hover:shadow-quest transition-all duration-300 hover:scale-105"
                      onClick={() => handleDemoLogin(role)}
                    >
                      <CardContent className="p-6 text-center space-y-4">
                        <Icon className="h-12 w-12 mx-auto text-primary" />
                        <h4 className="font-semibold capitalize text-lg">{role}</h4>
                        <p className="text-sm text-muted-foreground">
                          {getRoleDescription(role)}
                        </p>
                        <Button 
                          className="w-full bg-gradient-primary" 
                          disabled={isLoading}
                        >
                          {isLoading ? 'Loading...' : `Login as ${role.toUpperCase()}`}
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
            
            <TabsContent value="register" className="space-y-6">
              <RegisterForm onRegister={onLogin} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

const RegisterForm: React.FC<{ onRegister: (user: User) => void }> = ({ onRegister }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '' as UserRole,
    location: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.role || !formData.location) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const newUser: User = {
        id: `user-${Date.now()}`,
        name: formData.name,
        email: formData.email,
        role: formData.role,
        location: formData.location,
        sustainabilityScore: 0,
        level: 'Beginner',
        badges: [],
        completedQuests: 0,
        activeQuests: 0,
        joinedDate: new Date().toISOString().split('T')[0]
      };

      userStorage.addUser(newUser);
      userStorage.setCurrentUser(newUser);
      
      toast({
        title: "Account Created!",
        description: "Welcome to AgriQuest platform"
      });
      
      onRegister(newUser);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            placeholder="Enter your name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="role">Role</Label>
          <Select value={formData.role} onValueChange={(value) => setFormData(prev => ({ ...prev, role: value as UserRole }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select your role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="farmer">Farmer</SelectItem>
              <SelectItem value="aeo">Agricultural Extension Officer</SelectItem>
              <SelectItem value="ngo">NGO Representative</SelectItem>
              <SelectItem value="student">Student</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            placeholder="City, State"
            value={formData.location}
            onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
          />
        </div>
      </div>
      
      <Button type="submit" className="w-full bg-gradient-primary" disabled={isLoading}>
        {isLoading ? 'Creating Account...' : 'Create Account'}
      </Button>
    </form>
  );
};

export default LoginForm;