export enum UserRole {
  GUEST = 'GUEST',
  USER = 'USER'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface TravelPreferences {
  destination: string;
  duration: number; // in days
  budgetLevel: 'economic' | 'moderate' | 'luxury';
  travelers: 'solo' | 'couple' | 'family' | 'friends';
  interests: string[];
}

export interface Activity {
  time: string;
  title: string;
  description: string;
  location: string;
  costEstimate: string;
  type: 'sightseeing' | 'food' | 'activity' | 'relax';
}

export interface DayPlan {
  dayNumber: number;
  theme: string;
  activities: Activity[];
}

export interface Itinerary {
  id: string;
  userId: string;
  destination: string;
  createdAt: string;
  totalBudgetEstimate: string;
  days: DayPlan[];
  imageUrl?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}