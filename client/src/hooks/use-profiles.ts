import { useState, useEffect } from 'react';
import type { Profile, InsertProfile } from '@shared/schema';

// Simple UUID generator for browser
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

const STORAGE_KEY = 'game-profiles';

interface ProfilesData {
  profiles: Profile[];
  bank: Profile;
}

// Default initial data
const getDefaultData = (): ProfilesData => {
  const bankId = generateUUID();
  const bank: Profile = {
    id: bankId,
    name: "Main Bank",
    level: 100,
    funds: 7100,
    avatarUrl: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200",
    lastUpdated: new Date().toISOString(),
    isBank: "true"
  };

  const profiles: Profile[] = [
    { id: generateUUID(), name: "Alex Hunter", level: 47, funds: 0, avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200", isBank: "false", lastUpdated: new Date().toISOString() },
    { id: generateUUID(), name: "Nova Storm", level: 52, funds: 0, avatarUrl: "https://images.unsplash.com/photo-1494790108755-2616c727e29b?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200", isBank: "false", lastUpdated: new Date().toISOString() },
    { id: generateUUID(), name: "Tech Wizard", level: 38, funds: 0, avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200", isBank: "false", lastUpdated: new Date().toISOString() },
    { id: generateUUID(), name: "Luna Phoenix", level: 44, funds: 0, avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200", isBank: "false", lastUpdated: new Date().toISOString() },
    { id: generateUUID(), name: "Iron Bear", level: 61, funds: 0, avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200", isBank: "false", lastUpdated: new Date().toISOString() },
    { id: generateUUID(), name: "Golden Arrow", level: 49, funds: 0, avatarUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200", isBank: "false", lastUpdated: new Date().toISOString() },
    { id: generateUUID(), name: "Shadow Blade", level: 55, funds: 0, avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200", isBank: "false", lastUpdated: new Date().toISOString() },
    { id: generateUUID(), name: "Fire Rose", level: 42, funds: 0, avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200", isBank: "false", lastUpdated: new Date().toISOString() },
    { id: generateUUID(), name: "Storm Walker", level: 36, funds: 0, avatarUrl: "https://images.unsplash.com/photo-1566492031773-4f4e44671d66?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200", isBank: "false", lastUpdated: new Date().toISOString() },
    { id: generateUUID(), name: "Cyber Queen", level: 58, funds: 0, avatarUrl: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200", isBank: "false", lastUpdated: new Date().toISOString() },
    { id: generateUUID(), name: "Neon Strike", level: 45, funds: 0, avatarUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200", isBank: "false", lastUpdated: new Date().toISOString() },
    { id: generateUUID(), name: "Mystic Dawn", level: 63, funds: 0, avatarUrl: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200", isBank: "false", lastUpdated: new Date().toISOString() }
  ];

  return { profiles, bank };
};

export function useProfiles() {
  const [data, setData] = useState<ProfilesData>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return getDefaultData();
      }
    }
    return getDefaultData();
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const updateProfile = (updatedProfile: Profile) => {
    setData(prev => ({
      ...prev,
      profiles: prev.profiles.map(p => 
        p.id === updatedProfile.id ? updatedProfile : p
      ),
      bank: prev.bank.id === updatedProfile.id ? updatedProfile : prev.bank
    }));
  };

  const updateFunds = async (id: string, funds: number): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const profile = data.profiles.find(p => p.id === id);
      if (!profile) {
        throw new Error('Profile not found');
      }

      const currentFunds = profile.funds;
      const difference = funds - currentFunds;
      
      // Check if bank has enough funds for increase
      if (difference > 0 && data.bank.funds < difference) {
        throw new Error('Insufficient bank funds');
      }
      if (difference < 0 && profile.funds < Math.abs(difference)) {
        throw new Error('Insufficient player funds');
      }

      const updatedProfile: Profile = {
        ...profile,
        funds,
        lastUpdated: new Date().toISOString()
      };

      const updatedBank: Profile = {
        ...data.bank,
        funds: data.bank.funds - difference,
        lastUpdated: new Date().toISOString()
      };

      setData(prev => ({
        profiles: prev.profiles.map(p => 
          p.id === id ? updatedProfile : p
        ),
        bank: updatedBank
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update funds');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateName = async (id: string, name: string): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const profile = data.profiles.find(p => p.id === id);
      if (!profile) {
        throw new Error('Profile not found');
      }

      const updatedProfile: Profile = {
        ...profile,
        name: name.trim(),
        lastUpdated: new Date().toISOString()
      };

      updateProfile(updatedProfile);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update name');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const createProfile = async (profileData: InsertProfile): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      // Check if bank has enough funds
      if (data.bank.funds < (profileData.funds || 0)) {
        throw new Error('Insufficient bank funds');
      }

      const newProfile: Profile = {
        id: generateUUID(),
        ...profileData,
        funds: profileData.funds || 0,
        isBank: "false",
        lastUpdated: new Date().toISOString()
      };

      const updatedBank: Profile = {
        ...data.bank,
        funds: data.bank.funds - (profileData.funds || 0),
        lastUpdated: new Date().toISOString()
      };

      setData(prev => ({
        profiles: [...prev.profiles, newProfile],
        bank: updatedBank
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create profile');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteProfile = async (id: string): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const profile = data.profiles.find(p => p.id === id);
      if (!profile) {
        throw new Error('Profile not found');
      }

      // Return funds to bank
      const updatedBank: Profile = {
        ...data.bank,
        funds: data.bank.funds + profile.funds,
        lastUpdated: new Date().toISOString()
      };

      setData(prev => ({
        profiles: prev.profiles.filter(p => p.id !== id),
        bank: updatedBank
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete profile');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    profiles: data.profiles,
    bank: data.bank,
    isLoading,
    error,
    updateFunds,
    updateName,
    createProfile,
    deleteProfile
  };
}