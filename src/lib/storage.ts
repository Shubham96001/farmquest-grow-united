import { User, Quest, Submission, Badge, UserRole, Language } from '@/types';

// Storage keys
const STORAGE_KEYS = {
  CURRENT_USER: 'current_user',
  USERS: 'users',
  QUESTS: 'quests',
  SUBMISSIONS: 'submissions',
  LANGUAGE: 'selected_language',
  BADGES: 'badges'
};

// Generic storage utilities
export const storage = {
  get: <T>(key: string): T | null => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },

  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Storage error:', error);
    }
  },

  remove: (key: string): void => {
    localStorage.removeItem(key);
  },

  clear: (): void => {
    localStorage.clear();
  }
};

// User management
export const userStorage = {
  getCurrentUser: (): User | null => {
    return storage.get<User>(STORAGE_KEYS.CURRENT_USER);
  },

  setCurrentUser: (user: User): void => {
    storage.set(STORAGE_KEYS.CURRENT_USER, user);
    
    // Also update in users list
    const users = userStorage.getAllUsers();
    const userIndex = users.findIndex(u => u.id === user.id);
    if (userIndex >= 0) {
      users[userIndex] = user;
      storage.set(STORAGE_KEYS.USERS, users);
    }
  },

  getAllUsers: (): User[] => {
    return storage.get<User[]>(STORAGE_KEYS.USERS) || [];
  },

  addUser: (user: User): void => {
    const users = userStorage.getAllUsers();
    users.push(user);
    storage.set(STORAGE_KEYS.USERS, users);
  },

  updateUser: (userId: string, updates: Partial<User>): void => {
    const users = userStorage.getAllUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex >= 0) {
      users[userIndex] = { ...users[userIndex], ...updates };
      storage.set(STORAGE_KEYS.USERS, users);
      
      // Update current user if it's the same
      const currentUser = userStorage.getCurrentUser();
      if (currentUser?.id === userId) {
        userStorage.setCurrentUser(users[userIndex]);
      }
    }
  },

  logout: (): void => {
    storage.remove(STORAGE_KEYS.CURRENT_USER);
  }
};

// Quest management
export const questStorage = {
  getAllQuests: (): Quest[] => {
    return storage.get<Quest[]>(STORAGE_KEYS.QUESTS) || [];
  },

  addQuest: (quest: Quest): void => {
    const quests = questStorage.getAllQuests();
    quests.push(quest);
    storage.set(STORAGE_KEYS.QUESTS, quests);
  },

  updateQuest: (questId: string, updates: Partial<Quest>): void => {
    const quests = questStorage.getAllQuests();
    const questIndex = quests.findIndex(q => q.id === questId);
    if (questIndex >= 0) {
      quests[questIndex] = { ...quests[questIndex], ...updates };
      storage.set(STORAGE_KEYS.QUESTS, quests);
    }
  },

  deleteQuest: (questId: string): void => {
    const quests = questStorage.getAllQuests().filter(q => q.id !== questId);
    storage.set(STORAGE_KEYS.QUESTS, quests);
  }
};

// Submission management
export const submissionStorage = {
  getAllSubmissions: (): Submission[] => {
    return storage.get<Submission[]>(STORAGE_KEYS.SUBMISSIONS) || [];
  },

  addSubmission: (submission: Submission): void => {
    const submissions = submissionStorage.getAllSubmissions();
    submissions.push(submission);
    storage.set(STORAGE_KEYS.SUBMISSIONS, submissions);
  },

  updateSubmission: (submissionId: string, updates: Partial<Submission>): void => {
    const submissions = submissionStorage.getAllSubmissions();
    const submissionIndex = submissions.findIndex(s => s.id === submissionId);
    if (submissionIndex >= 0) {
      submissions[submissionIndex] = { ...submissions[submissionIndex], ...updates };
      storage.set(STORAGE_KEYS.SUBMISSIONS, submissions);
    }
  }
};

// Language settings
export const languageStorage = {
  getLanguage: (): Language => {
    return storage.get<Language>(STORAGE_KEYS.LANGUAGE) || 'en';
  },

  setLanguage: (language: Language): void => {
    storage.set(STORAGE_KEYS.LANGUAGE, language);
  }
};

// Initialize default data if not exists
export const initializeDefaultData = (): void => {
  if (!storage.get(STORAGE_KEYS.USERS)) {
    // Create default users for demo
    const defaultUsers: User[] = [
      {
        id: 'user-1',
        name: 'राज पटेल',
        email: 'raj@example.com',
        role: 'farmer',
        location: 'Kerala, India',
        sustainabilityScore: 785,
        level: 'Eco Warrior',
        badges: [],
        completedQuests: 28,
        activeQuests: 3,
        joinedDate: '2024-01-15'
      },
      {
        id: 'user-2',
        name: 'Dr. प्रिया शर्मा',
        email: 'priya@example.com',
        role: 'aeo',
        location: 'Kerala, India',
        sustainabilityScore: 0,
        level: 'Extension Officer',
        badges: [],
        completedQuests: 0,
        activeQuests: 0,
        joinedDate: '2024-01-10'
      }
    ];
    storage.set(STORAGE_KEYS.USERS, defaultUsers);
  }

  if (!storage.get(STORAGE_KEYS.QUESTS)) {
    // Create default quests
    const defaultQuests: Quest[] = [
      {
        id: 'quest-1',
        title: {
          en: 'Apply Organic Compost',
          hi: 'जैविक खाद का प्रयोग करें',
          ml: 'ജൈവവളം പ്രയോഗിക്കുക'
        },
        description: {
          en: 'Apply homemade compost to your vegetable plot',
          hi: 'अपने सब्जी के खेत में घर का बना खाद डालें',
          ml: 'നിങ്ങളുടെ പച്ചക്കറി പ്ലോട്ടിൽ വീട്ടിൽ ഉണ്ടാക്കിയ കമ്പോസ്റ്റ് പ്രയോഗിക്കുക'
        },
        points: 150,
        difficulty: 'Easy',
        category: 'Soil Health',
        requirements: ['Take photos of compost application', 'Record location'],
        deadline: '2024-12-31',
        status: 'active',
        createdBy: 'admin',
        createdAt: '2024-09-01'
      },
      {
        id: 'quest-2',
        title: {
          en: 'Water Conservation Practice',
          hi: 'जल संरक्षण अभ्यास',
          ml: 'ജലസംരക്ഷണ പരിശീലനം'
        },
        description: {
          en: 'Implement drip irrigation system',
          hi: 'ड्रिप सिंचाई प्रणाली लागू करें',
          ml: 'ഡ്രിപ്പ് ഇറിഗേഷൻ സിസ്റ്റം നടപ്പിലാക്കുക'
        },
        points: 300,
        difficulty: 'Medium',
        category: 'Water Management',
        requirements: ['Install drip irrigation', 'Document water savings'],
        deadline: '2024-11-30',
        status: 'active',
        createdBy: 'admin',
        createdAt: '2024-09-01'
      }
    ];
    storage.set(STORAGE_KEYS.QUESTS, defaultQuests);
  }

  if (!storage.get(STORAGE_KEYS.SUBMISSIONS)) {
    storage.set(STORAGE_KEYS.SUBMISSIONS, []);
  }
};