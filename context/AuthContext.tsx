import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole, Itinerary } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  savedItineraries: Itinerary[];
  login: (email: string) => Promise<void>;
  logout: () => void;
  saveItinerary: (itinerary: Itinerary) => void;
  deleteItinerary: (id: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [savedItineraries, setSavedItineraries] = useState<Itinerary[]>([]);

  // Simulating session persistence
  useEffect(() => {
    const storedUser = localStorage.getItem('viajaia_user');
    const storedItineraries = localStorage.getItem('viajaia_itineraries');
    
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    if (storedItineraries) {
      setSavedItineraries(JSON.parse(storedItineraries));
    }
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem('viajaia_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('viajaia_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('viajaia_itineraries', JSON.stringify(savedItineraries));
  }, [savedItineraries]);

  const login = async (email: string) => {
    // Mock login logic
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const mockUser: User = {
          id: 'user-123',
          name: email.split('@')[0],
          email: email,
          role: UserRole.USER,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
        };
        setUser(mockUser);
        resolve();
      }, 800);
    });
  };

  const logout = () => {
    setUser(null);
  };

  const saveItinerary = (itinerary: Itinerary) => {
    setSavedItineraries(prev => [itinerary, ...prev]);
  };

  const deleteItinerary = (id: string) => {
    setSavedItineraries(prev => prev.filter(item => item.id !== id));
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      savedItineraries: user ? savedItineraries.filter(i => i.userId === user.id) : [],
      login,
      logout,
      saveItinerary,
      deleteItinerary
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};