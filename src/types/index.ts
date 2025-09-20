export type UserRole = 'farmer' | 'aeo' | 'ngo' | 'admin' | 'student';
export type Language = 'en' | 'hi' | 'ml';
export type QuestStatus = 'active' | 'completed' | 'pending_approval' | 'approved' | 'rejected';
export type SubmissionStatus = 'pending' | 'approved' | 'rejected';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  location: string;
  sustainabilityScore: number;
  level: string;
  badges: Badge[];
  completedQuests: number;
  activeQuests: number;
  joinedDate: string;
  farmProfile?: FarmProfile;
}

export interface FarmProfile {
  farmSize: number;
  cropType: string[];
  fertilizers: string[];
  irrigationType: string;
  budget: number;
  location: {
    state: string;
    district: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  soilType: string;
  farmingExperience: number;
}

export interface Quest {
  id: string;
  title: {
    en: string;
    hi: string;
    ml: string;
  };
  description: {
    en: string;
    hi: string;
    ml: string;
  };
  points: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  requirements: string[];
  deadline: string;
  status: QuestStatus;
  progress?: number;
  createdBy: string;
  createdAt: string;
  cropTypes?: string[];
  farmSizeRange?: {
    min: number;
    max: number;
  };
}

export interface Submission {
  id: string;
  questId: string;
  userId: string;
  photos: string[];
  location: {
    lat: number;
    lng: number;
  };
  description: string;
  submittedAt: string;
  status: SubmissionStatus;
  reviewedBy?: string;
  reviewedAt?: string;
  reviewComments?: string;
  pointsAwarded?: number;
}

export interface Badge {
  id: string;
  name: {
    en: string;
    hi: string;
    ml: string;
  };
  description: {
    en: string;
    hi: string;
    ml: string;
  };
  icon: string;
  earnedAt: string;
  category: string;
}

export interface LeaderboardEntry {
  userId: string;
  name: string;
  location: string;
  score: number;
  rank: number;
  badge: string;
  completedQuests: number;
}