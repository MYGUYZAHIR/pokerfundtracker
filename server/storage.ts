import { type Profile, type InsertProfile, type UpdateProfile } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<any | undefined>;
  getUserByUsername(username: string): Promise<any | undefined>;
  createUser(user: any): Promise<any>;
  getAllProfiles(): Promise<Profile[]>;
  getProfile(id: string): Promise<Profile | undefined>;
  createProfile(profile: InsertProfile): Promise<Profile>;
  updateProfileFunds(id: string, funds: number): Promise<Profile | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, any>;
  private profiles: Map<string, Profile>;

  constructor() {
    this.users = new Map();
    this.profiles = new Map();
    this.initializeProfiles();
  }

  private initializeProfiles() {
    const initialProfiles: Omit<Profile, 'id' | 'lastUpdated'>[] = [
      { name: "Alex Hunter", level: 47, funds: 15750, avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200" },
      { name: "Nova Storm", level: 52, funds: 23400, avatarUrl: "https://images.unsplash.com/photo-1494790108755-2616c727e29b?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200" },
      { name: "Tech Wizard", level: 38, funds: 8900, avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200" },
      { name: "Luna Phoenix", level: 44, funds: 19250, avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200" },
      { name: "Iron Bear", level: 61, funds: 31800, avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200" },
      { name: "Golden Arrow", level: 49, funds: 16650, avatarUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200" },
      { name: "Shadow Blade", level: 55, funds: 27300, avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200" },
      { name: "Fire Rose", level: 42, funds: 12750, avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200" },
      { name: "Storm Walker", level: 36, funds: 7450, avatarUrl: "https://images.unsplash.com/photo-1566492031773-4f4e44671d66?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200" },
      { name: "Cyber Queen", level: 58, funds: 29900, avatarUrl: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200" },
      { name: "Neon Strike", level: 45, funds: 18500, avatarUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200" },
      { name: "Mystic Dawn", level: 63, funds: 35200, avatarUrl: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200" }
    ];

    initialProfiles.forEach(profileData => {
      const id = randomUUID();
      const profile: Profile = {
        ...profileData,
        id,
        lastUpdated: new Date().toISOString()
      };
      this.profiles.set(id, profile);
    });
  }

  async getUser(id: string): Promise<any | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<any | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: any): Promise<any> {
    const id = randomUUID();
    const user: any = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getAllProfiles(): Promise<Profile[]> {
    return Array.from(this.profiles.values());
  }

  async getProfile(id: string): Promise<Profile | undefined> {
    return this.profiles.get(id);
  }

  async createProfile(insertProfile: InsertProfile): Promise<Profile> {
    const id = randomUUID();
    const profile: Profile = {
      ...insertProfile,
      id,
      lastUpdated: new Date().toISOString()
    };
    this.profiles.set(id, profile);
    return profile;
  }

  async updateProfileFunds(id: string, funds: number): Promise<Profile | undefined> {
    const profile = this.profiles.get(id);
    if (!profile) {
      return undefined;
    }

    const updatedProfile: Profile = {
      ...profile,
      funds,
      lastUpdated: new Date().toISOString()
    };

    this.profiles.set(id, updatedProfile);
    return updatedProfile;
  }
}

export const storage = new MemStorage();
