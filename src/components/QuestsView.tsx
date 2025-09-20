import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { User, Quest, Submission, Language } from '@/types';
import { questStorage, submissionStorage, languageStorage } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';
import { 
  Camera, 
  MapPin, 
  Clock, 
  Target, 
  CheckCircle, 
  Star,
  Upload,
  Send
} from 'lucide-react';

interface QuestsViewProps {
  user: User;
  onUserUpdate: (user: User) => void;
}

const QuestsView: React.FC<QuestsViewProps> = ({ user, onUserUpdate }) => {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
  const [language, setLanguage] = useState<Language>('en');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionForm, setSubmissionForm] = useState({
    description: '',
    photos: [] as string[],
    location: { lat: 0, lng: 0 }
  });
  const { toast } = useToast();

  useEffect(() => {
    const allQuests = questStorage.getAllQuests();
    const userSubmissions = submissionStorage.getAllSubmissions().filter(s => s.userId === user.id);
    
    setQuests(allQuests.filter(q => q.status === 'active'));
    setSubmissions(userSubmissions);
    
    const savedLanguage = languageStorage.getLanguage();
    setLanguage(savedLanguage);
  }, [user.id]);

  const getQuestTitle = (quest: Quest) => {
    return quest.title[language] || quest.title.en;
  };

  const getQuestDescription = (quest: Quest) => {
    return quest.description[language] || quest.description.en;
  };

  const getQuestStatus = (questId: string) => {
    const submission = submissions.find(s => s.questId === questId);
    if (!submission) return 'not_started';
    return submission.status;
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      // In a real app, you'd upload to a server
      // For demo, we'll create mock URLs
      const mockUrls = Array.from(files).map(file => URL.createObjectURL(file));
      setSubmissionForm(prev => ({
        ...prev,
        photos: [...prev.photos, ...mockUrls]
      }));
    }
  };

  const handleLocationCapture = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setSubmissionForm(prev => ({
            ...prev,
            location: {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            }
          }));
          toast({
            title: "Location Captured",
            description: "GPS coordinates have been recorded"
          });
        },
        (error) => {
          // Fallback to mock location for demo
          setSubmissionForm(prev => ({
            ...prev,
            location: {
              lat: 10.8505 + Math.random() * 0.1, // Kerala coordinates with some variation
              lng: 76.2711 + Math.random() * 0.1
            }
          }));
          toast({
            title: "Location Set",
            description: "Using approximate location for demo"
          });
        }
      );
    } else {
      toast({
        title: "Geolocation not supported",
        description: "Using default location",
        variant: "destructive"
      });
    }
  };

  const handleSubmitQuest = () => {
    if (!selectedQuest) return;
    
    if (!submissionForm.description.trim()) {
      toast({
        title: "Error",
        description: "Please add a description of your work",
        variant: "destructive"
      });
      return;
    }

    if (submissionForm.photos.length === 0) {
      toast({
        title: "Error", 
        description: "Please upload at least one photo",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const newSubmission: Submission = {
        id: `submission-${Date.now()}`,
        questId: selectedQuest.id,
        userId: user.id,
        photos: submissionForm.photos,
        location: submissionForm.location,
        description: submissionForm.description,
        submittedAt: new Date().toISOString(),
        status: 'pending'
      };

      submissionStorage.addSubmission(newSubmission);
      setSubmissions(prev => [...prev, newSubmission]);
      
      // Reset form
      setSubmissionForm({
        description: '',
        photos: [],
        location: { lat: 0, lng: 0 }
      });
      setSelectedQuest(null);
      setIsSubmitting(false);

      toast({
        title: "Quest Submitted!",
        description: "Your submission is now pending review by an AEO"
      });
    }, 2000);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="bg-warning/20 text-warning-foreground">Pending Review</Badge>;
      case 'approved':
        return <Badge variant="default" className="bg-success text-success-foreground">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">Not Started</Badge>;
    }
  };

  const getProgressPercentage = (questId: string) => {
    const submission = submissions.find(s => s.questId === questId);
    if (!submission) return 0;
    if (submission.status === 'approved') return 100;
    if (submission.status === 'pending') return 75;
    return 25;
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold">My Quests</h1>
        <p className="text-muted-foreground">Complete sustainable farming challenges to earn points and badges</p>
      </div>

      {/* Quest Categories Filter */}
      <div className="flex flex-wrap gap-2 justify-center">
        <Button variant="default" size="sm">All Quests</Button>
        <Button variant="outline" size="sm">Soil Health</Button>
        <Button variant="outline" size="sm">Water Management</Button>
        <Button variant="outline" size="sm">Organic Farming</Button>
        <Button variant="outline" size="sm">Pest Control</Button>
      </div>

      {/* Quests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quests.map((quest) => {
          const status = getQuestStatus(quest.id);
          const progress = getProgressPercentage(quest.id);
          
          return (
            <Card 
              key={quest.id} 
              className={`shadow-quest transition-all duration-300 hover:shadow-achievement ${
                status === 'approved' ? 'border-success' : ''
              }`}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="text-lg">{getQuestTitle(quest)}</CardTitle>
                    <CardDescription className="text-sm">
                      {getQuestDescription(quest)}
                    </CardDescription>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge variant="secondary" className="bg-gradient-quest">
                      {quest.points} pts
                    </Badge>
                    {getStatusBadge(status)}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{quest.category}</span>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-warning text-warning" />
                    <span className="text-muted-foreground">{quest.difficulty}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>

                {/* Requirements */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Requirements:</h4>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    {quest.requirements.map((req, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Button */}
                <div className="pt-2">
                  {status === 'not_started' && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          className="w-full bg-gradient-primary"
                          onClick={() => setSelectedQuest(quest)}
                        >
                          <Target className="h-4 w-4 mr-2" />
                          Start Quest
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>Submit Quest: {getQuestTitle(quest)}</DialogTitle>
                          <DialogDescription>
                            Upload photos and describe your sustainable farming activity
                          </DialogDescription>
                        </DialogHeader>
                        
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                              id="description"
                              placeholder="Describe what you did for this quest..."
                              value={submissionForm.description}
                              onChange={(e) => setSubmissionForm(prev => ({ ...prev, description: e.target.value }))}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Photos</Label>
                            <div className="flex items-center gap-2">
                              <Input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handlePhotoUpload}
                                className="hidden"
                                id="photo-upload"
                              />
                              <Label 
                                htmlFor="photo-upload"
                                className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                              >
                                <Camera className="h-4 w-4" />
                                Upload Photos
                              </Label>
                              <span className="text-sm text-muted-foreground">
                                {submissionForm.photos.length} photos selected
                              </span>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label>Location</Label>
                            <Button
                              type="button"
                              variant="outline"
                              className="w-full"
                              onClick={handleLocationCapture}
                            >
                              <MapPin className="h-4 w-4 mr-2" />
                              {submissionForm.location.lat !== 0 ? 'Location Captured' : 'Capture Location'}
                            </Button>
                          </div>

                          <Button 
                            onClick={handleSubmitQuest}
                            disabled={isSubmitting}
                            className="w-full bg-gradient-primary"
                          >
                            {isSubmitting ? (
                              <>
                                <Upload className="h-4 w-4 mr-2 animate-spin" />
                                Submitting...
                              </>
                            ) : (
                              <>
                                <Send className="h-4 w-4 mr-2" />
                                Submit Quest
                              </>
                            )}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                  
                  {status === 'pending' && (
                    <Button variant="outline" className="w-full" disabled>
                      <Clock className="h-4 w-4 mr-2" />
                      Pending Review
                    </Button>
                  )}
                  
                  {status === 'approved' && (
                    <Button variant="default" className="w-full bg-success" disabled>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Completed
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {quests.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Quests Available</h3>
            <p className="text-muted-foreground">
              New sustainable farming challenges will appear here when they become available.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default QuestsView;