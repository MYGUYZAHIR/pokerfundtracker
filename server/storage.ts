import { type Profile, type InsertProfile, type UpdateProfile, type UpdateProfileName } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<any | undefined>;
  getUserByUsername(username: string): Promise<any | undefined>;
  createUser(user: any): Promise<any>;
  getAllProfiles(): Promise<Profile[]>;
  getProfile(id: string): Promise<Profile | undefined>;
  createProfile(profile: InsertProfile): Promise<Profile>;
  updateProfileFunds(id: string, funds: number): Promise<Profile | undefined>;
  updateProfileName(id: string, name: string): Promise<Profile | undefined>;
  deleteProfile(id: string): Promise<boolean>;
  getBankProfile(): Promise<Profile | undefined>;
  transferFunds(fromId: string, toId: string, amount: number): Promise<{ from: Profile; to: Profile } | undefined>;
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
    // First create the bank profile
    const bankId = randomUUID();
    const bankProfile: Profile = {
      id: bankId,
      name: "Main Bank",
      level: 100,
      funds: 750000, // Total available funds
      avatarUrl: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200",
      lastUpdated: new Date().toISOString(),
      isBank: "true"
    };
    this.profiles.set(bankId, bankProfile);

    const initialProfiles: Omit<Profile, 'id' | 'lastUpdated'>[] = [
      { name: "Alex Hunter", level: 47, funds: 15750, avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200", isBank: "false" },
      { name: "Nova Storm", level: 52, funds: 23400, avatarUrl: "https://images.unsplash.com/photo-1494790108755-2616c727e29b?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200", isBank: "false" },
      { name: "Tech Wizard", level: 38, funds: 8900, avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200", isBank: "false" },
      { name: "Luna Phoenix", level: 44, funds: 19250, avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200", isBank: "false" },
      { name: "Iron Bear", level: 61, funds: 31800, avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200", isBank: "false" },
      { name: "Golden Arrow", level: 49, funds: 16650, avatarUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200", isBank: "false" },
      { name: "Shadow Blade", level: 55, funds: 27300, avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200", isBank: "false" },
      { name: "Fire Rose", level: 42, funds: 12750, avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200", isBank: "false" },
      { name: "Storm Walker", level: 36, funds: 7450, avatarUrl: "https://images.unsplash.com/photo-1566492031773-4f4e44671d66?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200", isBank: "false" },
      { name: "Cyber Queen", level: 58, funds: 29900, avatarUrl: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200", isBank: "false" },
      { name: "Neon Strike", level: 45, funds: 18500, avatarUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200", isBank: "false" },
      { name: "Mystic Dawn", level: 63, funds: 35200, avatarUrl: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200", isBank: "false" }
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
      funds: insertProfile.funds ?? 0,
      isBank: "false", // New profiles are always players, not banks
      id,
      lastUpdated: new Date().toISOString()
    };
    this.profiles.set(id, profile);
    return profile;
  }

  async updateProfileFunds(id: string, funds: number): Promise<Profile | undefined> {
    const profile = this.profiles.get(id);
    if (!profile || profile.isBank === "true") {
      return undefined;
    }

    // Get bank profile
    const bank = Array.from(this.profiles.values()).find(p => p.isBank === "true");
    if (!bank) {
      return undefined;
    }

    const currentFunds = profile.funds;
    const difference = funds - currentFunds;
    
    // Check if bank has enough funds for increase, or if decrease is valid
    if (difference > 0 && bank.funds < difference) {
      throw new Error("Insufficient bank funds");
    }
    if (difference < 0 && profile.funds < Math.abs(difference)) {
      throw new Error("Insufficient player funds");
    }

    // Update both profiles
    const updatedProfile: Profile = {
      ...profile,
      funds,
      lastUpdated: new Date().toISOString()
    };

    const updatedBank: Profile = {
      ...bank,
      funds: bank.funds - difference,
      lastUpdated: new Date().toISOString()
    };

    this.profiles.set(id, updatedProfile);
    this.profiles.set(bank.id, updatedBank);
    return updatedProfile;
  }

  async updateProfileName(id: string, name: string): Promise<Profile | undefined> {
    const profile = this.profiles.get(id);
    if (!profile) {
      return undefined;
    }

    const updatedProfile: Profile = {
      ...profile,
      name,
      lastUpdated: new Date().toISOString()
    };

    this.profiles.set(id, updatedProfile);
    return updatedProfile;
  }

  async deleteProfile(id: string): Promise<boolean> {
    const profile = this.profiles.get(id);
    if (!profile || profile.isBank === "true") {
      return false; // Cannot delete bank or non-existent profile
    }

    // Return funds to bank
    if (profile.funds > 0) {
      const bank = Array.from(this.profiles.values()).find(p => p.isBank === "true");
      if (bank) {
        const updatedBank: Profile = {
          ...bank,
          funds: bank.funds + profile.funds,
          lastUpdated: new Date().toISOString()
        };
        this.profiles.set(bank.id, updatedBank);
      }
    }

    return this.profiles.delete(id);
  }

  async getBankProfile(): Promise<Profile | undefined> {
    return Array.from(this.profiles.values()).find(p => p.isBank === "true");
  }

  async transferFunds(fromId: string, toId: string, amount: number): Promise<{ from: Profile; to: Profile } | undefined> {
    const fromProfile = this.profiles.get(fromId);
    const toProfile = this.profiles.get(toId);

    if (!fromProfile || !toProfile || amount <= 0) {
      return undefined;
    }

    if (fromProfile.funds < amount) {
      throw new Error("Insufficient funds");
    }

    const updatedFromProfile: Profile = {
      ...fromProfile,
      funds: fromProfile.funds - amount,
      lastUpdated: new Date().toISOString()
    };

    const updatedToProfile: Profile = {
      ...toProfile,
      funds: toProfile.funds + amount,
      lastUpdated: new Date().toISOString()
    };

    this.profiles.set(fromId, updatedFromProfile);
    this.profiles.set(toId, updatedToProfile);

    return { from: updatedFromProfile, to: updatedToProfile };
  }
}

export const storage = new MemStorage();
