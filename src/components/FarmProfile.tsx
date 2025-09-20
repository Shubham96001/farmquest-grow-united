import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { FarmProfile as FarmProfileType, User } from '@/types';
import { userStorage } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';
import { MapPin, Droplets, Sprout, DollarSign, Calendar } from 'lucide-react';

interface FarmProfileProps {
  user: User;
  onUserUpdate: (user: User) => void;
}

const FarmProfile: React.FC<FarmProfileProps> = ({ user, onUserUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<FarmProfileType>({
    farmSize: 0,
    cropType: [],
    fertilizers: [],
    irrigationType: '',
    budget: 0,
    location: {
      state: '',
      district: '',
      coordinates: { lat: 0, lng: 0 }
    },
    soilType: '',
    farmingExperience: 0
  });
  const { toast } = useToast();

  useEffect(() => {
    if (user.farmProfile) {
      setFormData(user.farmProfile);
    }
  }, [user.farmProfile]);

  const cropOptions = [
    'Rice', 'Wheat', 'Corn', 'Sugarcane', 'Cotton', 'Soybean',
    'Potato', 'Tomato', 'Onion', 'Banana', 'Mango', 'Coconut',
    'Tea', 'Coffee', 'Spices', 'Vegetables', 'Pulses'
  ];

  const fertilizerOptions = [
    'Organic Compost', 'Vermicompost', 'Green Manure', 'Biofertilizers',
    'NPK Chemical', 'Urea', 'Phosphate', 'Potash', 'Micronutrients'
  ];

  const irrigationOptions = [
    'Drip Irrigation', 'Sprinkler', 'Flood Irrigation', 'Rainwater Harvesting',
    'Bore Well', 'Canal Water', 'Micro Irrigation'
  ];

  const soilOptions = [
    'Alluvial', 'Black Cotton', 'Red', 'Laterite', 'Desert', 'Mountain', 'Coastal'
  ];

  const handleCropChange = (crop: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      cropType: checked 
        ? [...prev.cropType, crop]
        : prev.cropType.filter(c => c !== crop)
    }));
  };

  const handleFertilizerChange = (fertilizer: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      fertilizers: checked 
        ? [...prev.fertilizers, fertilizer]
        : prev.fertilizers.filter(f => f !== fertilizer)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.location.state || !formData.location.district) {
      toast({
        title: "Error",
        description: "Please fill in location details",
        variant: "destructive"
      });
      return;
    }

    const updatedUser = {
      ...user,
      farmProfile: formData
    };

    userStorage.updateUser(user.id, { farmProfile: formData });
    onUserUpdate(updatedUser);
    setIsEditing(false);
    
    toast({
      title: "Profile Updated",
      description: "Your farm profile has been saved successfully"
    });
  };

  if (!isEditing && !user.farmProfile) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Card className="max-w-2xl mx-auto shadow-soft">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Sprout className="h-6 w-6 text-primary" />
              Setup Your Farm Profile
            </CardTitle>
            <CardDescription>
              Tell us about your farm to get personalized quests and recommendations
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              Creating your farm profile helps us customize quests based on your crop type, 
              farm size, and location for better sustainable farming practices.
            </p>
            <Button 
              onClick={() => setIsEditing(true)}
              className="bg-gradient-primary"
            >
              Create Farm Profile
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Card className="max-w-4xl mx-auto shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sprout className="h-6 w-6 text-primary" />
              {user.farmProfile ? 'Edit Farm Profile' : 'Create Farm Profile'}
            </CardTitle>
            <CardDescription>
              Provide details about your farm for personalized quest recommendations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Farm Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="farmSize">Farm Size (Acres)</Label>
                  <Input
                    id="farmSize"
                    type="number"
                    value={formData.farmSize}
                    onChange={(e) => setFormData(prev => ({ ...prev, farmSize: Number(e.target.value) }))}
                    placeholder="Enter farm size"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="experience">Farming Experience (Years)</Label>
                  <Input
                    id="experience"
                    type="number"
                    value={formData.farmingExperience}
                    onChange={(e) => setFormData(prev => ({ ...prev, farmingExperience: Number(e.target.value) }))}
                    placeholder="Years of experience"
                  />
                </div>
              </div>

              {/* Location */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Location
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={formData.location.state}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        location: { ...prev.location, state: e.target.value }
                      }))}
                      placeholder="Enter state"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="district">District</Label>
                    <Input
                      id="district"
                      value={formData.location.district}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        location: { ...prev.location, district: e.target.value }
                      }))}
                      placeholder="Enter district"
                    />
                  </div>
                </div>
              </div>

              {/* Crop Types */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Crop Types</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {cropOptions.map((crop) => (
                    <div key={crop} className="flex items-center space-x-2">
                      <Checkbox
                        id={crop}
                        checked={formData.cropType.includes(crop)}
                        onCheckedChange={(checked) => handleCropChange(crop, checked as boolean)}
                      />
                      <Label htmlFor={crop} className="text-sm">{crop}</Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fertilizers */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Current Fertilizer Usage</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {fertilizerOptions.map((fertilizer) => (
                    <div key={fertilizer} className="flex items-center space-x-2">
                      <Checkbox
                        id={fertilizer}
                        checked={formData.fertilizers.includes(fertilizer)}
                        onCheckedChange={(checked) => handleFertilizerChange(fertilizer, checked as boolean)}
                      />
                      <Label htmlFor={fertilizer} className="text-sm">{fertilizer}</Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Additional Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="irrigation">Irrigation Type</Label>
                  <Select value={formData.irrigationType} onValueChange={(value) => setFormData(prev => ({ ...prev, irrigationType: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select irrigation type" />
                    </SelectTrigger>
                    <SelectContent>
                      {irrigationOptions.map((option) => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="soilType">Soil Type</Label>
                  <Select value={formData.soilType} onValueChange={(value) => setFormData(prev => ({ ...prev, soilType: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select soil type" />
                    </SelectTrigger>
                    <SelectContent>
                      {soilOptions.map((option) => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="budget">Annual Farming Budget (₹)</Label>
                <Input
                  id="budget"
                  type="number"
                  value={formData.budget}
                  onChange={(e) => setFormData(prev => ({ ...prev, budget: Number(e.target.value) }))}
                  placeholder="Enter annual budget"
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit" className="bg-gradient-primary">
                  Save Profile
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Display mode
  const profile = user.farmProfile!;
  
  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <Card className="shadow-soft">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Sprout className="h-6 w-6 text-primary" />
              Farm Profile
            </CardTitle>
            <Button 
              variant="outline" 
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
              <Sprout className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Farm Size</p>
                <p className="text-lg font-semibold">{profile.farmSize} acres</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
              <Calendar className="h-8 w-8 text-success" />
              <div>
                <p className="text-sm text-muted-foreground">Experience</p>
                <p className="text-lg font-semibold">{profile.farmingExperience} years</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
              <Droplets className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Irrigation</p>
                <p className="text-lg font-semibold">{profile.irrigationType}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
              <DollarSign className="h-8 w-8 text-warning" />
              <div>
                <p className="text-sm text-muted-foreground">Budget</p>
                <p className="text-lg font-semibold">₹{profile.budget.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Location</h3>
              <div className="space-y-2">
                <p><span className="font-medium">State:</span> {profile.location.state}</p>
                <p><span className="font-medium">District:</span> {profile.location.district}</p>
                <p><span className="font-medium">Soil Type:</span> {profile.soilType}</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Crop Types</h3>
              <div className="flex flex-wrap gap-2">
                {profile.cropType.map((crop) => (
                  <Badge key={crop} variant="secondary">{crop}</Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Fertilizer Usage</h3>
            <div className="flex flex-wrap gap-2">
              {profile.fertilizers.map((fertilizer) => (
                <Badge 
                  key={fertilizer} 
                  variant={fertilizer.includes('Organic') || fertilizer.includes('Bio') ? 'default' : 'outline'}
                  className={fertilizer.includes('Organic') || fertilizer.includes('Bio') ? 'bg-gradient-quest' : ''}
                >
                  {fertilizer}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FarmProfile;