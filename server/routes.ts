import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { updateProfileSchema, updateProfileNameSchema, insertProfileSchema, transferFundsSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all profiles
  app.get("/api/profiles", async (req, res) => {
    try {
      const profiles = await storage.getAllProfiles();
      res.json(profiles);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch profiles" });
    }
  });

  // Get single profile
  app.get("/api/profiles/:id", async (req, res) => {
    try {
      const profile = await storage.getProfile(req.params.id);
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }
      res.json(profile);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch profile" });
    }
  });

  // Create new profile
  app.post("/api/profiles", async (req, res) => {
    try {
      const validation = insertProfileSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ 
          message: "Invalid profile data",
          errors: validation.error.flatten()
        });
      }

      const profile = await storage.createProfile(validation.data);
      res.status(201).json(profile);
    } catch (error) {
      res.status(500).json({ message: "Failed to create profile" });
    }
  });

  // Update profile funds
  app.patch("/api/profiles/:id/funds", async (req, res) => {
    try {
      const validation = updateProfileSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ 
          message: "Invalid funds amount",
          errors: validation.error.flatten()
        });
      }

      const { funds } = validation.data;
      const profile = await storage.updateProfileFunds(req.params.id, funds);
      
      if (!profile) {
        return res.status(404).json({ message: "Profile not found or is bank profile" });
      }

      res.json(profile);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to update profile funds";
      res.status(400).json({ message });
    }
  });

  // Update profile name
  app.patch("/api/profiles/:id/name", async (req, res) => {
    try {
      const validation = updateProfileNameSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ 
          message: "Invalid name",
          errors: validation.error.flatten()
        });
      }

      const { name } = validation.data;
      const profile = await storage.updateProfileName(req.params.id, name);
      
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }

      res.json(profile);
    } catch (error) {
      res.status(500).json({ message: "Failed to update profile name" });
    }
  });

  // Delete profile
  app.delete("/api/profiles/:id", async (req, res) => {
    try {
      const success = await storage.deleteProfile(req.params.id);
      
      if (!success) {
        return res.status(404).json({ message: "Profile not found or cannot delete bank" });
      }

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete profile" });
    }
  });

  // Get bank profile
  app.get("/api/bank", async (req, res) => {
    try {
      const bank = await storage.getBankProfile();
      if (!bank) {
        return res.status(404).json({ message: "Bank not found" });
      }
      res.json(bank);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch bank" });
    }
  });

  // Transfer funds
  app.post("/api/transfer", async (req, res) => {
    try {
      const validation = transferFundsSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ 
          message: "Invalid transfer data",
          errors: validation.error.flatten()
        });
      }

      const { fromId, toId, amount } = validation.data;
      const result = await storage.transferFunds(fromId, toId, amount);
      
      if (!result) {
        return res.status(404).json({ message: "Profile not found" });
      }

      res.json(result);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to transfer funds";
      res.status(400).json({ message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
